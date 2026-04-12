<script setup lang="ts">
import { ref } from 'vue';
import { useMutation } from '@urql/vue';

const props = defineProps<{
  mfaEnabled: boolean;
}>();

const emit = defineEmits(['updated']);

const GENERATE_MFA_SECRET = `
  mutation GenerateMfaSecret {
    generateMfaSecret {
      secret
      otpauthUrl
      qrCodeDataUrl
    }
  }
`;

const ENABLE_MFA = `
  mutation EnableMfa($code: String!) {
    enableMfa(code: $code) {
      success
      recoveryCodes
    }
  }
`;

const DISABLE_MFA = `
  mutation DisableMfa($code: String!) {
    disableMfa(code: $code)
  }
`;

const { executeMutation: generateSecret } = useMutation(GENERATE_MFA_SECRET);
const { executeMutation: enableMfa } = useMutation(ENABLE_MFA);
const { executeMutation: disableMfa } = useMutation(DISABLE_MFA);

const showSetup = ref(false);
const setupData = ref<{ secret: string; qrCodeDataUrl: string } | null>(null);
const verificationCode = ref('');
const error = ref('');
const loading = ref(false);
const recoveryCodes = ref<string[]>([]);
const showRecoveryCodes = ref(false);
const showDisableInput = ref(false);
const disableCode = ref('');

const startSetup = async () => {
  loading.value = true;
  error.value = '';
  const result = await generateSecret({});
  if (result.data?.generateMfaSecret) {
    setupData.value = result.data.generateMfaSecret;
    showSetup.value = true;
  } else {
    error.value = 'Failed to generate MFA secret';
  }
  loading.value = false;
};

const handleEnable = async () => {
  if (!verificationCode.value) return;
  loading.value = true;
  error.value = '';
  const result = await enableMfa({ code: verificationCode.value });
  if (result.data?.enableMfa?.success) {
    recoveryCodes.value = result.data.enableMfa.recoveryCodes || [];
    showRecoveryCodes.value = true;
    showSetup.value = false;
    setupData.value = null;
    verificationCode.value = '';
    emit('updated');
  } else {
    error.value = 'Invalid code. Please try again.';
  }
  loading.value = false;
};

const handleDisable = async () => {
  if (!disableCode.value) return;

  loading.value = true;
  error.value = '';
  const result = await disableMfa({ code: disableCode.value });
  if (result.data?.disableMfa) {
    showDisableInput.value = false;
    disableCode.value = '';
    emit('updated');
  } else {
    error.value = 'Failed to disable MFA. Invalid code.';
  }
  loading.value = false;
};

const cancelSetup = () => {
  showSetup.value = false;
  setupData.value = null;
  verificationCode.value = '';
  error.value = '';
};
</script>

<template>
  <div class="mfa-settings glass-panel">
    <h3>Two-Factor Authentication (MFA)</h3>
    <p class="description">
      Add an extra layer of security to your account by requiring a code from an authenticator app.
    </p>

    <div v-if="!mfaEnabled && !showSetup" class="mfa-status-off">
      <div class="status-badge off">Disabled</div>
      <button @click="startSetup" class="btn-primary" :disabled="loading">
        {{ loading ? 'Starting...' : 'Enable MFA' }}
      </button>
    </div>

    <div v-else-if="mfaEnabled && !showSetup" class="mfa-status-on">
      <div v-if="!showDisableInput" class="on-controls">
        <div class="status-badge on">Enabled</div>
        <button @click="showDisableInput = true" class="btn-danger-outline" :disabled="loading">
          Disable MFA
        </button>
      </div>
      <div v-else class="disable-input animate-fade-in">
        <input
          v-model="disableCode"
          type="text"
          placeholder="Enter MFA code to disable"
          maxlength="6"
          @keyup.enter="handleDisable"
        />
        <div class="disable-actions">
          <button @click="handleDisable" class="btn-danger" :disabled="loading || disableCode.length !== 6">
            Confirm Disable
          </button>
          <button @click="showDisableInput = false" class="btn-secondary">Cancel</button>
        </div>
        <p v-if="error" class="error-text">{{ error }}</p>
      </div>
    </div>

    <div v-if="showSetup" class="mfa-setup animate-fade-in">
      <h4>Set up Authenticator App</h4>
      <p>1. Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)</p>

      <div class="qr-container">
        <img v-if="setupData" :src="setupData.qrCodeDataUrl" alt="MFA QR Code" />
        <div class="secret-key" v-if="setupData">
          <span>Manual key:</span>
          <code>{{ setupData.secret }}</code>
        </div>
      </div>

      <p>2. Enter the 6-digit code from your app to verify</p>
      <div class="verification-input group">
        <input
          v-model="verificationCode"
          type="text"
          placeholder="000000"
          maxlength="6"
          @keyup.enter="handleEnable"
        />
        <button @click="handleEnable" class="btn-primary" :disabled="loading || verificationCode.length !== 6">
          Verify & Enable
        </button>
      </div>

      <p v-if="error" class="error-text">{{ error }}</p>
      <button @click="cancelSetup" class="btn-secondary full-width">Cancel</button>
    </div>

    <!-- Recovery Codes Modal -->
    <div v-if="showRecoveryCodes" class="recovery-codes-modal animate-fade-in">
      <div class="modal-content glass-panel">
        <h4>Save your recovery codes</h4>
        <p>If you lose your device, you can use these codes to log in to your account. Store them in a safe place.</p>
        <div class="codes-grid">
          <code v-for="code in recoveryCodes" :key="code">{{ code }}</code>
        </div>
        <button @click="showRecoveryCodes = false" class="btn-primary full-width">I've saved them</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mfa-settings {
  padding: 1.5rem;
  margin-bottom: 2rem;
}

h3 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.mfa-status-off, .mfa-status-on {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.off {
  background: rgba(148, 163, 184, 0.1);
  color: var(--text-secondary);
}

.status-badge.on {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.mfa-setup {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-border);
}

h4 {
  margin-bottom: 1rem;
}

.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  padding: 1rem;
  background: white;
  border-radius: 12px;
}

.qr-container img {
  width: 200px;
  height: 200px;
}

.secret-key {
  color: #0f172a;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.secret-key code {
  font-weight: 700;
  letter-spacing: 0.1em;
  font-family: monospace;
}

.verification-input.group {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

.btn-danger-outline {
  background: transparent;
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-danger-outline:hover {
  background: var(--danger-color);
  color: white;
}

.on-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.disable-input {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.disable-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-danger {
  background: var(--danger-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}

.error-text {
  color: var(--danger-color);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.full-width {
  width: 100%;
}

.recovery-codes-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.recovery-codes-modal .modal-content {
  max-width: 400px;
  width: 100%;
  padding: 2rem;
  text-align: center;
}

.codes-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin: 1.5rem 0;
  text-align: left;
}

.codes-grid code {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.9rem;
  text-align: center;
}
</style>
