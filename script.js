/**
 * APP STATE
 */
let vocabulary = JSON.parse(localStorage.getItem("hanyu_master_data")) || [];
let currentItem = null;
let flashMode = "vi-zh"; // Vietnamese -> Chinese
let scores = { flash: 0, quiz: 0 };

/**
 * INITIALIZATION
 */
document.addEventListener("DOMContentLoaded", () => {
  updateVocabUI();
  initTheme();

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

async function processWord(chinese, pinyin = null, vietnamese = null) {
  if (vocabulary.find((v) => v.zh === chinese)) return;

  let finalVi = vietnamese || "";
  let finalPy = pinyin || "";

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
  };

  vocabulary.push(entry);
  saveAndRefresh();
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

  try {
    await loadSheetJS();
  } catch (e) {
    event.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const rows = XLSX.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]],
    );

    alert(`Importing ${rows.length} words...`);
    for (const row of rows) {
      const zh = row.Chinese || row.Hanzi || row.zh;
      const py = row.Pinyin || row.py;
      const vi = row.Vietnamese || row.vi || row.Meaning;
      if (zh) await processWord(zh, py, vi);
    }
    alert("Import successful!");
    event.target.value = "";
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
    ["Chinese", "Pinyin", "Vietnamese"],
    ["你好", "nǐ hǎo", "Xin chào"],
    ["学习", "", ""],
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");
  XLSX.writeFile(wb, "HanyuMaster_Template.xlsx");
}

/**
 * FLASHCARD LOGIC
 */
function loadFlashcard() {
  if (vocabulary.length === 0) return;

  // Spaced Repetition: Sort by weight and pick from top 60%
  const pool = [...vocabulary]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, Math.ceil(vocabulary.length * 0.6));
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

function checkFlashcard() {
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
    feedback.innerText = `Incorrect. The answer is: ${correctVal}`;
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
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "zh-CN";
  window.speechSynthesis.speak(msg);
}

function updateVocabUI() {
  const list = document.getElementById("vocab-list");
  document.getElementById("vocab-count").innerText = vocabulary.length;
  list.innerHTML = "";
  vocabulary.forEach((v) => {
    const div = document.createElement("div");
    div.className = "vocab-item";
    div.innerHTML = `
            <button class="delete-btn" onclick="deleteWord(${v.id})"><i class="fas fa-times"></i></button>
            <div style="font-weight: bold; font-size: 1.2rem">${v.zh}</div>
            <div style="color: var(--primary); font-size: 0.8rem">${v.py}</div>
            <div style="font-size: 0.9rem">${v.vi}</div>
        `;
    list.appendChild(div);
  });
}

function deleteWord(id) {
  vocabulary = vocabulary.filter((v) => v.id !== id);
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
  saveData();
  updateVocabUI();
}
function saveData() {
  localStorage.setItem("hanyu_master_data", JSON.stringify(vocabulary));
}

function resetProgress() {
  if (confirm("Delete everything?")) {
    vocabulary = [];
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
