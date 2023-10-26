<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, onUnmounted, ref } from "vue";

const { loginUser, updateSession } = useUserStore();
const { isLoggedIn } = storeToRefs(useUserStore());

const emit = defineEmits(['closedModal']);
const props = defineProps(['galleryName']);

const loaded = ref(false);
let intervalTimer: NodeJS.Timeout;
let galleryItems = ref<Array<Record<string, string>>>([]);

async function getItems(galleryName: string) {
    let query: Record<string, string> = galleryName !== undefined ? { galleryName } : {};

    try {
        galleryItems.value = await fetchy(`/api/galleries/gallery/${galleryName}`, "GET", {query})
    }
    catch (_) {
        return;
    }
}

// async function getSingleItem(itemId: string) {
//     let query: Record<string, string> = itemId !== undefined ? { itemId } : {};

//     try {
//         return await fetchy(`/api/galleries/gallery/items/${itemId}`, "GET", {query})
//     }
//     catch (_) {
//         return;
//     }
// }

function handleItemSelected(e: Event) {
    const target = e.target
    if (target) {
        console.log((target as HTMLButtonElement).value)
    }
}

onBeforeMount(async () => {
  intervalTimer = setInterval(async () => {await getItems(props.galleryName);}, 1000);
  loaded.value = true;
});

onUnmounted(() => {
    clearInterval(intervalTimer);
})
</script>

<template>
    <h1> {{ props.galleryName }}</h1>
    <section v-if="loaded">
        <button v-for="item in galleryItems" :value="item.item" v-on:click='handleItemSelected'>{{item}}</button>
    </section>
    <p v-else>Loading...</p>
</template>