import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Load user data from Supabase
 * @param {string} userId - The user's UUID from auth
 * @returns {Promise<Object|null>} User data or null if not found
 */
export async function loadUserData(userId) {
    if (!isSupabaseConfigured || !supabase) {
        console.warn('Supabase not configured, cannot load from cloud');
        return null;
    }

    try {
        const { data, error } = await supabase
            .from('user_data')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            // PGRST116 means no rows found, which is normal for new users
            if (error.code === 'PGRST116') {
                console.log('No cloud data found for user, will create on first save');
                return null;
            }
            throw error;
        }

        console.log('✅ Loaded data from cloud:', data ? 'found' : 'not found');
        return data;
    } catch (error) {
        console.error('Failed to load user data from cloud:', error);
        return null;
    }
}

/**
 * Save user data to Supabase (upsert)
 * @param {string} userId - The user's UUID from auth
 * @param {Object} data - The data to save
 * @returns {Promise<boolean>} Success status
 */
export async function saveUserData(userId, data) {
    if (!isSupabaseConfigured || !supabase) {
        console.warn('Supabase not configured, cannot save to cloud');
        return false;
    }

    try {
        const { error } = await supabase
            .from('user_data')
            .upsert({
                user_id: userId,
                wallets: data.wallets || [],
                assets: data.assets || [],
                transactions: data.transactions || [],
                budgets: data.budgets || [],
                goals: data.goals || [],
                subscriptions: data.subscriptions || [],
                settings: data.settings || {},
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id'
            });

        if (error) throw error;

        console.log('✅ Data saved to cloud successfully');
        return true;
    } catch (error) {
        console.error('Failed to save user data to cloud:', error);
        return false;
    }
}

/**
 * Delete user data from Supabase
 * @param {string} userId - The user's UUID from auth
 * @returns {Promise<boolean>} Success status
 */
export async function deleteUserData(userId) {
    if (!isSupabaseConfigured || !supabase) {
        return false;
    }

    try {
        const { error } = await supabase
            .from('user_data')
            .delete()
            .eq('user_id', userId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Failed to delete user data from cloud:', error);
        return false;
    }
}
