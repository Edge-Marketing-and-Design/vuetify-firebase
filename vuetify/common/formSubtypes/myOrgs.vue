<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: null,
  },
  items: {
    type: Array,
    default: () => [],
  },
})
const config = useRuntimeConfig()
const edgeFirebase = inject('edgeFirebase')
const state = reactive({
  workingItem: {},
  dialog: false,
  form: false,
  currentTitle: '',
  saveButton: 'Add Organization',
  helpers: {
    submits: true,
  },
  deleteDialog: false,
})

const newItem = {
  name: '',
}

const addItem = () => {
  console.log(newItem)
  state.saveButton = 'Add Organization'
  state.workingItem = dupObject(newItem)
  state.workingItem.id = generateShortId()
  state.currentTitle = 'Add Organization'
  state.dialog = true
}

const joinOrg = () => {
  state.saveButton = 'Join Organization'
  state.workingItem = dupObject(newItem)
  state.workingItem.id = generateShortId()
  state.currentTitle = 'Join Organization'
  state.dialog = true
}

const deleteConfirm = (item) => {
  state.currentTitle = item.name
  state.workingItem = dupObject(item)
  state.deleteDialog = true
}

const deleteAction = async () => {
  await edgeFirebase.removeUser(state.workingItem.docId)
  state.deleteDialog = false
  edgeState.changeTracker = {}
}

const closeDialog = () => {
  state.dialog = false
  edgeState.changeTracker = {}
}

const getRole = (org) => {
  const orgPath = `organizations/${org}`
  const role = edgeFirebase.user.roles.find((role) => {
    return role.collectionPath === orgPath.replaceAll('/', '-')
  })
  return role.role.charAt(0).toUpperCase() + role.role.slice(1)
}

const register = reactive({
  registrationCode: config.public.registrationCode,
  dynamicDocumentFieldValue: '',
})

const onSubmit = async (event) => {
  const results = await event
  const registerSend = dupObject(register)
  if (results.valid) {
    if (state.saveButton === 'Add Organization') {
      registerSend.dynamicDocumentFieldValue = state.workingItem.name
    }
    else {
      registerSend.dynamicDocumentFieldValue = ''
      registerSend.registrationCode = state.workingItem.name
    }
    const results = await edgeFirebase.currentUserRegister(registerSend)
    getOrganizations(edgeFirebase)
    console.log(results)
    edgeState.changeTracker = {}
    state.dialog = false
  }
}
</script>

<template>
  <v-btn v-if="props.item === null" size="x-small" class="mr-2" variant="tonal" @click="addItem()">
    Add Organization
  </v-btn>
  <v-btn v-if="props.item === null" size="x-small" variant="tonal" @click="joinOrg()">
    Join Organization
  </v-btn>
  <v-list-item v-else @click="editItem(props.item)">
    <template #prepend>
      <v-avatar class="handle pointer" color="grey-darken-1">
        <v-icon>mdi-account</v-icon>
      </v-avatar>
    </template>

    <v-list-item-title>
      {{ props.item.name }}
    </v-list-item-title>
    <v-list-item-subtitle>
      <v-chip size="small" color="primary">
        {{ getRoleName(edgeFirebase.user.roles, props.item.docId) }}
      </v-chip>
    </v-list-item-subtitle>
    <template #append>
      <v-btn
        color="secondary"
        variant="text"
        @click.stop="deleteConfirm(props.item)"
      >
        Leave
      </v-btn>
    </template>
  </v-list-item>
  <v-dialog
    v-model="state.deleteDialog"
    persistent
    max-width="600"
    transition="fade-transition"
  >
    <v-card>
      <v-toolbar flat>
        <v-icon class="mx-4">
          mdi-list-box
        </v-icon>
        Leave Organization
        <v-spacer />

        <v-btn
          type="submit"
          color="primary"
          icon
          @click="state.deleteDialog = false"
        >
          <v-icon> mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text v-if="getRole(state.workingItem.docId) === 'User'">
        Are you sure you want to leave the organization "{{ state.currentTitle }}"? You will no longer have access to any of the organization's data.
      </v-card-text>
      <v-card-text v-else>
        As an admin, you cannot leave the organization "{{ state.currentTitle }}" from this screen. Please go to the organization's members page to remove yourself.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="state.deleteDialog = false"
        >
          Cancel
        </v-btn>
        <v-btn
          v-if="getRole(state.workingItem.docId) === 'User'"
          type="submit"
          color="error"
          variant="text"
          @click="deleteAction()"
        >
          Leave
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog
    v-model="state.dialog"
    persistent
    max-width="600"
    transition="fade-transition"
  >
    <v-card>
      <v-form
        v-model="state.form"
        validate-on="submit"
        @submit.prevent="onSubmit"
      >
        <v-toolbar flat>
          <v-icon class="mx-4">
            mdi-list-box
          </v-icon>
          {{ state.currentTitle }}
          <v-spacer />

          <v-btn
            type="submit"
            color="primary"
            variant="text"
          >
            {{ state.saveButton }}
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <template v-if="state.saveButton === 'Add Organization'">
            Please enter the name of the organization you would like to create.
            <g-input
              v-model="state.workingItem.name"
              :disable-tracking="true"
              field-type="text"
              :rules="[edgeRules.required]"
              label="Name"
              :parent-tracker-id="`myOrgs-${state.workingItem.id}`"
            />
          </template>
          <template v-else>
            To join an existing organization, please enter the registration code provided by the organization.
            <g-input
              v-model="state.workingItem.name"
              :disable-tracking="true"
              field-type="text"
              :rules="[edgeRules.required]"
              label="Registration Code"
              :parent-tracker-id="`myOrgs-${state.workingItem.id}`"
            />
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="closeDialog"
          >
            Close
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
            variant="text"
          >
            {{ state.saveButton }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
.pointer {
  cursor: move;
}
</style>
