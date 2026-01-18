// Notification System Functions

let supabaseClient = null;

export function initNotifications(supabase) {
  supabaseClient = supabase;
}

export async function loadNotifications(limit = 50) {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return { success: true, data: [] };
    
    const { data, error } = await supabaseClient
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Load notifications error:', error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function markNotificationAsRead(notificationId) {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await supabaseClient
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', user.id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return { success: false, error: error.message };
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { error } = await supabaseClient
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    return { success: false, error: error.message };
  }
}

export async function getUnreadCount() {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return { success: true, count: 0 };
    
    const { count, error } = await supabaseClient
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    
    if (error) throw error;
    return { success: true, count: count || 0 };
  } catch (error) {
    console.error('Get unread count error:', error);
    return { success: false, error: error.message, count: 0 };
  }
}

export async function createNotification(userId, notificationData) {
  try {
    const { error } = await supabaseClient
      .from('notifications')
      .insert({
        user_id: userId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        link: notificationData.link,
      });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Create notification error:', error);
    return { success: false, error: error.message };
  }
}

export function setupNotificationsRealtime(callback) {
  const { data: { user } } = supabaseClient.auth.getUser();
  if (!user) return null;
  
  const channel = supabaseClient.channel(`notifications-${user.id}`)
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
  
  return channel;
}

