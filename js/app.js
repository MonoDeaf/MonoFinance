import { 
    Sidebar,
    Header, 
    TitleSection, 
    MoneyPowerCard,
    FinancialInputCard,
    CalendarCard,
    AssetsView,
    ChartsView,
    WealthView,
    ActionsView
} from './components.js';

import { financeState } from './state.js';
import { updateChart } from './modules/chart.js';
import { initCalendar, renderCalendarGrid } from './modules/calendar.js';
import { initFinance, updateLedgerUI, getFinancialSnapshot, updateAssetsFullList } from './modules/finance.js';
import { renderCustomCharts } from './modules/customCharts.js';
import { initSidebarLogic } from './modules/sidebar.js';
import { updateStreakUI } from './modules/streak.js';
import { initActionHandlers } from './modules/actions.js';
import { initWidgetBgControls } from './modules/background.js';

let isInitialized = false;

function renderDashboard() {
    const root = document.getElementById('dashboard-root');
    if (!root) return;

    const { totals, totalWorth, currencyFormatter } = getFinancialSnapshot();

    let mainContent;

    if (financeState.activeTab === 'all') {
        mainContent = `
            <!-- Top Row: Money Power & Input -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                <div class="lg:col-span-2">
                    ${MoneyPowerCard()}
                </div>
                <div class="lg:col-span-1">
                    ${FinancialInputCard()}
                </div>
            </div>

            <!-- Bottom Row: Calendar & Side Panel -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-12">
                <div class="lg:col-span-2">
                    ${CalendarCard()}
                </div>
                <div id="calendar-side-panel" class="lg:col-span-1 min-h-[400px] lg:min-h-[500px]">
                    <div class="card h-full flex flex-col items-center justify-center text-center p-8 border-dashed border-white/10 opacity-40">
                        <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                        </div>
                        <p class="text-xs text-gray-500 leading-relaxed max-w-[180px]">Select a day on the calendar to manage subscriptions</p>
                    </div>
                </div>
            </div>
        `;
    } else if (financeState.activeTab === 'assets') {
        mainContent = `
            <div class="mb-12">
                ${AssetsView()}
            </div>
        `;
    } else if (financeState.activeTab === 'charts') {
        mainContent = `
            <div class="mb-12">
                ${ChartsView()}
            </div>
        `;
    } else if (financeState.activeTab === 'actions') {
        mainContent = `
            <div class="mb-12">
                ${ActionsView()}
            </div>
        `;
    } else {
        mainContent = `
            <div class="mb-12">
                ${WealthView(totals, totalWorth, currencyFormatter)}
            </div>
        `;
    }

    const html = `
        <div class="layout-container">
            ${Sidebar()}
            <main class="main-content">
                <div class="dashboard-container relative">
                    ${Header()}
                    ${TitleSection('Financial Overview', "Manage your wealth and track your money power.", financeState.activeTab)}
                    
                    <div class="flex flex-col gap-6">
                        ${mainContent}
                    </div>
                </div>
            </main>
        </div>
    `;

    root.innerHTML = html;
    
    // Re-initialize element-specific listeners after each render
    initTabHandlers();
    initSidebarLogic();
    initWidgetBgControls(renderDashboard);
    initActionHandlers(renderDashboard);
    updateStreakUI(updateDashboard);
    
    // Initialize/update calendar if on 'all' tab
    if (financeState.activeTab === 'all') {
        if (!isInitialized) {
            initCalendar(updateDashboard);
        } else {
            renderCalendarGrid(updateDashboard);
        }
    }
    
    // Only initialize global listeners and one-time setups once
    if (!isInitialized) {
        // removed function initGlobalListeners() {}
        initFinance(updateDashboard);
        isInitialized = true;
    }
    
    updateDashboard();
}

function initTabHandlers() {
    const tabs = document.querySelectorAll('[data-tab]');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            if (financeState.activeTab !== target) {
                financeState.activeTab = target;
                renderDashboard();
            }
        });
    });
}

// removed function initSidebarToggleButton() {}
// removed function initGlobalListeners() {}
// removed function updateStreakUI() {}
// removed function initActionHandlers() {}
// removed function initWidgetBgControls() {}

export function updateDashboard() {
    const { totals, totalWorth, currencyFormatter } = getFinancialSnapshot();

    Object.keys(totals).forEach(key => {
        const el = document.getElementById(`stat-${key}`);
        if (el) el.innerText = currencyFormatter.format(totals[key]);
    });

    const netWorthEl = document.getElementById('display-net-worth');
    if (netWorthEl) netWorthEl.innerText = currencyFormatter.format(totalWorth);

    if (financeState.activeTab === 'all') {
        updateLedgerUI(currencyFormatter);
        updateChart(totals);
    } else if (financeState.activeTab === 'assets') {
        updateAssetsFullList(currencyFormatter);
    } else if (financeState.activeTab === 'charts') {
        renderCustomCharts(updateDashboard);
    }
}

document.addEventListener('DOMContentLoaded', renderDashboard);