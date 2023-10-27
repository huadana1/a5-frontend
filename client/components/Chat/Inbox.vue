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

const selectedChat = ref('');
const selected = 'selected';
const notSelected = '';

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
    selectedChat.value = otherUser;
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
    <section class='allChats' v-if="loaded">
        <h2>All Chats</h2>
        <section class="actionableChats">
            <h3>Waiting for you to accept</h3>
            <ActionableChat v-for="chat in actionablePendingInbox" @click ="openSelectedChat(chat)" :user2="getOtherUser(chat)" :class="selectedChat == getOtherUser(chat) ? selected : notSelected"></ActionableChat>
            <p v-if="actionablePendingInbox.length == 0">No new friend requests waiting for you!</p>
        </section>
        
        <section class="fullChats">
            <h3>Chats with friends</h3>
            <NonActionableChat v-for="chat in fullInbox" @click ="openSelectedChat(chat)" :user2="getOtherUser(chat)" :class="selectedChat == getOtherUser(chat) ? selected : notSelected"></NonActionableChat>
            <p v-if="fullInbox.length == 0">No chats with friends yet!</p>
        </section>

        <section class="nonactionableChats">
            <h3>Waiting for friend to accept</h3>
            <NonActionableChat v-for="chat in nonActionablePendingInbox" @click ="openSelectedChat(chat)" :user2="getOtherUser(chat)" :class="selectedChat == getOtherUser(chat) ? selected : notSelected"></NonActionableChat>
            <p v-if="nonActionablePendingInbox.length == 0">No new friend requests sent!</p>
        </section>

    </section>
</template>

<style scoped>
h3 {
    border-bottom: 1px solid white;
    margin: 0px;
}

h2 {
    margin-bottom: 1px;
}

.nonactionableChats, .actionableChats, .fullChats {
    margin: 4px;
    padding-left: 2px;
    padding-right: 2px;
    overflow-y: auto;

}

.allChats {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    /* height: 100%; */
}

.section {
    margin: 8px;
}

.selected {
    background-color: beige;
    border-radius: 1px;
}

</style>