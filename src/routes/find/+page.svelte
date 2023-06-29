<script lang="ts">
  import { authStore } from "../../stores/authStore";
  import { db } from "../../lib/firebase";
  import { getDocs, collection, query, where } from "firebase/firestore";
  import { onMount } from "svelte";
  import { DateTime } from "luxon";

  let thisMonthsParties: any = [];
  let thisWeeksParties: any = [];
  let todaysParties: any = [];
  let selectedRange: string = "thisMonth";

  $: parties =
    selectedRange === "thisMonth"
      ? thisMonthsParties
      : selectedRange === "thisWeek"
      ? thisWeeksParties
      : todaysParties;

  const getThisMonthsParties = async () => {
    let now = DateTime.local();
    let currentDate = now.toISODate();
    let oneMonthFromNow = now.plus({ months: 1 }).toISODate();

    // Create a query that retrieves upcoming parties within a month
    const partiesQuery = query(
      collection(db, "parties"),
      where("date", ">=", currentDate),
      where("date", "<=", oneMonthFromNow)
    );

    // Fetch the parties and convert them to an array of objects
    const partiesSnapshot = await getDocs(partiesQuery);
    const parties = partiesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    thisMonthsParties = parties;
  };

  $: if (thisMonthsParties.length > 0) {
    thisMonthsParties.forEach((party: any) => {
      let partyDate = DateTime.fromISO(party.date);
      let now = DateTime.local();
      if (partyDate.startOf("day") < now.startOf("day")) {
        todaysParties.push(party);
      } else if (
        partyDate.startOf("day") > now.startOf("day") &&
        partyDate.startOf("day") < now.plus({ weeks: 1 }).startOf("day")
      ) {
        thisWeeksParties.push(party);
      }
    });
  }

  onMount(() => {
    getThisMonthsParties();
  });
</script>

<!-- <div class="flex flex-row items-center justify-around">
  <button
    class="text-mainRed font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:text-red-600 border border-mainRed"
    on:click={() => (selectedRange = "thisMonth")}
  >
    This Month
  </button>
  <button
    class="text-mainRed font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:text-red-600 border border-mainRed"
    on:click={() => (selectedRange = "thisWeek")}
  >
    This Week
  </button>
  <button
    class="text-mainRed font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:text-red-600 border border-mainRed"
    on:click={() => (selectedRange = "today")}
  >
    Today
  </button>
</div> -->

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
  {#each parties as party (party.id)}
    <div class="rounded overflow-hidden shadow-lg m-2 bg-white">
      <img
        class="w-full h-64 object-cover"
        src={party.flyerPath}
        alt="Party flyer"
      />
      <div class="px-6 py-4">
        <div class="flex flex-row justify-between items-center">
          <div class="font-bold text-xl mb-2">{party.name}</div>
          <a
            href="/{party.id}"
            class="inline-block bg-mainRed hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 ease-in-out"
          >
            View
          </a>
        </div>
        <p
          class="text-gray-700 text-base overflow-ellipsis overflow-hidden mt-3"
        >
          {party.description}
        </p>
      </div>
      <div class="px-6 pt-4 pb-2">
        <span
          class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          >Date: {party.date}</span
        >
        <span
          class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          >Start Time: {party.startTime}</span
        >
        <span
          class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          >End Time: {party.endTime}</span
        >
        {#if party.ageLimit > 0}
          <span
            class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            >Age Limit: {party.ageLimit}+</span
          >
        {/if}
      </div>
    </div>
  {/each}
</div>
