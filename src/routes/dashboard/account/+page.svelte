<script lang="ts">
  // import { authStore } from "../../../../stores/authStore";
  import axios from "axios";
  import { doc, getDoc, collection, setDoc } from "firebase/firestore";
  import { db } from "$lib/firebase";
  import { goto } from "$app/navigation";
  import stripeIcon from "../../../assets/images/stripe-icon.svg";
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  let stripeAccount: any = null;
  let loading: boolean = true;

  const createAccountLink = async () => {
    const storedStripeAccount = await getDoc(
      doc(db, "stripe-accounts", $page.data.uid)
    );

    if (storedStripeAccount.exists()) {
      try {
        let accountLink: any = await axios.post("/api/createAccountLink", {
          id: stripeAccount.id,
        });
        window.location.href = accountLink.data.url;
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        let newStripeAccount: any = await axios.post(
          "/api/createStripeAccount"
        );

        await setDoc(doc(db, "stripe-accounts", $page.data.uid), {
          stripeAccountId: newStripeAccount.data.id,
        });

        let accountLink: any = await axios.post("/api/createAccountLink", {
          id: newStripeAccount.data.id,
        });
        window.location.href = accountLink.data.url;
      } catch (error) {
        console.log(error);
      }
    }
  };

  const checkStripeAccount = async () => {
    let stripeAccountId = await getDoc(
      doc(db, "stripe-accounts", $page.data.uid)
    );

    if (!stripeAccountId.exists()) {
      loading = false;
      return;
    }

    try {
      let returnedStripeAccount: any = await axios.get(
        `/api/checkStripeAccount?id=${stripeAccountId.data().stripeAccountId}`
      );
      if (returnedStripeAccount) stripeAccount = returnedStripeAccount.data;
      else stripeAccount = null;
    } catch (error) {
      console.log(error);
    } finally {
      loading = false;
    }
  };

  const createLoginLink = async () => {
    loading = true;
    try {
      let loginLink = await axios.get(
        `/api/createStripeLoginLink?id=${stripeAccount.id}`
      );

      goto(loginLink.data.url);
    } catch (error) {
      console.log(error);
    } finally {
      loading = false;
    }
  };

  // $: if (!$authStore.isLoading && $authStore.currentUser) {
  //   checkStripeAccount();
  // }

  onMount(() => {
    checkStripeAccount();
  });
</script>

<div class="w-full h-full rounded p-5 overflow-scroll">
  {#if !loading}
    {#if !stripeAccount || !stripeAccount.details_submitted}
      <button
        class="bg-stripe/25 hover:bg-stripe/50 p-3 px-4 rounded flex items-center text-white text-lg"
        on:click={() => {
          createAccountLink();
        }}
      >
        <img
          src={stripeIcon}
          alt="Stripe logo"
          class="h-4 border-r-[1px] pr-2 mr-2"
        />
        <div class="w-[1px] h-full bg-white" />
        Link Stripe</button
      >
    {:else}
      <button
        class="bg-stripe/25 hover:bg-stripe/50 p-3 px-4 rounded flex items-center text-white text-lg"
        on:click={() => {
          createLoginLink();
        }}
      >
        <img
          src={stripeIcon}
          alt="Stripe logo"
          class="h-4 border-r-[1px] pr-2 mr-2"
        />
        <div class="w-[1px] h-full bg-white" />
        View Stripe Dashboard</button
      >
    {/if}
  {:else}
    <button
      class="bg-stripe/25 hover:bg-stripe/50 p-3 px-4 rounded flex items-center text-white text-lg"
    >
      <div class="h-[30px] w-4 pr-2 mr-2 bg-white/25 rounded" />
      <div class="w-[1px] h-full bg-white" />
      <span class="bg-white/25 rounded w-[190px] h-[30px]" /></button
    >
  {/if}
</div>
