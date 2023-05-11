<script setup>
const edgeFirebase = inject('edgeFirebase')
const state = reactive({
  org: '',
  form: false,
  loaded: true,
})
const onSubmit = async (event) => {
  const results = await event
  if (results.valid) {
    edgeFirebase.changeDoc('organizations', edgeState.currentOrganization, { name: state.org })
    // getOrganizations(edgeFirebase)
    edgeState.changeTracker = {}
    state.loaded = false
    await nextTick()
    state.loaded = true
  }
}
const currentOrgName = computed(() => {
  if (objHas(edgeFirebase.data, edgeState.organizationDocPath) === false) {
    return ''
  }
  return edgeFirebase.data[edgeState.organizationDocPath].name
})
onBeforeMount(() => {
  state.org = currentOrgName.value
})
watch(currentOrgName, async () => {
  state.org = currentOrgName.value
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
        <span class="headline">Organization Settings</span>
      </v-card-title>
      <v-card-text>
        <g-input
          v-model="state.org"
          field-type="text"
          :rules="[edgeRules.required]"
          label="Organization Name"
          parent-tracker-id="org-settings"
          hint="A label for your organization, shown in the user interface."
          persistent-hint
        />
        <v-text-field
          v-model="edgeState.currentOrganization"
          class="mt-5"
          variant="underlined"
          label="Organization ID"
          readonly
          hint="Identifier for this organization used as part of your form endpoint addresses."
          persistent-hint
        >
          <template #prepend-inner>
            <clipboard-button size="small" :text="edgeState.currentOrganization" />
          </template>
        </v-text-field>
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
