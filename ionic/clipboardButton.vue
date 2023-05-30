<script setup>
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
  buttonIcon: ioniconsClipboardOutline,
})
const copyToClipboard = async (text) => {
  await navigator.clipboard.writeText(text)
  state.buttonIcon = ioniconsCheckmarkCircle
  setTimeout(() => {
    state.buttonIcon = ioniconsClipboardOutline
  }, 3000)
}
</script>

<template>
  <ion-icon v-if="iconOnly" size="small" :icon="state.buttonIcon" @click.stop="copyToClipboard(props.text)" />
  <ion-button v-else size="small" fill="clear" @click.stop="copyToClipboard(props.text)">
    <ion-icon :icon="state.buttonIcon" />
    <span class="ml-2">Copy</span>
  </ion-button>
</template>

<style lang="scss" scoped>
.icon-small {
  cursor: pointer;
}
</style>
