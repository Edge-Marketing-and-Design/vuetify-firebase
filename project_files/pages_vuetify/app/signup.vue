<script setup>
const config = useRuntimeConfig()
const auth = useState('auth')
const preLoginRoute = useState('preLoginRoute')
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" class="fill-height" justify="center">
      <v-col cols="12" class="center-align" sm="8" md="6">
        <edge-auth v-model:auth="auth" type="register" :pre-login-route="preLoginRoute" :registration-code="config.public.registrationCode" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>

</style>
