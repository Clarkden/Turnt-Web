<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { db, auth } from "../../lib/firebase";
  import { doc, getDoc, onSnapshot } from "firebase/firestore";
  import { DateTime } from "luxon";
  import {
    IconClock,
    IconCalendar,
    IconFileFilled,
    IconX,
  } from "@tabler/icons-svelte";
  import { authStore } from "../../stores/authStore";
  import axios from "axios";
  import { goto } from "$app/navigation";
  import { fly } from "svelte/transition";

  let party: any = {};
  let stripeAccountId: string = "";
  let phonenumberModal: boolean = false;
  let phoneNumber: string = "";
  let selectedTicket: any = null;
  let message: string = "";

  const getHostStripeAccountId = async () => {
    const hostStripe = await getDoc(
      doc(db, "stripe-accounts", $authStore.currentUser!["uid"])
    );
    if (hostStripe.exists()) {
      stripeAccountId = hostStripe.data().stripeAccountId;
    } else return;
  };

  onMount(() => {
    const unsubscribe = onSnapshot(
      doc(db, "parties", $page.params.id),
      (doc) => {
        party = { id: doc.id, ...doc.data() };
      }
    );
  });

  $: if (!$authStore.isLoading) {
    getHostStripeAccountId();
  }

  $: if (party.description) {
    let description = party.description;
    description = description.replace(/\n/g, "<br />");
    party.description = description;
  }

  const purchaseTicket = async () => {
    if (!phoneNumber) return;

    try {
      let checkoutSession = await axios.post("/api/createCheckoutSession", {
        party,
        ticket: selectedTicket,
        stripeAccountId: stripeAccountId,
        purchaserPhoneNumber: phoneNumber,
      });
      goto(checkoutSession.data.url);
    } catch (error) {
      console.log(error);
    }
  };

  $: if ($page.url.searchParams.get("status")) {
    if ($page.url.searchParams.get("status") === "success") {
      message = "Your ticket has been purchased successfully!";
    } else if ($page.url.searchParams.get("status") === "canceled") {
      message = "Your ticket purchase has been canceled.";
    }
  }
</script>

{#if message}
  <div class="absolute top-16 left-2 right-2">
    {#if message === "Your ticket has been purchased successfully!"}
      <div
        class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <!-- <strong class="font-bold">Holy smokes!</strong> -->
        <span class="block sm:inline">{message}</span>
        <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
          <button
            class="w-fit h-fit"
            on:click={() => {
              message = "";
            }}
          >
            <svg
              class="fill-current h-6 w-6 text-green-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              ><title>Close</title><path
                d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
              /></svg
            >
          </button>
        </span>
      </div>
    {:else if message === "Your ticket purchase has been canceled."}
      <div
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <!-- <strong class="font-bold">Holy smokes!</strong> -->
        <span class="block sm:inline">{message}</span>

        <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
          <button
            class="w-fit h-fit"
            on:click={() => {
              message = "";
            }}
          >
            <svg
              class="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              ><title>Close</title><path
                d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
              /></svg
            >
          </button>
        </span>
      </div>
    {/if}
  </div>
{/if}

{#if phonenumberModal}
  <div
    class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center p-2"
  >
    <div class="w-full md:w-[500px] bg-white rounded-md p-5">
      <IconX
        on:click={() => {
          phonenumberModal = false;
          selectedTicket = null;
        }}
        class="w-6 h-6 absolute top-2 right-2 text-white"
      />
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl font-bold">Enter your phone number</h1>
        <input
          type="text"
          class="w-full border-[1px] rounded-md p-2"
          placeholder="Phone Number"
          bind:value={phoneNumber}
        />
        {#if !phoneNumber}
          <button
            class="w-full bg-primary-600 rounded-md p-2 bg-mainRed/25 border border-mainRed text-black"
            disabled
            on:click={() => {
              purchaseTicket();
            }}
          >
            Submit
          </button>
        {:else}
          <button
            class="w-full bg-primary-600 text-white rounded-md p-2 bg-mainRed"
            on:click={() => {
              purchaseTicket();
            }}
          >
            Submit
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}

{#if party}
  <div
    class="w-full h-full flex flex-col md:flex-row md:p-10 overflow-scroll pb-20"
  >
    <div class="w-full md:min-w-[50%] max-h-[400px] p-5">
      <div class="w-full h-full border-[1px] bg-white p-1 rounded-md">
        <img
          src={party.flyerPath}
          alt=""
          class="w-full h-full object-contain rounded-md"
        />
      </div>
    </div>
    <div class="w-full md:min-w-[50%] p-5 flex flex-col gap-2">
      <div class="flex flex-col gap-1 border-[1px] rounded">
        <h1 class="w-full px-2 bg-neutral-600 text-white rounded-t">
          Party Info
        </h1>

        <div class="flex flex-col gap-1 rounded p-2">
          <h1 class="text-white font-bold text-2xl mb-2">{party.name}</h1>
          <h3 class="text-white flex flex-row gap-1 text-lg items-center">
            <IconCalendar />
            {DateTime.fromISO(party.date).toLocaleString()}
          </h3>
          <h3 class="text-white flex flex-row gap-1 text-lg items-center">
            <IconClock />
            {party.startTime} - {party.endTime}
          </h3>
        </div>
      </div>
      <div class="flex flex-col gap-1 border-[1px] rounded">
        <h1 class="w-full px-2 bg-neutral-600 text-white rounded-t">
          Description
        </h1>
        <div class="p-2">
          <p class="text-white">{@html party.description}</p>
        </div>
      </div>
      {#if party.tickets}
        <div class="flex flex-col gap-1 border-[1px] rounded">
          <h1 class="w-full px-2 bg-neutral-600 text-white rounded-t">
            Tickets
          </h1>
          <div class="flex flex-col gap-1 rounded p-2">
            {#each JSON.parse(party.tickets) as ticket}
              <div
                class="w-full h-fit border border-mainRed p-3 rounded-md text-white flex flex-row"
              >
                <div class="flex flex-col gap-2 w-full">
                  <h1 class="font-semibold text-xl">{ticket.name}</h1>
                  {#if ticket.gender}
                    <h1>{ticket.gender}</h1>
                  {/if}
                  <h1>Price: ${ticket.price}</h1>
                </div>
                <div
                  class="flex flex-col items-end justify-center w-full h-full"
                >
                  <button
                    on:click={() => {
                      selectedTicket = ticket;
                      phonenumberModal = true;
                    }}
                    class="bg-mainRed hover:bg-mainRed/50 rounded-md text-white px-4 p-2"
                    >Buy</button
                  >
                </div>
              </div>
              <!-- {JSON.stringify(ticket)} -->
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}
