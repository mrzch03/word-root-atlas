import raw from './catalog.json';
import type { Lexeme, Morpheme, Origin, RootEntry } from './types';

interface CatalogWord {
  word: string;
  zh: string;
  breakdown: string;
}

interface CatalogRoot {
  rank: number;
  id: string;
  root: string;
  forms: string[];
  language: string;
  sourceWord: string;
  meaning: { en: string; zh: string };
  originStory: string;
  derivedWords: CatalogWord[];
  example?: { en?: string; zh?: string };
  inCurrentApp?: boolean;
}

const catalog = (raw as { roots: CatalogRoot[] }).roots;

/** Second painted batch. The word list stays in the catalog; the picture replaces the cream plate. */
export const batchIllustrated = new Set([
  'pos',
  'fer',
  'ten',
  'fac',
  'ven',
  'sta',
  'ced',
  'press',
  'curr',
  'gress',
  'ag',
  'gen',
  'leg',
  'reg',
  'plic',
  'tend',
  'sequ',
  'clud',
  'cid',
  'cad',
  'fin',
  'flect',
  'junct',
  'loc',
  'loqu',
  'mand',
  'ment',
  'mem',
  'mon',
  'mort',
  'nat',
  'nom',
  'nov',
  'numer',
  'par',
  'part',
]);

const batchAlt: Record<string, string> = {
  pos: '镶嵌画匠跪在半成品地面上，把小石子一块块安放成一只海豚。',
  fer: '搬运工把一筐沉重的无花果扛在肩头。',
  ten: '罗马仓房里，箍着铁箍的陶罐装着粮食，保管人拿着一串钥匙。',
  fac: '铜匠铺里，铁匠在砧上打一把刀，墙上挂着做好的工具。',
  ven: '黄昏的路口客栈，旅人从几条路汇来，主人提着灯出来迎接。',
  sta: '城角的哨兵站在雕像旁边，对面是书贩固定的摊子。',
  ced: '一小队人穿过拱门，前面的人先走，一位长者侧身让路。',
  press: '一只手把印章往下按进一大团蜡里，蜡被压得鼓起来。',
  curr: '品红色的赛道铺满底座，战车绕过转弯柱，旌旗也是品红。',
  gress: '神庙的宽台阶上，一个孩子一级级往上走，老人已经站在顶端。',
  ag: '牧人用曲杖赶着羊群，旁边露天舞台上有一个正在做手势的演员。',
  gen: '中庭里，摇篮中的婴儿上方是祖先的架子和一幅家族树壁画。',
  leg: '橄榄树下，一个人把落果收进篮子，另一个在布上分拣，第三个人在荫凉里读卷轴。',
  reg: '测量员在木桩之间拉直一根绳，画出新城的格子，戴冠的人在高台上看着。',
  plic: '染坊院子里，一个人把长布折成整齐的层，旁边有编好的绳子和一只苇篮。',
  tend: '军营里，士兵把皮帐篷的绳索拉紧，旁边有人把弓拉满。',
  sequ: '一位罗马官员往前走，一列随从按次序跟在后面，地上留着脚印。',
  clud: '四面拱廊围住的庭院，一个修士用大铁钥匙转动院门。',
  cid: '伐木的空地上，一棵树被斧子干净地砍倒，树桩上放着铁剪。',
  cad: '黄昏的果园台阶上，叶子和苹果落下，两颗骰子在台阶上翻滚。',
  fin: '一条路停在高大的界石前，界石上系着蓝色的终点丝带。',
  flect: '柳枝弯向水面，水里映出树影，旁边有人把热木条弯成一个圈。',
  junct: '十字路口，两头牛套在同一副轭下，旁边是两根梁的榫接。',
  loc: '记忆宫殿的平面上插着一枚巨大的红色地图钉，演说者把钉按在画了圈的地点上。',
  loqu: '演说者张着嘴、张开手臂正在说话，旁边有书记员和一张剧场面具。',
  mand: '军官把封好的卷轴交到年轻人手中，披风是朱红的。',
  ment: '思考的人面前有一块发亮的心智蜡板，导师指向一座神庙。',
  mem: '一家人站在纪念胸像前，铺着淡紫的布，放着花。',
  mon: '鹅在报警，旁边是朱诺·摩涅塔的钱币和神庙。',
  mort: '沙漏旁边，一株枯萎，一株新芽。',
  nat: '母羊身边站着刚出生的羊羔，土层里有种子在发芽。',
  nom: '婴儿命名的日子，脖子上挂着金色的护符。',
  nov: '一颗新星，旁边是翻新的房子和一块新布。',
  numer: '柜台上摆着算盘，有人在数珠子。',
  par: '出征前，有人在穿戴甲胄，把一切准备好。',
  part: '一条划了格的面包被分成几份，正在分给别人。',
};

