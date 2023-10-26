<script setup lang="ts">
import Modal from '@/components/UtilComponents/Modal.vue';
import { ref } from "vue";

const isModalVisible = ref(false)
const audioLink = ref("")
const audioInput = ref()
const errorMessage = ref("")
const emit = defineEmits(["messageUploaded"]);

async function showModal() {
    isModalVisible.value = true
}

async function closeModal() {
    isModalVisible.value = false;
    audioLink.value = "";
}

function updateAudioLink() {
    const re = new RegExp(/^https?:\/\/.*(\.mp3|\.m4a)/);
    if (re.test(audioInput.value.value)) {
        errorMessage.value = '';
        audioLink.value = audioInput.value.value;
    } else {
        errorMessage.value = "Audio link was not supported. Please make sure your link starts with 'http' or 'https' and ends with '.mp3' or '.m4a' "
    }
}

async function useAudioMessage() {
    emit("messageUploaded", audioLink.value, "Audio");
    await closeModal();
}
</script>

<template>
    <button @click="showModal" id="audioButton">
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-mic-fill" viewBox="0 0 16 16">
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
            <section>
                <div class="instructions">
                    <p>Input a link to an online audio file download ending with '.mp3'</p>
                    <p>Ex. https://mcdn.podbean.com/mf/web/ksp8jy/Kirby_Smash_Bros_Melee_Tauntb9bqx.mp3</p>
                </div>

                <div class="inputGroup">
                    <input
                    class="input"
                    type="text"
                    placeholder="https://mcdn.podbean.com/mf/web/ksp8jy/Kirby_Smash_Bros_Melee_Tauntb9bqx.mp3"
                    ref="audioInput"
                    />
                    <button @click="updateAudioLink">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16">
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                            <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                        </svg>
                    </button>
                </div>
            </section>

            <p v-if="errorMessage"> {{ errorMessage }}</p>

            <audio v-if="audioLink" controls>
                <source :src="audioLink" type="audio/mpeg">
                Your browser does not support the audio tag.
            </audio>

            <button  v-if="audioLink" type="submit" class="pure-button-primary pure-button" @click="useAudioMessage">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                </svg>
                Send this audio
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

</style>