<script setup lang="ts">
import { ref } from 'vue';
import { useMutation } from '@urql/vue';

const emit = defineEmits(['verified']);

const VERIFY_MFA_LOGIN = `
  mutation VerifyMfaLogin($code: String!) {
    verifyMfaLogin(code: $code)
  }
`;

const { executeMutation: verifyLogin } = useMutation(VERIFY_MFA_LOGIN);

const code = ref('');
const error = ref('');
const loading = ref(false);

const handleVerify = async () => {
  if (code.value.length !== 6) return;

  loading.value = true;
  error.value = '';

  const result = await verifyLogin({ code: code.value });
  if (result.data?.verifyMfaLogin) {
    emit('verified');
  } else {
    error.value = 'Invalid verification code. Please try again.';
  }
  loading.value = false;
};
</script>

<template>
  <div class="mfa-challenge container">
    <div class="glass-card animate-fade-in">
      <div class="mfa-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
      </div>
      <h2>Two-Step Verification</h2>
      <p>Your account is protected with Two-Factor Authentication. Please enter the code from your authenticator app to continue.</p>

      <div class="input-group">
        <input
          v-model="code"
          type="text"
          placeholder="000000"
          maxlength="6"
          @keyup.enter="handleVerify"
          autoFocus
        />
        <p v-if="error" class="error-message">{{ error }}</p>
      </div>

      <button @click="handleVerify" class="btn-primary full-width" :disabled="loading || code.length !== 6">
        {{ loading ? 'Verifying...' : 'Verify Code' }}
      </button>

      <p class="help-text">
        Lost access to your device? Contact support for recovery.
      </p>
    </div>
  </div>
</template>

<style scoped>
.mfa-challenge {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
}

.glass-card {
  background: var(--surface-color);
  backdrop-filter: blur(12px);
  padding: 3rem;
  border-radius: 20px;
  border: 1px solid var(--surface-border);
  max-width: 450px;
  text-align: center;
  box-shadow: var(--glass-shadow);
}

.mfa-icon {
  color: var(--accent-color);
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

h2 {
  margin-bottom: 1rem;
  font-size: 1.75rem;
}

p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.5;
}

.input-group {
  margin-bottom: 2rem;
}

input {
  text-align: center;
  font-size: 2rem;
  letter-spacing: 0.5rem;
  font-weight: 700;
  padding: 1rem;
}

.error-message {
  color: var(--danger-color);
  margin-top: 0.75rem;
  font-size: 0.9rem;
}

.full-width {
  width: 100%;
}

.help-text {
  margin-top: 2rem;
  margin-bottom: 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
}
</style>
