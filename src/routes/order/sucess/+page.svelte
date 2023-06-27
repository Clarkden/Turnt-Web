<script lang="ts">
  import { page } from "$app/stores";
  import axios from "axios";
  import { QRCodeImage } from "svelte-qrcode-image";

  let sessionId: any;
  let paymentIntentId: any;

  const checkId = async () => {
    try {
      const checkOutResponse = await axios.get(
        `/api/checkCheckoutId?id=${sessionId}`
      );
      paymentIntentId = checkOutResponse.data.payment_intent;
    } catch (error) {
      console.log(error);
    }
  };

  $: if ($page) {
    sessionId = $page.url.searchParams.get("session_id");
    checkId();
  }
</script>

<div class="container h-full w-full flex flex-col items-center justify-start">
  <div class="w-[95%] h-full flex flex-col">
    <h1 class="text-2xl text-white font-bold mt-4">Have a great time!</h1>
    <p class="font-semibold text-gray-100">
      Show this ticket when you get to the door
    </p>
    <div class="flex flex-row w-full items-center justify-center my-5">
      <div
        class="w-fit h-fit flex flex-row items-center justify-center p-2 border rounded border-mainRed"
      >
        <QRCodeImage text={paymentIntentId} />
      </div>
    </div>
  </div>
</div>
