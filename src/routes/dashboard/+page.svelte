<script lang="ts">
  import { onMount } from "svelte";
  import { auth, db } from "$lib/firebase";
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
  import { get } from "svelte/store";
  import { DateTime } from "luxon";
  import PartyComponent from "../../components/PartyComponent.svelte";
  import { IconEye } from "@tabler/icons-svelte";
  import axios from "axios";
  import { user } from "$lib/stores/auth";
  import { page } from "$app/stores";
  // import { loadStripe } from "@stripe/stripe-js";
  // import { PUBLIC_STRIPE_KEY } from "$env/static/public";
  // import { Elements } from "svelte-stripe";
  // const stripe = require("stripe")(PUBLIC_STRIPE_KEY);

  let usersParties: any = [];
  let upComingAndFutureParties: any = [];
  let stripe: any = null;
  let totalRevenue: number = 0;
  let totalAttendees: number = 0;
  let loading: "loading" | "loaded" | "error" = "loading";
  let stripeAccountBalanceAvailable: any = null;
  let stripeAccountBalancePending: any = null;
  let recentTransactions: any = [];
  let stripeAccountId: any = null;

  const splitParties = () => {
    const now = DateTime.local();
    usersParties.forEach((party: any) => {
      const partyDate = DateTime.fromISO(party.date);
      const partyEndTime = DateTime.fromFormat(party.endTime, "h:mm a");

      // Combine the date and the time to get the exact end time
      const partyEnd = DateTime.fromObject({
        year: partyDate.year,
        month: partyDate.month,
        day: partyDate.day,
        hour: partyEndTime.hour,
        minute: partyEndTime.minute,
      });

      // Only include parties that haven't ended yet
      if (partyEnd > now) upComingAndFutureParties.push(party);
    });

    upComingAndFutureParties = upComingAndFutureParties.slice(0, 1);
  };

  const retrieveConnectAccountBalance = async () => {
    if (!stripeAccountId) return;

    try {
      await axios
        .get(`/api/retrieveConnectAccountBalance?id=${stripeAccountId}`)
        .then((res) => {
          stripeAccountBalanceAvailable = res.data.available[0].amount / 100;
          stripeAccountBalancePending = res.data.pending[0].amount / 100;
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const getStripeAccountId = async () => {
    const hostStripe = await getDoc(doc(db, "stripe-accounts", $page.data.uid));
    if (hostStripe.exists()) {
      try {
        const checkStripeAccount = await axios.get(
          `/api/checkStripeAccount?id=${hostStripe.data().stripeAccountId}`
        );
        if (
          checkStripeAccount.data.details_submitted &&
          checkStripeAccount.request.status === 200
        )
          stripeAccountId = checkStripeAccount.data.id;
      } catch (err) {
        console.log(err);
      }

      return (stripeAccountId = hostStripe.data().stripeAccountId);
    } else return null;
  };

  const getRecentTransactions = async () => {
    try {
      if (stripeAccountId) {
        const accountTransactions = await axios.post(
          "/api/getRecentTransactions",
          {
            stripeAccountId: stripeAccountId,
          }
        );

        if (accountTransactions.data.data.length > 0) {
          recentTransactions = accountTransactions.data.data;
          // console.log(recentTransactions);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  $: if (usersParties.length > 0) splitParties();

  onMount(async () => {
    try {
      const snapshot = await getDocs(
        query(
          collection(db, "parties"),
          where("hostAccountId", "==", $page.data.uid)
        )
      );
      const parties: any = [];
      snapshot.forEach((doc) => {
        parties.push({ id: doc.id, ...doc.data() });
      });
      usersParties = parties;

      await getStripeAccountId();
      await getRecentTransactions();
      await getHostData();
      await retrieveConnectAccountBalance();

      loading = "loaded";
    } catch (err) {
      console.log(err);
      loading = "error";
    }
  });

  const getHostData = async () => {
    const hostData = await getDoc(doc(db, "hosts", $page.data.uid));

    if (hostData.exists()) totalAttendees = hostData.data().attendees;
  };
</script>

<section
  class="flex flex-col sm:flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-8 h-fit overflow-scroll p-2 px-4 md:p-10"
>
  <div class="h-fit lg:h-full lg:overflow-y-auto">
    <div class="mb-5 md:mb-10">
      <h1 class="text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
        Analytics
      </h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
        {#if loading == "loading"}
          <!-- Loading state UI for each of the three columns -->
          <div
            class="flex flex-col border-[1px] h-fit w-full col-span-1 p-2 border-black rounded-md bg-white text-center"
          >
            <h1>
              <span
                class="font-medium text-sm uppercase text-gray-500 animate-pulse"
                >Loading...</span
              >
            </h1>
          </div>
          <div
            class="flex flex-col border-[1px] h-fit w-full col-span-1 p-2 border-black rounded-md bg-white text-center"
          >
            <h1>
              <span
                class="font-medium text-sm uppercase text-gray-500 animate-pulse"
                >Loading...</span
              >
            </h1>
          </div>
          <div
            class="flex flex-col border-[1px] h-fit w-full col-span-1 p-2 border-black rounded-md bg-white text-center"
          >
            <h1>
              <span
                class="font-medium text-sm uppercase text-gray-500 animate-pulse"
                >Loading...</span
              >
            </h1>
          </div>
        {:else if loading == "error"}
          <!-- Error state UI for each of the three columns -->
          <div
            class="flex flex-col border-[1px] h-fit w-full col-span-1 p-2 border-black rounded-md bg-white text-center"
          >
            <h1>
              <span class="font-medium text-sm uppercase text-gray-500"
                >Error occurred...</span
              >
            </h1>
          </div>
          <div
            class="flex flex-col border-[1px] h-fit w-full col-span-1 p-2 border-black rounded-md bg-white text-center"
          >
            <h1>
              <span class="font-medium text-sm uppercase text-gray-500"
                >Error occurred...</span
              >
            </h1>
          </div>
          <div
            class="flex flex-col border-[1px] h-fit w-full col-span-1 p-2 border-black rounded-md bg-white text-center"
          >
            <h1>
              <span class="font-medium text-sm uppercase text-gray-500"
                >Error occurred...</span
              >
            </h1>
          </div>
        {:else if !stripeAccountId && loading == "loaded"}
          <a href="/dashboard/account" class="w-full col-span-full">
            <div
              class="flex flex-col border-[1px] h-fit w-full col-span-1 p-2 border-black rounded-md bg-white text-center"
            >
              <h1>
                <span class="font-medium text-sm uppercase text-gray-500"
                  >Connect Account</span
                ><br />
                <span class="text-blue-500">Setup Payments</span>
              </h1>
            </div>
          </a>
        {:else if loading == "loaded"}
          <div
            class="flex flex-col border-[1px] h-fit w-full col-span-1 p-2 border-black rounded-md bg-white text-center"
          >
            <h1>
              <span class="font-medium text-sm uppercase text-gray-500"
                >Attendees</span
              ><br />
              <span class="text-blue-500"
                >{totalAttendees > 0 ? totalAttendees : "0"}</span
              >
            </h1>
          </div>
          <div
            class="flex flex-col border-[1px] h-fit w-full col-span-1 p-2 border-black rounded-md bg-white text-center"
          >
            <h1>
              <span class="font-medium text-sm uppercase text-gray-500"
                >Available</span
              ><br />
              <span class="text-green-500"
                >{stripeAccountBalanceAvailable > 0
                  ? "$" + stripeAccountBalanceAvailable.toFixed(2)
                  : "$0"}</span
              >
            </h1>
          </div>
          <div
            class="flex flex-col border-[1px] h-fit w-full col-span-1 p-2 border-black rounded-md bg-white text-center"
          >
            <h1>
              <span class="font-medium text-sm uppercase text-gray-500"
                >Pending</span
              ><br />
              <span class="text-yellow-500"
                >{stripeAccountBalancePending > 0
                  ? "$" + stripeAccountBalancePending.toFixed(2)
                  : "$0"}</span
              >
            </h1>
          </div>
        {/if}
      </div>

      <dialog
        id="HostParty"
        class="opacity-0 open:opacity-100 transition-all duration-500 md:max-w-[60vw] md:w-[60vw] h-fit max-h-[70vh] rounded-md drop-shadow-md"
      >
        <!-- <HostPartyInfo on:close={handleClose} /> -->
      </dialog>
    </div>

    {#if usersParties.length > 0 && loading == "loaded"}
      <h1 class="font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-4">
        Your Next Party
      </h1>
      <div class="flex flex-col gap-4">
        {#each upComingAndFutureParties as party}
          <PartyComponent {party} />
        {/each}
        <div
          class="w-full bg-white h-fit flex flex-row gap-3 rounded-md p-4 justify-between relative"
        >
          <a
            href="/dashboard/parties"
            class="text-black flex flex-row items-center justify-center gap-2 w-full h-full hover:text-mainRed"
          >
            <IconEye /> View All
          </a>
        </div>
      </div>
    {:else if loading == "loading"}
      <div
        class="bg-white w-full h-fit p-5 rounded-md flex flex-col items-start justify-start"
      >
        <h1 class="font-semibold text-lg">Loading...</h1>
      </div>
    {:else if loading == "error"}
      <div
        class="bg-white w-full h-fit p-5 rounded-md flex flex-col items-start justify-start"
      >
        <h1 class="font-semibold text-lg">Error occurred...</h1>
      </div>
    {:else}
      <div
        class="bg-white w-full h-fit p-5 rounded-md flex flex-col items-start justify-start"
      >
        <h1 class="font-semibold text-lg">Get Started</h1>
        <a href="/dashboard/parties" class="text-mainRed font-medium"
          >Host a Party</a
        >
      </div>
    {/if}
  </div>

  <div class="flex flex-col h-fit max-h-[86vh] overflow-scroll">
    <!-- This section also needs to account for loading and error states -->
  </div>
</section>
