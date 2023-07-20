<script lang="ts">
  import { page, navigating } from "$app/stores";
  import {
    IconLayoutGrid,
    IconStar,
    IconSettings,
    IconBalloon,
    IconLogout,
    IconHelp,
    IconMenu2,
    IconX,
    IconSearch,
    IconUser,
  } from "@tabler/icons-svelte";
  import { slide } from "svelte/transition";
  import { clickOutside } from "../../lib/clickOutSide";
  import { logout } from "$lib/stores/auth";
  import redIcon from "../../assets/images/redIcon.png";

  const handleLogout = async () => {
    logout().then((success) => {
      if (success) {
        window.location.href = "/login";
      }
    });
  };

  let mobileNavOpen = false;

  $: if ($navigating) {
    mobileNavOpen = false;
  }

  export let data: any;
  $: ({ admin } = data);
</script>

<div class="flex flex-col md:flex-row h-full md:h-screen">
  <nav
    class="  p-5 py-10 hidden md:flex flex-col gap-4 text-white border-r-[1px] border-neutral-500 md:w-[275px] md:h-screen md:sticky md:top-0 md:left-0"
  >
    <div
      class="flex flex-row gap-2 mb-10 items-center"
    >
      <!-- <img src={redIcon} alt="Turnt Logo" class="w-12 h-[auto]" /> -->
      <a class="font-extrabold text-3xl text-[#F94144]" href="/">Turnt</a>
    </div>
    <ul class="flex flex-col gap-5">
      <a
        href="/dashboard"
        class={`flex flex-row items-center gap-2 text-lg hover:text-white ${
          $page.url.pathname === "/dashboard" ? "" : "text-neutral-400"
        }`}
      >
        <IconLayoutGrid size={24} stroke={2} />
        Main</a
      >
      <a
        href="/dashboard/parties"
        class={`flex flex-row items-center gap-2 text-lg hover:text-white ${
          $page.url.pathname === "/dashboard/parties" ? "" : "text-neutral-400"
        }`}
      >
        <IconBalloon size={24} stroke={2} />
        Parties</a
      >

      <a
        href="/dashboard/account"
        class={`flex flex-row items-center gap-2 text-lg hover:text-white  ${
          $page.url.pathname === "/dashboard/account" ? "" : "text-neutral-400"
        }`}
      >
        <IconSettings size={24} stroke={2} />
        Account</a
      >
      <a
        href="/find"
        class={`flex flex-row items-center gap-2 text-lg hover:text-white  ${
          $page.url.pathname === "/find" ? "" : "text-neutral-400"
        }`}
      >
        <IconSearch size={24} stroke={2} />
        Back To Find</a
      >
      {#if admin}
        <a
          href="/dashboard/admin"
          class={`flex flex-row items-center gap-2 text-lg hover:text-white  ${
            $page.url.pathname === "/dashboard/admin" ? "" : "text-neutral-400"
          }`}
        >
          <IconUser size={24} stroke={2} />
          Admin</a
        >
      {/if}
    </ul>

    <div class="flex flex-1 flex-col items-center justify-center">
      <!-- {#if !$memberType.isPro}
        <div
          class="flex flex-col h-[60%] w-[90%] items-center justify-center rounded-md text-center bg-gradient-to-br from-[#F94144] to-[#F3722C]"
        >
          <h1 class="text-lg font-semibold">Upgrade to pro</h1>
          <p class="text-neutral-100">Get 1 month free</p>
          <a
            href="/upgrade"
            class="p-1 px-4 mt-4 rounded bg-white text-black font-medium"
            >Upgrade</a
          >
        </div>
      {/if} -->
    </div>
    <div class="flex flex-col items-start gap-4">
      <a
        href="https://discord.gg/jeK3AaHZM6"
        class="flex flex-row items-center gap-2 text-neutral-400 hover:text-white text-lg"
        ><IconHelp size={24} stroke={2} />Help</a
      >
      <button
        class="flex flex-row items-center gap-2 text-neutral-400 hover:text-white text-lg"
        on:click={() => handleLogout()}
      >
        <IconLogout size={24} stroke={2} />
        Logout</button
      >
    </div>
  </nav>
  <nav
    class="md:w-[275px] w-full flex md:hidden flex-col gap-4 text-white h-fit md:h-12 relative z-50 bg-matteBlack"
  >
    <div
      class="flex flex-row items-center justify-between w-full p-5 border-b-[1px] border-neutral-500 bg-matteBlack"
    >
      <a class="font-extrabold text-3xl text-[#F94144]" href="/">Turnt</a>
      {#if !mobileNavOpen}
        <button on:click={() => (mobileNavOpen = !mobileNavOpen)}>
          <IconMenu2 size={24} stroke={2} />
        </button>
      {:else}
        <IconX size={24} stroke={2} />
      {/if}
    </div>
    {#if mobileNavOpen}
      <div
        class="absolute z-50 bg-neutral-700 w-full p-5 top-[75px]"
        in:slide
        out:slide
        use:clickOutside
        on:click_outside={() => (mobileNavOpen = false)}
      >
        <ul class="flex flex-col gap-5">
          <a
            href="/dashboard"
            class={`flex flex-row items-center gap-2 text-lg hover:text-white ${
              $page.url.pathname === "/dashboard" ? "" : "text-neutral-400"
            }`}
          >
            <IconLayoutGrid size={24} stroke={2} />
            Main</a
          >
          <a
            href="/dashboard/parties"
            class={`flex flex-row items-center gap-2 text-lg hover:text-white ${
              $page.url.pathname === "/dashboard/parties"
                ? ""
                : "text-neutral-400"
            }`}
          >
            <IconBalloon size={24} stroke={2} />
            Parties</a
          >

          <a
            href="/dashboard/account"
            class={`flex flex-row items-center gap-2 text-lg hover:text-white  ${
              $page.url.pathname === "/dashboard/account"
                ? ""
                : "text-neutral-400"
            }`}
          >
            <IconSettings size={24} stroke={2} />
            Account</a
          >

          <a
            href="/find"
            class={`flex flex-row items-center gap-2 text-lg hover:text-white  ${
              $page.url.pathname === "/find" ? "" : "text-neutral-400"
            }`}
          >
            <IconSearch size={24} stroke={2} />
            Back To Find</a
          >

          {#if admin}
            <a
              href="/dashboard/admin"
              class={`flex flex-row items-center gap-2 text-lg hover:text-white  ${
                $page.url.pathname === "/dashboard/admin" ? "" : "text-neutral-400"
              }`}
            >
              <IconUser size={24} stroke={2} />
              Admin</a
            >
          {/if}

          <!-- <div class="flex flex-row items-center justify-center">
            {#if !$memberType.isPro}
              <div
                class="flex w-full items-center justify-between p-3 rounded-md text-center bg-gradient-to-br from-[#F94144] to-[#F3722C]"
              >
                <div class="flex flex-col">
                  <h1 class="text-lg font-semibold">Upgrade to pro</h1>
                  <p class="text-neutral-100">Get 1 month free</p>
                </div>

                <a
                  href="/upgrade"
                  class="p-1 px-4 rounded bg-white text-black font-medium"
                  >Upgrade</a
                >
              </div>
            {/if}
          </div>  -->
          <div class="flex flex-col items-start gap-4">
            <a
              href="https://discord.gg/jeK3AaHZM6"
              class="flex flex-row items-center gap-2 text-neutral-400 text-lg"
              ><IconHelp size={24} stroke={2} />Help</a
            >
            <button
              class="flex flex-row items-center gap-2 text-neutral-400 text-lg"
              on:click={() => handleLogout()}
            >
              <IconLogout size={24} stroke={2} />
              Logout</button
            >
          </div>
        </ul>
      </div>
    {/if}
  </nav>

  <div class="h-full min-h-[100vh] w-full relative overflow-scroll z-0">
    <slot />
  </div>
</div>
