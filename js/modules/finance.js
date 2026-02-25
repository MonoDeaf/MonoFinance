import { financeState, saveState, CATEGORY_MAP, COLOR_MAP } from '../state.js';

export function initFinance(updateCallback) {
    const form = document.getElementById('financial-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const type = document.getElementById('input-category').value;
            const labelText = document.getElementById('input-label').value;
            const amount = parseFloat(document.getElementById('input-amount').value) || 0;

            if (amount <= 0) return;

            financeState.entries.unshift({
                id: Date.now(),
                type,
                label: labelText || type.charAt(0).toUpperCase() + type.slice(1),
                amount,
                date: Date.now()
            });
            
            saveState();
            updateCallback();
            form.reset();
        });
    }

    window.removeEntry = (id) => {
        financeState.entries = financeState.entries.filter(e => e.id !== id);
        saveState();
        updateCallback();
    };
}

export function updateLedgerUI(formatter) {
    const list = document.getElementById('ledger-list');
    const count = document.getElementById('ledger-count');
    if (!list) return;

    // Refresh count including both entries and subscriptions
    count.innerText = financeState.entries.length + financeState.subscriptions.length;

    if (financeState.entries.length === 0) {
        list.innerHTML = `<div class="h-full flex items-center justify-center text-gray-600 text-xs italic">No entries yet</div>`;
        return;
    }

    list.innerHTML = financeState.entries.map(entry => {
        const cat = CATEGORY_MAP[entry.type];
        const color = COLOR_MAP[cat];
        return `
            <div class="bg-[var(--bg-hover)] p-3 rounded-lg border border-[var(--border-main)] flex items-center justify-between group">
                <div class="flex items-center gap-3">
                    <div class="w-1.5 h-6 rounded-full" style="background-color: ${color}"></div>
                    <div class="flex flex-col">
                        <span class="text-[11px] font-bold text-[var(--text-main)] leading-none">${entry.label}</span>
                        <span class="text-[9px] text-gray-500 uppercase mt-1">${entry.type}</span>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold ${entry.type === 'credit' || entry.type === 'debit' ? 'text-red-400' : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)]'}">${formatter.format(entry.amount)}</span>
                    <button onclick="window.removeEntry(${entry.id})" class="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                         <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

export function getFinancialSnapshot() {
    const totals = {
        savings: 0, investment: 0, emergency: 0, expenses: 0, subscriptions: 0
    };
    let totalWorth = 0;

    financeState.entries.forEach(entry => {
        const cat = CATEGORY_MAP[entry.type];
        totals[cat] += entry.amount;
        if (entry.type === 'credit') totalWorth -= entry.amount;
        else if (entry.type !== 'debit') totalWorth += entry.amount;
    });

    financeState.subscriptions.forEach(sub => {
        totals.subscriptions += sub.amount;
        totalWorth -= sub.amount;
    });

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return { totals, totalWorth, currencyFormatter };
}

export function updateAssetsFullList(formatter) {
    const list = document.getElementById('assets-full-list');
    if (!list) return;

    if (financeState.entries.length === 0) {
        list.innerHTML = `<div class="h-32 flex items-center justify-center text-gray-600 text-xs italic">No entries yet</div>`;
        return;
    }

    list.innerHTML = financeState.entries.map(entry => {
        const color = COLOR_MAP[CATEGORY_MAP[entry.type]] || '#888';
        return `
            <div class="bg-[var(--bg-hover)] p-4 rounded-xl border border-[var(--border-main)] flex items-center justify-between group hover:shadow-md transition-all">
                <div class="flex items-center gap-4">
                    <div class="w-1.5 h-10 rounded-full" style="background-color: ${color}"></div>
                    <div class="flex flex-col">
                        <span class="text-sm font-bold text-[var(--text-main)]">${entry.label}</span>
                        <span class="text-[10px] text-gray-500 uppercase tracking-wider">${entry.type}</span>
                    </div>
                </div>
                <div class="flex items-center gap-6">
                    <div class="text-lg font-bold ${entry.type === 'credit' || entry.type === 'debit' ? 'text-red-400' : 'text-[var(--text-main)]'}">
                        ${formatter.format(entry.amount)}
                    </div>
                    <button onclick="window.removeEntry(${entry.id})" class="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2">
                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}