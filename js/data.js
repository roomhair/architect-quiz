/**
 * 建築家クイズのデータ定義
 *
 * ARCHITECTS: 解答ボタンとして並ぶ13人。表示順はそのままボタンの並び順になる。
 * QUESTIONS : 出題される建築物。architect は ARCHITECTS の id と対応させる。
 *
 * 画像について
 *   image を指定するとその URL / 相対パス（例: "images/yoyogi.jpg"）を最優先で使う。
 *   空のままなら wiki.ja → wiki.en の順に Wikipedia の REST API を叩き、
 *   記事の代表画像を取得して出題する。差し替えたい問題だけ image を書けばよい。
 */

const ARCHITECTS = [
  { id: 'kuma',   name: '隈研吾',                 reading: 'くま けんご',        years: '1954–' },
  { id: 'ando',   name: '安藤忠雄',               reading: 'あんどう ただお',    years: '1941–' },
  { id: 'sanaa',  name: 'SANAA',                  reading: 'サナア',              years: '1995–' },
  { id: 'ito',    name: '伊東豊雄',               reading: 'いとう とよお',      years: '1941–' },
  { id: 'ban',    name: '坂茂',                   reading: 'ばん しげる',        years: '1957–' },
  { id: 'hara',   name: '原広司',                 reading: 'はら ひろし',        years: '1936–' },
  { id: 'naito',  name: '内藤廣',                 reading: 'ないとう ひろし',    years: '1950–' },
  { id: 'fujimoto', name: '藤本壮介',             reading: 'ふじもと そうすけ',  years: '1971–' },
  { id: 'maki',   name: '槇文彦',                 reading: 'まき ふみひこ',      years: '1928–2024' },
  { id: 'tange',  name: '丹下健三',               reading: 'たんげ けんぞう',    years: '1913–2005' },
  { id: 'wright', name: 'フランク・ロイド・ライト', reading: 'F. L. Wright',      years: '1867–1959' },
  { id: 'corbu',  name: 'ル・コルビュジエ',       reading: 'Le Corbusier',       years: '1887–1965' },
  { id: 'mies',   name: 'ミース・ファン・デル・ローエ', reading: 'Mies van der Rohe', years: '1886–1969' },
];

