<script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";
  import {page} from "$app/stores";

  const refreshLink = async () => {
    try {
      let accountLink: any = await axios.post("/api/createAccountLink");
      window.location.href = accountLink.data.url;
    } catch (error) {
      console.log(error);
    }
  };

  $: if($page.data.uid) {
    refreshLink();
  }
</script>
