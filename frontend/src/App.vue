<script setup lang="ts">
import { ref } from 'vue';
import { useQuery } from '@urql/vue';
import Feed from './components/Feed.vue';
import PostLinkForm from './components/PostLinkForm.vue';

const ME_QUERY = `
  query Me {
    me {
      id
      name
      email
    }
  }
`;

const { data, fetching, error } = useQuery({ query: ME_QUERY });

// We assign a key to the feed to force a re-render/refetch when a new link is posted
const feedKey = ref(0);

const handleLinkPosted = () => {
  feedKey.value += 1;
};

const handleLogout = async () => {
  try {
    await fetch('http://localhost:4000/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.reload();
  } catch (err) {
    console.error('Logout failed', err);
  }
};
</script>

<template>
  <header class="app-header">
    <div class="logo-container">
      <div class="logo-circle">HN</div>
      <h1>HackerNews <span class="accent">GraphQL</span></h1>
    </div>
    <p class="subtitle">A modern, glassmorphic Vue 3 + urql client</p>

    <div class="auth-bar">
      <div v-if="fetching" class="loading-auth">Checking session...</div>
      <div v-else-if="data?.me" class="user-info">
        <span>Welcome, <strong>{{ data.me.name }}</strong></span>
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </div>
      <div v-else class="login-prompt">
        <a href="http://localhost:4000/auth/google" class="login-btn">Login with Google</a>
      </div>
    </div>
  </header>

  <main>
    <div v-if="data?.me">
      <PostLinkForm @linkPosted="handleLinkPosted" />
      <Feed :key="feedKey" />
    </div>
    <div v-else-if="!fetching" class="auth-required">
      <div class="glass-card">
        <h2>Authentication Required</h2>
        <p>Please log in with Google to view and post to the feed.</p>
        <a href="http://localhost:4000/auth/google" class="login-btn large">Login with Google</a>
      </div>
    </div>
  </main>
</template>

<style scoped>
.app-header {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--surface-border);
  position: relative;
}

.auth-bar {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  font-size: 0.9rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: var(--surface-bg);
  border-radius: 20px;
  border: 1px solid var(--surface-border);
}

.logout-btn, .login-btn {
  padding: 0.4rem 1rem;
  border-radius: 15px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
  text-decoration: none;
}

.logout-btn {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.logout-btn:hover {
  background: #ef4444;
  color: white;
}

.login-btn {
  background: var(--accent-gradient);
  color: white;
  border: none;
  font-weight: 600;
}

.login-btn.large {
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  display: inline-block;
  margin-top: 1rem;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.logo-circle {
  width: 50px;
  height: 50px;
  background: var(--accent-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  color: white;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39);
}

h1 {
  font-size: 2.5rem;
  margin: 0;
  letter-spacing: -0.02em;
}

.accent {
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  font-weight: 300;
}

.auth-required {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.glass-card {
  background: var(--surface-bg);
  backdrop-filter: blur(12px);
  padding: 3rem;
  border-radius: 20px;
  border: 1px solid var(--surface-border);
  max-width: 500px;
  text-align: center;
}

main {
  animation: fadeIn 0.6s ease-out forwards;
}
</style>
