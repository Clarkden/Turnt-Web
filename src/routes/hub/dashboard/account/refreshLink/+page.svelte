<script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";
  import { authStore } from "../../../../../stores/authStore";

  const refreshLink = async () => {
    try {
      let accountLink: any = await axios.post("/api/createAccountLink");
      window.location.href = accountLink.data.url;
    } catch (error) {
      console.log(error);
    }
  };

  $: if (!$authStore.isLoading && $authStore.currentUser) {
    refreshLink();
  }
</script>
