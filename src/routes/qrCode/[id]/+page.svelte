<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { db } from "../../../lib/firebase";
  import { getDoc, doc, query, where } from "firebase/firestore";
  import { QRCodeImage } from "svelte-qrcode-image";
  import { goto } from "$app/navigation";

  let partyLocation: any;

  const getPartyLocation = async () => {
    const payment = await getDoc(doc(db, "payments", $page.params.id));

    if (payment.exists()) {
      const party = await getDoc(
        doc(db, "parties", payment.data().metadata.partyId)
      );
      if (party.exists()) {
        partyLocation = party.data().address;
      }
    } else {
      goto("/find");
    }
  };

  onMount(() => {
    getPartyLocation();
  });
</script>

<div class="container h-full w-full flex flex-col items-center justify-start">
  <div class="w-[95%] h-full flex flex-col">
    <h1 class="text-2xl text-white font-bold mt-4">Have a great time!</h1>
    <p class="font-semibold text-gray-100">
      Show this ticket when you get to the door
    </p>
    {#if partyLocation}
      <p class="font-semibold text-gray-100">
        Address: {partyLocation}
      </p>
    {/if}
    <div class="flex flex-row w-full items-center justify-center my-5">
      <div
        class="w-fit h-fit flex flex-row items-center justify-center p-2 border rounded border-mainRed"
      >
        <QRCodeImage text={$page.params.id} />
      </div>
    </div>
  </div>
</div>
