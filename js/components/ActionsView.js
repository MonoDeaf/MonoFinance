import { financeState } from '../state.js';

export function ActionsView() {
    const actions = financeState.actions || [];
    const selectedUrl = financeState.selectedActionUrl;

    return `
    <div class="flex flex-col gap-8 mb-12">
        <div class="w-full flex flex-col gap-6">
            <div class="card p-8 flex flex-col h-auto min-h-[500px]">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h3 class="text-xl font-bold">Quick Actions</h3>
                        <p class="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Launch Tools & Manage Costs</p>
                    </div>
                    <button onclick="window.toggleActionForm()" class="bg-white text-black px-4 py-2 rounded-[0.25rem] text-xs font-bold hover:bg-[#ccccfa] transition-all flex items-center gap-2">
                        <iconify-icon icon="material-symbols:add"></iconify-icon>
                        New Action
                    </button>
                </div>

                <!-- Add Action Form (Hidden by default) -->
                <div id="action-form-container" class="hidden mb-8 p-6 bg-white/[0.02] border border-dashed border-white/10 rounded-[0.25rem] animate-in fade-in duration-300">
                    <form onsubmit="window.addNewAction(event)" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div class="lg:col-span-1">
                            <label class="block text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em] mb-2">Action Type</label>
                            <select name="type" onchange="this.form.url.required = (this.value === 'url'); this.form.url.parentElement.classList.toggle('hidden', this.value !== 'url')" class="w-full bg-black/40 border border-white/10 rounded-[0.25rem] p-3 text-xs focus:border-[#ccccfa]/50 outline-none appearance-none cursor-pointer">
                                <option value="url">Visit URL</option>
                                <option value="basic">Basic Action</option>
                            </select>
                        </div>
                        <div class="lg:col-span-1">
                            <label class="block text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em] mb-2">Button Title</label>
                            <input type="text" name="title" required class="w-full bg-black/40 border border-white/10 rounded-[0.25rem] p-3 text-xs focus:border-[#ccccfa]/50 outline-none" placeholder="e.g. Pay Rent">
                        </div>
                        <div class="lg:col-span-1">
                            <label class="block text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em] mb-2">Target URL</label>
                            <input type="url" name="url" required class="w-full bg-black/40 border border-white/10 rounded-[0.25rem] p-3 text-xs focus:border-[#ccccfa]/50 outline-none" placeholder="https://...">
                        </div>
                        <div class="lg:col-span-1">
                            <label class="block text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em] mb-2">Amount ($)</label>
                            <input type="number" name="amount" step="0.01" class="w-full bg-black/40 border border-white/10 rounded-[0.25rem] p-3 text-xs focus:border-[#ccccfa]/50 outline-none" placeholder="0.00">
                        </div>
                        <div class="lg:col-span-1 flex gap-3 mt-auto">
                            <button type="submit" class="flex-1 py-3 bg-[#ccccfa] text-[#030030] font-bold text-xs rounded-[0.25rem] hover:bg-white transition-all">Create</button>
                            <button type="button" onclick="window.toggleActionForm()" class="px-6 py-3 border border-white/10 rounded-[0.25rem] text-xs font-bold hover:bg-white/5">Cancel</button>
                        </div>
                    </form>
                </div>

                <div class="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
                    <!-- Left: Action Grid -->
                    <div class="lg:w-2/3 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 scrollbar-hide min-h-0">
                        ${actions.length === 0 ? `
                            <div class="col-span-full h-48 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-[0.25rem] opacity-30">
                                <iconify-icon icon="material-symbols:smart-button-outline-rounded" class="text-4xl mb-2"></iconify-icon>
                                <p class="text-xs italic tracking-wide">No actions defined yet.</p>
                            </div>
                        ` : actions.map((action, idx) => {
                            // Basic actions are identified by ID if they have no URL
                            const isSelected = action.type === 'basic' 
                                ? financeState.selectedActionId === action.id
                                : financeState.selectedActionUrl === action.url;
                                
                            return `
                            <div class="group relative aspect-square">
                                <button onclick="window.triggerAction('${action.url || ''}', ${action.id})" 
                                    class="action-btn w-full h-full p-6 flex flex-col items-start justify-start text-left rounded-[0.25rem] border border-[#ccccfa]/20 transition-all duration-300 ease-in-out ${isSelected ? 'bg-[#ccccfa] text-[#030030] shadow-[0_0_20px_rgba(204,204,250,0.2)]' : 'bg-[#ccccfa]/20 text-[#ccccfa] hover:bg-[#ccccfa]/30'}">
                                    <span class="text-[9px] font-black uppercase tracking-widest mb-3 line-clamp-2 ${isSelected ? 'opacity-80' : 'opacity-70'}">${action.title}</span>
                                    ${action.amount ? `<span class="text-3xl font-black tracking-tight">$${action.amount}</span>` : ''}
                                    <div class="action-icon-container mt-auto ${isSelected ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity duration-300">
                                         <iconify-icon icon="${action.type === 'url' ? 'material-symbols:open-in-new-rounded' : 'material-symbols:info-rounded'}" class="text-lg"></iconify-icon>
                                    </div>
                                </button>
                                <button onclick="window.deleteAction(${action.id})" class="absolute top-2 right-2 p-2 ${isSelected ? 'text-[#030030]/40' : 'text-[#ccccfa]/40'} hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all">
                                    <iconify-icon icon="material-symbols:close-rounded"></iconify-icon>
                                </button>
                            </div>
                            `;
                        }).join('')}
                    </div>

                    <!-- Right: Action Details -->
                    <div class="lg:w-1/3 flex flex-col bg-white/[0.02] border border-white/5 rounded-[0.25rem] p-6 min-h-[300px]">
                        ${(() => {
                            const selectedAction = actions.find(a => 
                                a.type === 'basic' ? a.id === financeState.selectedActionId : a.url === financeState.selectedActionUrl
                            );
                            if (!selectedAction) {
                                return `
                                    <div class="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                                        <iconify-icon icon="material-symbols:info-outline-rounded" class="text-3xl mb-3"></iconify-icon>
                                        <p class="text-xs italic">Select an action to view details</p>
                                    </div>
                                `;
                            }
                            return `
                                <div class="flex flex-col h-full animate-in fade-in duration-300">
                                    <div class="mb-8">
                                        <span class="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-2 block">Active Action</span>
                                        <h4 class="text-2xl font-black text-white leading-tight mb-2">${selectedAction.title}</h4>
                                        ${selectedAction.url ? `<p class="text-[10px] text-[#ccccfa] font-mono break-all opacity-60">${selectedAction.url}</p>` : `<p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest opacity-60">Local Logging Action</p>`}
                                    </div>

                                    <div class="flex-1 space-y-6">
                                        <div>
                                            <span class="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-2 block">Value Allocation</span>
                                            <div class="text-4xl font-black text-[#ccccfa]">$${selectedAction.amount?.toFixed(2) || '0.00'}</div>
                                        </div>

                                        <div class="pt-4 border-t border-white/5">
                                            <button onclick="window.markActionDone(${selectedAction.id})" class="w-full py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-[0.25rem] hover:bg-[#ccccfa] transition-all transform active:scale-95 flex items-center justify-center gap-3">
                                                <iconify-icon icon="material-symbols:check-circle-rounded" class="text-lg"></iconify-icon>
                                                Mark Done & Log
                                            </button>
                                            <p class="text-[10px] text-gray-500 mt-4 leading-relaxed text-center italic">
                                                This will record the transaction as a debit entry in your Money Power ledger for today.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div class="mt-auto pt-6 flex gap-2">
                                         ${selectedAction.url ? `
                                            <button onclick="window.open('${selectedAction.url}', '_blank')" class="flex-1 py-3 border border-white/10 rounded-[0.25rem] text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                                                Open URL
                                                <iconify-icon icon="material-symbols:open-in-new"></iconify-icon>
                                            </button>
                                         ` : ''}
                                    </div>
                                </div>
                            `;
                        })()}
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}