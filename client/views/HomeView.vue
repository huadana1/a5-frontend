<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";


import Gallery from "@/components/Gallery/Gallery.vue";
import LogoutButton from "@/components/Logout/LogoutButton.vue";
import Inbox from "../components/Chat/Inbox.vue";
import MessagingWindow from "../components/Chat/MessagingWindow.vue";
import AddFriend from "../components/Friend/AddFriend.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const chattingWith = ref('')

function openChat(user: string) {
  console.log(user)
  chattingWith.value = user;
}

</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
      <LogoutButton v-if="isLoggedIn"/>
    </section>

    <!-- left panel -->
    <section class="left-panel">
      <!-- gallery button -->
      <Gallery/>

      <AddFriend/>
      <Inbox @open-chat="openChat"/>
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
</style>
