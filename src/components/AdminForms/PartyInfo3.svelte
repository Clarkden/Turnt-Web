<!-- <script lang="ts">
  import { IconCalendar, IconQuestionMark } from "@tabler/icons-svelte";

  import type { Ticket } from "../../lib/types";
  import { IconCirclePlus } from "@tabler/icons-svelte";
  import { IconCaretDown } from "@tabler/icons-svelte";
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";
  import { clickOutside } from "../../lib/clickOutSide";
  import { DateTime } from "luxon";
  import { fly } from "svelte/transition";
  const dispatch = createEventDispatcher();

  let tickets: Ticket[] = [];
  let creatingTicket = false;
  let showAdvancedOptions: boolean = false;

  let ticketName: string = "";
  let ticketGender: string = "";
  let ticketQuantity: number = 0;
  let ticketSaleStart: string = "";
  let ticketSaleEnd: string = "";
  let ticketPrice: number = 0;

  let selectedTimeStart: string;
  let selectedTimeEnd: string;
  let timeOptions: string[] = [];
  let showTimeStartDropdown = false;
  let showTimeEndDropdown = false;
  let error: string = "";

  export let data: any;

  const genders = ["Guys", "Girls"];

  $: if (ticketGender === "None") {
    ticketGender = "";
  }

  const saveTicket = () => {
    if (ticketSaleStart && !selectedTimeStart) {
      selectedTimeStart = "12:00 AM";
    }

    if (ticketSaleEnd && !selectedTimeEnd) {
      selectedTimeEnd = "12:00 AM";
    }

    if (ticketPrice < 1) {
      error = "Ticket price must be greater than 0";
      return;
    }

    let newTicket: Ticket = {

    }

    tickets = [
      ...tickets,
      new Ticket(
        tickets.length + 1,
        ticketName,
        ticketGender,
        ticketQuantity,
        ticketSaleStart,
        ticketSaleEnd,
        selectedTimeStart,
        selectedTimeEnd,
        ticketPrice
      ),
    ];
    creatingTicket = false;
    ticketName = "";
    ticketGender = "";
    ticketQuantity = 0;
    ticketSaleStart = "";
    ticketSaleEnd = "";
    selectedTimeStart = "";
    selectedTimeEnd = "";
    ticketPrice = 0;
    showAdvancedOptions = false;
  };

  const completion = () => {
    dispatch("completion", {
      tickets: JSON.stringify(tickets),
    });
    // console.log(tickets);
  };

  const selectTime = (dropdown: string, time: string) => {
    if (dropdown === "start") {
      selectedTimeStart = time;
      showTimeStartDropdown = false;
    } else if (dropdown === "end") {
      selectedTimeEnd = time;
      showTimeEndDropdown = false;
    }
  };

  onMount(() => {
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 4; j++) {
        let hour = i;
        let period = "AM";

        if (hour >= 12) {
          period = "PM";
          if (hour > 12) {
            hour -= 12;
          }
        } else if (hour === 0) {
          hour = 12;
        }

        const hourFormatted = hour < 10 ? `0${hour}` : `${hour}`;
        const minutes = j * 15 === 0 ? "00" : `${j * 15}`;
        timeOptions.push(`${hourFormatted}:${minutes} ${period}`);
      }
    }

    if (data.tickets) {
      tickets = JSON.parse(data.tickets);
    }
  });
</script>

