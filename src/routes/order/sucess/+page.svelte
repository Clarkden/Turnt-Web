<script lang="ts">
  import { page } from "$app/stores";
  import axios from "axios";
  import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    query,
    where,
  } from "firebase/firestore";
  import { onMount } from "svelte";
  import { QRCodeImage } from "svelte-qrcode-image";
  import { db } from "$lib/firebase";
  import { goto } from "$app/navigation";

  let sessionId: any = $page.url.searchParams.get("session_id");
  let paymentIntentId: any;
  let partyLocation: any;
  let partyId: any;

  const checkId = async () => {
    try {
      const checkOutResponse = await axios.get(
        `/api/checkCheckoutId?id=${sessionId}`
      );
      paymentIntentId = checkOutResponse.data.payment_intent;

      const paymentIntent = await axios.get(
        `/api/checkPaymentIntent?id=${paymentIntentId}`
      );

      if (paymentIntent) {
        const party = await getDoc(
          doc(db, "parties", paymentIntent.data.metadata.partyId)
        );

        if (party.exists()) partyLocation = party.data().address;
      } else {
        goto("/hub/find");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPartyLocation = async () => {
    const party = await getDoc(doc(db, "parties", partyId));

    if (party.exists()) {
      partyLocation = party.data().location;
    }
  };

  onMount(() => {
    checkId();
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
        <QRCodeImage text={paymentIntentId} />
      </div>
    </div>
  </div>
</div>
