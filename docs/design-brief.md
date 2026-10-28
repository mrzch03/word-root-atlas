# 词根图鉴 Word Root Atlas · 重设计 Brief v2
> 2026-10-26。依据三份笔记：`learning/elegant-creative-apps-notes.md`、`learning/color-art-notes.md`、`learning/monument-valley-case-study.md`，都在 store 里。
> 目标是苹果级的克制，做到「水龙头」程度：第一次用就会。每一屏都要像纪念碑谷那样，能直接裱起来挂墙。

---
## 0. 一句话与标志性创意

**「收藏即上色」：每收一个词根，世界就多一种颜色。**

1. **起点是素白。** 第一次打开时，树是一株**素白石膏的等轴小雕塑**，立在悬空的方块底座上，背景是暖白的空气。整页唯一的颜色，是输入框里闪动的光标。这借鉴了 Gris 从灰阶开始、靠解锁恢复颜色的做法，也借鉴了纪念碑谷的 little world。
2. **显影。** 输入单词，例如 `transport`，回车：
   - 字母分开，`port` 这一段浮起来，被**这个词根的颜色**点亮。
   - 卡片像暗房里的相纸一样**显影**：先出现纸白上的灰色剪影，然后颜色从中心晕开，铺满整张插画。
   - 同时响起这个词根对应的**一个音**（五声音阶里的一个音，所以任意先后顺序都和谐）。音效默认关闭，只有用户主动开启后才会出声。
   这一步借鉴 CapWords 的剥离瞬间和纪念碑谷把机关声做成音调。
3. **长成叶子。** 卡片右下角的「收入图鉴」被点击后，一片同色的叶子从卡片飞向树，落在这个词根对应的枝条上。这根枝条随之从石膏白**染成该词根的颜色**，叶子则带着轻微的弹性定住。
4. **词的光谱。** 42 个词根的颜色在色轮上等距分布，间隔 8.57°。所以：
   - 图鉴页按色相排列，收齐时正好是**一整圈光谱**。
   - 树冠从各个方向看，也是一个完整的色环。
   - 用户收的不是 42 张卡，而是**一道彩虹**。进度条本身就是这道光谱：已收的色块实心，未收的只描边。

这个点子能同时解决用户说的三个「丑」：
- **棕色问题：** 颜色由系统来分配，不会再全是棕色。
- **树丑：** 树换成纪念碑谷式的雕塑。
- **页面丑：** 页面 90% 是中性色，只留下作品本身的颜色。

---
## 1. 色彩系统

### 1.1 UI 中性色（外框）
外框的彩度 C 不超过 0.008，绝不偏棕。

| token | hex | 用途 | 对比度（相对 bg） |
|---|---|---|---|
| `--bg` | `#FAF8F4` | 页面背景，是一种接近中性的暖白（OKLCH 约为 0.98 / 0.006 / 85） | — |
| `--surface` | `#FFFFFF` | 卡片纸面、浮层 | 1.06 |
| `--fill` | `#F2F0EC` | 输入框底、未收集的空位 | — |
| `--hairline` | `#E3E1DD` | 1px 分隔线和描边 | — |
| `--ink` | `#1D1D1F` | 主文字（Apple 的近黑） | 15.9:1 |
| `--ink-2` | `#636368` | 次级文字 | 5.6:1 |
| `--ink-3` | `#86868B` | 仅用于 ≥ 18px 的提示或装饰文字 | 3.4:1 |
| `--focus` | 当前词根的 accent；没有当前词根时用 `--ink` | 聚焦环宽 2px，外偏移 2px | — |

**禁止**使用任何旧调色板里的 `soil`、`clay`、`ochre` 等颜色作为 UI 色。旧的 `src/data/palettes.ts` 整个删掉。

### 1.2 词根色（内容）：42 色，OKLCH 等明度、等彩度
每个词根有 6 档颜色，规则如下：

| 档位 | 规则 | 用途 |
|---|---|---|
| accent | L 0.70 / C 0.105。黄区（色相 70–115°）提亮到 L 0.76 | 叶子、进度色块、词根字母高亮、按钮背景 |
| deep | L 0.45 / C 0.09 | 所有以词根色出现的文字，对比度 6.7–7.4:1 |
| wash | L 0.955 / C 0.025 | 卡片插画区的底色、选中态的底色 |
| skyTop → skyBottom | 顶部 L 0.93 / C 0.04；底部 L 0.975 / C 0.015，色相 +30° | 树页的天空渐变、卡片插画的背景 |
| spark | 色相 +180°，L 0.80 / C 0.07 | 补色火花：插画里的一个小物件、全家福卡的一道描边 |

