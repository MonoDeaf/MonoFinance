const STORAGE_KEY = 'lunor_finance_data_v1';

const defaultState = {
    activeTab: 'all',
    sidebarOpen: window.innerWidth > 1024,
    entries: [],
    subscriptions: [],
    customCharts: [],
    actions: [],
    selectedActionUrl: null,
    selectedActionId: null,
    streak: 0,
    lastUpdateDate: null, // YYYY-MM-DD
    dailyUpdateViewActive: false,
    widgetBgType: 'image', // 'none', 'image', 'custom'
    customBgData: null,
    milestones: [
        { id: 1, label: 'Emergency Fund Starter', target: 1000, completed: false },
        { id: 2, label: 'Debt Free (Credit)', target: 0, completed: false },
        { id: 3, label: 'Halfway to Power Goal', target: 25000, completed: false },
        { id: 4, label: 'Financial Fortress', target: 100000, completed: false }
    ]
};

function loadState() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            // Ensure sidebar default respects current viewport if not explicitly set, 
            // though here we prioritize stored preference or default structure
            const loadedState = { ...defaultState, ...parsed };
            // Always start on 'all' tab when page loads/refreshes
            loadedState.activeTab = 'all';
            return loadedState;
        } catch (e) {
            console.error('Failed to parse state', e);
            return defaultState;
        }
    }
    return defaultState;
}

export let financeState = loadState();

export function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(financeState));
}

export const CATEGORY_MAP = {
    savings: 'savings',
    emergency: 'emergency',
    stocks: 'investment',
    crypto: 'investment',
    debit: 'expenses',
    credit: 'expenses',
    subscription: 'subscriptions'
};

export const COLOR_MAP = {
    savings: '#ccccfa',
    investment: '#8a8ab0',
    emergency: '#ff4a00',
    expenses: '#6ed4f2',
    subscriptions: '#e91e63'
};

export const SERVICE_ICONS = {
    'Netflix': 'logos:netflix-icon',
    'Spotify': 'logos:spotify-icon',
    'ChatGPT': 'simple-icons:openai',
    'Apple': 'simple-icons:apple',
    'Amazon': 'simple-icons:amazon',
    'X': 'simple-icons:x',
    'Xbox': 'simple-icons:xbox',
    'Car': 'material-symbols:directions-car',
    'Facebook': 'logos:facebook',
    'Housing': 'material-symbols:home-rounded',
    'Discord': 'logos:discord-icon',
    'Snapchat': 'logos:snapchat',
    'Food': 'material-symbols:restaurant-rounded',
    'Adobe': 'logos:adobe-creative-cloud',
    'Custom': 'material-symbols:monetization-on-rounded'
};