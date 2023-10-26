<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";


import Gallery from "@/components/Gallery/Gallery.vue";
import Inbox from "../components/Chat/Inbox.vue";
import MessagingWindow from "../components/Chat/MessagingWindow.vue";
import AddFriend from "../components/Friend/AddFriend.vue";


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
    <!-- <h1>Home Page</h1> -->
    <!-- <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section> -->

    <!-- left panel -->
    <section class="left-panel">
      <h1> Hi {{ currentUsername }}!</h1>
      <!-- gallery button -->
      <Gallery/>

      <AddFriend/>
      <Inbox @open-chat="openChat"/>
      <!-- <LogoutButton v-if="isLoggedIn"/> -->
      <button class="pure-button pure-button-primary" v-if="isLoggedIn" @click="logout">Logout</button>

    </section>

    <!-- basically just the chat window -->
    <section class="right-panel">
      <MessagingWindow :user2="chattingWith"/>
    </section>


  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

main {
  margin: 0;
  height: 100vh;
  width: 100vh;
  box-sizing: border-box;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.left-panel {
  margin: 0;
  padding: 8px;
  width: 45%;
  min-height: 100vh;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  background-color: lightgray;
}

.right-panel {
  margin: 0;
  padding: 8px;
  width: 55%;
  height: 100vh;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
