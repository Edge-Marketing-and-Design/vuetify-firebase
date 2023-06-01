<script setup>
import { inject } from 'vue'
import { edgeState, setOrganization } from '..global'

const edgeFirebase = inject('edgeFirebase')
</script>

<template>
  <v-list :lines="false" density="compact" nav>
    <v-list-subheader>Organization(s)</v-list-subheader>
    <v-list-item v-for="org in edgeState.organizations" :key="org.docId" :value="org.docId" @click="setOrganization(org.docId, edgeFirebase)">
      <v-list-item-title>{{ edgeFirebase.data[`organizations/${org.docId}`].name }} <v-icon v-if="org.docId === edgeState.currentOrganization" class="ml-2" icon="mdi-check" /></v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<style lang="scss" scoped>

</style>
