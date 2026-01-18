// Main Application Logic

// Note: Using dynamic imports since we're loading Supabase from CDN
// For production, consider using a bundler or proper module setup

const CONFIG = {
  SUPABASE_URL: 'https://mqrpkspfykllixnhmvki.supabase.co',
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xcnBrc3BmeWtsaXhuaG12a2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDgxNjIsImV4cCI6MjA3NzkyNDE2Mn0.lU1Q-t7EHtyUAGJIBXZObZqUj3JzLasCvyLCPPjDeq0',
  POSTS_PER_PAGE: 20,
  COMMENTS_PER_PAGE: 50,
  MAX_CONTENT_LENGTH: 10000,
  MAX_TITLE_LENGTH: 500,
};

// Global state
let supabase = null;
let currentUser = null;
let currentProfile = null;
let appState = {
  posts: [],
  communities: [],
  publications: [],
  currentCategory: 'all',
  currentSort: 'new',
  isLoading: false,
  userVotes: {},
};

// Initialize Supabase
export async function initApp() {
  console.log('🚀 Initializing CampusRepublic...');
  
  // Load Supabase from CDN if not available
  if (typeof window.supabase === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    script.onload = () => {
      supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
      initializeModules();
    };
    document.head.appendChild(script);
  } else {
    supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
    initializeModules();
  }
}