几条用法限制：
- accent 对 bg 的对比度只有 2.0–2.7:1，**永远不能用来当文字色**。
- deep 在 40–110° 这一段天然偏棕或偏橄榄，只能用在小字上，不能大面积铺。
- 同一个画面里，最多出现**一个**词根的 accent，外加它的 spark。
- 色相分配方法：先给每个词根定一个语义目标色相，比如水用青、光用黄、心用红、星用蓝，再按圆周顺序吸附到等距格点上，起始偏移 2.4°。
- 数据文件放在 store 的 `learning/` 目录下：`word-root-atlas-rootColors.ts`（可直接 import）、`word-root-atlas-root-colors.json`，色板图是 `word-root-atlas-42-root-swatches.png`。

| # | root | hue° | accent (UI/leaf) | deep (text on wash, ≥6.5:1) | wash (card mat) | sky top | sky bottom | complement spark |
|---|---|---|---|---|---|---|---|---|
| 1 | sent | 2.4 | `#D58299` | `#7D3E51` | `#FFEAEF` | `#FEDEE6` | `#FEF4F2` | `#8ACDC1` |
| 2 | phil | 11.0 | `#D7828E` | `#7F3E49` | `#FEEBED` | `#FFDFE2` | `#FEF5F1` | `#87CDC8` |
| 3 | cord | 19.5 | `#D88384` | `#803F41` | `#FEEBEA` | `#FEDFDF` | `#FFF4EF` | `#86CCCF` |
| 4 | dict | 28.1 | `#D88479` | `#804038` | `#FEEBE8` | `#FEE0DB` | `#FEF5EE` | `#87CBD5` |
| 5 | rupt | 36.7 | `#D7866F` | `#7F4130` | `#FEECE6` | `#FFE0D7` | `#FEF5EC` | `#89C9DB` |
| 6 | manu | 45.3 | `#D58966` | `#7E4327` | `#FEECE4` | `#FFE1D3` | `#FDF6EC` | `#8CC8E0` |
| 7 | ject | 53.8 | `#D18C5E` | `#7B461F` | `#FEECE1` | `#FEE1D0` | `#FCF6EC` | `#91C6E4` |
| 8 | geo | 62.4 | `#CD8F56` | `#784817` | `#FDEDE0` | `#FCE3CD` | `#FAF7EC` | `#96C4E8` |
| 9 | cap | 71.0 | `#DBA663` | `#744B0F` | `#FBEEDE` | `#F9E4CC` | `#F9F7EC` | `#9DC2EA` |
| 10 | struct | 79.5 | `#D5A960` | `#6F4E08` | `#F9EFDE` | `#F6E5CB` | `#F7F8EC` | `#A3BFEB` |
| 11 | cred | 88.1 | `#CDAD5E` | `#6A5205` | `#F7F0DE` | `#F3E7CA` | `#F6F8ED` | `#AABDEC` |
| 12 | luc | 96.7 | `#C4B15F` | `#645506` | `#F5F1DE` | `#EFE9CB` | `#F4F9EE` | `#B2BAEB` |
| 13 | phot | 105.3 | `#BAB563` | `#5D580D` | `#F2F1DF` | `#EBEACC` | `#F2F9EF` | `#B9B8EA` |
| 14 | ped | 113.8 | `#B0B968` | `#555A15` | `#F0F2E0` | `#E7EBCD` | `#F1FAF1` | `#BFB6E7` |
| 15 | tract | 122.4 | `#93A95D` | `#4D5D1D` | `#EDF3E1` | `#E3EDD0` | `#F0FAF2` | `#C6B4E4` |
| 16 | bene | 131.0 | `#87AC65` | `#435F26` | `#EAF4E3` | `#DFEED2` | `#EFFAF3` | `#CCB2DF` |
| 17 | bio | 139.5 | `#7BAE6F` | `#39612F` | `#E8F5E5` | `#DBEFD6` | `#EEFAF5` | `#D2B0DA` |
| 18 | mov | 148.1 | `#6FB179` | `#2D6338` | `#E5F5E7` | `#D7F0D9` | `#EDFAF7` | `#D7AED5` |
| 19 | duc | 156.7 | `#63B284` | `#206440` | `#E3F6E9` | `#D3F0DD` | `#ECFAF8` | `#DCADCF` |
| 20 | meter | 165.3 | `#56B38E` | `#0D6549` | `#E2F6EC` | `#D0F1E1` | `#ECFAFA` | `#E0ACC8` |
| 21 | spect | 173.8 | `#4BB499` | `#066451` | `#E0F6EF` | `#CEF1E6` | `#ECFAFB` | `#E3ACC1` |
| 22 | vid | 182.4 | `#41B4A4` | `#016359` | `#DFF6F1` | `#CCF1EA` | `#ECFAFD` | `#E5ABBA` |
| 23 | hydr | 191.0 | `#3AB3AE` | `#05625F` | `#DEF6F4` | `#CAF1EE` | `#ECF9FE` | `#E7ACB3` |
| 24 | spir | 199.5 | `#37B2B8` | `#026265` | `#DEF6F7` | `#CAF1F2` | `#EEF9FE` | `#E8ACAC` |
| 25 | flu | 208.1 | `#39B0C0` | `#05616B` | `#DEF5F9` | `#CAF0F6` | `#EFF8FF` | `#E8ADA5` |
| 26 | port | 216.7 | `#40AEC9` | `#016072` | `#DEF5FB` | `#CBEFF9` | `#F1F8FE` | `#E7AF9E` |
| 27 | chron | 225.3 | `#49ACD0` | `#055E78` | `#DFF4FD` | `#CDEEFC` | `#F2F7FE` | `#E5B099` |
| 28 | pend | 233.8 | `#54A9D6` | `#0B5D7F` | `#E1F3FF` | `#CFEDFF` | `#F3F7FF` | `#E2B294` |
| 29 | scrib | 242.4 | `#5FA6DA` | `#1E5A83` | `#E3F2FF` | `#D4EBFE` | `#F4F6FE` | `#DFB48F` |
| 30 | graph | 251.0 | `#6BA3DE` | `#2B5885` | `#E6F2FE` | `#D8EAFF` | `#F5F6FE` | `#DBB78C` |
| 31 | aster | 259.5 | `#779FE0` | `#365587` | `#E8F1FF` | `#DCE9FE` | `#F6F6FE` | `#D6B98B` |
| 32 | log | 268.1 | `#829CE0` | `#405287` | `#EAF0FF` | `#DFE8FE` | `#F8F5FF` | `#D0BC8A` |
| 33 | mal | 276.7 | `#8D98DF` | `#495087` | `#ECEFFF` | `#E2E7FE` | `#F9F4FF` | `#CABE8A` |
| 34 | vert | 285.3 | `#9895DD` | `#514D85` | `#EEEEFE` | `#E5E5FE` | `#FBF4FE` | `#C4C18C` |
| 35 | phon | 293.8 | `#A292DA` | `#584A82` | `#F0EEFF` | `#E9E4FE` | `#FCF4FD` | `#BDC38F` |
| 36 | aud | 302.4 | `#AB8ED5` | `#5F487E` | `#F3EDFF` | `#EDE2FF` | `#FDF3FB` | `#B5C693` |
| 37 | psych | 311.0 | `#B38BCF` | `#65467A` | `#F6ECFD` | `#F1E1FC` | `#FEF3FA` | `#AEC898` |
| 38 | voc | 319.5 | `#BB89C8` | `#6B4474` | `#F8EBFB` | `#F4E0F9` | `#FEF3F8` | `#A7C99E` |
| 39 | morph | 328.1 | `#C287BF` | `#70426E` | `#FAEBF9` | `#F7DFF6` | `#FFF3F7` | `#A0CBA5` |
| 40 | form | 336.7 | `#C885B7` | `#744068` | `#FCEAF6` | `#FADEF2` | `#FEF4F5` | `#99CCAC` |
| 41 | mit | 345.3 | `#CD83AD` | `#783F60` | `#FDEAF4` | `#FDDEEE` | `#FEF4F4` | `#93CDB3` |
| 42 | path | 353.8 | `#D182A3` | `#7B3E59` | `#FFEAF1` | `#FFDDEA` | `#FEF4F3` | `#8ECDBA` |


