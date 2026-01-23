// Post Management Functions

let supabaseClient = null;

export function initPosts(supabase) {
  supabaseClient = supabase;
}

export async function loadPosts(filters = {}) {
  try {
    let query = supabaseClient
      .from('posts')
      .select(`
        *,
        author:profiles!posts_author_id_fkey(id, username, display_name, avatar_url, karma),
        community:communities(id, name, slug, icon_url),
        publication:publications(id, name, slug, icon_url)
      `)
      .eq('is_published', true);
    
    // Apply filters
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    
    if (filters.university) {
      query = query.eq('university', filters.university);
    }
    
    if (filters.community_id) {
      query = query.eq('community_id', filters.community_id);
    }
    
    if (filters.publication_id) {
      query = query.eq('publication_id', filters.publication_id);
    }
    
    if (filters.author_id) {
      query = query.eq('author_id', filters.author_id);
    }
    
    // Apply sorting
    if (filters.sort === 'hot') {
      query = query.order('hot_score', { ascending: false });
    } else if (filters.sort === 'top') {
      query = query.order('upvote_count', { ascending: false });
    } else if (filters.sort === 'controversial') {
      // Controversial = high upvotes AND high downvotes
      query = query.order('downvote_count', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    
    // Pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Load posts error:', error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function createPost(postData) {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabaseClient
      .from('posts')
      .insert({
        title: postData.title,
        content: postData.content,
        content_html: postData.content_html || postData.content,
        author_id: user.id,
        community_id: postData.community_id || null,
        publication_id: postData.publication_id || null,
        category: postData.category,
        university: postData.university,
        is_anonymous: postData.is_anonymous || false,
      })
      .select(`
        *,
        author:profiles!posts_author_id_fkey(id, username, display_name, avatar_url, karma),
        community:communities(id, name, slug, icon_url),
        publication:publications(id, name, slug, icon_url)
      `)
      .single();
    
    if (error) throw error;
    
    // Update community post count if applicable
    if (postData.community_id) {
      await supabaseClient.rpc('increment', {
        table_name: 'communities',
        column_name: 'post_count',
        id: postData.community_id,
      }).catch(() => {}); // Ignore if function doesn't exist
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Create post error:', error);
    return { success: false, error: error.message };
  }
}

export async function getPost(postId) {
  try {
    const { data, error } = await supabaseClient
      .from('posts')
      .select(`
        *,
        author:profiles!posts_author_id_fkey(id, username, display_name, avatar_url, karma, university),
        community:communities(id, name, slug, icon_url, description),
        publication:publications(id, name, slug, icon_url, description)
      `)
      .eq('id', postId)
      .single();
    
    if (error) throw error;
    
    // Increment view count
    await supabaseClient
      .from('posts')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', postId)
      .catch(() => {}); // Ignore errors
    
    return { success: true, data };
  } catch (error) {
    console.error('Get post error:', error);
    return { success: false, error: error.message };
  }
}

export async function updatePost(postId, updates) {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabaseClient
      .from('posts')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .eq('author_id', user.id) // Ensure user owns the post
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Update post error:', error);
    return { success: false, error: error.message };
  }
}

export async function deletePost(postId) {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await supabaseClient
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('author_id', user.id); // Ensure user owns the post
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Delete post error:', error);
    return { success: false, error: error.message };
  }
}

export function setupPostsRealtime(callback) {
  const channel = supabaseClient.channel('posts-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'posts' },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
  
  return channel;
}

