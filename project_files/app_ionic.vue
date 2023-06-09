<script setup>
import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'

const edgeFirebase = inject('edgeFirebase')
const edgeGlobal = inject('edgeGlobal')
edgeFirebase.runFunction('initFirestore', {})
const router = useRouter()
const route = useRoute()
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')

function parseQueryString(queryString) {
  const obj = {}

  queryString.split('&').forEach((keyValuePair) => {
    const keyValue = keyValuePair.split('=')
    const key = decodeURIComponent(keyValue[0])
    const value = decodeURIComponent(keyValue[1] || '')
    if (key in obj) {
      if (Array.isArray(obj[key])) {
        obj[key].push(value)
      }
      else {
        obj[key] = [obj[key], value]
      }
    }
    else {
      obj[key] = value
    }
  })

  return obj
}

const state = reactive({
  deepLinkURL: import.meta.env.VITE_DEEP_LINK_URL + stringifyVueRoute(route),
  platform: Capacitor.getPlatform(),
  isOpen: false,
})

App.addListener('appUrlOpen', (event) => {
  let slug = event.url.split('.app/').pop()
  if (event.url.includes('.offcall://')) {
    slug = event.url.split('.offcall://').pop()
  }
  const path = `/${slug.split('?')[0]}`
  const query = slug.split('?')[1]
  const params = parseQueryString(query)
  if (slug) {
    router.push({ path, query: params })
  }
})

function openDeepLink() {
  state.isOpen = false
  window.location.href = state.deepLinkURL
  console.log(state.deepLinkURL)
}

onBeforeMount(() => {
  edgeState.value = edgeGlobal.edgeState
})

onMounted(async () => {
  if (!Capacitor.isNativePlatform()) {
    if (isMobileBrowser()) {
      if (isAndroidBrowser()) {
        state.isOpen = true
      }
      else {
        window.location.href = state.deepLinkURL
      }
    }
  }
  else {
    const { url } = await App.getLaunchUrl()
    const path = `/${url.split('?')[0]}`
    const query = url.split('?')[1]
    const params = parseQueryString(query)
    if (url) {
      router.push({ path, query: params })
    }
  }
})

const page = computed(() => {
  return route.nameedgeFirebase
})

edgeGlobal.edgeState.userRoles = [
  {
    name: 'Admin',
    roles: [
      {
        collectionPath: 'organizationDocPath',
        role: 'admin',
      },
    ],
  },
  {
    name: 'User',
    roles: [
      {
        collectionPath: 'organizationDocPath',
        role: 'user',
      },
    ],
  },
]
</script>

<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<style>
.firebase-emulator-warning { display: none; }
/* .page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
} */
</style>
