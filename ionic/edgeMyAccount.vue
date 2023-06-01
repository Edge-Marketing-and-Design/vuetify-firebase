<script setup>
import { computed, defineProps, inject, onBeforeMount, reactive, watch } from 'vue'
import { edgeState } from '../global'
import { resetValidation, validate, validateFields } from './fieldValidator'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
})
const edgeFirebase = inject('edgeFirebase')
const state = reactive({
  loaded: true,
  loading: false,
  username: '',
  oldPassword: '',
  newPassword: '',
  userError: { success: true, message: '' },
  passwordError: { success: true, message: '' },
})

const updateUser = async () => {
  state.userError = { success: false, message: '' }
  if (validateFields({ username: state.username }, { username: { type: 'email', required: true, pretty: 'Email' } })) {
    state.userError = await edgeFirebase.updateEmail(state.username)
    state.userError.message = `${state.userError.message} ${state.username}`
    if (state.userError.success) {
      resetValidation()
    }
  }
}
const updatePassword = async () => {
  state.passwordError = { success: false, message: '' }
  if (validateFields({ oldPassword: state.oldPassword, newPassword: state.newPassword }, {
    oldPassword: { type: 'string', required: true, pretty: 'Old Password' },
    newPassword: { type: 'password', required: true, pretty: 'New Password' },
  })) {
    state.passwordError = await edgeFirebase.setPassword(state.oldPassword, state.newPassword)
    if (state.passwordError.success) {
      state.passwordError.message = 'Password updated'
      resetValidation()
    }
  }
}
const currentOrgName = computed(() => {
  if (objHas(edgeFirebase.data, edgeState.organizationDocPath) === false) {
    return ''
  }
  return edgeFirebase.data[edgeState.organizationDocPath].name
})
onBeforeMount(() => {
  state.username = edgeFirebase.user.firebaseUser.providerData[0].email
})
watch(currentOrgName, async () => {
  state.org = currentOrgName.value
})
</script>

<template>
  <ion-card v-if="state.loaded" class="shadow-none border-none pa-4 mt-8 ">
    <template v-if="edgeFirebase.user.firebaseUser.providerData[0].providerId === 'password'">
      <ion-card-header v-if="props.title" class="my-0 py-0">
        <span class="text-md font-semibold mb-4">
          {{ props.title }}
        </span>
      </ion-card-header>
      <div class="relative flex pb-5 pt-0 items-center">
        <div class="flex-grow border-t" />
        <span class="flex-shrink mx-4">Change Email</span>
        <div class="flex-grow border-t" />
      </div>

      <ion-input
        v-model="state.username"
        label="Email"
        type="email"
        class="ion-touched"
        fill="outline"
        :class="validate.class.username"
        label-placement="floating"
        :error-text="validate.message.username"
      />
      <edge-error :success="state.userError.success" :error="state.userError.message" />
      <ion-button fill="solid" expand="block" @click="updateUser">
        Update Email
      </ion-button>
      <hr class="my-4">

      <div class="relative flex py-5 items-center">
        <div class="flex-grow border-t" />
        <span class="flex-shrink mx-4">Change Password</span>
        <div class="flex-grow border-t" />
      </div>

      <ion-input
        v-model="state.oldPassword"
        label="Old Password"
        type="password"
        class="ion-touched mb-4"
        fill="outline"
        data-lpignore="true"
        :class="validate.class.oldPassword"
        label-placement="floating"
        :error-text="validate.message.oldPassword"
      />
      <ion-input
        v-model="state.newPassword"
        label="New Password"
        type="password"
        class="ion-touched"
        fill="outline"
        :class="validate.class.newPassword"
        label-placement="floating"
        :error-text="validate.message.newPassword"
      />
      <edge-error :success="state.passwordError.success" :error="state.passwordError.message" />
      <ion-button fill="solid" expand="block" @click="updatePassword">
        Update Password
      </ion-button>
    </template>
    <template v-else>
      <ion-card-header>
        <ion-card-title>Logged in as:</ion-card-title>
        <ion-card-subtitle>{{ edgeFirebase.user.firebaseUser.providerData[0].email }}</ion-card-subtitle>
      </ion-card-header>

      <ion-card-content>
        <strong>Provider: {{ edgeFirebase.user.firebaseUser.providerData[0].providerId }}</strong>
        <hr class="my-4">
        Notice: You're signed in with a third-party provider. To update your login information, please visit your provider's account settings. Changes cannot be made directly within this app.
      </ion-card-content>
    </template>
  </ion-card>
</template>

<style lang="scss" scoped>

</style>
