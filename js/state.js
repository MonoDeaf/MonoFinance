import { supabase, TABLE_NAME } from './modules/supabaseClient.js';

const STORAGE_KEY = 'mono_finance_data_v1';

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
            const loadedState = { ...defaultState, ...parsed };
            // Always start on 'all' tab and ensure sidebar is open when page loads/refreshes
            loadedState.activeTab = 'all';
            loadedState.sidebarOpen = true;
            return loadedState;
        } catch (e) {
            console.error('Failed to parse state', e);
            return defaultState;
        }
    }
    return defaultState;
}

export let financeState = loadState();

let isRemoteUpdate = false;
let syncTimeout = null;
let updateCallback = null;
let currentUserId = null;
let realtimeChannel = null;

export function saveState() {
    // Always save to local storage for offline capability
    localStorage.setItem(STORAGE_KEY, JSON.stringify(financeState));
    
    // Debounced sync to Supabase (only if logged in)
    if (!isRemoteUpdate && currentUserId) {
        if (syncTimeout) clearTimeout(syncTimeout);
        syncTimeout = setTimeout(() => {
            pushStateToSupabase();
        }, 1000); // 1 second debounce
    }
}

async function pushStateToSupabase() {
    if (!currentUserId) return;

    try {
        const { error } = await supabase
            .from(TABLE_NAME)
            .upsert({ 
                user_id: currentUserId, 
                data: financeState, 
                updated_at: new Date().toISOString() 
            });
            
        if (error) console.error('Supabase Sync Error:', error);
        else console.log('State synced to cloud');
    } catch (e) {
        console.error('Sync failed', e);
    }
}

export async function initSupabaseSync(userId, callback) {
    if (!userId) return;
    if (currentUserId === userId) return; // Already syncing this user

    currentUserId = userId;
    updateCallback = callback;
    
    // Clean up previous subscription if exists
    if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
        realtimeChannel = null;
    }

    // 1. Initial Fetch
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('user_id', currentUserId)
            .single();

        if (data && data.data) {
            isRemoteUpdate = true;
            // Merge cloud data
            Object.assign(financeState, data.data);
            saveState(); 
            isRemoteUpdate = false;
            if (updateCallback) updateCallback();
        } else {
            // Row doesn't exist for this user, create it with current local state
            // (or empty state if we wanted to enforce fresh start)
            pushStateToSupabase();
        }
    } catch (e) {
        console.warn('Could not fetch initial state from Supabase.', e);
    }

    // 2. Realtime Subscription
    realtimeChannel = supabase
        .channel(`public:${TABLE_NAME}:${currentUserId}`)
        .on('postgres_changes', { 
            event: 'UPDATE', 
            schema: 'public', 
            table: TABLE_NAME, 
            filter: `user_id=eq.${currentUserId}` 
        }, payload => {
            if (payload.new && payload.new.data) {
                console.log('Received real-time update');
                isRemoteUpdate = true;
                Object.assign(financeState, payload.new.data);
                
                // Update local storage without triggering push
                localStorage.setItem(STORAGE_KEY, JSON.stringify(financeState));
                
                if (updateCallback) updateCallback();
                isRemoteUpdate = false;
            }
        })
        .subscribe();
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