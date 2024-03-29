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
  import { DateTime } from "luxon";
  import PartyComponent from "../../components/PartyComponent.svelte";
  import { IconEye } from "@tabler/icons-svelte";
  import axios from "axios";
  import { page } from "$app/stores";
  import { getIdToken } from "firebase/auth";

  let usersParties: any = [];
  let upComingAndFutureParties: any = [];
  let totalAttendees = 0;
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

  // Retrive balance of users account
  const retrieveConnectAccountBalance = async () => {
    if (!stripeAccountId) return;

    try {
      const response = await axios.get(
        `/api/retrieveConnectAccountBalance?id=${stripeAccountId}`,
        {
          headers: {
            Authorization: "Bearer " + (await getIdToken(auth?.currentUser!)),
          },
        }
      );

      stripeAccountBalanceAvailable = response.data.available[0].amount / 100;
      stripeAccountBalancePending = response.data.pending[0].amount / 100;
    } catch (err) {
      console.log(err);
      loading = "error";
    }
  };

  const getStripeAccountId = async () => {
    const hostStripe = await getDoc(doc(db, "stripe-accounts", $page.data.uid));
    if (hostStripe.exists()) {
      try {
        const checkStripeAccount = await axios.get(
          `/api/checkStripeAccount?id=${hostStripe.data().stripeAccountId}`,
          {
            headers: {
              Authorization: "Bearer " + (await getIdToken(auth?.currentUser!)),
            },
          }
        );
        if (
          checkStripeAccount.data.details_submitted &&
          checkStripeAccount.request.status === 200
        )
          stripeAccountId = checkStripeAccount.data.id;
      } catch (err) {
        console.log(err);
        loading = "error";
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
          },
          {
            headers: {
              Authorization: "Bearer " + (await getIdToken(auth?.currentUser!)),
            },
          }
        );

        if (accountTransactions.data.data.length > 0) {
          recentTransactions = accountTransactions.data.data;
          // console.log(recentTransactions);
        }
      }
    } catch (err) {
      console.log(err);
      loading = "error";
    }
  };

  // $: if (usersParties.length > 0) splitParties();

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
      splitParties();

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
  class="flex flex-col sm:flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-8 p-2 px-4 md:p-10 flex-1 w-full overflow-y-scroll"
>
  <div class="h-fit">
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
    <h1 class="text-2xl sm:text-3xl lg:text-4xl text-white font-bold mb-2">
      Recent Activity
    </h1>
    <div
      class="bg-white border-[2px] border-black rounded-md flex flex-col gap-2 flex-1 p-4 overflow-scroll h-fit"
    >
      {#if loading === "loading"}
        <div class="flex flex-col gap-2">
          <div
            class="flex flex-col sm:flex-row bg-gray-100 rounded-md border px-6 py-4 space-y-2 sm:space-y-0 sm:space-x-4 sm:items-baseline justify-between"
          >
            <div class="flex flex-col">
              <h1 class="text-lg font-semibold text-gray-800">Loading...</h1>
            </div>
          </div>
        </div>
      {:else if loading === "error"}
        <div class="flex flex-col gap-2">
          <div
            class="flex flex-col sm:flex-row bg-gray-100 rounded-md border px-6 py-4 space-y-2 sm:space-y-0 sm:space-x-4 sm:items-baseline justify-between"
          >
            <div class="flex flex-col">
              <h1 class="text-lg font-semibold text-gray-800">
                Could not load recent transactions...
              </h1>
            </div>
          </div>
        </div>
      {:else if recentTransactions.length > 0}
        {#each recentTransactions as transaction (transaction.id)}
          <div
            class="flex flex-col sm:flex-row bg-gray-100 rounded-md border px-6 py-4 space-y-2 sm:space-y-0 sm:space-x-4 sm:items-baseline justify-between"
          >
            <div class="flex flex-col">
              <h1 class="text-lg font-semibold text-gray-800">
                {transaction.amount > 0 ? "Ticket Purchase" : "Refund"}
              </h1>

              <p class="text-sm text-gray-500">
                {DateTime.fromSeconds(transaction.created).toLocaleString(
                  DateTime.DATETIME_MED
                )}
              </p>
            </div>
            <p class="text-green-600">
              ${(transaction.amount / 100).toFixed(2)}
            </p>
          </div>
        {/each}
      {:else}
        <div
          class="flex flex-col bg-gray-100 rounded-md border px-6 py-4 space-y-2 sm:space-y-0 sm:space-x-4 sm:items-baseline justify-between"
        >
          <div class="flex flex-col">
            <h1 class="text-base font-semibold text-gray-800">
              Recent activity will show up here
            </h1>
          </div>
        </div>
      {/if}
    </div>
  </div>
</section>
