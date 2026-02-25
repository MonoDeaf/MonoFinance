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
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: 'https://monodeaf.github.io/MonoFinance/'
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