const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const category = document.getElementById('category');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function addTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === '' || amount.value.trim() === '' || category.value === '') {
    alert('Please fill out all fields');
    return;
  }
  let amt = +amount.value;
  if (category.value !== 'income') amt = -Math.abs(amt);

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: amt,
    category: category.value
  };
  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();
  text.value = '';
  amount.value = '';
  category.value = '';
}

function addTransaction(e) {
  e.preventDefault();
  if (!text.value || !amount.value || !category.value || !date.value) {
    alert('Please fill out all fields');
    return;
  }

  let amt = +amount.value;
  if (category.value !== 'income') amt = -Math.abs(amt);

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: amt,
    category: category.value,
    date: date.value
  };

  transactions.push(transaction);
  updateLocalStorage();
  text.value = '';
  amount.value = '';
  category.value = '';
  date.value = '';
  init();
}
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.innerHTML = `
    <span><strong>${transaction.category.toUpperCase()}</strong>: ${transaction.text}<br>
    <small>${transaction.date}</small></span>
    <span>${sign}₹${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;
  list.appendChild(item);
}
let isMonthlyVisible = false;

function toggleMonthlySummary() {
  const container = document.getElementById('monthly-summary');
  const btn = document.getElementById('monthly-summary-btn');

  if (!transactions || transactions.length === 0) {
    container.innerHTML = "<p>No transactions available.</p>";
    container.style.display = 'block';
    btn.innerText = '📉 Hide Monthly Summary';
    isMonthlyVisible = true;
    return;
  }

  if (isMonthlyVisible) {
    container.style.display = 'none';
    container.innerHTML = '';
    btn.innerText = '📊 View Monthly Summary';
    isMonthlyVisible = false;
  } else {
    const monthlyData = {};

    transactions.forEach(txn => {
      if (!txn.date) return; // 🛡 Safety
      const month = txn.date.slice(0, 7); // YYYY-MM
      if (!monthlyData[month]) monthlyData[month] = [];
      monthlyData[month].push(txn);
    });

    let html = '<h4>📅 Monthly Summary</h4>';
    Object.keys(monthlyData).sort((a, b) => b.localeCompare(a)).forEach(month => {
      const entries = monthlyData[month];
      const income = entries.filter(e => e.amount > 0).reduce((sum, e) => sum + e.amount, 0);
      const expense = entries.filter(e => e.amount < 0).reduce((sum, e) => sum + e.amount, 0);
      const savings = income + expense;

      html += `
        <div class="summary-box">
          <strong>${month}</strong><br>
          Income: ₹${income}<br>
          Expenses: ₹${-expense}<br>
          Savings: ₹${savings}
        </div>
      `;
    });

    container.innerHTML = html;
    container.style.display = 'block';
    btn.innerText = '📉 Hide Monthly Summary';
    isMonthlyVisible = true;
  }
}


function updateValues() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
  const income = amounts.filter(a => a > 0).reduce((a, b) => a + b, 0).toFixed(2);
  const expense = (amounts.filter(a => a < 0).reduce((a, b) => a + b, 0) * -1).toFixed(2);
  balance.innerText = `₹${total}`;
  money_plus.innerText = `+₹${income}`;
  money_minus.innerText = `-₹${expense}`;
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

let showingFullHistory = false;

function init() {
  list.innerHTML = '';
  const displayTransactions = showingFullHistory ? transactions : transactions.slice(-4);
  displayTransactions.forEach(addTransactionDOM);
  updateValues();
}
function toggleHistory() {
  showingFullHistory = !showingFullHistory;
  document.getElementById('history-toggle-btn').innerText = showingFullHistory
    ? 'Show Less'
    : 'View Full History';
  init();
}


function toggleDark() {
  document.body.classList.toggle('dark-mode');
}

function logout() {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'login.html';
}

init();
form.addEventListener('submit', addTransaction);


