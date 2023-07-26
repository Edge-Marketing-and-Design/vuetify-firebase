<script setup>
// TODO: PHONE LOGIN NEXT
import { defineProps, inject, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  registrationCode: {
    type: String,
    default: '',
  },
  providers: {
    type: Array,
    default: () => ['email', 'microsoft'],
  },
  title: {
    type: String,
    default: 'Organization',
  },
  joinMessage: {
    type: String,
    default: 'Join an existing organization',
  },
})
const route = useRoute()
const edgeFirebase = inject('edgeFirebase')
const edgeGlobal = inject('edgeGlobal')

const state = reactive({
  passwordVisible: false,
  passwordShow: false,
  terms: false,
  form: false,
  form2: false,
  provider: 0,
  error: { error: false, message: '' },
  registrationCode: '',
  showRegistrationCode: false,
  phone: '',
  phoneConfirmDialog: false,
})

const register = reactive({
  meta: { name: '' },
  email: '',
  password: '',
  registrationCode: props.registrationCode, // TODO - This should come from .env since it will be different on production
  dynamicDocumentFieldValue: '',
  confirmationResult: null,
  phoneCode: '',
})

const onSubmit = async (event) => {
  const results = await event
  if (results.valid) {
    if (state.provider === 'phone') {
      register.confirmationResult = await edgeFirebase.sendPhoneCode(`+1${state.phone}`)
      state.phoneConfirmDialog = true
    }
    else {
      if (state.showRegistrationCode) {
        register.registrationCode = state.registrationCode
      }
      const result = await edgeFirebase.registerUser(register, state.provider)
      state.error.error = !result.success
      state.error.message = result.message.code
    }
  }
}
onMounted(() => {
  state.provider = props.providers[0]
  const regCode = route.query['reg-code'] ? route.query['reg-code'] : ''
  state.registrationCode = regCode
  if (regCode) {
    state.showRegistrationCode = true
  }
})
const phoneRegister = async (event) => {
  const results = await event
  if (results.valid) {
    const result = await edgeFirebase.registerUser(register, state.provider)
    state.error.error = !result.success
    state.error.message = result.message.code
  }
  state.phoneConfirmDialog = false
}
</script>

<template>
  <logging-in v-if="edgeFirebase.user.loggingIn || edgeFirebase.user.loggedIn" />
  <v-card
    v-else
    class="mx-auto px-6 py-8"
    max-width="444"
    title="User Registration"
  >
    <v-form
      v-model="state.form"
      validate-on="submit"
      @submit.prevent="onSubmit"
    >
      <v-container>
        Choose a login method:
        <v-item-group v-model="state.provider" mandatory>
          <v-divider
            v-if="props.providers.includes('email')"
            class="my-2"
          />
          <v-item v-if="props.providers.includes('email')" v-slot="{ selectedClass, toggle }" value="email">
            <v-btn
              :prepend-icon="selectedClass ? 'mdi-check' : ''"
              :class="[selectedClass ? 'bg-primary' : 'bg-grey']"
              block
              @click="toggle"
            >
              Username and Password
            </v-btn>
          </v-item>
          <v-divider
            v-if="props.providers.includes('microsoft')"
            class="my-2"
          />
          <v-item v-if="props.providers.includes('microsoft')" v-slot="{ selectedClass, toggle }" value="microsoft">
            <v-btn
              :prepend-icon="selectedClass ? 'mdi-check' : ''"
              :class="[selectedClass ? 'bg-primary' : 'bg-grey']"
              block
              @click="toggle"
            >
              Microsoft
            </v-btn>
          </v-item>
          <v-divider
            class="my-2"
          />
          <v-item v-if="props.providers.includes('phone')" v-slot="{ selectedClass, toggle }" value="phone">
            <v-btn
              :prepend-icon="selectedClass ? 'mdi-check' : ''"
              :class="[selectedClass ? 'bg-primary' : 'bg-grey']"
              block
              @click="toggle"
            >
              Phone
            </v-btn>
          </v-item>
          <v-divider
            v-if="props.providers.includes('phone')"
            class="my-2"
          />
        </v-item-group>
        <v-text-field
          v-if="state.provider === 'email'"
          v-model="register.email"
          :rules="[edgeGlobal.edgeRules.email]"
          class="mb-2"
          label="Email"
          variant="underlined"
        />

        <v-text-field
          v-if="state.provider === 'email'"
          v-model="register.password"
          :rules="[edgeGlobal.edgeRules.password]"
          :append-inner-icon="state.passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
          :type="state.passwordShow ? 'text' : 'password'"
          label="Password"
          placeholder="Enter your password"
          variant="underlined"
          @click:append-inner="state.passwordShow = !state.passwordShow"
        />

        <g-input
          v-if="state.provider === 'phone'"
          v-model="state.phone"
          :disable-tracking="true"
          field-type="text"
          :rules="[edgeGlobal.edgeRules.required]"
          label="Phone Number"
          :mask-options="{ mask: '(###) ###-####' }"
        />

        <v-text-field
          v-model="register.meta.name"
          :rules="[edgeGlobal.edgeRules.required]"
          color="primary"
          label="Name"
          variant="underlined"
        />
        <v-checkbox
          v-model="state.showRegistrationCode"
          class="my-0"
          hide-details
          color="secondary"
        >
          <template #label>
            <span class="ml-2">{{ props.joinMessage }}</span>
          </template>
        </v-checkbox>

        <v-text-field
          v-if="state.showRegistrationCode"
          v-model="state.registrationCode"
          :rules="[edgeGlobal.edgeRules.required]"
          color="primary"
          label="Registration Code"
          variant="underlined"
        />
        <v-text-field
          v-else
          v-model="register.dynamicDocumentFieldValue"
          :rules="[edgeGlobal.edgeRules.required]"
          color="primary"
          :label="props.title"
          variant="underlined"
        />

        <v-checkbox
          v-model="state.terms"
          :rules="[edgeGlobal.edgeRules.required]"
          color="secondary"
          label="I agree to site terms and conditions"
        />
      </v-container>

      <v-divider />

      <v-card-actions>
        <v-spacer />

        <v-btn color="success" type="submit">
          Submit
        </v-btn>
      </v-card-actions>
      <g-error v-if="state.error.error" :error="state.error.message" />
      <v-divider class="py-4" />
      Already have an account?
      <v-btn color="success" small block to="/app/login">
        Sign in here.
      </v-btn>
    </v-form>
    <v-dialog
      v-model="state.phoneConfirmDialog"
      persistent
      max-width="600"
      transition="fade-transition"
    >
      <v-card>
        <v-form

          v-model="state.form2"
          validate-on="submit"
          @submit.prevent="phoneRegister"
        >
          <v-toolbar flat>
            <v-icon class="mx-4">
              mdi-list-box
            </v-icon>
            Enter Confirmation Code
            <v-spacer />

            <v-btn
              type="submit"
              color="primary"
              icon
              @click="state.phoneConfirmDialog = false"
            >
              <v-icon> mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-title>Enter Confirmation Code</v-card-title>
          <v-card-text>
            Please enter the confirmation code that you received via text message. This code is used to verify your phone number. If you did not receive a text message, please confirm that your phone number is correct and request a new code.
            <v-text-field
              v-model="register.phoneCode"
              :rules="[edgeGlobal.edgeRules.required]"
              color="primary"
              label="Confirmation Code"
              variant="underlined"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="state.phoneConfirmDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              type="submit"
              color="error"
              variant="text"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-card>
</template>
