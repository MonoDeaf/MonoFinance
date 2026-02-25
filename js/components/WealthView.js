import { financeState } from '../state.js';

export function WealthView(totals, totalWorth, formatter) {
    const assets = totals.savings + totals.investment + totals.emergency;
    const liabilities = totals.expenses + totals.subscriptions;
    const assetRatio = assets > 0 ? (assets / (assets + liabilities)) * 100 : 0;
    const liabilityRatio = 100 - assetRatio;

    return `
    <div class="flex flex-col gap-8 mb-12">
        <!-- Wealth Summary -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 card p-8 flex flex-col justify-between">
                <div>
                    <h3 class="text-xl font-bold mb-1">Wealth Breakdown</h3>
                    <p class="text-gray-500 text-xs">A macro view of your financial stability and asset-to-debt ratio.</p>
                </div>
                
                <div class="mt-12">
                    <div class="flex justify-between items-end mb-4">
                        <div class="flex flex-col">
                            <span class="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Net Position</span>
                            <span class="text-4xl font-black text-white">${formatter.format(totalWorth)}</span>
                        </div>
                        <div class="text-right">
                            <span class="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Financial Health</span>
                            <div class="text-xl font-bold text-[#ccccfa]">${assetRatio.toFixed(1)}% Assets</div>
                        </div>
                    </div>
                    
                    <div class="w-full h-4 bg-white/5 rounded-full overflow-hidden flex">
                        <div class="h-full bg-[#ccccfa] shadow-[0_0_15px_rgba(204,204,250,0.3)]" style="width: ${assetRatio}%"></div>
                        <div class="h-full bg-red-500/50" style="width: ${liabilityRatio}%"></div>
                    </div>
                    <div class="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-tighter">
                        <span class="text-[#ccccfa]">Total Assets: ${formatter.format(assets)}</span>
                        <span class="text-red-400">Total Liabilities: ${formatter.format(liabilities)}</span>
                    </div>
                </div>
            </div>

            <div class="card p-8 bg-gradient-to-br from-[#141414] to-[#0a0a0a]">
                <h4 class="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Wealth Score</h4>
                <div class="flex items-center justify-center py-4">
                    <div class="relative w-32 h-32 flex items-center justify-center">
                        <svg class="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="58" stroke="currentColor" stroke-width="8" fill="transparent" class="text-white/5" />
                            <circle cx="64" cy="64" r="58" stroke="currentColor" stroke-width="8" fill="transparent" 
                                stroke-dasharray="364.4" 
                                stroke-dashoffset="${364.4 - (364.4 * (assetRatio/100))}" 
                                class="text-[#ccccfa] transition-all duration-1000" />
                        </svg>
                        <span class="absolute text-2xl font-black">${Math.round(assetRatio)}</span>
                    </div>
                </div>
                <p class="text-[10px] text-center text-gray-500 mt-4 leading-relaxed uppercase tracking-widest">Based on liquidity and recurring obligations</p>
            </div>
        </div>

        <!-- Milestones -->
        <div class="card p-8">
            <h3 class="text-sm font-bold uppercase tracking-widest mb-6">Financial Milestones</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                ${financeState.milestones.map(m => `
                    <div class="bg-white/5 p-4 rounded-xl border ${m.completed ? 'border-[#ccccfa]/30 bg-[#ccccfa]/5' : 'border-white/5'} flex flex-col gap-3">
                        <div class="flex justify-between items-center">
                            <div class="w-8 h-8 rounded-lg ${m.completed ? 'bg-[#ccccfa] text-black' : 'bg-white/5 text-gray-500'} flex items-center justify-center">
                                <iconify-icon icon="${m.completed ? 'material-symbols:check-circle' : 'material-symbols:lock'}"></iconify-icon>
                            </div>
                            <span class="text-[9px] font-bold text-gray-500 uppercase tracking-widest">${m.completed ? 'Achieved' : 'Pending'}</span>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-white">${m.label}</p>
                            <p class="text-[10px] text-gray-500 mt-1">Target: ${formatter.format(m.target)}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>
    `;
}