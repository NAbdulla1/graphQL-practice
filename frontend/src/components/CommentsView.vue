<script setup lang="ts">
import { ref } from 'vue';
import { useMutation } from '@urql/vue';
import { COMMENT_FIELDS } from '../graphql/fragments';

const props = defineProps<{
  linkId: string;
  comments: { id: string; body: string }[];
}>();

const newCommentBody = ref('');

const POST_COMMENT_MUTATION = `
  ${COMMENT_FIELDS}
  mutation PostCommentOnLink($linkId: ID!, $body: String!) {
    postCommentOnLink(linkId: $linkId, body: $body) {
      ...CommentFields
    }
  }
`;

const { executeMutation: postComment, fetching, error } = useMutation(POST_COMMENT_MUTATION);

const emit = defineEmits(['commentAdded']);

const submitComment = async () => {
  if (!newCommentBody.value.trim()) return;

  const result = await postComment({ linkId: props.linkId, body: newCommentBody.value });

  if (result.data) {
    newCommentBody.value = '';
    // emit event to parent to refetch or updater logic
    emit('commentAdded');
  }
};
</script>

<template>
  <div class="comments-container">
    <div v-if="comments.length === 0" class="no-comments">
      No comments yet. Be the first to share your thoughts!
    </div>

    <ul v-else class="comments-list">
      <li v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-body">{{ comment.body }}</div>
      </li>
    </ul>

    <div class="post-comment-section">
      <form @submit.prevent="submitComment" class="comment-form">
        <textarea
          v-model="newCommentBody"
          placeholder="Write a comment..."
          rows="2"
          required
        ></textarea>
        <button type="submit" class="btn-primary submit-btn" :disabled="fetching">
          {{ fetching ? 'Posting...' : 'Post Comment' }}
        </button>
      </form>
      <div v-if="error" class="error-message">Failed to post comment.</div>
    </div>
  </div>
</template>

<style scoped>
.comments-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.no-comments {
  color: var(--text-secondary);
  font-style: italic;
  font-size: 0.9rem;
}

.comments-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.comment-item {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 1rem;
  border-left: 3px solid var(--accent-color);
}

.comment-body {
  font-size: 0.95rem;
  line-height: 1.5;
}

.post-comment-section {
  margin-top: 0.5rem;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-end;
}

.submit-btn {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.error-message {
  color: var(--danger-color);
  font-size: 0.85rem;
  margin-top: 0.5rem;
}
</style>
