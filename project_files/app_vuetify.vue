<script setup>
import { useTheme } from 'vuetify'

const vueTheme = useTheme()
const changeTheme = (theme) => {
  vueTheme.global.name.value = theme
}
const edgeFirebase = inject('edgeFirebase')
const edgeGlobal = inject('edgeGlobal')

const currentOrganization = computed(() => {
  return edgeGlobal.edgeState.currentOrganization
})

watch(currentOrganization, async () => {
  if (currentOrganization.value) {
    // RUN STUFF HERE WHEN ORGANIZATION CHANGES LIKE SNAPSHOTS
    projectSetOrg(currentOrganization.value, edgeFirebase)
  }
  if (!currentOrganization.value) {
    const auth = useState('auth')
    auth.value = ''
    const router = useRouter()
    router.push('/app/login')
  }
})

const user = computed(() => {
  return edgeFirebase.user
})

watch (user, async () => {
  if (user.value) {
    const auth = useState('auth')
    auth.value = user.value
  }
})

onMounted(() => {
  if (isDarkMode()) {
    changeTheme('dark')
  }
  else {
    changeTheme('light')
  }
})
edgeFirebase.runFunction('initFirestore', {})
edgeGlobal.edgeState.userRoles = [
  {
    name: 'Admin',
    roles: [
      {
        collectionPath: 'organizationDocPath',
        role: 'admin',
      },
    ],
  },
  {
    name: 'User',
    roles: [
      {
        collectionPath: 'organizationDocPath',
        role: 'user',
      },
    ],
  },
]
</script>

<template>
  <v-app>
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<style lang="scss">
.firebase-emulator-warning { display: none; }
</style>
