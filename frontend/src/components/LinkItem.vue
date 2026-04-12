<script setup lang="ts">
import { ref } from 'vue';
import { useMutation } from '@urql/vue';

const props = defineProps<{
  link: {
    id: string;
    description: string;
    url: string;
    comments?: { id: string; body: string }[];
  }
}>();

const emit = defineEmits<{
  (e: 'delete'): void
}>();

const DELETE_LINK_MUTATION = `
  mutation DeleteLink($id: ID!) {
    deleteLink(id: $id) {
      id
    }
  }
`;

const { executeMutation: deleteLink } = useMutation(DELETE_LINK_MUTATION);

const showComments = ref(false);

const toggleComments = () => {
  showComments.value = !showComments.value;
};

const handleDelete = async () => {
  if (confirm('Are you sure you want to delete this link?')) {
    const result = await deleteLink({ id: props.link.id });
    if (!result.error) {
      emit('delete');
    } else {
      console.error('Failed to delete user:', result.error);
      alert(result.error.message)
    }
  }
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
      <button @click="handleDelete" class="btn-danger ml-auto" style="margin-left: auto;">
        Delete
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

.btn-danger {
  background: var(--danger-color, #ef4444);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

.comments-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-border);
}
</style>
