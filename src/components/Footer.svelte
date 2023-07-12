<script>

  import { IconBrandDiscord } from "@tabler/icons-svelte";

</script>
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
