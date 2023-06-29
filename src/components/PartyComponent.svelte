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
  import { authStore, stripeStore } from "../stores/authStore";
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

  async function confirmCancellation() {
    console.log(cancelInput);
    if (cancelInput.toUpperCase() === "CANCEL") {
      try {
        const partyCancelResponse = await axios.post("/api/refundParty", {
          partyId: party.id,
          stripAccountId: $stripeStore.stripeAccountId,
        });

        cancelPartyModal = false;

      } catch (error) {
        console.log(error);
      }
    } else {
      error = "Please type 'cancel' to confirm cancellation";

      setTimeout(() => {
        error = "";
      }, 4000);
    }
  }
</script>

{#if cancelPartyModal && !$authStore.isLoading && $authStore.currentUser["uid"] === party.hostAccountId && $stripeStore.stripeAccountId && !$stripeStore.loading}
  <div
    class="fixed inset-0 z-50 overflow-auto bg-black/50 flex items-center justify-center p-3 md:p-none"
  >
    <div
      class="min-h-[200px] w-full max-w-md m-auto bg-white rounded-md shadow-lg z-50 overflow-hidden"
    >
      <div class="py-4 text-left px-6">
        <!-- Top most div for modal header -->
        <div class="flex justify-between items-center pb-3">
          <p class="text-2xl font-bold">Confirmation</p>
          <div
            class="cursor-pointer z-50"
            on:mouseup={() => (cancelPartyModal = false)}
          >
            <svg
              class="fill-current text-black"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
            >
              <path
                d="M11.6 9l5.5-5.5-1.6-1.6-5.5 5.5-5.5-5.5-1.6 1.6 5.5 5.5-5.5 5.5 1.6 1.6 5.5-5.5 5.5 5.5 1.6-1.6-5.5-5.5z"
              />
            </svg>
          </div>
        </div>
        <p>
          All ticket holders will be refunded. To confirm the cancellation,
          please type "CANCEL".
        </p>
        <input
          class="w-full py-2 px-3 my-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border border-gray-200 rounded-md"
          id="cancelInput"
          type="text"
          placeholder="CANCEL"
          bind:value={cancelInput}
        />
        <!-- Buttons -->
        <div class="flex justify-end pt-2">
          <button
            class="px-4 bg-transparent p-3 rounded-lg text-mainRed hover:bg-gray-100 hover:text-mainRed mr-2"
            on:click={() => (cancelPartyModal = false)}>Close</button
          >
          <button
            class="px-4 bg-mainRed p-3 rounded-lg text-white hover:bg-red-600"
            on:click={confirmCancellation}>Confirm</button
          >
        </div>
      </div>
    </div>
  </div>
{/if}

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

<div class="rounded overflow-hidden shadow-lg m-2 bg-white">
  <img
    class="w-full h-64 object-cover"
    src={party.flyerPath}
    alt="Party flyer"
  />
  <div class="px-6 py-4">
    <div
      class="flex flex-col-reverse md:flex-row justify-between items-start md:items-center"
    >
      <div class="font-bold text-xl md:mb-2 mt-4 md:mt-0">{party.name}</div>
      <div class="flex flex-row gap-2 md:w-[auto] w-full">
        <!-- Share button -->
        <li class="flex flex-row gap-1 md:w-[auto] w-full">
          <button
            class=" bg-sky-500 hover:bg-500-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 ease-in-out flex flex-row items-center gap-2 w-full md:w-[auto]"
            on:click={() => copyToClipBoard(`https://turnt.party/${party.id}`)}
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
    </div>
    <p class="text-gray-700 text-base overflow-ellipsis overflow-hidden mt-3">
      {party.description}
    </p>
  </div>
  <div class="px-6 pt-4 pb-2">
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
      >Start Time: {party.startTime}</span
    >
    <span
      class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
      >End Time: {party.endTime}</span
    >
    {#if party.ageLimit > 0}
      <span
        class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
        >Age Limit: {party.ageLimit}+</span
      >
    {/if}
  </div>
  <div class="flex flex-row w-full mt-4">
    {#if $authStore.currentUser && $authStore.currentUser["uid"] === party.hostAccountId}
      <!-- Delete button -->
      <button
        class="bg-mainRed hover:bg-red-600 text-white font-bold py-2 px-4 rounded-b-sm shadow-md transition-colors duration-300 ease-in-out flex flex-row items-center gap-2 w-full justify-center"
        on:click={() => {
          cancelPartyModal = true;
        }}
      >
        <IconAlertCircle />
        Cancel Party
      </button>
    {/if}
  </div>
</div>
