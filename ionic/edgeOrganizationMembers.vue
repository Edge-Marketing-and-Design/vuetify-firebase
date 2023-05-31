<script setup>
import { computed, defineProps, inject, onBeforeMount, reactive, watch } from 'vue'

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
  userRoles: {
    type: Array,
    required: true,
  },
})
const edgeFirebase = inject('edgeFirebase')
const state = reactive({
  loaded: true,
  loading: false,
  meta: {},
  title: '',
  error: { success: true, message: '' },
  workingItem: {},
  dialog: false,
  saveButton: 'Invite User',
  deleteDialog: false,
  deleteMessage: '',
  deleteHeader: '',
  deleteButtons: [],
})

const newItem = {
  name: '',
  email: '',
  role: 'User',
}

const currentOrgName = computed(() => {
  const currentOrg = edgeFirebase.data[`organizations/${edgeState.currentOrganization}`]
  return currentOrg.name
})

const users = computed(() => {
  const otherUsers = Object.values(edgeFirebase.state.users)

  return otherUsers
})

const adminCount = computed(() => {
  return users.value.filter((item) => {
    return item.roles.find((role) => {
      return role.collectionPath === edgeState.organizationDocPath.replaceAll('/', '-') && role.role === 'admin'
    })
  }).length
})

const save = async () => {
  let validation = { name: { type: 'string', required: true, pretty: 'Name' }, email: { type: 'email', required: true, pretty: 'Email' } }
  if (state.saveButton === 'Update Member') {
    validation = { name: { type: 'string', required: true, pretty: 'Name' } }
  }
  if (validateFields(state.workingItem, validation)) {
    const roles = props.userRoles.find(role => role.name === state.workingItem.role).roles
    if (state.saveButton === 'Invite Member') {
      edgeFirebase.addUser({ roles, meta: { name: state.workingItem.name, email: state.workingItem.email } })
    }
    else {
      const oldRoles = state.workingItem.roles.filter((role) => {
        return role.collectionPath.startsWith(edgeState.organizationDocPath.replaceAll('/', '-'))
      })

      for (const role of oldRoles) {
        await edgeFirebase.removeUserRoles(state.workingItem.docId, role.collectionPath)
      }

      for (const role of roles) {
        await edgeFirebase.storeUserRoles(state.workingItem.docId, role.collectionPath, role.role)
      }
    }
    state.dialog = false
  }
}

const addItem = () => {
  state.saveButton = 'Invite Member'
  state.workingItem = dupObject(newItem)
  state.dialog = true
}

const editItem = (item) => {
  state.saveButton = 'Update Member'
  state.workingItem = dupObject(item)
  state.workingItem.name = item.meta.name
  state.workingItem.role = getRoleName(item.roles, edgeState.currentOrganization)
  const newItemKeys = Object.keys(newItem)
  newItemKeys.forEach((key) => {
    if (state.workingItem[key] === undefined) {
      state.workingItem[key] = newItem[key]
    }
  })
  state.dialog = true
}

const deleteConfirm = (item) => {
  if (getRoleName(item.roles, edgeState.currentOrganization) === 'Admin' && adminCount.value === 1) {
    state.deleteButtons = [{
      text: 'OK',
      role: 'cancel',
    }]
    state.deleteMessage = `You cannot remove the last admin from the organization "${currentOrgName.value}".`
    state.deleteHeader = 'Cannot Remove Admin'
  }
  else {
    state.deleteButtons = [{
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Remove',
      role: 'confirm',
    }]

    if (item.userId === edgeFirebase.user.uid) {
      state.deleteHeader = 'Leave Organization'
      state.deleteMessage = `Are you sure you want to leave the organization "${currentOrgName.value}"?`
    }
    else {
      state.deleteHeader = 'Remove Member'
      state.deleteMessage = `Are you sure you want to remove "${item.meta.name}" from the organization "${currentOrgName.value}"?`
    }
  }
  state.currentTitle = item.meta.name
  state.workingItem = dupObject(item)
  state.deleteDialog = true
}
const deleteAction = async (event) => {
  console.log(event)
  if (event.detail.role === 'cancel' || event.detail.role === 'backdrop') {
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

const title = computed(() => {
  if (!props.title) {
    return `${currentOrgName.value} Members`
  }
  return props.title
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
    <ion-card-header v-if="title" class="ma-0 pa-0">
      <ion-item>
        <ion-label class="ion-text-wrap">
          <span class="text-md font-semibold mb-4">
            {{ title }}
          </span>
        </ion-label>
        <div slot="end">
          <ion-button fill="solid" @click.stop="addItem">
            Invite Member
          </ion-button>
        </div>
      </ion-item>
    </ion-card-header>

    <ion-item v-for="item in users" :key="item.docId">
      <ion-label class="ion-text-wrap" @click="editItem(item)">
        <h2>{{ item.meta.name }}</h2>
        <ion-badge>{{ getRoleName(item.roles, edgeState.currentOrganization) }}</ion-badge>
        <ion-badge v-if="item.userId === edgeFirebase.user.uid" class="ml-2" color="secondary">
          You
        </ion-badge>
        <template v-if="!item.userId">
          <ion-card class="ml-0" color="warning">
            <ion-card-header class="my-0 pb-0 pt-1">
              <ion-card-subtitle>User is not yet registered</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content class="py-0">
              Reg Code: {{ item.docId }}
            </ion-card-content>
            <clipboard-button class="ml-2" :text="item.docId" size="small" />
          </ion-card>
        </template>
      </ion-label>
      <ion-button slot="end" :disabled="users.length === 1" fill="solid" @click.stop="deleteConfirm(item)">
        <span v-if="item.userId === edgeFirebase.user.uid">Leave</span>
        <span v-else>Remove</span>
      </ion-button>
    </ion-item>
    <ion-alert
      :is-open="state.deleteDialog"
      :header="state.deleteHeader"
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
            <ion-button v-if="state.saveButton === 'Invite Member'" :strong="true" @click="save">
              Invite
            </ion-button>
            <ion-button v-else :strong="true" @click="save">
              Update
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
            Please enter the information for the person you would like to invite to join your organization.
            <ion-input
              v-model="state.workingItem.name"
              fill="outline"
              label="Name"
              type="text"
              class="ion-touched mt-4"
              :class="validate.class.name"
              label-placement="floating"
              :error-text="validate.message.name"
              :disabled="state.saveButton === 'Update Member' && state.workingItem.userId !== ''"
            />
            <ion-input
              v-if="state.saveButton === 'Invite Member'"
              v-model="state.workingItem.email"
              fill="outline"
              label="Email"
              type="text"
              class="ion-touched mt-4"
              :class="validate.class.email"
              label-placement="floating"
              :error-text="validate.message.email"
            />
            <ion-select
              v-model="state.workingItem.role"
              filled="outline"
              label="Role"
              class="ion-touched mt-4"
              labl-placement="floating"
              :class="validate.class.role"
              :error-text="validate.message.role"
              :disabled="state.workingItem.userId === edgeFirebase.user.uid"
            >
              <ion-select-option v-for="role in userRoles" :key="role" :value="role.name">
                {{ role.name }}
              </ion-select-option>
            </ion-select>

            <edge-error :error="state.error.message" />
          </ion-card-content>
        </ion-card>
      </ion-content>
    </ion-modal>
  </ion-card>
</template>

<style lang="scss" scoped>

</style>
