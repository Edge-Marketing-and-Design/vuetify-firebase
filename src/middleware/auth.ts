export default defineNuxtRouteMiddleware(async () => {
  // EDGE START
  if (!edgeState.preLoginRoute) {
    edgeState.preLoginRoute = window.location.pathname
  }
  const edgeFirebase: any = { user: edgeState.user }
  if (!edgeFirebase.user) {
    return '/app/login'
  }
  if (!edgeFirebase.user.loggedIn) {
    return '/app/login'
  }
  // EDGE END
})
