import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { rootColor } from '../data/rootColors';
import { PhotoWord, RootJourney } from '../components/Journey';
import { CardStage, FamilyReading } from './FamilyView';
import { useCollection } from '../lib/collection';
import { loadCollection } from '../lib/storage';
import { lookup } from '../lib/match';
import { journeyMode, type JourneyMode } from '../lib/journey';
import { playRoot } from '../lib/sound';

const HINTS = ['transport', 'biology', 'describe', 'important', 'chronometer'] as const;

const DEMOS = [
  { id: 'port', word: 'transport', label: '码头上的货物' },
  { id: 'bio', word: 'biology', label: '活着的植物' },
  { id: 'chron', word: 'chronometer', label: '计时的仪器' },
] as const;

type Phase = 'photo' | 'journey' | 'card';

function reducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function wantsJourney(query: string) {
  if (!query || reducedMotion()) return false;
  const saved = sessionStorage.getItem('wra-play');
  if (saved === query.toLowerCase()) return true;
  const hash = window.location.hash.split('?')[1] ?? '';
  if (new URLSearchParams(hash).get('play') !== '1') return false;
  sessionStorage.setItem('wra-play', query.toLowerCase());
  return true;
}

function endJourneyFlag() {
  sessionStorage.removeItem('wra-play');
}

function plan(raw: string): { mode: JourneyMode; ceremony: 'A' | 'B' | null; hit: boolean } {
  const found = lookup(raw);
  if (found.kind === 'miss' || !raw.trim()) return { mode: 'brief', ceremony: null, hit: false };
  if (found.kind === 'root') return { mode: 'brief', ceremony: null, hit: true };
  const prior = loadCollection();
  const word = found.hit.word.toLowerCase();
  const hadWord = !!prior[word];
  const hadRoot = Object.values(prior).some((item) => item.rootId === found.hit.root.id);
  const mode = journeyMode(hadWord, hadRoot);
  return {
    mode,
    ceremony: mode === 'full' ? 'A' : mode === 'short' ? 'B' : null,
    hit: true,
  };
}

