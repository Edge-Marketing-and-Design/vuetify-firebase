<script setup>
const edgeFirebase = inject('edgeFirebase')
const state = reactive({
  name: '',
  form: false,
  loaded: true,
})
const onSubmit = async (event) => {
  const results = await event
  if (results.valid) {
    edgeFirebase.setUserMeta({ name: state.name })
    edgeState.changeTracker = {}
    state.loaded = false
    await nextTick()
    state.loaded = true
  }
}

const currentName = computed(() => {
  return edgeFirebase.user.meta.name
})

onBeforeMount(() => {
  state.name = currentName.value
})
watch(currentName, async () => {
  state.name = currentName.value
  edgeState.changeTracker = {}
  state.loaded = false
  await nextTick()
  state.loaded = true
})
</script>

<template>
  <v-card v-if="state.loaded" variant="flat">
    <v-form
      v-model="state.form"
      validate-on="submit"
      @submit.prevent="onSubmit"
    >
      <v-card-title class="mb-3">
        <span class="headline">My Profile</span>
      </v-card-title>
      <v-card-text>
        <g-input
          v-model="state.name"
          field-type="text"
          :rules="[edgeRules.required]"
          label="Name"
          parent-tracker-id="org-settings"
          hint="Your name, shown in the user interface."
          persistent-hint
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          type="submit"
          color="secondary"
          variant="text"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<style lang="scss" scoped>

</style>
