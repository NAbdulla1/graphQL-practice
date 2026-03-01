<script setup lang="ts">
import { ref } from 'vue';
import { useMutation } from '@urql/vue';

const description = ref('');
const url = ref('');
const isFormOpen = ref(false);

const POST_LINK_MUTATION = `
  mutation PostLink($description: String!, $url: String!) {
    postLink(description: $description, url: $url) {
      id
      description
      url
    }
  }
`;

const { executeMutation: postLink, fetching, error } = useMutation(POST_LINK_MUTATION);
const emit = defineEmits(['linkPosted']);

const submitLink = async () => {
  if (!description.value.trim() || !url.value.trim()) return;

  const result = await postLink({
    description: description.value,
    url: url.value
  });

  if (result.data) {
    description.value = '';
    url.value = '';
    isFormOpen.value = false;
    emit('linkPosted');
  }
};
</script>

<template>
  <div class="post-link-container">
    <button v-if="!isFormOpen" @click="isFormOpen = true" class="btn-primary new-link-btn shadow-btn">
      <span class="plus-icon">+</span> Post New Link
    </button>

    <div v-else class="post-form-card glass-panel animate-fade-in">
      <div class="form-header">
        <h3>Post a New Link</h3>
        <button @click="isFormOpen = false" class="close-btn" title="Close">&times;</button>
      </div>

      <form @submit.prevent="submitLink" class="post-form">
        <div class="form-group">
          <label for="description">Description</label>
          <input
            type="text"
            id="description"
            v-model="description"
            placeholder="e.g., A comprehensive guide to Vue 3"
            required
            :disabled="fetching"
          >
        </div>

        <div class="form-group">
          <label for="url">URL</label>
          <input
            type="url"
            id="url"
            v-model="url"
            placeholder="https://example.com"
            required
            :disabled="fetching"
          >
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="isFormOpen = false" :disabled="fetching">
            Cancel
          </button>
          <button type="submit" class="btn-primary" :disabled="fetching">
            {{ fetching ? 'Posting...' : 'Post Link' }}
          </button>
        </div>
      </form>

      <div v-if="error" class="error-message">
        Failed to post link: {{ error.message }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-link-container {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.new-link-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  padding: 1rem 2rem;
  border-radius: 50px;
}

.shadow-btn {
  box-shadow: 0 4px 20px 0 rgba(59, 130, 246, 0.4);
}

.plus-icon {
  font-size: 1.5rem;
  line-height: 1;
  font-weight: 300;
}

.post-form-card {
  width: 100%;
  max-width: 600px;
  padding: 2rem;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.form-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 0 0.5rem;
}

.close-btn:hover {
  color: var(--text-primary);
}

.post-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 0.5rem;
}

.error-message {
  color: var(--danger-color);
  font-size: 0.9rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.3);
}
</style>
