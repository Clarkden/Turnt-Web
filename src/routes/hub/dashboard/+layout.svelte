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
  } from "@tabler/icons-svelte";
  import { authHandlers, memberType } from "../../../stores/authStore";
  import { slide } from "svelte/transition";
  import { clickOutside } from "../../../lib/clickOutSide";

  let mobileNavOpen = false;

  $: if ($navigating) {
    mobileNavOpen = false;
  }
</script>

<div class="flex flex-col md:flex-row h-full">
  <nav
    class=" md:w-[275px] h-full p-5 py-10 hidden md:flex flex-col gap-4 text-white border-r-[1px] border-neutral-500"
  >
    <h1
      class="font-extrabold text-3xl mb-10 text-[#F94144] pb-4 border-b-[1px] border-neutral-500"
    >
      turnt.party
    </h1>
    <ul class="flex flex-col gap-5">
      <a
        href="/hub/dashboard"
        class={`flex flex-row items-center gap-2 text-lg hover:text-white ${
          $page.url.pathname === "/hub/dashboard" ? "" : "text-neutral-400"
        }`}
      >
        <IconLayoutGrid size={24} stroke={2} />
        Main</a
      >
      <a
        href="/hub/dashboard/parties"
        class={`flex flex-row items-center gap-2 text-lg hover:text-white ${
          $page.url.pathname === "/hub/dashboard/parties"
            ? ""
            : "text-neutral-400"
        }`}
      >
        <IconBalloon size={24} stroke={2} />
        Parties</a
      >

      <a
        href="/hub/dashboard/settings"
        class={`flex flex-row items-center gap-2 text-lg hover:text-white  ${
          $page.url.pathname === "/hub/dashboard/settings"
            ? ""
            : "text-neutral-400"
        }`}
      >
        <IconSettings size={24} stroke={2} />
        Settings</a
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
    </ul>

    <div class="flex flex-1 flex-col items-center justify-center">
      {#if !$memberType.isPro}
        <div
          class="flex flex-col h-[60%] w-[90%] items-center justify-center rounded-md text-center bg-gradient-to-br from-[#F94144] to-[#F3722C]"
        >
          <h1 class="text-lg font-semibold">Upgrade to pro</h1>
          <p class="text-neutral-100">Get 1 month free</p>
          <a
            href="/hub/upgrade"
            class="p-1 px-4 mt-4 rounded bg-white text-black font-medium"
            >Upgrade</a
          >
        </div>
      {/if}
    </div>
    <div class="flex flex-col items-start gap-4">
      <a
        href="/"
        class="flex flex-row items-center gap-2 text-neutral-400 hover:text-white"
        ><IconHelp size={24} stroke={2} />Help</a
      >
      <button
        class="flex flex-row items-center gap-2 text-neutral-400 hover:text-white"
        on:click={() => authHandlers.logout()}
      >
        <IconLogout size={24} stroke={2} />
        Logout</button
      >
    </div>
  </nav>
  <nav
    class="md:w-[275px] w-full flex md:hidden flex-col gap-4 text-white h-12 relative z-50 bg-matteBlack"
  >
    <div
      class="flex flex-row items-center justify-between w-full p-5 border-b-[1px] border-neutral-500 bg-matteBlack"
    >
      <h1 class="font-extrabold text-3xl text-[#F94144]">turnt.party</h1>
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
            href="/hub/dashboard"
            class={`flex flex-row items-center gap-2 text-lg hover:text-white ${
              $page.url.pathname === "/hub/dashboard" ? "" : "text-neutral-400"
            }`}
          >
            <IconLayoutGrid size={24} stroke={2} />
            Main</a
          >
          <a
            href="/hub/dashboard/parties"
            class={`flex flex-row items-center gap-2 text-lg hover:text-white ${
              $page.url.pathname === "/hub/dashboard/parties"
                ? ""
                : "text-neutral-400"
            }`}
          >
            <IconBalloon size={24} stroke={2} />
            Parties</a
          >

          <a
            href="/hub/dashboard/settings"
            class={`flex flex-row items-center gap-2 text-lg hover:text-white  ${
              $page.url.pathname === "/hub/dashboard/settings"
                ? ""
                : "text-neutral-400"
            }`}
          >
            <IconSettings size={24} stroke={2} />
            Settings</a
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

          <div class="flex flex-row items-center justify-center">
            {#if !$memberType.isPro}
              <div
                class="flex w-full items-center justify-between p-3 rounded-md text-center bg-gradient-to-br from-[#F94144] to-[#F3722C]"
              >
                <div class="flex flex-col">
                  <h1 class="text-lg font-semibold">Upgrade to pro</h1>
                  <p class="text-neutral-100">Get 1 month free</p>
                </div>

                <a
                  href="/hub/upgrade"
                  class="p-1 px-4 rounded bg-white text-black font-medium"
                  >Upgrade</a
                >
              </div>
            {/if}
          </div>
          <div class="flex flex-col items-start gap-4">
            <a
              href="/"
              class="flex flex-row items-center gap-2 text-neutral-400"
              ><IconHelp size={24} stroke={2} />Help</a
            >
            <button
              class="flex flex-row items-center gap-2 text-neutral-400"
              on:click={() => authHandlers.logout()}
            >
              <IconLogout size={24} stroke={2} />
              Logout</button
            >
          </div>
        </ul>
      </div>
    {/if}
  </nav>

  <div class="h-full w-full py-10 px-2 md:px-10 relative overflow-scroll z-0">
    <slot />
  </div>
</div>
