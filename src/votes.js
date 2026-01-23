// Voting System Functions

let supabaseClient = null;

export function initVotes(supabase) {
  supabaseClient = supabase;
}

export async function voteOnPost(postId, voteType) {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    // Check if user already voted
    const { data: existingVote } = await supabaseClient
      .from('votes')
      .select('*')
      .eq('user_id', user.id)
      .eq('post_id', postId)
      .single();
    
    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Remove vote if clicking same button
        const { error } = await supabaseClient
          .from('votes')
          .delete()
          .eq('id', existingVote.id);
        
        if (error) throw error;
        return { success: true, action: 'removed' };
      } else {
        // Update vote type
        const { error } = await supabaseClient
          .from('votes')
          .update({ vote_type: voteType })
          .eq('id', existingVote.id);
        
        if (error) throw error;
        return { success: true, action: 'updated' };
      }
    } else {
      // Create new vote
      const { error } = await supabaseClient
        .from('votes')
        .insert({
          user_id: user.id,
          post_id: postId,
          vote_type: voteType,
        });
      
      if (error) throw error;
      return { success: true, action: 'created' };
    }
  } catch (error) {
    console.error('Vote on post error:', error);
    return { success: false, error: error.message };
  }
}

export async function voteOnComment(commentId, voteType) {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    // Check if user already voted
    const { data: existingVote } = await supabaseClient
      .from('votes')
      .select('*')
      .eq('user_id', user.id)
      .eq('comment_id', commentId)
      .single();
    
    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Remove vote
        const { error } = await supabaseClient
          .from('votes')
          .delete()
          .eq('id', existingVote.id);
        
        if (error) throw error;
        return { success: true, action: 'removed' };
      } else {
        // Update vote type
        const { error } = await supabaseClient
          .from('votes')
          .update({ vote_type: voteType })
          .eq('id', existingVote.id);
        
        if (error) throw error;
        return { success: true, action: 'updated' };
      }
    } else {
      // Create new vote
      const { error } = await supabaseClient
        .from('votes')
        .insert({
          user_id: user.id,
          comment_id: commentId,
          vote_type: voteType,
        });
      
      if (error) throw error;
      return { success: true, action: 'created' };
    }
  } catch (error) {
    console.error('Vote on comment error:', error);
    return { success: false, error: error.message };
  }
}

export async function getUserVotes(postIds = [], commentIds = []) {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return { success: true, data: [] };
    
    let query = supabaseClient
      .from('votes')
      .select('*')
      .eq('user_id', user.id);
    
    if (postIds.length > 0) {
      query = query.in('post_id', postIds);
    }
    
    if (commentIds.length > 0) {
      query = query.in('comment_id', commentIds);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Get user votes error:', error);
    return { success: false, error: error.message, data: [] };
  }
}

