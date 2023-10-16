<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { logoutUser, updateSession } = useUserStore();
const { isLoggedIn } = storeToRefs(useUserStore());

async function logout() {
  await logoutUser();
  void updateSession();
  void router.push({ name: "Login" });
}
</script>

<template>
    <div class="pure-controls">
    <button v-if="isLoggedIn" type="submit" class="pure-button pure-button-primary" v-on:click="logout">Logout</button>
    </div>
</template>

<style scoped>
h3 {
  display: flex;
  justify-content: center;
}
</style>
