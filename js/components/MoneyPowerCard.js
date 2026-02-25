import { financeState } from '../state.js';

export const MoneyPowerCard = () => {
    const bgType = financeState.widgetBgType || 'image';
    const customData = financeState.customBgData;
    
    const PRESET_IMAGES = [
        'Solitary Cabin on Hill.png',
        'Serene Landscape Scene.png',
        'Majestic Mountain Scene.png',
        'Urban Serenity Scene.png'
    ];

    let bgContent = '';
    // Normalize bgType to remove leading slashes (fixes path issues on GitHub Pages)
    const normalizedBgType = (typeof bgType === 'string' && bgType.startsWith('/')) ? bgType.substring(1) : bgType;

    // Handle legacy 'image' value or specific preset paths
    if (normalizedBgType === 'image' || normalizedBgType === PRESET_IMAGES[0]) {
        bgContent = `<img src="${PRESET_IMAGES[0]}" class="w-full h-full object-cover filter brightness-[1.15] contrast-[1.1]" alt="background">`;
    } else if (PRESET_IMAGES.includes(normalizedBgType)) {
        bgContent = `<img src="${normalizedBgType}" class="w-full h-full object-cover filter brightness-[1.15] contrast-[1.1]" alt="background">`;
    } else if (bgType === 'custom' && customData) {
        bgContent = `<img src="${customData}" class="w-full h-full object-cover filter brightness-[1.15] contrast-[1.1]" alt="custom background">`;
    }

    return `
    <div class="card !p-2 lg:!p-8 flex flex-col h-full relative overflow-hidden group">
        <!-- Background Splash -->
        <div id="money-power-bg" class="absolute inset-0 z-0 pointer-events-none opacity-40 transition-all duration-500">
            ${bgContent}
            <div class="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
        </div>

        <div class="relative z-10 flex flex-col h-full">
            <div class="w-full flex justify-between items-start mb-8 sm:px-4">
                <div>
                    <h3 class="text-xl font-bold">Total Money Power</h3>
                    <p class="text-gray-500 text-xs">Analysis based on your current liquid assets.</p>
                </div>
                
                <!-- Background Controls -->
                <div class="flex items-center gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/10 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity overflow-x-auto max-w-full scrollbar-hide">
                    <button onclick="window.setWidgetBg('none')" class="w-5 h-5 rounded-full bg-zinc-800 border border-white/20 hover:border-white/60 transition-colors shrink-0" title="Default"></button>
                    
                    ${PRESET_IMAGES.map(img => `
                        <button onclick="window.setWidgetBg('${img}')" class="w-5 h-5 rounded-full bg-gray-800 border ${normalizedBgType === img || (normalizedBgType === 'image' && img === PRESET_IMAGES[0]) ? 'border-[#ccccfa] ring-1 ring-[#ccccfa]/30' : 'border-white/20'} hover:border-white/60 overflow-hidden transition-colors shrink-0">
                            <img src="${img}" class="w-full h-full object-cover">
                        </button>
                    `).join('')}

                    <label class="w-5 h-5 rounded-full bg-white/10 border border-dashed border-white/30 hover:border-white/60 flex items-center justify-center cursor-pointer transition-colors shrink-0" title="Upload Custom">
                        <input type="file" class="hidden" accept="image/*" onchange="window.uploadWidgetBg(event)">
                        <iconify-icon icon="material-symbols:add" class="text-[10px]"></iconify-icon>
                    </label>
                </div>
            </div>

            <div class="flex flex-col lg:flex-row flex-1 items-center justify-between gap-12 sm:px-4">
                <!-- Left Side: Chart (Pushed slightly right to accommodate labels) -->
                <div class="relative w-full max-w-[280px] sm:max-w-[320px] aspect-square lg:ml-8">
                    <!-- Dynamic Labels -->
                    <div id="container-savings" class="absolute text-center z-10 transition-all duration-700 ease-out" style="left: 50%; top: 50%;">
                        <div class="text-[9px] text-gray-500 uppercase tracking-widest mb-0.5">SAV</div>
                        <div id="label-savings" class="text-xs font-bold">0%</div>
                    </div>
                    
                    <div id="container-investment" class="absolute text-center z-10 transition-all duration-700 ease-out" style="left: 50%; top: 50%;">
                        <div class="text-[9px] text-gray-500 uppercase tracking-widest mb-0.5">INV</div>
                        <div id="label-investment" class="text-xs font-bold">0%</div>
                    </div>

                    <div id="container-expenses" class="absolute text-center z-10 transition-all duration-700 ease-out" style="left: 50%; top: 50%;">
                        <div class="text-[9px] text-gray-500 uppercase tracking-widest mb-0.5">EXP</div>
                        <div id="label-expenses" class="text-xs font-bold">0%</div>
                    </div>

                    <div id="container-emergency" class="absolute text-center z-10 transition-all duration-700 ease-out" style="left: 50%; top: 50%;">
                        <div class="text-[9px] text-gray-500 uppercase tracking-widest mb-0.5">EMG</div>
                        <div id="label-emergency" class="text-xs font-bold">0%</div>
                    </div>

                    <div id="container-subscriptions" class="absolute text-center z-10 transition-all duration-700 ease-out" style="left: 50%; top: 50%;">
                        <div class="text-[9px] text-gray-500 uppercase tracking-widest mb-0.5">SUB</div>
                        <div id="label-subscriptions" class="text-xs font-bold">0%</div>
                    </div>

                    <!-- SVG Donut Chart -->
                    <svg viewBox="0 0 100 100" class="w-full h-full transform -rotate-[90deg]">
                        <circle id="ring-savings" cx="50" cy="50" r="40" fill="none" stroke="#ccccfa" stroke-width="8" stroke-dasharray="0 252" stroke-linecap="round" class="transition-all duration-700 ease-out"/>
                        <circle id="ring-investment" cx="50" cy="50" r="40" fill="none" stroke="#8a8ab0" stroke-width="8" stroke-dasharray="0 252" stroke-linecap="round" class="transition-all duration-700 ease-out"/>
                        <circle id="ring-expenses" cx="50" cy="50" r="40" fill="none" stroke="#6ed4f2" stroke-width="8" stroke-dasharray="0 252" stroke-linecap="round" class="transition-all duration-700 ease-out"/>
                        <circle id="ring-emergency" cx="50" cy="50" r="40" fill="none" stroke="#ff4a00" stroke-width="8" stroke-dasharray="0 252" stroke-linecap="round" class="transition-all duration-700 ease-out"/>
                        <circle id="ring-subscriptions" cx="50" cy="50" r="40" fill="none" stroke="#e91e63" stroke-width="8" stroke-dasharray="0 252" stroke-linecap="round" class="transition-all duration-700 ease-out"/>
                    </svg>

                    <!-- Center Content -->
                    <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <h2 class="text-2xl font-bold tracking-tight text-center leading-tight">Money Power</h2>
                        <div id="growth-badge" class="mt-2 px-4 py-1 bg-[#ccccfa] text-[#030030] border-none rounded-full text-[12px] font-black shadow-lg shadow-[#ccccfa]/10 uppercase tracking-tight">
                            Money Power Goal 0%
                        </div>
                    </div>
                </div>

                <!-- Right Side: Scrollable List -->
                <div class="w-full lg:max-w-[300px] h-[320px] bg-[var(--bg-input)] rounded-xl border border-[var(--border-main)] flex flex-col ledger-shadow">
                    <div class="p-4 border-b border-[var(--border-main)] flex justify-between items-center">
                        <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Assets Ledger</span>
                        <span id="ledger-count" class="text-[10px] bg-[#ccccfa] text-black px-2 py-0.5 rounded-full font-bold">0</span>
                    </div>
                    <div id="ledger-list" class="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-hide" style="scrollbar-width: none;">
                        <!-- Appended items appear here -->
                        <div class="h-full flex items-center justify-center text-gray-600 text-xs italic">No entries yet</div>
                    </div>
                </div>
            </div>
            
            <div class="mt-12 w-full grid grid-cols-2 md:grid-cols-5 gap-4 sm:px-4 pb-6">
                <div class="flex flex-col gap-1 border-l-2 border-[#ccccfa] pl-4">
                    <span class="text-gray-500 text-[10px] uppercase">Savings</span>
                    <span id="stat-savings" class="text-lg font-bold text-sm">$0.00</span>
                </div>
                <div class="flex flex-col gap-1 border-l-2 border-[#8a8ab0] pl-4">
                    <span class="text-gray-500 text-[10px] uppercase">Invested</span>
                    <span id="stat-investment" class="text-lg font-bold text-sm">$0.00</span>
                </div>
                <div class="flex flex-col gap-1 border-l-2 border-[#ff4a00] pl-4">
                    <span class="text-gray-500 text-[10px] uppercase">Emergency</span>
                    <span id="stat-emergency" class="text-lg font-bold text-sm">$0.00</span>
                </div>
                <div class="flex flex-col gap-1 border-l-2 border-[#6ed4f2] pl-4">
                    <span class="text-gray-500 text-[10px] uppercase">Spent</span>
                    <span id="stat-expenses" class="text-lg font-bold text-sm">$0.00</span>
                </div>
                <div class="flex flex-col gap-1 border-l-2 border-[#e91e63] pl-4">
                    <span class="text-gray-500 text-[10px] uppercase">Subs</span>
                    <span id="stat-subscriptions" class="text-lg font-bold text-sm">$0.00</span>
                </div>
            </div>
        </div>
    </div>
    `;
};