import { supabase, TABLE_NAME } from './modules/supabaseClient.js';

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
    // Return default state; data will be hydrated from Supabase upon login
    return { ...defaultState };
}

export let financeState = loadState();

let isRemoteUpdate = false;
let syncTimeout = null;
let updateCallback = null;
let currentUserId = null;
let realtimeChannel = null;

// Track sync status for UI feedback
export const syncStatus = {
    state: 'synced', // 'synced', 'syncing', 'error'
    lastSynced: null
};

export function saveState() {
    // Debounced sync to Supabase (only if logged in)
    if (!isRemoteUpdate && currentUserId) {
        setSyncStatus('syncing');
        if (syncTimeout) clearTimeout(syncTimeout);
        syncTimeout = setTimeout(() => {
            pushStateToSupabase();
        }, 500); // Reduced to 500ms for snappier feel
    }
    
    // Auto-evaluate milestones whenever state changes
    evaluateMilestones();
}

function setSyncStatus(status) {
    syncStatus.state = status;
    const indicator = document.getElementById('sync-indicator');
    const indicatorText = document.getElementById('sync-text');
    
    if (indicator && indicatorText) {
        if (status === 'syncing') {
            indicator.className = 'w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse ml-1';
            indicatorText.innerText = 'Syncing...';
        } else if (status === 'synced') {
            indicator.className = 'w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1';
            indicatorText.innerText = 'Live Sync Active';
        } else if (status === 'error') {
            indicator.className = 'w-1.5 h-1.5 rounded-full bg-red-500 ml-1';
            indicatorText.innerText = 'Sync Error';
        }
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
            
        if (error) {
            console.error('Supabase Sync Error:', error);
            setSyncStatus('error');
        } else {
            setSyncStatus('synced');
            syncStatus.lastSynced = new Date();
        }
    } catch (e) {
        console.error('Sync failed', e);
        setSyncStatus('error');
    }
}

function evaluateMilestones() {
    // Calculate total assets for milestone checking
    const assetsTotal = financeState.entries.reduce((sum, e) => {
        if (['savings', 'stocks', 'crypto', 'emergency'].includes(e.type)) return sum + e.amount;
        return sum;
    }, 0);

    const liabilitiesTotal = financeState.entries.reduce((sum, e) => {
        if (['debit', 'credit'].includes(e.type)) return sum + e.amount;
        return sum;
    }, 0);

    const netWorth = assetsTotal - liabilitiesTotal;

    financeState.milestones.forEach(m => {
        if (m.id === 1 && assetsTotal >= m.target) m.completed = true;
        if (m.id === 2 && liabilitiesTotal === 0 && financeState.entries.some(e => e.type === 'credit')) m.completed = true;
        if (m.id === 3 && netWorth >= m.target) m.completed = true;
        if (m.id === 4 && netWorth >= m.target) m.completed = true;
    });
}

export async function initSupabaseSync(userId, callback) {
    if (!userId) return;
    // Important: currentUserId check ensures we don't duplicate listeners
    if (currentUserId === userId) {
        if (callback) callback();
        return;
    }

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
            // Deep merge cloud data into local state to preserve structure
            Object.assign(financeState, data.data);
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