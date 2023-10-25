<script setup lang="ts">
import Modal from '@/components/UtilComponents/Modal.vue';
import { ref } from "vue";

const isModalVisible = ref(false)

async function showModal() {
    isModalVisible.value = true
}

async function closeModal() {
    isModalVisible.value = false
}
</script>

<template>
    <button @click="showModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera-video-fill" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5z"/>
        </svg>
    </button>

    <Modal
        v-show="isModalVisible"
        v-on:closed-modal="closeModal"
      >
      
        <template v-slot:header>
          Video Message
        </template>

        <template v-slot:body>
          <!-- add body -->
            <iframe width="420" height="315"
            src="https://youtu.be/FJrSNirYBwo">
            </iframe>
        </template>

      </Modal>
</template>