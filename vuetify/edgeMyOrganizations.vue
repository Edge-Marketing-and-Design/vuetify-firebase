<script setup>
import { computed, defineProps, inject, reactive, watch } from 'vue'
import { edgeState, getOrganizations } from '..global'

const props = defineProps({
  registrationCode: {
    type: String,
    default: '',
  },
})

const edgeFirebase = inject('edgeFirebase')

const state = reactive({
  loaded: true,
})

const roles = computed(() => {
  return edgeFirebase.user.roles
})

watch(roles, async () => {
  await getOrganizations(edgeFirebase)
  state.loaded = false
  await nextTick()
  state.loaded = true
})
</script>

<template>
  <div>
    <g-input
      v-if="state.loaded"
      v-model="edgeState.organizations"
      :disable-tracking="true"
      field-type="objectList"
      sub-field-type="myOrgs"
      label="My Organizations"
      parent-tracker-id="myOrgs"
      helper="<p>Organizations</p>"
      :pass-through-props="props.registrationCode"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
