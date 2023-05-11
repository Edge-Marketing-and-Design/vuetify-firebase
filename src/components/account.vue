<script setup>
// TODO: FIX MENU SO WORKS ON MOBILE
// TODO: HIDE ORGANIZATION SETTINGS IF DOESN'T HAVE PERMISSIONS
// TODO: HIDE ORGANIZATION MEMBERS IF  USERS COUNT IS 0
// TODO: IF BOTH HIDDEN HIDE WHOLE ORGANIZATION MENU
const route = useRoute()
const site = computed(() => {
  return route.params.site
})
</script>

<template>
  <v-card>
    <v-toolbar flat>
      <v-icon class="mx-4">
        mdi-account-group-outline
      </v-icon>
      {{ currentOrganizationObject.name }}
    </v-toolbar>
    <v-card-text>
      <v-row>
        <v-col cols="3">
          <v-card>
            <v-list :lines="false" density="compact" nav>
              <v-list-subheader class="">
                Organization
              </v-list-subheader>
              <v-list-item link to="/app/account/organization-settings">
                <v-list-item-title>Settings</v-list-item-title>
              </v-list-item>
              <v-list-item link to="/app/account/organization-members">
                <v-list-item-title>Members</v-list-item-title>
              </v-list-item>
            </v-list>
            <v-divider />

            <v-list :lines="false" density="compact" nav>
              <v-list-subheader class="">
                My Settings
              </v-list-subheader>
              <v-list-item link to="/app/account/my-profile">
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item>

              <v-list-item link to="/app/account/my-account">
                <v-list-item-title>Account</v-list-item-title>
              </v-list-item>
              <v-list-item link to="/app/account/my-organizations">
                <v-list-item-title>Organizations</v-list-item-title>
              </v-list-item>
            </v-list>

            <v-divider />
          </v-card>
        </v-col>
        <v-col cols="9">
          <edge-organization-settings v-if="site === 'organization-settings'" />
          <edge-my-account v-if="site === 'my-account'" />
          <edge-my-profile v-if="site === 'my-profile'" />
          <edge-organization-members v-if="site === 'organization-members'" />
          <edge-my-organizations v-if="site === 'my-organizations'" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
