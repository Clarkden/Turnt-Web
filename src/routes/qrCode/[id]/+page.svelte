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

<div
  class="container h-full w-full flex flex-col items-center justify-center bg-matteBlack"
>
  <div
    class="w-[90%] md:w-[400px] border-2 border-mainRed bg-matteBlack h-[80%] flex flex-col p-6 rounded-lg shadow-lg"
  >
    <h1 class="text-3xl text-mainRed font-extrabold mt-4 tracking-tight">
      Have a great time!
    </h1>
    <p class="font-medium text-gray-200 mt-2">
      Show this ticket when you get to the door
    </p>
    {#if partyLocation}
      <p class="font-medium text-gray-200 mt-2">
        Address: {partyLocation}
      </p>
    {/if}
    <div class="flex flex-row w-full items-center justify-center my-6">
      <div
        class="w-auto h-auto flex flex-row items-center justify-center p-4 border-2 rounded-lg border-mainRed shadow"
      >
        <QRCodeImage text={$page.params.id} />
      </div>
    </div>
  </div>
</div>
