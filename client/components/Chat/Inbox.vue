<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, onBeforeUpdate, onUnmounted, onUpdated, ref } from "vue";
import ActionableChat from "./ActionableChat.vue";
import NonActionableChat from "./NonActionableChat.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let intervalTimer: NodeJS.Timeout;
const emit = defineEmits(["openChat"]);

const actionablePendingInbox = ref<Array<Record<string, string>>>([]);
const nonActionablePendingInbox = ref<Array<Record<string, string>>>([]);
const fullInbox = ref<Array<Record<string, string>>>([]);

async function getChats() {
    try {
        const inbox: Array<Record<string, string>> = await fetchy(`/api/chats`, "GET", {});
        const requestsSent: Array<string> = (await fetchy(`/api/friend/requests/from`, 'GET', {})).map((record: any) => {return record.to});
        const requestsReceived: Array<string> = (await fetchy(`/api/friend/requests/to`, 'GET', {})).map((record: any) => {return record.from});


        nonActionablePendingInbox.value = inbox.filter(chat => chat.status === 'pending' && requestsSent.includes(getOtherUser(chat)));
        actionablePendingInbox.value = inbox.filter(chat => chat.status === 'pending' && requestsReceived.includes(getOtherUser(chat)));
        fullInbox.value = inbox.filter(chat => chat.status == 'full');

    }
    catch (_) {
        return;
    }
}

function getOtherUser(chat: Record<string, string>) {
    return chat.user1 == currentUsername.value ? chat.user2 : chat.user1;
}

async function openSelectedChat(chat: Record<string, string>) {
    const otherUser = getOtherUser(chat);
    emit("openChat", otherUser)
}


onBeforeMount(async () => {
  await getChats();
  loaded.value = true;
});

onBeforeUpdate(() => {
    clearInterval(intervalTimer);
})

onUpdated(async () => {
    if (isLoggedIn) {
        intervalTimer = setInterval(async () => {
            await getChats();    
        }, 1000)
    }
})

onUnmounted(() => {
    clearInterval(intervalTimer);
})

</script>

<template>
    <h1>All Chats</h1>
    <section v-if="loaded">
        <!-- <button v-for="chat in inbox" v-on:click="openSelectedChat" :value="chat.user1 == currentUsername ? chat.user2 : chat.user1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left-dots" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>

            {{chat.user1 == currentUsername ? chat.user2 : chat.user1}}
        </button> -->
        <h3>Waiting for you to accept</h3>
        <ActionableChat v-for="chat in actionablePendingInbox" @click ="openSelectedChat(chat)" :user2="getOtherUser(chat)"></ActionableChat>

        <h3>Waiting for friend to accept</h3>
        <NonActionableChat v-for="chat in nonActionablePendingInbox" @click ="openSelectedChat(chat)" :user2="getOtherUser(chat)"></NonActionableChat>

        <h3>Chats with friends</h3>
        <NonActionableChat v-for="chat in fullInbox" @click ="openSelectedChat(chat)" :user2="getOtherUser(chat)"></NonActionableChat>
    </section>
</template>