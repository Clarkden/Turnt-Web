<script lang="ts">
  import { createUserWithEmailAndPassword } from "firebase/auth";
  import { loginWithGoogle, signup } from "$lib/stores/auth";
  // import { authStore, authHandlers } from "../../stores/authStore";
  import { IconBrandGoogle } from "@tabler/icons-svelte";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import { user } from "$lib/stores/auth";

  let email: string;
  let password: string;
  let passwordConfirm: string;
  let error: string = "";

  const handleSubmit = async () => {
    if (password !== passwordConfirm) {
      error = "Passwords do not match";
      return;
    }

    signup(email, password).then((success) => {
      if (success) {
        window.location.href = "/dashboard";
      } else {
        error = "Invalid email or password";
      }
    });
  };

  $: if (browser) {
    if ($user) {
      window.location.href = "/dashboard";
    }
  }
</script>

<svelte:head>
  <title>Register</title>
</svelte:head>
<section class="bg-mainRed">
  <div
    class="flex flex-col items-center justify-center px-6 md:py-8 mx-auto h-screen lg:py-0"
  >
    <!-- <a
      href="#"
      class="flex items-center mb-6 text-2xl font-semibold text-white"
    >
      <img
        class="w-8 h-8 mr-2"
        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
        alt="logo"
      />
      Turnt
    </a> -->
    <div
      class="w-full bg-matteBlack rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0"
    >
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1
          class="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white"
        >
          Sign Up
        </h1>
        <button
          class="border-[1px] border-gray-500 hover:bg-gray-500 rounded w-full py-2 text-white flex flex-row items-center justify-center"
          on:click={() => {
            loginWithGoogle();
          }}
        >
          <IconBrandGoogle class="w-5 h-5 mr-2" stroke={3} />
          Sign in with Google</button
        >
        <div class="w-full h-[1px] bg-gray-500" />
        <form
          class="space-y-4 md:space-y-6"
          on:submit|preventDefault={() => {
            handleSubmit();
          }}
        >
          {#if error}
            <div class="text-red-500">{error}</div>
          {/if}
          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-white"
              >Your email</label
            >
            <input
              required
              autocomplete="email"
              bind:value={email}
              type="email"
              name="email"
              id="email"
              class="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5"
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label
              for="password"
              class="block mb-2 text-sm font-medium text-white">Password</label
            >
            <input
              required
              autocomplete="new-password"
              bind:value={password}
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              class="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5"
            />
          </div>
          <div>
            <label
              for="confirmPassword"
              class="block mb-2 text-sm font-medium text-white"
              >Confirm Password</label
            >
            <input
              required
              autocomplete="new-password"
              bind:value={passwordConfirm}
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="••••••••"
              class="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5"
            />
          </div>
          <!-- <div class="flex items-center justify-between">
            <a
              href="/forgotPassword"
              class="text-sm font-medium text-white hover:underline"
              >Forgot password?</a
            >
          </div> -->
          <button
            type="submit"
            class="w-full text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >Sign up</button
          >
          <p class="text-sm font-light text-white">
            Already have an account? <a
              href="/login"
              class="font-medium text-white hover:underline">Login</a
            >
          </p>
        </form>
      </div>
    </div>
  </div>
</section>
