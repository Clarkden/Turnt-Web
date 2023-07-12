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
  import OgImage from "../assets/images/OgImage.png";
  // import whiteIcon

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

  $: scrollY = 0;

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
  <title>Turnt - The Better Party Platform</title>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap"
    rel="stylesheet"
  />

  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta
    name="description"
    content="Turnt is the better party platform. Discover parties, connect with others, and get Turnt like never before!"
  />
  <meta
    name="keywords"
    content="party, parties, Turnt, Turntapp, Turntparty, Turnt party, social, events, gatherings, fun"
  />
  <meta name="author" content="Turnt" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="turnt.party" />
  <!-- Replace with your website URL -->
  <meta property="og:title" content="Turnt - The Better Party Platform" />
  <meta
    property="og:description"
    content="Turnt is the better party platform. Discover parties, connect with others, and get Turnt like never before!"
  />
  <meta property="og:image" content={OgImage} />
  <!-- Replace with your image URL -->

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="turnt.party" />
  <!-- Replace with your website URL -->
  <meta property="twitter:title" content="Turnt - The Better Party Platform" />
  <meta
    property="twitter:description"
    content="Turnt is the better party platform. Discover parties, connect with others, and get Turnt like never before!"
  />
  <meta property="twitter:image" content={OgImage} />
  <!-- Replace with your image URL -->
</svelte:head>

<svelte:window bind:scrollY />

<body class="h-fit min-h-screen w-screen bg-matteBlack font-poppins relative">
  <!-- <body
  class="h-fit min-h-screen w-screen overflow-scroll bg-matteBlack font-poppins relative"
> -->
  {#if !$page.route.id?.includes("dashboard")}
    <nav
      class={`h-16 ${
        scrollY > 50 ? "bg-matteBlack/50 backdrop-blur-lg" : "bg-[#F94144]"
      }  transition duration-500 sticky top-0 text-white w-full hidden md:flex flex-row items-center justify-between px-4 z-50`}
    >
      <!-- <img src="/logo.png" class="h-8 w-8" /> -->
      <a
        href="/"
        class="h-full flex flex-col items-center justify-center font-extrabold text-2xl drop-shadow-md"
        >Turnt</a
      >
      <ul class="flex flex-row gap-4">
        <li>
          <a href="/find" class="font-medium hover:text-matteBlack"
            >Find Parties</a
          >
        </li>

        {#if $user}
          <li>
            <a href="/dashboard" class="font-medium hover:text-matteBlack"
              >Dashboard</a
            >
          </li>
          <button
            on:click={() => {
              handleLogout();
            }}
            class="font-medium hover:text-matteBlack">Logout</button
          >
        {:else}
          <li>
            <a href="/login" class="font-medium hover:text-matteBlack">Login</a>
          </li>
          <li>
            <a href="/register" class="font-medium hover:text-matteBlack"
              >Register</a
            >
          </li>
        {/if}
      </ul>
    </nav>

    <nav
      class={`h-16 ${
        scrollY > 50 ? "bg-bg-matteBlack/50 backdrop-blur-lg" : "bg-[#F94144]"
      }  transition duration-500 sticky top-0 text-white w-full md:hidden flex flex-row items-center justify-between  z-50`}
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
        <div
          class={`flex flex-col gap-4 absolute bg-neutral-100  w-full top-[63px] p-3  z-50`}
          in:slide
          out:slide
        >
          <ul class="flex flex-col gap-4" >
            <li>
              <a href="/find" class="font-medium text-black hover:text-gray-500"
                >Find Parties</a
              >
            </li>

            {#if $user}
              <li>
                <a href="/dashboard" class="font-medium text-black hover:text-gray-500"
                  >Dashboard</a
                >
              </li>
              <button
                on:click={() => handleLogout()}
                class="font-medium hover:text-gray-500 text-black text-start"
                >Logout</button
              >
            {:else}
              <li>
                <a href="/login" class="font-medium text-black hover:text-gray-500"
                  >Login</a
                >
              </li>
              <li>
                <a href="/register" class="font-medium text-black hover:text-gray-500"
                  >Register</a
                >
              </li>
            {/if}
          </ul>
        </div>
      {/if}
    </nav>
  {/if}

  <slot />
</body>
