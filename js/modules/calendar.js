import { financeState, saveState, SERVICE_ICONS } from '../state.js';

let currentCalendarDate = new Date();
let selectedDay = null;

export function initCalendar(updateCallback) {
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');

    if (!prevBtn || !nextBtn) return;

    prevBtn.addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
        selectedDay = null;
        renderCalendarGrid(updateCallback);
    });

    nextBtn.addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
        selectedDay = null;
        renderCalendarGrid(updateCallback);
    });

    renderCalendarGrid(updateCallback);
}

export function renderCalendarGrid(updateCallback) {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;

    // Expose globals for UI interaction (needed every render)
    window.openSubModal = (day) => openSubModal(day, updateCallback);
    window.closeSidePanel = closeSidePanel;
    window.removeSub = (id, day) => {
        financeState.subscriptions = financeState.subscriptions.filter(s => s.id !== id);
        saveState();
        renderCalendarGrid(updateCallback);
        openSubModal(day, updateCallback);
        updateCallback();
    };

    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    const titleEl = grid.parentElement.querySelector('h3');
    if (titleEl) {
        titleEl.innerText = `${currentCalendarDate.toLocaleString('default', { month: 'long' })} ${year}`;
    }

    const firstDay = new Date(year, month, 1).getDay();
    const startOffset = (firstDay === 0) ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let daysHtml = '';

    for (let i = 0; i < startOffset; i++) {
        daysHtml += `<div class="bg-white/[0.01] rounded-lg min-h-[60px] border border-transparent"></div>`;
    }

    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

    for (let d = 1; d <= daysInMonth; d++) {
        const daySubs = financeState.subscriptions.filter(s => s.day === d);
        const isToday = isCurrentMonth && today.getDate() === d;
        const isSelected = selectedDay === d;
        
        const borderClass = isSelected 
            ? 'border-[#ccccfa] bg-[#1a1a1a] ring-1 ring-[#ccccfa]/30 z-10 scale-[1.02]' 
            : isToday 
                ? 'border-[#ccccfa]/40 shadow-[0_0_15px_rgba(204,204,250,0.1)] outline outline-1 outline-[#ccccfa] outline-offset-2' 
                : 'border-white/5';

        daysHtml += `
            <div onclick="window.openSubModal(${d})" class="group relative bg-[#141414] hover:bg-[#1a1a1a] rounded-lg min-h-[80px] p-1.5 cursor-pointer transition-all border ${borderClass} hover:border-white/20 flex flex-col justify-between">
                <div class="flex justify-between items-start w-full px-1">
                    <span class="text-[11px] ${isSelected || isToday ? 'text-[#ccccfa] font-bold' : 'text-gray-500 group-hover:text-gray-300'}">${d}</span>
                    ${daySubs.length > 0 ? `<div class="w-1.5 h-1.5 rounded-full bg-[#ccccfa] shadow-[0_0_8px_rgba(204,204,250,0.8)]"></div>` : ''}
                </div>
                <div class="flex-1 flex items-center justify-center gap-0.5 -mt-2">
                    ${daySubs.map(s => {
                        const icon = SERVICE_ICONS[s.service] || SERVICE_ICONS['Custom'];
                        const isWhiteIcon = ['Apple', 'Amazon', 'X', 'Xbox', 'Car', 'ChatGPT'].includes(s.service);
                        return `<iconify-icon icon="${icon}" class="text-[20px] drop-shadow-sm ${isWhiteIcon ? 'text-white' : ''}" title="${s.service}: $${s.amount}"></iconify-icon>`;
                    }).join('')}
                </div>
            </div>
        `;
    }

    grid.innerHTML = daysHtml;
}

function closeSidePanel() {
    selectedDay = null;
    const grid = document.getElementById('calendar-grid');
    if (grid) {
        const titleEl = grid.parentElement.querySelector('h3');
        // We don't have updateCallback easily here, but we can just re-render grid
        // However, it's better to just remove classes from elements.
        // For simplicity, we trigger a refresh.
        const dayNodes = grid.querySelectorAll('div[onclick]');
        dayNodes.forEach(node => {
            node.classList.remove('border-[#ccccfa]', 'bg-[#1a1a1a]', 'ring-1', 'ring-[#ccccfa]/30', 'z-10', 'scale-[1.02]');
        });
    }

    const panel = document.getElementById('calendar-side-panel');
    if (panel) {
        panel.innerHTML = `
            <div class="card h-full flex flex-col items-center justify-center text-center p-8 border-dashed border-white/10 opacity-40 animate-in fade-in duration-300">
                <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                </div>
                <p class="text-xs text-gray-500 leading-relaxed max-w-[180px]">Select a day on the calendar to manage subscriptions</p>
            </div>
        `;
    }
}

