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
  import { auth, db } from "$lib/firebase";
  import { goto } from "$app/navigation";
  import { getIdToken } from "firebase/auth";

  let sessionId: any = $page.url.searchParams.get("session_id");
  let paymentIntentId: any;
  let partyLocation: any;
  let partyId: any;

  const checkId = async () => {
    try {
      const checkOutResponse = await axios.get(
        `/api/checkCheckoutId?id=${sessionId}`,
        {
          headers: {
            Authorization: "Bearer " + (await getIdToken(auth?.currentUser!)),
          },
        }
      );
      paymentIntentId = checkOutResponse.data.payment_intent;

      const paymentIntent = await axios.get(
        `/api/checkPaymentIntent?id=${paymentIntentId}`,
        {
          headers: {
            Authorization: "Bearer " + (await getIdToken(auth?.currentUser!)),
          },
        }
      );

      if (paymentIntent) {
        const party = await getDoc(
          doc(db, "parties", paymentIntent.data.metadata.partyId)
        );

        if (party.exists()) partyLocation = party.data().address;
      } else {
        goto("/find");
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

<div
  class="container h-screen min-w-full flex flex-col items-center justify-center bg-gradient-to-b from-mainRed to-purple-400 backdrop-blur-2xl"
>
  <div
    class="w-[90%] md:w-[400px] bg-neutral-900 flex flex-col p-6 rounded-lg shadow-lg h-fit"
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
        <QRCodeImage text={paymentIntentId} />
      </div>
    </div>
  </div>
</div>
