const previousOperandEl = document.getElementById('previous-operand');
const currentOperandEl = document.getElementById('current-operand');
const memoryIndicatorEl = document.getElementById('memory-indicator');

let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let angleMode = 'DEG';
let memoryValue = 0;

// ---------- DISPLAY ----------
function updateDisplay() {
  currentOperandEl.innerText = currentOperand;
  previousOperandEl.innerText = operation ? `${previousOperand} ${operation}` : previousOperand;
  memoryIndicatorEl.innerText = memoryValue !== 0 ? 'M' : '';
}

// ---------- TABS ----------
const tabButtons = document.querySelectorAll('.tab-btn');
const panels = {
  basic: document.querySelector('.basic-panel'),
  scientific: document.querySelector('.scientific-panel'),
  stats: document.querySelector('.stats-panel'),
  currency: document.querySelector('.currency-panel'),
};

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    Object.values(panels).forEach(p => p.classList.remove('active-panel'));
    panels[btn.dataset.tab].classList.add('active-panel');
  });
});

// ---------- DEG / RAD MODE ----------
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    angleMode = btn.dataset.mode;
  });
});

// ---------- BASIC OPERATIONS ----------
function appendNumber(number) {
  if (number === '.' && currentOperand.includes('.')) return;
  if (currentOperand === '0' && number !== '.') {
    currentOperand = number;
  } else {
    currentOperand += number;
  }
}

function chooseOperation(op) {
  if (currentOperand === '') return;
  if (previousOperand !== '') {
    compute();
  }
  operation = op;
  previousOperand = currentOperand;
  currentOperand = '';
}

function toRadians(value) {
  return angleMode === 'DEG' ? (value * Math.PI) / 180 : value;
}

function fromRadians(value) {
  return angleMode === 'DEG' ? (value * 180) / Math.PI : value;
}

function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function compute() {
  let result;
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return;

  switch (operation) {
    case '+': result = prev + current; break;
    case '-': result = prev - current; break;
    case '*': result = prev * current; break;
    case '/': result = current === 0 ? 'Error' : prev / current; break;
    case '^': result = Math.pow(prev, current); break;
    default: return;
  }

  currentOperand = typeof result === 'number' ? trimResult(result) : result;
  operation = undefined;
  previousOperand = '';
}

function trimResult(num) {
  if (!isFinite(num)) return 'Error';
  return parseFloat(num.toFixed(10)).toString();
}

function applyPercent() {
  if (currentOperand === '') return;
  currentOperand = trimResult(parseFloat(currentOperand) / 100);
}

function toggleSign() {
  if (currentOperand === '') return;
  currentOperand = trimResult(parseFloat(currentOperand) * -1);
}

function clearAll() {
  currentOperand = '0';
  previousOperand = '';
  operation = undefined;
}

function deleteLast() {
  if (currentOperand.length === 1) {
    currentOperand = '0';
  } else {
    currentOperand = currentOperand.slice(0, -1);
  }
}

// ---------- SCIENTIFIC FUNCTIONS ----------
function applyFunction(fn) {
  const value = parseFloat(currentOperand);
  if (isNaN(value)) return;
  let result;

  switch (fn) {
    case 'sin': result = Math.sin(toRadians(value)); break;
    case 'cos': result = Math.cos(toRadians(value)); break;
    case 'tan': result = Math.tan(toRadians(value)); break;
    case 'asin': result = fromRadians(Math.asin(value)); break;
    case 'acos': result = fromRadians(Math.acos(value)); break;
    case 'atan': result = fromRadians(Math.atan(value)); break;
    case 'log': result = Math.log10(value); break;
    case 'ln': result = Math.log(value); break;
    case 'sqrt': result = Math.sqrt(value); break;
    case 'cbrt': result = Math.cbrt(value); break;
    default: return;
  }
  currentOperand = trimResult(result);
}

function square() {
  const value = parseFloat(currentOperand);
  if (isNaN(value)) return;
  currentOperand = trimResult(value * value);
}

function cube() {
  const value = parseFloat(currentOperand);
  if (isNaN(value)) return;
  currentOperand = trimResult(value * value * value);
}

function inverse() {
  const value = parseFloat(currentOperand);
  if (isNaN(value) || value === 0) { currentOperand = 'Error'; return; }
  currentOperand = trimResult(1 / value);
}

function applyFactorial() {
  const value = parseFloat(currentOperand);
  if (isNaN(value) || value < 0 || !Number.isInteger(value)) { currentOperand = 'Error'; return; }
  currentOperand = trimResult(factorial(value));
}

function insertConstant(name) {
  currentOperand = name === 'pi' ? trimResult(Math.PI) : trimResult(Math.E);
}

function toFraction() {
  const value = parseFloat(currentOperand);
  if (isNaN(value)) return;
  const result = decimalToFraction(value);
  currentOperand = result;
}