// Utility functions
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type} fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 translate-x-0`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.transform = 'translateX(400px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

function getInitials(name) {
  if (!name) return 'AN';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function initializeModules() {
  // Setup auth state listener
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      checkAuth().then(() => loadInitialData());
    } else if (event === 'SIGNED_OUT') {
      currentUser = null;
      currentProfile = null;
      updateAuthUI();
    }
  });
  
  // Setup UI
  setupUI();
  
  // Check authentication
  await checkAuth();
  
  // Load initial data
  await loadInitialData();
  
  // Setup realtime subscriptions
  setupRealtime();
  
  console.log('✅ App initialization completed');
}

function setupUI() {
  setupDarkMode();
  setupAnonToggle();
  setupCharCounter();
  setupEventListeners();
}

function setupDarkMode() {
  const toggle = document.getElementById('dark-mode-toggle');
  if (toggle) {
    const isDark = localStorage.getItem('darkMode') !== 'false';
    if (isDark) document.body.classList.add('dark');
    
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      localStorage.setItem('darkMode', document.body.classList.contains('dark'));
    });
  }
}

function setupAnonToggle() {
  const toggle = document.getElementById('anon-toggle');
  const checkbox = document.getElementById('post-anonymous');
  
  if (toggle && checkbox) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      checkbox.checked = !checkbox.checked;
    });
  }
}

function setupCharCounter() {
  const textarea = document.getElementById('post-content');
  const counter = document.getElementById('char-count');
  
  if (textarea && counter) {
    textarea.addEventListener('input', () => {
      const length = textarea.value.length;
      counter.textContent = `${length}/${CONFIG.MAX_CONTENT_LENGTH}`;
      counter.style.color = length > CONFIG.MAX_CONTENT_LENGTH * 0.8 ? '#ff3333' : '#666';
    });
  }
}

function setupEventListeners() {
  // Login button
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      document.getElementById('login-modal')?.classList.remove('hidden');
    });
  }
  
  // Demo login
  const demoLogin = document.getElementById('demo-login');
  if (demoLogin) {
    demoLogin.addEventListener('click', async () => {
      const email = document.getElementById('auth-email')?.value || `student_${Date.now()}@campus.local`;
      await handleLogin(email);
    });
  }
  
  // Create post button
  const createPostBtn = document.getElementById('create-post-btn');
  if (createPostBtn) {
    createPostBtn.addEventListener('click', () => {
      if (!currentUser) {
        showToast('Please sign in to create a post', 'error');
        document.getElementById('login-modal')?.classList.remove('hidden');
        return;
      }
      document.getElementById('create-post-modal')?.classList.remove('hidden');
    });
  }
  
  // Close modals
  const closeModal = document.getElementById('close-modal');
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      document.getElementById('create-post-modal')?.classList.add('hidden');
    });
  }
  
  const cancelPost = document.getElementById('cancel-post');
  if (cancelPost) {
    cancelPost.addEventListener('click', () => {
      document.getElementById('create-post-modal')?.classList.add('hidden');
      document.getElementById('create-post-form')?.reset();
    });
  }
  
  // Create post form
  const createPostForm = document.getElementById('create-post-form');
  if (createPostForm) {
    createPostForm.addEventListener('submit', handleCreatePost);
  }
  
  // Category filters
  document.querySelectorAll('.category-filter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
      e.target.closest('.category-filter').classList.add('active');
      const category = e.target.closest('.category-filter').dataset.category;
      appState.currentCategory = category;
      loadPosts();
    });
  });
  
  // Sort select
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      appState.currentSort = e.target.value;
      loadPosts();
    });
  }
  
  // Create community button
  const createCommunityBtn = document.getElementById('create-community-btn');
  if (createCommunityBtn) {
    createCommunityBtn.addEventListener('click', () => {
      if (!currentUser) {
        showToast('Please sign in to create a community', 'error');
        document.getElementById('login-modal')?.classList.remove('hidden');
        return;
      }
      document.getElementById('create-community-modal')?.classList.remove('hidden');
      // Update restricted campus name
      const restrictedCampusName = document.getElementById('restricted-campus-name');
      if (restrictedCampusName && currentProfile?.university) {
        restrictedCampusName.textContent = currentProfile.university;
      }
    });
  }
  
  // Close community modal
  const closeCommunityModal = document.getElementById('close-community-modal');
  if (closeCommunityModal) {
    closeCommunityModal.addEventListener('click', () => {
      document.getElementById('create-community-modal')?.classList.add('hidden');
      document.getElementById('create-community-form')?.reset();
    });
  }
  
  const cancelCommunity = document.getElementById('cancel-community');
  if (cancelCommunity) {
    cancelCommunity.addEventListener('click', () => {
      document.getElementById('create-community-modal')?.classList.add('hidden');
      document.getElementById('create-community-form')?.reset();
    });
  }
  
  // Create community form
  const createCommunityForm = document.getElementById('create-community-form');
  if (createCommunityForm) {
    createCommunityForm.addEventListener('submit', handleCreateCommunity);
  }
  
  // Update restricted campus name when university input changes
  const communityUniversityInput = document.getElementById('community-university');
  const restrictedCampusName = document.getElementById('restricted-campus-name');
  if (communityUniversityInput && restrictedCampusName) {
    communityUniversityInput.addEventListener('input', (e) => {
      restrictedCampusName.textContent = e.target.value || 'your campus';
    });
  }
}

async function checkAuth() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    
    if (user) {
      // Get or create profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const username = user.email?.split('@')[0] || `user_${user.id.substring(0, 8)}`;
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: username,
            display_name: user.email?.split('@')[0] || 'Student',
          })
          .select()
          .single();
        
        if (createError) throw createError;
        currentUser = user;
        currentProfile = newProfile;
        updateAuthUI();
      } else if (profileError) {
        throw profileError;
      } else {
        currentUser = user;
        currentProfile = profile;
        updateAuthUI();
      }
    }
  } catch (error) {
    console.error('Auth check error:', error);
  }
}

function updateAuthUI() {
  const loginBtn = document.getElementById('login-btn');
  const welcomeMsg = document.getElementById('welcome-message');
  
  if (currentProfile) {
    if (loginBtn) {
      loginBtn.innerHTML = `<span>👤 ${currentProfile.display_name || currentProfile.username}</span>`;
      loginBtn.onclick = () => {
        // Show user menu or profile
        showToast('Profile menu coming soon!', 'success');
      };
    }
    
    if (welcomeMsg) {
      welcomeMsg.textContent = `Welcome back, ${currentProfile.display_name || currentProfile.username}! Ready to share your campus story?`;
    }
  }
}

async function handleLogin(email) {
  if (!email) {
    showToast('Please enter your email', 'error');
    return;
  }
  
  try {
    // For demo purposes, create a simple session
    // In production, use proper Supabase auth
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      }
    });
    
    if (error) throw error;
    
    showToast('Check your email for the magic link!', 'success');
    document.getElementById('login-modal')?.classList.add('hidden');
    
    // For demo, try to get session
    await checkAuth();
  } catch (error) {
    console.error('Login error:', error);
    showToast(error.message || 'Login failed', 'error');
  }
}

async function loadInitialData() {
  appState.isLoading = true;
  updateLoadingState();
  
  try {
    await Promise.all([
      loadPosts(),
      loadCommunities(),
    ]);
    
    // Load user votes if authenticated
    if (currentUser) {
      const postIds = appState.posts.map(p => p.id);
      if (postIds.length > 0) {
        const { data: votesData } = await supabase
          .from('votes')
          .select('*')
          .eq('user_id', currentUser.id)
          .in('post_id', postIds);
        
        if (votesData) {
          votesData.forEach(vote => {
            if (vote.post_id) {
              appState.userVotes[vote.post_id] = vote.vote_type;
            }
          });
        }
      }
    }
    
    renderPosts();
  } catch (error) {
    console.error('Error loading initial data:', error);
    showToast('Failed to load data', 'error');
  } finally {
    appState.isLoading = false;
    updateLoadingState();
  }
}

async function loadPosts() {
  appState.isLoading = true;
  updateLoadingState();
  
  try {
    let query = supabase
      .from('posts')
      .select(`
        *,
        author:profiles!posts_author_id_fkey(id, username, display_name, avatar_url, karma),
        community:communities(id, name, slug, icon_url),
        publication:publications(id, name, slug, icon_url)
      `)
      .eq('is_published', true);
    
    // Apply filters
    if (appState.currentCategory && appState.currentCategory !== 'all') {
      query = query.eq('category', appState.currentCategory);
    }
    
    // Apply sorting
    if (appState.currentSort === 'hot') {
      query = query.order('hot_score', { ascending: false });
    } else if (appState.currentSort === 'top') {
      query = query.order('upvote_count', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    
    query = query.limit(CONFIG.POSTS_PER_PAGE);
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    appState.posts = data || [];
    
    // Load user votes
    if (currentUser && appState.posts.length > 0) {
      const postIds = appState.posts.map(p => p.id);
      const { data: votesData } = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', currentUser.id)
        .in('post_id', postIds);
      
      if (votesData) {
        votesData.forEach(vote => {
          if (vote.post_id) {
            appState.userVotes[vote.post_id] = vote.vote_type;
          }
        });
      }
    }
    
    renderPosts();
  } catch (error) {
    console.error('Error loading posts:', error);
    showToast('Failed to load posts', 'error');
  } finally {
    appState.isLoading = false;
    updateLoadingState();
  }
}

async function loadCommunities() {
  try {
    let query = supabase
      .from('communities')
      .select('*');
    
    // Filter out campus-restricted communities if user's university doesn't match
    // For now, show all but mark restricted ones
    query = query.order('member_count', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Filter communities based on campus restrictions
    appState.communities = (data || []).filter(community => {
      if (community.is_campus_restricted && currentProfile) {
        // Only show if user's university matches
        return currentProfile.university === community.university;
      }
      // Show all non-restricted communities
      return true;
    });
    
    renderCommunities();
  } catch (error) {
    console.error('Error loading communities:', error);
  }
}

function renderPosts() {
  const container = document.getElementById('posts-container');
  if (!container) return;
  
  if (appState.posts.length === 0) {
    container.innerHTML = '';
    document.getElementById('empty-state')?.classList.remove('hidden');
    return;
  }
  
  document.getElementById('empty-state')?.classList.add('hidden');
  
  container.innerHTML = appState.posts.map(post => createPostHTML(post)).join('');
  
  // Attach event listeners
  container.querySelectorAll('.vote-up').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const postId = e.target.closest('[data-post-id]')?.dataset.postId;
      if (postId) handleVote(postId, 'upvote');
    });
  });
  
  container.querySelectorAll('.vote-down').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const postId = e.target.closest('[data-post-id]')?.dataset.postId;
      if (postId) handleVote(postId, 'downvote');
    });
  });
}

function createPostHTML(post) {
  const author = post.is_anonymous ? { display_name: 'Anonymous', username: 'anon' } : post.author;
  const initials = getInitials(author?.display_name || author?.username);
  const userVote = appState.userVotes[post.id];
  const netVotes = (post.upvote_count || 0) - (post.downvote_count || 0);
  const voteColor = netVotes > 0 ? 'text-orange-500' : netVotes < 0 ? 'text-blue-400' : 'text-gray-400';
  
  return `
    <article data-post-id="${post.id}" class="post-card p-5">
      <div class="flex gap-4">
        <!-- Vote Section - Reddit style -->
        <div class="vote-container flex flex-col items-center gap-1 flex-shrink-0">
          <button class="vote-button vote-up ${userVote === 'upvote' ? 'active' : ''}" data-vote-type="upvote" title="Upvote">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
          <span class="text-sm font-bold ${voteColor} min-w-[2rem] text-center">
            ${formatNumber(netVotes)}
          </span>
          <button class="vote-button vote-down ${userVote === 'downvote' ? 'active' : ''}" data-vote-type="downvote" title="Downvote">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
        
        <!-- Post Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-3 flex-wrap">
            ${post.community ? `
              <a href="#" class="category-badge badge-${post.category} flex items-center gap-1">
                <span class="text-xs">r/</span>
                <span>${escapeHtml(post.community.name)}</span>
              </a>
            ` : ''}
            ${post.category ? `
              <span class="category-badge badge-${post.category}">${escapeHtml(post.category)}</span>
            ` : ''}
            ${post.university ? `
              <span class="text-xs text-gray-500 flex items-center gap-1">
                <span>📍</span>
                <span>${escapeHtml(post.university)}</span>
              </span>
            ` : ''}
            <span class="text-xs text-gray-500">•</span>
            <span class="text-xs text-gray-500">${formatDate(post.created_at)}</span>
          </div>
          
          <h3 class="text-lg font-bold mb-2 hover:text-orange-400 transition-colors cursor-pointer line-clamp-2">
            ${escapeHtml(post.title)}
          </h3>
          
          <p class="text-gray-300 mb-4 line-clamp-3 text-sm leading-relaxed">
            ${escapeHtml(post.content.substring(0, 250))}${post.content.length > 250 ? '...' : ''}
          </p>
          
          <div class="flex items-center justify-between pt-3 border-t border-gray-800">
            <div class="flex items-center gap-4 text-xs text-gray-500">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center border border-orange-500/30">
                  <span class="text-orange-400 text-xs font-bold">${initials}</span>
                </div>
                <span class="text-gray-400">${escapeHtml(author?.display_name || author?.username || 'Anonymous')}</span>
                ${author?.karma ? `<span class="text-gray-600">• ${formatNumber(author.karma)} karma</span>` : ''}
              </div>
            </div>
            
            <div class="flex items-center gap-4 text-xs text-gray-500">
              <button class="flex items-center gap-1 hover:text-orange-400 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                <span>${post.comment_count || 0}</span>
              </button>
              <button class="flex items-center gap-1 hover:text-orange-400 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <span>${formatNumber(post.view_count || 0)}</span>
              </button>
              <button class="flex items-center gap-1 hover:text-orange-400 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  `;
}

