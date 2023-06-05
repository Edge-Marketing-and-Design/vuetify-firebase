export default defineNuxtRouteMiddleware(async () => {
  // EDGE START
  const auth: any = edgeState.value
  if (auth) {
    if (!auth.preLoginRoute) {
      auth.preLoginRoute = window.location.pathname
    }

    if (!auth.user) {
      return '/login'
    }
    if (!auth.user.loggedIn) {
      return '/login'
    }
  }
  else {
    return '/login'
  }
  // EDGE END
})
