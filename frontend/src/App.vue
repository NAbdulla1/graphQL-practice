<script setup lang="ts">
import { ref } from 'vue';
import Feed from './components/Feed.vue';
import PostLinkForm from './components/PostLinkForm.vue';

// We assign a key to the feed to force a re-render/refetch when a new link is posted
// Again, in a bigger app, use urql cached updates. This is fine for our simple app.
const feedKey = ref(0);

const handleLinkPosted = () => {
  feedKey.value += 1;
};
</script>

<template>
  <header class="app-header">
    <div class="logo-container">
      <div class="logo-circle">HN</div>
      <h1>HackerNews <span class="accent">GraphQL</span></h1>
    </div>
    <p class="subtitle">A modern, glassmorphic Vue 3 + urql client</p>
  </header>

  <main>
    <PostLinkForm @linkPosted="handleLinkPosted" />
    <Feed :key="feedKey" />
  </main>
</template>

<style scoped>
.app-header {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--surface-border);
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

main {
  animation: fadeIn 0.6s ease-out forwards;
}
</style>
