<script setup>
import { useTheme } from 'vuetify'

const vueTheme = useTheme()
const changeTheme = (theme) => {
  vueTheme.global.name.value = theme
}
const edgeFirebase = inject('edgeFirebase')
const edgeGlobal = inject('edgeGlobal')
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
