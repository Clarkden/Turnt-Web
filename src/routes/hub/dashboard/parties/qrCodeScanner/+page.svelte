<script lang="ts">
  import EasyQrcodeReader from "@cloudparker/easy-qrcode-reader-svelte";
  import { Html5Qrcode } from "html5-qrcode";
  import { onMount } from "svelte";
  import { db } from "$lib/firebase";
  import {
    getDoc,
    doc,
    query,
    collection,
    where,
    onSnapshot,
    getDocs,
    deleteDoc,
  } from "firebase/firestore";
  import { DateTime } from "luxon";
  // import { authStore } from "../../../../../stores/authStore";
  import { IconArrowLeft } from "@tabler/icons-svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  // import { navigate } from "$app/navigation";

  // let qrcodeReaderRef: EasyQrcodeReader;
  // let scanning: boolean = true;

  // let clientWidth: number;
  let ticket: any;

  // const handleQrcode = async (ev: CustomEvent) => {
  //   let data = ev.detail;
  //   if (data) {

  //     const unsubscribe = onSnapshot(
  //       query(collection(db, "tickets"), where("paymentIntentId", "==", data)),
  //       (snapshot) => {
  //         const tickets: any = [];
  //         snapshot.forEach((doc) => {
  //           tickets.push({ id: doc.id, ...doc.data() });
  //         });

  //         if (tickets.length < 1) {
  //           alert("Ticket has been redeemed or is not found");
  //           return;
  //         }
  //         ticket = tickets[0];
  //         console.log(ticket);
  //       }
  //     );

  //     //TODO: Handle the code and resume or close the camera
  //     qrcodeReaderRef.pause();
  //     scanning = false;
  //   }
  // };

  const redeemTicket = async () => {
    try {
      const ticketParty = await getDoc(doc(db, "parties", ticket.partyId));
      if (ticketParty.exists()) {
        if (ticketParty.data().hostAccountId !== $page.data.uid) {
          alert("You are not the host of this party");
          return;
        } else {
          await deleteDoc(doc(db, "tickets", ticket.id));
        }
      }
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };

  // onMount(() => {
  //   return () => {
  //     qrcodeReaderRef && qrcodeReaderRef.close();
  //   };
  // });

  let scanning = false;

  let html5Qrcode: any;

  onMount(init);

  function init() {
    html5Qrcode = new Html5Qrcode("reader");
  }

  function start() {
    html5Qrcode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      onScanSuccess,
      onScanFailure
    );
    scanning = true;
  }

  async function stop() {
    await html5Qrcode.stop();
    scanning = false;
  }

  function onScanSuccess(decodedText: any, decodedResult: any) {
    stop();

    console.log(decodedText);

    const unsubscribe = onSnapshot(
      query(
        collection(db, "tickets"),
        where("paymentIntentId", "==", decodedText)
      ),
      (snapshot) => {
        const tickets: any = [];
        snapshot.forEach((doc) => {
          tickets.push({ id: doc.id, ...doc.data() });
        });

        if (tickets.length < 1) {
          alert("Ticket has been redeemed or is not found");
          return;
        }
        ticket = tickets[0];
        console.log(ticket);
      }
    );

    alert(`Code matched = ${decodedText}`);
    console.log(decodedResult);
  }

  function onScanFailure(error: any) {
    console.warn(`Code scan error = ${error}`);
  }
</script>

<!-- <main class="flex flex-col items-center justify-center gap-20">
  {#if scanning}
    <button on:click={stop}>stop</button>
  {:else}
    <button on:click={start}>start</button>
  {/if}
</main> -->

<section class="p-4 flex flex-col gap-4 items-start">
  <button
    on:click={() => {
      goto("/hub/dashboard/parties");
    }}
    class="flex flex-row gap-2 justify-center text-white"
  >
    <IconArrowLeft class="w-6 h-6" />
    Back</button
  >

  <div class="flex flex-col sm:flex-row gap-4">
    <div
      class={`flex flex-col items-center justify-center mx-auto w-full sm:w-[60%] border-2 relative ${
        scanning ? "border-green-400" : "border-red-400"
      }`}
    >
      <reader id="reader" class="w-full min-h-[500px] bg-black" />
    </div>

    <div class="w-full">
      {#if scanning}
        <div
          class="flex flex-row pb-4 items-center justify-start text-white border-b-2 border-gray-500"
        >
          <div role="status">
            <svg
              aria-hidden="true"
              class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
          Scanning
        </div>
      {:else if !scanning && ticket}
        <div class="w-full h-fit border border-black p-3 rounded text-white">
          <h1>Purchaser Phone Number: {ticket.purchaserPhoneNumber}</h1>
          <h1>
            Ticket Purchased: {DateTime.fromSeconds(
              ticket.ticketCreated
            ).toLocaleString()}
          </h1>

          {#if ticket.ticketInfo}
            <div>
              <p>Ticket Name: {JSON.parse(ticket.ticketInfo).name}</p>
            </div>

            {#if JSON.parse(ticket.ticketInfo).gender}
              <p>Gender: {JSON.parse(ticket.ticketInfo).gender}</p>
            {/if}
          {/if}
        </div>
      {/if}

      {#if ticket}
        <button
          class="w-full p-2 bg-mainRed rounded mt-4 text-white"
          on:click={() => {
            redeemTicket();
            alert("Ticket Redeemed");
          }}>Redeem Ticket</button
        >
      {:else}
        <button
          class="w-full p-2 bg-mainRed/25 border border-mainRed rounded mt-4 text-white"
          disabled>Redeem Ticket</button
        >
      {/if}
      {#if scanning}
        <button
          on:click={() => {
            start();
            scanning = true;
          }}
          class="w-full p-2 bg-green-500/25 border border-green-500 rounded mt-4 text-white"
          disabled>Scan New Ticket</button
        >
        <button
          class="w-full p-2 bg-yellow-500 rounded mt-4 text-white"
          on:click={() => {
            stop();
            scanning = false;
          }}>Stop Scanning</button
        >
      {:else}
        <button
          on:click={() => {
            start();
            scanning = true;
          }}
          class="w-full p-2 bg-green-500 rounded mt-4 text-white"
          >Scan New Ticket</button
        >
        <button
          class="w-full p-2 bg-yellow-500/25 border border-yellow-500 rounded mt-4 text-white"
          disabled>Stop Scanning</button
        >
      {/if}
    </div>
  </div>
</section>
