import { createApp } from 'vue'
import urql, { cacheExchange, fetchExchange, subscriptionExchange } from '@urql/vue';
import { createClient as createSSEClient } from 'graphql-sse';
import './style.css'
import App from './App.vue'

const sseClient = createSSEClient({
  url: '/graphql',
});

const app = createApp(App)

app.use(urql, {
  url: '/graphql',
  fetchOptions: {
    credentials: 'include',
  },
  exchanges: [
    cacheExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription(request) {
        const input = { ...request, query: request.query || '' };
        return {
          subscribe(sink) {
            const unsubscribe = sseClient.subscribe(input, sink);
            return { unsubscribe };
          },
        };
      },
    }),
  ]
});

app.mount('#app')
