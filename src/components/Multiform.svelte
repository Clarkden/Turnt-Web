<script lang="ts">
  import { IconArrowLeft, IconCirclePlus } from "@tabler/icons-svelte";
  import PartyInfo1 from "./Forms/PartyInfo1.svelte";
  import PartyInfo2 from "./Forms/PartyInfo2.svelte";
  import PartyInfo3 from "./Forms/PartyInfo3.svelte";
  import { createEventDispatcher } from "svelte";
  import { doc, setDoc, getDoc, collection, addDoc } from "firebase/firestore";
  import { db, storageRef } from "../lib/firebase";
  import { authStore } from "../stores/authStore";
  import type { Party } from "$lib/types";
  import { getDownloadURL, uploadBytes } from "firebase/storage";
  import axios from "axios";
  import { fly } from "svelte/transition";

  const dispatch = createEventDispatcher();

  let currentStepIndex = 0;
  let totalSteps = 4;
  let response: any = {};
  let test: string = "test";

  let fileInput: HTMLInputElement;
  let file: File | null = null;
  let fileName: string = "";
  let error: string = "";

  const handleFileChange = (e: any) => {
    file = e.target.files[0];
    fileName = file ? file.name : "No file chosen";
  };

  const completion = () => {
    dispatch("completion", response);
  };

  const createParty = async () => {
    if (!file) return;

    let path = await uploadBytes(storageRef, file).then(async (snapshot) => {
      return await getDownloadURL(snapshot.ref);
    });

    response = {
      ...response,
      hostAccountId: $authStore.currentUser?.["uid"],
      createdAt: new Date(),
      flyerPath: path,
      attendies: 0,
    };

    let party: Party = response;

    if (party) {
      const docRef = await addDoc(collection(db, "parties"), party);
    } else {
      console.log("no party");
    }
  };

  const checkStripeAccount = async () => {
    if (!$authStore.currentUser) return;

    let stripeAccountId = await getDoc(
      doc(db, "stripe-accounts", $authStore.currentUser["uid"])
    );

    if (!stripeAccountId.exists().stripeAccountId) return false;

    try {
      let returnedStripeAccount: any = await axios.get(
        `/api/checkStripeAccount?id=${stripeAccountId.data().stripeAccountId}`
      );
      console.log(returnedStripeAccount);
      if (returnedStripeAccount && returnedStripeAccount.data.details_submitted)
        return true;
      else return false;
    } catch (error) {
      return false;
    }
  };

  let previousPaidPartyStatus = response.paidParty;

  $: {
    if (response.paidParty !== previousPaidPartyStatus) {
      previousPaidPartyStatus = response.paidParty;
      if (response.paidParty) {
        checkStripeAccount().then((result) => {
          if (result) {
            totalSteps = 4;
          } else {
            currentStepIndex -= 1;
            error =
              "You must link your account to create a paid party.<br>Head to the settings tab <a class='text-black underline' href='/hub/dashboard/settings'>Settings</>";
          }
        });
      } else {
        totalSteps = 3;
      }
    }
  }
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
    if (!response.paidParty && currentStepIndex === 4) {
      currentStepIndex -= 2;
      return;
    }

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
      {:else if currentStepIndex === 2}
        Tickets
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
      currentStepIndex++;
    }}
  />
{:else if currentStepIndex === 1}
  <PartyInfo2
    data={response}
    on:completion={(e) => {
      response = { ...response, ...e.detail };
      currentStepIndex++;
    }}
  />
{:else if currentStepIndex === 2}
  <PartyInfo3
    data={response}
    on:completion={(e) => {
      response = { ...response, ...e.detail };

      if (!response.paidParty) {
        currentStepIndex++;
      }
      currentStepIndex++;
    }}
  />
{:else if currentStepIndex === 3}
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
        completion();
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
