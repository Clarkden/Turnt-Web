<script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";
  import {page} from "$app/stores";
  import { getIdToken } from "firebase/auth";
  import { auth } from "$lib/firebase";

  const refreshLink = async () => {
    try {
      let accountLink: any = await axios.post("/api/createAccountLink",
        {
          headers: {
            Authorization: "Bearer " + (await getIdToken(auth?.currentUser!)),
          },
        });
      window.location.href = accountLink.data.url;
    } catch (error) {
      console.log(error);
    }
  };

  $: if($page.data.uid) {
    refreshLink();
  }
</script>
