export default defineNuxtRouteMiddleware(async () => {
  // EDGE START
  const auth: any = edgeState.value
  if (auth) {
    if (!auth.preLoginRoute) {
      auth.preLoginRoute = window.location.pathname
    }

    if (!auth.user) {
      return '/app/login'
    }
    if (!auth.user.loggedIn) {
      return '/app/login'
    }
  }
  else {
    return '/app/login'
  }
  // EDGE END
})
