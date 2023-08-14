<script lang="ts">
  import { page } from "$app/stores";
  import "../app.css";

  import { IconMenu2, IconX } from "@tabler/icons-svelte";
  import { fade, slide } from "svelte/transition";
  import { logout, user } from "$lib/stores/auth";
  import { navigating } from "$app/stores";
  import { scrollY } from "$lib/stores/scrollStore";
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
</script>

<nav
  class={`h-16 ${
    $scrollY > 50 ? "bg-matteBlack/50 backdrop-blur-lg" : "bg-transparent"
  }  transition duration-500  text-white w-full hidden md:flex flex-row items-center justify-between px-4 z-50`}
>
  <!-- <img src="/logo.png" class="h-8 w-8" /> -->
  <a
    href="/"
    class="h-full flex flex-col items-center justify-center font-extrabold text-2xl drop-shadow-md"
    >Turnt</a
  >
  <ul class="flex flex-row gap-4">
    {#if !$page.route.id?.includes("/find")}
      <li>
        <a href="/find" class="font-medium hover:text-matteBlack"
          >Find Parties</a
        >
      </li>
    {/if}

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
        <a href="/login" class="font-medium hover:text-matteBlack"
          >Host a party</a
        >
      </li>
      <!-- <li>
            <a href="/register" class="font-medium hover:text-matteBlack"
              >Register</a
            >
          </li> -->
    {/if}
  </ul>
</nav>

<nav
  class={`h-16 ${
    $scrollY > 50 ? "bg-bg-matteBlack/50 backdrop-blur-lg" : "bg-transparent"
  }  transition duration-500  text-white w-full md:hidden flex flex-row items-center justify-between  z-50`}
>
  <div class="flex flex-row justify-between w-full px-4">
    <a
      href="/"
      class="h-full flex flex-col items-center justify-center font-extrabold text-2xl"
      >Turnt</a
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
      class={`flex flex-col gap-4 absolute bg-matteBlack  w-full top-[63px] p-3  z-50`}
      in:slide
      out:slide
    >
      <ul class="flex flex-col gap-4">
        <li>
          <a href="/find" class="font-medium text-white hover:text-gray-500"
            >Find Parties</a
          >
        </li>

        {#if $user}
          <li>
            <a
              href="/dashboard"
              class="font-medium text-whote hover:text-gray-500">Dashboard</a
            >
          </li>
          <button
            on:click={() => handleLogout()}
            class="font-medium hover:text-gray-500 text-white text-start"
            >Logout</button
          >
        {:else}
          <li>
            <a href="/login" class="font-medium text-white hover:text-gray-500"
              >Login</a
            >
          </li>
          <li>
            <a
              href="/register"
              class="font-medium text-white hover:text-gray-500">Register</a
            >
          </li>
        {/if}
      </ul>
    </div>
  {/if}
</nav>
