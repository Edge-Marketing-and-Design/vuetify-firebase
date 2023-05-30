<script setup>
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
  workingItem: {},
  dialog: false,
  saveButton: 'Add Organization',
  deleteDialog: false,
  deleteMessage: '',
  deleteButtons: [],
})

const config = useRuntimeConfig()

const register = reactive({
  registrationCode: config.public.registrationCode,
  dynamicDocumentFieldValue: '',
})

const newItem = {
  name: '',
}

const save = async () => {
  const registerSend = dupObject(register)
  let isValid = false
  if (state.saveButton === 'Add Organization') {
    registerSend.dynamicDocumentFieldValue = state.workingItem.name
    if (validateFields({ dynamicDocumentFieldValue: registerSend.dynamicDocumentFieldValue }, { dynamicDocumentFieldValue: { type: 'string', required: true, pretty: 'Organization Name' } })) {
      isValid = true
    }
  }
  else {
    registerSend.dynamicDocumentFieldValue = ''
    registerSend.registrationCode = state.workingItem.name
    if (validateFields({ registrationCode: registerSend.registrationCode }, { registrationCode: { type: 'string', required: true, pretty: 'Registration Code' } })) {
      isValid = true
    }
  }
  if (isValid) {
    state.error = { success: false, message: '' }
    state.loading = true
    const results = await edgeFirebase.currentUserRegister(registerSend)
    await getOrganizations(edgeFirebase)
    state.error = results
    state.loading = false
    console.log(results)
    edgeState.changeTracker = {}
    if (state.error.success) {
      state.dialog = false
    }
  }
}

const addItem = () => {
  state.saveButton = 'Add Organization'
  state.workingItem = dupObject(newItem)
  state.currentTitle = 'Add Organization'
  state.dialog = true
}

const joinOrg = () => {
  state.saveButton = 'Join Organization'
  state.workingItem = dupObject(newItem)
  state.currentTitle = 'Join Organization'
  state.dialog = true
}

const getRole = (org) => {
  const orgPath = `organizations/${org}`
  const role = edgeFirebase.user.roles.find((role) => {
    return role.collectionPath === orgPath.replaceAll('/', '-')
  })
  return role.role.charAt(0).toUpperCase() + role.role.slice(1)
}

const deleteConfirm = (item) => {
  if (getRole(item.docId) === 'Admin') {
    state.deleteButtons = [{
      text: 'OK',
      role: 'cancel',
    }]
    state.deleteMessage = `As an admin, you cannot leave the organization "${item.name}" from this screen. Please go to the organization's members page to remove yourself.`
  }
  else {
    state.deleteButtons = [{
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Leave',
      role: 'confirm',
    }]
    state.deleteMessage = `Are you sure you want to leave the organization "${item.name}"?`
  }
  state.currentTitle = item.name
  state.workingItem = dupObject(item)
  state.deleteDialog = true
}

const deleteAction = async (event) => {
  if (event.detail.role === 'cancel' || event.detail.role === 'backdrop') {
    state.deleteDialog = false
    return
  }
  if (getRole(state.workingItem.docId) === 'Admin') {
    state.deleteDialog = false
    return
  }
  if (event.detail.role === 'confirm') {
    await edgeFirebase.removeUser(state.workingItem.docId)
  }
  state.deleteDialog = false
}

const closeDialog = () => {
  state.dialog = false
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
    <ion-card-header v-if="props.title" class="ma-0 pa-0">
      <ion-item>
        <ion-label class="ion-text-wrap">
          <span class="text-md font-semibold mb-4">
            {{ props.title }}
          </span>
        </ion-label>
        <div slot="end">
          <ion-button fill="solid" @click.stop="addItem">
            Add
          </ion-button>
          <ion-button fill="solid" @click.stop="joinOrg">
            Join
          </ion-button>
        </div>
      </ion-item>
    </ion-card-header>

    <ion-item v-for="item in edgeState.organizations" :key="item.docId">
      <ion-label>
        <h2>{{ item.name }}</h2>
        <ion-badge>{{ getRole(item.docId) }}</ion-badge>
      </ion-label>
      <ion-button slot="end" fill="solid" @click.stop="deleteConfirm(item)">
        Leave
      </ion-button>
    </ion-item>
    <ion-alert
      :is-open="state.deleteDialog"
      header="Leave Organization"
      :message="state.deleteMessage"
      :buttons="state.deleteButtons"
      @did-dismiss="deleteAction($event)"
    />
    <ion-modal :is-open="state.dialog">
      <ion-header>
        <ion-toolbar color="secondary">
          <ion-buttons slot="start">
            <ion-button @click="closeDialog">
              <ion-icon :icon="ioniconsClose" />
            </ion-button>
          </ion-buttons>
          <ion-title>{{ state.saveButton }}</ion-title>
          <ion-buttons slot="end">
            <ion-button v-if="state.saveButton === 'Add Organization'" :strong="true" @click="save">
              Add
            </ion-button>
            <ion-button v-else :strong="true" @click="save">
              Join
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-loading
          v-show="state.loading"
          is-open
          message="Please wait..."
          spinner="circles"
        />
        <ion-card>
          <ion-card-content>
            <template v-if="state.saveButton === 'Add Organization'">
              Please enter the name of the organization you would like to create.
            </template>
            <template v-else>
              To join an existing organization, please enter the registration code provided by the organization.
            </template>
            <ion-input
              v-if="state.saveButton === 'Join Organization'"
              v-model="state.workingItem.name"
              fill="outline"
              label="Registration Code"
              type="text"
              class="ion-touched mt-4"
              :class="validate.class.registrationCode"
              label-placement="floating"
              :error-text="validate.message.registrationCode"
            />
            <ion-input
              v-else
              v-model="state.workingItem.name"
              fill="outline"
              label="Choose an organization name"
              type="text"
              class="ion-touched mt-4"
              :class="validate.class.dynamicDocumentFieldValue"
              label-placement="floating"
              :error-text="validate.message.dynamicDocumentFieldValue"
            />
            <edge-error :error="state.error.message" />
          </ion-card-content>
        </ion-card>
      </ion-content>
    </ion-modal>
  </ion-card>
</template>

<style lang="scss" scoped>

</style>