<h1 class="font-bold text-3xl text-white mb-4">Let's make some tickets</h1>
{#if error}
  <div
    class="fixed bottom-0 w-full px-4 py-6 md:w-auto md:px-6 md:rounded md:shadow-lg md:bottom-3 md:right-3 bg-white"
    in:fly={{ y: 100, duration: 200 }}
    out:fly={{ y: 100, duration: 200 }}
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
          error = "";
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
<div class="w-full h-fit text-white">
  {#if creatingTicket}
    <form
      on:submit|preventDefault={() => {
        saveTicket();
      }}
      class="flex flex-col gap-2 bg-matteBlack p-4 rounded-md w-full"
    >
      <div class="flex flex-row w-full gap-4">
        <div class="flex flex-col w-full">
          <label for="ticketName">Ticket Name</label>
          <input
            id="ticketName"
            name="ticketName"
            type="text"
            bind:value={ticketName}
            class="border-[1px] rounded-md border-black w-full p-1 text-black"
          />
        </div>

        <div class="flex flex-col w-full">
          <label for="ticketPrice">Ticket Price</label>
          <input
            id="ticketPrice"
            name="ticketPrice"
            type="number"
            min="1"
            step="any"
            bind:value={ticketPrice}
            class="border-[1px] rounded-md border-black w-full p-1 text-black"
          />
        </div>
      </div>

      <button
        on:click={() => {
          showAdvancedOptions = !showAdvancedOptions;
        }}
        class="flex flex-row items-center gap-2 transition"
        type="button"
      >
        Advanced Options
        <IconCaretDown
          size={20}
          stroke={1}
          class={`${showAdvancedOptions ? "transform -rotate-180" : ""}`}
        />
      </button>
      {#if showAdvancedOptions}
        <div class="w-full h-fit p-1 flex flex-col gap-2">
          <label for="ticketGender">Gender</label>

          <select
            id="ticketGender"
            name="ticketGender"
            class="border-[1px] rounded-md border-black p-1 text-black"
            on:change={(e) => {
              ticketGender = e.target.value;
            }}
          >
            <option selected={true}>Select Gender (Optional)</option>
            {#each genders as gender}
              <option>{gender}</option>
            {/each}
          </select>

          <label for="ticketQuantity">Quantity</label>
          <input
            id="ticketQuantity"
            name="ticketQuantity"
            type="number"
            bind:value={ticketQuantity}
            class="border-[1px] rounded-md border-black p-1 text-black"
          />
          <div class="flex flex-row justify-between items-center gap-2">
            <div class="flex flex-col gap-1 w-full">
              <label for="ticketSaleStart">Sale Start</label>
              <input
                id="ticketSaleStart"
                name="ticketSaleStart"
                type="date"
                bind:value={ticketSaleStart}
                class="border-[1px] rounded-md border-black p-1 text-black"
              />
            </div>
            <div class="flex flex-col gap-1 w-full">
              <label for="timeStart" class="text-white">Start Time</label>
              <div class="relative">
                <div
                  id="timeStart"
                  class="border-[1px] border-black p-1 rounded-md w-full cursor-pointer bg-white flex flex-row items-center justify-between text-black"
                  on:mouseup={() =>
                    (showTimeStartDropdown = !showTimeStartDropdown)}
                  use:clickOutside
                  on:click_outside={() => {
                    showTimeStartDropdown = false;
                  }}
                >
                  {#if !selectedTimeStart}
                    Select a time
                  {:else}
                    {selectedTimeStart}
                  {/if}
                  <IconCaretDown size={20} stroke={1} />
                </div>
                {#if showTimeStartDropdown}
                  <div
                    class="absolute w-full bg-matteBlack border border-gray-300 rounded-md z-10 max-h-[200px] overflow-scroll"
                  >
                    {#each timeOptions as time (time)}
                      <div
                        class="p-1 hover:bg-gray-200 hover:text-black cursor-pointer"
                        on:mouseup={() => selectTime("start", time)}
                      >
                        {time}
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            </div>
          </div>
          <div class="flex flex-row gap-4 justify-between items-center w-full">
            <div class="flex flex-col gap-1 w-full">
              <label for="ticketSaleEnd">Sale End</label>
              <input
                id="ticketSaleEnd"
                name="ticketSaleEnd"
                type="date"
                bind:value={ticketSaleEnd}
                class="border-[1px] rounded-md border-black p-1 text-black"
              />
            </div>
            <div class="flex flex-col gap-1 w-full">
              <label for="timeEnd" class="text-white">End Time</label>
              <div class="relative">
                <div
                  id="timeEnd"
                  class="border-[1px] border-black p-1 rounded-md w-full cursor-pointer bg-white flex flex-row items-center justify-between text-black"
                  on:mouseup={() =>
                    (showTimeEndDropdown = !showTimeEndDropdown)}
                  use:clickOutside
                  on:click_outside={() => {
                    showTimeEndDropdown = false;
                  }}
                >
                  {#if !selectedTimeEnd}
                    Select a time
                  {:else}
                    {selectedTimeEnd}
                  {/if}
                  <IconCaretDown size={20} stroke={1} />
                </div>
                {#if showTimeEndDropdown}
                  <div
                    class="absolute w-full bg-matteBlack border border-gray-300 rounded-md z-10 max-h-[200px] overflow-scroll"
                  >
                    {#each timeOptions as time (time)}
                      <div
                        class="p-1 hover:bg-gray-200 hover:text-black cursor-pointer"
                        on:mouseup={() => selectTime("end", time)}
                      >
                        {time}
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
      {/if}
      <div class="flex flex-row gap-4">
        <button
          class="w-full p-1 bg-red-500 text-white rounded-md"
          type="button"
          on:click={() => {
            creatingTicket = false;
          }}>Cancel</button
        >
        {#if !ticketName || (ticketSaleStart && !ticketSaleEnd) || (ticketSaleEnd && !ticketSaleStart)}
          <button
            class="w-full p-1 bg-green-500/25 border border-green-500 text-white rounded-md"
            disabled>Save</button
          >
        {:else}
          <button class="w-full p-1 bg-green-500 text-white rounded-md"
            >Save</button
          >
        {/if}
      </div>
    </form>
  {:else}
    <button
      class="bg-matteBlack text-white rounded-md p-3 w-full flex flex-row gap-2 items-center justify-center"
      on:click={() => {
        creatingTicket = true;
        // tickets = [...tickets, new Ticket(tickets.length + 1)];
      }}
    >
      New Ticket

      <IconCirclePlus size={28} stroke={1} /></button
    >
  {/if}
  <div class="flex flex-col gap-3 my-4">
    {#each tickets as ticket}
      <div class="bg-matteBlack p-4 rounded-md flex flex-col">
        <h1 class="text-lg font-bold">{ticket.name}</h1>
        {#if ticket.price}
          <div class="flex md:flex-row md:gap-5 flex-col">
            <p>
              Price: <span class="text-green-400"
                >${ticket.price.toFixed(2)}</span
              >
            </p>
            <p class="flex flex-row gap-3 items-center">
              You Profit: <span class="text-green-400"
                >${(ticket.price - ticket.price * 0.07).toFixed(2)}</span
              >
            </p>
            <div
              tabindex="0"
              role="link"
              aria-label="tooltip 1"
              class="focus:outline-none focus:ring-gray-300 rounded-full focus:ring-offset-2 focus:ring-2 focus:bg-gray-200 relative md:mt-0 group"
            >
              <div class=" cursor-pointer">
                <svg
                  aria-haspopup="true"
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler icon-tabler-info-circle"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#A0AEC0"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <circle cx="12" cy="12" r="9" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                  <polyline points="11 12 12 12 12 16 13 16" />
                </svg>
              </div>
              <div
                id="tooltip1"
                role="tooltip"
                class="z-20 -mt-16 w-64 absolute group-hover:inline-block hidden transition duration-150 ease-in-out left-0 ml-8 shadow-lg bg-white p-4 rounded"
              >
                <svg
                  class="absolute left-0 -ml-2 bottom-0 top-0 h-full"
                  width="9px"
                  height="16px"
                  viewBox="0 0 9 16"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                >
                  <g
                    id="Page-1"
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd"
                  >
                    <g
                      id="Tooltips-"
                      transform="translate(-874.000000, -1029.000000)"
                      fill="#FFFFFF"
                    >
                      <g
                        id="Group-3-Copy-16"
                        transform="translate(850.000000, 975.000000)"
                      >
                        <g
                          id="Group-2"
                          transform="translate(24.000000, 0.000000)"
                        >
                          <polygon
                            id="Triangle"
                            transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) "
                            points="4.5 57.5 12.5 66.5 -3.5 66.5"
                          />
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
                <p class="text-sm font-bold text-gray-800 pb-1">
                  Application Fee
                </p>
                <p class="text-xs leading-4 text-gray-600 pb-3">
                  We take a 7% application fee to keep our platform running.
                </p>
              </div>
            </div>
          </div>
        {/if}
        {#if ticket.gender}
          <p>{ticket.gender}</p>
        {/if}
        {#if ticket.saleStartDate}
          <div class="flex flex-col gap-3 my-3 text-gray-200">
            <div class="flex flex-col w-full h-full">
              <p class="underline">Sale Start</p>
              <p class="flex flex-row gap-1">
                <IconCalendar />
                {DateTime.fromISO(ticket.saleStartDate).toLocaleString()} - {ticket.saleStartTime}
              </p>
            </div>
            <div class="flex flex-col w-full h-full">
              <p class="underline">Sale End</p>
              <p class="flex flex-row gap-1">
                <IconCalendar />
                {ticket.saleEndDate} - {ticket.saleEndTime}
              </p>
            </div>
          </div>
        {/if}
        <button
          class="bg-mainRed rounded px-4 py-2 mt-4 w-fit"
          on:click={() => {
            tickets = tickets.filter((t) => t.id !== ticket.id);
          }}>Remove Ticket</button
        >
      </div>
    {/each}
  </div>
  {#if tickets.length > 0}
    <button
      on:click={() => {
        completion();
      }}
      type="submit"
      class="bg-black text-white p-2 rounded-md w-full"
    >
      Next
    </button>
  {:else}
    <button
      type="submit"
      class="bg-black/50 border-[1px] border-black text-white p-2 rounded-md w-full"
      disabled
    >
      Next
    </button>
  {/if}
</div> -->
