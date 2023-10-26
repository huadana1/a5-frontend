<script setup lang="ts">
import Modal from '@/components/UtilComponents/Modal.vue';
import { ref } from "vue";

const isModalVisible = ref(false)
const videoLink = ref("")
const videoInput = ref()
const emit = defineEmits(["messageUploaded"]);
const errorMessage = ref("")

async function showModal() {
    isModalVisible.value = true
}

async function closeModal() {
    isModalVisible.value = false
    videoLink.value = "";
}

function updateVideoLink() {
    const re = new RegExp(/^https?:\/\/www.(youtube|dailymotion).com\/embed\//);
    if (re.test(videoInput.value.value)) {
        errorMessage.value = '';
        videoLink.value = videoInput.value.value;
    } else {
        errorMessage.value = "Video link was not supported. Please make sure your video is hosted on youtube or dailymotion and that you are using the 'embed' link.";
    }
}

async function usevideoMessage() {
    emit("messageUploaded", videoLink.value, "Video");
    await closeModal();
}
</script>

<template>
    <button @click="showModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-camera-video-fill" viewBox="0 0 16 16">
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
            <section>
                <div class="instructions">
                    <p>Input an <b>embed</b> link to an online video.</p>
                    <p>Ex. https://www.youtube.com/embed/R-_CMhHLb-U?si=ZnklLw8v-olPwclX</p>
                </div>

                <div class = "inputGroup">
                    <input
                        class="input"
                        type="text"
                        placeholder="https://www.youtube.com/embed/R-_CMhHLb-U?si=ZnklLw8v-olPwclX"
                        ref="videoInput"
                    />
                    <button @click="updateVideoLink">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16">
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                            <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                        </svg>
                    </button>
                </div>
                <p v-if="errorMessage" id="errorMessage">{{ errorMessage }}</p>
            </section>



            <iframe v-if="videoLink" width="420" height="315" :src="videoLink"></iframe>

            <button  v-if="videoLink" type="submit" class="pure-button-primary pure-button" @click="usevideoMessage">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 10 15">
                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                </svg>
                Send this video
            </button>
        </template>

      </Modal>
</template>

<style scoped>
.instructions {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 8px;
    margin-bottom: 8px;
}

.instructions p {
    margin: 2px;
}
.inputGroup {
    display: flex;
    justify-content: center;
    width: 100%;
}

.inputGroup input {
    width: 50%;
}

#errorMessage {
    font-weight: bold;
}

</style>