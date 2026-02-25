export function AssetsView() {
    return `
    <div class="card p-4 sm:p-8 flex flex-col">
        <div class="flex justify-between items-center mb-8">
            <div>
                <h3 class="text-xl font-bold text-[var(--text-main)]">Assets Repository</h3>
                <p class="text-gray-500 text-xs">Detailed view of all registered financial instruments and funds.</p>
            </div>
            <button onclick="document.querySelector('[data-tab=all]').click()" class="text-[10px] font-bold uppercase tracking-widest text-[#ccccfa] hover:underline">Back to Dashboard</button>
        </div>
        <div id="assets-full-list" class="flex flex-col gap-3">
            <!-- Dynamically populated by updateDashboard -->
        </div>
    </div>
    `;
}