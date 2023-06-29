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
  import axios from "axios";
  // import { loadStripe } from "@stripe/stripe-js";
  // import { PUBLIC_STRIPE_KEY } from "$env/static/public";
  // import { Elements } from "svelte-stripe";
  // const stripe = require("stripe")(PUBLIC_STRIPE_KEY);

  let usersParties: any = [];
  let upComingAndFutureParties: any = [];
  let stripe: any = null;
  let totalRevenue: number = 0;
  let totalAttendees: number = 0;
  let loadingParties: boolean = true;
  let loadingAnalytics: boolean = true;
  let stripeAccountBalanceAvailable: any = null;
  let stripeAccountBalancePending: any = null;

  const splitParties = () => {
    const now = DateTime.now();
    usersParties.forEach((party: any) => {
      const partyDate = DateTime.fromISO(party.date);
      if (partyDate.startOf("day") >= now.startOf("day"))
        upComingAndFutureParties.push(party);
    });


    upComingAndFutureParties = upComingAndFutureParties.slice(0, 1);
  };

  const retrieveConnectAccount = async () => {
    if (!$authStore.currentUser) return;

    try {
      const account = await getDoc(
        doc(db, "stripe-accounts", $authStore.currentUser["uid"])
      );
      if (account.exists()) {
        await axios
          .get(
            `/api/retrieveConnectAccountBalance?id=${account.data().stripeAccountId}`
          )
          .then((res) => {
            stripeAccountBalanceAvailable = res.data.available[0].amount/100;
            stripeAccountBalancePending = res.data.pending[0].amount/100;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  $: if (usersParties.length > 0) splitParties();

  $: if (!$authStore.isLoading && $authStore.currentUser) {
    getDocs(
      query(
        collection(db, "parties"),
        where("hostAccountId", "==", $authStore.currentUser["uid"])
      )
    ).then((snapshot) => {
      const parties: any = [];
      snapshot.forEach((doc) => {
        parties.push({ id: doc.id, ...doc.data() });
      });
      usersParties = parties;
      loadingParties = false;
    });

    retrieveConnectAccount();
  }

  let firstPartyUpdate = true;

  $: if (usersParties.length > 0 && firstPartyUpdate) {
    if (firstPartyUpdate) {
      firstPartyUpdate = false;
    }

    getDocs(
      query(
        collection(db, "payments"),
        where(
          "metadata.partyId",
          "in",
          usersParties.map((p: any) => p.id)
        )
      )
    ).then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const payment = doc.data();
        totalAttendees += 1;
        totalRevenue += payment.amount / 100;
      });
      loadingAnalytics = false;
    });
  }
</script>


<section class="flex flex-col sm:flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-8 h-fit overflow-scroll ">
  <div class="h-fit lg:h-full lg:overflow-y-auto">
    <div class="mb-5 md:mb-10">
      <h1 class="text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Analytics</h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
        <div class="flex flex-col border-[1px] h-fit w-full col-span-1 p-2 border-black rounded-md bg-white text-center">
          <h1>
            {#if loadingAnalytics}
              <span class="font-medium text-sm uppercase text-gray-500 animate-pulse">Loading...</span>
            {:else}
              <span class="font-medium text-sm uppercase text-gray-500">Attendies</span><br />
              <span class="text-blue-500">{totalAttendees > 0 ? totalAttendees : "0"}</span>
            {/if}
          </h1>
        </div>
        <div class="flex flex-col border-[1px] h-fit w-full col-span-1 p-2 border-black rounded-md bg-white text-center">
          <h1>
            {#if loadingAnalytics}
              <span class="font-medium text-sm uppercase text-gray-500 animate-pulse">Loading...</span>
            {:else}
              <span class="font-medium text-sm uppercase text-gray-500">Available</span><br />
              <span class="text-green-500">{stripeAccountBalanceAvailable > 0 ? "$" + stripeAccountBalanceAvailable : "$0"}</span>
            {/if}
          </h1>
        </div>
        <div class="flex flex-col border-[1px] h-fit w-full col-span-1 p-2 border-black rounded-md bg-white text-center">
          <h1>
            {#if loadingAnalytics}
              <span class="font-medium text-sm uppercase text-gray-500 animate-pulse">Loading...</span>
            {:else}
              <span class="font-medium text-sm uppercase text-gray-500">Pending</span><br />
              <span class="text-yellow-500">{stripeAccountBalancePending > 0 ? "$" + stripeAccountBalancePending : "$0"}</span>
            {/if}
          </h1>
        </div>
      </div>

      <dialog id="HostParty" class="opacity-0 open:opacity-100 transition-all duration-500 md:max-w-[60vw] md:w-[60vw] h-fit max-h-[70vh] rounded-md drop-shadow-md">
        <!-- <HostPartyInfo on:close={handleClose} /> -->
      </dialog>
    </div>

    {#if usersParties.length > 0}
      <h1 class="font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-4">Your Next Party</h1>
      <div class="flex flex-col gap-4">
        {#each upComingAndFutureParties as party}
          <PartyComponent {party} />
        {/each}
        <div class="w-full bg-white h-fit flex flex-row gap-3 rounded-md p-4 justify-between relative">
          <a href="/hub/dashboard/parties" class="text-black flex flex-row items-center justify-center gap-2 w-full h-full hover:text-mainRed">
            <IconEye /> View All
          </a>
        </div>
      </div>
    {:else}
      <div class="bg-white w-full h-fit p-5 rounded-md flex flex-col items-start justify-start">
        <h1 class="font-semibold text-lg">Get Started</h1>
        <a href="/hub/dashboard/parties" class="text-mainRed font-medium">Host a Party</a>
      </div>
    {/if}
  </div>

  <div class="flex flex-col max-h-[60vh] md:max-h-[full] overflow-scroll">
    <h1 class="text-2xl sm:text-3xl lg:text-4xl text-white font-bold mb-2">Activity</h1>
    <div class="bg-white border-[2px] border-black rounded-md flex flex-col gap-2 flex-1 p-4 overflow-scroll">
      {#each { length: 10 } as _, i}
        <div class="grid grid-cols-1 sm:grid-cols-2 bg-neutral-100 rounded-md border-[1px]">
          <div class="flex flex-col p-2 gap-2 relative col-span-1">
            <div class="flex flex-row gap-3 items-center justify-between">
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
