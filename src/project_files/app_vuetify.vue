<script setup>
import { useTheme } from 'vuetify'

const vueTheme = useTheme()
const changeTheme = (theme) => {
  vueTheme.global.name.value = theme
}
onMounted(() => {
  if (isDarkMode()) {
    changeTheme('dark')
  }
  else {
    changeTheme('light')
  }
})
const edgeFirebase = inject('edgeFirebase')
edgeState.userRoles = [
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
      {
        collectionPath: 'organizationDocPath-sites',
        role: 'editor',
      },
      {
        collectionPath: 'organizationDocPath-log',
        role: 'user',
      },
      {
        collectionPath: 'organizationDocPath-apiKeys',
        role: 'editor',
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
