<script setup>
const props = defineProps({
  disableTracking: {
    type: Boolean,
    default: false,
  },
  parentTrackerId: {
    type: String,
    default: '',
  },
  helper: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    default: () => [],
  },
  fieldType: {
    type: String,
    default: 'text',
  },
  fieldTypes: {
    type: Array,
    default: () => [],
  },
  subFieldType: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [Number, String, Array, Object, Boolean],
  },
  rules: {
    type: Array,
    default: () => [],
  },
  label: {
    type: String,
    default: '',
  },
  rows: {
    type: String,
    default: '1',
  },
  hint: {
    type: String,
    default: '',
  },
  persistentHint: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue'])
const state = reactive({
  loaded: true,
  afterMount: false,
  trackerKey: '',
  helper: false,
  fieldsTypes: ['string', 'boolean', 'array', 'object', 'number'],
  fieldInsert: { key: '', type: 'string' },
  fieldInsertKeyRequired: false,
  fieldInsertDialog: false,
  removeField: null,
  fieldErrorMessage: '',
  keyMenu: false,
  newKey: null,
  currentKey: null,
  order: [],
  orderUpdateFromWatcher: false,
  objectListOriginalOrder: {},
})

const fieldTypes = computed(() => {
  if (props.fieldTypes.length > 0) {
    return props.fieldTypes
  }
  return state.fieldsTypes
})

const modelValue = ref(null)

const addField = () => {
  if (props.fieldType === 'object') {
    state.order.push({ key: state.fieldInsert.key })
  }
  if (props.fieldType === 'array') {
    let arrayValue = null
    if (state.fieldInsert.type === 'string') {
      arrayValue = ''
    }
    else if (state.fieldInsert.type === 'boolean') {
      arrayValue = false
    }
    else if (state.fieldInsert.type === 'array') {
      arrayValue = []
    }
    else if (state.fieldInsert.type === 'object') {
      arrayValue = {}
    }
    else if (state.fieldInsert.type === 'number') {
      arrayValue = 0
    }
    if (modelValue.value === null) {
      modelValue.value = []
    }
    modelValue.value.push(arrayValue)
    state.order = modelValue.value.map((value, index) => {
      return {
        key: index,
        value,
      }
    })
    // state.order.push({ key: state.order.length, value: arrayValue })

    state.fieldInsert.key = ''
    state.fieldInsert.type = 'string'
    state.fieldInsertDialog = false
    state.fieldInsertKeyRequired = false
    state.fieldErrorMessage = ''
    return
  }
  if (state.fieldInsert.key === '') {
    state.fieldInsertKeyRequired = true
    state.fieldErrorMessage = 'Key is required'
    return
  }

  if (Object.keys(modelValue.value).some((k) => {
    return k.toLowerCase() === state.fieldInsert.key.toLowerCase()
  })) {
    state.fieldInsertKeyRequired = true
    state.fieldErrorMessage = 'Key already exists'
    return
  }
  if (state.fieldInsert.type === 'string') {
    modelValue.value[state.fieldInsert.key] = ''
  }
  else if (state.fieldInsert.type === 'boolean') {
    modelValue.value[state.fieldInsert.key] = false
  }
  else if (state.fieldInsert.type === 'array') {
    modelValue.value[state.fieldInsert.key] = []
  }
  else if (state.fieldInsert.type === 'object') {
    modelValue.value[state.fieldInsert.key] = {}
  }
  else if (state.fieldInsert.type === 'number') {
    modelValue.value[state.fieldInsert.key] = 0
  }
  state.fieldInsert.key = ''
  state.fieldInsert.type = 'string'
  state.fieldInsertDialog = false
  state.fieldInsertKeyRequired = false
  state.fieldErrorMessage = ''
}

const removeField = (key) => {
  if (props.fieldType === 'array') {
    modelValue.value.splice(key, 1)
    if (modelValue.value.length === 0) {
      modelValue.value = []
      state.order = []
    }
    else {
      state.order = modelValue.value.map((value, index) => {
        return {
          key: index,
          value,
        }
      })
    }
    state.removeField = null
    return
  }
  delete modelValue.value[key]
  state.order = state.order.filter((k) => {
    return k.key !== key
  })
  state.removeField = null
}

