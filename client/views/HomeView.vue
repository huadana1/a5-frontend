<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";

import LogoutButton from "@/components/Logout/LogoutButton.vue";
import Modal from '@/components/UtilComponents/Modal.vue';

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const isModalVisible = ref(false)

async function showModal() {
  isModalVisible.value = true
}

async function closeModal() {
  isModalVisible.value = false
}
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
      <LogoutButton v-if="isLoggedIn"/>
    </section>
    <!-- <PostListComponent /> -->
    <section>
      <button
      type="button"
      class="btn"
      v-on:click="showModal"
      >
        Open Modal!
      </button>

      <Modal
        v-show="isModalVisible"
        v-on:closed-modal="closeModal"
      >
      
        <template v-slot:header>
          This is a new modal header.
        </template>

        <template v-slot:body>
          This is a new modal body.
        </template>

        <template v-slot:footer>
          This is a new modal footer.
        </template>

      </Modal>
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
