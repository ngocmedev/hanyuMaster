/**
 * APP STATE
 */
let decks = JSON.parse(localStorage.getItem("hanyu_decks"));
if (!decks) {
  let oldData = JSON.parse(localStorage.getItem("hanyu_master_data")) || [];
  decks = [{ id: 'default', name: 'Mặc định', words: oldData }];
  localStorage.setItem("hanyu_decks", JSON.stringify(decks));
}
let activeDeckId = localStorage.getItem("hanyu_active_deck") || decks[0].id;
if (!decks.find(d => d.id === activeDeckId)) activeDeckId = decks[0].id;

let vocabulary = decks.find(d => d.id === activeDeckId).words;
let currentItem = null;
let currentSentence = null;
let practiceType = "word"; // word or sentence
let flashMode = "vi-zh"; // Vietnamese -> Chinese
let scores = { flash: 0, quiz: 0 };

/**
 * INITIALIZATION
 */
document.addEventListener("DOMContentLoaded", () => {
  updateFlashcardDeckSelector();
  updateDecksUI();
  updateVocabUI();
  initTheme();

  // Auto POS detect mapping
  const posMap = {
    "我": "pronoun", "你": "pronoun", "他": "pronoun", "她": "pronoun", "我们": "pronoun", "你们": "pronoun", "他们": "pronoun",
    "吃": "verb", "喝": "verb", "看": "verb", "去": "verb", "做": "verb", "买": "verb", "喜欢": "verb", "想": "verb", "有": "verb", "学习": "verb"
  };

  const inputEl = document.getElementById("chinese-input");
  if (inputEl) {
    inputEl.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      const mapped = posMap[val];
      const posSelect = document.getElementById("pos-input");
      if (mapped && posSelect) {
        posSelect.value = mapped;
      } else if (!val && posSelect) {
        posSelect.value = "none";
      }
    });
  }

  document.getElementById("add-btn").addEventListener("click", handleAddWord);
  document
    .getElementById("flash-submit")
    .addEventListener("click", checkFlashcard);
  document
    .getElementById("flash-next")
    .addEventListener("click", () => loadFlashcard());
  document
    .getElementById("theme-toggle")
    .addEventListener("click", toggleTheme);
  document
    .getElementById("excel-upload")
    .addEventListener("change", handleExcelImport);

  // Accessibility: Enter key support
  document.getElementById("flash-answer").addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkFlashcard();
  });

  // Mobile Web Speech API Initialization
  let speechInitialized = false;
  const initSpeech = () => {
    if (speechInitialized) return;
    if ("speechSynthesis" in window) {
      const msg = new SpeechSynthesisUtterance("");
      msg.volume = 0;
      window.speechSynthesis.speak(msg);
    }
    speechInitialized = true;
    document.removeEventListener("click", initSpeech);
    document.removeEventListener("touchstart", initSpeech);
  };
  document.addEventListener("click", initSpeech);
  document.addEventListener("touchstart", initSpeech);
});

/**
 * CORE DATA LOGIC
 */
async function handleAddWord() {
  const input = document.getElementById("chinese-input");
  const btn = document.getElementById("add-btn");
  const zh = input.value.trim();
  if (!zh) return;

  btn.disabled = true;
  const originalText = btn.innerText;
  btn.innerText = "Loading...";

  input.disabled = true;
  input.placeholder = "Translating...";
  await processWord(zh);
  input.value = "";
  input.disabled = false;
  input.placeholder = "Enter Hanzi (e.g. 学习)";

  btn.disabled = false;
  btn.innerText = originalText;
}

