<script lang="ts">
  // import { authStore } from "../../stores/authStore";
  import { db } from "../../lib/firebase";
  import { getDocs, collection, query, where } from "firebase/firestore";
  import { onMount } from "svelte";
  import { DateTime } from "luxon";
  import Particles from "svelte-particles";
  import { loadFull } from "tsparticles";
  import FireWorks from "../../assets/particles/particles.json";

  let onParticlesLoaded = (event: any) => {
    const particlesContainer = event.detail.particles;
  };

  let particlesInit = async (engine: any) => {
    await loadFull(engine);
  };

  let thisMonthsParties: any = [];
  let thisWeeksParties: any = [];
  let todaysParties: any = [];
  let nearbyParties: any = [];
  let findNearbyParties: boolean = false;
  let selectedView: string = "thisMonth";
  let userLocation: string = "";
  let loadingLocationError: string = "";
  let nearbyDistance: number = 0;

  let loading: "loading" | "loaded" | "error" = "loading";
  // let loadingLocation: "loading" | "loaded" | "error" = "loading";

  let parties: any = [];

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

    loading = "loaded";

    if (parties.length < 1) {
      return;
    }

    thisMonthsParties = parties;
  };

  $: if (thisMonthsParties.length > 0) {
    let todays: any = [];
    let thisWeeks: any = [];

    // thisMonthsParties = thisMonthsParties.filter((party: any) => {
    //   let partyDate = DateTime.fromISO(party.date);
    //   let partyEndTime = DateTime.fromFormat(party.endTime, "h:mm a");

    //   // combine the date and the time to get the exact end time
    //   let partyEnd = DateTime.fromObject({
    //     year: partyDate.year,
    //     month: partyDate.month,
    //     day: partyDate.day,
    //     hour: partyEndTime.hour,
    //     minute: partyEndTime.minute,
    //   });

    //   let now = DateTime.local();

    //   // Exclude parties that have already ended
    //   return partyEnd > now;
    // });

    thisMonthsParties.forEach((party: any) => {
      let partyDate = DateTime.fromISO(party.date);
      let now = DateTime.local();

      if (partyDate.startOf("day") <= now.startOf("day")) {
        todays = [...todays, party];
      }
      if (
        partyDate.startOf("day") >= now.startOf("day") &&
        partyDate.startOf("day") < now.plus({ weeks: 1 }).startOf("day")
      ) {
        thisWeeks = [...thisWeeks, party];
      }
    });

    todaysParties = todays;
    thisWeeksParties = thisWeeks;
  }

  function calculateDistance(coord1: string, coord2: string) {
    const R = 6371; // Radius of the Earth in kilometers

    const [lat1, lon1] = coord1.slice(1, -1).split(", ").map(Number);
    const [lat2, lon2] = coord2.slice(1, -1).split(", ").map(Number);

    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const lat1Rad = degreesToRadians(lat1);
    const lat2Rad = degreesToRadians(lat2);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) *
        Math.sin(dLon / 2) *
        Math.cos(lat1Rad) *
        Math.cos(lat2Rad);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  function degreesToRadians(degrees: any) {
    return degrees * (Math.PI / 180);
  }

  const getNearbyParties = async () => {
    nearbyParties = [];
    // console.log("getting nearby parties", userLocation, nearbyParties);

    if (selectedView === "thisMonth") {
      await thisMonthsParties.forEach((party: any) => {
        let distance = calculateDistance(userLocation, party.latAndLong);
        // console.log(party.name, distance);

        if (distance < nearbyDistance) {
          nearbyParties = [...nearbyParties, party];
        }
      });
    } else if (selectedView === "thisWeek") {
      await thisWeeksParties.forEach((party: any) => {
        let distance = calculateDistance(userLocation, party.latAndLong);
        // console.log(party.name, distance);

        if (distance < nearbyDistance) {
          nearbyParties = [...nearbyParties, party];
        }
      });
    } else if (selectedView === "today") {
      await todaysParties.forEach((party: any) => {
        let distance = calculateDistance(userLocation, party.latAndLong);
        // console.log(party.name, distance);

        if (distance < nearbyDistance) {
          nearbyParties = [...nearbyParties, party];
        }
      });
    }
    // console.log("nearby parties", nearbyParties);
  };

  $: if (findNearbyParties && userLocation !== "") {
    getNearbyParties();
    parties = nearbyParties;
  }

  $: if (selectedView && findNearbyParties && userLocation !== "") {
    getNearbyParties();
    parties = nearbyParties;
  }

  $: if (nearbyDistance) {
    getNearbyParties();
    parties = nearbyParties;
  }

  $: if (selectedView && !findNearbyParties) {
    parties =
      selectedView === "thisMonth"
        ? thisMonthsParties
        : selectedView === "thisWeek"
        ? thisWeeksParties
        : selectedView === "nearby"
        ? nearbyParties
        : todaysParties;
  }

  onMount(() => {
    getThisMonthsParties();
  });
</script>

<div class="flex flex-col w-full h-full min-h-screen bg-gradient-to-b from-mainRed to-purple-400 backdrop-blur-2xl">
<Particles
  id="tsparticles"
  options={FireWorks}
  on:particlesLoaded={onParticlesLoaded}
  {particlesInit}
  class="absolute z-0"
