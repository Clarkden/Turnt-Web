<script lang="ts">
  import { IconArrowRight, IconBrandDiscord } from "@tabler/icons-svelte";
  import { inview } from "svelte-inview";
  import { fade } from "svelte/transition";

  let isInView: boolean = false;
</script>

<div class="h-full w-full overflow-scroll bg-mainRed">
  <div class="flex flex-col gap-4 p-4 items-center justify-between">
    <div class="w-full h-[90vh] flex flex-col items-center justify-center">
      <h1 class="font-bold text-5xl text-white drop-shadow-glow text-center leading-releaxed">
        The better party platform
      </h1>
      <div
        class="bg-gradient-to-r from-green-300 via-purple-300 to-blue-300 bg-clip-text drop-shadow-glow-gradient leading-releaxed"
      >
        <h1 class="font-bold text-5xl text-transparent">
          Simple<span class="text-6xl">.</span>
        </h1>
      </div>
      <p class="text-xl text-neutral-200 my-8 font-light">Charge less, Party more</p>
      <a
        href="/dashboard"
        class="bg-gray-200 hover:bg-white p-2 transition rounded-full group duration-300 ease-in-out flex items-center justify-center text-sm font-semibold"
        >Start Hosting
        <IconArrowRight class="w-6 h-6 inline-block group-hover:translate-x-1 transition" />
        </a
      >
    </div>
    <!-- <div
      class="w-full min-h-[fit] h-[50vh] flex flex-col-reverse md:flex-row items-center justify-around px-5 md:px-20"
    >
      <div class="w-full h-full flex flex-col">
        <h1 class="text-3xl font-bold text-white mb-2">
          We charge less so you can party more
        </h1>
        <p class="text max-w-[85%] text-lg text-neutral-200">
          Your customers are already paying to get in, why would we make them
          upset with outragious service fees? We want to provide a seamless
          experience for party goers and event organizers. By avoiding high
          service fees we keep everyone happy.
        </p>
      </div>
      <div class="w-full h-full flex flex-col items-start md:items-center justify-start">
        <div
          class="rounded-md flex flex-col items-center justify-center md:p-4 md:py-8 w-full bg-gradient-to-l from-green-300 via-purple-300 to-blue-300 bg-clip-text drop-shadow-glow-gradient"
        >
          <h1 class="font-bold text-transparent text-4xl">50% Lower Fees</h1>
          <p class="font-thin text-lg text-neutral-100">Compared to select competitors</p>
        </div>
      </div>
    </div> -->
  </div>
</div>
<footer class="bg-matteBlack text-white py-10 px-5 md:px-20">
  <div class="flex flex-col md:flex-row md:justify-between md:items-center">
    <div class="mb-10 md:mb-0">
      <h2 class="text-2xl font-bold drop-shadow-glow">Turnt</h2>
      <p class="mt-2 text-sm">The best party platform.</p>
    </div>
    <div class="flex flex-wrap justify-center md:justify-start gap-8">
      <div class="text-center">
        <a href="https://app.termly.io/document/terms-of-service/1b0f8cd9-6edd-487b-8c6d-cd0f2a3193cd" class="text-sm hover:text-gray-300 font-semibold"
          >Terms of Service</a
        >
      </div>
      <div class="text-center">
        <a href="https://app.termly.io/document/privacy-policy/c28003bf-b887-4958-a825-d8d0f4b2e87b" class="text-sm hover:text-gray-300 font-semibold"
          >Privacy Policy</a
        >
      </div>
      <div class="text-center">
        <a href="/login" class="text-sm hover:text-gray-300 font-semibold"
          >Login</a
        >
      </div>
      <div class="text-center">
        <a href="/register" class="text-sm hover:text-gray-300 font-semibold"
          >Register</a
        >
      </div>
    </div>
    <div class="flex justify-center md:justify-start gap-4 mt-10 md:mt-0">
      <a href="https://discord.gg/jeK3AaHZM6">
        <IconBrandDiscord class="w-6 h-6 hover:text-gray-300" />
      </a>
    </div>
  </div>
  <hr class="my-10 opacity-50" />
  <div class="text-center text-sm">
    <p>Contact Us at support@turnt.party | Copyright 2023</p>
  </div>
</footer>
