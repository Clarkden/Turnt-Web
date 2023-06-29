<!-- <script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { db } from "../../../../../lib/firebase";
  import { doc, getDoc, setDoc } from "firebase/firestore";
  import { DateTime } from "luxon";
  import {
    IconClock,
    IconCalendar,
    IconLocation,
    IconUser,
  } from "@tabler/icons-svelte";
  import { authStore } from "../../../../../stores/authStore";
  import { fly } from "svelte/transition";
  import { writable, derived } from "svelte/store";

  let party: any = {};
  let name: string = "";
  let date: string = "";
  let startTime: string = "";
  let endTime: string = "";
  let privateAddress: boolean = false;
  let address: string = "";
  let ageLimit: number = 0;
  let attendees: number = 0;
  let description: string = "";

  onMount(async () => {
    const partyDoc = await getDoc(doc(db, "parties", $page.params.id));
    if (partyDoc.exists()) {
      party = partyDoc.data();
      name = party.name;
      date = party.date;
      startTime = party.startTime;
      endTime = party.endTime;
      privateAddress = party.privateAddress;
      address = party.address;
      ageLimit = party.ageLimit;
      attendees = party.attendees;
      description = party.description;
    }
  });

  const updateParty = async () => {
    try {
      await setDoc(doc(db, "parties", $page.params.id), {
        name,
        date,
        startTime,
        endTime,
        privateAddress,
        address,
        ageLimit,
        attendees,
        description,
      });
      alert("Party information has been updated successfully!");
    } catch (error) {
      console.log(error);
    }
  };
</script>

<div
  class="w-full h-screen overflow-scroll overflow-x-clip md:h-full flex flex-col md:flex-row md:p-10 pb-20 text-black"
>
  <div
    class="w-full md:min-w-[50%] p-5 flex flex-col gap-4 bg-matteBlack text-black h-fit"
  >
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl fontold mb-3 text-white pb-2">Edit Party Info</h1>

      <div class="flex flex-col md:flex-row gap-4 w-full">
        <div class="w-full">
          <img
            src={party.flyerPath}
            alt="flyer"
            class="w-full h-full object-cover rounded-md"
          />
        </div>
        <div class="flex flex-col gap-2 w-full">
          <label class="text-lg text-white" for="flyer">Flyer</label>
          <input
            class="w-full p-2 rounded-md bg-white textlack"
            id="flyer"
            type="file"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2 mb-4">
        <label class="text-lg text-white" for="name">Party Name</label>
        <input
          class="w-full p-2 rounded-md bg-white textlack"
          id="name"
          bind:value={name}
          type="text"
        />
      </div>

      <div class="flex flex-col gap-2 mb-4">
        <label class="text-lg text-white" for="date">Date</label>
        <input
          class="w-full p-2 rounded-md bg-white textlack"
          id="date"
          bind:value={date}
          type="date"
          disabled
        />
      </div>

      <div class="flex flex-col gap-2 mb-4">
        <label class="text-lg text-white" for="startTime">Start Time</label>
        <input
          class="w-full p-2 rounded-md bg-white textlack"
          id="startTime"
          bind:value={startTime}
          type="time"
        />
      </div>

      <div class="flex flex-col gap-2 mb-4">
        <label class="text-lg text-white" for="endTime">End Time</label>
        <input
          class="w-full p-2 rounded-md bg-white textlack"
          id="endTime"
          bind:value={endTime}
          type="time"
        />
      </div>

      <div class="flex flex-col gap-2 mb-4">
        <label class="text-lg text-white" for="privateAddress"
          >Private Address</label
        >
        <input
          id="privateAddress"
          bind:checked={privateAddress}
          type="checkbox"
        />
      </div>

      <div class="flex flex-col gap-2 mb-4">
        <label class="text-lg text-white" for="address">Address</label>
        <input
          class="w-full p-2 rounded-md bg-white textlack"
          id="address"
          bind:value={address}
          type="text"
          disabled
        />
      </div>

      <div class="flex flex-col gap-2 mb-4">
        <label class="text-lg text-white" for="ageLimit">Age Limit</label>
        <input
          class="w-full p-2 rounded-md bg-white textlack"
          id="ageLimit"
          bind:value={ageLimit}
          type="number"
          min="0"
        />
      </div>

      <div class="flex flex-col gap-2 mb-4">
        <label class="text-lg text-white" for="description">Description</label>
        <textarea
          class="w-full p-2 rounded-md bg-white textlack h-24"
          id="description"
          bind:value={description}
        />
      </div>

      <button
        class="mt-5 py-3 px-10 rounded-full bg-mainRed text-black text-xl fontold tracking-wider"
        on:click={updateParty}>Save Changes</button
      >
    </div>
  </div>
</div> -->
