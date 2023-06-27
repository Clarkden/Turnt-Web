<script lang="ts">
  import type { DateTime } from "luxon";
  import { prevent_default } from "svelte/internal";
  import { setDoc, doc, getDoc } from "firebase/firestore";
  import { db } from "../lib/firebase";
  import { authStore } from "../stores/authStore";
  import { createEventDispatcher } from "svelte";
  

  let dispatch = createEventDispatcher();

  interface ticket {
    name: string | null;
    price: number | null;
    gender: string | null;
    quantity: number | null;
    saleStart: string | null;
    type: string | null;
    saleEnd: string | null;
  }

  let partyName: string = "";
  let partyDescription: string = "";
  let partyDate: string | null;
  let partyStartTime: string | null;
  let partyEndTime: string | null;
  let partyLocation: string | null;
  let paidParty: boolean = true;
  let paymentMethod: string | null;
  let tickets: ticket[] | null;

  let submitError: string | null = null;
  let creatingTicket: boolean = true;
  let ticketHoldingObject: ticket = {
    name: "",
    price: 0,
    gender: "",
    quantity: 0,
    saleStart: "",
    saleEnd: "",
    type: "",
  };

  const paymentMethods = ["Turnt Pay", "Self Collect"];

  const saveTicket = () => {
    const newTicket = ticketHoldingObject;

    if (tickets) tickets = [...tickets, newTicket];
    else tickets = [newTicket];

    ticketHoldingObject.name = "";
    ticketHoldingObject.price = 0;
    ticketHoldingObject.gender = "";
    ticketHoldingObject.quantity = 0;
    ticketHoldingObject.saleStart = "";
    ticketHoldingObject.saleEnd = "";
    ticketHoldingObject.type = "";
  };
  const clearPartyData = () => {
    partyName = "";
    partyDescription = "";
    partyDate = null;
  };

  const submitPartyData = async () => {
    if (!partyName || !partyDescription || !partyDate) {
      submitError = "Please fill out all fields";
      return;
    }

    if (new Date(partyDate) < new Date()) {
      submitError = "Please select a date in the future";
      return;
    }

    const partyData = {
      name: partyName,
      description: partyDescription,
      date: partyDate,
    };

    try {
      const usersParties = await getDoc(
        doc(db, "parties", $authStore.currentUser!["uid"])
      );

      if (!usersParties.exists()) {
        await setDoc(doc(db, "parties", $authStore.currentUser!["uid"]), {
          parties: [partyData],
        });
      } else {
        await setDoc(doc(db, "parties", $authStore.currentUser!["uid"]), {
          parties: [...usersParties.data().parties, partyData],
        });
      }
      clearPartyData();
      dispatch("close");
    } catch (err) {
      console.log(err);
    }
  };

  $: if (paidParty) {
    paymentMethod = paymentMethods[0];
  } else {
    paymentMethod = null;
  }
</script>

