// Publication Management Functions (Substack-like)

let supabaseClient = null;

export function initPublications(supabase) {
  supabaseClient = supabase;
}

export async function loadPublications(filters = {}) {
  try {
    let query = supabaseClient
      .from('publications')
      .select(`
        *,
        owner:profiles!publications_owner_id_fkey(id, username, display_name, avatar_url)
      `);
    
    if (filters.owner_id) {
      query = query.eq('owner_id', filters.owner_id);
    }
    
    if (filters.is_public !== undefined) {
      query = query.eq('is_public', filters.is_public);
    }
    
    query = query.order('subscriber_count', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Load publications error:', error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function getPublication(publicationId) {
  try {
    const { data, error } = await supabaseClient
      .from('publications')
      .select(`
        *,
        owner:profiles!publications_owner_id_fkey(id, username, display_name, avatar_url, bio)
      `)
      .eq('id', publicationId)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Get publication error:', error);
    return { success: false, error: error.message };
  }
}

export async function createPublication(publicationData) {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const slug = publicationData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const { data, error } = await supabaseClient
      .from('publications')
      .insert({
        name: publicationData.name,
        slug: slug,
        description: publicationData.description,
        owner_id: user.id,
        is_public: publicationData.is_public !== false,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Auto-subscribe creator
    await subscribeToPublication(data.id);
    
    return { success: true, data };
  } catch (error) {
    console.error('Create publication error:', error);
    return { success: false, error: error.message };
  }
}

export async function updatePublication(publicationId, updates) {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabaseClient
      .from('publications')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', publicationId)
      .eq('owner_id', user.id) // Ensure user owns the publication
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Update publication error:', error);
    return { success: false, error: error.message };
  }
}

export async function subscribeToPublication(publicationId) {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    // Check if already subscribed
    const { data: existing } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('publication_id', publicationId)
      .single();
    
    if (existing) {
      return { success: true, action: 'already_subscribed' };
    }
    
    const { data, error } = await supabaseClient
      .from('subscriptions')
      .insert({
        user_id: user.id,
        publication_id: publicationId,
      })
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Subscribe to publication error:', error);
    return { success: false, error: error.message };
  }
}

export async function unsubscribeFromPublication(publicationId) {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await supabaseClient
      .from('subscriptions')
      .delete()
      .eq('user_id', user.id)
      .eq('publication_id', publicationId);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Unsubscribe from publication error:', error);
    return { success: false, error: error.message };
  }
}