### 1.3 插画提示词同步（解决「全是棕色」）
每张卡片的生图提示词，**必须**从上表注入以下内容：

> "dominant hue: {accent} family (oklch L0.70 C0.105 h{hue}); sky gradient {skyTop} → {skyBottom}; one small complementary accent object in {spark}; plinth/base material tinted by the scene (snow/water/grass/stone/glass) in light tints of the dominant hue — NOT brown soil; matte clay/plaster, flat soft gradient lighting, no harsh shadows; generous cream-white negative space"

还有三条配套要求：
- 底座不再统一用土层，要随场景变化：
  - hydr 用水，aster 用夜空玻璃，luc 用晨雾石膏，bio 用苔草。
  - 只有 geo 可以用土层，而且要用带红的赭色（accent `#CD8F56`），不能用灰棕。
- 生成后自动检查：从插画里取出 vibrant 色，它和目标色相的 ΔH 必须小于 25°；dominant 色的 C 必须小于 0.06，否则重新生成。
- 把 42 张缩略图排成一行审一遍，要能看出一条彩虹。

---
## 2. 字体
| 角色 | 字体栈 | 字号 / 行高 / 字重 / 字距 |
|---|---|---|
| Display（单词大标题） | `"Newsreader", "Instrument Serif", "Iowan Old Style", "Songti SC", "Noto Serif SC", serif` | 56/60，桌面 Regular 400，字距 −0.02em；移动端 40/44 |
| Root（词根字母） | 同上，斜体 | 跟随 Display，颜色用 accent，不另设字号 |
| Eyebrow（小标签，如 LATIN · TO CARRY） | `-apple-system, "SF Pro Text", "Inter", "PingFang SC", "Noto Sans SC", sans-serif` | 11/16，字重 600，**字距 +0.14em**，全大写，颜色 `--ink-2` |
| Title（页面标题、卡片副标题） | 系统无衬线 | 22/28，600 |
| Body | 系统无衬线 | 15/24，400。中文正文行高 1.7 |
| 中文释义（卡片上） | `"Songti SC", "Noto Serif SC", "Source Han Serif SC", serif` | 17/28，400。和英文衬线体呼应 |
| Caption / 数字 | 系统无衬线，`font-variant-numeric: tabular-nums` | 13/18 |

