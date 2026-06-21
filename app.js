/* ═══════════════════════════════════════
   AI QUỸ GIÁO DỤC CON · app.js
   MVP · Vanilla JS · Mobile First
   v2.1 — Dynamic cost, monthly saving, CTA upgrade
═══════════════════════════════════════ */

'use strict';

const API_URL = 'https://script.google.com/macros/s/AKfycbya39YiRoAuhjKOd8iDcS0Y3ytlLisg4WGpAmE0fkh2Zei-rVKpJ9zEPrQnSm1fzQSM/exec';

/* ─── QUIZ DATA ──────────────────────────────────────────────── */
const QUESTIONS = [
  {
    id: 'child_age',
    number: 'CÂU 1 / 8',
    text: 'Con bạn hiện bao nhiêu tuổi?',
    hint: 'Nếu có nhiều con, chọn con nhỏ nhất bạn muốn lập quỹ.',
    type: 'options',
    cols: 2,
    opts: [
      { emoji: '👶', main: 'Dưới 1 tuổi',   sub: 'Sơ sinh',         val: 0  },
      { emoji: '🧒', main: '1 – 3 tuổi',     sub: 'Mầm non',         val: 2  },
      { emoji: '🧒', main: '4 – 6 tuổi',     sub: 'Mẫu giáo',        val: 5  },
      { emoji: '🧑', main: '7 – 10 tuổi',    sub: 'Tiểu học',        val: 9  },
      { emoji: '👦', main: '11 – 14 tuổi',   sub: 'Trung học cơ sở', val: 13 },
      { emoji: '🧑', main: '15 – 17 tuổi',   sub: 'THPT',            val: 16 },
    ],
  },
  {
    id: 'edu_goal',
    number: 'CÂU 2 / 8',
    text: 'Mục tiêu giáo dục bạn mong muốn cho con?',
    hint: 'Chọn theo mong muốn thực tế nhất của bạn.',
    type: 'options',
    cols: 1,
    opts: [
      { emoji: '🇻🇳', main: 'Đại học trong nước top',  sub: 'VNU, Bách Khoa, Ngoại Thương…',      val: 'local_top' },
      { emoji: '🏫',  main: 'Đại học trong nước',      sub: 'Trường công lập / dân lập bất kỳ',   val: 'local'     },
      { emoji: '🌏',  main: 'Đại học khu vực',         sub: 'Úc, Singapore, Nhật, Hàn…',          val: 'regional'  },
      { emoji: '🌍',  main: 'Đại học quốc tế top',     sub: 'Mỹ, Anh, Canada, Châu Âu…',         val: 'global'    },
      { emoji: '🤷',  main: 'Chưa quyết định',         sub: 'Muốn phân tích các lựa chọn',        val: 'unsure'    },
    ],
  },
  {
    id: 'income',
    number: 'CÂU 3 / 8',
    text: 'Thu nhập hàng tháng của gia đình bạn?',
    hint: 'Tổng thu nhập cả hai vợ chồng (nếu có).',
    type: 'options',
    cols: 2,
    opts: [
      { emoji: '💼', main: 'Dưới 15 triệu',  val: 12  },
      { emoji: '💼', main: '15 – 30 triệu',  val: 22  },
      { emoji: '💼', main: '30 – 50 triệu',  val: 40  },
      { emoji: '💼', main: '50 – 80 triệu',  val: 65  },
      { emoji: '💼', main: '80 – 150 triệu', val: 115 },
      { emoji: '💼', main: 'Trên 150 triệu', val: 200 },
    ],
  },
  {
    id: 'monthly_saving',
    number: 'CÂU 4 / 8',
    text: 'Mỗi tháng bạn đang tiết kiệm được bao nhiêu?',
    hint: 'Khoản thực sự để dành, không bao gồm chi tiêu.',
    type: 'slider',
    min: 0, max: 20, step: 0.5, default: 3,
    unit: 'triệu/tháng',
    format: (v) => `${v} triệu`,
  },
  {
    id: 'current_fund',
    number: 'CÂU 5 / 8',
    text: 'Bạn hiện có bao nhiêu tiền để dành cho giáo dục con?',
    hint: 'Tiết kiệm, sổ tiết kiệm, quỹ riêng dành cho con…',
    type: 'options',
    cols: 2,
    opts: [
      { emoji: '🪙', main: 'Chưa có',         val: 0   },
      { emoji: '💰', main: '< 50 triệu',      val: 30  },
      { emoji: '💰', main: '50 – 200 triệu',  val: 125 },
      { emoji: '💰', main: '200 – 500 triệu', val: 350 },
      { emoji: '💰', main: '> 500 triệu',     val: 600 },
    ],
  },
  {
    id: 'income_risk',
    number: 'CÂU 6 / 8',
    text: 'Nếu thu nhập chính bị gián đoạn đột ngột, điều gì xảy ra?',
    hint: 'Chọn mô tả gần nhất với tình trạng của bạn.',
    type: 'options',
    cols: 1,
    opts: [
      { emoji: '✅', main: 'Không ảnh hưởng nhiều',       sub: 'Có quỹ dự phòng trên 12 tháng', val: 1 },
      { emoji: '⚠️', main: 'Chịu được 3–6 tháng',        sub: 'Có tiết kiệm nhưng giới hạn',    val: 3 },
      { emoji: '🚨', main: 'Chỉ chịu được dưới 3 tháng', sub: 'Quỹ dự phòng mỏng',              val: 5 },
      { emoji: '❌', main: 'Sẽ rất khó khăn ngay',        sub: 'Không có quỹ dự phòng',          val: 7 },
    ],
  },
  {
    id: 'worry_level',
    number: 'CÂU 7 / 8',
    text: 'Bạn lo lắng về tài chính giáo dục con ở mức nào?',
    hint: '1 = hoàn toàn không lo, 10 = lo lắng thường xuyên.',
    type: 'slider',
    min: 1, max: 10, step: 1, default: 6,
    unit: '/ 10',
    format: (v) => `${v}`,
  },
  {
    id: 'start_when',
    number: 'CÂU 8 / 8',
    text: 'Bạn muốn bắt đầu lập kế hoạch từ khi nào?',
    hint: 'Câu trả lời thật lòng giúp chuyên gia chuẩn bị đúng nhất.',
    type: 'options',
    cols: 1,
    opts: [
      { emoji: '⚡',  main: 'Ngay bây giờ',              sub: 'Càng sớm càng tốt',          val: 'now'       },
      { emoji: '📅',  main: 'Trong 1–3 tháng tới',       sub: 'Đang cân nhắc',               val: '3months'   },
      { emoji: '🗓️', main: 'Trong năm nay',              sub: 'Khoảng 6–12 tháng',           val: '1year'     },
      { emoji: '🤔',  main: 'Chưa chắc, muốn tìm hiểu', sub: 'Chỉ muốn xem thử',            val: 'exploring' },
    ],
  },
];

