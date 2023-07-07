<script lang="ts">
  import { IconArrowLeft, IconCirclePlus } from "@tabler/icons-svelte";
  import PartyInfo1 from "./Forms/PartyInfo1.svelte";
  import PartyInfo2 from "./Forms/PartyInfo2.svelte";
  import PartyInfo3 from "./Forms/PartyInfo3.svelte";
  import { createEventDispatcher } from "svelte";
  import {
    doc,
    setDoc,
    getDoc,
    collection,
    addDoc,
    updateDoc,
    getDocs,
    query,
    where,
  } from "firebase/firestore";
  import { db, storage } from "$lib/firebase";
  import type { Party } from "$lib/types";
  import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
  import axios from "axios";
  import { fly } from "svelte/transition";
  import { page } from "$app/stores";
  import { analytics } from "$lib/firebase";
  import { logEvent } from "firebase/analytics";
  import { browser } from "$app/environment";
  // import {v4 as uuid} from "uuid";

  const dispatch = createEventDispatcher();

  let currentStepIndex = 0;
  let totalSteps = 4;
  let response: any = {};
  let test: string = "test";

  let fileInput: HTMLInputElement;
  let file: File | null = null;
  let fileName: string = "";
  let error: string = "";
  let stripeCheck: boolean = false;
  let stripeCheckValid: boolean = false;
  let creatingParty: boolean = false;

  const handleFileChange = (e: any) => {
    file = e.target.files[0];
    fileName = file ? file.name : "No file chosen";
  };

  const completion = () => {
    dispatch("completion", response);
  };

  const createParty = async () => {
    if (!file) return;

    try {
      const now = new Date();

      const findDuplicateAddressOnDate = await getDocs(
        query(
          collection(db, "parties"),
          where("address", "==", response.address),
          where("date", "==", response.date)
        )
      );

      if (findDuplicateAddressOnDate.docs.length > 0) {
        alert(
          "You cannot have two parties at the same address on the same day."
        );
        return;
      }

      const storageRef = ref(storage, `images/${now.getTime()}`);

      let path = await uploadBytes(storageRef, file).then(async (snapshot) => {
        return await getDownloadURL(snapshot.ref);
      });

      response = {
        ...response,
        hostAccountId: $page.data.uid,
        createdAt: new Date(),
        flyerPath: path,
        attendies: 0,
      };

      let party: Party = response;

      if (party) {
        const docRef = await addDoc(collection(db, "parties"), party);

        if (browser) {
          logEvent(analytics, "party_created", {
            partyId: docRef.id,
            hostAccountId: $page.data.uid,
          });
        }

        if (!party.paidParty) {
          const guestList = await addDoc(collection(db, "guest-lists"), {
            partyId: docRef.id,
            hostAccountId: $page.data.uid,
          });
          const guestsSubCollection = await collection(guestList, "guests");
        }

        const hostData = await getDoc(doc(db, "hosts", $page.data.uid));

        if (hostData.exists()) {
          const updatedHostData = {
            attendies: hostData.data().attendies + 1,
            parties: [...hostData.data().parties, docRef.id],
          };

          await updateDoc(doc(db, "hosts", $page.data.uid), updatedHostData);
        } else {
          const hostData = {
            attendies: 0,
            parties: [docRef.id],
          };

          await setDoc(doc(db, "hosts", $page.data.uid), hostData);
        }
      } else {
        console.log("no party");
      }
    } catch (err) {
      console.log(err);
    } finally {
      creatingParty = false;
      completion();
    }
  };

  const checkStripeAccount = async () => {
    const stripeId = await getDoc(doc(db, "stripe-accounts", $page.data.uid));

    if (stripeId.exists()) {
      let returnedStripeAccount: any = await axios.get(
        `/api/checkStripeAccount?id=${stripeId.data().stripeAccountId}`
      );

      if (
        returnedStripeAccount.data.details_submitted &&
        returnedStripeAccount.data.charges_enabled
      ) {
        return true;
      } else {
        return false;
      }
    } else return false;
  };
</script>

