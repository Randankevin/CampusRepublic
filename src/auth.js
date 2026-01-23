// Authentication Functions

let supabaseClient = null;

export function initAuth(supabase) {
  supabaseClient = supabase;
}

export async function signInWithEmail(email) {
  try {
    // For demo purposes, we'll use magic link
    const { data, error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      }
    });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message };
  }
}

export async function signInAnonymously() {
  try {
    // Create a guest session
    const guestEmail = `guest_${Date.now()}@campusrepublic.local`;
    const { data, error } = await supabaseClient.auth.signInWithOtp({
      email: guestEmail,
      options: {
        shouldCreateUser: true,
      }
    });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Anonymous sign in error:', error);
    return { success: false, error: error.message };
  }
}

export async function signOut() {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    localStorage.removeItem('campusrepublic_user');
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (error) throw error;
    
    if (user) {
      // Get or create profile
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const username = user.email?.split('@')[0] || `user_${user.id.substring(0, 8)}`;
        const { data: newProfile, error: createError } = await supabaseClient
          .from('profiles')
          .insert({
            id: user.id,
            username: username,
            display_name: user.email?.split('@')[0] || 'Student',
          })
          .select()
          .single();
        
        if (createError) throw createError;
        return { user, profile: newProfile };
      }
      
      if (profileError) throw profileError;
      return { user, profile };
    }
    
    return { user: null, profile: null };
  } catch (error) {
    console.error('Get current user error:', error);
    return { user: null, profile: null };
  }
}

export async function updateProfile(updates) {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabaseClient
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: error.message };
  }
}

export function setupAuthListener(callback) {
  supabaseClient.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}

