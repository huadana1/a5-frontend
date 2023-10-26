<script setup lang="ts">
import { fetchy } from '../../utils/fetchy';


const props = defineProps(['user2']);
const emit = defineEmits(["openChat"]);

async function acceptFriendRequest() {
    try {
        await fetchy(`/api/friend/accept/${props.user2}`, "PATCH", {
            body: { update: {status: "accepted"} },
        });
    }
    catch (_) {
        return;
    }
}

async function rejectFriendRequest() {
    try {
        await fetchy(`/api/friend/reject/${props.user2}`, "PATCH", {
            body: { update: {status: "rejected"} },
        });
    }
    catch (_) {
        return;
    }
}
</script>

<template>
    <main>
        <!-- accept reject buttons -->
        <div class="actionButtons">
            <button id="accept" @click="acceptFriendRequest">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
            </button>

            <button id="reject" @click="rejectFriendRequest">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-x-lg" viewBox="-2 -2 20 20">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
            </button>
        </div>


        <!-- chat div content -->
        <div class="chatDiv">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-chat-left-dots" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                    <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>

            <p>{{ props.user2 }}</p>
        </div>
    </main>
</template>

<style scoped>
    h3 {
        margin: 2px;
    }

    main {
        width: 100%;
        height: 10%;
        width: 100%;
        height: 10%;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    main:hover {
        background-color: beige;
    }
    
    .actionButtons {
        width: 30%;
        display: flex;
        justify-content: space-evenly;
    }

    .actionButtons button {
        padding: 0;
        border: 0px;
        border-radius: 2px;
    }

    #accept {
        background-color: blue;
        color: white;
    }

    #reject {
        background-color: red;
        color: white;
    }

    .chatDiv {
        width: 100%;
        height: 10%;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    .chatDiv p {
        margin-left: 4px;
    }

    .chatDiv svg {
        margin-left: 12px;
    }
</style>