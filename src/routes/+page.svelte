<script lang="ts">
  import { IconArrowRight, IconBrandDiscord } from "@tabler/icons-svelte";
  import MainDash from "../assets/images/MainDash.png";
  import { inview } from "svelte-inview";
  import { fade, fly } from "svelte/transition";
  import Particles from "svelte-particles";
  import { loadFull } from "tsparticles";

  let particlesUrl = "https://particles.js.org/samples/presets/fire.html"; // placeholder, replace it with a real url

  let particlesConfig = {
    particles: {
      color: {
        value: "#000",
      },
      links: {
        enable: true,
        color: "#000",
      },
      move: {
        enable: true,
      },
      number: {
        value: 100,
      },
    },
  };

  let onParticlesLoaded = (event: any) => {
    const particlesContainer = event.detail.particles;

    // you can use particlesContainer to call all the Container class
    // (from the core library) methods like play, pause, refresh, start, stop
  };

  let particlesInit = async (engine: any) => {
    // you can use main to customize the tsParticles instance adding presets or custom shapes
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  };
</script>

<!-- <Particles
    id="tsparticles"
    class="foo bar"
    options="{particlesConfig}"
    on:particlesLoaded="{onParticlesLoaded}"
    particlesInit="{particlesInit}"
/> -->

<Particles
  id="tsparticles"
  class="foo bar"
  url={particlesUrl}
  on:particlesLoaded={onParticlesLoaded}
  {particlesInit}