加载规则：
- Newsreader 只加载 400、400 italic 和 600 三个字重，并设 `font-display: swap`。
- Noto Serif SC 只按卡片里用到的字做 `unicode-range` 子集，构建时从数据里抽字。
- 中文元素加 `:lang(zh-CN)`。
- 整站最多 **3 种字号**同时出现在一屏上。

---
## 3. 布局与间距
- 间距刻度为 4、8、12、16、24、32、48、64、96。
- 圆角：卡片 20px，按钮和输入框 14px，芯片 999px。
- 阴影只用一种：`0 1px 2px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06)`。不能叠用，也不能有颜色。
- 桌面最大内容宽度 1200px，左右至少留 48px 边距。
- 导航放在顶部居中的分段控件里，只有三项：**发现 · 树 · 图鉴**，高 36px，背景用 `--fill`，选中项是白底加一层阴影。左上角放产品名 *Word Root Atlas*（衬线 17px），右上角放音效开关。不做侧栏。

### 3.1 发现页：首次打开
- 画面整体是暖白的。
- 中心偏上约 40% 的位置，放一株**素白小树的等轴剪影**，尺寸 160×160，使用 3D 的静态渲染帧，减少加载。
- 剪影下方是一个输入框：宽 min(560px, 100% − 48px)，高 64px，背景 `--fill`，字号 24px 衬线，占位文字为 *type any English word…*，打开页面就自动聚焦。
- 输入框下方 12px 处放一行 `--ink-3` 的 13px 提示：「试试 transport、biology、spectator」。三个词都可以直接点。
- 屏幕上**除此之外什么都没有**：不放功能介绍，不放统计，不放教程。
- 这样就满足了「水龙头」的标准：3 秒看懂，10 秒内完成第一步。

### 3.2 发现页：查询结果与卡片
- 桌面端两栏，比例 5:4，栏间距 48px。
- **左栏是插画卡**，3:4 竖版，最大高度 640px：
  - 外层是 `--surface` 纸面，内边距 16px。
  - 插画铺满纸面，插画背景就是 skyTop→skyBottom 渐变，和图片无缝衔接。
  - 左上角压一行 eyebrow，例如 `PORT · TO CARRY`，颜色用 deep。
  - 底部 16px 处有一行很小的编号，例如 `No. 15 / 42`，用 13px 等宽数字。
