export const FinancialInputCard = () => `
    <div class="card h-full p-8 flex flex-col">
        <div class="mb-8">
            <h3 class="text-xl font-bold mb-1">Add Financial Entry</h3>
            <p class="text-gray-500 text-xs">Choose a category and amount to update your power.</p>
        </div>

        <form id="financial-form" class="flex-1 space-y-6">
            <!-- Category Selector -->
            <div>
                <label class="block text-[10px] text-gray-500 uppercase tracking-widest mb-2">Category</label>
                <select id="input-category" class="w-full bg-[#1a1a1a] border border-white/5 rounded-md py-3 px-3 text-sm focus:outline-none focus:border-[#ccccfa]/50 transition-colors appearance-none cursor-pointer">
                    <option value="savings">Savings Account</option>
                    <option value="stocks">Stock Market Portfolio</option>
                    <option value="crypto">Cryptocurrency Assets</option>
                    <option value="emergency">Emergency Fund</option>
                    <option value="debit">Daily Debit Spending</option>
                    <option value="credit">Credit Card Liability</option>
                </select>
            </div>

            <!-- Custom Label -->
            <div>
                <label class="block text-[10px] text-gray-500 uppercase tracking-widest mb-2">Label (Optional)</label>
                <input type="text" id="input-label" class="w-full bg-[#1a1a1a] border border-white/5 rounded-md py-3 px-4 text-sm focus:outline-none focus:border-[#ccccfa]/50 transition-colors" placeholder="e.g. BTC Wallet, Chase Checking...">
            </div>

            <!-- Amount -->
            <div>
                <label class="block text-[10px] text-gray-500 uppercase tracking-widest mb-2">Amount</label>
                <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input type="number" id="input-amount" required class="w-full bg-[#1a1a1a] border border-white/5 rounded-md py-3 pl-8 pr-4 text-sm focus:outline-none focus:border-[#ccccfa]/50 transition-colors" placeholder="0.00">
                </div>
            </div>

            <div class="pt-4">
                <button type="submit" class="w-full py-4 bg-white text-black text-sm font-bold rounded-md hover:bg-[#ccccfa] transition-all transform active:scale-95">Add to Money Power</button>
            </div>
        </form>

        <div class="mt-8 pt-6 border-t border-white/5">
            <div class="flex justify-between items-center">
                <span class="text-xs text-gray-400">Projected Net Worth</span>
                <span id="display-net-worth" class="text-xl font-bold text-[#ccccfa]">$0.00</span>
            </div>
        </div>
    </div>
`;