export const Sidebar = () => `
    <aside id="sidebar" class="sidebar flex flex-col h-full overflow-y-auto border-r border-white/5 bg-[#0a0a0a]">
        <!-- Logo Section -->
        <div class="px-6 py-6 mb-2">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-black/50 border border-white/10">
                    <img src="./logo-export.png" alt="Lunor Logo" class="w-full h-full object-cover">
                </div>
                <div class="flex flex-col">
                    <span class="font-bold text-lg tracking-tight leading-none text-white">Mono</span>
                    <span class="text-[10px] text-[#ccccfa] font-bold uppercase tracking-[0.2em] mt-1 opacity-70">Finance</span>
                </div>
            </div>
        </div>

        <!-- Brand Switcher -->
        <div class="px-4 mb-6">
            <div class="flex items-center justify-between bg-[#141414] p-3 rounded-xl border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-[#222] rounded-full flex items-center justify-center overflow-hidden">
                        <iconify-icon icon="material-symbols:account-balance-wallet-outline" class="text-lg text-[#ccccfa]"></iconify-icon>
                    </div>
                    <span class="font-semibold text-xs">Primary Vault</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
            </div>
        </div>

        <!-- Search & Quick Actions -->
        <div class="px-4 mb-6 space-y-1">
            <div class="sidebar-item group">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <span>Search</span>
                <span class="ml-auto text-[10px] bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-gray-500">/</span>
            </div>
            <div class="sidebar-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
                <span>Reports</span>
            </div>
        </div>

        <!-- Main Nav -->
        <div class="px-4 mb-6">
            <h3 class="px-3 mb-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Main</h3>
            <div class="space-y-1">
                <div class="sidebar-item active">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                    <span>Dashboard</span>
                </div>
                <div class="sidebar-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    <span>Analytics</span>
                </div>
                <div class="sidebar-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    <span>Templates</span>
                </div>
                <div class="sidebar-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>
                    <span>Settings</span>
                </div>
                <div class="sidebar-item hover:text-red-400 group" onclick="window.performLogout()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:text-red-400"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                    <span>Sign Out</span>
                </div>
            </div>
        </div>

        <!-- Daily Streak Card -->
        <div id="streak-card-container" class="mt-auto px-4 pb-4">
            <!-- Populated by updateStreakUI -->
        </div>

        <!-- PWA Install Button -->
        <div id="pwa-install-container" class="px-4 pb-8 hidden animate-in fade-in duration-700">
            <button id="install-pwa-btn" class="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-2">
                <iconify-icon icon="material-symbols:download-for-offline-outline-rounded" class="text-lg"></iconify-icon>
                Install App
            </button>
        </div>
    </aside>
`;