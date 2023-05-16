// DO NOT CHANGE THIS FILE
export const edgeState = reactive({
  currentOrganization: '',
  organizationDocPath: '',
  organizations: [],
  changeTracker: {},
  user: null,
  preLoginRoute: '',
})

export const setOrganization = async (organization: string, edgeFirebase: any) => {
  if (organization) {
    edgeState.changeTracker = {}
    localStorage.setItem('organizationID', organization)
    edgeState.currentOrganization = organization
    await edgeFirebase.startUsersSnapshot(`organizations/${organization}`)
    edgeState.organizationDocPath = `organizations/${organization}`
  }
}

export const isDarkMode = () => {
  if (window.matchMedia) {
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)')
    return darkMode.matches
  }
  return false
}

export const objHas = (obj: any, key: string): boolean => {
  if (obj === null) {
    return false
  }
  const keys = Object.keys(obj)
  if (keys.length === 0) {
    return false
  }
  return Object.prototype.hasOwnProperty.call(obj, key)
}

export const getOrganizations = async (edgeFirebase: any) => {
  const orgs: any = []
  if (edgeFirebase.user.loggedIn) {
    for (const role of edgeFirebase.user.roles) {
      const segments = role.collectionPath.split('-')
      if (segments[0] === 'organizations' && segments.length === 2) {
        edgeFirebase.startDocumentSnapshot('organizations', segments[1])
        const org = await edgeFirebase.getDocData('organizations', segments[1])
        orgs.push(org)
      }
    }
  }
  edgeState.organizations = orgs
}

export const dupObject = (obj: any): any => {
  return JSON.parse(JSON.stringify(obj))
}

export const currentOrganizationObject = computed(() => {
  const edgeFirebase: any = inject('edgeFirebase')
  if (edgeState.organizations.length > 0) {
    if (edgeState.currentOrganization) {
      return edgeFirebase.data[`organizations/${edgeState.currentOrganization}`]
    }
  }
  return ''
})

export const edgeRules = {
  required: (value: string) => {
    if (!value) {
      return 'This field is required.'
    }
    return true
  },
  email: (value: string) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Invalid e-mail.'
  },
  password: (value: string) => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return pattern.test(value) || 'Password must have at least 8 characters, including uppercase and lowercase letters, numbers, and a special character'
  },
}

export const edgeLogOut = async (edgeFirebase: any) => {
  const router = useRouter()
  edgeState.currentOrganization = ''
  edgeState.organizationDocPath = ''
  edgeState.organizations = []
  edgeState.changeTracker = {}
  edgeState.user = null
  await edgeFirebase.logOut()
  await router.push('/app/login')
}
