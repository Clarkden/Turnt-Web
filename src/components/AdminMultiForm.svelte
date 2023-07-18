<script lang="ts">
  import { IconArrowLeft, IconCirclePlus } from "@tabler/icons-svelte";
  import PartyInfo2 from "./AdminForms/PartyInfo2.svelte";
  import PartyInfo3 from "./AdminForms/PartyInfo3.svelte";
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
  let response: any = {};

  let fileInput: HTMLInputElement;
  let file: File | null = null;
  let fileName: string = "";
  let error: string = "";
  let creatingParty: boolean = false;
  let flyerLink: string = "";
  let now = new Date();

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
      if (!flyerLink && !file) {
        error = "Please add a flyer or a link to a flyer";
        return;
      }

      let path;

      if (file) {
        const storageRef = ref(storage, `images/${now.getTime()}`);

        path = await uploadBytes(storageRef, file).then(async (snapshot) => {
          return await getDownloadURL(snapshot.ref);
        });
      } else {
        path = flyerLink;
      }

      response = {
        ...response,
        createdAt: new Date(),
        flyerPath: path,
        externalEvent: true,
      };

      let party: Party = response;

      if (party) {
        const docRef = await addDoc(collection(db, "parties"), party);
        const adminRef = await addDoc(collection(db, "admin-parties"), {
          adminId: $page.data.uid,
          partyId: docRef.id,
        });

        if (browser) {
          logEvent(analytics, "extenral_party_created", {
            partyId: docRef.id,
            adminId: $page.data.uid,
            adminRef: adminRef.id,
          });
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

{#if currentStepIndex === 0}
  <PartyInfo2
    data={response}
    on:completion={(e) => {
      response = { ...response, ...e.detail };
      currentStepIndex++;
    }}
  />
{/if}
{#if currentStepIndex === 1}
  <h1 class="font-bold text-3xl text-white mb-1">Host</h1>
  <h1 class="text-lg text-neutral-100 mb-4">Add a party flyer</h1>

  <input
    type="text"
    placeholder="Link to picture"
    class="p-2 rounded-md bg-matteBlack text-white outline-none w-full"
    name="scrapeUrl"
    id="scrapeUrl"
    bind:value={flyerLink}
  />

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

  {#if file || flyerLink}
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
