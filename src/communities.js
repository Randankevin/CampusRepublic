// Community Management Functions

let supabaseClient = null;

export function initCommunities(supabase) {
  supabaseClient = supabase;
}

export async function loadCommunities(filters = {}) {
  try {
    let query = supabaseClient
      .from('communities')
      .select('*');
    
    if (filters.university) {
      query = query.eq('university', filters.university);
    }
    
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    
    query = query.order('member_count', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Load communities error:', error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function getCommunity(communityId) {
  try {
    const { data, error } = await supabaseClient
      .from('communities')
      .select('*')
      .eq('id', communityId)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Get community error:', error);
    return { success: false, error: error.message };
  }
}

export async function createCommunity(communityData) {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const slug = communityData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const { data, error } = await supabaseClient
      .from('communities')
      .insert({
        name: communityData.name,
        slug: slug,
        description: communityData.description,
        university: communityData.university,
        category: communityData.category,
        created_by: user.id,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Auto-subscribe creator
    await subscribeToCommunity(data.id);
    
    return { success: true, data };
  } catch (error) {
    console.error('Create community error:', error);
    return { success: false, error: error.message };
  }
}

export async function subscribeToCommunity(communityId) {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    // Check if already subscribed
    const { data: existing } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('community_id', communityId)
      .single();
    
    if (existing) {
      return { success: true, action: 'already_subscribed' };
    }
    
    const { data, error } = await supabaseClient
      .from('subscriptions')
      .insert({
        user_id: user.id,
        community_id: communityId,
      })
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Subscribe to community error:', error);
    return { success: false, error: error.message };
  }
}

export async function unsubscribeFromCommunity(communityId) {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await supabaseClient
      .from('subscriptions')
      .delete()
      .eq('user_id', user.id)
      .eq('community_id', communityId);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Unsubscribe from community error:', error);
    return { success: false, error: error.message };
  }
}

export async function getUserSubscriptions() {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return { success: true, data: [] };
    
    const { data, error } = await supabaseClient
      .from('subscriptions')
      .select(`
        *,
        community:communities(*)
      `)
      .eq('user_id', user.id);
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Get user subscriptions error:', error);
    return { success: false, error: error.message, data: [] };
  }
}

