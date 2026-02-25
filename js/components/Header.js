export const Header = (userEmail = 'guest@mono.finance') => `
    <header class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
            <button id="sidebar-toggle" class="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-card)] border border-[var(--border-main)] hover:bg-[var(--bg-hover)] transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
            </button>
            <span class="font-bold text-xl tracking-tight text-gray-400">Dashboard</span>
        </div>

        <div class="flex items-center gap-4 relative">
             <div id="user-menu-trigger" class="flex items-center gap-3 bg-[var(--bg-card)] rounded-full pl-1 pr-3 py-1 border border-[var(--border-main)] cursor-pointer hover:bg-[var(--bg-hover)] transition-colors group">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#ccccfa] to-[#5555aa] p-[1px]">
                    <img id="header-avatar" src="avatar-miguel.png" alt="User" class="w-full h-full rounded-full object-cover border border-black pointer-events-none">
                </div>
                <div class="flex flex-col pointer-events-none">
                    <span id="header-username" class="text-[12px] font-semibold leading-none group-hover:text-white transition-colors">User</span>
                    <div class="flex items-center gap-1">
                        <span id="sync-text" class="text-[10px] text-gray-500 max-w-[100px] truncate">Live Sync Active</span>
                        <span id="sync-indicator" class="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1" title="Connected to Vault"></span>
                    </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500 group-hover:text-white pointer-events-none"><path d="m6 9 6 6 6-6"/></svg>
            </div>

            <!-- User Dropdown Menu -->
            <div id="user-dropdown" class="hidden absolute top-full right-0 mt-3 w-48 bg-[#0f0f0f] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[60] py-2 overflow-hidden">
                <div class="px-4 py-3 border-b border-white/5 mb-1 bg-white/[0.02]">
                    <p class="text-[9px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-1">Signed in as</p>
                    <p class="text-xs text-white truncate font-medium">${userEmail}</p>
                </div>
                <div class="px-1">
                    <button onclick="window.navigateToTab('profile')" class="w-full flex items-center gap-3 px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all rounded-lg">
                        <iconify-icon icon="material-symbols:person-outline" class="text-lg"></iconify-icon>
                        My Profile
                    </button>
                    <button onclick="window.performLogout()" class="w-full flex items-center gap-3 px-3 py-2 text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all rounded-lg">
                        <iconify-icon icon="material-symbols:logout-rounded" class="text-lg"></iconify-icon>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    </header>
`;