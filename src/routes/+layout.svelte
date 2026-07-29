<script lang="ts">
  import { onMount } from "svelte";
  import { scrollY } from "$lib/stores/scrollStore";
  import { initPostHog } from "$lib/posthog";

  onMount(() => {
    initPostHog();
  });
</script>

<body
  on:scroll={() => {
    // scrollY.set(window.scrollY);
    // console.log(window.scrollY);
  }}
  class="h-screen w-screen overflow-y-scroll bg-matteBlack font-poppins relative flex flex-col"
>
  <slot />
</body>
