<script lang="ts">
  import { scrollY } from "$lib/stores/scrollStore";
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
