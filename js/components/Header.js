export const Header = () => `
    <header class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
            <button id="sidebar-toggle" class="w-8 h-8 flex items-center justify-center rounded-lg bg-[#141414] border border-white/5 hover:bg-white/5 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
            </button>
            <span class="font-bold text-xl tracking-tight text-gray-400">Dashboard</span>
        </div>

        <div class="flex items-center gap-4">
             <div class="flex items-center gap-3 bg-[#141414] rounded-full pl-1 pr-3 py-1 border border-white/10 cursor-pointer">
                <img src="avatar-miguel.png" alt="Miguel" class="w-8 h-8 rounded-full object-cover">
                <div class="flex flex-col">
                    <span class="text-[12px] font-semibold leading-none">Miguel Ohara</span>
                    <span class="text-[10px] text-gray-500">ohara@team.net</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
        </div>
    </header>
`;