/* ─── EDUCATION COST TABLE (VNĐ triệu) ─────────────────────── */
const EDU_COSTS = {
  local:     { base: 300,  label: 'Đại học trong nước' },
  local_top: { base: 500,  label: 'Đại học trong nước top' },
  regional:  { base: 1800, label: 'Đại học khu vực (Úc/Singapore…)' },
  global:    { base: 4500, label: 'Đại học quốc tế (Mỹ/Anh…)' },
  unsure:    { base: 800,  label: 'Đại học (ước tính trung bình)' },
};

const INFLATION_RATE = 0.06; // 6%/năm
const UNIV_AGE       = 18;   // tuổi vào đại học

/* ─── APP STATE ──────────────────────────────────────────────── */
const State = {
  currentScreen: 'landing',
  quizStep:      0,
  answers:       {},
  report:        {},
};

/* ─── SCREEN TRANSITIONS ─────────────────────────────────────── */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const next = document.getElementById('screen-' + id);
  if (next) {
    next.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  State.currentScreen = id;
}

/* ─── QUIZ ENGINE ────────────────────────────────────────────── */
function renderQuestion(index) {
  const q   = QUESTIONS[index];
  const pct = Math.round((index / QUESTIONS.length) * 100);

  document.getElementById('progress-fill').style.width  = pct + '%';
  document.getElementById('progress-label').textContent = `${index + 1} / ${QUESTIONS.length}`;

  const wrap = document.getElementById('question-wrap');
  wrap.innerHTML = '';

  const block = document.createElement('div');
  block.className = 'q-block';

  block.innerHTML = `
    <p class="q-number">${q.number}</p>
    <h2 class="q-text">${q.text}</h2>
    ${q.hint ? `<p class="q-hint">${q.hint}</p>` : ''}
  `;

  /* ── Options ── */
  if (q.type === 'options') {
    const grid = document.createElement('div');
    grid.className = 'options-grid' + (q.cols === 2 ? ' cols-2' : '');

    q.opts.forEach(opt => {
      const card = document.createElement('button');
      card.className = 'opt-card';
      if (State.answers[q.id] === opt.val) card.classList.add('selected');

      card.innerHTML = `
        ${opt.emoji ? `<span class="opt-emoji">${opt.emoji}</span>` : ''}
        <span class="opt-main">${opt.main}</span>
        ${opt.sub ? `<span class="opt-sub">${opt.sub}</span>` : ''}
      `;

      card.addEventListener('click', () => {
        grid.querySelectorAll('.opt-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        State.answers[q.id] = opt.val;
        setTimeout(() => {
          if (index < QUESTIONS.length - 1) {
            State.quizStep++;
            renderQuestion(State.quizStep);
          } else {
            finishQuiz();
          }
        }, 280);
      });

      grid.appendChild(card);
    });

    block.appendChild(grid);
  }

  /* ── Slider ── */
  if (q.type === 'slider') {
    const savedVal = State.answers[q.id] !== undefined ? State.answers[q.id] : q.default;

    const sliderHtml = document.createElement('div');
    sliderHtml.className = 'slider-wrap';
    sliderHtml.innerHTML = `
      <div class="slider-val-display" id="sv-${q.id}">
        ${q.format(savedVal)} <span>${q.unit}</span>
      </div>
      <input type="range" id="sl-${q.id}"
        min="${q.min}" max="${q.max}" step="${q.step}" value="${savedVal}" />
      <div class="slider-labels">
        <span>${q.format(q.min)}</span>
        <span>${q.format(q.max)}</span>
      </div>
    `;
    block.appendChild(sliderHtml);

    State.answers[q.id] = savedVal;

    const sliderEl  = sliderHtml.querySelector('input[type="range"]');
    const displayEl = sliderHtml.querySelector('.slider-val-display');

    sliderEl.addEventListener('input', () => {
      const v = parseFloat(sliderEl.value);
      State.answers[q.id] = v;
      displayEl.innerHTML = `${q.format(v)} <span>${q.unit}</span>`;
    });

    const nav = document.createElement('div');
    nav.className = 'q-nav';
    nav.innerHTML = `<button class="btn-primary" id="btn-next-slider">Tiếp theo →</button>`;
    block.appendChild(nav);

    nav.querySelector('#btn-next-slider').addEventListener('click', () => {
      if (index < QUESTIONS.length - 1) {
        State.quizStep++;
        renderQuestion(State.quizStep);
      } else {
        finishQuiz();
      }
    });
  }

  wrap.appendChild(block);
}

function finishQuiz() {
  computeReport();
  showScreen('report');
  renderReport();
}

/* ─── UPGRADE 1: CHI PHÍ ĐẠI HỌC ĐỘNG THEO TUỔI CON ────────── */
function computeEduCostByAge(childAge) {
  // Số tiền tuyệt đối (VNĐ) phản ánh chi phí thực tế có lạm phát
  // khi con đến tuổi đại học, dựa trên nhóm tuổi con hiện tại
  if (childAge <= 3)  return 2200000000; // ~18 năm tích lũy
  if (childAge <= 6)  return 1800000000; // ~13 năm
  if (childAge <= 10) return 1400000000; // ~9 năm
  return                     1000000000; // ≤7 năm (con lớn, chi phí thấp hơn vì ít lạm phát hơn)
}

/* ─── REPORT COMPUTATION ─────────────────────────────────────── */
function computeReport() {
  const a = State.answers;

  const childAge    = Number(a.child_age    ?? 5);
  const goal        =        a.edu_goal     ?? 'local';
  const income      = Number(a.income       ?? 22);
  const monthlySave = Number(a.monthly_saving ?? 3);
  const currentFund = Number(a.current_fund  ?? 0);
  const riskScore   = Number(a.income_risk   ?? 5);
  const worryLevel  = Number(a.worry_level   ?? 6);

  // Năm còn lại đến đại học
  const yearsLeft = Math.max(1, UNIV_AGE - childAge);

  // Chi phí đại học dự kiến: dùng bảng động theo tuổi (Upgrade 1)
  // Đây là con số tuyệt đối bằng VNĐ (không phải triệu)
  const eduCostVND = computeEduCostByAge(childAge);

  // Chuyển về đơn vị "triệu" để dùng trong công thức so sánh với quỹ
  const targetCost = eduCostVND / 1000000; // đơn vị: triệu VNĐ

  // Quỹ dự kiến tích lũy được (triệu VNĐ)
  const projectedSavings = Math.round(currentFund + monthlySave * 12 * yearsLeft);

  // Khoảng thiếu hụt (triệu VNĐ)
  const gap = Math.max(0, targetCost - projectedSavings);

  // UPGRADE 2: Số tiền cần tích lũy mỗi tháng (triệu VNĐ)
  const monthsLeft          = yearsLeft * 12;
  const monthlySavingNeeded = monthsLeft > 0
    ? Math.ceil(gap / monthsLeft)   // làm tròn lên (an toàn hơn)
    : 0;

  // Điểm chuẩn bị (0–100)
  const coverageRatio = targetCost > 0 ? projectedSavings / targetCost : 1;
  let score = Math.min(100, Math.round(coverageRatio * 100));
  if (riskScore >= 5) score = Math.max(0, score - 10);
  if (worryLevel >= 8) score = Math.max(0, score - 5);
  score = Math.max(5, score);

  // Mô tả điểm
  let scoreDesc = '';
  if (score >= 80) {
    scoreDesc = 'Kế hoạch của bạn đang đi đúng hướng. Một vài điều chỉnh nhỏ sẽ giúp bạn tự tin hơn.';
  } else if (score >= 50) {
    scoreDesc = 'Có nền tảng tốt nhưng vẫn còn khoảng cách đáng kể cần lấp đầy trước khi con vào đại học.';
  } else if (score >= 25) {
    scoreDesc = 'Khoảng thiếu hụt khá lớn. Việc bắt đầu sớm hôm nay sẽ tạo ra sự khác biệt rất lớn.';
  } else {
    scoreDesc = 'Quỹ giáo dục của con chưa được chuẩn bị. Hành động ngay hôm nay trước khi áp lực tăng cao.';
  }

  // Đếm ngược
  const now      = new Date();
  const univDate = new Date(now.getFullYear() + yearsLeft, 8, 1); // 1/9
  const diffMs   = Math.max(0, univDate - now);
  const diffDays = Math.floor(diffMs / 86400000);
  const cYears   = Math.floor(diffDays / 365);
  const cMonths  = Math.floor((diffDays % 365) / 30);
  const cDays    = diffDays % 30;

  State.report = {
    score, scoreDesc,
    targetCost, projectedSavings, gap,
    eduCostVND,           // NEW: số tuyệt đối để hiển thị card chi phí
    monthlySavingNeeded,  // NEW: tiền tích lũy mỗi tháng
    cYears, cMonths, cDays,
    yearsLeft, goal, childAge,
  };
}

/* ─── HELPERS FORMAT TIỀN ────────────────────────────────────── */

// Hiển thị số triệu theo dạng "X tỷ Y" hoặc "X triệu VNĐ"
function fmtMil(v) {
  if (v >= 1000) return `${(v / 1000).toFixed(1)} tỷ VNĐ`;
  return `${Math.round(v)} triệu VNĐ`;
}

// Hiển thị VNĐ tuyệt đối với dấu chấm ngăn cách hàng nghìn
// Ví dụ: 2200000000 → "2.200.000.000 VNĐ"
function fmtVND(amount) {
  return amount.toLocaleString('vi-VN') + ' VNĐ';
}

// Hiển thị triệu VNĐ với dấu chấm ngăn cách
// Ví dụ: 3900000 VNĐ → "3.900.000 VNĐ/tháng"
function fmtMonthly(milValue) {
  // milValue là đơn vị triệu → chuyển thành VNĐ
  const vnd = Math.round(milValue) * 1000000;
  return vnd.toLocaleString('vi-VN') + ' VNĐ';
}

/* ─── REPORT RENDER ──────────────────────────────────────────── */
function renderReport() {
  const r = State.report;

  // Score ring animation
  const CIRCUMFERENCE = 2 * Math.PI * 52; // r=52
  const offset = CIRCUMFERENCE - (r.score / 100) * CIRCUMFERENCE;
  setTimeout(() => {
    const ring = document.getElementById('ring-progress');
    if (ring) ring.style.strokeDashoffset = offset;
  }, 200);

  // Animate score number
  let counter = 0;
  const target  = r.score;
  const step    = Math.ceil(target / 40);
  const scoreEl = document.getElementById('score-number');
  const timer   = setInterval(() => {
    counter = Math.min(counter + step, target);
    if (scoreEl) scoreEl.textContent = counter;
    if (counter >= target) clearInterval(timer);
  }, 30);

  // Score description
  const descEl = document.getElementById('score-desc');
  if (descEl) descEl.textContent = r.scoreDesc;

  // UPGRADE 1: Chi phí đại học động theo tuổi
  const eduCostEl = document.getElementById('edu-cost-amount');
  if (eduCostEl) {
    eduCostEl.textContent = fmtVND(r.eduCostVND);
  }

  // Gap card
  document.getElementById('gap-target').textContent   = fmtMil(r.targetCost);
  document.getElementById('gap-current').textContent  = fmtMil(r.projectedSavings);
  document.getElementById('gap-shortage').textContent = r.gap > 0 ? `- ${fmtMil(r.gap)}` : 'Đã đủ ✓';

  // UPGRADE 2: Monthly saving needed
  const monthlyEl = document.getElementById('monthly-saving-needed');
  if (monthlyEl) {
    if (r.gap > 0 && r.monthlySavingNeeded > 0) {
      monthlyEl.innerHTML = `
        <span class="msn-label">Bạn cần tích lũy thêm mỗi tháng</span>
        <span class="msn-amount">${fmtMonthly(r.monthlySavingNeeded)}/tháng</span>
        <span class="msn-note">Để đạt mục tiêu trong ${r.yearsLeft} năm · Bắt đầu càng sớm, áp lực càng nhỏ</span>
      `;
      monthlyEl.style.display = 'flex';
    } else {
      monthlyEl.style.display = 'none';
    }
  }

  // Countdown
  document.getElementById('c-years').textContent  = String(r.cYears).padStart(2, '0');
  document.getElementById('c-months').textContent = String(r.cMonths).padStart(2, '0');
  document.getElementById('c-days').textContent   = String(r.cDays).padStart(2, '0');
}

/* ─── LEAD FORM ──────────────────────────────────────────────── */
function validateLead() {
  let ok = true;

  const name  = document.getElementById('f-name').value.trim();
  const phone = document.getElementById('f-phone').value.trim();
  const email = document.getElementById('f-email').value.trim();

  const nameErr  = document.getElementById('err-name');
  const phoneErr = document.getElementById('err-phone');
  const emailErr = document.getElementById('err-email');

  nameErr.textContent  = '';
  phoneErr.textContent = '';
  emailErr.textContent = '';

  document.getElementById('f-name').classList.remove('error');
  document.getElementById('f-phone').classList.remove('error');
  document.getElementById('f-email').classList.remove('error');

  if (!name || name.length < 2) {
    nameErr.textContent = 'Vui lòng nhập họ tên (ít nhất 2 ký tự).';
    document.getElementById('f-name').classList.add('error');
    ok = false;
  }

  if (!phone || !/^(0|\+84)\d{8,10}$/.test(phone.replace(/\s/g, ''))) {
    phoneErr.textContent = 'Số điện thoại không hợp lệ.';
    document.getElementById('f-phone').classList.add('error');
    ok = false;
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailErr.textContent = 'Email không hợp lệ.';
    document.getElementById('f-email').classList.add('error');
    ok = false;
  }

  return ok;
}

async function submitLead() {
  if (!validateLead()) return;

  const btn     = document.getElementById('btn-submit');
  const btnText = document.getElementById('btn-submit-text');
  const btnSpin = document.getElementById('btn-submit-spin');

  btn.disabled = true;
  btnText.classList.add('hidden');
  btnSpin.classList.remove('hidden');

  const payload = {
    name:    document.getElementById('f-name').value.trim(),
    phone:   document.getElementById('f-phone').value.trim(),
    email:   document.getElementById('f-email').value.trim(),
    // Quiz answers
    child_age:       State.answers.child_age,
    edu_goal:        State.answers.edu_goal,
    income:          State.answers.income,
    monthly_saving:  State.answers.monthly_saving,
    current_fund:    State.answers.current_fund,
    income_risk:     State.answers.income_risk,
    worry_level:     State.answers.worry_level,
    start_when:      State.answers.start_when,
    // Report summary
    score:                   State.report.score,
    edu_cost_vnd:            State.report.eduCostVND,
    target_cost:             State.report.targetCost,
    current_fund_projected:  State.report.projectedSavings,
    gap:                     State.report.gap,
    monthly_saving_needed:   State.report.monthlySavingNeeded,
    years_left:              State.report.yearsLeft,
    // Meta
    submitted_at: new Date().toISOString(),
    source:       'ai-quy-giao-duc-con',
  };

  try {
    await fetch(API_URL, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    showScreen('thankyou');
  } catch (err) {
    console.error('Submit error:', err);
    showScreen('thankyou'); // Fail gracefully
  }
}

/* ─── PUBLIC API ─────────────────────────────────────────────── */
const App = {
  goToQuiz() {
    State.quizStep = 0;
    State.answers  = {};
    showScreen('quiz');
    renderQuestion(0);
  },

  quizBack() {
    if (State.quizStep === 0) {
      showScreen('landing');
    } else {
      State.quizStep--;
      renderQuestion(State.quizStep);
    }
  },

  goToLead() {
    showScreen('lead');
  },

  submitLead,
};

/* ─── INIT ───────────────────────────────────────────────────── */
(function init() {
  showScreen('landing');
})();
