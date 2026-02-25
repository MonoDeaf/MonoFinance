export const TitleSection = (title = "Financial Overview", subtitle = "Let's see the current statistic performance.", activeTab = 'all') => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const getPillClass = (tab) => tab === activeTab ? 'pill pill-active' : 'pill pill-inactive';

    return `
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 px-1 md:px-0">
        <div>
            <h1 class="text-2xl md:text-3xl font-semibold mb-1">${title}</h1>
            <p class="text-gray-500 text-xs md:text-sm">${subtitle}</p>
        </div>
        <div class="flex flex-col sm:flex-row items-stretch gap-3 w-full md:w-auto">
            <div class="flex items-center gap-1 bg-[var(--bg-card)] rounded-full p-1 border border-[var(--border-main)] w-full sm:w-auto justify-center">
                <div data-tab="all" class="${getPillClass('all')} flex-1 sm:flex-none text-center cursor-pointer">All</div>
                <div data-tab="assets" class="${getPillClass('assets')} px-4 flex-1 sm:flex-none text-center cursor-pointer">Assets</div>
                <div data-tab="actions" class="${getPillClass('actions')} px-4 flex-1 sm:flex-none text-center cursor-pointer">Actions</div>
                <div data-tab="charts" class="${getPillClass('charts')} px-4 flex-1 sm:flex-none text-center cursor-pointer">Charts</div>
                <div data-tab="wealth" class="${getPillClass('wealth')} px-4 flex-1 sm:flex-none text-center cursor-pointer">Wealth</div>
            </div>
            <div class="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-full px-6 py-3 flex items-center text-xs font-medium justify-center whitespace-nowrap">
                ${formattedDate}
            </div>
        </div>
    </div>
    `;
};