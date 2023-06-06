<script setup>
import { inject } from 'vue'
import { IonIcon } from '@ionic/vue'
import { checkmark } from 'ionicons/icons'

const edgeGlobal = inject('edgeGlobal')
const edgeFirebase = inject('edgeFirebase')
</script>

<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>Organization(s)</ion-label>
    </ion-item-divider>
    <ion-item v-for="org in edgeGlobal.edgeState.organizations" :key="org.docId" :value="org.docId" :class="org.docId === edgeGlobal.edgeState.currentOrganization ? 'selected-org' : ''" class="route" @click="edgeGlobal.setOrganization(org.docId, edgeFirebase)">
      <ion-label class="my-0">
        {{ edgeFirebase.data[`organizations/${org.docId}`].name }}
      </ion-label>
      <IonIcon
        v-if="org.docId === edgeGlobal.edgeState.currentOrganization"
        slot="end"
        :icon="checkmark"
        class="selected-org my-0"
        aria-hidden="true"
      />
    </ion-item>
  </ion-item-group>
  <!-- <v-list :lines="false" density="compact" nav>
    <v-list-subheader>Organization(s)</v-list-subheader>
    <v-list-item v-for="org in edgeGlobal.edgeState.organizations" :key="org.docId" :value="org.docId" @click="edgeGlobal.setOrganization(org.docId, edgeFirebase)">
      <v-list-item-title>{{ edgeFirebase.data[`organizations/${org.docId}`].name }} <v-icon v-if="org.docId === edgeGlobal.edgeState.currentOrganization" class="ml-2" icon="mdi-check" /></v-list-item-title>
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
