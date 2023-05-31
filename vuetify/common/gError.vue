<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  error: {
    type: String,
    default: '',
  },
})

const firebaseErrorMap = {
  'auth/invalid-email': 'Oops! That doesn\'t look like a valid email address.',
  'auth/user-disabled': 'Oh no! This user account is currently disabled.',
  'auth/user-not-found': 'Hmm, we couldn\'t find a user with that email.',
  'auth/wrong-password': 'Whoops! That password doesn\'t seem to be correct.',
  'auth/email-already-in-use': 'It looks like someone else is already using that email address!',
  'auth/weak-password': 'Your password should be stronger! Try adding more characters or symbols.',
  'auth/operation-not-allowed': 'Sorry, this operation is not allowed.',
  'auth/account-exists-with-different-credential': 'This account already exists, but with different credentials.',
  'auth/credential-already-in-use': 'These credentials are already being used by someone else.',
  'auth/user-token-expired': 'Your session has expired. Please log in again.',
  'auth/network-request-failed': 'Oops, we couldn\'t connect to the server. Check your internet connection.',
  'storage/object-not-found': 'Oh dear, we couldn\'t find the file you\'re looking for.',
  'storage/bucket-not-found': 'We couldn\'t find the storage bucket you\'re looking for.',
  'storage/project-not-found': 'Hmm, we couldn\'t find the project you\'re looking for.',
  'storage/quota-exceeded': 'You\'ve reached your storage limit! Please try again later.',
  'storage/unauthorized': 'Hold on! You don\'t have permission to access this resource.',
  'storage/canceled': 'The upload was canceled.',
  'storage/invalid-checksum': 'The file seems to be corrupted. Please try again.',
  'firestore/permission-denied': 'You don\'t have permission to access this data.',
  'firestore/unavailable': 'Our Firestore service is taking a break. Please try again later.',
  'firestore/internal': 'Something went wrong on our end. We\'ll look into it!',
  'firestore/invalid-argument': 'You provided an invalid argument. Please double-check!',
  'firestore/cancelled': 'Operation cancelled. No worries!',
  // ... Add more error codes as needed
}

const getReadableFirebaseError = (errorCode) => {
  let code = ''

  if (typeof errorCode === 'string') {
    code = errorCode
  }
  else if (errorCode instanceof Error) {
    const match = errorCode.message.match(/[a-z]+\/[a-z-]+/)
    code = match ? match[0] : ''
  }

  if (!code) {
    console.log('Invalid error code:', errorCode)
    return 'An invalid error code was received. Please try again later.'
  }

  const errorKeys = Object.keys(firebaseErrorMap)
  let readableError = ''

  for (const key of errorKeys) {
    if (code.startsWith(key)) {
      readableError = firebaseErrorMap[key]
      break
    }
  }

  if (readableError) {
    return readableError
  }
  else {
    console.log('Unknown Firebase error:', errorCode)
    return errorCode
  }
}
</script>

<template>
  <v-alert color="error" class="mt-0 mb-3 text-caption" density="compact" closable variant="tonal" border="start">
    {{ getReadableFirebaseError(props.error) }}
  </v-alert>
</template>

<style scoped>

</style>
