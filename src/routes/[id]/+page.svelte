<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { db, auth } from "../../lib/firebase";
  import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    onSnapshot,
    query,
    updateDoc,
    where,
  } from "firebase/firestore";
  import { DateTime } from "luxon";
  import {
    IconClock,
    IconCalendar,
    IconFileFilled,
    IconX,
    IconLocation,
    IconUser,
  } from "@tabler/icons-svelte";
  // import { authStore } from "../../stores/authStore";
  import axios from "axios";
  import { goto } from "$app/navigation";
  import { fly } from "svelte/transition";
  import { writable, derived, get } from "svelte/store";
  import { clickOutside } from "$lib/clickOutSide";
  import OgImage2 from "../../assets/images/OgImage2.png";
  import Particles from "svelte-particles";
  import { loadFull } from "tsparticles";
  import FireWorks from "../../assets/particles/particles.json";
  import Footer from "../../components/Footer.svelte";

  let onParticlesLoaded = (event: any) => {
    const particlesContainer = event.detail.particles;
  };

  let particlesInit = async (engine: any) => {
    await loadFull(engine);
  };

  // The current date/time as a store
  const now = writable(DateTime.now());

  // Update the current date/time every second
  setInterval(() => {
    now.set(DateTime.now());
  }, 1000);

  let party: any = {};
  // let stripeAccountId: string = "";
  let phonenumberModal: boolean = false;
  let phoneNumber: string = "";
  let selectedTicket: any = null;
  let message: string = "";
  let validPhoneNumber: boolean = false;
  let countryCode: string = "+1";

  let name: string = "";
  let instagram: string = "";
  let guestListPhone: string = "";

  const getHostStripeAccountId = async () => {
    const hostStripe = await getDoc(
      doc(db, "stripe-accounts", party.hostAccountId)
    );
    if (hostStripe.exists()) {
      return hostStripe.data().stripeAccountId;
    } else return null;
  };

  onMount(() => {
    const unsubscribe = onSnapshot(
      doc(db, "parties", $page.params.id),
      (doc) => {
        if (!doc.exists()) goto("/find");

        party = { id: doc.id, ...doc.data() };
      }
    );

    // getHostStripeAccountId();
  });

  $: if (
    phoneNumber &&
    phoneNumber.match(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    )
  ) {
    validPhoneNumber = true;
  } else {
    validPhoneNumber = false;
  }

  $: if (party.description) {
    let description = party.description;
    description = description.replace(/\n/g, "<br />");
    party.description = description;
  }

  const addToGuestList = async () => {
    if (!name || !instagram || !guestListPhone) {
      message = "Please fill out all fields.";
      return;
    }

    try {
      // Assuming there's a 'guest-list' collection in your firestore.
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

      // Check if there are already documents in the 'guests' subcollection.
      const snapshot = await getDocs(guestsSubCollection);

      if (snapshot.empty) {
        // The 'guests' subcollection does not have any documents, but Firestore will automatically create the subcollection when you add a document to it.
        console.log(
          "The 'guests' subcollection does not exist, it will be created."
        );
      }

      // Add the new guest to the 'guests' subcollection.
      await addDoc(guestsSubCollection, {
        name,
        instagram,
        phone: guestListPhone,
        partyId: party.id,
      });

      const addPartyAttendee = await updateDoc(doc(db, "parties", party.id), {
        attendees: increment(1),
      });

      const updateHostAttendiesCount = await query(
        collection(db, "hosts"),
        where("parties", "array-contains", party.id)
      );

      const querySnapshot = await getDocs(updateHostAttendiesCount);
      querySnapshot.forEach(async (document) => {
        const hostDoc = doc(db, "hosts", document.id);
        await updateDoc(hostDoc, { attendees: increment(1) });
      });

      // Clear the input fields after successful addition.
      name = "";
      instagram = "";
      guestListPhone = "";

      message = "You have been added to the guest list.";
    } catch (error) {
      message = "Failed to add to the guest list.";
      console.error("Error adding to guest list: ", error);
    }
  };

  const purchaseTicket = async () => {
    if (!phoneNumber) return;

    try {
      let checkoutSession = await axios.post("/api/createCheckoutSession", {
        party,
        ticket: selectedTicket,
        stripeAccountId: await getHostStripeAccountId(),
        purchaserPhoneNumber: countryCode + phoneNumber,
      });
      goto(checkoutSession.data.url);
    } catch (error) {
      console.log(error);
    }
  };

  const isTicketSaleWindowOpen = (ticket: any) => {
    if (ticket.saleStartDate && ticket.saleEndDate) {
      const saleStartDate = DateTime.fromISO(ticket.saleStartDate).set({
        hour: DateTime.fromFormat(ticket.saleStartTime, "h:mm a").hour,
        minute: DateTime.fromFormat(ticket.saleStartTime, "h:mm a").minute,
      });
      const saleEndDate = DateTime.fromISO(ticket.saleEndDate).set({
        hour: DateTime.fromFormat(ticket.saleEndTime, "h:mm a").hour,
        minute: DateTime.fromFormat(ticket.saleEndTime, "h:mm a").minute,
      });

      const now = DateTime.now();

      if (now > saleStartDate && now < saleEndDate) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  const isTicketSaleWindowOver = (ticket: any) => {
    if (ticket.saleEndDate) {
      const saleEndDate = DateTime.fromISO(ticket.saleEndDate);
      const now = DateTime.now();

      if (now > saleEndDate) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  function formatPrice(price: any) {
    return parseFloat(price).toFixed(2);
  }

  $: if ($page.url.searchParams.get("status")) {
    if ($page.url.searchParams.get("status") === "success") {
      message = "Your ticket has been purchased successfully!";
    } else if ($page.url.searchParams.get("status") === "canceled") {
      message = "Your ticket purchase has been canceled.";
    }
  }
</script>

<!-- <Particles
  id="tsparticles"
  options={FireWorks}
  on:particlesLoaded={onParticlesLoaded}
  {particlesInit}
  class="absolute z-0"
/> -->

{#if message}
  <div
    class="fixed bottom-0 w-full px-4 py-6 md:w-auto md:px-6 md:rounded md:shadow-lg md:bottom-3 md:right-3 bg-white"
  >
    <div class="flex items-center space-x-3">
      {#if message === "Your ticket has been purchased successfully!"}
        <div class="text-green-600">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div class="flex-1 text-green-600">
          <p class="font-semibold">{message}</p>
        </div>
      {:else if message === "Your ticket purchase has been canceled."}
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
          <p class="font-semibold">{message}</p>
        </div>
      {:else}
        <div class="text-green-600">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div class="flex-1 text-green-600">
          <p class="font-semibold">{message}</p>
        </div>
      {/if}
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

{#if phonenumberModal}
  <div
    class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center p-2 z-10"
  >
    <div class="w-full md:w-[500px] bg-white rounded-md p-5">
      <IconX
        on:click={() => {
          phonenumberModal = false;
          selectedTicket = null;
        }}
        class="w-6 h-6 absolute top-2 right-2 text-white"
      />
      <div
        class="flex flex-col gap-2"
        use:clickOutside
        on:click_outside={() => (phonenumberModal = false)}
      >
        <div>
          <h1 class="text-2xl font-bold">Enter your phone number</h1>
          <p class="text-gray-500">Phone number to receive your ticket</p>
        </div>
        <div class="flex gap-2">
          <select
            bind:value={countryCode}
            class="w-1/4 border-[1px] rounded-md p-2"
          >
            <!-- List of country codes. Could be dynamically populated -->
            <option value="+1">US (+1)</option>
            <!-- <option value="+44">UK (+44)</option> -->
            <!-- Add other countries here -->
          </select>
          <input
            type="text"
            class="w-3/4 border-[1px] rounded-md p-2"
            placeholder="Phone Number"
            bind:value={phoneNumber}
          />
        </div>
        {#if !validPhoneNumber}
          <button
            class="w-full bg-primary-600 rounded-md p-2 bg-mainRed/25 border border-mainRed text-black"
            disabled
            on:click={() => {
              purchaseTicket();
            }}
          >
            Submit
          </button>
        {:else}
          <button
            class="w-full bg-primary-600 text-white rounded-md p-2 bg-mainRed"
            on:click={() => {
              purchaseTicket();
            }}
          >
            Submit
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}

{#if party.id}
  <div
    class="w-full h-fit md:h-full flex flex-col md:flex-row bg-gradient-to-b from-mainRed to-purple-400 backdrop-blur-2xl gap-10 p-5 md:p-10 pb-20 md:pb-40"
  >
    <div class="w-full h-fit md:min-w-[45%] md:w-[45%] bg-neutral-900">
      <div class="w-full h-full md:h-fit bg-matteBlack rounded-md">
        <img
          src={party.flyerPath}
          alt="Party Flyer"
          class="w-full object-cover md:object-contain rounded-md"
        />
      </div>
    </div>
    <div
      class="w-full md:min-w-[50%] p-5 flex flex-col gap-4 bg-matteBlack text-white h-fit rounded-md md:sticky md:top-20"
    >
      <div
        class="flex flex-col gap-2 bg-neutral-900 rounded-md p-3 relative overflow-hidden"
      >
        <!-- <h1 class="text-3xl font-bold mb-3">Party Info</h1> -->

        <!-- <div
          class="w-64 h-36 rounded-full bg-gradient-to-br from-green-300 to-purple-300 absolute blur-2xl -top-10 -right-10"
        /> -->

        <h2 class="text-3xl font-bold mb-4 flex flex-row gap-2">
          {party.name}
        </h2>
        {#if party?.ageLimit > 1}
          <h3 class="text-lg items-center mb-1">
            Age : {party.ageLimit}+
          </h3>
        {/if}
        <h3 class="flex flex-row gap-2 text-lg items-center mb-1">
          <IconCalendar />
          {DateTime.fromISO(party.date).toLocaleString()}
        </h3>
        <h3 class="flex flex-row gap-2 text-lg items-center mb-1">
          <IconClock />
          {party.startTime} - {party.endTime}
        </h3>
        <h3 class="flex flex-row gap-2 text-lg items-center mb-1">
          <IconLocation />
          {party.privateAddress ? "Private Address" : party.address}
        </h3>
        {#if party.attendies > 20}
          <h3 class="flex flex-row gap-2 text-lg items-center mb-1">
            <IconUser />
            {party.attendies} Attendees
          </h3>
        {/if}
      </div>

      <div class="flex flex-col gap-2 bg-neutral-900 p-3 rounded-md">
        <h1 class="text-3xl font-bold mb-3">Overview</h1>
        <p class="text-lg">{@html party.description}</p>
      </div>

      {#if party.tickets && party.paidParty && !party.externalEvent}
        <div class="flex flex-col gap-2 bg-neutral-900 p-3 rounded-md">
          <h1 class="text-3xl font-bold mb-3">Tickets</h1>

          {#each JSON.parse(party.tickets) as ticket}
            <div
              class="flex bg-matteBlack p-4 mb-4 border border-mainRed shadow-md rounded-lg"
            >
              <div class="flex flex-col flex-grow pr-4">
                <div class="flex flex-row gap-2 mb-2 items-baseline">
                  <h1 class="font-bold text-2xl">{ticket.name}</h1>
                  {#if ticket.gender}
                    <h2 class="font-medium text-red-500 mt-1">
                      {ticket.gender} Only
                    </h2>
                  {/if}
                </div>
                <div class="mt-2">
                  <p class="font-semibold text-lg text-green-400">
                    ${formatPrice(ticket.price)}
                  </p>
                  {#if ticket.quantityLimit}
                    <p class="mt-2">{ticket.quantity} Left!</p>
                  {/if}
                </div>
              </div>
              {#if ticket.saleStartDate}
                {#if isTicketSaleWindowOpen(ticket)}
                  <div class="flex items-center">
                    {#if ticket.quantityLimit && parseInt(ticket.quantity) <= 0}
                      <button
                        class="py-2 px-4 bg-red-500 text-white rounded-md opacity-50 cursor-not-allowed"
                        disabled
                      >
                        Sold Out
                      </button>
                    {:else}
                      <button
                        on:click={() => {
                          selectedTicket = ticket;
                          phonenumberModal = true;
                        }}
                        class="py-2 px-4 bg-mainRed hover:bg-red-400 text-white rounded-md"
                      >
                        Buy
                      </button>
                    {/if}
                  </div>
                {:else}
                  <div class="flex items-center">
                    <button
                      class="py-2 px-4 bg-red-500 text-white rounded-md opacity-50 cursor-not-allowed"
                      disabled
                    >
                      {#if isTicketSaleWindowOver(ticket)}
                        Sale Over
                      {:else}
                        Sale Starts in {DateTime.fromISO(ticket.saleStartDate)
                          .set({
                            hour: DateTime.fromFormat(
                              ticket.saleStartTime,
                              "h:mm a"
                            ).hour,
                            minute: DateTime.fromFormat(
                              ticket.saleStartTime,
                              "h:mm a"
                            ).minute,
                          })
                          .diff($now)
                          .as("hours") >= 24
                          ? DateTime.fromISO(ticket.saleStartDate)
                              .set({
                                hour: DateTime.fromFormat(
                                  ticket.saleStartTime,
                                  "h:mm a"
                                ).hour,
                                minute: DateTime.fromFormat(
                                  ticket.saleStartTime,
                                  "h:mm a"
                                ).minute,
                              })
                              .toFormat("yyyy-MM-dd")
                          : DateTime.fromISO(ticket.saleStartDate)
                              .set({
                                hour: DateTime.fromFormat(
                                  ticket.saleStartTime,
                                  "h:mm a"
                                ).hour,
                                minute: DateTime.fromFormat(
                                  ticket.saleStartTime,
                                  "h:mm a"
                                ).minute,
                              })
                              .diffNow()
                              .toFormat("hh:mm:ss")}
                      {/if}
                    </button>
                  </div>
                {/if}
              {:else}
                <div class="flex items-center">
                  {#if ticket.quantityLimit && parseInt(ticket.quantity) <= 0}
                    <button
                      class="py-2 px-4 bg-red-500 text-white rounded-md opacity-50 cursor-not-allowed"
                      disabled
                    >
                      Sold Out
                    </button>
                  {:else}
                    <button
                      on:click={() => {
                        selectedTicket = ticket;
                        phonenumberModal = true;
                      }}
                      class="py-2 px-4 bg-mainRed hover:bg-red-400 text-white rounded-md"
                    >
                      Buy
                    </button>
                  {/if}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {:else if party.externalEvent}
        {#if party.externalEventLink}
          <div>
            <a href={party.externalEventLink} target="_blank">
              <button
                class="py-2 px-4 bg-violet-500 hover:bg-violet-400 text-white rounded-md"
              >
                Visit Party Page
              </button>
            </a>
          </div>
        {/if}
      {:else}
        <div
          class="flex bg-matteBlack p-4 mb-4 border border-mainRed shadow-md rounded-lg flex-col gap-4"
        >
          <h1 class="font-semibold">Get on the guest list</h1>
          <form
            on:submit|preventDefault={() => addToGuestList()}
            class="flex flex-col gap-2 mt-2"
          >
            <input
              type="text"
              placeholder="Full Name"
              class="py-2 px-4 bg-matteBlack border border-mainRed text-white rounded-md"
              bind:value={name}
            />
            <input
              type="text"
              placeholder="Instagram"
              class="py-2 px-4 bg-matteBlack border border-mainRed text-white rounded-md"
              bind:value={instagram}
            />
            <input
              type="text"
              placeholder="Phone Number"
              class="py-2 px-4 bg-matteBlack border border-mainRed text-white rounded-md"
              bind:value={guestListPhone}
            />
            <button
              type="submit"
              class="py-2 px-4 bg-mainRed hover:bg-red-500 text-white rounded-md"
            >
              Submit
            </button>
          </form>
        </div>
      {/if}
    </div>
  </div>
{:else}
  <div
    class="w-full h-fit md:h-full flex flex-col md:flex-row bg-gradient-to-b from-mainRed to-purple-400 backdrop-blur-2xl gap-10 p-5 md:p-10 pb-20 md:pb-40"
  >
    <div class="w-full h-fit md:min-w-[45%] md:w-[45%]">
      <div class="w-full h-[80vh] md:h-[100vh] bg-gray-400 rounded-md">
        <div class="w-full h-full bg-neutral-900 animate-pulse rounded-md" />
      </div>
    </div>

    <div
      class="w-full md:min-w-[50%] p-5 flex flex-col gap-4 bg-matteBlack text-white h-fit rounded-md md:sticky md:top-20"
    >
      <div
        class="flex flex-col gap-2 bg-neutral-900 rounded-md p-3 relative overflow-hidden"
      >
        <div class="h-10 bg-neutral-600 animate-pulse rounded mb-4" />
        <div class="h-6 bg-neutral-600 animate-pulse rounded mb-1" />
        <div class="h-6 bg-neutral-600 animate-pulse rounded mb-1" />
        <div class="h-6 bg-neutral-600 animate-pulse rounded mb-1" />
        <div class="h-6 bg-neutral-600 animate-pulse rounded mb-1" />
      </div>

      <div class="flex flex-col gap-2 bg-neutral-900 p-3 rounded-md">
        <div class="h-10 bg-neutral-600 animate-pulse rounded mb-3" />
        <div class="h-6 bg-neutral-600 animate-pulse rounded" />
      </div>

      <div class="flex flex-col gap-2 bg-neutral-900 p-3 rounded-md">
        <div class="h-10 bg-neutral-600 animate-pulse rounded mb-3" />
        <div class="h-10 bg-neutral-600 animate-pulse rounded mb-4" />
        <div class="h-6 bg-neutral-600 animate-pulse rounded mb-4" />
        <div class="h-8 bg-neutral-600 animate-pulse rounded" />
      </div>

      <div class="flex flex-col gap-2 bg-neutral-900 p-3 rounded-md">
        <div class="h-10 bg-neutral-600 animate-pulse rounded mb-3" />
        <div class="h-6 bg-neutral-600 animate-pulse rounded" />
      </div>
    </div>
  </div>
{/if}

<Footer />
