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
  'pati',
  'pel',
  'pet',
  'ple',
  'prehend',
  'quer',
  'sci',
  'sec',
  'serv',
  'sign',
  'simil',
  'solv',
  'son',
  'sum',
  'tang',
  'terr',
  'tort',
  'val',
  'vinc',
  'viv',
  'volv',
  'fid',
  'temp',
  'ver',
  'jud',
  'jur',
  'liber',
  'grav',
  'lev',
  'fort',
  'nav',
  'vol',
  'cogn',
  'grat',
  'mar',
  'equ',
  'phys',
  'tele',
  'scop',
  'micro',
  'mult',
  'omni',
  'uni',
  'ann',
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
  ment: '薄荷色镶嵌地面上，青年拿着蜡板，导师指向神庙。',
  mem: '一家人站在纪念胸像前，铺着淡紫的布，放着花。',
  mon: '鹅在报警，旁边是朱诺·摩涅塔的钱币和神庙。',
  mort: '沙漏旁边，一株枯萎，一株新芽。',
  nat: '母羊身边站着刚出生的羊羔，土层里有种子在发芽。',
  nom: '婴儿命名的日子，脖子上挂着金色的护符。',
  nov: '整块底座是钴蓝的夜色地面，上面是一颗很大的新星。',
  numer: '柜台上摆着算盘，有人在数珠子。',
  par: '出征前，有人在穿戴甲胄，把一切准备好。',
  part: '一条划了格的面包被分成几份，正在分给别人。',
  pati: '酒红的榻上，病人在忍受，医生按着他的手腕。',
  pel: '桨手正在划船，把船推过青色的海面。',
  pet: '跑者冲向品红跑道尽头的终点柱。',
  ple: '农夫把琥珀色的粮食倒进陶罐，粮食漫出来。',
  prehend: '渔夫双手抓住一条鱼，旁边堆着铜色的网。',
  quer: '提灯的人在被黄光照亮的地上寻找。',
  sci: '学者指着一块紫色的星图板，旁边有地球仪。',
  sec: '收割的人用镰刀把一捆麦子从中间切开，地面是黄绿色的。',
  serv: '守望的人穿着青铜色长袍，在城垛上举着火把。',
  sign: '旗手举起一面巨大的深红军旗，站在红砖上。',
  simil: '两座几乎一样的雕像立在成对的基座上。',
  solv: '有人在解开绳结，旁边是一只宽口的青绿碗。',
  son: '拱门下有人张嘴喊叫，周围看得见一圈圈声波。',
  sum: '宴席上的客人从金色的盘子里取用食物。',
  tang: '指尖触到一颗大理石球，球放在珊瑚色的圆盘上。',
  terr: '农夫站在一层层陶土色的梯田上。',
  tort: '一个人把铜色的绳子拧成一支火把。',
  val: '两个人握手告别，旁边是一面很大的翠绿盾。',
  vinc: '长翅膀的胜利女神把月桂冠戴在跪着的胜利者头上，紫色的地面上落着一片棕榈叶。',
  viv: '浇过水之后，绿色的植物重新活过来，旁边还留着一截枯茎。',
  volv: '一大卷纸莎草在底座上展开。',
  fid: '蓝宝石色的祭坛前，两个人握手，旁边有一只忠诚的狗。',
  temp: '一只青色的大碗像钟面，一个人把木杆插进中央的孔里。',
  ver: '井里的人举起一面金镜子，井沿上放着一枚打了勾的金币。',
  jud: '白发的人坐在雕花椅子上，两个年轻人站在蓝色的地面上。',
  jur: '几个人举起右手，绿色的地面中间放着一张石桌。',
  liber: '一个人把红帽子戴到另一个人头上，地上躺着断开的锁链。',
  grav: '一个人背着巨大的紫色袋子，旁边一颗紫色的果子往下掉。',
  lev: '一个人压下金色的杠杆，把另一头的石球抬起来。',
  fort: '黄色的城墙上站着持盾的人，墙下有人把手放在同伴肩上。',
  nav: '蓝色的海上，一个人在帆船里用桨划过一座小岛。',
  vol: '一个人跪着望向一颗很大的黄星，旁边插着一面小旗。',
  cogn: '两个人指着桌上的一尊胸像，像是在认出谁。',
  grat: '一个人跪着献上系了蝴蝶结的礼物，对方把手放在胸口。',
  mar: '沙滩上站着一个人，面前是一道很高的蓝色海浪和一只小船。',
  equ: '一架天平两端的砝码一样高，蓝色的地面上还放着砝码。',
  phys: '一株植物露出根系，旁边有人看着，一颗球沿着虚线落下。',
  tele: '两座山各有一堆火，一个人在近处的火边用棍子拨火。',
  scop: '一个人站在灰色的瞭望塔顶，用望远镜向远处看。',
  micro: '一个人凑近一台绿色的显微镜，玻片上有很小的东西。',
  mult: '很多小人站在红色的地面上，中间立着几根柱子。',
  omni: '一辆绿色马车里里外外坐满了人。',
  uni: '紫色的地面上站着一匹独角兽，旁边两个人坐在一起。',
  ann: '一个人在点生日蜡烛，旁边挂着一本日历，外面是一圈蓝环。',
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

function toEntry(
  record: CatalogRoot,
  ids: Set<string>,
  claimed: Set<string>,
  owners: Map<string, string>,
  built: Map<string, RootEntry>,
  paintedIds: Set<string>,
): RootEntry {
  const rootForm = displayRoot(record, ids);
  const sentence = record.example?.en?.trim() ?? '';
  const sentenceZh = record.example?.zh?.trim() ?? '';
  const words: Lexeme[] = [];
  for (const derived of record.derivedWords) {
    const surface = derived.word.trim();
    const key = surface.toLowerCase();
    if (!key) continue;
    if (claimed.has(key)) {
      const ownerId = owners.get(key);
      const take =
        !!ownerId &&
        !paintedIds.has(ownerId) &&
        record.id.length >= 4 &&
        key.startsWith(record.id) &&
        !key.startsWith(ownerId);
      if (!take) continue;
      const prev = built.get(ownerId);
      if (prev) prev.words = prev.words.filter((word) => word.word.toLowerCase() !== key);
    }
    claimed.add(key);
    owners.set(key, record.id);
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
  const owners = new Map<string, string>();
  const paintedIds = new Set(painted.map((root) => root.id));
  for (const root of painted) {
    for (const word of root.words) {
      claimed.add(word.word.toLowerCase());
      owners.set(word.word.toLowerCase(), root.id);
      for (const alt of word.also ?? []) {
        claimed.add(alt.toLowerCase());
        owners.set(alt.toLowerCase(), root.id);
      }
    }
  }
  const ids = new Set(catalog.map((record) => record.id));
  const out: RootEntry[] = [];
  const built = new Map<string, RootEntry>();
  const seen = new Set<string>();
  for (const record of [...catalog].sort((a, b) => a.rank - b.rank)) {
    if (seen.has(record.id)) continue;
    seen.add(record.id);
    const art = byId.get(record.id);
    const entry = art ?? toEntry(record, ids, claimed, owners, built, paintedIds);
    built.set(entry.id, entry);
    out.push(entry);
  }
  for (const art of painted) {
    if (!seen.has(art.id)) out.push(art);
  }
  return out;
}
