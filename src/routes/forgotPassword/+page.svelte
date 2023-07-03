<script lang="ts">
  import { sendPasswordResetEmail } from "firebase/auth";
  import { auth } from "../../lib/firebase";

  let email: string;
  let error: string;
  let message: string;

  const handleSubmit = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        message = "Reset password link has been sent to your email.";
      })
      .catch((err) => {
        if (err.code === "auth/user-not-found") {
          error = "No user found with this email.";
        } else if (err.code === "auth/invalid-email") {
          error = "Invalid email.";
        } else {
          error = err.message;
        }
      });
  };
</script>

<svelte:head>
  <title>Forgot Password</title>
</svelte:head>

<section class="bg-mainRed">
  <div
    class="flex flex-col items-center justify-center px-6 md:py-8 mx-auto h-screen lg:py-0"
  >
    <div
      class="w-full bg-matteBlack rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0"
    >
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1
          class="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white"
        >
          Reset your password
        </h1>
        <form
          class="space-y-4 md:space-y-6"
          on:submit|preventDefault={handleSubmit}
        >
          <div>
            {#if error}
              <p class="text-red-500 text-sm font-medium mb-2">{error}</p>
            {/if}
            {#if message}
              <p class="text-green-500 text-sm font-medium mb-2">{message}</p>
            {/if}
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-white"
            >
              Your email
            </label>
            <input
              required
              bind:value={email}
              type="email"
              name="email"
              id="email"
              class="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5"
              placeholder="name@company.com"
            />
          </div>
          <button
            type="submit"
            class="w-full text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Send password reset email
          </button>
          <p class="text-sm font-light text-white">
            Remember your password? <a
              href="/login"
              class="font-medium text-white hover:underline">Sign in</a
            >
          </p>
        </form>
      </div>
    </div>
  </div>
</section>
