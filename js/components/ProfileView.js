import { financeState, saveState } from '../state.js';

export function ProfileView() {
    const profile = financeState.profile || { name: 'User', avatarUrl: 'avatar-miguel.png', theme: 'dark' };

    return `
    <div class="flex flex-col gap-8 mb-12">
        <div class="card p-4 sm:p-8">
            <div class="flex flex-col md:flex-row gap-12">
                <!-- Left Column: Avatar & Basic Info -->
                <div class="flex flex-col items-center gap-6 w-full md:w-1/3">
                    <div class="relative group">
                        <div class="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-[#ccccfa] to-[#5555aa]">
                            <img id="profile-avatar-preview" src="${profile.avatarUrl}" class="w-full h-full rounded-full object-cover border-4 border-[var(--bg-card)]" alt="Avatar">
                        </div>
                        <label class="absolute bottom-0 right-0 w-10 h-10 btn-primary rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all">
                            <input type="file" class="hidden" accept="image/*" onchange="window.updateProfileAvatar(event)">
                            <iconify-icon icon="material-symbols:edit-outline-rounded"></iconify-icon>
                        </label>
                    </div>
                    <div class="text-center">
                        <h3 class="text-xl font-bold text-[var(--text-main)]">${profile.name || 'User'}</h3>
                        <p class="text-gray-500 text-xs uppercase tracking-widest mt-1">Primary Vault Owner</p>
                    </div>
                </div>

                <!-- Right Column: Form Settings -->
                <div class="flex-1 space-y-8">
                    <div>
                        <h4 class="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Identity Settings</h4>
                        <form onsubmit="window.saveProfileSettings(event)" class="space-y-6">
                            <div>
                                <label class="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Display Name</label>
                                <input type="text" name="displayName" value="${profile.name || ''}" class="w-full input-base rounded-lg p-3.5 text-sm focus:outline-none focus:border-[var(--accent-primary)]/50 transition-all" placeholder="Enter your name">
                            </div>
                            
                            <div>
                                <label class="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Preferences</label>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div onclick="window.toggleTheme()" class="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-main)] flex items-center justify-between cursor-pointer group hover:border-[var(--accent-primary)]/30 transition-all">
                                        <span class="text-xs font-medium">Light Theme</span>
                                        <div class="w-10 h-5 bg-gray-400 rounded-full relative transition-colors ${profile.theme === 'light' ? 'bg-[var(--accent-primary)]' : 'bg-gray-600'}">
                                            <div class="absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${profile.theme === 'light' ? 'right-1' : 'left-1'}"></div>
                                        </div>
                                    </div>
                                    <div class="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-main)] flex items-center justify-center opacity-30 cursor-not-allowed">
                                        <span class="text-[10px] font-bold uppercase tracking-tighter">More themes coming soon</span>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" class="px-8 py-3 btn-primary font-bold text-xs rounded-[0.25rem] transition-all">Save Changes</button>
                        </form>
                    </div>

                    <div class="pt-8 border-t border-white/5">
                        <h4 class="text-sm font-bold uppercase tracking-widest text-red-500 mb-4">Danger Zone</h4>
                        <div class="bg-red-500/5 border border-red-500/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div>
                                <p class="text-sm font-bold text-white">Delete Account</p>
                                <p class="text-xs text-gray-500 mt-1">Permanently remove all your financial data and vault access.</p>
                            </div>
                            <button onclick="window.confirmDeleteAccount()" class="w-full sm:w-auto px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-bold rounded-[0.25rem] border border-red-500/20 transition-all">
                                Delete Vault
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}