function originOf(language: string): Origin {
  if (language === 'Greek' || language === 'Latin + Greek') return language;
  return 'Latin';
}

/** Split on "+" that sits outside parentheses, so a gloss can mention another cut. */
function splitPlus(rawText: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let buf = '';
  for (const ch of rawText) {
    if (ch === '(' || ch === '（') depth += 1;
    else if (ch === ')' || ch === '）') depth = Math.max(0, depth - 1);
    if (ch === '+' && depth === 0) {
      if (buf.trim()) parts.push(buf.trim());
      buf = '';
    } else {
      buf += ch;
    }
  }
  if (buf.trim()) parts.push(buf.trim());
  return parts;
}

function parsePiece(piece: string): Morpheme {
  const normalized = piece.replace(/（/g, '(').replace(/）/g, ')').trim();
  const wrapped = normalized.match(/^([^\s()]+)\((.*)\)\s*$/);
  if (wrapped) return { form: wrapped[1], gloss: wrapped[2].trim() };
  const spaced = normalized.match(/^(\S+)\s+(.+)$/);
  if (spaced) return { form: spaced[1], gloss: spaced[2].trim() };
  return { form: normalized, gloss: '' };
}

function parseBreakdown(rawText: string, fallback: Morpheme): Morpheme[] {
  const parts = splitPlus(rawText)
    .map(parsePiece)
    .filter((part) => part.form.length > 0);
  return parts.length > 0 ? parts : [fallback];
}

function uniq(values: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    const key = value.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(key);
  }
  return out;
}

/**
 * The display form is the catalog's root, unless that string is another record's id
 * (paed's "ped" is the Latin foot; mono's "mon" is the money root).
 */
function displayRoot(record: CatalogRoot, ids: Set<string>): string {
  const form = record.root.trim().toLowerCase();
  if (form !== record.id && ids.has(form)) return record.id;
  return form || record.id;
}

function toEntry(record: CatalogRoot, ids: Set<string>, claimed: Set<string>): RootEntry {
  const rootForm = displayRoot(record, ids);
  const sentence = record.example?.en?.trim() ?? '';
  const sentenceZh = record.example?.zh?.trim() ?? '';
  const words: Lexeme[] = [];
  for (const derived of record.derivedWords) {
    const surface = derived.word.trim();
    const key = surface.toLowerCase();
    if (!key || claimed.has(key)) continue;
    claimed.add(key);
    const mentioned = sentence.length > 0 && sentence.toLowerCase().includes(key);
    words.push({
      word: surface,
      gloss: derived.zh.trim(),
      pos: '',
      parts: parseBreakdown(derived.breakdown, { form: rootForm, gloss: record.meaning.zh }),
      example: mentioned ? sentence : '',
      exampleZh: mentioned ? sentenceZh : '',
    });
  }
  return {
    id: record.id,
    root: rootForm,
    forms: uniq([record.id, rootForm, ...record.forms]),
    titleEn: record.meaning.en,
    meaningEn: record.meaning.en,
    meaningZh: record.meaning.zh,
    origin: originOf(record.language),
    lemma: record.sourceWord,
    story: record.originStory,
    artAlt: batchIllustrated.has(record.id)
      ? batchAlt[record.id]
      : record.meaning.zh
        ? `${record.meaning.zh}。奶油色卡片，插画还没画。`
        : '奶油色卡片，插画还没画。',
    illustrated: batchIllustrated.has(record.id),
    example: sentence || undefined,
    exampleZh: sentence ? sentenceZh : undefined,
    words,
  };
}

/** Illustrated records stay as authored. Everyone else becomes a cream-card root, in rank order. */
export function buildScaledRoots(painted: RootEntry[]): RootEntry[] {
  const byId = new Map(painted.map((root) => [root.id, root]));
  const claimed = new Set<string>();
  for (const root of painted) {
    for (const word of root.words) {
      claimed.add(word.word.toLowerCase());
      for (const alt of word.also ?? []) claimed.add(alt.toLowerCase());
    }
  }
  const ids = new Set(catalog.map((record) => record.id));
  const out: RootEntry[] = [];
  const seen = new Set<string>();
  for (const record of [...catalog].sort((a, b) => a.rank - b.rank)) {
    if (seen.has(record.id)) continue;
    seen.add(record.id);
    const art = byId.get(record.id);
    out.push(art ?? toEntry(record, ids, claimed));
  }
  for (const art of painted) {
    if (!seen.has(art.id)) out.push(art);
  }
  return out;
}