const QUESTIONS = [
  // ── 隈研吾 ──────────────────────────────────────────────
  {
    id: 'kuma-1', architect: 'kuma', image: '',
    title: '国立競技場', year: 2019, place: '東京都新宿区',
    wiki: { ja: '国立競技場', en: 'Japan National Stadium' },
    note: '47都道府県から集めた杉材で庇を編み、「杜のスタジアム」を掲げた。木と鉄骨のハイブリッド屋根が特徴。',
  },
  {
    id: 'kuma-2', architect: 'kuma', image: '',
    title: '浅草文化観光センター', year: 2012, place: '東京都台東区',
    wiki: { ja: '浅草文化観光センター', en: 'Asakusa Culture Tourist Information Center' },
    note: '平屋の家を8層積み上げたような外観。斜めの屋根がそのまま各階の天井になっている。',
  },
  {
    id: 'kuma-3', architect: 'kuma', image: '',
    title: '根津美術館', year: 2009, place: '東京都港区',
    wiki: { ja: '根津美術館', en: 'Nezu Museum' },
    note: '大屋根と竹の並ぶアプローチ。表参道の喧噪から庭園へ人を導く「負ける建築」の実践例。',
  },

  // ── 安藤忠雄 ────────────────────────────────────────────
  {
    id: 'ando-1', architect: 'ando', image: '',
    title: '光の教会', year: 1989, place: '大阪府茨木市',
    wiki: { ja: '茨木春日丘教会', en: 'Church of the Light' },
    note: 'コンクリートの箱の正面に穿たれた十字のスリット。開口そのものが祭壇となる。',
  },
  {
    id: 'ando-2', architect: 'ando', image: '',
    title: '地中美術館', year: 2004, place: '香川県直島町',
    wiki: { ja: '地中美術館', en: 'Chichu Art Museum' },
    note: '景観を守るため建物の大半を地中に埋めた。三角形・正方形の中庭から自然光だけを落とす。',
  },
  {
    id: 'ando-3', architect: 'ando', image: '',
    title: '表参道ヒルズ', year: 2006, place: '東京都渋谷区',
    wiki: { ja: '表参道ヒルズ', en: 'Omotesando Hills' },
    note: '同潤会青山アパートの建て替え。ケヤキ並木に合わせて高さを抑え、内部は参道と同じ勾配のスロープ。',
  },

  // ── SANAA ──────────────────────────────────────────────
  {
    id: 'sanaa-1', architect: 'sanaa', image: '',
    title: '金沢21世紀美術館', year: 2004, place: '石川県金沢市',
    wiki: { ja: '金沢21世紀美術館', en: '21st Century Museum of Contemporary Art, Kanazawa' },
    note: '正面のない円形のガラス平屋。どこからでも入れる「まちに開かれた公園のような美術館」。',
  },
  {
    id: 'sanaa-2', architect: 'sanaa', image: '',
    title: 'ロレックス・ラーニングセンター', year: 2010, place: 'スイス・ローザンヌ',
    wiki: { ja: 'ロレックス・ラーニングセンター', en: 'Rolex Learning Center' },
    note: '床と屋根が一体で波打つ一枚のスラブ。壁で仕切らず、地形の起伏で場所を分ける。',
  },
  {
    id: 'sanaa-3', architect: 'sanaa', image: '',
    title: 'ルーヴル・ランス', year: 2012, place: 'フランス・ランス',
    wiki: { ja: 'ルーヴル・ランス', en: 'Louvre-Lens' },
    note: '炭鉱跡地に置かれた、アルミで鈍く風景を映す低層の列。周囲がぼんやりと壁面に溶ける。',
  },

  // ── 伊東豊雄 ────────────────────────────────────────────
  {
    id: 'ito-1', architect: 'ito', image: '',
    title: 'せんだいメディアテーク', year: 2001, place: '宮城県仙台市',
    wiki: { ja: 'せんだいメディアテーク', en: 'Sendai Mediatheque' },
    note: '13本のねじれたチューブが床を支える。柱・壁・設備を一体化した「海藻」のような構造。',
  },
  {
    id: 'ito-2', architect: 'ito', image: '',
    title: '台中国家歌劇院', year: 2016, place: '台湾・台中市',
    wiki: { ja: '台中国家歌劇院', en: 'National Taichung Theater' },
    note: '直線の柱梁を持たない「洞窟」。曲面の壁が連続して内外をつなぐカーブド・ウォール構法。',
  },
  {
    id: 'ito-3', architect: 'ito', image: '',
    title: '大館樹海ドーム', year: 1997, place: '秋田県大館市',
    wiki: { ja: '大館樹海ドーム', en: 'Odate Jukai Dome' },
    note: '秋田杉の集成材による木造ドーム。楕円形の屋根が地面すれすれまで下りてくる。',
  },

  // ── 坂茂 ────────────────────────────────────────────────
  {
    id: 'ban-1', architect: 'ban', image: '',
    title: 'ポンピドゥー・センター・メス', year: 2010, place: 'フランス・メス',
    wiki: { ja: 'ポンピドゥー・センター・メス', en: 'Centre Pompidou-Metz' },
    note: '中国の編み笠から着想した六角格子の木造屋根を、テフロン膜で覆う。',
  },
  {
    id: 'ban-2', architect: 'ban', image: '',
    title: '静岡県富士山世界遺産センター', year: 2017, place: '静岡県富士宮市',
    wiki: { ja: '静岡県富士山世界遺産センター', en: 'Mount Fuji World Heritage Centre' },
    note: '逆さにした富士を格子で組み、水盤に映すと正しい富士の姿が現れる。',
  },
  {
    id: 'ban-3', architect: 'ban', image: '',
    title: '大分県立美術館', year: 2015, place: '大分県大分市',
    wiki: { ja: '大分県立美術館', en: 'Oita Prefectural Art Museum' },
    note: '1階の水平折戸を開けると、街路と展示空間が地続きになる。竹編みを想わせるファサード。',
  },

  // ── 原広司 ──────────────────────────────────────────────
  {
    id: 'hara-1', architect: 'hara', image: '',
    title: '梅田スカイビル', year: 1993, place: '大阪府大阪市',
    wiki: { ja: '梅田スカイビル', en: 'Umeda Sky Building' },
    note: '2棟の超高層を最上部の空中庭園展望台で連結。地上で組んだ橋を吊り上げて架けた。',
  },
  {
    id: 'hara-2', architect: 'hara', image: '',
    title: '京都駅ビル', year: 1997, place: '京都府京都市',
    wiki: { ja: '京都駅', en: 'Kyoto Station' },
    note: '全長470mの巨大なコンコースを「地上の谷」に見立て、大階段が空へ抜ける。',
  },
  {
    id: 'hara-3', architect: 'hara', image: '',
    title: '札幌ドーム', year: 2001, place: '北海道札幌市',
    wiki: { ja: '札幌ドーム', en: 'Sapporo Dome' },
    note: '天然芝のサッカーステージが屋外から丸ごと滑り込む、世界初のホヴァリングサッカーステージ。',
  },

  // ── 内藤廣 ──────────────────────────────────────────────
  {
    id: 'naito-1', architect: 'naito', image: '',
    title: '高知駅', year: 2008, place: '高知県高知市',
    wiki: { ja: '高知駅', en: 'Kōchi Station' },
    note: '「くじらドーム」と呼ばれる大断面集成材のアーチが、ホーム全体を一息に覆う。',
  },
  {
    id: 'naito-2', architect: 'naito', image: '',
    title: '島根県芸術文化センター グラントワ', year: 2005, place: '島根県益田市',
    wiki: { ja: '島根県芸術文化センター', en: 'Iwami Art Museum' },
    note: '約28万枚の石州瓦で壁と屋根をすべて覆う。中央に大きな芝生の中庭を抱く。',
  },
  {
    id: 'naito-3', architect: 'naito', image: '',
    title: '日向市駅', year: 2008, place: '宮崎県日向市',
    wiki: { ja: '日向市駅', en: 'Hyūga-shi Station' },
    note: '飫肥杉の柱列がホームを支える高架駅。木の駅舎という発想を全国に広げた。',
  },

  // ── 藤本壮介 ────────────────────────────────────────────
  {
    id: 'fujimoto-1', architect: 'fujimoto', image: '',
    title: '大屋根リング（大阪・関西万博）', year: 2025, place: '大阪府大阪市',
    wiki: { ja: '大屋根リング', en: 'Grand Ring' },
    note: '周長約2kmの木造リング。貫（ぬき）による伝統的な木組みを現代の大架構に持ち込んだ。',
  },
  {
    id: 'fujimoto-2', architect: 'fujimoto', image: '',
    title: '白井屋ホテル', year: 2020, place: '群馬県前橋市',
    wiki: { ja: '白井屋ホテル', en: 'Shiroiya Hotel' },
    note: '旧旅館の床を抜いて4層吹き抜けを作り、隣に草に覆われた人工の丘を積む。',
  },
  {
    id: 'fujimoto-3', architect: 'fujimoto', image: '',
    title: 'サーペンタイン・パビリオン 2013', year: 2013, place: 'イギリス・ロンドン',
    wiki: { ja: 'サーペンタイン・ギャラリー', en: 'Serpentine Pavilion' },
    note: '細い白鋼のグリッドを雲のように積層した仮設パビリオン。境界が曖昧な「あいだ」の空間。',
  },

  // ── 槇文彦 ──────────────────────────────────────────────
  {
    id: 'maki-1', architect: 'maki', image: '',
    title: '幕張メッセ', year: 1989, place: '千葉県千葉市',
    wiki: { ja: '幕張メッセ', en: 'Makuhari Messe' },
    note: '緩やかに湾曲した金属の大屋根が連なる。巨大施設をあくまで軽やかに見せる。',
  },
  {
    id: 'maki-2', architect: 'maki', image: '',
    title: '東京体育館', year: 1990, place: '東京都渋谷区',
    wiki: { ja: '東京体育館', en: 'Tokyo Metropolitan Gymnasium' },
    note: '兜のようなステンレスの屋根。ボリュームの多くを地下に沈め、街に対して低く構える。',
  },
  {
    id: 'maki-3', architect: 'maki', image: '',
    title: '4 ワールドトレードセンター', year: 2013, place: 'アメリカ・ニューヨーク',
    wiki: { ja: '4 ワールドトレードセンター', en: '4 World Trade Center' },
    note: '装飾を排したミニマルなガラスの角柱。空を映して姿を消すことを目指した超高層。',
  },

  // ── 丹下健三 ────────────────────────────────────────────
  {
    id: 'tange-1', architect: 'tange', image: '',
    title: '国立代々木競技場', year: 1964, place: '東京都渋谷区',
    wiki: { ja: '国立代々木競技場', en: 'Yoyogi National Gymnasium' },
    note: '吊り屋根構造による貝殻状のシルエット。東京五輪のために構造と造形を一体で解いた。',
  },
  {
    id: 'tange-2', architect: 'tange', image: '',
    title: '東京都庁舎', year: 1991, place: '東京都新宿区',
    wiki: { ja: '東京都庁舎', en: 'Tokyo Metropolitan Government Building' },
    note: '第一本庁舎は高さ243m、頂部で2つに分かれるツインタワー。外装割付はゴシック大聖堂の引用とも。',
  },
  {
    id: 'tange-3', architect: 'tange', image: '',
    title: '広島平和記念資料館', year: 1955, place: '広島県広島市',
    wiki: { ja: '広島平和記念資料館', en: 'Hiroshima Peace Memorial Museum' },
    note: 'ピロティで持ち上げた本館の下を抜けると、慰霊碑・原爆ドームが一直線に並ぶ。',
  },

  // ── フランク・ロイド・ライト ────────────────────────────
  {
    id: 'wright-1', architect: 'wright', image: '',
    title: '落水荘（カウフマン邸）', year: 1936, place: 'アメリカ・ペンシルベニア州',
    wiki: { ja: '落水荘', en: 'Fallingwater' },
    note: '滝の上にキャンチレバーのテラスを何層も張り出す。有機的建築の代表作。',
  },
  {
    id: 'wright-2', architect: 'wright', image: '',
    title: 'ソロモン・R・グッゲンハイム美術館', year: 1959, place: 'アメリカ・ニューヨーク',
    wiki: { ja: 'ソロモン・R・グッゲンハイム美術館', en: 'Solomon R. Guggenheim Museum' },
    note: '上に向かって広がる逆円錐。内部は途切れない螺旋スロープが展示室そのものになる。',
  },
  {
    id: 'wright-3', architect: 'wright', image: '',
    title: '自由学園明日館', year: 1921, place: '東京都豊島区',
    wiki: { ja: '自由学園明日館', en: 'Jiyu Gakuen Girls’ School' },
    note: '中央棟を低く抑え、左右に翼を広げるプレーリースタイル。幾何学的な窓割りが目印。',
  },

  // ── ル・コルビュジエ ────────────────────────────────────
  {
    id: 'corbu-1', architect: 'corbu', image: '',
    title: 'サヴォア邸', year: 1931, place: 'フランス・ポワシー',
    wiki: { ja: 'サヴォア邸', en: 'Villa Savoye' },
    note: 'ピロティ・屋上庭園・自由な平面・自由な立面・水平連続窓——近代建築の五原則の完成形。',
  },
  {
    id: 'corbu-2', architect: 'corbu', image: '',
    title: 'ロンシャンの礼拝堂', year: 1955, place: 'フランス・ロンシャン',
    wiki: { ja: 'ロンシャンの礼拝堂', en: 'Notre-Dame du Haut' },
    note: '反り上がる分厚い屋根と、深く穿たれた不規則な窓。合理主義から彫塑的表現への転回点。',
  },
  {
    id: 'corbu-3', architect: 'corbu', image: '',
    title: '国立西洋美術館', year: 1959, place: '東京都台東区',
    wiki: { ja: '国立西洋美術館', en: 'National Museum of Western Art' },
    note: '「無限成長美術館」の構想を実現した唯一の作例。日本にある唯一の彼の建築。',
  },

  // ── ミース・ファン・デル・ローエ ────────────────────────
  {
    id: 'mies-1', architect: 'mies', image: '',
    title: 'バルセロナ・パビリオン', year: 1929, place: 'スペイン・バルセロナ',
    wiki: { ja: 'バルセロナ・パビリオン', en: 'Barcelona Pavilion' },
    note: '薄い屋根と独立した壁だけ。オニキスや大理石の面が空間を仕切らずに流れをつくる。',
  },
  {
    id: 'mies-2', architect: 'mies', image: '',
    title: 'ファンズワース邸', year: 1951, place: 'アメリカ・イリノイ州',
    wiki: { ja: 'ファンズワース邸', en: 'Farnsworth House' },
    note: '白い鉄骨で地面から浮かせた全面ガラスの一室空間。「Less is more」の極点。',
  },
  {
    id: 'mies-3', architect: 'mies', image: '',
    title: 'シーグラム・ビルディング', year: 1958, place: 'アメリカ・ニューヨーク',
    wiki: { ja: 'シーグラム・ビルディング', en: 'Seagram Building' },
    note: 'ブロンズ色のカーテンウォールとH形鋼のマリオン。前面のプラザは以後の超高層の規範に。',
  },
];
