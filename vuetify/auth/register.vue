<script setup>
import { defineProps, inject, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { edgeRules } from '../../global'

const props = defineProps({
  registrationCode: {
    type: String,
    default: '',
  },
  providers: {
    type: Array,
    default: () => ['email', 'microsoft'],
  },
})
const route = useRoute()
const edgeFirebase = inject('edgeFirebase')

const state = reactive({
  passwordVisible: false,
  passwordShow: false,
  terms: false,
  form: false,
  provider: 0,
  error: { error: false, message: '' },
  registrationCode: '',
  showRegistrationCode: false,
})

const register = reactive({
  meta: { name: '' },
  email: '',
  password: '',
  registrationCode: props.registrationCode, // TODO - This should come from .env since it will be different on production
  dynamicDocumentFieldValue: '',
})
const onSubmit = async (event) => {
  const results = await event
  if (results.valid) {
    let provider = 'email'
    if (state.provider === 1) {
      provider = 'microsoft'
    }
    if (state.showRegistrationCode) {
      register.registrationCode = state.registrationCode
    }
    const result = await edgeFirebase.registerUser(register, provider)
    state.error.error = !result.success
    state.error.message = result.message.code
  }
}
onMounted(() => {
  const regCode = route.query['reg-code'] ? route.query['reg-code'] : ''
  state.registrationCode = regCode
  if (regCode) {
    state.showRegistrationCode = true
  }
})
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
            class="my-2"
          />
          <v-item v-slot="{ selectedClass, toggle }">
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
            class="my-2"
          />
          <v-item v-slot="{ selectedClass, toggle }">
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
        </v-item-group>
        <v-text-field
          v-if="state.provider === 0"
          v-model="register.email"
          :rules="[edgeRules.email]"
          class="mb-2"
          label="Email"
          variant="underlined"
        />

        <v-text-field
          v-if="state.provider === 0"
          v-model="register.password"
          :rules="[edgeRules.password]"
          :append-inner-icon="state.passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
          :type="state.passwordShow ? 'text' : 'password'"
          label="Password"
          placeholder="Enter your password"
          variant="underlined"
          @click:append-inner="state.passwordShow = !state.passwordShow"
        />

        <v-text-field
          v-model="register.meta.name"
          :rules="[edgeRules.required]"
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
            <span class="ml-2">Join an existing organization</span>
          </template>
        </v-checkbox>

        <v-text-field
          v-if="state.showRegistrationCode"
          v-model="state.registrationCode"
          :rules="[edgeRules.required]"
          color="primary"
          label="Registration Code"
          variant="underlined"
        />
        <v-text-field
          v-else
          v-model="register.dynamicDocumentFieldValue"
          :rules="[edgeRules.required]"
          color="primary"
          label="Organization"
          variant="underlined"
        />

        <v-checkbox
          v-model="state.terms"
          :rules="[edgeRules.required]"
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
  </v-card>
</template>
