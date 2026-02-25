export const CalendarCard = () => {
    const now = new Date();
    const monthName = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();

    return `
    <div class="card h-full flex flex-col">
        <div class="flex justify-between items-center mb-6">
            <div>
                <h3 class="text-xl font-bold">${monthName} ${year}</h3>
                <p class="text-gray-500 text-[10px] tracking-[0.05em] font-medium">Subscription Scheduler</p>
            </div>
            <div class="flex gap-2">
                <button id="prev-month" class="p-2 hover:bg-white/5 rounded-lg border border-white/5 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button id="next-month" class="p-2 hover:bg-white/5 rounded-lg border border-white/5 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
            </div>
        </div>

        <div class="grid grid-cols-7 gap-2 mb-2 text-center">
            ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => 
                `<span class="text-[9px] font-bold text-gray-600 tracking-widest uppercase">${day}</span>`
            ).join('')}
        </div>

        <div id="calendar-grid" class="grid grid-cols-7 gap-2 flex-1 min-h-[400px]">
            <!-- Dynamic Days -->
        </div>
    </div>
    `;
};