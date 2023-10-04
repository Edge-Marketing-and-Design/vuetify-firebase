<script setup>
</script>

<template>
  <v-container style="height: calc(100vh - 150px); overflow: scroll;" fluid>
    <v-row align="center" class="fill-height" justify="center">
      <v-col cols="12" class="center-align">
        <v-card
          class="mx-auto fill-height"
          max-width="344"
          variant="flat"
        >
          <v-container>
            <v-row
              class="fill-height"
              align-content="center"
              justify="center"
            >
              <v-col
                class="text-subtitle-1 text-center"
                cols="12"
              >
                Loading...
              </v-col>
              <v-col cols="6">
                <v-progress-linear
                  color="secondary"
                  indeterminate
                  rounded
                  height="12"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>

</style>