const undo = async () => {
  modelValue.value = dupObject(edgeState.changeTracker[state.trackerKey])
  if (props.fieldType === 'array') {
    if (modelValue.value === null) {
      state.order = []
    }
    else {
      state.order = modelValue.value.map((value, index) => {
        return {
          key: index,
          value,
        }
      })
    }
  }
  if (props.fieldType === 'object') {
    if (!objHas(modelValue.value, 'flingKeyOrder')) {
      state.order = Object.entries(modelValue.value).map(([key, value]) => {
        return {
          key,
        }
      }).filter((k) => {
        return k.key !== 'flingKeyOrder'
      })
    }
    else {
      state.order = dupObject(modelValue.value.flingKeyOrder)
    }
  }
  state.loaded = false
  await nextTick()
  state.loaded = true
}

onBeforeMount(() => {
  modelValue.value = dupObject(props.modelValue)
  if (props.fieldType === 'objectList') {
    props.modelValue.forEach((item, index) => {
      state.objectListOriginalOrder[item.id] = index
    })
  }
  if (props.fieldType === 'object') {
    if (!objHas(props.modelValue, 'flingKeyOrder')) {
      if (props.modelValue === null) {
        state.order = []
      }
      else {
        state.order = Object.entries(props.modelValue).map(([key, value]) => {
          return {
            key,
          }
        }).filter((k) => {
          return k.key !== 'flingKeyOrder'
        })
      }
    }
    else {
      state.order = dupObject(props.modelValue.flingKeyOrder)
    }
  }
  if (props.fieldType === 'array') {
    if (props.modelValue === null) {
      state.order = []
    }
    else {
      state.order = props.modelValue.map((value, index) => {
        return {
          key: index,
          value,
        }
      })
    }
  }
})

const removeFieldDialogShow = computed(() => {
  if (state.removeField !== null) {
    return true
  }
  return false
})
const originalCompare = computed(() => {
  if (props.fieldType === 'objectList' || props.fieldType === 'object' || props.fieldType === 'array') {
    return JSON.stringify(edgeState.changeTracker[state.trackerKey])
  }
  else {
    return edgeState.changeTracker[state.trackerKey]
  }
})

const isTracked = computed(() => {
  return objHas(edgeState.changeTracker, state.trackerKey)
})

const modelCompare = computed(() => {
  if (props.fieldType === 'objectList' || props.fieldType === 'object' || props.fieldType === 'array') {
    return JSON.stringify(modelValue.value)
  }
  else {
    return modelValue.value
  }
})

const getArrayObjectLabel = (key) => {
  if (props.fieldType === 'object') {
    return key
  }
  else {
    return `Array Item #${key + 1}`
  }
}

const openKeyMenu = (key) => {
  state.keyMenu = true
  state.currentKey = key
  state.newKey = key
}

const updateKey = async () => {
  const keyArray = Object.keys(modelValue.value)
  const keyIndex = keyArray.findIndex(k => k === state.currentKey)
  keyArray[keyIndex] = state.newKey

  const value = modelValue.value[state.currentKey]
  delete modelValue.value[state.currentKey]

  const newObject = {}
  keyArray.forEach((k) => {
    if (k === state.newKey) {
      newObject[k] = value
    }
    else {
      newObject[k] = modelValue.value[k]
    }
  })

  const newItem = { key: state.newKey }
  const index = state.order.findIndex(item => item.key === state.currentKey)
  if (index !== -1) {
    state.order.splice(index, 1, newItem)
  }
  modelValue.value = newObject
  state.keyMenu = false
}

const isNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value)
}

onMounted(() => {
  state.trackerKey = (`${props.parentTrackerId}-${props.label.replaceAll(' ', '-')}`).toLowerCase()
  if (!objHas(edgeState.changeTracker, state.trackerKey)) {
    if (!props.disableTracking) {
      edgeState.changeTracker[state.trackerKey] = dupObject(modelValue.value)
    }
  }
  state.afterMount = true
})

