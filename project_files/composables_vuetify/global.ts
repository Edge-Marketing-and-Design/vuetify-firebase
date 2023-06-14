export const globalState = reactive({
  drawer: false,
  dark: true,
})

export const projectSetOrg = async (organization: string, edgeFirebase: any) => {
  // set Organization Paths and start snapshots here
}

export const logOut = async (edgeFirebase: any, edgeGlobal: any) => {
  globalState.drawer = false
  await edgeGlobal.edgeLogOut(edgeFirebase)
}
