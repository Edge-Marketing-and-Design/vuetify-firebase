<script setup>
import { defineProps, inject, watch } from 'vue'
import { useRouter } from 'vue-router'

import login from './auth/login.vue'
import register from './auth/register.vue'
import { edgeState, getOrganizations, setOrganization } from '..global'

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
    default: () => ['email', 'microsoft'],
  },
})

const edgeFirebase = inject('edgeFirebase')
const router = useRouter()

watch(edgeFirebase.user, async () => {
  edgeState.user = edgeFirebase.user
  if (edgeFirebase.user.loggedIn) {
    await getOrganizations(edgeFirebase)
    const storedOrganization = localStorage.getItem('organizationID')
    if (storedOrganization && edgeState.organizations.some(org => org.docId === storedOrganization)) {
      await setOrganization(storedOrganization, edgeFirebase)
    }
    else if (edgeState.currentOrganization) {
      await setOrganization(edgeState.currentOrganization, edgeFirebase)
    }
    else if (edgeState.organizations.length > 0) {
      await setOrganization(edgeState.organizations[0].docId, edgeFirebase)
    }

    const cleanedRoute = edgeState.preLoginRoute.endsWith('/') ? edgeState.preLoginRoute.slice(0, -1) : edgeState.preLoginRoute

    if (cleanedRoute === ''
    || cleanedRoute === '/app'
    || cleanedRoute === '/app/login'
    || cleanedRoute === '/app/signup') {
      router.push('/app/dashboard')
    }
    else {
      router.push(edgeState.preLoginRoute)
    }
  }
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
    :providers="props.providers"
  />
</template>

<style lang="scss" scoped>

</style>
