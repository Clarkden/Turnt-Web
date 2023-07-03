<script lang="ts">
  import { db } from "../../../../../../lib/firebase";
  import {
    getDoc,
    doc,
    query,
    collection,
    where,
    getDocs,
  } from "firebase/firestore";
  // import { authStore, stripeStore } from "../../../../../../stores/authStore";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { DateTime } from "luxon";
  import axios from "axios";
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { IconX } from "@tabler/icons-svelte";
  import EditParty from "../../../../../../components/EditParty.svelte";

  let party: any = null;
  let partyId: any = $page.params.id;
  let revenue: number = 0;
  let guestList: any = null;
  let payments: any = null;
  let cancelPartyModal: boolean = false;
  let cancelInput: string = "";
  let error: string = "";
  let message: string = "";
  let individualTicketSales: Record<string | number, number> = {};
  let loading: boolean = true;
  let stripeAccountId: string = "";
  let editPartyModal: boolean = false;

  const getStripeAccountId = async () => {
    try {
      let stripeAccountId = await getDoc(
        doc(db, "stripe-accounts", $page.data.uid)
      );
      if (stripeAccountId.exists()) {
        stripeAccountId = stripeAccountId.data().stripeAccountId;
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function confirmCancellation() {
    if (!party) {
      return;
    }
    if (cancelInput.toUpperCase() === "CANCEL") {
      try {
        const partyCancelResponse = await axios.post("/api/refundParty", {
          partyId: party.id,
          stripeAeccountId: stripeAccountId,
          hostAccountId: party.hostAccountId,
        });

        cancelPartyModal = false;

        // if(JSON.ap(partyCancelResponse).message === "Party deleted successfully")
      } catch (error) {
        console.log(error);
      }
    } else {
      error = "Please type 'cancel' to confirm cancellation";

      setTimeout(() => {
        error = "";
      }, 4000);
    }
  }

  const getParty = async () => {
    try {
      const foundParty = await getDoc(doc(db, "parties", partyId));

      if (foundParty.exists()) {
        if ($page.data.uid !== foundParty.data().hostAccountId) {
          goto("/hub/dashboard/parties");
        }

        party = { id: foundParty.id, ...foundParty.data() };
      } else {
        goto("/hub/dashboard/parties");
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading = false;
    }
  };

  const viewGuestList = async () => {
    if (party.paidParty) return;

    // Query for the guestList document
    const guestListQuery = query(
      collection(db, "guest-lists"),
      where("partyId", "==", party.id)
    );
    const guestListSnapShot = await getDocs(guestListQuery);

    if (guestListSnapShot.empty) {
      console.error("No matching documents.");
      return;
    }

    // Take the first doc. We assume that there's only one matching document because the partyId is unique.
    const guestListDoc = guestListSnapShot.docs[0];

    // Get a reference to the 'guests' subcollection
    const guestsSubCollection = collection(guestListDoc.ref, "guests");

    // Fetch all documents in the 'guests' subcollection.
    const guestsSnapshot = await getDocs(guestsSubCollection);

    const guests = guestsSnapshot.docs.map((doc) => doc.data());

    return guests;
  };

  const calculateRevenue = async () => {
    try {
      const allPayments = await getDocs(
        query(
          collection(db, "payments"),
          where("metadata.partyId", "==", partyId)
        )
      );

      allPayments.forEach((payment) => {
        revenue += payment.data().amount / 100;

        if (individualTicketSales[payment.data().metadata.ticketId]) {
          individualTicketSales[payment.data().metadata.ticketId]++;
        } else {
          individualTicketSales[payment.data().metadata.ticketId] = 1;
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getPayments = async () => {
    try {
      const allPayments = await getDocs(
        query(
          collection(db, "payments"),
          where("metadata.partyId", "==", partyId)
        )
      );

      if (allPayments.empty) return;
      payments = allPayments.docs.map((doc) => doc.data());
    } catch (error) {
      console.log(error);
    }
  };

  const saveParty = async (party: any) => {
    
  }

  $: if (party) {
    if (party.hostAccountId !== $page.data.uid) {
      goto("/hub/dashboard/");
    }
  }

  onMount(() => {
    getParty();
    console.log("Got Party", party);
    getStripeAccountId();
    console.log("Got Stripe Account Id", stripeAccountId);
    calculateRevenue();
    console.log("Calculated Revenue", revenue);
    getPayments();
    console.log("Got Payments", payments);
  });
</script>

{#if editPartyModal}
  <div
    class="fixed inset-0 z-50 overflow-auto bg-black/50 flex items-center justify-center md:p-none"
    in:fly
    out:fly
  >
    <div
      class="h-[80vh] max-h-[80vh] w-[95vw] md:w-[90vw] m-auto bg-white rounded-md shadow-lg z-50 overflow-scroll"
    >
      <div class="p-5 h-full">
        <EditParty
          {party}
          on:cancel={() => (editPartyModal = false)}
          on:save={(e) => {
            saveParty(e.detail);
          }}
        />
      </div>
    </div>
  </div>
{/if}
<div
  class="
  p-4 md:p-10
"
>
  {#if cancelPartyModal && $page.data.uid === party.hostAccountId}
    <div
      class="fixed inset-0 z-50 overflow-auto bg-black/50 flex items-center justify-center p-3 md:p-none"
    >
      <div
        class="min-h-[200px] w-full max-w-md m-auto bg-white rounded-md shadow-lg z-50 overflow-hidden"
      >
        <div class="py-4 text-left px-6">
          <!-- Top most div for modal header -->
          <div class="flex justify-between items-center pb-3">
            <p class="text-2xl font-bold">Confirmation</p>
            <div
              class="cursor-pointer z-50"
              on:mouseup={() => (cancelPartyModal = false)}
            >
              <svg
                class="fill-current text-black"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path
                  d="M11.6 9l5.5-5.5-1.6-1.6-5.5 5.5-5.5-5.5-1.6 1.6 5.5 5.5-5.5 5.5 1.6 1.6 5.5-5.5 5.5 5.5 1.6-1.6-5.5-5.5z"
                />
              </svg>
            </div>
          </div>
          <p>
            All ticket holders will be refunded. To confirm the cancellation,
            please type "CANCEL".
          </p>
          <input
            class="w-full py-2 px-3 my-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border border-gray-200 rounded-md"
            id="cancelInput"
            type="text"
            placeholder="CANCEL"
            bind:value={cancelInput}
          />
          <!-- Buttons -->
          <div class="flex justify-end pt-2">
            <button
              class="px-4 bg-transparent p-3 rounded-lg text-mainRed hover:bg-gray-100 hover:text-mainRed mr-2"
              on:click={() => (cancelPartyModal = false)}>Close</button
            >
            <button
              class="px-4 bg-mainRed p-3 rounded-lg text-white hover:bg-red-600"
              on:click={confirmCancellation}>Confirm</button
            >
          </div>
        </div>
      </div>
    </div>
  {/if}

  {#if error}
    <div
      class="fixed bottom-0 w-full px-4 py-6 md:w-auto md:px-6 md:rounded md:shadow-lg md:bottom-3 md:right-3 bg-white z-50"
    >
      <div class="flex items-center space-x-3">
        <div class="text-mainRed">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div class="flex-1 text-mainRed">
          <p class="font-semibold">{error}</p>
        </div>

        <button
          class="text-gray-400 hover:text-gray-600 transition"
          on:click={() => {
            message = "";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  {/if}

  <div class="flex flex-row items-center gap-2 mb-4">
    <button
      class="flex flex-row items-center gap-2 text-white hover:text-gray-300 transition"
      on:click={() => goto("/hub/dashboard/parties")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 17l-5-5m0 0l5-5m-5 5h12"
        />
      </svg>
      <span>Back</span>
    </button>
  </div>

  {#if party}
    <section
      class="flex flex-col sm:flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-8 h-fit overflow-scroll"
    >
      <div class="flex flex-col gap-4">
        <h1 class="text-white text-2xl font-extrabold">Manage Party</h1>

        <div class="flex flex-row gap-2">
          <div
            class="flex flex-col border-[1px] h-fit col-span-1 p-2 px-4 border-black rounded-md bg-white text-center w-full"
          >
            <h1>
              <span class="font-medium text-sm uppercase text-gray-500"
                >Attendees</span
              ><br />
              <span class="text-blue-500">{party.attendies}</span>
            </h1>
          </div>
          <div
            class="flex flex-col border-[1px] h-fit col-span-1 p-2 px-4 border-black rounded-md bg-white text-center w-full"
          >
            <h1>
              <span class="font-medium text-sm uppercase text-gray-500"
                >Revenue</span
              ><br />
              <span class="text-green-500">${revenue.toFixed(2)}</span>
            </h1>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2">
          {#if DateTime.fromISO(party.date).set( { hour: DateTime.fromFormat(party.endTime, "h:mm a").hour, minute: DateTime.fromFormat(party.endTime, "h:mm a").minute } ) > DateTime.now()}
            <button
              on:click={() => {
                cancelPartyModal = true;
              }}
              class="bg-red-500 rounded h-[50px] text-white"
            >
              Cancel Party
            </button>
            <button
              on:click={() => {
                editPartyModal = true;
              }}
              class="bg-yellow-500 rounded h-[50px] text-white"
            >
              Edit Party
            </button>
            <button
              on:click={() => {
                // cancelPartyModal = true;
              }}
              class="bg-green-500 rounded h-[50px] text-white"
            >
              Share Party
            </button>
          {/if}
        </div>
      </div>
      <div>
        <h1 class="text-white text-2xl font-extrabold mb-4">Ticket Sales</h1>
        <div class="flex flex-col gap-2">
          {#if party.tickets}
            <div class="flex flex-row gap-2">
              {#each JSON.parse(party.tickets) as ticket (ticket.id)}
                <div
                  class="flex flex-col border-[1px] h-fit col-span-1 p-2 px-4 border-black rounded-md bg-white text-center w-full"
                >
                  <h1>
                    <span class="font-medium text-sm uppercase text-gray-500"
                      >{ticket.name}</span
                    ><br />
                    Sales:
                    <span class="text-blue-500"
                      >{individualTicketSales[ticket.id] || 0}</span
                    >
                  </h1>
                </div>
              {/each}
            </div>
          {:else}
            <div
              class="flex flex-col border-[1px] h-fit col-span-1 p-2 px-4 border-black rounded-md bg-white text-center w-full"
            >
              <h1>
                <span class="font-medium text-sm uppercase text-gray-500"
                  >Ticket Sales will show up here</span
                ><br />
              </h1>
            </div>
          {/if}
          <h1 class="text-white text-2xl font-extrabold my-4">Activity</h1>
          {#if payments}
            {#each payments as payment}
              <div
                class="flex flex-col border-[1px] h-fit col-span-1 p-2 px-4 border-black rounded-md bg-white text-center w-full max-h-screen overflow-scroll"
              >
                <p class="text-green-500">
                  ${(payment.amount / 100).toFixed(2)}
                </p>
                <p class="text-sm text-gray-500">
                  {DateTime.fromSeconds(payment.created).toLocaleString(
                    DateTime.DATETIME_MED
                  )}
                </p>
              </div>
            {/each}
          {:else}
            <div
              class="flex flex-col border-[1px] h-fit col-span-1 p-2 px-4 border-black rounded-md bg-white text-center w-full"
            >
              <h1>
                <span class="font-medium text-sm uppercase text-gray-500"
                  >Ticket Sales will show up here</span
                ><br />
              </h1>
            </div>
            <!-- {JSON.stringify(payments)} -->
          {/if}
        </div>
      </div>
      <!-- <div class="flex flex-row gap-4 mt-2">
      {#if party.paidParty === false}
        <button
          class="
      bg-white px-4 py-2 rounded
      "
        >
          View Guestlist
        </button>
      {/if}
      <button
        class="
    bg-white px-4 py-2 rounded
    "
      >
        Share Party
      </button>
      <button
        class="
    bg-white px-4 py-2 rounded
    "
      >
        Cancel Party
      </button>
    </div>

    {JSON.stringify(party)} -->
    </section>
  {/if}
</div>
