<script setup lang="ts">
import { ref } from 'vue';
import { useMutation } from '@urql/vue';

const emit = defineEmits(['verified']);

const VERIFY_MFA_LOGIN = `
  mutation VerifyMfaLogin($code: String!) {
    verifyMfaLogin(code: $code) {
      success
      isRecovery
    }
  }
`;

const { executeMutation: verifyLogin } = useMutation(VERIFY_MFA_LOGIN);

const code = ref('');
const isRecovery = ref(false);
const error = ref('');
const loading = ref(false);
const recoverySuccess = ref(false);

const handleVerify = async () => {
  if (!isRecovery.value && code.value.length !== 6) return;
  if (isRecovery.value && !code.value) return;

  loading.value = true;
  error.value = '';

  const result = await verifyLogin({ code: code.value });
  const response = result.data?.verifyMfaLogin;

  if (response?.success) {
    if (response.isRecovery) {
      recoverySuccess.value = true;
      // Wait a bit to let the user read the message before triggering redirect/refetch
      setTimeout(() => {
        emit('verified');
      }, 3000);
    } else {
      emit('verified');
    }
  } else {
    error.value = isRecovery.value
      ? 'Invalid recovery code. Please try again.'
      : 'Invalid verification code. Please try again.';
  }

  if (!recoverySuccess.value) {
    loading.value = false;
  }
};

const toggleMode = () => {
  isRecovery.value = !isRecovery.value;
  code.value = '';
  error.value = '';
};
</script>

<template>
  <div class="mfa-challenge container">
    <div class="glass-card animate-fade-in">
      <div class="mfa-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
      </div>
      <h2>Two-Step Verification</h2>
      <p v-if="!isRecovery">Your account is protected with Two-Factor Authentication. Please enter the code from your authenticator app to continue.</p>
      <p v-else>Please enter one of your 8-character recovery codes to log in.</p>

      <div v-if="recoverySuccess" class="recovery-success-message animate-fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="success-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <p>Recovery successful! MFA has been disabled for your account. Please set it up again in your settings.</p>
        <div class="redirect-spinner">Redirecting...</div>
      </div>

      <div v-else class="input-group">
        <input
          v-model="code"
          type="text"
          :placeholder="isRecovery ? 'Recovery code' : '000000'"
          :maxlength="isRecovery ? 8 : 6"
          :class="{ 'recovery-input': isRecovery }"
          @keyup.enter="handleVerify"
          autoFocus
        />
        <p v-if="error" class="error-message">{{ error }}</p>
      </div>

      <button @click="handleVerify" class="btn-primary full-width" :disabled="loading || (!isRecovery && code.length !== 6) || (isRecovery && !code)">
        {{ loading ? 'Verifying...' : 'Verify' }}
      </button>

      <div class="help-links">
        <button @click="toggleMode" class="btn-link">
          {{ isRecovery ? 'Use authenticator app' : 'Use a recovery code' }}
        </button>
      </div>
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

input.recovery-input {
  font-size: 1.5rem;
  letter-spacing: 0.1rem;
}

.error-message {
  color: var(--danger-color);
  margin-top: 0.75rem;
  font-size: 0.9rem;
}

.full-width {
  width: 100%;
}

.help-links {
  margin-top: 2rem;
}

.btn-link {
  background: none;
  border: none;
  color: var(--accent-color);
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0;
}

.btn-link:hover {
  color: var(--accent-hover);
}

.recovery-success-message {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
}

.recovery-success-message p {
  color: #22c55e;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.success-icon {
  color: #22c55e;
  margin-bottom: 0.5rem;
}

.redirect-spinner {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-style: italic;
}
</style>
