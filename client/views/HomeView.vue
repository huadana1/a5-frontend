<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";

import Inbox from "../components/Chat/Inbox.vue";
import MessagingWindow from "../components/Chat/MessagingWindow.vue";
import AddFriend from "../components/Friend/AddFriend.vue";
import SeeFriendsList from "../components/Friend/SeeFriendsList.vue";
// import Gallery from "../components/Gallery/Gallery.vue";


const { logoutUser } = useUserStore();

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const chattingWith = ref('')

function openChat(user: string) {
  chattingWith.value = user;
}

async function logout() {
  await logoutUser();
  void router.push({ name: "Login" });
}

</script>

<template>
  <main>
    <!-- left panel -->
    <section class="left-panel">
      <h1> Hi, {{ currentUsername }}!</h1>

      <!-- buttons at top -->
      <section class="panelButtons">
        <!-- <Gallery/> -->
        <AddFriend/>
        <SeeFriendsList/>
      </section>

      <!-- all the chat messages -->
      <section class = "chats">
        <Inbox @open-chat="openChat"/>
      </section>

      <!-- logout button -->
      <button class="pure-button pure-button-primary" v-if="isLoggedIn" @click="logout">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
          <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
        </svg>
        Logout
      </button>

    </section>

    <!-- basically just the chat window -->
    <section class="right-panel">
      <MessagingWindow :user2="chattingWith"/>
    </section>
  </main>
</template>

<style scoped>
h1 {
  align-self: flex-start;
}

main {
  margin: 0;
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.left-panel {
  margin: 0;
  padding: 8px;
  width: 25vw;
  min-height: 100vh;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  background-color: lightblue;
}

.panelButtons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 10%;
}

.chats {
  height: 80%;
  width: 100%;
}

.right-panel {
  margin: 0;
  padding: 8px;
  width: 75vw;
  height: 100vh;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
