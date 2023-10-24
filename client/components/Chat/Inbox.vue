<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());

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
            <SingleChatInbox :chat="chat" :value="chat"/>
        </button>
    </section>
</template>