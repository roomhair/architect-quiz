'use strict';

/* =========================================================
   建築家あてクイズ
   ========================================================= */

const $ = (id) => document.getElementById(id);
const byId = Object.fromEntries(ARCHITECTS.map((a) => [a.id, a]));
const KEYS = 'ASDFGHJKLZXCV'.split(''); // 選択肢1〜13に割り当てるショートカット

const state = {
  queue: [],       // 出題する問題の配列
  index: 0,
  answers: [],     // { question, picked, correct }
  answered: false,
  requestedCount: 10,
};

/* ---------- 画像の取得 ------------------------------------
   image が指定されていればそれを使う。無ければ Wikipedia の
   REST API から記事の代表画像を引く（ja → en の順）。
   結果は sessionStorage にキャッシュする。            */

const IMG_CACHE_KEY = 'archquiz.img.v1';
const imgCache = loadCache();

function loadCache() {
  try { return JSON.parse(sessionStorage.getItem(IMG_CACHE_KEY)) || {}; }
  catch (_) { return {}; }
}
function saveCache() {
  try { sessionStorage.setItem(IMG_CACHE_KEY, JSON.stringify(imgCache)); }
  catch (_) { /* プライベートモード等では黙って諦める */ }
}

// サムネイルURLの幅指定（.../320px-Foo.jpg）を大きめに書き換える
function upscale(url) {
  return url.replace(/\/\d{2,4}px-/, '/1280px-');
}

async function fetchWikiImage(lang, title) {
  const endpoint = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const res = await fetch(endpoint, { headers: { Accept: 'application/json' } });
  if (!res.ok) return null;
  const data = await res.json();
  const src = (data.thumbnail && data.thumbnail.source) ||
              (data.originalimage && data.originalimage.source);
  if (!src) return null;
  return {
    url: upscale(src),
    page: (data.content_urls && data.content_urls.desktop && data.content_urls.desktop.page) ||
          `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title)}`,
    label: lang === 'ja' ? 'Wikipedia（日本語）' : 'Wikipedia (English)',
  };
}

async function resolveImage(q) {
  if (q.image) return { url: q.image, page: null, label: null };
  if (imgCache[q.id]) return imgCache[q.id];

  const candidates = [['ja', q.wiki && q.wiki.ja], ['en', q.wiki && q.wiki.en]];
  for (const [lang, title] of candidates) {
    if (!title) continue;
    try {
      const found = await fetchWikiImage(lang, title);
      if (found) { imgCache[q.id] = found; saveCache(); return found; }
    } catch (_) { /* 次の候補へ */ }
  }
  return null;
}

// 次の問題の画像を先読みして待ち時間を減らす
function prefetch(q) {
  if (!q) return;
  resolveImage(q).then((info) => {
    if (info) { const im = new Image(); im.src = info.url; }
  }).catch(() => {});
}

/* ---------- ユーティリティ ---------- */

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// できるだけ建築家が偏らないように出題を選ぶ
function pickQuestions(count) {
  const byArchitect = new Map();
  for (const q of shuffle(QUESTIONS)) {
    if (!byArchitect.has(q.architect)) byArchitect.set(q.architect, []);
    byArchitect.get(q.architect).push(q);
  }
  const groups = shuffle([...byArchitect.values()]);
  const picked = [];
  let round = 0;
  while (picked.length < QUESTIONS.length) {
    let added = false;
    for (const g of groups) {
      if (g[round]) { picked.push(g[round]); added = true; }
    }
    if (!added) break;
    round++;
  }
  const total = count > 0 ? Math.min(count, picked.length) : picked.length;
  return shuffle(picked.slice(0, total));
}

function showScreen(name) {
  for (const s of ['start', 'quiz', 'result']) {
    $(`screen-${s}`).hidden = (s !== name);
  }
  window.scrollTo(0, 0);
}

/* ---------- スタート画面 ---------- */

function renderRoster() {
  $('roster-list').innerHTML = ARCHITECTS
    .map((a) => `<li>${a.name}<span>${a.years}</span></li>`)
    .join('');
}

function initStart() {
  renderRoster();
  document.querySelectorAll('.seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.seg-btn').forEach((b) => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-checked', String(b === btn));
      });
      state.requestedCount = Number(btn.dataset.count);
    });
  });
  $('btn-start').addEventListener('click', startQuiz);
}

/* ---------- 出題 ---------- */

function startQuiz() {
  state.queue = pickQuestions(state.requestedCount);
  state.index = 0;
  state.answers = [];
  showScreen('quiz');
  renderChoices();
  renderQuestion();
}

function renderChoices() {
  const box = $('choices');
  box.innerHTML = '';
  ARCHITECTS.forEach((a, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice';
    btn.dataset.architect = a.id;
    btn.innerHTML = `<span class="key">${KEYS[i] || ''}</span>${a.name}`;
    btn.addEventListener('click', () => answer(a.id));
    box.appendChild(btn);
  });
}

function resetChoices() {
  document.querySelectorAll('.choice').forEach((btn) => {
    btn.disabled = false;
    btn.classList.remove('is-correct', 'is-wrong', 'is-dim');
  });
}

