<script setup>
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  afterLoginPath: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  providers: {
    type: Array,
    required: true,
    default: () => [],
  },
  providerScopes: {
    type: Array,
    required: false,
    default: () => [],
  },
  metaFields: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  defaultProvider: {
    type: String,
    required: false,
    default: 'email',
  },
})
const edgeFirebase = inject('edgeFirebase')
const config = useRuntimeConfig()
const newOrgRegistration = config.public.registrationCode
const state = reactive({
  loading: false,
  user: {
    email: '',
    password: '',
    registrationCode: '',
    dynamicDocumentFieldValue: '',
    meta: {},
  },
  loginRules: {
    email: { type: 'email', required: true, pretty: 'Email' },
    password: { type: 'string', required: true, pretty: 'Password' },
  },
  registerRules: {
    registrationCode: { type: 'string', required: true, pretty: 'Registration Code' },
  },
  registerProviderType: 'email',
  showRegistrationCode: false,
  registerError: '',
})

const login = async (provider) => {
  if (provider.type === 'microsoft') {
    state.loading = true
    await edgeFirebase.logInWithMicrosoft(provider.scopes)
  }
  if (provider.type === 'email') {
    if (validateFields(state.user, state.loginRules)) {
      state.loading = true
      await edgeFirebase.logIn(
        {
          email: state.user.email,
          password: state.user.password,
        },
      )
    }
  }
}

const metaRules = computed(() => {
  const result = {}

  for (const key in props.metaFields) {
    if (Object.prototype.hasOwnProperty.call(props.metaFields, key)) {
      result[`meta.${key}`] = props.metaFields[key]
    }
  }

  return result
})

const register = async () => {
  let rules = JSON.parse(JSON.stringify(state.registerRules))
  const user = JSON.parse(JSON.stringify(state.user))
  rules = { ...metaRules.value, ...props.metaFields }
  if (!state.showRegistrationCode) {
    rules = { ...rules, ...{ dynamicDocumentFieldValue: { type: 'string', required: true, pretty: 'Organization Name' } } }
  }
  else {
    delete user.dynamicDocumentFieldValue
  }
  if (state.registerProviderType === 'microsoft') {
    delete user.email
    delete user.password
    if (validateFields(state.user, rules)) {
      state.loading = true
      const results = await edgeFirebase.registerUser(user, 'microsoft', props.providerScopes)
      if (!results.success) {
        state.loading = false
        state.registerError = results.message
      }
    }
  }
  if (state.registerProviderType === 'email') {
    rules = { ...rules, ...{ email: { type: 'email', required: true, pretty: 'Email' }, password: { type: 'password', required: true, pretty: 'Password' } } }
    if (validateFields(state.user, rules)) {
      const results = await edgeFirebase.registerUser(user, 'email')
      if (!results.success) {
        state.loading = false
        state.registerError = results.message
      }
    }
  }
}

onBeforeMount(() => {
  if (Object.keys(props.metaFields).length > 0) {
    Object.keys(props.metaFields).forEach((key) => {
      const field = props.metaFields[key]
      if (field.type === 'string') {
        state.user.meta[key] = ''
      }
      if (field.type === 'boolean') {
        state.user.meta[key] = false
      }
      if (field.type === 'number') {
        state.user.meta[key] = 0
      }
    })
  }
  state.registerProviderType = props.defaultProvider
  state.user.registrationCode = newOrgRegistration
  resetValidation()
})

const showRegistrationCode = computed(() => {
  return state.showRegistrationCode
})

watch(showRegistrationCode, async () => {
  console.log(state.showRegistrationCode)
  if (state.showRegistrationCode) {
    state.user.registrationCode = ''
    state.user.dynamicDocumentFieldValue = ''
  }
  else {
    state.user.registrationCode = newOrgRegistration
  }
})

const router = useRouter()
watch(edgeFirebase.user, async () => {
  edgeState.user = edgeFirebase.user
  if (edgeFirebase.user.loggedIn) {
    await getOrganizations(edgeFirebase)
    const storedOrganization = localStorage.getItem('organizationID')
    if (storedOrganization && edgeState.organizations.some(org => org.docId === storedOrganization)) {
      await setOrganization(storedOrganization, edgeFirebase)
    }
    else if (edgeState.currentOrganization) {
      await setOrganization(edgeState.currentOrganization, edgeFirebase)
    }
    else if (edgeState.organizations.length > 0) {
      await setOrganization(edgeState.organizations[0].docId, edgeFirebase)
    }

    const cleanedRoute = edgeState.preLoginRoute.endsWith('/') ? edgeState.preLoginRoute.slice(0, -1) : edgeState.preLoginRoute
    console.log(`cleaned route: ${cleanedRoute}`)
    if (cleanedRoute === ''
    || cleanedRoute === '/login'
    || cleanedRoute === '/signup') {
      console.log(props.afterLoginPath)
      router.push(props.afterLoginPath)
    }
    else {
      router.push(edgeState.preLoginRoute)
    }
  }
  state.loading = false
})
</script>

