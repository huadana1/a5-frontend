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
    <button type="button" class="btn" v-on:click="showModal">
        <img src="../../assets/images/imagesIcon.svg" alt="Bootstrap" width="15" height="15"> Open Gallery!
      </button>

      <Modal
        v-show="isModalVisible"
        v-on:closed-modal="closeModal"
      >
      
        <template v-slot:header>
          Gallery
        </template>

        <template v-slot:body>
          <GalleryModalContent v-for = "galleryName in [{galleryName: 'Audio'}, {galleryName: 'Video'}]" v-bind="galleryName"/>
        </template>

        <template v-slot:footer>
          This is a new modal footer.
        </template>

      </Modal>
</template>