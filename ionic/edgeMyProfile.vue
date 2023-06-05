<script setup>
import { computed, defineProps, inject, onBeforeMount, reactive, watch } from 'vue'
import { dupObject } from '../global'
import { resetValidation, validate, validateFields } from './fieldValidator'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  metaFields: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})
const edgeFirebase = inject('edgeFirebase')
const state = reactive({
  loaded: true,
  loading: false,
  meta: {},
  error: { success: true, message: '' },
})

const update = async () => {
  state.error = { success: false, message: '' }
  if (validateFields(state.meta, props.metaFields)) {
    state.error = await edgeFirebase.setUserMeta(state.meta)
    if (state.error.success) {
      state.error.message = 'Profile updated'
      resetValidation()
    }
  }
}
const userMeta = computed(() => {
  return edgeFirebase.user.meta
})
onBeforeMount(() => {
  state.meta = dupObject(userMeta.value)
})
watch(userMeta, async () => {
  state.meta = dupObject(userMeta.value)
})
</script>

<template>
  <ion-card v-if="state.loaded" class="shadow-none border-none pa-4 mt-8 ">
    <ion-card-header v-if="props.title" class="my-0 py-0">
      <span class="text-md font-semibold mb-4">
        {{ props.title }}
      </span>
    </ion-card-header>
    <ion-input
      v-for="(value, key) in props.metaFields"
      :key="key"
      v-model="state.meta[key]"
      fill="outline"
      :label="value.pretty"
      :type="value.type"
      class="ion-touched"
      :class="validate.class[key]"
      label-placement="floating"
      :error-text="validate.message[key]"
    />
    <edge-error :success="state.error.success" :error="state.error.message" />
    <ion-button fill="solid" expand="block" @click="update">
      Update Profile
    </ion-button>
  </ion-card>
</template>

<style lang="scss" scoped>

</style>
