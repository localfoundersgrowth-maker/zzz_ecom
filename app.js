/* ==========================
   STATE — YOUTUBE CALC
   ========================== */
let channels = 3;
let videosPerDay = 2;
const daysPerMonth = 31;

const state = {
  // YT calc
  viewsPerVideo: 1500,
  rpm: 7,
  ctr: 0.7,
  signup: 12,
  videoLength: 8,
  valueUser: 40,
  aiVoice: 25,
  openClaw: 60,
  videoEdit: 0,

  // Loan calc
  loanAmount: 25000,
  loanTerm: 6,
  interestRate: 10,
  roi: 20,
  palletCost: 800,
  palletsPerMonth: 25,
  shippingCost: 150,
  chrisExpense: 0,
  rayExpense: 0,
  miscExpense: 0
};

/* ==========================
   BUTTONS — YOUTUBE CALC
   ========================== */
function renderButtons() {
  const ch = document.getElementById("channelsButtons");
  const vd = document.getElementById("videosButtons");

  ch.innerHTML = "";
  vd.innerHTML = "";

  [1,2,3,4,5].forEach(n => {
    const b = document.createElement("button");
    b.className = "btn" + (channels === n ? " active" : "");
    b.textContent = n;
    b.onclick = () => { channels = n; renderButtons(); calc(); };
    ch.appendChild(b);
  });

  [1,2,3,4,5,6].forEach(n => {
    const b = document.createElement("button");
    b.className = "btn" + (videosPerDay === n ? " active" : "");
    b.textContent = n;
    b.onclick = () => { videosPerDay = n; renderButtons(); calc(); };
    vd.appendChild(b);
  });
}

/* ==========================
   FORMATTER
   ========================== */
const fmt = (num, decimals = 0) =>
  Number(num.toFixed(decimals)).toLocaleString();

/* ==========================
   CALCULATIONS
   ========================== */
function calc() {

  /* ==========================
     YOUTUBE CALCULATOR
     ========================== */
  let rpmAdjusted = state.rpm;

  if (state.videoLength < 4) rpmAdjusted = state.rpm * 0.6;
  else if (state.videoLength < 8) rpmAdjusted = state.rpm * 1.0;
  else if (state.videoLength < 12) rpmAdjusted = state.rpm * 1.4;
  else rpmAdjusted = state.rpm * 1.6;

  const totalVideos = channels * videosPerDay * daysPerMonth;
  const totalViews = totalVideos * state.viewsPerVideo;

  const ytRevenue = (totalViews / 1000) * rpmAdjusted;
  const clicks = totalViews * (state.ctr / 100);
  const signups = clicks * (state.signup / 100);
  const goTradeRevenue = signups * state.valueUser;

  const totalRevenue = ytRevenue + goTradeRevenue;
  const totalExpenses = state.aiVoice + state.openClaw + state.videoEdit;
  const netProfit = totalRevenue - totalExpenses;

  const revPerView = totalViews > 0 ? totalRevenue / totalViews : 0;
  const revPerVideo = totalVideos > 0 ? totalRevenue / totalVideos : 0;
  const revPerChannel = channels > 0 ? totalRevenue / channels : 0;

  // Badges
  document.getElementById("badgeVideos").textContent =
    `${fmt(totalVideos)} videos / month`;
  document.getElementById("badgeViews").textContent =
    `${fmt(totalViews)} views / month`;
  document.getElementById("badgeSignups").textContent =
    `${fmt(signups)} GoTrade signups / month`;
  document.getElementById("badgeNet").textContent =
    `Net $${fmt(netProfit)} / month`;

  // Revenue
  document.getElementById("ytRevenue").textContent = `$${fmt(ytRevenue)}`;
  document.getElementById("goTradeRevenue").textContent = `$${fmt(goTradeRevenue)}`;
  document.getElementById("totalRevenue").textContent = `$${fmt(totalRevenue)}`;

  // Expenses
  document.getElementById("totalExpenses").textContent = `-$${fmt(totalExpenses)}`;

  const netProfitEl = document.getElementById("netProfit");
  netProfitEl.textContent = `$${fmt(netProfit)}`;
  netProfitEl.style.color = netProfit >= 0 ? "#6ee7b7" : "#f87171";

  // Clicks
  document.getElementById("clicks").textContent = `${fmt(clicks)} / m`;

  // Efficiency
  document.getElementById("revPerView").textContent = `$${fmt(revPerView, 4)}`;
  document.getElementById("revPerVideo").textContent = `$${fmt(revPerVideo)}`;
  document.getElementById("revPerChannel").textContent = `$${fmt(revPerChannel)}`;


  /* ==========================
     LOAN CALCULATOR — SIMPLE INTEREST
     ========================== */

  const {
    loanAmount,
    loanTerm,
    interestRate,
    roi,
    palletCost,
    palletsPerMonth,
    shippingCost,
    chrisExpense,
    rayExpense,
    miscExpense
  } = state;

  // Monthly pallet investment
  const totalInvestment = palletCost * palletsPerMonth;

  // Gross revenue (ROI applied)
  const grossRevenue = totalInvestment * (roi / 100);

  // Monthly profit
  const totalMonthlyExpenses = shippingCost + chrisExpense + rayExpense + miscExpense;
  const monthlyGross = grossRevenue;
  const monthlyNet = monthlyGross - totalMonthlyExpenses;

  // Total profit over the term
  const totalGrossProfit = monthlyGross * loanTerm;
  const totalExpensesTerm = totalMonthlyExpenses * loanTerm;

  // Simple interest total payback
  const totalInterestPaid = loanAmount * (interestRate / 100);
  const totalPayback = loanAmount + totalInterestPaid;

  // Net profit after paying back loan
  const totalNetProfit = totalGrossProfit - totalExpensesTerm - totalPayback;

  // Net monthly (average)
  const totalRoi = loanAmount > 0 ? (totalNetProfit / loanAmount) * 100 : 0;

  // Ending cash (same as netAfterLoan)
  const setLoanMetric = (id, value, { prefix = "$", suffix = "" } = {}) => {
    const metric = document.getElementById(id);
    const formattedValue = fmt(Math.abs(value));
    metric.textContent = `${value < 0 ? "-" : ""}${prefix}${formattedValue}${suffix}`;
    metric.style.color = value >= 0 ? "#6ee7b7" : "#f87171";
  };

  // Shipping + supplies (slider)

  // Update UI — Profit Metrics
  setLoanMetric("monthlyGross", monthlyGross);
  setLoanMetric("monthlyNet", monthlyNet);
  setLoanMetric("totalMonthlyExpenses", -totalMonthlyExpenses);
  setLoanMetric("totalGrossProfit", totalGrossProfit);
  setLoanMetric("totalNetProfit", totalNetProfit);
  setLoanMetric("totalExpensesTerm", -totalExpensesTerm);
  setLoanMetric("totalPayback", totalPayback);
  setLoanMetric("totalInterestPaid", totalInterestPaid);
  setLoanMetric("totalRoi", totalRoi, { prefix: "", suffix: "%" });

  // Update UI — Loan Metrics

  // Update UI — Business Metrics

  // Loan badges
  document.getElementById("badgeMonthlyProfit").textContent =
    `Gross $${fmt(monthlyGross)}`;
  document.getElementById("badgeNetMonthly").textContent =
    `Net $${fmt(monthlyNet)}`;
  document.getElementById("badgeEndingCash").textContent =
    `Term net $${fmt(totalNetProfit)}`;
}


