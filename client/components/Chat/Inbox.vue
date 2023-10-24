<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
const emit = defineEmits(["openChat"]);
let inbox = ref<Array<Record<string, string>>>([]);

async function getChats() {
    try {
        inbox.value = await fetchy(`/api/chats`, "GET", {})
        // inbox.value = [{'item':'alkfj'}, {'item': 'akdjflak'}, {'item': 'cnalfj'}]
        console.log(inbox.value)
    }
    catch (_) {
        return;
    }
}

async function openSelectedChat(e: Event) {
    emit("openChat", ((e.target) as HTMLButtonElement).value)
}


onBeforeMount(async () => {
  await getChats();
  loaded.value = true;
});

</script>

<template>
    <h1>Chats with Friends</h1>
    <section v-if="loaded">
        <button v-for="chat in inbox" v-on:click="openSelectedChat">
            <!-- <SingleChatInbox :chat="chat" :value="chat"/> -->
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left-dots" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>

            {{chat.user1 == currentUsername ? chat.user2 : chat.user1}}
        </button>
    </section>
</template>