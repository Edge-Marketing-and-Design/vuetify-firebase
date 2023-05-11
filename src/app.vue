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
</script>

<template>
  <v-app>
    <top-menu v-if="edgeFirebase.user.loggedIn" />
    <side-menu v-if="edgeFirebase.user.loggedIn" />
    <v-main>
      <NuxtPage />
    </v-main>
    <bottom-menu v-if="edgeFirebase.user.loggedIn" />
  </v-app>
</template>

<style lang="scss">
.firebase-emulator-warning { display: none; }
</style>