<div class="border-[2px] border-black p-5 rounded-sm w-full">
  <form class="flex flex-col gap-5" on:submit|preventDefault={submitPartyData}>
    {#if submitError}
      <p class="text-red-500">
        {submitError}<span
          class="text-gray-500 ml-2 cursor-pointer text-sm"
          on:mousedown={() => (submitError = "")}>Dismiss</span
        >
      </p>
    {/if}
    <div>
      <label for="partyName">Party Name</label>
      <input
        type="text"
        placeholder="Party Name"
        class="border-[2px] border-black rounded-sm p-2 w-full"
        bind:value={partyName}
      />
    </div>
    <div>
      <label for="partyName">Party Description</label>
      <textarea
        placeholder="Party Description"
        class="border-[2px] border-black rounded-sm p-2 w-full"
        bind:value={partyDescription}
      />
    </div>
    <div>
      <label for="partyDate">Party Date</label>
      <input
        type="date"
        placeholder="Party Date"
        class="border-[2px] border-black rounded-sm p-2 w-full"
        bind:value={partyDate}
      />
    </div>

    <div class="flex flex-row gap-4">
      <div>
        <label for="partyTime">Party Start Time</label>
        <input
          type="time"
          class="border-[2px] border-black rounded-sm p-2 w-full"
          bind:value={partyStartTime}
        />
      </div>
      <div>
        <label for="partyTime">Party End Time</label>
        <input
          type="time"
          class="border-[2px] border-black rounded-sm p-2 w-full"
          bind:value={partyEndTime}
        />
      </div>
    </div>
    <div>
      <h3>Paid Party?</h3>
      <div
        on:mousedown={() => (paidParty = !paidParty)}
        class={`flex flex-row rounded-full h-5 w-10 border-[1px] border-black items-center overflow-clip cursor-pointer transition-all ${
          paidParty
            ? "justify-end bg-[#F94144]/25"
            : "justify-start bg-gray-300"
        }`}
      >
        <div
          class={`h-5 w-5 rounded-full ] ${
            paidParty ? "bg-[#F94144]" : "bg-gray-400"
          }`}
        />
      </div>
      {#if paidParty}
        <div class="flex flex-col gap-2 mt-3">
          <h1>Payment Methods:</h1>
          <div class="flex flex-row gap-4">
            <div
              on:mousedown={() => {
                paymentMethod = "Turnt Pay";
              }}
              class={`h-fit w-full border-[1px] border-black hover:bg-[#F94144]/25 flex flex-col items-center justify-center p-2 cursor-pointer ${
                paymentMethod === "Turnt Pay"
                  ? "border-red-500 bg-[#F4D8CD]"
                  : null
              }`}
            >
              <h1>Turnt Pay</h1>
              <p class="text-sm text-gray-600 text-center">
                We take care of handling payments for you online
              </p>
            </div>
            <div
              on:mousedown={() => {
                paymentMethod = "Self Collect";
              }}
              class={`h-fit w-full border-[1px] border-black hover:bg-[#F94144]/25 flex flex-col items-center justify-center p-2 cursor-pointer ${
                paymentMethod === "Self Collect"
                  ? "border-red-500 bg-[#F4D8CD]"
                  : null
              }`}
            >
              <h1>Self Collect</h1>
              <p class="text-sm text-gray-600 text-center">
                You take care of payments at the door
              </p>
            </div>
          </div>

          {#if paymentMethod === "Turnt Pay"}
            <!-- <div class="bg-[#F94144] translate-x-[4px] translate-y-[4px] border-black border-[1px]"> -->
            <div class="flex flex-col p-4 bg-white border-black border-[1px]">
              <div class="flex flex-row items-center justify-between">
                <h1>Create Tickets</h1>
                <button
                  on:click={() => (creatingTicket = true)}
                  type="button"
                  class="border-[1px] border-black p-1">Add</button
                >
              </div>
              {#if creatingTicket}
                <div
                  class="flex flex-row gap-4 mt-2 items-center flex-wrap border-[1px] border-black p-4"
                >
                  <div class="flex flex-col gap-2">
                    <label for="ticketName">Ticket Name</label>
                    <input
                      type="text"
                      placeholder="Ticket Name"
                      class="border-[1px] border-black rounded-sm p-2 w-full"
                      bind:value={ticketHoldingObject.name}
                    />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label for="ticketPrice">Ticket Price</label>
                    <input
                      type="number"
                      placeholder="Ticket Price"
                      class="border-[1px] border-black rounded-sm p-2 w-full"
                      bind:value={ticketHoldingObject.price}
                    />
                  </div>
                  <div>
                    <label for="ticketQuantity">Ticket Quantity</label>
                    <input
                      type="number"
                      placeholder="Ticket Quantity"
                      class="border-[1px] border-black rounded-sm p-2 w-full"
                      bind:value={ticketHoldingObject.quantity}
                    />
                  </div>
                  <div>
                    <label for="ticketQuantity">Ticket Type</label>
                    <select
                      class="border-[1px] border-black rounded-sm p-2 w-full"
                      bind:value={ticketHoldingObject.type}
                    >
                      <option value="General">General</option>
                      <option value="VIP">VIP</option>
                      <option value="VVIP">VVIP</option>
                    </select>
                  </div>
                  <div>
                    <label for="ticketGender">Ticket Gender</label>
                    <select
                      class="border-[1px] border-black rounded-sm p-2 w-full"
                      bind:value={ticketHoldingObject.gender}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div class="flex flex-row gap-4">
                    <div>
                      <label for="ticketQuantity">Ticket Start Date</label>
                      <input
                        type="date"
                        class="border-[1px] border-black rounded-sm p-2 w-full"
                        bind:value={ticketHoldingObject.saleStart}
                      />
                    </div>
                    <div>
                      <label for="ticketQuantity">Ticket End Date</label>
                      <input
                        type="date"
                        class="border-[1px] border-black rounded-sm p-2 w-full"
                        bind:value={ticketHoldingObject.saleEnd}
                      />
                    </div>
                  </div>
                  <div class="flex flex-row gap-4 w-full">
                    <button
                      type="button"
                      on:click={() => {
                        creatingTicket = false;
                      }}
                      class="w-full border-[1px] border-black">Cancel</button
                    >
                    <button
                      type="button"
                      on:click={() => {
                        saveTicket();
                      }}
                      class="w-full border-[1px] border-black">Save</button
                    >
                  </div>
                </div>
                {#if tickets}
                  {#each tickets as ticket}
                    <div class="flex flex-row items-start justify-start gap-4">
                      <p>{ticket.name}</p>
                      <p>{ticket.price}</p>
                      <p>{ticket.gender}</p>
                      <p>{ticket.type}</p>
                      <p>{ticket.quantity}</p>
                      <p>{ticket.saleStart}</p>
                      <p>{ticket.saleEnd}</p>
                    </div>
                  {/each}
                {/if}
              {/if}
            </div>
            <!-- </div> -->
          {/if}
        </div>
      {/if}
    </div>

    <div class="flex flex-row gap-3">
      <button
        on:click={() => {
          clearPartyData();
          dispatch("close");
        }}
        type="button"
        class="border-[2px] border-black bg-[#F94144] text-white w-full"
      >
        Cancel
      </button>

      <button class="border-[2px] border-black bg-[#F94144] text-white w-full">
        Submit
      </button>
    </div>
  </form>
</div>
