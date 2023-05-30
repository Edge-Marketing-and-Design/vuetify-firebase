<script setup>

</script>

<template>
  <v-card
    class="mx-auto"
    max-width="344"
    variant="outlined"
  >
    <v-container style="height: 400px;">
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
</template>

<style lang="scss" scoped>

</style>
