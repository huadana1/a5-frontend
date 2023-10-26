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
    <section v-if="loaded">
        <h2>All Chats</h2>
        <section>
            <h3>Waiting for you to accept</h3>
            <ActionableChat v-for="chat in actionablePendingInbox" @click ="openSelectedChat(chat)" :user2="getOtherUser(chat)"></ActionableChat>
        </section>
        

        <section>
            <h3>Waiting for friend to accept</h3>
            <NonActionableChat v-for="chat in nonActionablePendingInbox" @click ="openSelectedChat(chat)" :user2="getOtherUser(chat)"></NonActionableChat>
        </section>

        <section>
            <h3>Chats with friends</h3>
            <NonActionableChat v-for="chat in fullInbox" @click ="openSelectedChat(chat)" :user2="getOtherUser(chat)"></NonActionableChat>
        </section>
    </section>
</template>