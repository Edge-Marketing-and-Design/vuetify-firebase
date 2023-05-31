<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  orgFields: {
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
  title: '',
})

const update = async () => {
  state.error = { success: false, message: '' }
  if (validateFields(state.meta, props.orgFields)) {
    state.error = await edgeFirebase.changeDoc('organizations', edgeState.currentOrganization, state.meta)
    if (state.error.success) {
      state.error.message = 'Profile updated'
      resetValidation()
    }
  }
}
const orgMeta = computed(() => {
  return edgeFirebase.data[`organizations/${edgeState.currentOrganization}`]
})

onBeforeMount(() => {
  state.meta = dupObject(orgMeta.value)
  if (!props.title) {
    state.title = `${orgMeta.value.name} Settings`
  }
  else {
    state.title = props.title
  }
})
watch(orgMeta, async () => {
  state.meta = dupObject(orgMeta.value)
  if (!props.title) {
    state.title = `${orgMeta.value.name} Settings`
  }
  else {
    state.title = props.title
  }
})
</script>

<template>
  <ion-card v-if="state.loaded" class="shadow-none border-none pa-4 mt-8 ">
    <ion-card-header v-if="state.title" class="my-0 py-0">
      <span class="text-md font-semibold mb-4">
        {{ state.title }}
      </span>
    </ion-card-header>
    <ion-input
      v-for="(value, key) in props.orgFields"
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
      Update Organization
    </ion-button>
  </ion-card>
</template>

<style lang="scss" scoped>

</style>
