let deferredPrompt = null;

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
    ActionsView,
    AuthView
} from './components.js';

import { signIn, signUp, signInWithGoogle, signOut, getSession, initAuthListeners } from './modules/auth.js';
import { financeState, initSupabaseSync } from './state.js';
import { updateChart } from './modules/chart.js';
import { initCalendar, renderCalendarGrid } from './modules/calendar.js';
import { initFinance, updateLedgerUI, getFinancialSnapshot, updateAssetsFullList } from './modules/finance.js';
import { renderCustomCharts } from './modules/customCharts.js';
import { initSidebarLogic } from './modules/sidebar.js';
import { updateStreakUI } from './modules/streak.js';
import { initActionHandlers } from './modules/actions.js';
import { initWidgetBgControls } from './modules/background.js';

let isInitialized = false;
let currentUser = null;
let isLoginMode = true;

// Auth Handlers
window.toggleAuthMode = () => {
    isLoginMode = !isLoginMode;
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    const btn = document.getElementById('auth-submit-btn');
    const toggle = document.getElementById('auth-toggle-btn');
    const form = document.getElementById('auth-form');
    
    // Add simple animation classes
    form.classList.add('opacity-50', 'scale-[0.98]');
    setTimeout(() => form.classList.remove('opacity-50', 'scale-[0.98]'), 200);

    if (isLoginMode) {
        title.innerText = 'Login';
        subtitle.innerText = 'Enter your credentials to access the vault.';
        btn.innerText = 'SIGN IN';
        toggle.innerText = 'Create an account';
    } else {
        title.innerText = 'Sign Up';
        subtitle.innerText = 'Create a new financial identity.';
        btn.innerText = 'SIGN UP';
        toggle.innerText = 'I have an account';
    }
};

window.handleAuth = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const errorEl = document.getElementById('auth-error');
    const btn = document.getElementById('auth-submit-btn');
    
    errorEl.style.opacity = '0';
    const originalBtnText = btn.innerText;
    btn.innerHTML = '<iconify-icon icon="line-md:loading-loop" class="text-xl"></iconify-icon>';
    btn.disabled = true;
    
    let result;
    if (isLoginMode) {
        result = await signIn(email, password);
    } else {
        result = await signUp(email, password);
    }
    
    if (result.error) {
        errorEl.innerText = result.error.message;
        errorEl.style.opacity = '1';
        btn.innerText = originalBtnText;
        btn.disabled = false;
    } else {
        // Auth state change listener will handle the transition
        // But for signup without auto-confirm, we might need a message
        if (!isLoginMode && result.data.user && !result.data.session) {
             errorEl.classList.remove('text-red-400');
             errorEl.classList.add('text-[#ccccfa]');
             errorEl.innerText = "Check email for confirmation link.";
             errorEl.style.opacity = '1';
             btn.innerText = originalBtnText;
             btn.disabled = false;
        }
    }
};

window.handleGoogleAuth = async () => {
    const errorEl = document.getElementById('auth-error');
    errorEl.style.opacity = '0';
    
    const result = await signInWithGoogle();
    if (result.error) {
        errorEl.innerText = result.error.message;
        errorEl.style.opacity = '1';
    }
};

window.performLogout = async () => {
    await signOut();
};

function renderApp() {
    const root = document.getElementById('dashboard-root');
    if (!root) return;

    if (!currentUser) {
        root.innerHTML = AuthView();
        // Reset state for when they log back in
        isLoginMode = true; 
    } else {
        renderDashboard(root);
    }
}

function renderDashboard(root) {
    if (!root) root = document.getElementById('dashboard-root');

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
        <div class="layout-container animate-in fade-in duration-500">
            ${Sidebar()}
            <main class="main-content">
                <div class="dashboard-container relative">
                    ${Header(currentUser.email)}
                    ${TitleSection('Financial Overview', "Manage your wealth and track your money power.", financeState.activeTab)}
                    
                    <div class="flex flex-col gap-6">
                        ${mainContent}
                    </div>
                </div>
            </main>
        </div>
    `;

    root.innerHTML = html;
    
    // Check if we already have the deferred prompt to show the button
    if (deferredPrompt) {
        const installBtn = document.getElementById('pwa-install-container');
        if (installBtn) installBtn.classList.remove('hidden');
    }

    // Re-initialize element-specific listeners after each render
    initTabHandlers();
    initSidebarLogic();
    initUserMenuLogic();

    // PWA Install Click Handler
    const installBtnAction = document.getElementById('install-pwa-btn');
    if (installBtnAction) {
        installBtnAction.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                deferredPrompt = null;
                const container = document.getElementById('pwa-install-container');
                if (container) container.classList.add('hidden');
            }
        });
    }
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
    
    // Initialize Supabase Sync with User ID
    if (currentUser && currentUser.id) {
        initSupabaseSync(currentUser.id, renderDashboard);
    }

    // Only initialize global listeners and one-time setups once
    if (!isInitialized) {
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

function initUserMenuLogic() {
    const trigger = document.getElementById('user-menu-trigger');
    const dropdown = document.getElementById('user-dropdown');
    
    if (trigger && dropdown) {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = dropdown.classList.contains('hidden');
            
            // Close other dropdowns if any, then toggle this one
            dropdown.classList.toggle('hidden');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.classList.contains('hidden') && !dropdown.contains(e.target) && e.target !== trigger) {
                dropdown.classList.add('hidden');
            }
        });
    }
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

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check for active session
    const session = await getSession();
    currentUser = session ? session.user : null;
    
    // 2. Setup listeners
    initAuthListeners((session) => {
        const prevUser = currentUser;
        currentUser = session ? session.user : null;
        
        // Only re-render if user state actually changed to prevent loops
        if (!!prevUser !== !!currentUser) {
            renderApp();
        }
    });

    renderApp();
});

// Global PWA event listener to catch the install request
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('pwa-install-container');
    if (installBtn) installBtn.classList.remove('hidden');
});