- **右栏是解读**，自上而下：
  1. eyebrow：`LATIN ROOT`
  2. 大标题：`trans·`*`port`*。词根部分用斜体，颜色用 accent；其余用 `--ink`。
  3. 音标、词性和中文释义。
  4. 一段 2–3 行的词源小故事，用 Body 字号。
  5. 「同一家族」芯片组：已收集的芯片是实心 wash 底配 deep 字，未收集的只描边。点一个芯片，页面就切换到那个词。
  6. 主按钮「收入图鉴」：高 48px，accent 底。由于 accent 太浅，按钮文字用 deep，对比度已核对达标。已收集的词，按钮变成「已在图鉴 · 去树上看看 →」。
- 查不到词根时，不报错。显示一句话「这个词的词根还没收进图鉴」，再推荐 3 个拼写相近、且有词根的词。
- 移动端改成单栏：卡片宽 100%，解读放在卡片下方。主按钮吸底，带 16px 的安全区。

### 3.3 树页
- 3D 画布铺满整个视口，减去顶栏。树的整体高度占视口的 55–60%，四周留白不少于 35%。树放在画面中心偏下，因为底座需要地气。
- 背景是**当前词根的天空渐变**。没有选中词根时，用中性天空：上 `#F3F1EC`，下 `#FAF8F4`。切换词根时，天空在 0.8 秒内渐变到新的颜色。
- 左下角放一块小信息板，宽 280px，背景 `--surface`，透明度 0.9，带 blur 背景：
  - 内容是「已长出 12 / 42 根枝 · 87 片叶」，加一条光谱进度条。
  - 进度条由 42 个 6×6 的小方块组成，间隔 2px。已收集的方块用 accent 填实，未收集的只画 `--hairline` 描边。
- 交互：
  - 拖动旋转，只能绕 Y 轴转。松手后**吸附到最近的 90°**。
  - 把鼠标悬停在一根枝上，这根枝提亮 6%，同时出现一个小标签，写词根和词数。
  - 点击一根枝，右侧滑出一个抽屉，宽 400px，里面是这个家族的卡片和词列表。
  - 滚轮缩放限制在 0.8× 到 1.4× 之间。
  - 双击回到默认视角。
- 不支持 WebGL，或者开启了 `prefers-reduced-motion` 时，显示一张预渲染的静态等轴图，并配一份可访问的枝叶列表。

### 3.4 图鉴页
- 顶部放标题「图鉴」，旁边是「12 / 42」。右侧放一个分段控件：**光谱**（默认）、拉丁、希腊、最近。
- 下方是**光谱环带**：一条 42 段的横向色带，宽 100%，高 8px，圆角，起到总进度和快速跳转的作用。
- 卡片栅格：
  - 用 `grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))`，间距 24px。宽 1200px 时大约每行 5 张。
  - 卡片是 3:4 比例，内容是插画缩略图加 eyebrow 加「6/8 词」。
- **空位**：用 `--fill` 底，1px 虚线描边 `--hairline`，中间用 40px 衬线体写上词根字母（如 *port*），颜色 `--ink-3`，并且**不剧透插画**。底部有一条 2px 的细线，颜色是这个词根的 accent，透明度 0.5，提示「这里将会是什么颜色」。
- 默认按色相排序，所以页面滚下去就是一条彩虹。已收集的格子是彩色，未收集的是灰白，收集进度一眼就能看出来。
- 点击一张卡片，它会放大成全屏查看。动画用 View Transition（共享元素）完成，整个过程中卡片始终是同一个物体。
- **全家福**：一个家族的词全部收集后，卡片加一圈 1px 的 spark 色描边，鼠标悬停时出现全息倾斜效果。全息效果最多倾斜 6°，光泽透明度 ≤ 0.15。

---
## 4. 动效规范
统一使用 Motion（framer-motion）的弹簧，参数和 Apple 一样采用 duration 与 bounce 两个量（WWDC23《Animate with springs》）：`{ type: 'spring', visualDuration, bounce }`。

