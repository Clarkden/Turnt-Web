<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import AdminMultiForm from "../../../components/AdminMultiForm.svelte";
  import AdminPartyView from "../../../components/AdminPartyView.svelte";
  import axios from "axios";
  import { addDoc, collection } from "firebase/firestore";
  import { db } from "$lib/firebase";
  import type { Party } from "$lib/types";
  import { DateTime } from "luxon";

  let creatingExternalParty: boolean = false;
  let partiesToImport: any[] = [];

  const getPoshParties = async () => {
    try {
      const res = await axios.get("/api/importPosh")
      console.log(res)
      partiesToImport = res.data;
      // console.log(partiesToImport);
    } catch (err) {
      console.log(err);
    }
    
  };

  const importPoshParty = async (party: any) => {
    const newParty: Party = {
      name: party.event.name,
      date: DateTime.fromISO(party.event.start).toFormat("yyyy-MM-dd"),
      startTime: DateTime.fromISO(party.event.startUtc, {
        zone: party.event.timezone,
      }).toFormat("h:mm a"),
      endTime: "02:00 AM",
      location: party.event.venue.address,
      description: party.event.description,
      hostName: party.group.name || "Posh Parties",
      flyerPath: party.event.flyer,
      // location: party.event.location,
      createdAt: new Date().toString(),
      externalEvent: true,
      externalEventLink: "https://posh.vip/e/"+party.event.url,
      paidParty: false,
    };

    try {
      const docRef = await addDoc(collection(db, "parties"), newParty);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
</script>

{#if creatingExternalParty}
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
        <AdminMultiForm
          on:cancel={() => (creatingExternalParty = false)}
          on:completion={() => {
            creatingExternalParty = false;
          }}
        />
      </div>
    </div>
  </div>
{/if}

{#if partiesToImport.length > 0}
  <div
    class="absolute w-full h-full bg-black/50 flex flex-col items-center justify-center z-50"
    transition:fade={{ duration: 500 }}
  >
    <div
      class="h-full w-full md:h-[90vh] md:w-[60vw] bg-mainRed md:rounded-md overflow-scroll pb-10"
      in:fly={{ x: 500, duration: 500 }}
      out:fly={{ x: 500, duration: 1000 }}
    >
      <div class="flex flex-col w-full h-full p-5 gap-3">
        <div class="flex flex-row justify-between">
          <h1 class="text-2xl font-bold text-white">Import Parties</h1>
          <button
            on:click={() => (partiesToImport = [])}
            class="bg-white hover:bg-gray-200 rounded px-4 py-2"
          >
            Cancel
          </button>
        </div>
        <div class="flex flex-col gap-2">
          {#each partiesToImport as party}
            <div
              class="flex flex-row justify-start items-center border border-black rounded-md p-3 gap-4"
            >
              <div class="min-w-[150px] max-w-[150px] h-[150px]">
                <img
                  src={party.event.flyer}
                  alt=""
                  class="w-full h-full object-cover rounded-md"
                />
              </div>
              <div class="flex flex-col text-white">
                <h1 class="text-xl font-bold">{party.event.name}</h1>
                <h1 class="text-sm text-gray-100">{party.event.description}</h1>
              </div>
              <button
                class="bg-white hover:bg-gray-200 rounded px-4 py-2 w-fit h-fit"
                on:click={() => importPoshParty(party)}
              >
                Import
              </button>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}

<section class="p-2 px-4 md:p-10 relative h-[100vh] w-full">
  <div class="flex flex-row gap-2">
    <button
      on:click={() => (creatingExternalParty = !creatingExternalParty)}
      class="bg-white hover:bg-gray-200 rounded px-4 py-2"
      >Create External Party</button
    >
    <button
      on:click={getPoshParties}
      class="bg-white hover:bg-gray-200 rounded px-4 py-2"
    >
      Import from Posh
    </button>
    <button class="bg-white hover:bg-gray-200 rounded px-4 py-2"
      >Refund Party</button
    >
  </div>
  <AdminPartyView />
</section>
