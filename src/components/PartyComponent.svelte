<script lang="ts">
  import { DateTime } from "luxon";
  import {
    IconAlertCircle,
    IconDots,
    IconEye,
    IconPencil,
    IconShare,
    IconShare2,
  } from "@tabler/icons-svelte";
  import { clickOutside } from "$lib/clickOutSide";
  import { fade } from "svelte/transition";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import axios from "axios";

  let dropDown: boolean = false;
  let message: string = "";
  let error: string = "";
  let cancelPartyModal: boolean = false;
  export let party: any;

  $: ({ name, date, id } = party);

  const copyToClipBoard = (text: string) => {
    navigator.clipboard.writeText(text);

    message = "Copied to clipboard!";

    setTimeout(() => {
      message = "";
    }, 4000);
  };

  let cancelInput: string = "";
</script>

{#if message}
  <div
    class="fixed bottom-0 w-full px-4 py-6 md:w-auto md:px-6 md:rounded md:shadow-lg md:bottom-3 md:right-3 bg-white z-50"
  >
    <div class="flex items-center space-x-3">
      <div class="text-green-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <div class="flex-1 text-green-600">
        <p class="font-semibold">{message}</p>
      </div>
      <button
        class="text-gray-400 hover:text-gray-600 transition"
        on:click={() => {
          message = "";
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
{/if}
{#if error}
  <div
    class="fixed bottom-0 w-full px-4 py-6 md:w-auto md:px-6 md:rounded md:shadow-lg md:bottom-3 md:right-3 bg-white z-50"
  >
    <div class="flex items-center space-x-3">
      <div class="text-mainRed">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <div class="flex-1 text-mainRed">
        <p class="font-semibold">{error}</p>
      </div>

      <button
        class="text-gray-400 hover:text-gray-600 transition"
        on:click={() => {
          message = "";
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
{/if}

<div
  class="rounded overflow-hidden shadow-lg bg-white flex flex-col justify-between relative h-[500px]"
>
  <img
    class="w-full h-full object-cover absolute z-0"
    src={party.flyerPath}
    alt="Party flyer"
  />
  <div
    class=" h-full absolute w-full flex flex-col justify-end bg-gradient-to-b bg from-transparent to-black text-white"
  >
    <div class="px-6 py-4">
      <div class="flex flex-col justify-between items-start md:items-start">
        <div class="font-bold text-xl md:mb-2 mt-4 md:mt-0">{party.name}</div>
        {#if DateTime.fromISO(party.date).set( { hour: DateTime.fromFormat(party.endTime, "h:mm a").hour, minute: DateTime.fromFormat(party.endTime, "h:mm a").minute } ) > DateTime.local()}
          <div class="flex flex-row gap-2 w-full">
            <!-- Share button -->
            <li class="flex flex-row gap-1 w-full">
              <button
                class=" bg-sky-500 hover:bg-500-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 ease-in-out flex flex-row items-center gap-2 w-full md:w-[auto]"
                on:click={() =>
                  copyToClipBoard(`https://turnt.party/${party.id}`)}
              >
                <IconShare2 />
                Share
              </button>
            </li>

            <!-- View button -->
            <a
              href="/{party.id}"
              class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 ease-in-out flex flex-row items-center gap-2 w-full md:w-[auto]"
            >
              <IconEye />
              View
            </a>
          </div>
        {/if}
      </div>
      <!-- <p class="text-gray-300 text-base overflow-ellipsis overflow-hidden mt-3">
        {party.description}
      </p> -->
    </div>
    <!-- <div class="px-6 pt-4 pb-2">
      <span
        class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
      >
        Date:
        {#if DateTime.fromISO(party.date).hasSame(DateTime.local(), "day")}
          Today
        {:else if DateTime.local()
          .plus({ days: 1 })
          .hasSame(DateTime.fromISO(party.date), "day")}
          Tomorrow
        {:else}
          {DateTime.fromISO(party.date).toLocaleString(DateTime.DATE_FULL)}
        {/if}
      </span>

      <span
        class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
        >Time: {party.startTime} - {party.endTime}</span
      >
      {#if party.ageLimit > 0}
        <span
          class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          >Age Limit: {party.ageLimit}+</span
        >
      {/if}
    </div> -->
    <div class="flex flex-row w-full self-end">
      {#if $page.data.uid === party.hostAccountId}
        <!-- Delete button -->
        <a
          class="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded-b-sm shadow-md transition-colors duration-300 ease-in-out flex flex-row items-center gap-2 w-full justify-center"
          href={$page.url.pathname === "/hub/dashboard"
            ? "/hub/dashboard/parties"
            : `/hub/dashboard/parties/manage/${party.id}`}
        >
          <IconAlertCircle />
          {DateTime.fromISO(party.date).set({
            hour: DateTime.fromFormat(party.endTime, "h:mm a").hour,
            minute: DateTime.fromFormat(party.endTime, "h:mm a").minute,
          }) > DateTime.local()
            ? "Manage Party"
            : "View Party"}
        </a>
      {/if}
    </div>
  </div>
</div>
