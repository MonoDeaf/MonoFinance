import { financeState, saveState, CATEGORY_MAP, COLOR_MAP } from '../state.js';
import { showToast } from './toast.js';

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
            showToast('Added to Money Power');
        });
    }

    window.removeEntry = (id) => {
        financeState.entries = financeState.entries.filter(e => e.id !== id);
        saveState();
        updateCallback();
        showToast('Entry removed from ledger');
    };

    window.toggleHideEntry = (id) => {
        const entry = financeState.entries.find(e => e.id === id);
        if (entry) {
            entry.hidden = !entry.hidden;
            saveState();
            updateCallback();
            showToast(entry.hidden ? 'Asset hidden from Money Power' : 'Asset restored to Money Power');
        }
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
        const isHidden = entry.hidden === true;

        return `
            <div class="relative bg-[var(--bg-hover)] p-3 rounded-lg border border-[var(--border-main)] flex items-center justify-between group/item ${isHidden ? 'opacity-30 grayscale' : ''} transition-[background-color,border-color,opacity] duration-300">
                <div class="flex items-center gap-3">
                    <div class="w-1.5 h-6 rounded-full" style="background-color: ${color}"></div>
                    <div class="flex flex-col">
                        <span class="text-[11px] font-bold text-[var(--text-main)] leading-none">${entry.label}</span>
                        <span class="text-[9px] text-gray-500 uppercase mt-1">${entry.type}</span>
                    </div>
                </div>
                <div class="relative flex items-center justify-end w-[90px] flex-none">
                    <span class="text-xs font-bold transition-transform duration-300 transform-gpu -translate-x-[58px] lg:translate-x-0 lg:group-hover/item:-translate-x-[58px] ${entry.type === 'credit' || entry.type === 'debit' ? 'text-red-400' : 'text-[var(--text-muted)] group-hover/item:text-[var(--text-main)]'}">${formatter.format(entry.amount)}</span>
                    
                    <div class="absolute right-0 flex items-center gap-1 transition-opacity duration-300 opacity-100 lg:opacity-0 lg:group-hover/item:opacity-100 pointer-events-auto lg:pointer-events-none lg:group-hover/item:pointer-events-auto">
                        <button onclick="window.toggleHideEntry(${entry.id})" class="p-1 text-gray-500 hover:text-[var(--accent-primary)] transition-colors duration-200 outline-none">
                            <iconify-icon icon="${isHidden ? 'material-symbols:visibility-off-outline-rounded' : 'material-symbols:visibility-outline-rounded'}" class="text-sm"></iconify-icon>
                        </button>
                        <button onclick="window.removeEntry(${entry.id})" class="p-1 text-gray-500 hover:text-red-400 transition-colors duration-200 outline-none">
                             <iconify-icon icon="material-symbols:close-rounded" class="text-sm"></iconify-icon>
                        </button>
                    </div>
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
        
        // Always include in totalWorth, but filter from totals (donut chart) if hidden
        if (entry.type === 'credit') totalWorth -= entry.amount;
        else if (entry.type !== 'debit') totalWorth += entry.amount;

        if (entry.hidden) return; // Skip contributing to donut chart and stats breakdown if hidden
        
        totals[cat] += entry.amount;
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
        const isHidden = entry.hidden === true;
        return `
            <div class="relative bg-[var(--bg-hover)] p-4 rounded-xl border border-[var(--border-main)] flex items-center justify-between group/full transition-[background-color,border-color,opacity] duration-300 ${isHidden ? 'opacity-30 grayscale' : ''}">
                <div class="flex items-center gap-4">
                    <div class="w-1.5 h-10 rounded-full" style="background-color: ${color}"></div>
                    <div class="flex flex-col">
                        <span class="text-sm font-bold text-[var(--text-main)]">${entry.label}</span>
                        <span class="text-[10px] text-gray-500 uppercase tracking-wider">${entry.type}</span>
                    </div>
                </div>
                <div class="relative flex items-center justify-end w-[180px] flex-none">
                    <div class="text-lg font-bold transition-transform duration-300 transform-gpu -translate-x-[90px] lg:translate-x-0 lg:group-hover/full:-translate-x-[90px] ${entry.type === 'credit' || entry.type === 'debit' ? 'text-red-400' : 'text-[var(--text-main)]'}">
                        ${formatter.format(entry.amount)}
                    </div>
                    <div class="absolute right-0 flex items-center gap-1 sm:gap-2 transition-opacity duration-300 opacity-100 lg:opacity-0 lg:group-hover/full:opacity-100 pointer-events-auto lg:pointer-events-none lg:group-hover/full:pointer-events-auto">
                        <button onclick="window.toggleHideEntry(${entry.id})" class="text-gray-500 hover:text-[var(--accent-primary)] transition-colors duration-200 p-2 outline-none">
                            <iconify-icon icon="${isHidden ? 'material-symbols:visibility-off-outline-rounded' : 'material-symbols:visibility-outline-rounded'}" class="text-xl"></iconify-icon>
                        </button>
                        <button onclick="window.removeEntry(${entry.id})" class="text-gray-500 hover:text-red-400 transition-colors duration-200 p-2 outline-none">
                             <iconify-icon icon="material-symbols:close-rounded" class="text-xl"></iconify-icon>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}