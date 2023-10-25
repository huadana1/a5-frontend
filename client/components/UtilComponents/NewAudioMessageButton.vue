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
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-mic-fill" viewBox="0 0 16 16">
            <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"/>
            <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
        </svg>
    </button>

    <Modal
        v-show="isModalVisible"
        v-on:closed-modal="closeModal"
      >
      
        <template v-slot:header>
          Audio Message
        </template>

        <template v-slot:body>
          <audio controls>
            <source src="https://mcdn.podbean.com/mf/web/ksp8jy/Kirby_Smash_Bros_Melee_Tauntb9bqx.mp3" type="audio/mpeg">
  Your browser does not support the audio tag.
          </audio>
        </template>

      </Modal>
    
</template>