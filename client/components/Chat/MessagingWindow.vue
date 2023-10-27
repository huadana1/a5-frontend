<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onBeforeMount, onBeforeUpdate, onUnmounted, onUpdated, ref, watchEffect } from 'vue';
import { useUserStore } from '../../stores/user';
import { fetchy } from '../../utils/fetchy';
import Gallery from '../Gallery/Gallery.vue';
import NewAudioMessageButton from '../UtilComponents/NewAudioMessageButton.vue';
import NewVideoMessageButton from '../UtilComponents/NewVideoMessageButton.vue';

const { currentUsername } = storeToRefs(useUserStore());
const sentClass = "sent singleMessage"
const receivedClass = "received singleMessage"

const props = defineProps(['user2'])
const loaded = ref(false);
const messages = ref<Array<Record<string, string>>>([])
let intervalTimer: NodeJS.Timeout;

async function getChatMessages(user: string) {
    try {
        messages.value = await fetchy(`/api/chats/chat/${user}`, "GET", {})
    }
    catch (_) {
        return;
    }
}

async function handleMessageUploaded(message: string, messageType: "Video" | "Audio") {
    try {
        await fetchy(`/api/chats/chat/${props.user2}`, "POST", {
            body: { to: props.user2, message, messageType },
        });
    } catch (_) {
        return;
    }
}

watchEffect(async () => {
    // will log whenever the props change
    if (props.user2) {
        await getChatMessages(props.user2);
        loaded.value = true; 
    }
  })

onBeforeMount(async () => {
    if (props.user2) {
        await getChatMessages(props.user2);
        loaded.value = true;
    }
});

onBeforeUpdate(() => {
    clearInterval(intervalTimer);
})

onUpdated(async () => {
    if (props.user2) {
        intervalTimer = setInterval(async () => {
            await getChatMessages(props.user2); 
        }, 1000)
    }
})

onUnmounted(() => {
    clearInterval(intervalTimer);
})

</script>

<template>
    <!-- name of user chatting with -->
    <h1 class="usernameHeader">{{ props.user2 }}</h1>
    
    <div class = 'bottomPart'>
        <!-- send a new message -->
        <section class="messageInput" v-if="props.user2">
            <div class="messageButtonInputs">
                <NewAudioMessageButton @message-uploaded="handleMessageUploaded"/>
                <NewVideoMessageButton @message-uploaded="handleMessageUploaded"/>
            </div>
            <Gallery id="galleryButton"/>
        </section>

        <!-- old messages -->
        <section class="oldMessages" v-if="loaded" >
            <div v-for="message in messages" :class="message.from === currentUsername ?  sentClass : receivedClass">
                <p id="messageUser">{{ message.from }}</p>
                <audio controls v-if="message.messageType === 'Audio'" type="audio/mpeg" :src="message.message"> {{ message.message }}</audio> 
                <iframe v-if="message.messageType === 'Video'" :src="message.message" width="420" height="315"></iframe>
            </div>
            
        </section>

        <p v-else-if="!props.user2" class="notReady">No chat selected. If there are no chats, add a new friend to make a chat!</p>
        <p v-else class="notReady">Loading...</p>

        
    </div>
</template>

<style scoped>

.bottomPart {
    width: 100%;
    height: 90%;
    display: flex;
}
.usernameHeader {
    display: flex;
    align-items: center;
    width: 99%;
    border-bottom: 1px solid lightgray;
    margin: 0;
    margin-left: 4px;
    height: 10%;
}

.oldMessages {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow-y: scroll;
    width: 90%;
    max-height: 100%;
}
.sent {
    color: blue;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    align-self: flex-end;
}
.received {
    color: red;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-self: flex-start;
}
.messageInput {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    border-right: 1px solid lightgray;
    padding: 8px;
    width: 10%;
    max-height: 100%;
    background-color: beige;
}

.messageButtonInputs {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin: auto;
}

#galleryButton {
    display: flex;
    justify-self: flex-end;
}
.singleMessage {
    border-radius: 2em;
    width: 30vw;
    margin: 0;
    padding: 8px;
}
.notReady {
    font-size: 2em;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80%;
    width: 100%;
}

#messageUser {
    margin-bottom: 2px;
}
</style>