export function Discover() {
  const [params, setParams] = useSearchParams();
  const query = params.get('word') ?? '';
  const opening = plan(query);
  const bootRef = useRef<boolean | null>(null);
  if (bootRef.current == null) bootRef.current = opening.hit && wantsJourney(query);
  const autoplay = bootRef.current;
  const [draft, setDraft] = useState(query);
  const [phase, setPhase] = useState<Phase>(autoplay ? 'journey' : 'card');
  const [showCard, setShowCard] = useState(!autoplay && opening.hit);
  const [mode, setMode] = useState<JourneyMode>(autoplay ? opening.mode : 'brief');
  const [ceremony, setCeremony] = useState<'A' | 'B' | null>(autoplay ? opening.ceremony : null);
  const [viaJourney, setViaJourney] = useState(autoplay);
  const [run, setRun] = useState(0);
  const [tray, setTray] = useState(false);
  const [photo, setPhoto] = useState<{ src: string; word: string; own: boolean } | null>(null);
  const ownUrl = useRef<string | null>(null);
  const { collect } = useCollection();

  function releaseOwn() {
    if (ownUrl.current) {
      URL.revokeObjectURL(ownUrl.current);
      ownUrl.current = null;
    }
  }

  useEffect(() => () => releaseOwn(), []);

  useEffect(() => {
    if (params.get('play') !== '1') return;
    const next = new URLSearchParams(params);
    next.delete('play');
    setParams(next, { replace: true });
  }, [params, setParams]);

  useEffect(() => {
    setDraft(query);
  }, [query]);

  useEffect(() => {
    document.title = query ? `${query} · 词根图鉴` : '词根图鉴';
  }, [query]);

  useEffect(() => {
    const input = document.getElementById('word-search');
    if (input instanceof HTMLInputElement && !query && phase === 'card' && window.matchMedia('(pointer: fine)').matches) {
      input.focus();
    }
  }, [query, phase]);

  useEffect(() => {
    if (!query) return;
    const found = lookup(query);
    if (found.kind !== 'word') return;
    const word = found.hit.word;
    const rootId = found.hit.root.id;
    const prior = loadCollection();
    const hadWord = !!prior[word.toLowerCase()];
    const hadRoot = Object.values(prior).some((item) => item.rootId === rootId);
    if (hadWord) return;
    const kind = hadRoot ? 'B' : 'A';
    const stampKey = `wra-new:${word.toLowerCase()}`;
    const already = sessionStorage.getItem(stampKey);
    sessionStorage.setItem(stampKey, `${kind}:${Date.now()}`);
    collect(word, rootId);
    if (kind === 'A' && !already) playRoot(rootId);
  }, [query, collect]);

  const result = query ? lookup(query) : null;
  const shownRoot = result?.kind === 'word' ? result.hit.root : result?.kind === 'root' ? result.root : null;
  const lexeme = result?.kind === 'word' ? result.hit.lexeme : null;
  const photoHit = photo ? lookup(photo.word) : null;
  const toneRoot =
    phase === 'photo' && photoHit?.kind === 'word' ? photoHit.hit.root : shownRoot;
  const tone = toneRoot ? rootColor(toneRoot.id) : null;
  const colorStyle = tone
    ? ({ '--accent': tone.accent, '--deep': tone.deep, '--wash': tone.wash } as CSSProperties)
    : undefined;
  const busy = !!query || phase === 'photo' || phase === 'journey';
  const journeyWord = result?.kind === 'word' ? result.hit.word : shownRoot?.root ?? '';

  function submit(raw: string, opts?: { skipJourney?: boolean; fromPill?: boolean }) {
    const next = raw.trim();
    if (!next) return;
    endJourneyFlag();
    const found = lookup(next);
    if (opts?.fromPill && found.kind === 'word' && found.hit.word.toLowerCase() === query.trim().toLowerCase()) return;
    releaseOwn();
    setPhoto(null);
    setTray(false);
    if (found.kind === 'miss') {
      setDraft(next);
      setPhase('card');
      setShowCard(false);
      setViaJourney(false);
      setCeremony(null);
      setParams({ word: next });
      return;
    }
    const nextPlan = plan(next);
    const canonical = found.kind === 'word' ? found.hit.word : found.root.root;
    setDraft(found.kind === 'word' ? found.hit.word : next);
    setMode(nextPlan.mode);
    setCeremony(nextPlan.ceremony);
    setRun((n) => n + 1);
    if (opts?.skipJourney || reducedMotion()) {
      setPhase('card');
      setShowCard(true);
      setViaJourney(false);
    } else {
      setPhase('journey');
      setShowCard(false);
      setViaJourney(true);
    }
    setParams({ word: canonical });
  }

  function finishPhoto(skip: boolean) {
    if (!photo) return;
    const word = photo.word;
    releaseOwn();
    setPhoto(null);
    submit(word, { skipJourney: skip });
  }

  function startDemo(demo: (typeof DEMOS)[number]) {
    releaseOwn();
    setTray(false);
    setPhoto({
      src: `${import.meta.env.BASE_URL}illustrations/${demo.id}.webp`,
      word: demo.word,
      own: false,
    });
    setPhase('photo');
    setShowCard(false);
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    releaseOwn();
    const url = URL.createObjectURL(file);
    ownUrl.current = url;
    const word = HINTS[file.name.length % HINTS.length];
    setTray(false);
    setPhoto({ src: url, word, own: true });
    setPhase('photo');
    setShowCard(false);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    submit(draft);
  }

  const showSlot = phase === 'photo' || phase === 'journey' || (showCard && !!shownRoot);

  return (
    <div className="discover" style={colorStyle}>
      <form className={busy ? 'search compact' : 'search hero'} role="search" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="word-search">
          输入一个英文单词
        </label>
        <div className="search-line">
          <input
            id="word-search"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="输入一个英文单词"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="search"
          />
          <button
            type="button"
            className={tray ? 'shutter open' : 'shutter'}
            aria-expanded={tray}
            aria-controls="photo-tray"
            onClick={() => setTray((open) => !open)}
          >
            <CameraIcon />
            <span>拍一拍</span>
          </button>
        </div>
        {!busy && (
          <p className="hint-row">
            试试
            {HINTS.map((word) => (
              <button key={word} type="button" onClick={() => submit(word)}>
                {word}
              </button>
            ))}
          </p>
        )}
        {tray && (
          <div className="photo-tray" id="photo-tray">
            <p className="tray-note">演示。选一张，或从相册挑一张。还没有接上识图，会先看成一个现成的英文单词，再走词根之旅。</p>
            <div className="photo-demos">
              {DEMOS.map((demo) => (
                <button key={demo.id} type="button" onClick={() => startDemo(demo)}>
                  <img src={`${import.meta.env.BASE_URL}thumbs/${demo.id}.webp`} alt="" />
                  <span>{demo.label}</span>
                </button>
              ))}
            </div>
            <label className="photo-file">
              拍照或从相册选一张
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  onFile(file);
                }}
              />
            </label>
          </div>
        )}
      </form>

      <p className="sr-only" aria-live="polite">
        {phase === 'photo' ? '正在把照片看成一个英文单词' : phase === 'journey' ? `词根之旅，走向 ${shownRoot?.root ?? ''}` : ''}
      </p>

      {showSlot && (
        <div className="stage-slot">
          {showCard && shownRoot && <CardStage key={`card-${run}`} root={shownRoot} ceremony={ceremony} />}
          {phase === 'journey' && shownRoot && (
            <RootJourney
              key={`journey-${run}`}
              word={journeyWord}
              root={shownRoot}
              mode={mode}
              onReveal={() => setShowCard(true)}
              onDone={() => {
                endJourneyFlag();
                setPhase('card');
              }}
            />
          )}
          {phase === 'photo' && photo && (
            <PhotoWord
              key={photo.src}
              src={photo.src}
              word={photo.word}
              onDone={() => finishPhoto(false)}
              onSkip={() => finishPhoto(true)}
            />
          )}
        </div>
      )}

      {showCard && shownRoot && phase !== 'photo' && (
        <section className={ceremony === 'A' ? 'family intro-a' : ceremony === 'B' ? 'family intro-b' : 'family'}>
          <FamilyReading
            key={run}
            root={shownRoot}
            lexeme={lexeme}
            ceremony={ceremony}
            fromJourney={viaJourney}
            onPick={(word) => submit(word, { fromPill: true })}
          />
        </section>
      )}

      {phase === 'card' && result?.kind === 'miss' && (
        <Miss query={query} suggestions={result.suggestions} onPick={submit} />
      )}
    </div>
  );
}

function Miss({
  query,
  suggestions,
  onPick,
}: {
  query: string;
  suggestions: { word: string; lexeme: { gloss: string }; root: { root: string } }[];
  onPick: (word: string) => void;
}) {
  const near = suggestions.slice(0, 3);
  return (
    <section className="miss">
      <h1>这个词还没走进图鉴</h1>
      <p>{near.length > 0 ? `「${query}」先放一放。下面几个比较接近。` : `「${query}」先放一放。点一个例子，走一趟词根之旅。`}</p>
      <p className="hint-row">
        {(near.length > 0 ? near.map((s) => s.word) : [...HINTS]).map((word) => (
          <button key={word} type="button" onClick={() => onPick(word)}>
            {word}
          </button>
        ))}
      </p>
    </section>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M4 8.5h3l1.2-2h7.6L17 8.5h3v9.5H4V8.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
