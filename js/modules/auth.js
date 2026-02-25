import { supabase } from './supabaseClient.js';

export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
}

export async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    return { data, error };
}

export async function signInWithGoogle() {
    // Detect if we are in an iframe or on a specific domain
    const redirectUrl = window.location.origin + window.location.pathname;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectUrl
        }
    });
    return { data, error };
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
}

export async function getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
}

export function initAuthListeners(onAuthStateChange) {
    supabase.auth.onAuthStateChange((event, session) => {
        onAuthStateChange(session);
    });
}