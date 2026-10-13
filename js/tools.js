// ============================================
// ALL TOOLS – consolidated in one file
// ============================================

(function() {
  'use strict';

  // Ensure registry exists
  if (!window.Tools) window.Tools = [];

  // ==================== EMI TOOL ====================
  window.Tools.push({
    id: 'emi',
    name: 'EMI / Loan',
    icon: 'fas fa-hand-holding-usd',
    description: 'Monthly EMI + amortization table',
    render: function() {
      return `
        <div class="tool-form">
          <div class="form-row">
            <label>Loan Amount (₹)</label>
            <input type="number" id="emi-amount" value="1000" step="1000" />
          </div>
          <div class="form-row">
            <label>Annual Interest (%)</label>
            <input type="number" id="emi-rate" value="8" step="0.1" />
          </div>
          <div class="form-row">
            <label>Tenure (months)</label>
            <input type="number" id="emi-tenure" value="2" step="1" />
          </div>
          <button class="btn btn-primary" id="emi-calc">Calculate EMI</button>
          <div class="tool-result" id="emi-result">
            <h4>Monthly EMI: ₹<span id="emi-value">0</span></h4>
            <div id="emi-table-wrap"></div>
          </div>
        </div>
      `;
    },
    setup: function(container) {
      const btn = container.querySelector('#emi-calc');
      const resultVal = container.querySelector('#emi-value');
      const tableWrap = container.querySelector('#emi-table-wrap');

      // function calculate() {
      //   const P = parseFloat(document.getElementById('emi-amount').value) || 0;
      //   const r = (parseFloat(document.getElementById('emi-rate').value) || 0) / 12 / 100;
      //   const n = parseInt(document.getElementById('emi-tenure').value) || 0;

      //   if (P <= 0 || r < 0 || n <= 0) {
      //     resultVal.textContent = '0';
      //     tableWrap.innerHTML = '<p>Please enter valid numbers.</p>';
      //     return;
      //   }

      //   const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      //   const totalPayment = emi * n;
      //   const totalInterest = totalPayment - P;

      //   resultVal.textContent = emi.toFixed(2);

      //   let tableHtml = `<h5>Amortization Schedule</h5><table>
      //     <thead><tr><th>Month</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody>`;
      //   let balance = P;
      //   const maxRows = Math.min(n, 60);
      //   for (let i = 1; i <= maxRows; i++) {
      //     const interest = balance * r;
      //     const principal = emi - interest;
      //     balance -= principal;
      //     if (balance < 0) balance = 0;
      //     tableHtml += `<tr><td>${i}</td><td>${principal.toFixed(2)}</td><td>${interest.toFixed(2)}</td><td>${balance.toFixed(2)}</td></tr>`;
      //   }
      //   if (n > 60) tableHtml += `<tr><td colspan="4">... (showing first 60 months)</td></tr>`;
      //   tableHtml += `</tbody></table>`;
      //   tableHtml += `<p><strong>Total Interest:</strong> ₹${totalInterest.toFixed(2)} | <strong>Total Payment:</strong> ₹${totalPayment.toFixed(2)}</p>`;
      //   tableWrap.innerHTML = tableHtml;
      // }

      
      function calculate() {
        const P = parseFloat(document.getElementById('emi-amount').value) || 0;
        const r = (parseFloat(document.getElementById('emi-rate').value) || 0) / 12 / 100;
        const n = parseInt(document.getElementById('emi-tenure').value) || 0;

        if (P <= 0 || r < 0 || n <= 0) {
          resultVal.textContent = '0';
          tableWrap.innerHTML = '<p>Please enter valid numbers.</p>';
          return;
        }

        const emi = r === 0 ? P / n : P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        const totalPayment = emi * n;
        const totalInterest = totalPayment - P;

        resultVal.textContent = emi.toFixed(2);

        let tableHtml = `<h5>Amortization Schedule</h5><table>
          <thead><tr><th>Month</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody>`;
        let balance = P;
        const maxRows = Math.min(n, 60);
        for (let i = 1; i <= maxRows; i++) {
          const interest = balance * r;
          const principal = emi - interest;
          balance -= principal;
          if (balance < 0) balance = 0;
          tableHtml += `<tr><td>${i}</td><td>${principal.toFixed(2)}</td><td>${interest.toFixed(2)}</td><td>${balance.toFixed(2)}</td></tr>`;
        }
        if (n > 60) tableHtml += `<tr><td colspan="4">... (showing first 60 months)</td></tr>`;
        tableHtml += `</tbody></table>`;
        tableHtml += `<p><strong>Total Interest:</strong> ₹${totalInterest.toFixed(2)} | <strong>Total Payment:</strong> ₹${totalPayment.toFixed(2)}</p>`;
        tableWrap.innerHTML = tableHtml;
      }

      btn.addEventListener('click', calculate);
      setTimeout(calculate, 50);
    }
  });

  // ==================== PERCENTAGE TOOL ====================
  window.Tools.push({
    id: 'percentage',
    name: 'Percentage',
    icon: 'fas fa-percent',
    description: 'X% of Y, increase, decrease',
    render: function() {
      return `
        <div class="tool-form">
          <div class="form-row">
            <label>Mode</label>
            <select id="pct-mode">
              <option value="of">X% of Y</option>
              <option value="increase">Increase X by Y%</option>
              <option value="decrease">Decrease X by Y%</option>
            </select>
          </div>
          <div class="form-row">
            <label>Value X</label>
            <input type="number" id="pct-x" value="200" step="any" />
          </div>
          <div class="form-row">
            <label>Percentage Y</label>
            <input type="number" id="pct-y" value="10" step="any" />
          </div>
          <button class="btn btn-primary" id="pct-calc">Calculate</button>
          <div class="tool-result" id="pct-result">
            <h4>Result: <span id="pct-value">—</span></h4>
          </div>
        </div>
      `;
    },
    setup: function(container) {
      const btn = container.querySelector('#pct-calc');
      const resultSpan = container.querySelector('#pct-value');

      function calculate() {
        const mode = document.getElementById('pct-mode').value;
        const x = parseFloat(document.getElementById('pct-x').value) || 0;
        const y = parseFloat(document.getElementById('pct-y').value) || 0;

        let result;
        if (mode === 'of') {
          result = (y / 100) * x;
          resultSpan.textContent = `${y}% of ${x} = ${result.toFixed(2)}`;
        } else if (mode === 'increase') {
          result = x * (1 + y / 100);
          resultSpan.textContent = `${x} increased by ${y}% = ${result.toFixed(2)}`;
        } else if (mode === 'decrease') {
          result = x * (1 - y / 100);
          resultSpan.textContent = `${x} decreased by ${y}% = ${result.toFixed(2)}`;
        }
      }

      btn.addEventListener('click', calculate);
      setTimeout(calculate, 50);
    }
  });

  // ==================== AGE TOOL ====================
  window.Tools.push({
    id: 'age',
    name: 'Age Calculator',
    icon: 'fas fa-birthday-cake',
    description: 'Exact age + next birthday countdown',
    render: function() {
      return `
        <div class="tool-form">
          <div class="form-row">
            <label>Birth Date</label>
            <input type="date" id="age-dob" value="2000-01-01" />
          </div>
          <button class="btn btn-primary" id="age-calc">Calculate Age</button>
          <div class="tool-result" id="age-result">
            <p><strong>Years:</strong> <span id="age-years">—</span></p>
            <p><strong>Months:</strong> <span id="age-months">—</span></p>
            <p><strong>Days:</strong> <span id="age-days">—</span></p>
            <p><strong>Next Birthday:</strong> <span id="age-next">—</span></p>
          </div>
        </div>
      `;
    },
    setup: function(container) {
      const btn = container.querySelector('#age-calc');
      const yearsSpan = container.querySelector('#age-years');
      const monthsSpan = container.querySelector('#age-months');
      const daysSpan = container.querySelector('#age-days');
      const nextSpan = container.querySelector('#age-next');

      function calculate() {
        const dob = new Date(document.getElementById('age-dob').value);
        if (isNaN(dob)) {
          yearsSpan.textContent = monthsSpan.textContent = daysSpan.textContent = nextSpan.textContent = 'Invalid date';
          return;
        }

        const now = new Date();
        let years = now.getFullYear() - dob.getFullYear();
        let months = now.getMonth() - dob.getMonth();
        let days = now.getDate() - dob.getDate();

        if (days < 0) {
          months--;
          const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
          days += prevMonth.getDate();
        }
        if (months < 0) {
          years--;
          months += 12;
        }

        yearsSpan.textContent = years;
        monthsSpan.textContent = months;
        daysSpan.textContent = days;

        // Next birthday
        const nextBirthday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
        if (nextBirthday < now) {
          nextBirthday.setFullYear(now.getFullYear() + 1);
        }
        const diff = nextBirthday - now;
        const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
        nextSpan.textContent = `${daysLeft} day${daysLeft !== 1 ? 's' : ''} (${nextBirthday.toDateString()})`;
      }

      btn.addEventListener('click', calculate);
      setTimeout(calculate, 50);
    }
  });

  // ==================== GPA TOOL ====================
  window.Tools.push({
    id: 'gpa',
    name: 'GPA / CGPA',
    icon: 'fas fa-graduation-cap',
    description: 'BCA grading system (customizable)',
    render: function() {
      return `
        <div class="tool-form">
          <div class="form-row">
            <label>Number of subjects</label>
            <input type="number" id="gpa-count" value="5" min="1" max="20" />
          </div>
          <button class="btn btn-primary" id="gpa-generate">Generate inputs</button>
          <div id="gpa-inputs" style="margin-top:1rem;"></div>
          <button class="btn btn-primary" id="gpa-calc" style="margin-top:0.5rem;">Calculate GPA</button>
          <div class="tool-result" id="gpa-result">
            <h4>GPA: <span id="gpa-value">—</span></h4>
            <p id="gpa-detail"></p>
          </div>
        </div>
      `;
    },
    setup: function(container) {
      const genBtn = container.querySelector('#gpa-generate');
      const calcBtn = container.querySelector('#gpa-calc');
      const inputsDiv = container.querySelector('#gpa-inputs');
      const resultSpan = container.querySelector('#gpa-value');
      const detailP = container.querySelector('#gpa-detail');

      const gradePoints = {
        'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0
      };

      function generateInputs() {
        const count = parseInt(document.getElementById('gpa-count').value) || 5;
        let html = '';
        for (let i = 1; i <= count; i++) {
          html += `<div class="form-row" style="margin-bottom:0.5rem;">
            <label>Subject ${i} Credits</label>
            <input type="number" class="gpa-credits" value="3" min="1" max="6" style="width:80px;" />
            <label>Grade</label>
            <select class="gpa-grade">
              ${Object.keys(gradePoints).map(g => `<option value="${g}">${g}</option>`).join('')}
            </select>
          </div>`;
        }
        inputsDiv.innerHTML = html;
      }

      function calculate() {
        const creditInputs = inputsDiv.querySelectorAll('.gpa-credits');
        const gradeSelects = inputsDiv.querySelectorAll('.gpa-grade');
        let totalCredits = 0;
        let totalPoints = 0;
        let detail = '';

        for (let i = 0; i < creditInputs.length; i++) {
          const cred = parseFloat(creditInputs[i].value) || 0;
          const grade = gradeSelects[i].value;
          const points = gradePoints[grade] || 0;
          totalCredits += cred;
          totalPoints += cred * points;
          detail += `Subject ${i+1}: ${cred} credits, Grade ${grade} (${points} points)<br>`;
        }

        if (totalCredits === 0) {
          resultSpan.textContent = '0';
          detailP.innerHTML = 'No credits entered.';
          return;
        }

        const gpa = totalPoints / totalCredits;
        resultSpan.textContent = gpa.toFixed(2);
        detailP.innerHTML = detail + `<strong>Total Credits:</strong> ${totalCredits} | <strong>Total Points:</strong> ${totalPoints}`;
      }

      genBtn.addEventListener('click', () => {
        generateInputs();
        setTimeout(calculate, 50);
      });
      calcBtn.addEventListener('click', calculate);

      setTimeout(() => {
        generateInputs();
        setTimeout(calculate, 100);
      }, 50);
    }
  });

  // ==================== BMI TOOL ====================
  window.Tools.push({
    id: 'bmi',
    name: 'BMI Calculator',
    icon: 'fas fa-weight',
    description: 'Health category indicator',
    render: function() {
      return `
        <div class="tool-form">
          <div class="form-row">
            <label>Weight (kg)</label>
            <input type="number" id="bmi-weight" value="70" step="0.1" />
          </div>
          <div class="form-row">
            <label>Height (cm)</label>
            <input type="number" id="bmi-height" value="175" step="0.1" />
          </div>
          <button class="btn btn-primary" id="bmi-calc">Calculate BMI</button>
          <div class="tool-result" id="bmi-result">
            <h4>BMI: <span id="bmi-value">—</span></h4>
            <p><strong>Category:</strong> <span id="bmi-category">—</span></p>
          </div>
        </div>
      `;
    },
    setup: function(container) {
      const btn = container.querySelector('#bmi-calc');
      const bmiSpan = container.querySelector('#bmi-value');
      const catSpan = container.querySelector('#bmi-category');

      function calculate() {
        const weight = parseFloat(document.getElementById('bmi-weight').value) || 0;
        const heightCm = parseFloat(document.getElementById('bmi-height').value) || 0;
        const heightM = heightCm / 100;
        if (weight <= 0 || heightM <= 0) {
          bmiSpan.textContent = 'Invalid';
          catSpan.textContent = '—';
          return;
        }
        const bmi = weight / (heightM * heightM);
        bmiSpan.textContent = bmi.toFixed(1);

        let category = '';
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi < 25) category = 'Normal weight';
        else if (bmi < 30) category = 'Overweight';
        else category = 'Obese';
        catSpan.textContent = category;
      }

      btn.addEventListener('click', calculate);
      setTimeout(calculate, 50);
    }
  });

  // ==================== CURRENCY TOOL (with API key) ====================
window.Tools.push({
  id: 'currency',
  name: 'Currency Converter',
  icon: 'fas fa-exchange-alt',
  description: 'Live rates from exchangerate-api.com',
  render: function() {
    return `
      <div class="tool-form">
        <div class="form-row">
          <label>Amount</label>
          <input type="number" id="cur-amount" value="1" step="any" />
        </div>
        <div class="form-row">
          <label>From</label>
          <select id="cur-from">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="INR" selected>INR</option>
          </select>
        </div>
        <div class="form-row">
          <label>To</label>
          <select id="cur-to">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="INR">INR</option>
          </select>
        </div>
        <button class="btn btn-primary" id="cur-calc">Convert</button>
        <div class="tool-result" id="cur-result">
          <h4>Result: <span id="cur-value">—</span></h4>
          <p id="cur-detail" style="font-size:0.85rem; color:var(--text-muted);"></p>
        </div>
      </div>
    `;
  },
  setup: function(container) {
    const btn = container.querySelector('#cur-calc');
    const resultSpan = container.querySelector('#cur-value');
    const detailP = container.querySelector('#cur-detail');

    // 🔑 YOUR API KEY HERE
    const API_KEY = '42c5dd9449fc231d4fd31de8';  // <-- replace with your key

    async function convert() {
      const amount = parseFloat(document.getElementById('cur-amount').value) || 0;
      const from = document.getElementById('cur-from').value;
      const to = document.getElementById('cur-to').value;

      if (from === to) {
        resultSpan.textContent = amount.toFixed(2);
        detailP.textContent = 'Same currency, no conversion needed.';
        return;
      }

      const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${from}/${to}/${amount}`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.result === 'success') {
          const converted = data.conversion_result;
          const rate = data.conversion_rate;
          resultSpan.textContent = converted.toFixed(2);
          detailP.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
        } else {
          resultSpan.textContent = 'Error';
          detailP.textContent = data['error-type'] || 'Conversion failed.';
        }
      } catch (err) {
        resultSpan.textContent = 'API error';
        detailP.textContent = 'Check your internet connection or API key.';
      }
    }

    btn.addEventListener('click', convert);
    setTimeout(convert, 100);
  }
});

  // ==================== TIP TOOL ====================
  window.Tools.push({
    id: 'tip',
    name: 'Tip Calculator',
    icon: 'fas fa-receipt',
    description: 'Split bill + tip',
    render: function() {
      return `
        <div class="tool-form">
          <div class="form-row">
            <label>Bill Amount (₹)</label>
            <input type="number" id="tip-bill" value="1000" step="any" />
          </div>
          <div class="form-row">
            <label>Tip Percentage (%)</label>
            <input type="number" id="tip-percent" value="15" step="1" />
          </div>
          <div class="form-row">
            <label>Number of people</label>
            <input type="number" id="tip-people" value="2" min="1" />
          </div>
          <button class="btn btn-primary" id="tip-calc">Calculate</button>
          <div class="tool-result" id="tip-result">
            <p><strong>Tip per person:</strong> ₹<span id="tip-per-person">—</span></p>
            <p><strong>Total per person:</strong> ₹<span id="tip-total-per">—</span></p>
            <p><strong>Total bill with tip:</strong> ₹<span id="tip-total">—</span></p>
          </div>
        </div>
      `;
    },
    setup: function(container) {
      const btn = container.querySelector('#tip-calc');
      const perPerson = container.querySelector('#tip-per-person');
      const totalPer = container.querySelector('#tip-total-per');
      const totalSpan = container.querySelector('#tip-total');

      function calculate() {
        const bill = parseFloat(document.getElementById('tip-bill').value) || 0;
        const pct = parseFloat(document.getElementById('tip-percent').value) || 0;
        const people = parseInt(document.getElementById('tip-people').value) || 1;

        const tip = bill * (pct / 100);
        const total = bill + tip;
        const tipPerPerson = tip / people;
        const totalPerPerson = total / people;

        perPerson.textContent = tipPerPerson.toFixed(2);
        totalPer.textContent = totalPerPerson.toFixed(2);
        totalSpan.textContent = total.toFixed(2);
      }

      btn.addEventListener('click', calculate);
      setTimeout(calculate, 50);
    }
  });

  // ==================== DISCOUNT TOOL ====================
  window.Tools.push({
    id: 'discount',
    name: 'Discount / Sale',
    icon: 'fas fa-tags',
    description: 'Final price after discount',
    render: function() {
      return `
        <div class="tool-form">
          <div class="form-row">
            <label>Original Price (₹)</label>
            <input type="number" id="disc-original" value="5000" step="any" />
          </div>
          <div class="form-row">
            <label>Discount (%)</label>
            <input type="number" id="disc-percent" value="20" step="1" />
          </div>
          <button class="btn btn-primary" id="disc-calc">Calculate</button>
          <div class="tool-result" id="disc-result">
            <p><strong>Sale Price:</strong> ₹<span id="disc-sale">—</span></p>
            <p><strong>You Save:</strong> ₹<span id="disc-save">—</span></p>
          </div>
        </div>
      `;
    },
    setup: function(container) {
      const btn = container.querySelector('#disc-calc');
      const saleSpan = container.querySelector('#disc-sale');
      const saveSpan = container.querySelector('#disc-save');

      function calculate() {
        const original = parseFloat(document.getElementById('disc-original').value) || 0;
        const pct = parseFloat(document.getElementById('disc-percent').value) || 0;
        const discount = original * (pct / 100);
        const sale = original - discount;
        saleSpan.textContent = sale.toFixed(2);
        saveSpan.textContent = discount.toFixed(2);
      }

      btn.addEventListener('click', calculate);
      setTimeout(calculate, 50);
    }
  });

  console.log('All tools registered. Total:', window.Tools.length);
})();
