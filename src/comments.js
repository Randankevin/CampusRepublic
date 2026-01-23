// Comment System Functions

let supabaseClient = null;

export function initComments(supabase) {
  supabaseClient = supabase;
}

export async function loadComments(postId, parentId = null) {
  try {
    let query = supabaseClient
      .from('comments')
      .select(`
        *,
        author:profiles!comments_author_id_fkey(id, username, display_name, avatar_url, karma)
      `)
      .eq('post_id', postId);
    
    if (parentId === null) {
      query = query.is('parent_id', null);
    } else {
      query = query.eq('parent_id', parentId);
    }
    
    query = query.order('created_at', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Load comments error:', error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function createComment(postId, content, parentId = null) {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabaseClient
      .from('comments')
      .insert({
        post_id: postId,
        parent_id: parentId,
        author_id: user.id,
        content: content,
        content_html: content, // Can be enhanced with rich text
        is_anonymous: false,
      })
      .select(`
        *,
        author:profiles!comments_author_id_fkey(id, username, display_name, avatar_url, karma)
      `)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Create comment error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateComment(commentId, content) {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabaseClient
      .from('comments')
      .update({
        content: content,
        content_html: content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', commentId)
      .eq('author_id', user.id) // Ensure user owns the comment
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Update comment error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteComment(commentId) {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await supabaseClient
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('author_id', user.id); // Ensure user owns the comment
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Delete comment error:', error);
    return { success: false, error: error.message };
  }
}

export function setupCommentsRealtime(postId, callback) {
  const channel = supabaseClient.channel(`comments-${postId}`)
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'comments',
        filter: `post_id=eq.${postId}`
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
  
  return channel;
}

