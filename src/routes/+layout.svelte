<script lang="ts">
  import { page } from "$app/stores";
  import "../app.css";
  import {
    authHandlers,
    authStore,
    memberType,
    stripeStore,
  } from "../stores/authStore";
  import { onAuthStateChanged } from "firebase/auth";
  import { auth, db } from "../lib/firebase";
  import { onMount } from "svelte";
  import { getDoc, doc } from "firebase/firestore";
  import { browser } from "$app/environment";

  const handleLogout = () => {
    try {
      authHandlers.logout();
    } catch (error) {
      console.log(error);
    }
  };

  onMount(() => {
    let unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        authStore.update((curr: any) => {
          return { ...curr, isLoading: false, currentUser: user };
        });

        let proMember = getDoc(doc(db, "pro-members", user.uid)).then((doc) => {
          if (doc.exists()) {
            memberType.update((curr: any) => {
              return { ...curr, isPro: true };
            });
          }
        });

        let stripeAccountId = getDoc(doc(db, "stripe-accounts", user.uid)).then(
          (doc) => {
            if (doc.exists()) {
              stripeStore.update((curr: any) => {
                return { ...curr, stripeAccountId: doc.data().stripeAccountId, loading: false };
              });
            }
          }
        );
      } else {
        authStore.update((curr: any) => {
          return { ...curr, isLoading: false, currentUser: null };
        });
      }
      if (
        browser &&
        !$authStore?.currentUser &&
        !$authStore.isLoading &&
        window.location.pathname !== "/" &&
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register" &&
        window.location.pathname !== "/find"
      ) {
        window.location.href = "/login";
      }
    });

    return unsubscribe;
  });
</script>

<svelte:head>
  <title>Lit</title>
</svelte:head>

<!-- {JSON.stringify($authStore)} -->
<html lang="en" data-theme="business">
  <body class="h-screen w-screen overflow-clip bg-matteBlack">
    {#if !$page.route.id?.includes("hub")}
      <nav
        class="h-16 bg-[#F94144] text-white w-full flex flex-row items-center justify-between px-4"
      >
        <a href="/" class="h-full flex flex-col items-center justify-center"
          >turnt.party</a
        >
        <ul class="flex flex-row gap-3">
          {#if $authStore.currentUser}
            <li><a href="/find">Find</a></li>
            <li><a href="/hub/dashboard">Dashboard</a></li>
            <button on:click={() => handleLogout()}>Logout</button>
          {:else}
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
          {/if}
        </ul>
      </nav>
    {/if}

    <slot />
  </body>
</html>