function openSubModal(day, updateCallback) {
    const panel = document.getElementById('calendar-side-panel');
    if (!panel) return;

    selectedDay = day;
    renderCalendarGrid(updateCallback);

    const daySubs = financeState.subscriptions.filter(s => s.day === day);
    
    panel.innerHTML = `
        <div class="card h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-500 ease-out">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h4 class="text-sm font-bold">Day ${day} Subscriptions</h4>
                    <p class="text-gray-500 text-[10px] font-medium mt-0.5">Recurring Costs</p>
                </div>
                <button onclick="window.closeSidePanel()" class="text-gray-500 hover:text-white transition-colors p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>

            <div class="flex-1 overflow-y-auto mb-6 space-y-3 pr-1" style="scrollbar-width: none;">
                ${daySubs.length === 0 ? `
                    <div class="h-32 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                        <p class="text-gray-600 text-[10px] italic">No active subscriptions</p>
                    </div>
                ` : daySubs.map(s => {
                    const icon = SERVICE_ICONS[s.service] || SERVICE_ICONS['Custom'];
                    return `
                    <div class="bg-white/[0.03] p-3 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#ccccfa] border border-white/5">
                                <iconify-icon icon="${icon}" class="text-lg"></iconify-icon>
                            </div>
                            <div class="flex flex-col">
                                <span class="text-xs font-bold text-white">${s.service}</span>
                                <span class="text-[10px] text-gray-500 font-medium mt-0.5">$${s.amount.toFixed(2)} monthly</span>
                            </div>
                        </div>
                        <button onclick="window.removeSub(${s.id}, ${day})" class="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2">
                             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                    </div>
                `}).join('')}
            </div>

            <div class="pt-6 border-t border-white/5">
                <form id="side-sub-form" class="space-y-4">
                    <input type="hidden" id="sub-day-input" value="${day}">
                    <div>
                        <label class="block text-[10px] text-gray-500 uppercase font-bold tracking-[0.15em] mb-2 ml-1">Service Type</label>
                        <select id="sub-service" class="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3.5 text-xs focus:outline-none focus:border-[#ccccfa]/50 transition-colors cursor-pointer appearance-none">
                            <option value="Netflix">Netflix</option>
                            <option value="Spotify">Spotify</option>
                            <option value="ChatGPT">ChatGPT Plus</option>
                            <option value="Apple">Apple Services</option>
                            <option value="Amazon">Amazon Prime</option>
                            <option value="X">X (Twitter)</option>
                            <option value="Xbox">Xbox / Game Pass</option>
                            <option value="Car">Car / Insurance</option>
                            <option value="Facebook">Facebook / Meta</option>
                            <option value="Housing">Housing / Rent</option>
                            <option value="Discord">Discord Nitro</option>
                            <option value="Snapchat">Snapchat+</option>
                            <option value="Food">Food / Groceries</option>
                            <option value="Adobe">Adobe CC</option>
                            <option value="Custom">Other...</option>
                        </select>
                    </div>
                    <div id="custom-service-container" class="hidden">
                        <input type="text" id="sub-custom-name" class="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3.5 text-xs" placeholder="Service Name">
                    </div>
                    <div>
                         <label class="block text-[10px] text-gray-500 uppercase font-bold tracking-[0.15em] mb-2 ml-1">Monthly Amount</label>
                        <div class="relative">
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
                            <input type="number" id="sub-cost" step="0.01" required class="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3.5 pl-8 text-xs focus:outline-none focus:border-[#ccccfa]/50 transition-colors" placeholder="0.00">
                        </div>
                    </div>
                    <button type="submit" class="w-full py-4 bg-white text-black text-sm font-bold rounded-md hover:bg-[#ccccfa] transition-all transform active:scale-[0.98] shadow-lg shadow-white/5">Add to Subscriptions</button>
                </form>
            </div>
        </div>
    `;

    const sideSubForm = document.getElementById('side-sub-form');
    const serviceSelect = document.getElementById('sub-service');
    const customServiceContainer = document.getElementById('custom-service-container');

    serviceSelect.addEventListener('change', (e) => {
        customServiceContainer.classList.toggle('hidden', e.target.value !== 'Custom');
    });

    sideSubForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const subDay = parseInt(document.getElementById('sub-day-input').value);
        const service = serviceSelect.value === 'Custom' ? document.getElementById('sub-custom-name').value : serviceSelect.value;
        const amount = parseFloat(document.getElementById('sub-cost').value);

        if (service && amount > 0) {
            financeState.subscriptions.push({ id: Date.now(), service, amount, day: subDay });
            saveState();
            renderCalendarGrid(updateCallback);
            openSubModal(subDay, updateCallback);
            updateCallback();
        }
    });
}