function decimalToFraction(decimal) {
  if (Number.isInteger(decimal)) return `${decimal}/1`;
  const sign = decimal < 0 ? -1 : 1;
  decimal = Math.abs(decimal);
  let denominator = 1;
  let numerator = decimal;
  const maxDenominator = 1000000;
  while (Math.abs(numerator - Math.round(numerator)) > 1e-6 && denominator < maxDenominator) {
    numerator *= 10;
    denominator *= 10;
  }
  numerator = Math.round(numerator);
  const gcdVal = gcd(numerator, denominator);
  return `${sign * (numerator / gcdVal)}/${denominator / gcdVal}`;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

// ---------- MEMORY ----------
function memoryClear() { memoryValue = 0; updateDisplay(); }
function memoryRecall() { currentOperand = trimResult(memoryValue); }
function memoryAdd() { memoryValue += parseFloat(currentOperand) || 0; }
function memorySubtract() { memoryValue -= parseFloat(currentOperand) || 0; }

// ---------- BUTTON HANDLING ----------
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === 'clear') clearAll();
    else if (action === 'delete') deleteLast();
    else if (action === 'percent') applyPercent();
    else if (action === 'sign') toggleSign();
    else if (action === 'equals') compute();
    else if (action === 'operator') chooseOperation(value);
    else if (action === 'func') applyFunction(value);
    else if (action === 'pow2') square();
    else if (action === 'pow3') cube();
    else if (action === 'inverse') inverse();
    else if (action === 'fact') applyFactorial();
    else if (action === 'const') insertConstant(value);
    else if (action === 'paren') appendNumber(value);
    else if (action === 'frac') toFraction();
    else if (action === 'mc') memoryClear();
    else if (action === 'mr') memoryRecall();
    else if (action === 'mplus') memoryAdd();
    else if (action === 'mminus') memorySubtract();
    else if (value !== undefined) appendNumber(value);

    updateDisplay();
  });
});

// ---------- KEYBOARD SUPPORT ----------
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  else if (e.key === '.') appendNumber('.');
  else if (e.key === '+' || e.key === '-') chooseOperation(e.key);
  else if (e.key === '*') chooseOperation('*');
  else if (e.key === '/') { e.preventDefault(); chooseOperation('/'); }
  else if (e.key === '%') applyPercent();
  else if (e.key === 'Enter' || e.key === '=') compute();
  else if (e.key === 'Backspace') deleteLast();
  else if (e.key === 'Escape') clearAll();
  updateDisplay();
});

// ---------- CURRENCY CONVERTER ----------
const currencyRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 157.5,
  INR: 83.4,
  AUD: 1.51,
  CAD: 1.36,
  PKR: 278.5,
  AED: 3.67,
  CNY: 7.24
};

function convertCurrency() {
  const amountInput = document.getElementById('currency-amount');
  const fromSelect = document.getElementById('currency-from');
  const toSelect = document.getElementById('currency-to');
  const resultEl = document.getElementById('currency-result');

  const amount = parseFloat(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (isNaN(amount) || amount < 0) {
    resultEl.innerText = 'Enter a valid amount';
    return;
  }

  const usdValue = amount / currencyRates[from];
  const converted = usdValue * currencyRates[to];
  const rateText = `${trimResult(amount)} ${from} = ${trimResult(converted)} ${to}`;
  const oneUnit = (1 / currencyRates[from]) * currencyRates[to];
  resultEl.innerText = `${rateText}\n1 ${from} = ${trimResult(oneUnit)} ${to}`;
}

function swapCurrencySelection() {
  const fromSelect = document.getElementById('currency-from');
  const toSelect = document.getElementById('currency-to');
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;
  convertCurrency();
}

document.getElementById('currency-convert-btn').addEventListener('click', convertCurrency);
document.getElementById('currency-swap-btn').addEventListener('click', swapCurrencySelection);
['currency-amount', 'currency-from', 'currency-to'].forEach(id => {
  document.getElementById(id).addEventListener('input', convertCurrency);
  document.getElementById(id).addEventListener('change', convertCurrency);
});

convertCurrency();

// ---------- STATISTICS ----------
let statsData = [];

document.getElementById('stats-add-btn').addEventListener('click', () => {
  const input = document.getElementById('stats-input');
  const values = input.value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
  statsData = statsData.concat(values);
  input.value = '';
  renderStatsList();
});

document.getElementById('stats-clear-btn').addEventListener('click', () => {
  statsData = [];
  renderStatsList();
  document.getElementById('stats-results').innerText = '';
});

document.getElementById('stats-calc-btn').addEventListener('click', () => {
  if (statsData.length === 0) {
    document.getElementById('stats-results').innerText = 'Add some data first.';
    return;
  }
  const n = statsData.length;
  const sum = statsData.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  const sorted = [...statsData].sort((a, b) => a - b);
  const mid = Math.floor(n / 2);
  const median = n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  const variance = statsData.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  const min = Math.min(...statsData);
  const max = Math.max(...statsData);

  document.getElementById('stats-results').innerHTML = `
    Count (n): ${n}<br>
    Sum: ${trimResult(sum)}<br>
    Mean: ${trimResult(mean)}<br>
    Median: ${trimResult(median)}<br>
    Std Dev: ${trimResult(stdDev)}<br>
    Variance: ${trimResult(variance)}<br>
    Min: ${trimResult(min)} | Max: ${trimResult(max)}
  `;
});

function renderStatsList() {
  const listEl = document.getElementById('stats-list');
  listEl.innerText = statsData.length ? statsData.join(', ') : 'No data yet';
}

updateDisplay();
