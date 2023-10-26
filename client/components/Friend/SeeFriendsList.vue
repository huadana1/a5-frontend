<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

import Modal from "../UtilComponents/Modal.vue";

const { logoutUser, updateSession } = useUserStore();
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const isModalVisible = ref(false)
const loaded = ref(false);
const friends = ref<Array<string>>([]);

async function showModal() {
  isModalVisible.value = true
  getFriends();
}

async function closeModal() {
  isModalVisible.value = false;
}

async function getFriends() {
  try {
    friends.value = await fetchy(`/api/friends`, "GET");
    loaded.value = true;
  } catch (_) {
    return;
  }
}
</script>

<template>
  <button
  type="button"
  class="btn"
  v-on:click="showModal"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
    </svg>
    See All Friends
  </button>

  <Modal v-show="isModalVisible" v-on:closed-modal="closeModal">
    <template v-slot:header>
          All Friends
    </template>

    <template v-slot:body>
        <template v-if="loaded">
            <p v-for="friend in friends">{{ friend }}</p>
        </template>
        <template v-else>
            <p>Loading...</p>
        </template>
    </template>
  
  </Modal>
</template>

<style scoped>
button {
  height: 30px;
  width: 175px;
}

button svg {
  margin-right: 8px;
  margin-left: 0px;
}
</style>