<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, onUnmounted, ref } from "vue";

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

onBeforeMount(async () => {
  intervalTimer = setInterval(async () => {await getItems(props.galleryName);}, 1000);
  loaded.value = true;
});

onUnmounted(() => {
    clearInterval(intervalTimer);
})
</script>

<template>
    <section v-if="loaded" class="gallery">
        <h1> {{ props.galleryName }}</h1>
        <div class="allItems">
            <div class="singleItem" v-for="item in galleryItems">
                <p class="itemLink"> {{ item.item }}</p>
                <audio controls v-if="props.galleryName === 'Audio'" type="audio/mpeg" :src="item.item"></audio> 
                <iframe v-if="props.galleryName === 'Video'" :src="item.item" width="267" height="200"></iframe>
            </div>
        </div>
    </section>
    <p v-else>Loading...</p>
</template>

<style scoped>
h1 {
    margin: 2px;
    border-bottom: 1px solid lightgray;
}

.gallery {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin: 16px;
}
.allItems {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
    overflow-x: scroll;
}
.singleItem {
    width: 270px;
    word-wrap: break-word;
    margin-left: 4px;
    margin-right: 4px;
    border-radius: 2px;
}

.itemLink {
    margin-bottom: 2px;
    text-align: center;
    font-size: 14px;
}

</style>