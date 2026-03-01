<script setup lang="ts">
import { useQuery } from '@urql/vue';
import LinkItem from './LinkItem.vue';
import CommentsView from './CommentsView.vue';

const FEED_QUERY = `
  query Feed {
    feed {
      id
      description
      url
      comments {
        id
        body
      }
    }
  }
`;

const { data, fetching, error, executeQuery } = useQuery({
  query: FEED_QUERY,
});

const handleCommentAdded = () => {
  // Refetch the feed when a new comment is added to see the updated comment list
  // Note: For a true prod app, we'd use urql's cacheExchange updates, but refetching is simple and works for this simple UI.
  executeQuery({ requestPolicy: 'network-only' });
};

const handleLinkDeleted = () => {
  executeQuery({ requestPolicy: 'network-only' });
};
</script>

<template>
  <div class="feed-container">
    <div v-if="fetching" class="loading-state">
      <div class="loader"></div>
      <p>Loading the feed...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>Failed to load feed: {{ error.message }}</p>
    </div>

    <div v-else-if="data && data.feed" class="feed-list">
      <LinkItem
        v-for="link in data.feed"
        :key="link.id"
        :link="link"
        @delete="handleLinkDeleted"
      >
        <template #comments>
          <CommentsView
            :linkId="link.id"
            :comments="link.comments"
            @commentAdded="handleCommentAdded"
          />
        </template>
      </LinkItem>

      <div v-if="data.feed.length === 0" class="empty-state">
        <p>The feed is empty. Post a link to get started!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.feed-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem 0;
}

.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: var(--surface-color);
  border-radius: 16px;
  border: 1px solid var(--surface-border);
  text-align: center;
  margin-top: 2rem;
}

.loading-state p {
  color: var(--text-secondary);
  font-weight: 500;
  margin-top: 1rem;
}

.error-state p {
  color: var(--danger-color);
}

.empty-state p {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

/* Simple CSS spinner */
.loader {
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top: 4px solid var(--accent-color);
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.feed-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
