<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";
  import { Loader } from "@googlemaps/js-api-loader";
  import { IconCaretDown, IconQuestionMark } from "@tabler/icons-svelte";
  import { clickOutside } from "$lib/clickOutSide";
  import { DateTime } from "luxon";
  import { fly } from "svelte/transition";
  import axios from "axios";

  const dispatch = createEventDispatcher();

  let name: string = "";
  let autocomplete: google.maps.places.Autocomplete;
  let address: any;
  let latAndLong: any;
  let privateAddress: boolean = false;
  let description: string = "";
  let date: string;
  let hostName: StaticRange;
  let ageLimit: number = 0;
  let selectedTimeStart: string;
  let selectedTimeEnd: string;
  let timeOptions: string[] = [];
  let showTimeStartDropdown = false;
  let showTimeEndDropdown = false;
  let validEndTime: boolean = false;
  let externalEventLink: string = "";
  let scrapeUrl: string = "";

  let error: string = "";
  let scrapingPageState: "idle" | "loading" | "error" = "idle";

  export let data: any;

  $: if (selectedTimeStart && selectedTimeEnd) {
    validEndTime = isEndTimeAfterStartTime(selectedTimeStart, selectedTimeEnd);
  }

  function isEndTimeAfterStartTime(startTime: any, endTime: any) {
    // Parse the times using Luxon's DateTime
    // let start = DateTime.fromFormat(startTime, "h:mm a");
    // let end = DateTime.fromFormat(endTime, "h:mm a");

    // // Check if the end time is after the start time
    // return end > start;
    return true;
  }

  const options = {
    componentRestrictions: { country: "us" },
    strictBounds: false,
  };

  const completion = () => {
    if (
      !name ||
      !address ||
      !selectedTimeStart ||
      !selectedTimeEnd ||
      !date ||
      !hostName ||
      !description
    ) {
      error = "Please fill out all fields";
      return;
    } else if (!validEndTime) {
      error = "End time must be after start time";
      return;
    }

    dispatch("completion", {
      name,
      date,
      startTime: selectedTimeStart,
      endTime: selectedTimeEnd,
      address,
      latAndLong,
      description,
      hostName,
      privateAddress,
      ageLimit,
      externalEventLink,
    });
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

  const scrapePage = async () => {
    scrapingPageState = "loading";
    try {
      const data = await axios.post("/api/scrapePage", {
        url: scrapeUrl,
      });

      if (!data.data) return;

      name = data.data.title;
      description =
        data.data.shortDescription + "\n" + data.data.longDescription;
      hostName = data.data.host;

      document.getElementById("autocomplete").value = data.data.location;

      date = DateTime.fromFormat(data.data.date, "EEE MMM dd, h:mm a").toFormat(
        "yyyy-MM-dd"
      );

      selectedTimeStart = DateTime.fromFormat(
        data.data.date,
        "EEE MMM dd, h:mm a"
      ).toFormat("h:mm a");
      selectedTimeEnd = "2:00 AM";

      externalEventLink = scrapeUrl;

      //       {
      //   title: 'USC Mansion Rave',
      //   host: 'elevate',
      //   image: 'https://images.posh.vip/images/5c8f4ef4-c05b-4c73-8770-e8de3770eb1e.jpg',
      //   shortDescription: 'First & only house USC mansion of the summer. Join us for a night of dancing with beautiful people & music 🥂 Students & Non-Students welcome. ',
      //   longDescription: 'availible tonight only.\nthis tier will sell out tonight, and raise to $25.',
      //   date: 'Sat Jul 22, 10:00 PM',
      //   location: '1182 1/2 W 37th Pl, Los Angeles, CA 90007, USA'
      // }
    } catch (e) {
      console.log(e);
    } finally {
      scrapingPageState = "idle";
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

    const loader = new Loader({
      apiKey: "AIzaSyCUQ24URm-IQ3QKw9WtDc5L36irv31FMpg",
      version: "weekly",
      libraries: ["places"],
    });

    loader.loadCallback((e) => {
      if (e) {
        console.log(e);
      } else {
        autocomplete = new google.maps.places.Autocomplete(
          document.getElementById("autocomplete") as HTMLInputElement,
          options
        );

        autocomplete.addListener("place_changed", onPlaceChanged);
      }
    });

    function onPlaceChanged() {
      latAndLong = autocomplete.getPlace().geometry?.location.toString();
      address = autocomplete.getPlace();
      address = address.formatted_address;
    }

    if (data) {
      if (data.name) name = data.name;
      if (data.hostName) hostName = data.hostName;
      if (data.description) description = data.description;
      if (data.date) date = data.date;
      if (data.startTime) selectedTimeStart = data.startTime;
      if (data.endTime) selectedTimeEnd = data.endTime;
      if (data.address) {
        address = data.address;
        document.getElementById("autocomplete").value = address;
      }
      privateAddress = data.privateAddress;
    }
  });
</script>

<h1 class="font-bold text-3xl text-white mb-4">Party Info</h1>
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
<div class="flex flex-row">
  <input
    type="text"
    placeholder="Import event data from posh"
    class="p-2 rounded-md bg-matteBlack text-white outline-none w-full"
    name="scrapeUrl"
    id="scrapeUrl"
    bind:value={scrapeUrl}
  />

  <button
    class={`bg-white text-black rounded-md p-2 ml-2 ${
      scrapingPageState === "loading" ? "opacity-50" : ""
    }}`}
    on:click={() => (scrapingPageState === "loading" ? null : scrapePage())}
    >{scrapingPageState === "idle" ? "Import" : "Loading..."}</button
  >
</div>
<div class="w-full h-1 bg-neutral-700 my-5" />
<form
  on:submit|preventDefault={() => completion()}
  class="flex flex-col gap-2 pb-20"
>
  <div class="w-full flex flex-col sm:flex-row gap-4">
    <div class="flex flex-col gap-2 w-full">
      <label for="name" class="text-white">Party Name</label>
      <input
        type="text"
        name="name"
        id="name"
        placeholder="Ex. Epic Backyard Rager"
        class="p-2 rounded-md bg-matteBlack text-white outline-none"
        bind:value={name}
      />
    </div>
    <div class="flex flex-col gap-2 w-full">
      <label for="name" class="text-white">Party Host</label>
      <input
        type="text"
        name="host"
        id="host"
        placeholder="Host"
        class="p-2 rounded-md bg-matteBlack text-white outline-none"
        bind:value={hostName}
      />
    </div>
  </div>
  <label for="description" class="text-white">Party Description</label>
  <textarea
    name="description"
    id="description"
    class="rounded-md p-2 bg-matteBlack text-white outline-none resize-none"
    bind:value={description}
    placeholder="Party Description"
  />
  <div class="w-full flex flex-col sm:flex-row gap-4">
    <div class="flex flex-col gap-1 w-full">
      <label for="autocomplete" class="text-white">Party Location</label>
      <input
        type="text"
        name="autocomplete"
        id="autocomplete"
        autocomplete="off"
        class="p-2 rounded-md bg-matteBlack text-white outline-none"
      />
    </div>
    <div class="flex flex-col min-w-fit gap-2">
      <label for="private" class="text-white">Private Address?</label>
      <div class="flex flex-row gap-1">
        <div
          on:mousedown={() => (privateAddress = !privateAddress)}
          class={`w-14 h-8  rounded-full flex flex-row overflow-hidden items-center p-1 transition-all cursor-pointer ${
            privateAddress
              ? "justify-end bg-green-400"
              : "justify-start bg-matteBlack"
          }`}
        >
          <div class="w-6 h-6 rounded-full bg-white" />
        </div>
      </div>
    </div>
    <div class="flex flex-col min-w-fit gap-2">
      <label for="private" class="text-white">Age Limit?</label>
      <div class="flex flex-row gap-1">
        <select
          name="ageLimit"
          id="ageLimit"
          class="p-2 rounded-md bg-matteBlack text-white outline-none"
          bind:value={ageLimit}
        >
          <option value="0">No Limit</option>
          <option value="18">18+</option>
          <option value="21">21+</option>
        </select>
      </div>
    </div>
  </div>

  <div class="flex flex-col sm:flex-row gap-2 w-full mb-4">
    <div class="flex flex-col gap-2 w-full">
      <label for="date" class="text-white">Date</label>

      <input
        id="date"
        name="date"
        type="date"
        class="p-2 rounded-md bg-matteBlack text-white outline-none"
        bind:value={date}
      />
    </div>
    <div class="flex flex-col gap-2 w-full">
      <label for="timeStart" class="text-white">Start Time</label>
      <div class="relative">
        <div
          id="timeStart"
          class=" p-2 rounded-md w-full cursor-pointer bg-matteBlack text-white flex flex-row items-center justify-between"
          on:mouseup={() => (showTimeStartDropdown = !showTimeStartDropdown)}
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
            class="absolute w-full bg-matteBlack border rounded-md z-10 max-h-[200px] overflow-scroll"
          >
            {#each timeOptions as time (time)}
              <div
                class="p-1 text-white hover:bg-gray-600 cursor-pointer"
                on:mouseup={() => selectTime("start", time)}
              >
                {time}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
    <div class="flex flex-col gap-2 w-full">
      <label for="timeEnd" class="text-white">End Time</label>
      <div class="relative">
        <div
          id="timeEnd"
          class="p-2 rounded-md w-full cursor-pointer bg-matteBlack text-white flex flex-row items-center justify-between"
          on:mouseup={() => (showTimeEndDropdown = !showTimeEndDropdown)}
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
            class="absolute w-full bg-matteBlack border rounded-md z-10 max-h-[200px] overflow-scroll"
          >
            {#each timeOptions as time (time)}
              <div
                class="p-1 text-white hover:bg-gray-600 cursor-pointer"
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
  <div class="flex flex-col gap-2 w-full mb-4">
    <label for="name" class="text-white">External Event Link</label>
    <input
      type="text"
      name="externalEventLink"
      id="externalEventLink"
      placeholder="www.google.com"
      class="p-2 rounded-md bg-matteBlack text-white outline-none"
      bind:value={externalEventLink}
    />
  </div>

  {#if !name || !date || !selectedTimeStart || !selectedTimeEnd || !address}
    <button
      class="bg-black text-white p-2 rounded-md w-full border-[1px] bg-black/25 border-black"
      disabled
    >
      Next
    </button>
  {:else}
    <button type="submit" class="bg-black text-white p-2 rounded-md w-full">
      Next
    </button>
  {/if}
</form>
