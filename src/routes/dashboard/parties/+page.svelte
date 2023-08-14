<script lang="ts">
  // import { authStore, memberType } from "../../../../stores/authStore";
  import { db } from "$lib/firebase";
  import {
    setDoc,
    doc,
    getDoc,
    onSnapshot,
    getDocs,
    query,
    collection,
    where,
  } from "firebase/firestore";
  import { fade, fly, slide } from "svelte/transition";

  import Multiform from "../../../components/Multiform.svelte";
  import { DateTime } from "luxon";
  import PartyComponent from "../../../components/PartyComponent.svelte";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import type { Party } from "$lib/types";
  import { IconCaretDown } from "@tabler/icons-svelte";

  let usersParties: Party[] = [];
  let showPartyForm: boolean = false;

  let pastParties: Party[] = [];
  let upcomingParties: Party[] = [];
  let todayParties: Party[] = [];
  let showPastParties: boolean = false;

  const splitParties = () => {
    const now = DateTime.now();
    usersParties.forEach((party) => {
      const partyDate = DateTime.fromISO(party.date).set({
        hour: DateTime.fromFormat(party.endTime, "h:mm a").hour,
        minute: DateTime.fromFormat(party.endTime, "h:mm a").minute,
      });

      // Check for duplicates
      const isDuplicateInPastParties = pastParties.some(
        (p) => p.id === party.id
      );
      const isDuplicateInUpcomingParties = upcomingParties.some(
        (p) => p.id === party.id
      );
      const isDuplicateInTodayParties = todayParties.some(
        (p) => p.id === party.id
      );

      if (partyDate < now && !isDuplicateInPastParties) {
        pastParties = [...pastParties, party];
      } else if (partyDate > now && !isDuplicateInUpcomingParties) {
        upcomingParties = [...upcomingParties, party];
      } else if (!isDuplicateInTodayParties) {
        todayParties = [...todayParties, party];
      }
    });
  };

  const fetchParties = async () => {
    try {
      const q = query(
        collection(db, "parties"),
        where("hostAccountId", "==", $page.data.uid)
      );

      const snapshot = await getDocs(q);
      let parties: any = [];
      snapshot.forEach((doc) => {
        parties = [...parties, { id: doc.id, ...doc.data() }];
      });

      usersParties = parties;
      splitParties();
    } catch (error) {
      console.error("Error fetching parties:", error);
    }
  };

  onMount(async () => {
    fetchParties();
  });
</script>

{#if showPartyForm}
  <div
    class="absolute w-full h-full bg-black/50 flex flex-col items-center justify-center z-50"
    transition:fade={{ duration: 500 }}
  >
    <div
      class="h-full w-full md:h-[90vh] md:w-[60vw] bg-mainRed md:rounded-md overflow-scroll"
      in:fly={{ x: 500, duration: 500 }}
      out:fly={{ x: 500, duration: 1000 }}
    >
      <div class="flex flex-col w-full h-full p-5">
        <Multiform
          on:cancel={() => {
            showPartyForm = false;
          }}
          on:completion={() => {
            showPartyForm = false;
            fetchParties();
          }}
        />
      </div>
    </div>
  </div>
{/if}

<div class="w-full flex-1 flex flex-col overflow-scroll p-4 md:p-10">
  <div class="flex flex-row gap-2">
    <button
      on:click={() => (showPartyForm = true)}
      class="bg-white p-2 rounded-md hover:bg-gray-200">New Party</button
    >
    <a
      href="/dashboard/parties/qrCodeScanner"
      class="bg-white p-2 rounded-md hover:bg-gray-200">Qr Code Scanner</a
    >
  </div>
  <div class="flex flex-col gap-10 mt-5">
    {#if usersParties.length > 0}
      {#if todayParties.length > 0}
        <div>
          <h1 class="text-2xl font-bold text-neutral-200 mb-2">
            Today's Parties
          </h1>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-x-10 md:gap-y-6 py-4 md:mx-auto z-50"
          >
            {#each todayParties as todayParty (todayParty.id)}
              <PartyComponent party={todayParty} />
            {/each}
          </div>
        </div>
      {/if}
      {#if upcomingParties.length > 0}
        <div>
          <h1 class="text-2xl font-bold text-neutral-200 mb-2">
            Your Upcoming Parties
          </h1>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-x-10 md:gap-y-6 py-4 md:mx-auto z-50"
          >
            {#each upcomingParties as upComingParty (upComingParty.id)}
              <PartyComponent party={upComingParty} />
            {/each}
          </div>
        </div>
      {/if}
      {#if pastParties.length > 0}
        <div>
          <button
            on:click={() => {
              showPastParties = !showPastParties;
            }}
            class={`text-2xl font-bold  mb-2 rounded-md ${
              showPastParties
                ? "text-neutral-100"
                : "text-neutral-400 hover:text-neutral-300"
            }`}
            >{showPastParties ? "Hide Past Parties" : "Show Past Parties"}

            <IconCaretDown class="inline-block w-6 h-6" />
          </button>
          {#if showPastParties}
            <div
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-x-10 md:gap-y-6 py-4 md:mx-auto z-50"
            >
              {#each pastParties as pastParty (pastParty.id)}
                <PartyComponent party={pastParty} />
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    {/if}
  </div>
</div>
