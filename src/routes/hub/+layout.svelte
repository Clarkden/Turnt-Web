<script lang="ts">
  import { onMount } from "svelte";
  import { authStore, memberType } from "../../stores/authStore";
  import { goto } from "$app/navigation";
  import { onAuthStateChanged } from "firebase/auth";
  import { auth, db } from "../../lib/firebase";
  import { browser } from "$app/environment";
  import { getDoc, doc } from "firebase/firestore";

  let user: any;
</script>

<svelte:head>
  <title>Hub</title>
</svelte:head>

<slot />
