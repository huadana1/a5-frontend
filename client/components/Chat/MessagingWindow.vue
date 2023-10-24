<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onBeforeMount, ref, watchEffect } from 'vue';
import { useUserStore } from '../../stores/user';
import { fetchy } from '../../utils/fetchy';
import Gallery from '../Gallery/Gallery.vue';
import NewAudioMessageButton from '../UtilComponents/NewAudioMessageButton.vue';
import NewVideoMessageButton from '../UtilComponents/NewVideoMessageButton.vue';

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const props = defineProps(['user2'])
const loaded = ref(false);
const messages = ref<Array<Record<string, string>>>([])

async function getChatMessages(user: string) {
    try {
        messages.value = await fetchy(`/api/chats/chat/${user}`, "GET", {})
        // messages.value = [{'item':'alkfj'}, {'item': 'akdjflak'}, {'item': 'cnalfj'}]
    }
    catch (_) {
        return;
    }
}

watchEffect(async () => {
    // will log whenever the props change
    console.log(props.user2)
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
        <NewAudioMessageButton/>
        <NewVideoMessageButton/>
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