async function renderQuestion() {
  const q = state.queue[state.index];
  state.answered = false;

  $('progress-text').textContent = `${state.index + 1} / ${state.queue.length}`;
  $('score-text').textContent = `正解 ${state.answers.filter((a) => a.correct).length}`;
  $('progress-fill').style.width = `${(state.index / state.queue.length) * 100}%`;

  $('verdict').hidden = true;
  $('photo-caption').hidden = true;
  resetChoices();

  const frame = $('photo-frame');
  const img = $('photo-img');
  frame.classList.remove('is-ready');
  frame.classList.add('is-loading');
  img.removeAttribute('src');
  $('photo-status').innerHTML = '<span class="spinner"></span>';

  const token = q.id;                       // 読み込み中に次へ進んだ場合の取り違え防止
  const info = await resolveImage(q);
  if (state.queue[state.index].id !== token) return;

  if (!info) { failPhoto('写真を読み込めませんでした。<br>オフラインの可能性があります。'); return; }

  img.onload = () => {
    if (state.queue[state.index].id !== token) return;
    frame.classList.remove('is-loading');
    frame.classList.add('is-ready');
  };
  img.onerror = () => {
    if (state.queue[state.index].id !== token) return;
    failPhoto('写真を読み込めませんでした。');
  };
  img.src = info.url;
  q._source = info;

  prefetch(state.queue[state.index + 1]);
}

function failPhoto(message) {
  const frame = $('photo-frame');
  frame.classList.remove('is-ready');
  $('photo-status').innerHTML = message;
}

/* ---------- 解答 ---------- */

function answer(architectId) {
  if (state.answered) return;
  state.answered = true;

  const q = state.queue[state.index];
  const correct = architectId === q.architect;
  state.answers.push({ question: q, picked: architectId, correct });

  document.querySelectorAll('.choice').forEach((btn) => {
    btn.disabled = true;
    const id = btn.dataset.architect;
    if (id === q.architect) btn.classList.add('is-correct');
    else if (id === architectId) btn.classList.add('is-wrong');
    else btn.classList.add('is-dim');
  });

  const line = $('verdict-line');
  line.textContent = correct ? '正解' : `不正解 — 正解は ${byId[q.architect].name}`;
  line.className = `verdict-line ${correct ? 'ok' : 'ng'}`;

  $('detail-title').textContent = q.title;
  $('detail-meta').textContent = `${byId[q.architect].name}／${q.year}年／${q.place}`;
  $('detail-note').textContent = q.note;

  const link = $('detail-link');
  const page = q._source && q._source.page;
  link.hidden = !page;
  if (page) link.href = page;

  // 出典表示は解答後に（記事名が答えのヒントになるため）
  if (q._source && q._source.page) {
    const cap = $('photo-caption');
    cap.innerHTML = `写真: <a href="${q._source.page}" target="_blank" rel="noopener">${q._source.label}</a> より`;
    cap.hidden = false;
  }

  $('score-text').textContent = `正解 ${state.answers.filter((a) => a.correct).length}`;
  $('progress-fill').style.width = `${((state.index + 1) / state.queue.length) * 100}%`;

  $('verdict').hidden = false;
  $('btn-next').textContent = state.index === state.queue.length - 1 ? '結果を見る' : '次の問題へ';
  $('btn-next').focus();
}

function next() {
  if (!state.answered) return;
  if (state.index === state.queue.length - 1) { showResult(); return; }
  state.index++;
  renderQuestion();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- 結果 ---------- */

function showResult() {
  const total = state.answers.length;
  const correct = state.answers.filter((a) => a.correct).length;
  const rate = correct / total;

  const grades = [
    [0.999, '巨匠', '全問正解。もはや設計者本人では。'],
    [0.8,   '建築通', 'ディテールまでよく見えています。'],
    [0.6,   '愛好家', '主要作はしっかり押さえています。'],
    [0.4,   '見習い', '素材と輪郭に注目すると見分けやすくなります。'],
    [0,     '初学者', 'まずは代表作から。もう一周してみましょう。'],
  ];
  const [, rank, comment] = grades.find(([min]) => rate >= min);

  $('result-rank').textContent = rank;
  $('result-correct').textContent = correct;
  $('result-total').textContent = total;
  $('result-comment').textContent = comment;

  $('review-list').innerHTML = state.answers.map(({ question: q, picked, correct: ok }) => `
    <li>
      <span class="mark ${ok ? 'ok' : 'ng'}">${ok ? '○' : '×'}</span>
      <span class="review-body">
        <span class="review-title">${q.title}</span><br>
        <span class="review-sub">${byId[q.architect].name}${
          ok ? '' : ` — 回答: <span class="picked">${byId[picked].name}</span>`
        }</span>
      </span>
    </li>`).join('');

  showScreen('result');
}

/* ---------- テーマ ---------- */

function initTheme() {
  const saved = (() => { try { return localStorage.getItem('archquiz.theme'); } catch (_) { return null; } })();
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = saved || (prefersDark ? 'dark' : 'light');

  $('theme-toggle').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('archquiz.theme', next); } catch (_) {}
  });
}

/* ---------- キーボード ---------- */

function initKeyboard() {
  document.addEventListener('keydown', (e) => {
    if ($('screen-quiz').hidden || e.metaKey || e.ctrlKey || e.altKey) return;
    if (state.answered) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); }
      return;
    }
    const i = KEYS.indexOf(e.key.toUpperCase());
    if (i >= 0 && ARCHITECTS[i]) { e.preventDefault(); answer(ARCHITECTS[i].id); }
  });
}

/* ---------- 起動 ---------- */

initTheme();
initStart();
initKeyboard();
$('btn-next').addEventListener('click', next);
$('btn-retry').addEventListener('click', startQuiz);
$('btn-home').addEventListener('click', () => showScreen('start'));