| 场景 | 参数 | 说明 |
|---|---|---|
| 一般的 UI 切换、抽屉、标签 | visualDuration 0.35, bounce 0 | 平稳，没有过冲 |
| 按钮按下 | scale 0.97，tween 0.1s ease-out；松开时用 spring 0.3 / 0.2 | 按下的反馈必须在 100ms 以内 |
| 字母拆分，词根浮起 | 字母依次延迟 25ms，y −6px，用 spring 0.4 / 0.25；词根颜色淡入 0.3s | 拆分要在 Doherty 阈值（400ms）内开始 |
| **卡片显影（首次）** | 共 1.2s：0–0.25s 纸面出现（opacity，加 scale 从 0.98 到 1，spring 0.4/0.1）；0.2–1.2s 插画从灰度剪影变成彩色。实现上可以给 `filter: grayscale(1) contrast(.6) brightness(1.15)` 做插值，也可以用一张径向遮罩，从中心向外扩展。缓动用 `cubic-bezier(0.22, 1, 0.36, 1)` | 只有第一次解锁时这样播放 |
| 卡片再次查看 | 0.25s 淡入，scale 从 0.99 到 1 | 不再重复仪式 |
| 叶子飞向树 | 沿一条贝塞尔弧线飞 0.7s，缓动 `cubic-bezier(0.65, 0, 0.35, 1)`；落地时用 spring 0.5 / 0.35 | 在发现页时，树显示在右下角的一个 96px 小窗里，作为叶子的落点 |
| 枝条染色 | 0.9s，着色器 uniform `uGrow` 从 0 到 1，颜色从根部向枝梢推进 | 叶子落地后再开始 |
| 树的旋转吸附 | spring 0.6 / 0.15 | 慢、稳、咔哒一下到位 |
| 天空换色 | 0.8s，在 OKLCH 空间里插值，ease-in-out | 不要在 RGB 里插值，中间会发灰 |
| 家族收齐 | 2.4s：所有枝叶按顺序闪亮一轮，加 spark 色的粒子 12 颗，加一个和弦 | 每个家族只播一次 |

另外两条全局规则：
- `prefers-reduced-motion` 打开时，所有位移动画改成 0.2 秒的淡入淡出，显影直接显示最终画面。
- 任何操作都要在 100ms 内给出可见的反馈。查询超过 400ms 时，在输入框下方显示一条 2px 的 accent 细线，做不确定进度。

**声音（可选，默认关闭）：** 每个词根对应 C 大调五声音阶里的一个音，按色相序号取模，覆盖 3 个八度，音色是柔和的木琴或钟琴。加入图鉴时加一声 30ms 的木质「咔」。全局音量 −18 dB。

---
## 5. 3D 树：美术方向与技术清单

### 5.1 美术方向（纪念碑谷式 little world）
- **构图**：一块等轴方块底座，大约 1 × 0.35 × 1。底座是素白石膏色 `#F4F2EE`，顶面最亮，左面和右面两档递暗。上面立着一棵**几何化的小树**，像一件雕塑。
- **树干和枝条**：锥形的六棱柱，每次分叉夹角 25–35°，最多 3 级分叉。外形偏建筑感，参考纪念碑谷的塔楼和日本盆景的剪影，不要写实。
- **42 根主枝**：每个词根一根，按色相角绕树干螺旋排布。黄金角 137.5° 只用来决定高度的错位；**方位角就等于色相角**，所以从正上方看，树冠就是一个色环。
- **叶子**：一个词就是一片叶，形状是低多边形的菱形或杏仁形叶片，6–8 个三角面。颜色在这个词根的 accent 基础上，每片随机做 ±0.03 的 L 微调和 ±4° 的 H 微调，模仿真实叶子的变化。
- **未收集的枝条**：保持石膏白，枝梢加一颗 0.02 大小的 `--hairline` 色小芽点，暗示这里将来会长出东西。
- **天空**：当前词根的 skyTop→skyBottom 渐变，加 3% 的纸纹噪点和 4% 的径向暗角。暗角来自纪念碑谷的做法，让画面像一张印刷品。
- **地面**：不做地面。底座悬在空中，下方 0.15 处有一块柔和的椭圆接触阴影，颜色用 skyTop 的 deep 色，透明度 0.18，**不是黑色**。

### 5.2 技术清单（react-three-fiber）
1. 相机用 `<OrthographicCamera makeDefault zoom={…} position={[10, 8.165, 10]} />`，看向 (0, 0.6, 0)，也就是等轴角（俯仰 35.264°）。
   - zoom 的取法：让树的包围盒高度 ≈ 视口高度的 0.58，监听 resize 后重新计算。
   - 加一个 `OrbitControls`：`enableZoom` 设为 true，限制 `minZoom` 和 `maxZoom`；`enablePan` 设为 false；把 min 和 max polar angle 都锁定为当前角度，这样只能水平旋转。
   - 松手时，在 `onEnd` 里用 spring 把方位角吸附到最近的 π/2。
