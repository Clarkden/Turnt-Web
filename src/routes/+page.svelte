<script lang="ts">
  import { inview } from "svelte-inview";
  import { fade } from "svelte/transition";

  let isInView: boolean = false;
</script>

<div class="h-full w-full overflow-scroll bg-mainRed">
  <div class="flex flex-col gap-4 p-4 items-center justify-between">
    <div
      class="w-full h-[90vh] flex flex-col items-center justify-center"
    >
      <h1 class="font-bold text-5xl text-white drop-shadow-glow text-center">
        The better party platform
      </h1>
      <div
        class="bg-gradient-to-r from-green-300 via-purple-300 to-blue-300 bg-clip-text drop-shadow-glow-gradient"
      >
        <h1 class="font-bold text-5xl text-transparent">
          Simple<span class="text-6xl">.</span>
        </h1>
      </div>
      <p class="font-light text-neutral-300 my-5">Charge less, Party more</p>
      <a
        href="/dashboard"
        class="bg-white p-2 rounded-md font-medium hover:bg-yellow-200 transition"
        >Start Hosting</a
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
