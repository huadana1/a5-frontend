<script setup lang="ts">
import Modal from '@/components/UtilComponents/Modal.vue';
import { ref } from "vue";
import GalleryModalContent from './GalleryModalContent.vue';

const isModalVisible = ref(false)

async function showModal() {
    isModalVisible.value = true
}

async function closeModal() {
    isModalVisible.value = false
}
</script>

<template>
    <button type="button" class="btn" v-on:click="showModal" id = 'showModalButton'>
      <img src="../../assets/images/imagesIcon.svg" alt="Bootstrap" width="30" height="30"> 
      Open Gallery!
    </button>

      <Modal
        v-show="isModalVisible"
        v-on:closed-modal="closeModal"
      >
      
        <template v-slot:header>
          Gallery
        </template>

        <template v-slot:body>
          <div class="galleries">
            <GalleryModalContent v-for = "galleryName in [{galleryName: 'Audio'}, {galleryName: 'Video'}]" v-bind="galleryName"/>
          </div>
        </template>

      </Modal>
</template>

<style scoped>
#showModalButton {
    border: 0.25px solid lightgray;
    margin: 16px;
    background-color: white;
    padding: 4px;
}

#showModalButton:hover {
    background-color: lightblue;
    cursor: pointer;
}

.galleries {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}
</style>
