<script setup>
import { inject } from 'vue'

const edgeFirebase = inject('edgeFirebase')
</script>

<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>Organization(s)</ion-label>
    </ion-item-divider>
    <ion-item v-for="org in edgeState.organizations" :key="org.docId" :value="org.docId" :class="org.docId === edgeState.currentOrganization ? 'selected-org' : ''" class="route" @click="setOrganization(org.docId, edgeFirebase)">
      <ion-label class="my-0">
        {{ edgeFirebase.data[`organizations/${org.docId}`].name }}
      </ion-label>
      <ion-icon
        v-if="org.docId === edgeState.currentOrganization"
        slot="end"
        :icon="ioniconsCheckmark"
        class="selected-org my-0"
        aria-hidden="true"
      />
    </ion-item>
  </ion-item-group>
  <!-- <v-list :lines="false" density="compact" nav>
    <v-list-subheader>Organization(s)</v-list-subheader>
    <v-list-item v-for="org in edgeState.organizations" :key="org.docId" :value="org.docId" @click="setOrganization(org.docId, edgeFirebase)">
      <v-list-item-title>{{ edgeFirebase.data[`organizations/${org.docId}`].name }} <v-icon v-if="org.docId === edgeState.currentOrganization" class="ml-2" icon="mdi-check" /></v-list-item-title>
    </v-list-item>
  </v-list> -->
</template>

<style lang="scss" scoped>
ion-item {
 font-size: small;
 font-weight: 200;
}

.selected-org {
  font-weight: 700;
}
.route {
  --min-height: 32px !important;
  cursor: pointer;
}
</style>
