<script setup>
import { defineProps, inject, onBeforeMount, watch } from 'vue'

import login from './auth/login.vue'
import register from './auth/register.vue'
const props = defineProps({
  type: {
    type: String,
    default: 'login',
  },
  registrationCode: {
    type: String,
    default: '',
  },
  providers: {
    type: Array,
    default: () => ['email', 'phone', 'microsoft'],
  },
  title: {
    type: String,
    default: 'Organization',
  },
  joinMessage: {
    type: String,
    default: 'Join an existing organization',
  },
})

const emit = defineEmits(['update:auth'])

const edgeFirebase = inject('edgeFirebase')
const edgeGlobal = inject('edgeGlobal')

const doLogin = async () => {
  edgeGlobal.edgeState.user = edgeFirebase.user
  emit('update:auth', edgeFirebase.user)
  if (edgeFirebase.user.loggedIn) {
    await edgeGlobal.getOrganizations(edgeFirebase)
    const storedOrganization = localStorage.getItem('organizationID')
    if (storedOrganization && edgeGlobal.edgeState.organizations.some(org => org.docId === storedOrganization)) {
      await edgeGlobal.setOrganization(storedOrganization, edgeFirebase)
    }
    else if (edgeGlobal.edgeState.currentOrganization) {
      await edgeGlobal.setOrganization(edgeGlobal.edgeState.currentOrganization, edgeFirebase)
    }
    else if (edgeGlobal.edgeState.organizations.length > 0) {
      await edgeGlobal.setOrganization(edgeGlobal.edgeState.organizations[0].docId, edgeFirebase)
    }
  }
}
onBeforeMount(() => {
  doLogin()
})
watch(edgeFirebase.user, async () => {
  doLogin()
})
</script>

<template>
  <login
    v-if="props.type === 'login'"
    :providers="props.providers"
  />
  <register
    v-else-if="props.type === 'register'"
    :registration-code="props.registrationCode"
    :title="props.title"
    :join-message="props.joinMessage"
    :providers="props.providers"
  />
</template>

<style lang="scss" scoped>

</style>
