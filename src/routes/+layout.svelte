<script lang="ts">
  import { page } from "$app/stores";
  import "../app.css";
  // import {
  //   authHandlers,
  //   authStore,
  //   memberType,
  //   stripeStore,
  // } from "../stores/authStore";
  import { onAuthStateChanged } from "firebase/auth";
  import { auth, db } from "../lib/firebase";
  import { onDestroy, onMount } from "svelte";
  import { getDoc, doc } from "firebase/firestore";
  import { browser } from "$app/environment";
  import { IconMenu2, IconX } from "@tabler/icons-svelte";
  import { fade, slide } from "svelte/transition";
  import { logout, user } from "$lib/stores/auth";
  import { navigating } from "$app/stores";

  let showMobileNav: boolean = false;

  const handleLogout = () => {
    logout().then((success) => {
      if (success) {
        window.location.href = "/login";
      }
    });
  };

  $: if ($navigating) {
    showMobileNav = false;
  }

  // $: console.log("Server Data", $page.data.uid);
  // $: console.log("Client Data", $user?.uid);

  // onMount(() => {
  //   let unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       authStore.update((curr: any) => {
  //         return { ...curr, isLoading: false, currentUser: user };
  //       });

  //       let proMember = getDoc(doc(db, "pro-members", user.uid)).then((doc) => {
  //         if (doc.exists()) {
  //           memberType.update((curr: any) => {
  //             return { ...curr, isPro: true };
  //           });
  //         }
  //       });

  //       let stripeAccountId = getDoc(doc(db, "stripe-accounts", user.uid)).then(
  //         (doc) => {
  //           if (doc.exists()) {
  //             stripeStore.update((curr: any) => {
  //               return {
  //                 ...curr,
  //                 stripeAccountId: doc.data().stripeAccountId,
  //                 loading: false,
  //               };
  //             });
  //           }
  //         }
  //       );
  //     } else {
  //       authStore.update((curr: any) => {
  //         return { ...curr, isLoading: false, currentUser: null };
  //       });
  //     }
  //     if (
  //       browser &&
  //       !$authStore?.currentUser &&
  //       !$authStore.isLoading &&
  //       window.location.pathname !== "/" &&
  //       window.location.pathname !== "/login" &&
  //       window.location.pathname !== "/register" &&
  //       window.location.pathname !== "/find" &&
  //       window.location.pathname !== "/forgotPassword"
  //     ) {
  //       window.location.href = "/login";
  //     }
  //   });

  //   onDestroy(() => {
  //     window.onscroll = () => {};
  //   });

  //   return unsubscribe;
  // });
</script>

<svelte:head>
  <title>Lit</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin="anonymous"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<body class="h-screen w-screen overflow-scroll bg-matteBlack font-poppins">
    {#if !$page.route.id?.includes("hub")}
      <nav
        class={`h-16 bg-[#F94144] text-white w-full hidden md:flex flex-row items-center justify-between px-4`}
      >
        <a
          href="/"
          class="h-full flex flex-col items-center justify-center font-extrabold text-2xl"
          >turnt.party</a
        >
        <ul class="flex flex-row gap-4">
          <li>
            <a href="/find" class="font-light hover:text-matteBlack"
              >Find Parties</a
            >
          </li>

          {#if $user}
            <li>
              <a href="/hub/dashboard" class="font-light hover:text-matteBlack"
                >Dashboard</a
              >
            </li>
            <button
              on:click={() => {
                handleLogout();
              }}
              class="font-light hover:text-matteBlack">Logout</button
            >
          {:else}
            <li>
              <a href="/login" class="font-light hover:text-matteBlack">Login</a
              >
            </li>
            <li>
              <a href="/register" class="font-light hover:text-matteBlack"
                >Register</a
              >
            </li>
          {/if}
        </ul>
      </nav>

      <nav
        class={`h-16 bg-[#F94144] text-white w-full md:hidden flex flex-row items-center justify-between relative ${
          !showMobileNav && "drop-shadow-lg"
        } z-50`}
      >
        <div class="flex flex-row justify-between w-full px-4">
          <a
            href="/"
            class="h-full flex flex-col items-center justify-center font-extrabold text-2xl"
            >turnt.party</a
          >

          <button
            on:click={() => {
              showMobileNav = !showMobileNav;
            }}
            transition:fade
          >
            {#if showMobileNav}
              <IconX class="w-6 h-6" />
            {:else}
              <IconMenu2 class="w-6 h-6" />
            {/if}
          </button>
        </div>

        {#if showMobileNav}
          <ul
            class="flex flex-col gap-4 absolute bg-mainRed w-full top-[63px] p-3 drop-shadow-lg z-50"
            in:slide
            out:slide
          >
            <li>
              <a href="/find" class="font-light hover:text-matteBlack"
                >Find Parties</a
              >
            </li>

            {#if $user}
              <li>
                <a
                  href="/hub/dashboard"
                  class="font-light hover:text-matteBlack">Dashboard</a
                >
              </li>
              <button
                on:click={() => handleLogout()}
                class="font-light hover:text-matteBlack text-start"
                >Logout</button
              >
            {:else}
              <li>
                <a href="/login" class="font-light hover:text-matteBlack"
                  >Login</a
                >
              </li>
              <li>
                <a href="/register" class="font-light hover:text-matteBlack"
                  >Register</a
                >
              </li>
            {/if}
          </ul>
        {/if}
      </nav>
    {/if}

    <slot />
</body>
