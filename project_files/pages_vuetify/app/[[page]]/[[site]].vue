<script setup>
const route = useRoute()

const page = computed(() => {
  return route.params.page
})
const site = computed(() => {
  return route.params.site
})

definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <v-container
    class="py-8 px-6"
    fluid
  >
    <site-editor v-if="site && page === 'dashboard'" :site-doc-id="site" />
    <site-logs v-else-if="site && page === 'logs'" :site-doc-id="site" />
    <dashboard v-else-if="page === 'dashboard'" />
    <account v-else-if="page === 'account'" />
    <logs v-else-if="page === 'logs'" />
  </v-container>
</template>