watch(() => state.order, () => {
  if (props.fieldType === 'object') {
    modelValue.value.flingKeyOrder = dupObject(state.order)
  }

  if (props.fieldType === 'array') {
    if (!state.orderUpdateFromWatcher) {
      if (state.order.length > 0) {
        const currentValues = dupObject(modelValue.value)
        modelValue.value = state.order.map((item) => {
          return currentValues[item.key]
        })

        state.orderUpdateFromWatcher = true
        if (modelValue.value.some(item => typeof item !== 'object' || item === null)) {
          state.order = modelValue.value.map((value, index) => {
            return {
              key: index,
              value,
            }
          })
        }
      }
    }
  }
},
{ deep: true })

watch(() => state.fieldInsertDialog, () => {
  if (state.fieldInsertDialog) {
    if (props.fieldType === 'array') {
      if (props.fieldTypes.length === 1) {
        addField()
      }
    }
  }
},
{ deep: true })

watch(modelValue, () => {
  if (state.afterMount) {
    emit('update:modelValue', modelValue.value)
  }
  if (props.fieldType === 'array') {
    state.orderUpdateFromWatcher = false
  }
}, { deep: true })
</script>

<template>
  <div v-if="state.loaded">
    <v-text-field
      v-if="props.fieldType === 'text'"
      v-model="modelValue"
      variant="underlined"
      :rules="props.rules"
      :label="props.label"
      :hint="props.hint"
      :persistent-hint="props.persistentHint"
      :disabled="props.disabled"
    >
      <template v-if="props.helper" #append-inner>
        <helper :helper="props.helper" />
      </template>
    </v-text-field>
    <v-checkbox
      v-if="props.fieldType === 'boolean'"
      v-model="modelValue"
      :rules="props.rules"
      :label="props.label"
    />
    <v-select
      v-if="props.fieldType === 'select'"
      v-model="modelValue"
      :rules="props.rules"
      :clearable="true"
      :label="props.label"
      :items="props.items"
      variant="underlined"
      :return-object="false"
      :disabled="props.disabled"
    >
      <template v-if="props.helper" #append>
        <helper :helper="props.helper" />
      </template>
    </v-select>
    <v-textarea
      v-if="props.fieldType === 'textarea'"
      v-model="modelValue"
      :rules="props.rules"
      :label="props.label"
      auto-grow
      :rows="props.rows"
      variant="underlined"
    >
      <template v-if="props.helper" #append-inner>
        <helper :helper="props.helper" />
      </template>
    </v-textarea>
    <template v-if="props.fieldType === 'object' || props.fieldType === 'array'">
      <v-dialog v-model="state.keyMenu" :max-width="300">
        <v-card>
          <v-toolbar density="compact">
            <v-toolbar-title v-if="props.fieldType === 'object'">
              Update Key
            </v-toolbar-title>
            <v-toolbar-title v-else>
              Add Item
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon @click="state.fieldInsertDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-text-field
              v-model="state.newKey"
              class="mb-1"
              label="Key"
              variant="underlined"
              hide-details
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="state.keyMenu = false">
              Cancel
            </v-btn>
            <v-btn color="primary" @click="updateKey">
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-card :rounded="0" flat class="fill-height">
        <v-toolbar class="mb-2" density="compact" flat>
          <v-icon v-if="props.fieldType === 'object'" class="mx-4">
            mdi-set-merge
          </v-icon>
          <v-icon v-else class="mx-4">
            mdi-code-array
          </v-icon>
          {{ props.label }}
          <v-spacer />

          <v-btn v-bind="props">
            <template v-if="props.fieldType === 'object'">
              Add Field
            </template>
            <template v-else>
              Add Item
            </template>
            <v-dialog v-model="state.fieldInsertDialog" max-width="400" activator="parent">
              <v-card>
                <v-toolbar density="compact">
                  <v-toolbar-title v-if="props.fieldType === 'object'">
                    Add Field
                  </v-toolbar-title>
                  <v-toolbar-title v-else>
                    Add Item
                  </v-toolbar-title>
                  <v-spacer />
                  <v-btn icon @click="state.fieldInsertDialog = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  <v-text-field
                    v-if="props.fieldType === 'object'"
                    v-model="state.fieldInsert.key"
                    :error="state.fieldInsertKeyRequired"
                    variant="underlined"
                    label="Field Key"
                    :error-messages="state.fieldErrorMessage"
                  />
                  <v-select
                    v-model="state.fieldInsert.type"
                    variant="underlined"
                    :items="fieldTypes"
                    label="Type"
                    hide-details
                  />
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn @click="state.fieldInsertDialog = false">
                    Cancel
                  </v-btn>
                  <v-btn color="primary" @click="addField">
                    Insert
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-btn>
          <helper v-if="props.helper" :helper="props.helper" />
        </v-toolbar>
        <v-card-text class="pt-0">
          <draggable
            v-model="state.order"
            handle=".handle"
            item-key="key"
          >
            <template #item="{ element }">
              <div>
                <v-container v-if="typeof modelValue[element.key] === 'object' && !Array.isArray(modelValue[element.key])" :key="`object-${element.key}`" style="position: relative;">
                  <v-btn style="position: absolute;right:0px; top:0px;z-index: 99;" size="x-small" icon @click="state.removeField = element.key">
                    <v-icon size="x-large">
                      mdi-delete
                    </v-icon>
                  </v-btn>
                  <v-btn
                    v-if="props.fieldType === 'object'"
                    style="position: absolute;left:66px; top:26px;z-index: 99;"
                    size="small"
                    class="py-0"
                    @click="openKeyMenu(element.key)"
                  >
                    {{ element.key }}
                  </v-btn>
                  <v-icon class="pointer handle" style="position: absolute;left:-8px; top:26px;z-index: 99;">
                    mdi-format-align-justify
                  </v-icon>
                  <g-input v-model="modelValue[element.key]" :label="getArrayObjectLabel(element.key)" :disable-tracking="true" field-type="object" />
                </v-container>
                <v-container v-else-if="Array.isArray(modelValue[element.key])" :key="`array-${element.key}`" style="position: relative;">
                  <v-btn style="position: absolute;right:0px; top:0px;z-index: 99;" size="x-small" icon @click="state.removeField = element.key">
                    <v-icon size="x-large">
                      mdi-delete
                    </v-icon>
                  </v-btn>
                  <v-btn
                    v-if="props.fieldType === 'object'"
                    style="position: absolute;left:66px; top:26px;z-index: 99;"
                    size="small"
                    class="py-0"
                    @click="openKeyMenu(element.key)"
                  >
                    {{ element.key }}
                  </v-btn>
                  <v-icon class="pointer handle" style="position: absolute;left:-8px; top:26px;z-index: 99;">
                    mdi-format-align-justify
                  </v-icon>
                  <g-input v-model="modelValue[element.key]" :label="getArrayObjectLabel(element.key)" :disable-tracking="true" field-type="array" />
                </v-container>
                <v-container v-else :key="`others-${element.key}`" class="py-1">
                  <v-row dense>
                    <v-col class="text-right pt-6" cols="1">
                      <v-icon class="handle pointer">
                        mdi-format-align-justify
                      </v-icon>
                    </v-col>
                    <v-col
                      v-show="props.fieldType !== 'array'"
                      class="pt-5"
                      cols="5"
                    >
                      <v-btn size="small" variant="outlined" class="py-0" block @click="openKeyMenu(element.key)">
                        {{ element.key }}
                      </v-btn>
                    </v-col>
                    <v-col class="py-0">
                      <v-text-field
                        v-if="typeof modelValue[element.key] === 'string'"
                        v-model="modelValue[element.key]"
                        class="mb-1"
                        :label="getArrayObjectLabel(element.key)"
                        variant="underlined"
                        placeholder="Enter value here"
                        hide-details
                      />
                      <v-checkbox
                        v-else-if="typeof modelValue[element.key] === 'boolean'"
                        :key="`select-${element.key}`"
                        v-model="modelValue[element.key]"
                        class="mb-1"
                        hide-details
                        :label="getArrayObjectLabel(element.key)"
                      />
                      <vue-number-input
                        v-else-if="isNumber(modelValue[element.key])"
                        :key="`number-${element.key}`"
                        v-model="modelValue[element.key]"
                        :step=".1"
                        class="mt-3"
                        controls
                        size="medium"
                      />
                    </v-col>
                    <v-col class="pt-4" cols="1">
                      <v-btn variant="text" size="small" icon @click="state.removeField = element.key">
                        <v-icon size="x-large">
                          mdi-delete
                        </v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </template>
          </draggable>

          <v-dialog
            v-model="removeFieldDialogShow"
            persistent
            max-width="600"
            transition="fade-transition"
          >
            <v-card>
              <v-toolbar density="compact" flat>
                <v-icon class="mx-4">
                  mdi-delete
                </v-icon>
                Delete "{{ getArrayObjectLabel (state.removeField) }}"
                <v-spacer />

                <v-btn
                  type="submit"
                  color="primary"
                  icon
                  @click="state.removeField = null"
                >
                  <v-icon> mdi-close</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-title>Are you sure you want to delete "{{ getArrayObjectLabel(state.removeField) }}"?</v-card-title>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="state.removeField = null"
                >
                  Cancel
                </v-btn>
                <v-btn
                  type="submit"
                  color="error"
                  variant="text"
                  @click="removeField(state.removeField)"
                >
                  Delete
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-text>
      </v-card>
    </template>
    <template v-if="props.fieldType === 'objectList'">
      <v-card :rounded="0" flat class="fill-height">
        <v-card-text class="pa-0">
          <v-toolbar density="compact" color="transparent" flat>
            <v-toolbar-title>{{ props.label }}</v-toolbar-title>
            <v-spacer />
            <component :is="`form-subtypes-${props.subFieldType}`" v-model:items="modelValue" />
            <helper v-if="props.helper" :helper="props.helper" />
          </v-toolbar>
          <v-list class="mt-0 pt-0" bg-color="transparent">
            <draggable
              v-model="modelValue"
              handle=".handle"
              item-key="id"
            >
              <template #item="{ element, index }">
                <div>
                  <component :is="`form-subtypes-${props.subFieldType}`" v-model:items="modelValue" :item="element" />
                  <v-fade-transition>
                    <v-alert v-if="isTracked && state.afterMount && (JSON.stringify(modelValue[index]) !== JSON.stringify(edgeState.changeTracker[state.trackerKey][state.objectListOriginalOrder[element.id]]))" class="mt-0 mb-3 text-caption" density="compact" variant="tonal" type="warning">
                      <v-row dense class="pa-0 ma-0">
                        <v-col v-if="props.fieldType === 'objectList'">
                          This item has been modified
                        </v-col>
                        <v-col v-else>
                          Modified from "{{ originalCompare }}"
                        </v-col>
                        <v-col cols="4" class="text-right">
                          <v-btn variant="text" class="ml-8" size="x-small" @click="modelValue[index] = edgeState.changeTracker[state.trackerKey][state.objectListOriginalOrder[element.id]]">
                            Undo
                          </v-btn>
                          <!-- <v-btn v-else variant="text" class="ml-8" size="x-small" @click="modelValue = edgeState.changeTracker[state.trackerKey]">
                            Undo
                          </v-btn> -->
                        </v-col>
                      </v-row>
                    </v-alert>
                  </v-fade-transition>
                  <v-divider
                    inset
                  />
                </div>
              </template>
            </draggable>
          </v-list>
        </v-card-text>
      </v-card>
      <v-input
        v-model="modelValue"
        density="compact"
        :rules="props.rules"
      />
    </template>
    <v-fade-transition>
      <v-alert v-if="isTracked && state.afterMount && (modelCompare !== originalCompare)" class="mt-0 mb-3 text-caption" density="compact" variant="tonal" type="warning">
        <v-row dense class="pa-0 ma-0">
          <template v-if="props.fieldType === 'objectList' || props.fieldType === 'object' || props.fieldType === 'array'">
            <v-col>
              {{ props.label }} has been modified
            </v-col>
            <v-btn variant="text" color="primary" class="ml-8" size="x-small" @click="undo()">
              Undo All
            </v-btn>
          </template>
          <template v-else>
            <v-col>
              Modified from "{{ originalCompare }}" to "{{ modelValue }}"
            </v-col>
            <v-col cols="4" class="text-right">
              <v-btn variant="text" color="primary" class="ml-8" size="x-small" @click="undo()">
                Undo
              </v-btn>
            </v-col>
          </template>
        </v-row>
      </v-alert>
    </v-fade-transition>
  </div>
</template>

<style lang="scss">
.vue-number-input input {
  background-color: transparent !important;
}
.pointer {
  cursor: move;
}
</style>