async function processWord(chinese, pinyin = null, vietnamese = null, posOverride = null, skipSave = false) {
  if (vocabulary.find((v) => v.zh === chinese)) return;

  let finalVi = vietnamese || "";
  let finalPy = pinyin || "";

  let posSelect = document.getElementById("pos-input") ? document.getElementById("pos-input").value : 'none';
  if (posOverride && posOverride !== "") posSelect = posOverride;

  try {
    if (!vietnamese) finalVi = (await fetchTranslation(chinese)) || "";
  } catch (e) {
    console.warn("Failed to fetch translation:", e);
  }

  try {
    if (!pinyin) finalPy = (await fetchPinyin(chinese)) || "";
  } catch (e) {
    console.warn("Failed to fetch pinyin:", e);
  }

  const entry = {
    id: Date.now() + Math.random(),
    zh: chinese,
    py: finalPy,
    vi: finalVi,
    weight: 5, // Used for spaced repetition logic
    pos: posSelect
  };

  vocabulary.push(entry);
  if (!skipSave) saveAndRefresh();
}

/**
 * DECKS LOGIC
 */
function switchDeck(id) {
  activeDeckId = id;
  localStorage.setItem("hanyu_active_deck", id);
  vocabulary = decks.find(d => d.id === activeDeckId).words;
  updateDecksUI();
  updateVocabUI();
}

function createNewDeck() {
  const name = prompt("Tên bộ từ vựng mới:");
  if (!name) return;
  const newDeck = { id: Date.now().toString(), name, words: [] };
  decks.push(newDeck);
  switchDeck(newDeck.id);
  saveData();
}

function renameDeck(id, e) {
  e.stopPropagation();
  const deck = decks.find(d => d.id === id);
  if (!deck) return;
  const newName = prompt("Rename deck to:", deck.name);
  if (newName) {
    deck.name = newName;
    updateFlashcardDeckSelector();
    saveAndRefresh();
  }
}

function destroyDeck(id, e) {
  e.stopPropagation();
  if (decks.length === 1) {
    alert("Cannot delete the last deck.");
    return;
  }
  if (confirm("Delete this entire deck?")) {
    decks = decks.filter(d => d.id !== id);
    if (activeDeckId === id) switchDeck(decks[0].id);
    else saveAndRefresh();
    updateFlashcardDeckSelector();
  }
}