{#if error}
  <div
    class="fixed bottom-0 w-full px-4 py-6 md:w-auto md:px-6 md:rounded md:shadow-lg md:bottom-3 md:right-3 bg-white"
    in:fly={{ y: 100, duration: 200 }}
    out:fly={{ y: 100, duration: 200 }}
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
        <p class="font-semibold">{@html error}</p>
      </div>
      <button
        class="text-gray-400 hover:text-gray-600 transition"
        on:click={() => {
          error = "";
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
<button
  on:click={() => {
    if (currentStepIndex > 0) currentStepIndex--;
    else dispatch("cancel");
  }}
  class="flex flex-row items-center gap-2 text-white mb-4 rounded-full min-w-[2.5rem] min-h-[2.5rem] w-10 h-10 bg-white/25 justify-center hover:bg-white/50"
>
  <IconArrowLeft size={20} stroke={2} />
</button>
<div class="mb-10">
  <h2 class="sr-only">Steps</h2>

  <div>
    <p class="text-md font-medium text-white mb-5">
      {currentStepIndex + 1}/{totalSteps} - {#if currentStepIndex === 0}
        Party Type
      {:else if currentStepIndex === 1}
        Details
      {:else if currentStepIndex === 2 && response.paidParty}
        Tickets
      {:else if currentStepIndex === 2 && !response.paidParty}
        Host
      {:else if currentStepIndex === 3}
        Host
      {/if}
    </p>

    <!-- <div class="mt-4 overflow-hidden rounded-full bg-gray-200">

      <div
        class={`h-2 ${
          "w-" + currentStepIndex + 1 + "/" + totalSteps
        } rounded-full bg-blue-500`}
      />
    </div> -->
  </div>
</div>

{#if currentStepIndex === 0}
  <PartyInfo1
    on:completion={(e) => {
      response = { ...response, ...e.detail };
      if (response.paidParty) {
        if (!stripeCheck) {
          checkStripeAccount()
            .then((result) => {
              stripeCheck = true;

              if (result) {
                totalSteps = 4;
                stripeCheckValid = true;
                currentStepIndex++;
              } else {
                error =
                  "You must finish linking your account to create a paid party.<br>Head to the account tab <a class='text-black underline' href='/dashboard/account'>Account</>";
              }
            })
            .catch((err) => {
              error =
                "You must finish linking your account to create a paid party.<br>Head to the account tab <a class='text-black underline' href='/dashboard/account'>Account</>";
            });
        } else {
          if (!stripeCheckValid) {
            currentStepIndex -= 1;
            error =
              "You must link your account to create a paid party.<br>Head to the account tab <a class='text-black underline' href='/dashboard/account'>Account</>";
          }
        }
      } else {
        totalSteps = 3;
        currentStepIndex++;
      }
    }}
  />
{/if}
{#if currentStepIndex === 1}
  <PartyInfo2
    data={response}
    on:completion={(e) => {
      response = { ...response, ...e.detail };
      currentStepIndex++;
    }}
  />
{/if}
{#if currentStepIndex === 2 && response.paidParty}
  <PartyInfo3
    data={response}
    on:completion={(e) => {
      response = { ...response, ...e.detail };
      currentStepIndex++;
    }}
  />
{:else if currentStepIndex === 2 && !response.paidParty}
  <h1 class="font-bold text-3xl text-white mb-1">Host</h1>
  <h1 class="text-lg text-neutral-100 mb-4">Add a party flyer</h1>

  <div class="relative inline-block">
    <div
      class="w-full h-[300px] border-[1px] flex flex-col items-center justify-center cursor-pointer rounded-md group p-4"
      on:mouseup={() => fileInput.click()}
    >
      {#if file}
        <img
          src={URL.createObjectURL(file)}
          alt="preview"
          class="object-contain w-full h-full"
        />
      {:else}
        <div>
          <IconCirclePlus class="text-white group-hover:text-blue-400" />
        </div>
      {/if}
    </div>

    <input
      type="file"
      class="hidden"
      bind:this={fileInput}
      on:change={handleFileChange}
      accept="image/*"
    />
    <!-- <p class="mt-2">{fileName}</p> -->
  </div>

  {#if file}
    {#if !creatingParty}
      <button
        on:click={() => {
          creatingParty = true;
          createParty();
          // completion();
        }}
        class="bg-black text-white rounded-md p-2 w-full my-4"
      >
        Create Party
      </button>
    {:else}
      <button
        class="bg-black/50 border-[1px] border-black text-white rounded-md p-2 w-full my-4"
        disabled
      >
        Create Party
      </button>
    {/if}
  {:else}
    <button
      class="bg-black/50 border-[1px] border-black text-white rounded-md p-2 w-full my-4"
      disabled
    >
      Create Party
    </button>
  {/if}
{/if}
{#if currentStepIndex === 3 && response.paidParty}
  <h1 class="font-bold text-3xl text-white mb-1">Host</h1>
  <h1 class="text-lg text-neutral-100 mb-4">Add a party flyer</h1>

  <div class="relative inline-block">
    <div
      class="w-full h-[300px] border-[1px] flex flex-col items-center justify-center cursor-pointer rounded-md group p-4"
      on:mouseup={() => fileInput.click()}
    >
      {#if file}
        <img
          src={URL.createObjectURL(file)}
          alt="preview"
          class="object-contain w-full h-full"
        />
      {:else}
        <div>
          <IconCirclePlus class="text-white group-hover:text-blue-400" />
        </div>
      {/if}
    </div>

    <input
      type="file"
      class="hidden"
      bind:this={fileInput}
      on:change={handleFileChange}
      accept="image/*"
    />
    <!-- <p class="mt-2">{fileName}</p> -->
  </div>

  {#if file}
    <button
      on:click={() => {
        createParty();
      }}
      class="bg-black text-white rounded-md p-2 w-full my-4"
    >
      Create Party
    </button>
  {:else}
    <button
      class="bg-black/50 border-[1px] border-black text-white rounded-md p-2 w-full my-4"
      disabled
    >
      Create Party
    </button>
  {/if}
{/if}