<template>
  <ion-card class="shadow-none border-none pa-4 mt-8 max-w-md mx-auto " style="padding-top: 16px;">
    <ion-card-header>
      <div class="font-title text-center">
        {{ props.title }}
      </div>
    </ion-card-header>
    <ion-card-content>
      <ion-loading
        v-if="edgeFirebase.user.loggingIn"
        is-open
        message="Loading..."
        spinner="circles"
      />
      <template v-if="props.type === 'login'">
        <template v-for="(provider, index) in props.providers" :key="provider">
          <div v-if="index > 0" class="relative flex py-5 items-center">
            <div class="flex-grow border-t" />
            <span class="flex-shrink mx-4">or</span>
            <div class="flex-grow border-t" />
          </div>
          <ion-button v-if="provider.type === 'microsoft'" fill="solid" expand="block" @click="login(provider)">
            <ion-icon slot="start" :icon="ioniconsLogoMicrosoft" />
            Login with Microsoft
          </ion-button>
          <template v-if="provider.type === 'email'">
            <ion-input
              v-model="state.user.email"
              fill="outline"
              label="Email"
              type="email"
              class="ion-touched mb-4"
              :class="validate.class.password"
              label-placement="floating"
              :error-text="validate.message.email"
            />

            <ion-input
              v-model="state.user.password"
              fill="outline"
              class="ion-touched"
              :class="validate.class.password"
              label="Password"
              type="password"
              label-placement="floating"
              :error-text="validate.message.password"
            />

            <ion-button fill="solid" expand="block" @click="login(provider)">
              Login
            </ion-button>
          </template>
        </template>
        <edge-error class="mx-0" :error="edgeFirebase.user.logInErrorMessage" />
      </template>
      <template v-if="props.type === 'register'">
        <template v-for="(provider, index) in props.providers" :key="index">
          <div v-if="index > 0" class="relative flex py-2 items-center">
            <div class="flex-grow border-t" />
            <span class="flex-shrink mx-4">or</span>
            <div class="flex-grow border-t" />
          </div>
          <ion-button fill="solid" expand="block" @click="state.registerProviderType = provider.type">
            <ion-icon v-if="provider.type === 'microsoft'" slot="start" :icon="ioniconsLogoMicrosoft" />
            <ion-icon v-if="provider.type === 'email'" slot="start" :icon="ioniconsMail" />
            Register with {{ provider.type }}
            <ion-icon v-if="state.registerProviderType === provider.type" slot="end" :icon="ioniconsCheckmark" />
          </ion-button>
        </template>
        <template v-if="state.registerProviderType === 'email'">
          <div class="relative flex py-5 items-center">
            <div class="flex-grow border-t" />
            <span class="flex-shrink mx-4">Choose email and password</span>
            <div class="flex-grow border-t" />
          </div>

          <ion-input
            v-model="state.user.email"
            fill="outline"
            label="Email"
            type="email"
            class="ion-touched mb-4"
            :class="validate.class.email"
            label-placement="floating"
            :error-text="validate.message.email"
          />

          <ion-input
            v-model="state.user.password"
            fill="outline"
            label="Password"
            type="password"
            class="ion-touched"
            :class="validate.class.password"
            label-placement="floating"
            :error-text="validate.message.password"
          />
        </template>

        <div class="relative flex py-5 items-center">
          <div class="flex-grow border-t" />
          <span class="flex-shrink mx-4">Your information</span>
          <div class="flex-grow border-t" />
        </div>

        <ion-input
          v-for="(value, key) in metaFields"
          :key="key"
          v-model="state.user.meta[key]"
          fill="outline"
          :label="value.pretty"
          :type="value.type"
          class="ion-touched"
          :class="validate.class[`meta.${key}`]"
          label-placement="floating"
          :error-text="validate.message[`meta.${key}`]"
        />
        <div class="relative flex pt-5 pb-2 items-center">
          <div class="flex-grow border-t" />
          <span class="flex-shrink mx-4">Organization</span>
          <div class="flex-grow border-t" />
        </div>

        <ion-radio-group v-model="state.showRegistrationCode">
          <ion-item>
            <ion-radio :value="false" aria-label="Create New Organization">
              Create New Organization
            </ion-radio>
          </ion-item>
          <ion-item>
            <ion-radio :value="true" aria-label="Join Existing Organization">
              Join Existing Organization
            </ion-radio>
          </ion-item>
        </ion-radio-group>

        <ion-input
          v-if="state.showRegistrationCode"
          v-model="state.user.registrationCode"
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
          v-model="state.user.dynamicDocumentFieldValue"
          fill="outline"
          label="Choose an organization name"
          type="text"
          class="ion-touched mt-4"
          :class="validate.class.dynamicDocumentFieldValue"
          label-placement="floating"
          :error-text="validate.message.dynamicDocumentFieldValue"
        />

        <ion-button class="mt-2" fill="solid" expand="block" @click="register()">
          Register
        </ion-button>
      </template>
      <edge-error class="mx-0" :error="state.registerError" />
    </ion-card-content>
  </ion-card>
</template>

<style lang="scss" scoped>

</style>