/>
<div
  class="flex flex-row gap-2 sm:gap-4 p-4 w-full justify-start md:w-[80%] md:mx-auto mt-5 md:mt-10 z-50 "
>
  <div class="flex flex-row gap-4 z-20">
    <div
      class="flex flex-row gap-1 items-center rounded px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white group"
    >
      <p class="m-0">When:</p>
      <select
        bind:value={selectedView}
        class="border-none cursor-pointer outline-none bg-neutral-900 group-hover:bg-neutral-800 text-white"
      >
        <option value="thisMonth">This Month</option>
        <option value="thisWeek">This Week</option>
        <option value="today">Today</option>
        <!-- <option value="nearby">Nearby</option> -->
      </select>
    </div>
  </div>
  <div class="flex flex-row gap-4 z-20">
    <select
      bind:value={nearbyDistance}
      on:change={() => {
        if (nearbyDistance === 0) {
          findNearbyParties = false;
          return;
        }
        findNearbyParties = true;
        if (userLocation !== "") {
          getNearbyParties();
        } else {
          loadingLocation = "loading";
          navigator.geolocation.getCurrentPosition(
            (position) => {
              userLocation = `(${position.coords.latitude}, ${position.coords.longitude})`;
              loadingLocation = "loaded";
            },
            (error) => {
              loadingLocation = "error";
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  loadingLocationError =
                    "User denied the request for Geolocation.";
                  break;
                case error.POSITION_UNAVAILABLE:
                  loadingLocationError = "Location information is unavailable.";
                  break;
                case error.TIMEOUT:
                  loadingLocationError =
                    "The request to get user location timed out.";
                  break;
                default:
                  loadingLocationError = "An unknown error occurred.";
                  break;
              }
              findNearbyParties = false;
            },
            {
              timeout: 5000,
              maximumAge: 1000000,
            }
          );
        }
      }}
      class="px-4 py-2 text-white rounded cursor-pointer outline-none bg-neutral-900 hover:bg-neutral-800"
    >
      <option value={0} selected>Anywhere</option>
      <option value={5}>5 miles</option>
      <option value={10}>10 miles</option>
      <option value={20}>20 miles</option>
      <option value={50}>50 miles</option>
      <option value={100}>100 miles</option>
    </select>
  </div>
</div>

{#if loading === "loaded"}
  {#if parties.length > 0}
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-x-10 md:gap-y-6 p-4 md:w-[80%] md:mx-auto z-50"
    >
      {#each parties as party (party.id)}
        <a
          href={`/${party.id}`}
          class="rounded overflow-hidden drop-shadow-xl bg-neutral-900 flex flex-col justify-between relative h-[500px] group"
        >
          <img
            class="w-full h-full object-cover absolute z-20"
            src={party.flyerPath}
            alt="Party flyer"
          />
          <div
            class=" h-full absolute w-full flex flex-col justify-end bg-gradient-to-b from-transparent to-neutral-900 group-hover:bg-gradient-to-b group-hover:from-transparent group-hover:to-mainRed text-white transition-color duration-500 ease-in-out z-40"
          >
            <div class="px-6 py-4">
              <div class="flex flex-row justify-between items-center">
                <div class="font-bold text-xl mb-2">{party.name}</div>
              </div>
              <!-- <p
                class="text-gray-300 text-base overflow-ellipsis overflow-hidden mt-3"
              >
                {party.description}
              </p> -->
            </div>
            <div class="px-6 pt-4 pb-2">
              <span
                class="inline-block bg-gray-50 rounded-md px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                {#if DateTime.fromISO(party.date).hasSame(DateTime.local(), "day")}
                  Today
                {:else if DateTime.local()
                  .plus({ days: 1 })
                  .hasSame(DateTime.fromISO(party.date), "day")}
                  Tomorrow
                {:else}
                  {DateTime.fromISO(party.date).toLocaleString(
                    DateTime.DATE_FULL
                  )}
                {/if}</span
              >
              <span
                class="inline-block bg-gray-50 rounded-md px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >{party.startTime} - {party.endTime}</span
              >
              {#if party.ageLimit > 0}
                <span
                  class="inline-block bg-gray-50 rounded-md px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                  >{party.ageLimit}+</span
                >
              {/if}
              {#if party.externalEvent}
                <span
                  class="inline-block bg-gray-50 rounded-md px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                  >Not hosted on turnt</span
                >
              {/if}
            </div>
          </div>
        </a>
      {/each}
    </div>
  {:else}
    <div
      class="flex flex-col items-center justify-center h-[100vh] text-white z-50"
    >
      <div class="text-2xl font-bold">No parties found</div>
      <div class="text-xl">Try a different option</div>
    </div>
  {/if}
{:else if loading === "loading"}
  <div
    class="flex flex-col items-center justify-center h-[100vh] text-white z-50"
  >
    <div class="text-2xl font-bold">Loading...</div>
  </div>
{:else if loading === "error"}
  <div
    class="flex flex-col items-center justify-center h-[100vh] text-white z-50"
  >
    <div class="text-2xl font-bold">Error</div>
    <div class="text-xl">There was an error fetching parties</div>
  </div>
{/if}
</div>