export const edgeState = reactive({
  currentOrganization: '',
  organizationDocPath: '',
  organizations: [],
  changeTracker: {},
  user: null,
  preLoginRoute: '',
  userRoles: [],
})

export const setOrganization = async (organization: string, edgeFirebase: any) => {
  if (organization) {
    edgeState.changeTracker = {}
    localStorage.setItem('organizationID', organization)
    edgeState.currentOrganization = organization
    globalState.sitesCollectionPath = `organizations/${organization}/sites`
    globalState.sitesLogsCollectionPath = `organizations/${organization}/log`
    globalState.apiKeysCollectionPath = `organizations/${organization}/apiKeys`
    await edgeFirebase.startSnapshot(globalState.sitesCollectionPath)
    await edgeFirebase.startSnapshot(globalState.apiKeysCollectionPath)
    await edgeFirebase.startUsersSnapshot(`organizations/${organization}`)
    startLogSnapshot(72, edgeFirebase)
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

interface UserRoleType {
  name: string
  roles: { collectionPath: string; role: string }[]
}

interface RoleType {
  collectionPath: string
  role: string
}

export const orgUserRoles = (orgId: string) => {
  orgId = orgId.replaceAll('/', '-')
  const orgPath = `organizations-${orgId}`
  // Create a copy of the data to avoid mutating the original array
  const newData = JSON.parse(JSON.stringify(edgeState.userRoles))

  // Iterate over each object in the array
  for (let i = 0; i < newData.length; i++) {
    const roles = newData[i].roles

    // Iterate over each role in the roles array
    for (let j = 0; j < roles.length; j++) {
      const role = roles[j]

      // Replace 'organizationDocPath' in the collectionPath property with orgName
      role.collectionPath = role.collectionPath.replace(/organizationDocPath/g, orgPath)
    }
  }

  return newData
}

export const getRoleName = (roles: RoleType[], orgId: string) => {
  const userRoles: UserRoleType[] = orgUserRoles(orgId)
  for (const user of userRoles) {
    let match = true
    for (const userRole of user.roles) {
      if (!roles.some(role => role.collectionPath === userRole.collectionPath && role.role === userRole.role)) {
        match = false
        break // exit the loop as soon as a non-match is found
      }
    }
    if (match) {
      return user.name
    }
  }
  return 'Unknown'
}
