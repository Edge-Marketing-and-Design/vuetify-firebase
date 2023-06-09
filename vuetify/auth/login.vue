<script setup>
import { inject, reactive } from 'vue'

const edgeFirebase = inject('edgeFirebase')
const edgeGlobal = inject('edgeGlobal')

const state = reactive({
  form: false,
  email: '',
  password: '',
  passwordVisible: false,
  passwordShow: false,
})

const login = reactive({
  email: '',
  password: '',
})

const onSubmit = async () => {
  await edgeFirebase.logIn(login)
}
</script>

<template>
  <logging-in v-if="edgeFirebase.user.loggingIn || edgeFirebase.user.loggedIn" />

  <v-card v-else class="mx-auto px-6 py-8" title="Login" max-width="344">
    <v-form
      v-model="state.form"
      @submit.prevent="onSubmit"
    >
      <v-text-field
        v-model="login.email"
        :rules="[edgeGlobal.edgeRules.email]"
        class="mb-2"
        label="Email"
        variant="underlined"
      />

      <v-text-field
        v-model="login.password"
        :rules="[edgeGlobal.edgeRules.required]"
        :type="state.passwordShow ? 'text' : 'password'"
        label="Password"
        placeholder="Enter your password"
        variant="underlined"
        :append-inner-icon="state.passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="state.passwordShow = !state.passwordShow"
      />
    </v-form>
    <v-card-actions>
      <v-btn
        :disabled="!state.form"

        color="success"
        size="large"
        type="submit"
        @click="onSubmit()"
      >
        Sign In
      </v-btn>
    </v-card-actions>
    <g-error v-if="edgeFirebase.user.logInError" :error="edgeFirebase.user.logInErrorMessage" />
    <v-divider
      class="my-4"
    />
    <v-btn color="success" block @click="edgeFirebase.logInWithMicrosoft()">
      Sign in with Microsoft
    </v-btn>
    <v-divider
      class="my-4"
    />
    Don't have an account?
    <v-btn disabled color="success" small block to="/app/signup">
      Sign up here.
    </v-btn>
  </v-card>
</template>

<style lang="scss" scoped>
</style>
