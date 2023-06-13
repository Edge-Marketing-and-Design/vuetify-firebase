<script setup>
const auth = useState('auth')
const preLoginRoute = useState('preLoginRoute')
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" class="fill-height" justify="center">
      <v-col cols="12" class="center-align" sm="8" md="6">
        <edge-auth v-model:auth="auth" :pre-login-route="preLoginRoute" type="login" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>

</style>
