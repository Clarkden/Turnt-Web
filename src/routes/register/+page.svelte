<script lang="ts">
  import { createUserWithEmailAndPassword } from "firebase/auth";
  import { auth } from "../../lib/firebase";
  import { authStore } from "../../stores/authStore";

  let email: string;
  let password: string;
  let passwordConfirm: string;

  const handleSubmit = async () => {
    if (password !== passwordConfirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      window.location.href = "/hub/find";
    } catch (error) {
      console.log(error);
    }
  };
</script>

<svelte:head>
  <title>Register</title>
</svelte:head>

<main class="h-screen flex flex-row items-center justify-center">
  <form
    class="flex flex-col gap-3 w-[40vw] border-[1px] p-4"
    on:submit|preventDefault={() => handleSubmit()}
  >
    <label>
      Email
      <input type="email" bind:value={email} required class="border-[1px]" />
    </label>

    <label>
      Password
      <input
        type="password"
        bind:value={password}
        required
        class="border-[1px]"
      />
    </label>

    <label>
      Confirm Password
      <input
        type="password"
        bind:value={passwordConfirm}
        required
        class="border-[1px]"
      />
    </label>

    <button type="submit">Register</button>
  </form>
</main>
