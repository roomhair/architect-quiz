# 建築家あてクイズ

建築の写真を見て、設計した建築家を13人の中から当てるクイズサイト。
ビルド不要の静的サイト（HTML / CSS / 素の JavaScript）。

## 使い方

`index.html` をブラウザで開くだけ。ローカルサーバを立てるなら:

```
python3 -m http.server 8000
# → http://localhost:8000
```

配布・共有には `dist/architect-quiz.html` を使う。CSS と JS を埋め込んだ1ファイル版で、
ダブルクリックするだけで動く。`js/data.js` などを編集したら作り直すこと:

```
node build-standalone.js
```

出題数は 10問 / 20問 / 全39問 から選べる。同じ建築家に偏らないよう、
建築家ごとに1問ずつ取っていく順で候補を作ってからシャッフルしている。

キーボードでも解答できる（`A S D F G H J K L Z X C V` が13人に対応、`Enter` で次へ）。
右上のボタンでライト／ダーク配色を切り替え（設定は localStorage に保存）。

## 公開（GitHub Pages）

`.github/workflows/pages.yml` がリポジトリの中身をそのまま GitHub Pages にデプロイする。
公開URLは:

```
https://roomhair.github.io/architect-quiz/
```

公開するには、先に次の2つをリポジトリの設定画面で済ませておく必要がある。

1. **Settings → General → Danger Zone → Change visibility** で public にする
   （private リポジトリからの Pages 公開は有料プラン限定のため）
2. **Settings → Pages → Build and deployment → Source** を **GitHub Actions** にする

ワークフローは `build`（全ブランチ）と `deploy`（`main` のみ）に分かれている。
Pages 環境は既定でデフォルトブランチからのデプロイしか許可しないため、
実際に公開するには変更を `main` にマージする。

ワークフローは、`dist/architect-quiz.html` が最新のソースから作り直された状態かどうかも
確認する。`js/data.js` などを編集したら `node build-standalone.js` を実行してコミットすること。

## 出題される建築家（13人）

隈研吾 / 安藤忠雄 / SANAA / 伊東豊雄 / 坂茂 / 原広司 / 内藤廣 / 藤本壮介 /
槇文彦 / 丹下健三 / フランク・ロイド・ライト / ル・コルビュジエ / ミース・ファン・デル・ローエ

各建築家3問ずつ、計39問。

## 写真について

写真はリポジトリに同梱していない。各問題に紐づけた Wikipedia 記事の代表画像を、
出題時に Wikipedia の REST API（`/api/rest_v1/page/summary/`）から取得している。
日本語版で見つからなければ英語版を試し、どちらも取れなければ
「写真を読み込めませんでした」と表示して、その問題はそのまま進む。
取得した URL はセッション中 `sessionStorage` にキャッシュし、次の問題の画像は先読みする。

そのため、**初回の表示にはネットワーク接続が必要**。著作権は各撮影者に帰属する。

### 写真を自分で用意して差し替える

`js/data.js` の各問題の `image` に URL か相対パスを書くと、そちらが最優先で使われ、
Wikipedia への問い合わせは行われない。

```js
{
  id: 'tange-1', architect: 'tange',
  image: 'images/yoyogi.jpg',        // ← ここを書くだけ
  title: '国立代々木競技場', year: 1964, place: '東京都渋谷区',
  ...
}
```

すべての問題に `image` を入れれば、完全にオフラインで動く。

## 問題を追加・編集する

`js/data.js` の `QUESTIONS` に要素を足すだけ。

| フィールド | 内容 |
| --- | --- |
| `id` | 一意な識別子（画像キャッシュのキーにも使う） |
| `architect` | `ARCHITECTS` の `id`（正解） |
| `image` | 画像の URL / 相対パス。空なら Wikipedia から取得 |
| `title` / `year` / `place` | 解答後に表示する建築名・竣工年・所在地 |
| `wiki.ja` / `wiki.en` | 画像取得に使う Wikipedia の記事名 |
| `note` | 解答後に表示する一言解説 |

建築家を増やす場合は `ARCHITECTS` に足す。ボタンの並びと表示順はこの配列の順どおり。
14人以上にするとキーボードショートカットの割り当て（`app.js` の `KEYS`）が足りなくなるので、
必要なら合わせて増やすこと。

## ファイル構成

```
index.html      3画面（スタート / 出題 / 結果）のマークアップ
css/style.css   配色トークン、レイアウト、ライト・ダーク両対応
js/data.js      建築家13人と問題39問のデータ
js/app.js       出題ロジック、画像取得、採点、結果表示
images/         自前の写真を置く場所（初期状態では空）
dist/           1ファイル版の出力先
build-standalone.js  css/js を index.html に埋め込んで dist/ に書き出す
.github/workflows/pages.yml  GitHub Pages への自動デプロイ
```
