document.addEventListener('DOMContentLoaded', () => {
    const budgetInput = document.getElementById("btv");
    const budgetBtn = document.getElementById("upBudget");
    const amtDisp = document.getElementById("amtDisp");
    const remVal = document.getElementById("remaining-val");
    const expenseForm = document.getElementById("expense-form");
    const expenseNameInput = document.getElementById("expense-name");
    const expenseAmountInput = document.getElementById("expense-amount");
    const expenseCatInput = document.getElementById('expense-cat');
    const expenseList = document.getElementById('expense-list');
    const editBudgetBtn = document.getElementById('edit-budget-btn');
    const resetBtn = document.getElementById('reset-btn');

    let BUDGET = JSON.parse(localStorage.getItem('voyage_budget')) || 0;

    if (BUDGET > 0) {
        budgetBtn.classList.add('hidden');
        budgetInput.classList.add('hidden');
        amtDisp.textContent = '$' + BUDGET;
        editBudgetBtn.classList.remove('hidden');
    }

    let expenses = JSON.parse(localStorage.getItem('voyage_expenses')) || [];

    renderList();
    updateTotal();

    budgetBtn.addEventListener("click", (event) => {
        event.preventDefault();
        const bgt = parseFloat(budgetInput.value.trim());
        if (!isNaN(bgt) && bgt > 0) {
            BUDGET = bgt;

            localStorage.setItem('voyage_budget', BUDGET);

            budgetBtn.classList.add("hidden");
            budgetInput.classList.add("hidden");
            amtDisp.textContent = `$${BUDGET}`;
            remVal.textContent = `$${BUDGET}`;
            editBudgetBtn.classList.remove('hidden');
            updateTotal();
        }
    })

    editBudgetBtn.addEventListener('click', () => {
        BUDGET = 0;
        localStorage.removeItem('voyage_budget');
        budgetBtn.classList.remove('hidden');
        budgetInput.classList.remove('hidden');
        editBudgetBtn.classList.add('hidden');
        budgetInput.value = '';
        amtDisp.textContent = '';
        updateTotal();
    });

    expenseForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const expName = expenseNameInput.value.trim();
        const expAmt = parseFloat(expenseAmountInput.value.trim());
        const expCat = expenseCatInput.value;

        if (BUDGET === 0) {
            alert('Please set a budget first before adding expenses.');
            return;
        }

        // check if expense exceeds remaining balance
        const currentTotal = calculateTotal();
        const remaining = BUDGET - currentTotal;

        if (expAmt > remaining) {
            alert(`Not enough balance! You only have $${remaining.toFixed(2)} remaining.`);
            return;
        }

        if (expName !== '' && !isNaN(expAmt) && expAmt > 0) {
            const newExp = {
                id: Date.now(),
                name: expName,
                amount: expAmt,
                cat: expCat
            };

            expenses.push(newExp);
            saveExp();
            updateTotal();
            renderList();
        }
    })

    function saveExp() {
        localStorage.setItem('voyage_expenses', JSON.stringify(expenses));
    }

    function updateTotal() {
        const total = calculateTotal();
        const remaining = BUDGET - total;

        document.getElementById("spent-val").textContent = '$' + Math.round(total).toLocaleString();
        document.getElementById('remaining-val').textContent = '$' + Math.max(Math.round(remaining), 0).toLocaleString();
    }

    function calculateTotal() {
        let sum = 0;
        for (let i = 0; i < expenses.length; i++) {
            sum += expenses[i].amount;
        }
        return sum;
    }

    function renderList() {
        expenseList.innerHTML = '';

        expenses.forEach(expense => {
            const li = document.createElement("li");
            li.innerHTML = `
            <div style="display: flex;">
                <div class="cat-dot" style="background:#C4622D; margin-right:10px;"></div>
                <div>
                    <div class="exp-name">${expense.name}</div>
                    <div class="exp-cat">${expense.cat}</div>
                </div>
            </div>
            <div class="exp-right">
                <div class="exp-amount">$${expense.amount.toFixed(2)}</div>
                <button class="delete-btn" data-id="${expense.id}">✕</button>
            </div>
            `;
            expenseList.appendChild(li);
        });
    }

    expenseList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const id = parseInt(e.target.getAttribute('data-id'));
            expenses = expenses.filter(expense => expense.id !== id);
            saveExp();
            renderList();
            updateTotal();
        }
    });

    resetBtn.addEventListener('click', () => {
        if (!confirm('Clear all expenses and reset budget?')) return;

        expenses = [];
        BUDGET = 0;
        localStorage.removeItem('voyage_expenses');
        localStorage.removeItem('voyage_budget');

        budgetBtn.classList.remove('hidden');
        budgetInput.classList.remove('hidden');
        editBudgetBtn.classList.add('hidden');
        budgetInput.value = '';
        amtDisp.textContent = '';

        renderList();
        updateTotal();
    });

});