2. 渲染器设置：`gl={{ antialias: true, toneMapping: THREE.NoToneMapping, outputColorSpace: THREE.SRGBColorSpace }}`，`dpr={[1, 2]}`。
   - 平面渐变路线**不用** ACES，因为 ACES 会把粉彩压脏。
   - 场景背景透明，天空交给 CSS 渐变来画（OKLCH 插值更便宜，也方便过渡）。
3. **FlatGradientMaterial**：自定义 `shaderMaterial`（drei），不做实时光照。
   ```glsl
   // vertex: 传 world normal、world position、instanceColor / 顶点色(AO)
   // fragment:
   uniform vec3 uBase;      // 该部件的 accent（或石膏白）
   uniform float uTop, uLeft, uRight;   // 明度倍率 1.0 / 0.86 / 0.72
   uniform vec3 uSkyTint;  // skyTop，环境色混入 8%
   uniform float uGrow;     // 0..1 枝条染色进度
   varying vec3 vN; varying vec3 vW; varying float vAO; varying float vAlong; // vAlong=沿枝长0..1
   void main(){
     vec3 n = normalize(vN);
     float shade = n.y > 0.5 ? uTop : (dot(n, normalize(vec3(1.,0.,-1.))) > 0. ? uLeft : uRight);
     float grad = mix(0.94, 1.04, clamp(vW.y / 2.0, 0., 1.)); // 自下而上的整体渐变(纪念碑谷的渐变叠层)
     vec3 plaster = vec3(0.957, 0.949, 0.933);
     vec3 col = mix(plaster, uBase, step(vAlong, uGrow));   // 染色从根推进到梢
     col *= shade * grad * mix(0.82, 1.0, vAO);              // 顶点 AO
     col = mix(col, uSkyTint, 0.08);
     gl_FragColor = vec4(col, 1.0);
   }
   ```
   - 三档明度只用于平面化的部件：底座和棱柱枝条。叶子用平滑一点的方式：`shade = mix(uRight, uTop, n.y * 0.5 + 0.5)`。
   - 顶点 AO 在生成几何体时计算：分叉处、底座和树干的交接处压暗 18%。这样不需要 SSAO，开销为零。
4. **叶子**：一个 `InstancedMesh`，容量 400，覆盖 360 多个词并留出余量。每个实例写入 `setColorAt` 颜色，矩阵通过 dummy Object3D 写入。
   - 新叶落地动画：在 `useFrame` 里用弹簧推进 scale，从 0 到 1.12 再回到 1，同时朝着叶片法线方向做 4° 的摆动。
   - 风：在顶点着色器里做 `sin(time*0.8 + instanceId*1.7) * 0.015` 的轻微摆动。reduced motion 打开时关闭。
5. **接触阴影**：用 drei 的 `<ContactShadows position={[0,-0.2,0]} scale={2.4} blur={2.6} far={1} opacity={0.18} color={deepOfSky} frames={1} />`。只渲染 1 帧；树长出新枝之后调用一次更新。
   - 不用 `castShadow` 实时阴影，也不用 SSAO，N8AO 只作为可选的后备方案。
6. **备选路线（哑光陶土 PBR）**：只在平面渐变路线看起来太「平」的时候才试。
   - 材质：`MeshStandardMaterial({ roughness: 1, metalness: 0 })`。
   - 灯光：`HemisphereLight(skyTop, '#FFFFFF', 1.1)`，加一盏 `DirectionalLight` 强度 1.4、位置 (4, 8, 3)。
   - 阴影：`AccumulativeShadows temporal frames={60}` 配 `RandomizedLight amount={6}`。
   - 色调映射：`toneMapping = AgX`，曝光 1.0。
   - 后处理：N8AO，`aoRadius` 0.3，强度 1.5，配 SMAA。
7. **几何生成**：自己写 L-system 或者递归分叉，用 seed 等于词根 id，保证同一个人每次看到的树形状一样。不要直接套用 ez-tree 的写实预设；它的参数思路（分段数、锥度、枝角）可以借鉴。
8. **性能**：draw call 控制在 12 个以内，包括底座、树干和枝条合并后的网格、叶子 InstancedMesh、接触阴影。
   - three 相关代码懒加载，用 `React.lazy` 拆包。首屏只放一张静态 PNG，在发现页作为小树剪影显示。
   - 目标：中端手机 60fps，首屏 JS ≤ 180KB（gzip）。
