<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

import Modal from "../UtilComponents/Modal.vue";
import NewAudioMessageButton from "../UtilComponents/NewAudioMessageButton.vue";
import NewVideoMessageButton from "../UtilComponents/NewVideoMessageButton.vue";
import SearchFriend from "./SearchFriend.vue";

const { logoutUser, updateSession } = useUserStore();
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const isModalVisible = ref(false)
const isValidNewFriend = ref(false)
const messageType = ref('')
const message = ref('')
const friendToAdd = ref('')

async function showModal() {
  isModalVisible.value = true
}

async function closeModal() {
  isModalVisible.value = false;
  isValidNewFriend.value = false;
  messageType.value = "";
  message.value = "";
  friendToAdd.value = "";
}

async function checkValidNewFriend(username: string) {
  // user must not be self
  if ( username == currentUsername.value) {
    console.log('cannot add yourself as a friend');
    return;
  }

  const query: Record<string, string> = {username}
  const user = await fetchy(`/api/users/${username}`, "GET", {query})

  // user must exist
  if (!user) {
    console.log("username not found");
    isValidNewFriend.value = false;
  } else {
    // must not already be friends
    // must not already have sent a request
    const friends = await fetchy("/api/friends", "GET", {})
    const friendRequests = await fetchy("/api/friend/requests", "GET", {}).then((friendRequestData: any[]) => friendRequestData.reduce((reqs: string[], requestedFriend: any) => {
      return [...reqs, requestedFriend.to, requestedFriend.from]
    }, []))

    if (friends.includes(username)) {
      console.log("you are already friends with ", username);
      isValidNewFriend.value = false;
      friendToAdd.value = ""
    }
    else if (friendRequests.includes(username)) {
      console.log("you already sent a friend request to ", username);
      isValidNewFriend.value = false;
      friendToAdd.value = ""
    }
    else {
      isValidNewFriend.value = true;
      friendToAdd.value = username;
    }
  }
}

function handleMessageUploaded(messageLink: string, type: "Video" | "Audio") {
  messageType.value = type;
  message.value = messageLink;
  console.log(message.value)
}

async function addFriend() {
  try {
    await fetchy(`/api/friend/requests/${friendToAdd.value}`, "POST", {
      body: { to: friendToAdd.value, message: message.value, messageType: messageType.value },
    });
    closeModal();
  } catch (_) {
    return;
  }
}
</script>

<template>
  <button
  type="button"
  class="btn"
  v-on:click="showModal"
  >
    <img src="../../assets/images/person-fill-add-icon.svg" alt="Bootstrap" width="15" height="15"> Add Friend
  </button>

  <Modal v-show="isModalVisible" v-on:closed-modal="closeModal">
    <template v-slot:header>
          Add Friend
    </template>

    <template v-slot:body>
          <SearchFriend @search-user="checkValidNewFriend"/>

          <template v-if="isValidNewFriend">
            <NewAudioMessageButton v-on:message-uploaded="handleMessageUploaded"/>
            <NewVideoMessageButton v-on:message-uploaded="handleMessageUploaded"/>
            <p>Say hello to your new friend!</p>

            <!-- render message -->
            <iframe v-if="messageType == 'Video'" width="420" height="315" :src="message"></iframe>
            <audio controls v-if="messageType == 'Audio'">
              <source :src="message" type="audio/mpeg">
              Your browser does not support the audio tag.
            </audio>

            <!-- submit message -->
            <button v-if="message" type="submit" class="pure-button-primary pure-button" @click="addFriend">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
              Add friend and start new chat</button>
          </template>
        
          
    </template>
  
  </Modal>
</template>