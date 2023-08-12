<script lang="ts">
  import { onMount } from "svelte";
  import {
    getDocs,
    collection,
    query,
    where,
    deleteDoc,
    doc,
  } from "firebase/firestore";
  import { db } from "$lib/firebase";
  import { DateTime } from "luxon";
  import { goto } from "$app/navigation";
  import { fade, fly, crossfade } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { IconArrowLeft } from "@tabler/icons-svelte";

  let parties: any = [];
  let viewIndividual: any;

  const getParties = async () => {
    const q = query(collection(db, "parties"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      parties = [...parties, { ...doc.data(), id: doc.id }];
    });
  };

  const deleteParty = async (id: string) => {
    await deleteDoc(doc(db, "parties", id));
    parties = parties.filter((party: any) => party.id !== id);
    viewIndividual = null;
  };

  onMount(() => {
    getParties();
  });
</script>

<div class="overflow-x-auto">
  <div class="w-full">
    <div class="bg-white shadow-md rounded my-6 overflow-scroll">
      {#if viewIndividual}
        <div
          class="transition-div p-6 w-full"
          in:fly={{ y: 100, duration: 500, easing: quintOut }}
        >
          <button
            class="mb-4 text-right"
            on:click={() => (viewIndividual = null)}
          >
            <IconArrowLeft class="inline-block mr-2" />
            Go Back
          </button>
          <div class="flex flex-row gap-1 items-center mb-4">
            <h2 class="text-2xl font-bold">{viewIndividual.name}</h2>
            <a
              href={`/${viewIndividual.id}`}
              class="bg-white p-2 rounded-md hover:bg-gray-200">View Party</a
            >
          </div>
          <p class="mb-2">
            <strong>Date: </strong>{DateTime.fromISO(
              viewIndividual.date
            ).toLocaleString()}
          </p>
          <p class="mb-2">
            <strong>Attendees: </strong>{viewIndividual.attendees
              ? viewIndividual.attendees
              : 0}
          </p>
          <p>
            <strong>External: </strong>{viewIndividual.externalEvent
              ? "Yes"
              : "No"}
          </p>
          <div class="flex flex-row gap-1 mt-4">
            <button
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              on:click={() => deleteParty(viewIndividual.id)}
            >
              Delete Party
            </button>
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              on:click={() => goto(`/${viewIndividual.id}/edit`)}
            >
              Edit Party
            </button>
          </div>
        </div>
      {:else}
        <div
          class="transition-div"
          in:fly={{ y: 100, duration: 500, easing: quintOut }}
        >
          <table class="min-w-max w-full table-auto">
            <thead>
              <tr
                class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal"
              >
                <th class="py-3 px-6 text-left">Name</th>
                <th class="py-3 px-6 text-left">Date</th>
                <th class="py-3 px-6 text-center">Attendies</th>
                <th class="py-3 px-6 text-center">External</th>
                <th class="py-3 px-6 text-center" />
              </tr>
            </thead>
            <tbody class="text-gray-600 text-sm font-light">
              {#each parties as party (party.id)}
                <tr
                  class="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                  on:click={() => (viewIndividual = party)}
                >
                  <td class="py-3 px-6 text-left">{party.name}</td>
                  <td class="py-3 px-6 text-left"
                    >{DateTime.fromISO(party.date).toLocaleString()}</td
                  >
                  <td class="py-3 px-6 text-center"
                    >{party.attendees ? party.attendees : 0}</td
                  >
                  <td class="py-3 px-6 text-center"
                    >{party.externalEvent ? party.externalEvent : false}</td
                  >
                  <td class="py-3 px-6 text-center" />
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  </div>
</div>