9. **截图「保存为版画」**：设置 `preserveDrawingBuffer: false`，导出时单独渲染一次，尺寸 2400×3200。再用 2D canvas 叠上天空渐变、暗角、纸纹，以及左下角的 *Word Root Atlas · 12/42*。

---
## 6. 移动端要点
- 顶部导航改为底部的 3 个标签栏，高 56px 加安全区。图标是线性的 SF Symbols 风格，配 10px 文字。
- 发现页的输入框固定在上方 1/3 处。键盘弹起时，卡片区可以滚动，输入框保持可见。
- 卡片全宽显示。显影动画不变，叶子飞入的目标改成底部标签栏的「树」图标，图标同时弹跳一下（spring 0.4 / 0.4）。
- 树页：单指旋转，双指缩放，不支持平移。信息板缩成顶部的一行光谱条。
- 图鉴页每行 2 列，间距 12px。
- 触控目标不小于 44×44。
- 设备支持时，在显影结束和家族收齐两个时刻调用 `navigator.vibrate(10)`。iOS 不支持这个接口，那就算了。

---
## 7. 验收标准（每一版自查，截图对照）
1. **挂墙测试**：发现结果、树、图鉴这三屏各截一张图，必须能直接当海报用。拿不准时，把截图放在纪念碑谷的截图旁边对比。
2. **眯眼测试**：截图转成灰度后，层级仍然清楚。
3. **彩虹测试**：图鉴页收齐 42 个之后，看起来是一条均匀的光谱；树从顶视图看是一个色环。
4. **棕色测试**：整页任何一块大于 2% 面积的区域，都不能是「暗的低彩暖色」，也就是 OKLCH 的 L<0.6、C<0.08、H 在 30–90° 之间。
5. **水龙头测试**：找一个从没见过这个产品的人，10 秒内完成第一次查词，全程不需要讲解。
6. **对比度**：所有文字 ≥ 4.5:1，大字 ≥ 3:1。
7. **性能**：中端机上树页稳定 60fps；首次解锁从回车到显影开始 ≤ 400ms。

---
## 8. 绝对不做
- ❌ 任何棕色、米黄色、土色的大面积 UI，包括「复古纸」底色。
- ❌ 拿词根 accent 当文字色。文字一律用 deep 或 ink。
- ❌ 一个画面里出现两个以上词根的 accent，树页的色环除外，因为那是作品本身。
- ❌ 所有卡片共用同一个底座或场景模板。
- ❌ 写实的树、深棕色的树干、像硬币一样的圆片叶子，以及透视相机拉得很近的镜头。
- ❌ 3D 物体没有完整入镜，或者四周留白不足 35%。
- ❌ 黑色的实时硬阴影、高光反射、塑料质感、ACES 把粉彩压暗。
- ❌ 首屏放教程弹窗、功能介绍、统计数字或横幅。
- ❌ 每次查看都重播完整的解锁仪式；或者普通事件也配音效和粒子。
- ❌ emoji 图标、渐变按钮、霓虹发光、玻璃拟态叠了很多层。
- ❌ 一屏超过 3 种字号，或者超过 2 种字体家族（衬线和无衬线各一种）。
- ❌ 内容只放一列，右侧空出一大片；栅格必须随视口自适应。
- ❌ 在 RGB 或 HSL 空间里做颜色插值或生成颜色。一律用 OKLCH。

---
## 9. 给工程师的落地顺序
1. **白盒**：先删掉旧的 palettes 和 soil 颜色，接入 `rootColors.ts` 和中性 token，把三屏的版式用灰块搭出来，然后截图过一遍眯眼测试和水龙头测试。
2. **树**：正交相机加 FlatGradientMaterial，再做程序化的枝条和叶子 InstancedMesh、接触阴影，以及「方位角等于色相角」的布局。截顶视图检查是不是一个色环。
3. **仪式**：依次做字母拆分、卡片显影、叶子飞入、枝条染色、天空换色，最后做家族收齐。
4. **插画**：按 1.3 节的提示词模板，重新生成 42 张图，然后做彩虹审查。
5. **打磨**：移动端、reduced motion、音效、保存为版画。
