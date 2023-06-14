<script setup>
import { computed, defineProps, inject, nextTick, onBeforeMount, reactive, watch } from 'vue'

const props = defineProps({
  orgFields: {
    type: Object,
    required: true,
  },
})
const edgeFirebase = inject('edgeFirebase')
const edgeGlobal = inject('edgeGlobal')

const state = reactive({
  data: {},
  org: '',
  form: false,
  loaded: true,
})
const onSubmit = async (event) => {
  const results = await event
  if (results.valid) {
    edgeFirebase.changeDoc('organizations', edgeGlobal.edgeState.currentOrganization, state.data)
    // getOrganizations(edgeFirebase)
    edgeGlobal.edgeState.changeTracker = {}
    state.loaded = false
    await nextTick()
    state.loaded = true
  }
}
const currentOrgData = computed(() => {
  if (edgeGlobal.objHas(edgeFirebase.data, edgeGlobal.edgeState.organizationDocPath) === false) {
    return ''
  }
  return edgeFirebase.data[edgeGlobal.edgeState.organizationDocPath]
})
onBeforeMount(() => {
  state.data = currentOrgData.value
})
watch(currentOrgData, async () => {
  state.org = currentOrgData.value
  edgeGlobal.edgeState.changeTracker = {}
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
          v-for="field in props.orgFields"
          :key="field.field"
          v-model="state.data[field.field]"
          :field-type="field.type"
          :rules="field.rules"
          :label="field.label"
          parent-tracker-id="org-settings"
          :hint="field.hint"
          persistent-hint
        />
        <v-text-field
          v-model="edgeGlobal.edgeState.currentOrganization"
          class="mt-5"
          variant="underlined"
          label="Organization ID"
          readonly
          hint="Identifier for this organization used as part of your form endpoint addresses."
          persistent-hint
        >
          <template #prepend-inner>
            <clipboard-button size="small" :text="edgeGlobal.edgeState.currentOrganization" />
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
