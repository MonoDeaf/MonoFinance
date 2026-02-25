export function ChartsView() {
    return `
    <div class="flex flex-col gap-8 mb-12">
        <!-- Create New Chart Form -->
        <div class="card p-4 sm:p-8 border-dashed border-white/10">
            <div class="mb-8">
                <h3 class="text-xl font-bold">Create New Tracking Chart</h3>
                <p class="text-gray-500 text-xs">Analyze specific cost changes like rent, utilities, or personal projects.</p>
            </div>
            <form onsubmit="window.createNewChart(event)" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label class="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Chart Title</label>
                    <input type="text" name="title" required class="w-full input-base rounded-lg p-3.5 text-xs focus:outline-none focus:border-[var(--accent-primary)]/50" placeholder="e.g. Monthly Rent">
                </div>
                <div>
                    <label class="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Short Description</label>
                    <input type="text" name="description" required class="w-full input-base rounded-lg p-3.5 text-xs focus:outline-none focus:border-[var(--accent-primary)]/50" placeholder="Tracking increase over time">
                </div>
                <div class="flex items-end">
                    <button type="submit" class="w-full py-4 btn-primary text-xs font-bold rounded-lg transition-all">Create Chart</button>
                </div>
            </form>
        </div>

        <!-- List of existing charts -->
        <div id="charts-view-container"></div>
    </div>
    `;
}