<script setup>
const props = defineProps({
  error: {
    type: String,
    default: '',
  },
  success: {
    type: Boolean,
    default: false,
  },
})
const state = reactive({
  error: false,
})
const firebaseErrorMap = {
  'auth/invalid-email': {
    header: 'Invalid Email',
    subheader: 'Oops! That doesn\'t look like a valid email address.',
    message: 'Please double-check your email address and make sure it\'s formatted correctly. We all make typos sometimes!',
  },
  'auth/user-disabled': {
    header: 'User Disabled',
    subheader: 'Oh no! This user account is currently disabled.',
    message: 'Unfortunately, this account has been disabled. If you believe this is an error, please contact our support team for assistance.',
  },
  'auth/user-not-found': {
    header: 'User Not Found',
    subheader: 'Hmm, we couldn\'t find a user with that email.',
    message: 'It seems there is no user associated with that email address. Double-check the email you entered or consider creating a new account!',
  },
  'auth/wrong-password': {
    header: 'Wrong Password',
    subheader: 'Whoops! That password doesn\'t seem to be correct.',
    message: 'Make sure you\'ve entered the right password. Remember, passwords are case-sensitive. If you\'ve forgotten it, don\'t worry, you can always reset it!',
  },
  'auth/email-already-in-use': {
    header: 'Email Already In Use',
    subheader: 'It looks like someone else is already using that email address!',
    message: 'This email is already linked to an existing account. If that account is yours, try logging in. If not, consider using a different email.',
  },
  'auth/weak-password': {
    header: 'Weak Password',
    subheader: 'Your password should be stronger! Try adding more characters or symbols.',
    message: 'To keep your account secure, choose a password with a mix of upper and lowercase letters, numbers, and special characters. Get creative!',
  },
  'auth/operation-not-allowed': {
    header: 'Operation Not Allowed',
    subheader: 'Sorry, this operation is not allowed.',
    message: 'This action is currently not permitted. If you think this is an error, please reach out to our support team for help.',
  },
  'auth/account-exists-with-different-credential': {
    header: 'Account Exists',
    subheader: 'This account already exists, but with different credentials.',
    message: 'It looks like you\'ve previously signed up using a different method. Try logging in with your original credentials or contact our support team if you need assistance.',
  },
  'auth/credential-already-in-use': {
    header: 'Credential In Use',
    subheader: 'These credentials are already being used by someone else.',
    message: 'Oops! It seems another user is already using these credentials. Make sure you\'re using the correct login information for your account.',
  },
  'auth/user-token-expired': {
    header: 'Session Expired',
    subheader: 'Your session has expired. Please log in again.',
    message: 'For security reasons, we logged you out after a period of inactivity. Please log back in to continue where you left off!',
  },
  'auth/network-request-failed': {
    header: 'Connection Error',
    subheader: 'Oops, we couldn\'t connect to the server. Check your internet connection.',
    message: 'It looks like you might be having some connectivity issues. Make sure your internet connection is stable and try again.',
  },
  'storage/object-not-found': {
    header: 'Object Not Found',
    subheader: 'Oh dear, we couldn\'t find the file you\'re looking for.',
    message: 'It seems the file has gone missing! Double-check the file path and make sure it exists. Sometimes, files can be sneaky!',
  },
  'storage/bucket-not-found': {
    header: 'Bucket Not Found',
    subheader: 'We couldn\'t find the storage bucket you\'re looking for.',
    message: 'Our search for the storage bucket came up empty. Verify that the bucket name is correct and that it has been properly created.',
  },
  'storage/project-not-found': {
    header: 'Project Not Found',
    subheader: 'Hmm, we couldn\'t find the project you\'re looking for.',
    message: 'Your project seems to be playing hide-and-seek with us. Make sure you\'ve entered the correct project ID and that it exists on Firebase.',
  },
  'storage/quota-exceeded': {
    header: 'Storage Limit Reached',
    subheader: 'You\'ve reached your storage limit! Please try again later.',
    message: 'Looks like your storage is full to the brim! Consider freeing up some space by deleting unnecessary files or upgrading your storage plan.',
  },
  'storage/unauthorized': {
    header: 'Unauthorized Access',
    subheader: 'Hold on! You don\'t have permission to access this resource.',
    message: 'It seems you\'ve ventured into restricted territory. Make sure you have the proper permissions to access this resource, or contact the project owner for help.',
  },
  'storage/canceled': {
    header: 'Upload Canceled',
    subheader: 'The upload was canceled.',
    message: 'Your upload was canceled, but don\'t worry! You can always try again. If you\'re still having trouble, reach out to our support team for assistance.',
  },
  'storage/invalid-checksum': {
    header: 'Corrupted File',
    subheader: 'The file seems to be corrupted. Please try again.',
    message: 'Oh no! Your file appears to be corrupted. Double-check the file and make sure it\'s in good shape before attempting to upload again.',
  },
  'firestore/permission-denied': {
    header: 'Permission Denied',
    subheader: 'You don\'t have permission to access this data.',
    message: 'Access denied! You\'ll need the proper clearance to access this data. Verify your permissions or contact the project owner for help.',
  },
  'firestore/unavailable': {
    header: 'Firestore Unavailable',
    subheader: 'Our Firestore service is taking a break. Please try again later.',
    message: 'Firestore is currently unavailable, but don\'t worry, it\'ll be back soon! Try again later or contact our support team if you need help in the meantime.',
  },
  'firestore/internal': {
    header: 'Internal Error',
    subheader: 'Something went wrong on our end. We\'ll look into it!',
    message: 'We encountered an unexpected hiccup on our end. Hang tight while our team investigates the issue!',
  },
  'firestore/invalid-argument': {
    header: 'Invalid Argument',
    subheader: 'You provided an invalid argument. Please double-check!',
    message: 'It seems you\'ve made a mistake with the argument you provided. Take another look and ensure everything is in order before trying again.',
  },
  'auth/popup-closed-by-user': {
    header: 'Popup Closed',
    subheader: 'Oops! It looks like you closed the popup.',
    message: 'It seems you closed the authentication popup before completing the process. Please try again and make sure to keep the popup open until the process is finished.',
  },
  'User does not exist': {
    header: 'User Not Found',
    subheader: 'Oops! We couldn\'t find the user you\'re looking for.',
    message: 'It looks like this user doesn\'t exist in our system. Please double-check the provided information or create a new user if necessary.',
  },
  'Email updated': {
    header: 'Email Updated',
    subheader: 'Success! Your email has been updated.',
    message: 'Your email address has been successfully updated. You can now use your new email address to log in and manage your account.',
  },
  'Password updated': {
    header: 'Password Updated',
    subheader: 'Success! Your password has been updated.',
    message: 'Your password has been successfully updated. You can now use your new password to log in and manage your account.',
  },
  'Profile updated': {
    header: 'Profile Updated',
    subheader: 'Success! Your profile has been updated.',
    message: 'Your profile information has been successfully updated. You can now view your changes in your account settings.',
  },
  'Registration code not found': {
    header: 'Registration Code Not Found',
    subheader: 'Oops! We couldn\'t find the registration code you provided.',
    message: 'The registration code you entered does not exist in our system. Please double-check the code you received or request a new one if necessary.',
  },
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
    return {
      header: 'Invalid Error Code',
      subheader: 'An invalid error code was received.',
      message: 'Please try again later.',
    }
  }

  const errorKeys = Object.keys(firebaseErrorMap)
  let readableError = ''

  for (const key of errorKeys) {
    if (code.includes(key)) {
      readableError = firebaseErrorMap[key]
      break
    }
  }

  if (readableError) {
    return readableError
  }
  else {
    console.log('Unknown Firebase error:', errorCode)
    return {
      header: 'Unknown Error',
      subheader: 'An unknown error occurred.',
      message: `${errorCode}.`,
    }
  }
}

// turn true or false if props.error is empty or not
watch(() => props.error, (error) => {
  state.error = !!error
  if (props.success) {
    setTimeout(() => {
      state.error = false
    }, 5000)
  }
})
</script>

<template>
  <transition name="fade">
    <ion-card v-if="state.error" class="mx-0" :color="props.success ? 'success' : 'warning'">
      <ion-card-header>
        <ion-card-title>{{ getReadableFirebaseError(props.error).header }}</ion-card-title>
        <ion-card-subtitle>{{ getReadableFirebaseError(props.error).subheader }}</ion-card-subtitle>
      </ion-card-header>

      <ion-card-content>
        {{ getReadableFirebaseError(props.error).message }}
      </ion-card-content>
      <ion-button fill="clear" @click="state.error = false">
        Close
      </ion-button>
    </ion-card>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.0s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
