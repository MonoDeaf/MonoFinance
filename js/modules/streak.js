import { financeState, saveState } from '../state.js';

export function updateStreakUI(updateDashboardCallback) {
    const container = document.getElementById('streak-card-container');
    if (!container) return;

    const streak = financeState.streak || 0;
    const lastDate = financeState.lastUpdateDate;
    const today = new Date().toISOString().split('T')[0];
    const isUpdatedToday = lastDate === today;

    // Attach globals
    window.openDailyUpdateForm = () => {
        financeState.dailyUpdateViewActive = true;
        updateStreakUI(updateDashboardCallback);
    };

    window.closeDailyUpdateForm = () => {
        financeState.dailyUpdateViewActive = false;
        updateStreakUI(updateDashboardCallback);
    };

    if (financeState.dailyUpdateViewActive && !isUpdatedToday) {
        container.innerHTML = `
            <div class="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border border-[#ccccfa]/20 rounded-2xl p-5 relative animate-in fade-in duration-300">
                <div class="flex justify-between items-center mb-4">
                    <h4 class="text-xs font-bold uppercase tracking-widest text-white">Daily Log</h4>
                    <button onclick="window.closeDailyUpdateForm()" class="text-gray-500 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>
                <form id="daily-update-form" class="space-y-4">
                    <div class="flex flex-col gap-2">
                        <label class="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Update Type</label>
                        <div class="grid grid-cols-2 gap-2">
                            <label class="cursor-pointer">
                                <input type="radio" name="updateType" value="asset" checked class="hidden peer">
                                <div class="py-2 text-[10px] text-center border border-white/5 rounded-lg bg-white/5 peer-checked:border-[#ccccfa] peer-checked:bg-[#ccccfa]/10 transition-all font-bold">Entry</div>
                            </label>
                            <label class="cursor-pointer">
                                <input type="radio" name="updateType" value="no-change" class="hidden peer">
                                <div class="py-2 text-[10px] text-center border border-white/5 rounded-lg bg-white/5 peer-checked:border-[#ccccfa] peer-checked:bg-[#ccccfa]/10 transition-all font-bold">Check-in</div>
                            </label>
                        </div>
                    </div>
                    <div id="daily-asset-fields" class="space-y-3">
                        <input type="text" id="daily-label" class="w-full bg-black border border-white/5 rounded-lg p-2.5 text-xs outline-none focus:border-[#ccccfa]/50" placeholder="Details (e.g. Dividend)">
                        <div class="grid grid-cols-2 gap-2">
                            <select id="daily-category" class="bg-black border border-white/5 rounded-lg p-2.5 text-[10px] outline-none">
                                <option value="savings">Savings</option>
                                <option value="stocks">Stocks</option>
                                <option value="crypto">Crypto</option>
                                <option value="debit">Spent</option>
                            </select>
                            <input type="number" id="daily-amount" step="0.01" class="bg-black border border-white/5 rounded-lg p-2.5 text-xs outline-none" placeholder="0.00">
                        </div>
                    </div>
                    <button type="submit" class="w-full py-3 bg-[#ccccfa] text-black font-bold text-[10px] uppercase rounded-xl hover:bg-white transition-all transform active:scale-95">Complete</button>
                </form>
            </div>
        `;

        const form = document.getElementById('daily-update-form');
        const assetFields = document.getElementById('daily-asset-fields');
        const radios = form.querySelectorAll('input[name="updateType"]');
        radios.forEach(r => {
            r.addEventListener('change', () => {
                assetFields.style.opacity = r.value === 'asset' ? '1' : '0.3';
                assetFields.style.pointerEvents = r.value === 'asset' ? 'auto' : 'none';
            });
        });

        form.onsubmit = (e) => {
            e.preventDefault();
            const type = form.updateType.value;
            if (type === 'asset') {
                const amount = parseFloat(document.getElementById('daily-amount').value) || 0;
                const category = document.getElementById('daily-category').value;
                const label = document.getElementById('daily-label').value;
                if (amount > 0) {
                    financeState.entries.unshift({
                        id: Date.now(),
                        type: category,
                        label: label || 'Daily Update',
                        amount,
                        date: Date.now()
                    });
                }
            }
            const todayStr = new Date().toISOString().split('T')[0];
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (financeState.lastUpdateDate === yesterdayStr) {
                financeState.streak += 1;
            } else if (financeState.lastUpdateDate !== todayStr) {
                financeState.streak = 1;
            }
            financeState.lastUpdateDate = todayStr;
            financeState.dailyUpdateViewActive = false;
            saveState();
            updateDashboardCallback();
        };
    } else {
        container.innerHTML = `
            <div class="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex flex-col">
                        <span class="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Daily Streak</span>
                        <div class="flex items-baseline gap-2">
                            <h4 class="text-3xl font-black text-white">${streak}</h4>
                            <span class="text-xs text-gray-500 font-medium">days</span>
                        </div>
                    </div>
                    <div class="w-10 h-10 ${isUpdatedToday ? 'bg-[#ccccfa]/20 text-[#ccccfa]' : 'bg-white/5 text-gray-600'} rounded-xl flex items-center justify-center transition-colors">
                        <iconify-icon icon="material-symbols:local-fire-department-rounded" class="text-2xl"></iconify-icon>
                    </div>
                </div>
                <p class="text-[11px] text-gray-500 mb-5 leading-relaxed">
                    ${isUpdatedToday 
                        ? "Great work! You've logged your updates for today. See you tomorrow!" 
                        : "Log your daily financial changes to maintain your wealth-building streak."}
                </p>
                <button onclick="${isUpdatedToday ? '' : 'window.openDailyUpdateForm()'}" class="w-full py-3 ${isUpdatedToday ? 'bg-white/5 text-gray-400 cursor-default' : 'bg-[#ccccfa] text-black hover:bg-white'} text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                    ${isUpdatedToday ? 'Update Logged' : 'Log Daily Update'}
                    ${isUpdatedToday ? '<iconify-icon icon="material-symbols:check-circle-rounded"></iconify-icon>' : ''}
                </button>
            </div>
        `;
    }
}