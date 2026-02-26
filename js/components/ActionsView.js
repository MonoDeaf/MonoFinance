import { financeState } from '../state.js';

export function ActionsView() {
    const actions = financeState.actions || [];
    const selectedUrl = financeState.selectedActionUrl;

    return `
    <div class="flex flex-col gap-8 mb-12">
        <div class="w-full flex flex-col gap-6">
            <div class="card p-4 sm:p-8 flex flex-col h-auto min-h-[500px]">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h3 class="text-xl font-bold text-[var(--text-main)]">Quick Actions</h3>
                        <p class="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Launch Tools & Manage Costs</p>
                    </div>
                    <button onclick="window.toggleActionForm()" class="btn-primary px-4 py-2 rounded-[0.25rem] text-xs font-bold transition-all flex items-center gap-2">
                        <iconify-icon icon="material-symbols:add"></iconify-icon>
                        New Action
                    </button>
                </div>

                <!-- Add Action Form (Hidden by default) -->
                <div id="action-form-container" class="hidden mb-8 p-6 bg-[var(--bg-input)] border border-dashed border-[var(--border-main)] rounded-[0.25rem]">
                    <form onsubmit="window.addNewAction(event)" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em] mb-2">Action Type</label>
                                <select name="type" onchange="this.form.url.required = (this.value === 'url'); this.form.url.parentElement.classList.toggle('hidden', this.value !== 'url')" class="w-full input-base rounded-[0.25rem] p-3 text-xs focus:border-[var(--accent-primary)]/50 outline-none appearance-none cursor-pointer">
                                    <option value="url">Visit URL</option>
                                    <option value="basic">Basic Action</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em] mb-2">Button Title</label>
                                <input type="text" name="title" required class="w-full input-base rounded-[0.25rem] p-3 text-xs focus:border-[var(--accent-primary)]/50 outline-none" placeholder="e.g. Pay Rent">
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div>
                                <label class="block text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em] mb-2">Target URL</label>
                                <input type="url" name="url" required class="w-full input-base rounded-[0.25rem] p-3 text-xs focus:border-[var(--accent-primary)]/50 outline-none" placeholder="https://...">
                            </div>
                            <div>
                                <label class="block text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em] mb-2">Impact on Wealth</label>
                                <select name="impact" class="w-full input-base rounded-[0.25rem] p-3 text-xs focus:border-[var(--accent-primary)]/50 outline-none appearance-none cursor-pointer">
                                    <option value="deduction">Deduction (Expense)</option>
                                    <option value="addition">Addition (Gain)</option>
                                </select>
                            </div>
                        </div>

                        <div class="space-y-4">
                             <div>
                                <label class="block text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em] mb-2">Amount Setting</label>
                                <select name="amountType" onchange="const amt = this.form.amount; amt.parentElement.classList.toggle('hidden', this.value === 'variable'); amt.required = (this.value === 'fixed')" class="w-full input-base rounded-[0.25rem] p-3 text-xs focus:border-[var(--accent-primary)]/50 outline-none appearance-none cursor-pointer">
                                    <option value="fixed">Fixed Amount</option>
                                    <option value="variable">Variable (Log on click)</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em] mb-2">Amount ($)</label>
                                <input type="number" name="amount" step="0.01" class="w-full input-base rounded-[0.25rem] p-3 text-xs focus:border-[var(--accent-primary)]/50 outline-none" placeholder="0.00">
                            </div>
                        </div>

                        <div class="flex flex-col gap-3 justify-end">
                            <button type="submit" class="w-full py-4 bg-[var(--accent-primary)] text-[var(--btn-text)] font-bold text-xs rounded-[0.25rem] hover:opacity-90 transition-all">Create Action</button>
                            <button type="button" onclick="window.toggleActionForm()" class="w-full py-2 border border-[var(--border-main)] rounded-[0.25rem] text-[10px] uppercase font-bold tracking-widest hover:bg-[var(--bg-hover)]">Cancel</button>
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
                                    class="action-btn w-full h-full p-6 flex flex-col items-start justify-start text-left rounded-[0.25rem] border border-[var(--accent-primary)]/20 transition-all duration-300 ease-in-out ${isSelected ? 'bg-[var(--accent-primary)] text-[var(--btn-text)] shadow-[0_0_20px_rgba(204,204,250,0.2)]' : 'bg-[#ccccfa]/10 text-[var(--accent-primary)] hover:bg-[#ccccfa]/20'}">
                                    <span class="text-[9px] font-black uppercase tracking-widest mb-3 line-clamp-2 ${isSelected ? 'opacity-90' : 'opacity-70'}">${action.title}</span>
                                    ${action.amountType === 'variable' ? 
                                        `<span class="text-3xl font-black tracking-tight uppercase">Enter $</span>` : 
                                        (action.amount ? `<span class="text-3xl font-black tracking-tight">${action.impact === 'addition' ? '+' : ''}$${action.amount}</span>` : '')
                                    }
                                    <div class="action-icon-container mt-auto ${isSelected ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity duration-300">
                                         <iconify-icon icon="${action.type === 'url' ? 'material-symbols:open-in-new-rounded' : 'material-symbols:info-rounded'}" class="text-lg"></iconify-icon>
                                    </div>
                                </button>
                                <button onclick="window.deleteAction(${action.id})" class="absolute top-2 right-2 p-2 ${isSelected ? 'text-white/40' : 'text-[var(--accent-primary)]/40'} hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all">
                                    <iconify-icon icon="material-symbols:close-rounded"></iconify-icon>
                                </button>
                            </div>
                            `;
                        }).join('')}
                    </div>

                    <!-- Right: Action Details -->
                    <div class="lg:w-1/3 flex flex-col bg-[var(--bg-input)] border border-[var(--border-main)] rounded-[0.25rem] p-6 min-h-[300px]">
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
                                <div class="flex flex-col h-full">
                                    <div class="mb-8">
                                        <span class="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-2 block">Active Action</span>
                                        <h4 class="text-2xl font-black text-[var(--text-main)] leading-tight mb-2">${selectedAction.title}</h4>
                                        ${selectedAction.url ? `<p class="text-[10px] text-[var(--accent-primary)] font-mono break-all opacity-80">${selectedAction.url}</p>` : `<p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest opacity-60">Local Logging Action</p>`}
                                    </div>

                                    <div class="flex-1 space-y-6">
                                        <div>
                                            <span class="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-2 block">Value Allocation</span>
                                            ${selectedAction.amountType === 'variable' ? `
                                                <div class="relative">
                                                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
                                                    <input type="number" id="variable-amount-input" step="0.01" class="w-full bg-[var(--bg-main)] border border-[var(--border-main)] rounded-[0.25rem] py-4 pl-10 pr-4 text-2xl font-black text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-primary)]/50" placeholder="0.00">
                                                </div>
                                            ` : `
                                                <div class="text-4xl font-black text-[var(--accent-primary)]">
                                                    ${selectedAction.impact === 'addition' ? '+' : '-'}$${selectedAction.amount?.toFixed(2) || '0.00'}
                                                </div>
                                            `}
                                        </div>

                                        <div class="pt-4 border-t border-[var(--border-main)]">
                                            <button onclick="window.markActionDone(${selectedAction.id})" class="w-full py-4 btn-primary text-xs font-black uppercase tracking-widest rounded-[0.25rem] transition-all transform active:scale-95 flex items-center justify-center gap-3">
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