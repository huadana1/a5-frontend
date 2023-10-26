<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onBeforeMount, onBeforeUpdate, onUnmounted, onUpdated, ref, watchEffect } from 'vue';
import { useUserStore } from '../../stores/user';
import { fetchy } from '../../utils/fetchy';
import Gallery from '../Gallery/Gallery.vue';
import NewAudioMessageButton from '../UtilComponents/NewAudioMessageButton.vue';
import NewVideoMessageButton from '../UtilComponents/NewVideoMessageButton.vue';

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

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
    <h1>{{ props.user2 }}</h1>

    <!-- old messages -->
    <section class="old-messages">
        <p v-if="loaded" v-for="message in messages" :class="{from: message.from == currentUsername, to: message.from != currentUsername}"> {{ message.message }}</p>
        <p v-else-if="!props.user2">No chat selected</p>
        <p v-else>Loading...</p>
    </section>

    <!-- send a new message -->
    <section class="message-input">
        <NewAudioMessageButton @message-uploaded="handleMessageUploaded"/>
        <NewVideoMessageButton @message-uploaded="handleMessageUploaded"/>
        <Gallery/>
    </section>
</template>

<style scoped>
.from {
    color: red;
}
.to {
    color: blue;
}
</style>