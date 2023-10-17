<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { logoutUser, updateSession } = useUserStore();
const { isLoggedIn } = storeToRefs(useUserStore());

async function addFriend() {
  await logoutUser();
  void updateSession();
  void router.push({ name: "Login" });
}
</script>