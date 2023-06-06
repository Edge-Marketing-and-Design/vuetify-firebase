<script setup>
import { IonIcon } from '@ionic/vue'
import { checkmarkCircle, clipboardOutline } from 'ionicons/icons'
import { defineProps, reactive } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  iconOnly: {
    type: Boolean,
    default: false,
  },
})
const state = reactive({
  buttonIcon: clipboardOutline,
})
const copyToClipboard = async (text) => {
  await navigator.clipboard.writeText(text)
  state.buttonIcon = checkmarkCircle
  setTimeout(() => {
    state.buttonIcon = clipboardOutline
  }, 3000)
}
</script>

<template>
  <IonIcon v-if="iconOnly" size="small" :icon="state.buttonIcon" @click.stop="copyToClipboard(props.text)" />
  <ion-button v-else size="small" fill="clear" @click.stop="copyToClipboard(props.text)">
    <IonIcon :icon="state.buttonIcon" />
    <span class="ml-2">Copy</span>
  </ion-button>
</template>

<style lang="scss" scoped>
.icon-small {
  cursor: pointer;
}
</style>