/* ==========================
   SLIDER ENGINE — FIXED
   ========================== */

function updateSliderFill(el) {
  const min = Number(el.min);
  const max = Number(el.max);
  const val = Number(el.value);
  const percent = ((val - min) / (max - min)) * 100;
  el.style.setProperty("--value", `${percent}%`);
}

function updateBubble(el, bubble) {
  const rect = el.getBoundingClientRect();
  const thumbSize = 30;
  const trackWidth = rect.width - thumbSize;

  const min = Number(el.min);
  const max = Number(el.max);
  const val = Number(el.value);

  const percent = (val - min) / (max - min);
  const x = percent * trackWidth + thumbSize / 2;

  bubble.style.left = `${x}px`;
}

function throttle(fn, limit) {
  let waiting = false;
  return function (...args) {
    if (!waiting) {
      fn.apply(this, args);
      waiting = true;
      setTimeout(() => (waiting = false), limit);
    }
  };
}

function bindSlider(id, key, formatter = (v) => v) {
  const el = document.getElementById(id);
  const valEl = document.getElementById(id + "Value");
  if (!el || !valEl) return;

  const slider = el.closest(".gt-slider");
  const title = slider.querySelector(".gt-title");

  // FIXED DOM ORDER — prevents broken sliders
  let track = el.closest(".slider-track");
  if (!track) {
    track = document.createElement("div");
    track.className = "slider-track";
    slider.insertBefore(track, title);
    track.appendChild(el);
  }

  let bubble = track.querySelector(".slider-bubble");
  if (!bubble) {
    bubble = document.createElement("div");
    bubble.className = "slider-bubble";
    track.appendChild(bubble);
  }

  valEl.hidden = true;

  el.value = state[key];
  bubble.textContent = formatter(state[key]);
  updateSliderFill(el);
  updateBubble(el, bubble);

  let frameId = null;
  el.addEventListener("input", () => {
    state[key] = Number(el.value);
    bubble.textContent = formatter(state[key]);
    updateSliderFill(el);
    updateBubble(el, bubble);
    if (frameId === null) {
      frameId = requestAnimationFrame(() => {
        frameId = null;
        calc();
      });
    }
  });

  new ResizeObserver(() => updateBubble(el, bubble)).observe(el);
}


/* ==========================
   INIT
   ========================== */

renderButtons();

/* YT sliders */
bindSlider("viewsPerVideo", "viewsPerVideo", v => fmt(v));
bindSlider("rpm", "rpm", v => `$${v}`);
bindSlider("ctr", "ctr", v => `${v}%`);
bindSlider("signup", "signup", v => `${v}%`);
bindSlider("valueUser", "valueUser", v => `$${v}`);
bindSlider("videoLength", "videoLength", v => `${v} min`);

bindSlider("aiVoice", "aiVoice", v => `$${v}`);
bindSlider("openClaw", "openClaw", v => `$${v}`);
bindSlider("videoEdit", "videoEdit", v => `$${v}`);

/* Loan sliders */
bindSlider("loanAmount", "loanAmount", v => `$${v/1000}k`);
bindSlider("loanTerm", "loanTerm", v => `${v} mo`);
bindSlider("interestRate", "interestRate", v => `${v}%`);
bindSlider("palletCost", "palletCost", v => `$${v}`);
bindSlider("palletsPerMonth", "palletsPerMonth", v => `${v}`);
bindSlider("shippingCost", "shippingCost", v => `$${v}`);
bindSlider("chrisExpense", "chrisExpense", v => `$${fmt(v)}`);
bindSlider("rayExpense", "rayExpense", v => `$${fmt(v)}`);
bindSlider("miscExpense", "miscExpense", v => `$${fmt(v)}`);

calc();