async function handleVote(postId, voteType) {
  if (!currentUser) {
    showToast('Please sign in to vote', 'error');
    return;
  }
  
  try {
    // Check if user already voted
    const { data: existingVote } = await supabase
      .from('votes')
      .select('*')
      .eq('user_id', currentUser.id)
      .eq('post_id', postId)
      .single();
    
    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Remove vote if clicking same button
        await supabase
          .from('votes')
          .delete()
          .eq('id', existingVote.id);
      } else {
        // Update vote type
        await supabase
          .from('votes')
          .update({ vote_type: voteType })
          .eq('id', existingVote.id);
      }
    } else {
      // Create new vote
      await supabase
        .from('votes')
        .insert({
          user_id: currentUser.id,
          post_id: postId,
          vote_type: voteType,
        });
    }
    
    // Reload posts to get updated counts
    await loadPosts();
  } catch (error) {
    console.error('Vote error:', error);
    showToast('Failed to vote', 'error');
  }
}

async function handleCreatePost(e) {
  e.preventDefault();
  
  if (!currentUser) {
    showToast('Please sign in to create a post', 'error');
    return;
  }
  
  const formData = new FormData(e.target);
  const postData = {
    title: formData.get('title'),
    content: formData.get('content'),
    category: formData.get('category'),
    university: formData.get('university'),
    is_anonymous: document.getElementById('post-anonymous')?.checked || false,
  };
  
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        title: postData.title,
        content: postData.content,
        content_html: postData.content,
        author_id: currentUser.id,
        category: postData.category,
        university: postData.university,
        is_anonymous: postData.is_anonymous,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    showToast('Post created successfully!', 'success');
    document.getElementById('create-post-modal')?.classList.add('hidden');
    e.target.reset();
    await loadPosts();
  } catch (error) {
    console.error('Create post error:', error);
    showToast(error.message || 'Failed to create post', 'error');
  }
}

