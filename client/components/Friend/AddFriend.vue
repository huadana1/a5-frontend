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

async function showModal() {
  isModalVisible.value = true
}

async function closeModal() {
  isModalVisible.value = false
}

async function checkValidNewFriend(username: string) {
  // user must not be self
  if ( username == currentUsername.value) {
    console.log('cannot add yourself as a friend');
    return;
  }

  const query: Record<string, string> = {username}
  const user = await fetchy(`/api/users/${username}`, "GET", {query})

  console.log(user)
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

    console.log(username, friends, friendRequests)

    if (friends.includes(username)) {
      console.log("you are already friends with ", username);
      isValidNewFriend.value = false;
    }
    else if (friendRequests.includes(username)) {
      console.log("you already sent a friend request to ", username);
      isValidNewFriend.value = false;
    }
    else {
      isValidNewFriend.value = true;
    }
  }
}

async function addFriend(username: string) {
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
            <NewAudioMessageButton/>
            <NewVideoMessageButton/>
            <p>Say hello to your new friend!</p>

            <!-- TODO: something something template with the message -->

            <!-- TODO: only show if message was recorded -->
            <button type="submit" class="pure-button-primary pure-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>

              Add friend and start new chat</button>
          </template>
        
          
    </template>
  
  </Modal>
</template>