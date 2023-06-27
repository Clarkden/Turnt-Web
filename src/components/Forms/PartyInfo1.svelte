<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let paidParty: boolean = true;

  const completion = () => {
    dispatch("completion", {
      paidParty,
    });
  };
</script>

<h1 class="font-bold text-3xl text-white mb-2">Let's get started</h1>
<div
  on:mouseup={() => {
    paidParty = false;
    completion();
  }}
  class="w-full drop-shadow-md h-[10vh] rounded-md flex flex-col items-center justify-center mt-5 bg-matteBlack cursor-pointer hover:border transition-all text-white"
>
  <h1 class="font-semibold text-lg">Free Event</h1>
  <p class="text-neutral-400">Just RSVPS</p>
</div>
<div
  on:mouseup={() => {
    paidParty = true;
    completion();
  }}
  class="w-full drop-shadow-md h-[10vh] rounded-md flex flex-col items-center justify-center mt-5 bg-matteBlack cursor-pointer hover:border transition-all text-white"
>
  <h1 class="font-semibold text-lg">Paid Event</h1>
  <p class="text-neutral-400">Sell Tickets</p>
</div>
