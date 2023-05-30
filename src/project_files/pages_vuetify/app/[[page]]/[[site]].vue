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
    <account v-if="page === 'account'" />
  </v-container>
</template>
