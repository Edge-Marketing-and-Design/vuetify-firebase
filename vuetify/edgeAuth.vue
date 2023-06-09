<script setup>
import { defineProps, inject, watch } from 'vue'
import { useRouter } from 'vue-router'

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
    default: () => ['email', 'microsoft'],
  },
})

const edgeFirebase = inject('edgeFirebase')
const edgeGlobal = inject('edgeGlobal')

const router = useRouter()

watch(edgeFirebase.user, async () => {
  edgeGlobal.edgeState.user = edgeFirebase.user
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

    const cleanedRoute = edgeGlobal.edgeState.preLoginRoute.endsWith('/') ? edgeGlobal.edgeState.preLoginRoute.slice(0, -1) : edgeGlobal.edgeState.preLoginRoute

    if (cleanedRoute === ''
    || cleanedRoute === '/app'
    || cleanedRoute === '/app/login'
    || cleanedRoute === '/app/signup') {
      router.push('/app/dashboard')
    }
    else {
      router.push(edgeGlobal.edgeState.preLoginRoute)
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
