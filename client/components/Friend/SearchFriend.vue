<script setup lang="ts">
import { ref } from "vue";

const username = ref("");
const emit = defineEmits(["searchUser"]);
</script>

<template>
  <form @submit.prevent="emit('searchUser', username)" class="pure-form">
    <fieldset>
      <!-- <legend>Add friend: {{ username }}</legend> -->
      <input id="author" type="text" v-model="username" placeholder="Username" />
      <button type="submit" class="pure-button pure-button-primary">Search for {{ username }}</button>
    </fieldset>
  </form>
</template>

<style scoped>
form {
  display: flex;
  gap: 0.5em;
  padding: 1em;
  align-items: center;
}
</style>
