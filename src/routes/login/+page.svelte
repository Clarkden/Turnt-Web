<script lang="ts">
  import { signInWithEmailAndPassword } from "firebase/auth";
  import { auth } from "../../lib/firebase";
  import { authStore } from "../../stores/authStore";

  let email: string;
  let password: string;

  const handleSubmit = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "/hub";
      })
      .catch((error) => {
        console.log(error);
      });
  };

$: if(!$authStore.isLoading && $authStore.currentUser) {
    window.location.href = "/hub";
  }
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<main class="h-screen flex flex-row items-center justify-center">
  <form
    class="flex flex-col gap-3 w-[90vw] md:w-[40vw] p-4 bg-white rounded-md"
    on:submit|preventDefault={() => handleSubmit()}
  >
    <div class="flex flex-col gap-1">
      <label> Email </label>

      <input
        type="email"
        bind:value={email}
        required
        class="bg-neutral-100 border-[1px] rounded-md p-1"
      />
    </div>
    <div class="flex flex-col gap-1">
      <label> Password </label>

      <input
        type="password"
        bind:value={password}
        required
        class="bg-neutral-100 border-[1px] rounded-md p-1"
      />
    </div>

    <button type="submit" class="mt-3 rounded-md p-2 bg-[#F94144] text-white"
      >Login</button
    >
  </form>
</main>
