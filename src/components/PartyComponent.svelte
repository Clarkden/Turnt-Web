<script lang="ts">
  import { DateTime } from "luxon";
  import {
    IconAlertCircle,
    IconDots,
    IconEye,
    IconPencil,
    IconShare,
    IconShare2,
  } from "@tabler/icons-svelte";
  import { clickOutside } from "$lib/clickOutSide";
  import { fade } from "svelte/transition";
  import { goto } from "$app/navigation";

  let dropDown: boolean = false;
  export let party: any;

  $: ({ name, date, id } = party);

  //   $: party = data.party;
</script>

<div
  class="w-full bg-white h-fit flex flex-row gap-3 rounded-md p-4 justify-between relative"
>
  <!-- <div class="h-14 w-14 rounded-md bg-gray-200 p-1">
    <img
      src={party.flyerPath}
      alt=""
      class="w-full h-full rounded-md object-contain"
    />
  </div> -->
  <div class="flex flex-col gap-1">
    <h1>{name}</h1>
    <h1>{DateTime.fromISO(date).toLocaleString()}</h1>
  </div>

  <div
    use:clickOutside
    on:click_outside={() => {
      dropDown = false;
    }}
  >
    <button
      on:click={() => {
        dropDown = !dropDown;
      }}
      class="w-fit h-fit"
    >
      <IconDots class="text-gray-500 hover:text-mainRed cursor-pointer" />
    </button>

    {#if dropDown}
      <!-- <div
        class="bg-mainRed rounded-sm absolute top-[42px] right-5 w-10 h-10 rotate-45 z-50"
      /> -->
      <div
        class="absolute top-10 right-0 bg-mainRed rounded-md p-2 z-10 text-whhite w-[100px] text-white"
      >
        <ul class="flex flex-col gap-3">
          <li class="flex flex-row gap-1">
            <button
              class="w-fit h-fit flex flex-row gap-2 hover:text-blue-300"
              on:click={() => goto(`/${party.id}`)}
            >
              <IconEye />
              View
            </button>
          </li>

          <li class="flex flex-row gap-1">
            <button class="w-fit h-fit flex flex-row gap-2 hover:text-blue-300">
              <IconPencil />
              Edit
            </button>
          </li>

          <li class="flex flex-row gap-1">
            <button class="w-fit h-fit flex flex-row gap-2 hover:text-blue-300">
              <IconShare2 />
              Share
            </button>
          </li>
          <li class="flex flex-row gap-1">
            <button class="w-fit h-fit flex flex-row gap-2 hover:text-blue-300">
              <IconAlertCircle />
              Cancel
            </button>
          </li>
        </ul>
      </div>
    {/if}
  </div>
</div>