function updateDecksUI() {
  const container = document.getElementById("decks-list");
  if (!container) return;
  container.innerHTML = "";
  decks.forEach(d => {
    const card = document.createElement("div");
    card.className = `deck-card ${d.id === activeDeckId ? "active" : ""}`;
    card.onclick = () => switchDeck(d.id);
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
        <div class="deck-title" style="margin-bottom:0;">${d.name}</div>
        <div>
           <button class="btn-sm" style="background:none; border:none; color:var(--text-sub); cursor:pointer;" onclick="renameDeck('${d.id}', event)"><i class="fas fa-edit"></i></button>
           <button class="btn-sm" style="background:none; border:none; color:var(--error); cursor:pointer;" onclick="destroyDeck('${d.id}', event)"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <div class="deck-count">${d.words.length} từ</div>
    `;
    container.appendChild(card);
  });
  const currentDeckNameEl = document.getElementById("current-deck-name");
  if (currentDeckNameEl) {
    currentDeckNameEl.innerText = decks.find(d => d.id === activeDeckId).name;
  }
}

function updateFlashcardDeckSelector() {
  const sel = document.getElementById("flashcard-deck-select");
  if (!sel) return;
  const currVal = sel.value;
  sel.innerHTML = `<option value="all">All Decks</option>`;
  decks.forEach(d => {
    sel.innerHTML += `<option value="${d.id}">${d.name}</option>`;
  });
  if (Array.from(sel.options).some(o => o.value === currVal)) sel.value = currVal;
}

/**
 * EXCEL IMPORT
 */
let sheetJSLoaded = false;
async function loadSheetJS() {
  if (sheetJSLoaded) return;

  // Show loading indicator
  const uploadBtn = document.querySelector('.import-tools .btn-secondary');
  const originalHtml = uploadBtn ? uploadBtn.innerHTML : '';
  if (uploadBtn) uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js";
    script.onload = () => {
      sheetJSLoaded = true;
      if (uploadBtn) uploadBtn.innerHTML = originalHtml;
      resolve();
    };
    script.onerror = () => {
      if (uploadBtn) uploadBtn.innerHTML = originalHtml;
      alert("Failed to load Excel library. Please check your internet connection.");
      reject(new Error("Failed to load SheetJS"));
    };
    document.head.appendChild(script);
  });
}
async function handleExcelImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  // Reset immediately so the exact same file can trigger change again
  event.target.value = "";

  try {
    await loadSheetJS();
  } catch (e) {
    return;
  }

  const uploadBtn = document.querySelector('.import-tools .btn-secondary');
  const originalHtml = uploadBtn ? uploadBtn.innerHTML : '';
  if (uploadBtn) uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const rawRows = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]],
        { header: 1 }
      );

      let startIndex = 0;
      if (rawRows.length > 0 && rawRows[0]) {
        const firstRowStr = rawRows[0].map(s => String(s || "").toLowerCase()).join("");
        if (firstRowStr.includes("chinese") || firstRowStr.includes("hanzi") || firstRowStr.includes("zh") || firstRowStr.includes("từvựng") || firstRowStr.includes("tiếngtrung") || firstRowStr.includes("từ")) {
          startIndex = 1;
        }
      }

      for (let i = startIndex; i < rawRows.length; i++) {
        const row = rawRows[i];
        if (!row || !row[0]) continue;

        const zh = String(row[0]).trim();
        // Ignore visual empty lines
        if (!zh || zh === "") continue;

        let py = row[1] ? String(row[1]).trim() : "";
        let vi = row[2] ? String(row[2]).trim() : "";
        let rawPos = row[3] ? String(row[3]).toLowerCase().trim() : "";

        // If they skipped pinyin and put meaning in column B
        if (py !== "" && vi === "" && rawPos === "") {
          // Basic heuristic, if it has no latin characters it might be vietnamese, but lets just trust columns
        }

        let pos = "none";
        // Exact match english keywords to prevent 'proNOUN' triggering 'noun' 
        if (rawPos === "noun" || rawPos.includes("danh")) pos = "noun";
        else if (rawPos === "verb" || rawPos.includes("động") || rawPos.includes("dong")) pos = "verb";
        else if (rawPos === "pronoun" || rawPos.includes("đại") || rawPos.includes("dai")) pos = "pronoun";
        else if (rawPos === "adj" || rawPos === "adjective" || rawPos.includes("tính") || rawPos.includes("tinh")) pos = "adj";

        await processWord(zh, py, vi, pos, true);
      }
      saveAndRefresh();
      alert("Import successful!");
    } catch (err) {
      console.error(err);
      alert("Failed to import. The file might be corrupted or poorly formatted.");
    } finally {
      if (uploadBtn) uploadBtn.innerHTML = originalHtml;
    }
  };
  reader.readAsArrayBuffer(file);
}

async function downloadTemplate() {
  try {
    await loadSheetJS();
  } catch (e) {
    return;
  }
  const data = [
    ["Chinese", "Pinyin", "Vietnamese", "Type"],
    ["我", "wǒ", "Tôi", "pronoun"],
    ["吃", "chī", "Ăn", "verb"],
    ["苹果", "píng guǒ", "Quả táo", "noun"],
    ["好", "hǎo", "Tốt / Khỏe", "adj"],
    ["学习", "xué xí", "Học tập", "verb"],
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");
  XLSX.writeFile(wb, "HanyuMaster_Template.xlsx");
}

/**
 * FLASHCARD LOGIC
 */
function changePracticeType() {
  const rb = document.querySelector('input[name="practice-type"]:checked');
  if (rb) practiceType = rb.value;
  loadFlashcard();
}

function loadSentenceFlashcard() {
  document.getElementById("sentence-warning").classList.remove("hidden");
  const selDeckId = document.getElementById("flashcard-deck-select").value;
  let allWords = selDeckId === 'all' ? decks.flatMap(d => d.words) : (decks.find(d => d.id === selDeckId)?.words || []);

  const validWords = allWords.filter(w => ["noun", "verb", "adj", "pronoun"].includes(w.pos));

  if (validWords.length === 0) {
    alert("Bộ từ vựng cần có ít nhất 1 từ được phân loại (Danh từ, Động từ, Tính từ, Đại từ) để tạo câu.");
    const wb = document.querySelector('input[name="practice-type"][value="word"]');
    if (wb) { wb.checked = true; changePracticeType(); }
    return;
  }

  const sentenceTemplates = {
    noun: [
      { zh: "我喜欢这个[word]。", py: "wǒ xǐ huan zhè ge [word].", vi: "Tôi thích [word] này." },
      { zh: "你有[word]吗？", py: "nǐ yǒu [word] ma?", vi: "Bạn có [word] không?" },
      { zh: "我想买[word]。", py: "wǒ xiǎng mǎi [word].", vi: "Tôi muốn mua [word]." },
      { zh: "那是我的[word]。", py: "nà shì wǒ de [word].", vi: "Đó là [word] của tôi." },
      { zh: "[word]在哪里？", py: "[word] zài nǎ lǐ?", vi: "[word] ở đâu?" }
    ],
    verb: [
      { zh: "我想[word]。", py: "wǒ xiǎng [word].", vi: "Tôi muốn [word]." },
      { zh: "他正在[word]。", py: "tā zhèng zài [word].", vi: "Anh ấy đang [word]." },
      { zh: "大家一起[word]吧！", py: "dà jiā yì qǐ [word] ba!", vi: "Mọi người cùng nhau [word] đi!" },
      { zh: "你可以[word]吗？", py: "nǐ kě yǐ [word] ma?", vi: "Bạn có thể [word] không?" },
      { zh: "不要[word]。", py: "bú yào [word].", vi: "Đừng [word]." }
    ],
    adj: [
      { zh: "这个很[word]。", py: "zhè ge hěn [word].", vi: "Cái này rất [word]." },
      { zh: "真的太[word]了！", py: "zhēn de tài [word] le!", vi: "Thực sự quá [word] rồi!" },
      { zh: "我觉得非常[word]。", py: "wǒ jué de fēi cháng [word].", vi: "Tôi cảm thấy vô cùng [word]." },
      { zh: "它一点都不[word]。", py: "tā yì diǎn dōu bù [word].", vi: "Nó một chút cũng không [word]." }
    ],
    pronoun: [
      { zh: "[word]是我的好朋友。", py: "[word] shì wǒ de hǎo péng you.", vi: "[word] là bạn tốt của tôi." },
      { zh: "这是[word]的东西。", py: "zhè shì [word] de dōng xi.", vi: "Đây là đồ của [word]." },
      { zh: "我要和[word]一起去。", py: "wǒ yào hé [word] yì qǐ qù.", vi: "Tôi muốn đi cùng [word]." },
      { zh: "[word]不知道。", py: "[word] bù zhī dào.", vi: "[word] không biết." }
    ]
  };

  const targetWord = validWords[Math.floor(Math.random() * validWords.length)];
  const pool = sentenceTemplates[targetWord.pos];
  const template = pool[Math.floor(Math.random() * pool.length)];

  const lowerVi = targetWord.vi.toLowerCase();
  currentSentence = {
    zh: template.zh.replace("[word]", targetWord.zh),
    py: template.py.replace("[word]", targetWord.py),
    vi: template.vi.replace("[word]", lowerVi)
  };

  const feedback = document.getElementById("flash-feedback");
  const input = document.getElementById("flash-answer");

  feedback.innerText = "";
  input.value = "";
  input.focus();

  document.getElementById("flash-prompt").innerText =
    flashMode === "vi-zh" ? currentSentence.vi : currentSentence.zh;
  document.getElementById("flash-mode-label").innerText =
    flashMode === "vi-zh"
      ? "Dịch sang tiếng Trung Quốc:"
      : "Dịch sang tiếng Việt:";
}

function loadFlashcard() {
  document.getElementById("sentence-warning")?.classList.add("hidden");
  if (practiceType === "sentence") {
    loadSentenceFlashcard();
    return;
  }

  const selDeckId = document.getElementById("flashcard-deck-select").value;
  let words = selDeckId === 'all' ? decks.flatMap(d => d.words) : (decks.find(d => d.id === selDeckId)?.words || []);

  if (words.length === 0) return;

  // Spaced Repetition: Sort by weight and pick from top 60%
  const pool = [...words]
    .sort((a, b) => {
      if (b.weight === a.weight) return b.id - a.id;
      return b.weight - a.weight;
    })
    .slice(0, Math.max(1, Math.ceil(words.length * 0.6)));
  currentItem = pool[Math.floor(Math.random() * pool.length)];

  const feedback = document.getElementById("flash-feedback");
  const input = document.getElementById("flash-answer");

  feedback.innerText = "";
  input.value = "";
  input.focus();

  document.getElementById("flash-prompt").innerText =
    flashMode === "vi-zh" ? currentItem.vi : currentItem.zh;
  document.getElementById("flash-mode-label").innerText =
    flashMode === "vi-zh"
      ? "Translate to Chinese:"
      : "Translate to Vietnamese:";
}

function checkSentenceFlashcard() {
  const input = document.getElementById("flash-answer").value.trim().toLowerCase();
  const feedback = document.getElementById("flash-feedback");
  const correctVal = flashMode === "vi-zh" ? currentSentence.zh : currentSentence.vi.toLowerCase();

  speak(currentSentence.zh);

  if (input === correctVal.toLowerCase()) {
    feedback.innerText = `Correct! (${currentSentence.py})`;
    feedback.className = "feedback correct";
    scores.flash++;
    setTimeout(loadFlashcard, 1500);
  } else {
    feedback.innerText = `Incorrect. The answer is: ${correctVal} (${currentSentence.py})`;
    feedback.className = "feedback wrong";
  }
  document.getElementById("flash-score").innerText = scores.flash;
}

function checkFlashcard() {
  if (practiceType === "sentence") {
    checkSentenceFlashcard();
    return;
  }

  const input = document
    .getElementById("flash-answer")
    .value.trim()
    .toLowerCase();
  const feedback = document.getElementById("flash-feedback");
  const viText = currentItem.vi || "";
  const correctVal =
    flashMode === "vi-zh" ? currentItem.zh : viText.toLowerCase();

  // Voice prompt triggers for every answer check
  speak(currentItem.zh);

  if (input === correctVal) {
    feedback.innerText = `Correct! (${currentItem.py})`;
    feedback.className = "feedback correct";
    scores.flash++;
    currentItem.weight = Math.max(1, currentItem.weight - 1);
    setTimeout(loadFlashcard, 1500);
  } else {
    feedback.innerText = `Incorrect. The answer is: ${correctVal} (${currentItem.py})`;
    feedback.className = "feedback wrong";
    currentItem.weight += 2;
  }
  document.getElementById("flash-score").innerText = scores.flash;
  saveData();
}

/**
 * REVISED QUIZ LOGIC
 */
function loadQuiz() {
  if (vocabulary.length < 4) return alert("Add at least 4 words first!");

  currentItem = vocabulary[Math.floor(Math.random() * vocabulary.length)];

  document.getElementById("quiz-question").innerText = currentItem.vi;
  document.getElementById("quiz-feedback").innerText = "";
  document.getElementById("quiz-next").classList.add("hidden");

  // Generate options
  let options = [currentItem.zh];
  while (options.length < 4) {
    let rand = vocabulary[Math.floor(Math.random() * vocabulary.length)].zh;
    if (!options.includes(rand)) options.push(rand);
  }
  options.sort(() => Math.random() - 0.5);

  const container = document.getElementById("quiz-options");
  container.innerHTML = "";
  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerText = opt;
    btn.onclick = () => checkQuiz(opt, btn);
    container.appendChild(btn);
  });
}

function checkQuiz(selected, btn) {
  // 1. Disable all buttons to prevent changing answer or skipping
  const allBtns = document.querySelectorAll(".option-btn");
  allBtns.forEach((b) => (b.disabled = true));

  const feedback = document.getElementById("quiz-feedback");

  // 2. Audio feedback for every selection (Correct or Incorrect)
  speak(currentItem.zh);

  if (selected === currentItem.zh) {
    btn.style.borderColor = "var(--success)";
    btn.style.color = "var(--success)";
    feedback.innerText = "Correct!";
    feedback.className = "feedback correct";
    scores.quiz++;
  } else {
    btn.style.borderColor = "var(--error)";
    btn.style.color = "var(--error)";
    feedback.innerText = `Incorrect. It is ${currentItem.zh} (${currentItem.py})`;
    feedback.className = "feedback wrong";

    // Highlight the correct answer button
    allBtns.forEach((b) => {
      if (b.innerText === currentItem.zh) {
        b.style.borderColor = "var(--success)";
        b.style.color = "var(--success)";
        b.style.backgroundColor = "rgba(0, 184, 148, 0.1)";
      }
    });
  }

  document.getElementById("quiz-score").innerText = scores.quiz;

  // 3. Only show "Next" after an answer is chosen
  const nextBtn = document.getElementById("quiz-next");
  nextBtn.classList.remove("hidden");
  nextBtn.onclick = loadQuiz;
}

/**
 * UTILITIES
 */
async function fetchTranslation(text) {
  const targetUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=zh-CN|vi-VN`;
  const res = await fetch(targetUrl);
  const data = await res.json();
  return data.responseData.translatedText;
}

async function fetchPinyin(text) {
  try {
    const targetUrl = `https://api.pinyingenerator.com/convert?text=${encodeURIComponent(text)}`;
    const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`);
    const data = await res.json();
    return data.pinyin || "";
  } catch {
    return "";
  }
}

function speak(text) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "zh-CN";
    window.speechSynthesis.speak(msg);
  }
}

function updateVocabUI() {
  const list = document.getElementById("vocab-list");
  if (document.getElementById("vocab-count")) {
    document.getElementById("vocab-count").innerText = vocabulary.length;
  }
  list.innerHTML = "";
  vocabulary.forEach((v) => {
    const div = document.createElement("div");
    div.className = "vocab-item";
    // Pos label formatting
    let posLabel = "";
    if (v.pos && v.pos !== "none") posLabel = `<span style="font-size:0.7rem; background: var(--border); padding: 2px 5px; border-radius: 4px; margin-left: 5px;">${v.pos}</span>`;

    div.innerHTML = `
            <button class="delete-btn" onclick="deleteWord(${v.id})"><i class="fas fa-times"></i></button>
            <div style="font-weight: bold; font-size: 1.2rem">${v.zh} ${posLabel}</div>
            <div style="color: var(--primary); font-size: 0.8rem">${v.py}</div>
            <div style="font-size: 0.9rem">${v.vi}</div>
        `;
    list.appendChild(div);
  });
}

function deleteWord(id) {
  vocabulary = vocabulary.filter((v) => v.id !== id);
  const deck = decks.find(d => d.id === activeDeckId);
  if (deck) deck.words = vocabulary;
  saveAndRefresh();
}

function showSection(id) {
  document
    .querySelectorAll("section")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(`${id}-section`).classList.add("active");
  if (id === "flashcard") loadFlashcard();
  if (id === "quiz") loadQuiz();
}

function toggleFlashMode() {
  flashMode = flashMode === "vi-zh" ? "zh-vi" : "vi-zh";
  loadFlashcard();
}

function saveAndRefresh() {
  updateDecksUI();
  updateVocabUI();
  saveData();
}
function saveData() {
  localStorage.setItem("hanyu_decks", JSON.stringify(decks));
  localStorage.setItem("hanyu_master_data", JSON.stringify(vocabulary));
}

function resetProgress() {
  if (confirm("Delete this entire deck?")) {
    vocabulary = [];
    decks.find(d => d.id === activeDeckId).words = vocabulary;
    saveAndRefresh();
  }
}

function toggleTheme() {
  const curr = document.documentElement.getAttribute("data-theme");
  const target = curr === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", target);
  localStorage.setItem("hanyu_theme", target);
  document.querySelector("#theme-toggle i").className =
    target === "dark" ? "fas fa-sun" : "fas fa-moon";
}

function initTheme() {
  const saved = localStorage.getItem("hanyu_theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
  document.querySelector("#theme-toggle i").className =
    saved === "dark" ? "fas fa-sun" : "fas fa-moon";
}