/>
<div class="h-full w-full bg-mainRed overflow-hidden relative">
  <section
    class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 md:h-[100vh] h-fit my-40 md:my-0 relative px-5 lg:px-40"
  >
    <div
      class="w-full h-full flex flex-col items-center justify-center md:justify-center md:text-left md:items-start col-span-1"
    >
      <h1
        class="font-bold text-3xl sm:text-4xl md:text-5xl text-white text-center leading-releaxed md:tracking-10 md:text-left"
      >
        The Better Party Platform
      </h1>
      <div
        class="bg-gradient-to-r from-green-300 via-purple-300 to-blue-300 bg-clip-text drop-shadow-glow-gradient leading-releaxed w-fit h-fit"
      >
        <h1
          class="font-bold text-3xl sm:text-4xl md:text-5xl text-transparent md:text-left"
        >
          Simple.
        </h1>
      </div>
      <p
        class="text-base sm:text-lg md:text-xl text-neutral-200 my-4 sm:my-6 md:my-8 font-light"
      >
        Charge less, Party more
      </p>
      <a
        href="/dashboard"
        class="bg-gray-200 hover:bg-white p-2 transition rounded-full group duration-300 ease-in-out flex items-center justify-center text-sm font-semibold"
        >Start Hosting
        <IconArrowRight
          class="w-6 h-6 inline-block group-hover:translate-x-1 transition"
        />
      </a>
    </div>
    <div class="rounded md:w-full md:h-full ] h-fit col-span-1">
      <img
        src={MainDash}
        alt="hero"
        class="object-contain md:object-cover md:object-left md:absolute md:w-[auto] md:max-h-[80vh] md:h-full md:top-1/4 md:-translate-y-1/4 w-full h-[auto] rounded-sm md:rounded-lg border border-gray-400 shadow-md shadow-white animate-in fade-in duration-700"
      />
    </div>
  </section>
  <!-- <section class="h-48 bg-matteBlack/50 rounded" /> -->
  <!-- <section
    class="w-full min-h-[fit] h-[70vh] md:h-[50vh] grid grid-cols-1 md:grid-cols-2 md:gap-20 px-5 lg:px-40 sm:my-28 md:my-20"
  >
    <div class="w-full h-full flex flex-col col-span-1 justify-center">
      <p class="text-violet-200">Lower Ticket Fees</p>
      <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">
        We charge less so you can party more
      </h1>
      <p class=" text-base max-w-[85%] md:text-lg text-neutral-200">
        Why should your guests pay more for a good time? Our platform saves them
        money. We charge lower service fees – up to 50% less than others. More
        party, less cost for your guests. That's our guarantee.
      </p>
    </div>
    <div
      class="w-full h-full flex flex-col items-start md:items-center col-span-1 justify-center border-2 rounded shadow-violet-400 shadow-lg"
    >
      <div
        class="rounded-md flex flex-col items-center justify-center md:p-4 md:py-8 w-full bg-gradient-to-l from-green-300 via-purple-300 to-blue-300 bg-clip-text drop-shadow-glow-gradient"
      >
        <h1 class="font-bold text-transparent text-4xl">50% Lower Fees</h1>
        <p class="font-thin text-lg text-neutral-100">
          Compared to other platforms
        </p>
      </div>
    </div>
  </section> -->
  <!-- <section
    class="w-full min-h-[fit] h-[70vh] md:h-[50vh] grid grid-cols-1 md:grid-flow-row md:grid-cols-2 md:gap-20 px-5 lg:px-40 sm:my-28 md:my-20"
  >
    <div class="flex flex-col h-full w-fill items-center justify-center duration-700">
      <h1 class="font-bold text-white text-3xl mb-4">
        The <span class="underline-offset-2 underline">Other</span> Guys
      </h1>
      <div
        class="w-full h-fit flex flex-col items-start md:items-center col-span-1 justify-center rounded shadow-violet-400 shadow-lg"
      >
        <div
          class="rounded-md flex flex-col gap-3 h-fit items-center justify-center p-4 md:py-8 w-full bg-gradient-to-l from-green-300 via-purple-300 to-blue-300 drop-shadow-glow-gradient"
        >
          <div
            class="flex flex-row justify-between w-full bg-white p-4 rounded"
          >
            <p>General Ticket</p>
            <p class="text-rose-400">$25.00</p>
          </div>
          <div
            class="flex flex-row justify-between w-full bg-white p-4 rounded"
          >
            <p>Processing Fee</p>
            <p class="text-rose-400">$3.00</p>
          </div>
          <div
            class="flex flex-row justify-between w-full bg-white p-4 rounded"
          >
            <p>Application Fee</p>
            <p class="text-rose-400">$2.00</p>
          </div>
          <div
            class="flex flex-row justify-between w-full bg-white p-4 rounded"
          >
            <p class="font-semibold">Subtotal</p>
            <p class="text-rose-400 underline-offset-2 underline">$30.00</p>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full h-full flex flex-col col-span-1 justify-center">
      <p class="text-violet-200">Processing Fee Baked In</p>
      <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">
        Only 7% fees <span class="italic text-violet-300 underline">total</span>
      </h1>
      <p class=" text-base max-w-[85%] md:text-lg text-neutral-200">
        While most other platforms charge a processing fee on top of their
        service fee, we bake it all into one. This means we take on the
        processing fee so you don't have to.
      </p>
    </div>
  </section>
  <section
    class="w-full h-[80vh] flex flex-col px-5 lg:px-40 sm:my-28 md:my-48 gap-20"
  >
    <div class="flex flex-col justify-center items-center w-full h-fit gap-2">
      <h1 class="text-white font-bold text-4xl">Easy Payments</h1>
      <p class=" text-base max-w-[85%] md:text-lg text-neutral-200">
        We partner with Sripe to make payments easy and secure.
      </p>
    </div>
    <div
      class="flex flex-col md:flex-row w-full h-[40vh] border rounded-lg border-gray-400 md:p-10"
    >
      <div class="w-full h-full">Place Holder</div>
      <div class="w-full h-full">Image Place Holder</div>
    </div>
  </section> -->
</div>
<footer class="bg-matteBlack text-white py-10 px-5 lg:px-40">
  <div class="flex flex-col md:flex-row md:justify-between md:items-center">
    <div class="mb-10 md:mb-0">
      <h2 class="text-2xl font-bold drop-shadow-glow">Turnt</h2>
      <p class="mt-2 text-sm">The best party platform.</p>
    </div>
    <div class="flex flex-wrap justify-center md:justify-start gap-8">
      <div class="text-center">
        <a
          href="https://app.termly.io/document/terms-of-service/1b0f8cd9-6edd-487b-8c6d-cd0f2a3193cd"
          class="text-sm hover:text-gray-300 font-semibold">Terms of Service</a
        >
      </div>
      <div class="text-center">
        <a
          href="https://app.termly.io/document/privacy-policy/c28003bf-b887-4958-a825-d8d0f4b2e87b"
          class="text-sm hover:text-gray-300 font-semibold">Privacy Policy</a
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