function renderCommunities() {
  const container = document.getElementById('communities-list');
  if (!container) return;
  
  if (appState.communities.length === 0) {
    container.innerHTML = '<div class="text-gray-500 text-sm">No communities yet. Be the first to create one!</div>';
    return;
  }
  
  container.innerHTML = appState.communities.slice(0, 10).map(community => {
    const canJoin = !community.is_campus_restricted || 
                   (currentProfile && currentProfile.university === community.university);
    const isSubscribed = false; // TODO: Check subscription status
    
    return `
      <div class="community-item" data-community-id="${community.id}">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3 flex-1">
            ${community.icon_url ? 
              `<img src="${community.icon_url}" class="w-10 h-10 rounded-lg object-cover">` : 
              `<div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">${community.name.charAt(0).toUpperCase()}</div>`
            }
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <div class="community-name">${escapeHtml(community.name)}</div>
                ${community.is_campus_restricted ? 
                  '<span class="campus-restricted-badge">🔒 Campus Only</span>' : 
                  ''
                }
              </div>
              <div class="community-meta">
                ${formatNumber(community.member_count || 0)} members • ${community.category || 'general'}
              </div>
              ${community.university ? 
                `<div class="text-xs text-gray-500 mt-1">📍 ${escapeHtml(community.university)}</div>` : 
                ''
              }
            </div>
          </div>
          ${canJoin ? 
            `<button class="text-xs px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition-all border border-orange-500/30">
              ${isSubscribed ? 'Joined' : 'Join'}
            </button>` :
            `<button class="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-400 border border-gray-700 cursor-not-allowed" title="Only ${escapeHtml(community.university)} students can join">
              🔒 Restricted
            </button>`
          }
        </div>
      </div>
    `;
  }).join('');
  
  // Add click handlers for joining communities
  container.querySelectorAll('.community-item').forEach(item => {
    item.addEventListener('click', async (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
      
      const communityId = item.dataset.communityId;
      const community = appState.communities.find(c => c.id === communityId);
      
      if (community && community.is_campus_restricted) {
        if (!currentProfile || currentProfile.university !== community.university) {
          showToast(`This hub is restricted to ${community.university} students only`, 'error');
          return;
        }
      }
      
      // TODO: Navigate to community page or join
      showToast(`Opening ${community.name}...`, 'success');
    });
  });
}

async function handleCreateCommunity(e) {
  e.preventDefault();
  
  if (!currentUser) {
    showToast('Please sign in to create a community', 'error');
    return;
  }
  
  const formData = new FormData(e.target);
  const name = formData.get('name');
  const description = formData.get('description') || '';
  const university = formData.get('university');
  const category = formData.get('category') || 'general';
  const isCampusRestricted = formData.get('is_campus_restricted') === 'on';
  
  if (!name || !university) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  try {
    const { data, error } = await supabase
      .from('communities')
      .insert({
        name,
        slug,
        description,
        university,
        category,
        is_campus_restricted: isCampusRestricted,
        created_by: currentUser.id,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Auto-subscribe creator
    await supabase
      .from('subscriptions')
      .insert({
        user_id: currentUser.id,
        community_id: data.id,
        status: 'active',
      })
      .catch(() => {}); // Ignore if already subscribed
    
    showToast(`Hub "${name}" created successfully! ${isCampusRestricted ? '🔒 Campus-restricted' : ''}`, 'success');
    document.getElementById('create-community-modal')?.classList.add('hidden');
    e.target.reset();
    await loadInitialData();
  } catch (error) {
    console.error('Create community error:', error);
    showToast(error.message || 'Failed to create community', 'error');
  }
}

function updateLoadingState() {
  const loadingState = document.getElementById('loading-state');
  if (loadingState) {
    loadingState.style.display = appState.isLoading ? 'block' : 'none';
  }
}

function setupRealtime() {
  // Setup posts realtime
  const postChannel = supabase.channel('posts-changes')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'posts' },
      (payload) => {
        console.log('Realtime post update:', payload);
        appState.posts.unshift(payload.new);
        renderPosts();
        showToast('🔥 New post just dropped!', 'success');
      }
    )
    .subscribe();
  
  // Setup notifications realtime if user is logged in
  if (currentUser) {
    const notificationChannel = supabase.channel(`notifications-${currentUser.id}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${currentUser.id}`
        },
        (payload) => {
          console.log('New notification:', payload);
          showToast(payload.new.title, 'success');
        }
      )
      .subscribe();
  }
}

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Initializing CampusRepublic...');
    
    try {
        // Try to initialize real auth first
        await initRealAuth();
    } catch (error) {
        console.error('Failed to initialize real auth:', error);
        // Fall back to demo mode
        setupDemoMode();
        showToast('Using demo mode. Click "Try Demo Mode" to start.', 'info');
    }
    
    setupEventListeners();
});

