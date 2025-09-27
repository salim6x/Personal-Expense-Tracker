document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const descriptionInput = document.getElementById('description');
    const categorySelect = document.getElementById('category');
    const amountInput = document.getElementById('amount');
    const expenseList = document.getElementById('expense-list');
    const totalSpentEl = document.getElementById('total-spent');
    const remainingBalanceEl = document.getElementById('remaining-balance');
    const budgetInput = document.getElementById('budget-input');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let budget = parseFloat(localStorage.getItem('budget')) || 0;

    budgetInput.value = budget.toFixed(2);

    function saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    function saveBudget() {
        localStorage.setItem('budget', budget.toFixed(2));
    }

    function updateBudgetSummary() {
        const totalSpent = expenses.reduce((acc, expense) => acc + expense.amount, 0);
        const remaining = budget - totalSpent;

        totalSpentEl.textContent = totalSpent.toFixed(2);
        remainingBalanceEl.textContent = remaining.toFixed(2);
    }

    function addExpenseToList(expense) {
        const li = document.createElement('li');
        li.classList.add('category-' + expense.category);

        li.innerHTML = `
            <span>${expense.description}</span>
            <span>$${expense.amount.toFixed(2)}</span>
            <button class="delete-btn" title="Delete Expense">&times;</button>
        `;

        li.querySelector('.delete-btn').addEventListener('click', () => {
            expenses = expenses.filter(e => e !== expense);
            saveExpenses();
            renderExpenses();
            updateBudgetSummary();
        });

        expenseList.appendChild(li);
    }

    function renderExpenses() {
        expenseList.innerHTML = '';
        expenses.forEach(expense => {
            addExpenseToList(expense);
        });
    }

    expenseForm.addEventListener('submit', e => {
        e.preventDefault();
        const description = descriptionInput.value.trim();
        const category = categorySelect.value;
        const amount = parseFloat(amountInput.value);
        if(description && category && amount > 0) {
            const newExpense = { description, category, amount };
            expenses.push(newExpense);
            saveExpenses();
            renderExpenses();
            updateBudgetSummary();
            expenseForm.reset();
        }
    });

    budgetInput.addEventListener('input', () => {
        const val = parseFloat(budgetInput.value);
        if(!isNaN(val) && val >= 0) {
            budget = val;
            saveBudget();
            updateBudgetSummary();
        }
    });

    renderExpenses();
    updateBudgetSummary();
});
