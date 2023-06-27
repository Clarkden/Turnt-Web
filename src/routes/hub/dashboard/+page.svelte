<script lang="ts">
  import { onMount } from "svelte";
  import { auth, db } from "../../../lib/firebase";
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
  import { authStore } from "../../../stores/authStore";
  import { get } from "svelte/store";
  import { DateTime } from "luxon";
  import PartyComponent from "../../../components/PartyComponent.svelte";
  import { IconEye } from "@tabler/icons-svelte";
  // import { loadStripe } from "@stripe/stripe-js";
  // import { PUBLIC_STRIPE_KEY } from "$env/static/public";
  // import { Elements } from "svelte-stripe";
  // const stripe = require("stripe")(PUBLIC_STRIPE_KEY);

  let usersParties: any = [];
  let upComingAndFutureParties: any = [];
  let stripe: any = null;

  const splitParties = () => {
    const now = DateTime.now();
    usersParties.forEach((party: any) => {
      const partyDate = DateTime.fromISO(party.date);
      if (partyDate.startOf("day") >= now.startOf("day"))
        upComingAndFutureParties.push(party);
    });

    upComingAndFutureParties = upComingAndFutureParties.slice(0, 3);
  };

  $: if (usersParties.length > 0) splitParties();

  $: if (!$authStore.isLoading && $authStore.currentUser) {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "parties"),
        where("host", "==", $authStore.currentUser["uid"])
      ),
      (snapshot) => {
        const parties: any = [];
        snapshot.forEach((doc) => {
          parties.push({ id: doc.id, ...doc.data() });
        });
        usersParties = parties;
      }
    );
  }

  
</script>

<section class="flex flex-col gap-4 md:grid grid-cols-2 overflow-scroll">
  <div>
    <div class="mb-5 md:mb-10">
      <h1 class="text-white text-2xl font-bold mb-2">Analytics</h1>

      <div class="grid grid-cols-3 gap-2 w-full">
        <div
          class="flex flex-col border-[1px] h-fit w-full col-span-1 p-2 border-black rounded-md bg-white text-center"
        >
          <h1>
            <span class="font-medium text-sm uppercase text-gray-500"
              >Parties</span
            ><br />{usersParties.length > 0 ? usersParties.length : "0"}
          </h1>
        </div>
        <div
          class="flex flex-col border-[1px] h-fit w-full col-span-1 p-2 border-black rounded-md bg-white text-center"
        >
          <h1>
            <span class="font-medium text-sm uppercase text-gray-500"
              >Attendies</span
            ><br />1000
          </h1>
        </div>
        <div
          class="flex flex-col border-[1px] h-fit w-full col-span-1 p-2 border-black rounded-md bg-white text-center"
        >
          <h1>
            <span class="font-medium text-sm uppercase text-gray-500"
              >Revenue</span
            ><br />$1000
          </h1>
        </div>
      </div>
      <dialog
        id="HostParty"
        class="opacity-0 open:opacity-100 transition-all duration-500 md:max-w-[60vw] md:w-[60vw] h-fit max-h-[70vh] rounded-md drop-shadow-md"
      >
        <!-- <HostPartyInfo on:close={handleClose} /> -->
      </dialog>
    </div>
    
    {#if usersParties.length > 0}
      <!-- <div
        class="flex flex-col bg-white rounded-md w-full h-fit border-[2px] border-black gap-4 p-4 max-h-[65vh] overflow-scroll"
      > -->
      <h1 class="font-bold text-3xl text-white mb-4">Your Upcoming Parties</h1>
      <div class="flex flex-col gap-4">
        {#each upComingAndFutureParties as party}
          <PartyComponent {party} />
        {/each}
        <div
          class="w-full bg-white h-fit flex flex-row gap-3 rounded-md p-4 justify-between relative"
        >
          <a
            href="/hub/dashboard/parties"
            class="text-black flex flex-row items-center justify-center gap-2 w-full h-full hover:text-mainRed"
          >
            <IconEye />
            View All</a
          >
        </div>
      </div>
      <!-- </div> -->
    {:else}
      <div
        class="bg-white w-full h-fit p-5 rounded-md flex flex-col items-start justify-start"
      >
        <h1 class="font-semibold text-lg">Get Started</h1>
        <a href="/hub/dashboard/parties" class="text-mainRed font-medium"
          >Host a Party</a
        >
      </div>
    {/if}
  </div>
  <div
    class="flex flex-col h-full max-h-[60vh] md:max-h-[80vh] overflow-scroll"
  >
    <h1 class="text-2xl text-white font-bold mb-2">Activity</h1>
    <div
      class="bg-white border-[2px] border-black rounded-md flex flex-col gap-2 flex-1 p-4 overflow-scroll"
    >
      {#each { length: 10 } as _, i}
        <div class="grid grid-cols-2 bg-neutral-100 rounded-md border-[1px]">
          <div class="flex flex-col p-2 gap-2 relative col-span-1">
            <div class="flex flex-row gap-3 items-cente justify-betweenr">
              <div class="w-10 h-10 rounded-full bg-white" />
              <h1 class="text-lg">John Doe</h1>
            </div>
            <h1>Ticket Purchase</h1>
          </div>
          <div class="flex flex-col justify-center">
            <p>Party: John's Party</p>
            <p>Ticket: General</p>
            <p>Amount: <span class="text-green-400">$14.99</span></p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
