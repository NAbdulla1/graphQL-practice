<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  link: {
    id: string;
    description: string;
    url: string;
    comments?: { id: string; body: string }[];
  }
}>();

const showComments = ref(false);

const toggleComments = () => {
  showComments.value = !showComments.value;
};
</script>

<template>
  <div class="link-item glass-panel animate-fade-in">
    <div class="link-content">
      <div class="link-description">{{ link.description }}</div>
      <a :href="link.url" target="_blank" class="link-url">{{ link.url }}</a>
    </div>

    <div class="link-actions">
      <button @click="toggleComments" class="btn-secondary">
        {{ showComments ? 'Hide Comments' : `View ${link.comments?.length || 0} Comments` }}
      </button>
    </div>

    <!-- Slot for the CommentsView component injected by Feed -->
    <div v-if="showComments" class="comments-section animate-fade-in">
      <slot name="comments"></slot>
    </div>
  </div>
</template>

<style scoped>
.link-item {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.link-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.45);
}

.link-content {
  margin-bottom: 1rem;
}

.link-description {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.link-url {
  font-size: 0.875rem;
  color: var(--text-secondary);
  word-break: break-all;
}

.link-url:hover {
  color: var(--accent-hover);
  text-decoration: underline;
}

.link-actions {
  display: flex;
  align-items: center;
}

.comments-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-border);
}
</style>
