<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import AdminMultiForm from "../../../components/AdminMultiForm.svelte";
  import AdminPartyView from "../../../components/AdminPartyView.svelte";

  let creatingExternalParty: boolean = false;
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

<section class="p-2 px-4 md:p-10 relative">
  <div class="flex flex-row gap-2">
    <button
      on:click={() => (creatingExternalParty = !creatingExternalParty)}
      class="bg-white hover:bg-gray-200 rounded px-4 py-2"
      >Create External Party</button
    >
    <button class="bg-white hover:bg-gray-200 rounded px-4 py-2"
      >Refund Party</button
    >
  </div>
  <AdminPartyView />
</section>
