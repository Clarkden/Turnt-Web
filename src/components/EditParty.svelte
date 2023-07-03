<script lang="ts">
  export let party: any;

  $: localParty = party;

  let navSelection: string = "info";
</script>

{#if localParty}
  <section class="h-full w-full">
    <div class="flex flex-col md:flex-row gap-4 h-full">
      <div
        class="flex flex-col w-fit gap-3 items-start md:border-r-2 md:pr-5 md:min-h-full"
      >
        <button
          on:click={() => {
            navSelection = "info";
          }}
          class={`
            ${
              navSelection === "info" ? "bg-[#F94144] text-white" : "text-black"
            }
            px-4 py-2 rounded-sm
        `}>Info</button
        >
        <button
          class={`
            ${
              navSelection === "tickets"
                ? "bg-[#F94144] text-white"
                : "text-black"
            }
            px-4 py-2 rounded-sm
        `}
          on:click={() => {
            navSelection = "tickets";
          }}>Tickets</button
        >
      </div>
      <div class="w-full">
        {#if navSelection === "info"}
          <div class="flex flex-col gap-4">
            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex flex-col gap-2 w-full">
                <label for="name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  class="w-full p-2 border border-gray-300 rounded-md"
                  bind:value={localParty.name}
                />
              </div>
              <div class="flex flex-col gap-2 w-full">
                <label for="date">Date</label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  class="w-full p-2 border border-gray-300 rounded-md"
                  bind:value={localParty.date}
                />
              </div>
            </div>
            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex flex-col gap-2 w-full">
                <label for="startTime">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  id="startTime"
                  class="w-full p-2 border border-gray-300 rounded-md"
                  bind:value={localParty.startTime}
                />
              </div>
              <div class="flex flex-col gap-2 w-full">
                <label for="endTime">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  id="endTime"
                  class="w-full p-2 border border-gray-300 rounded-md"
                  bind:value={localParty.endTime}
                />
              </div>
            </div>
            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex flex-col gap-2 w-full">
                <label for="privateAddress">Private Address</label>
                <div class="flex flex-row gap-1">
                  <div
                    on:mousedown={() =>
                      (localParty.privateAddress = !localParty.privateAddress)}
                    class={`w-14 h-8  rounded-full flex flex-row overflow-hidden items-center p-1 transition-all cursor-pointer ${
                      localParty.privateAddress
                        ? "justify-end bg-green-400"
                        : "justify-start bg-matteBlack"
                    }`}
                  >
                    <div class="w-6 h-6 rounded-full bg-white" />
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-2 w-full">
                <label for="address">Address</label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  class="w-full p-2
                border border-gray-300 rounded-md"
                  bind:value={localParty.address}
                />
              </div>
            </div>
          </div>
        {:else if navSelection === "tickets"}
          {#each JSON.parse(localParty.tickets) as ticket (ticket.id)}
            <div class="flex flex-col gap-4">
              <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-col gap-2 w-full">
                  <label for="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    class="w-full p-2 border border-gray-300 rounded-md"
                    bind:value={ticket.name}
                  />
                </div>
                <div class="flex flex-col gap-2 w-full">
                  <label for="price">Price</label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    class="w-full p-2 border border-gray-300 rounded-md"
                    bind:value={ticket.price}
                  />
                </div>
              </div>
              <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-col gap-2 w-full">
                  <label for="description">Description</label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    class="w-full p-2 border border-gray-300 rounded-md"
                    bind:value={ticket.description}
                  />
                </div>
                <div class="flex flex-col gap-2 w-full">
                  <label for="amount">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    class="w-full p-2 border border-gray-300 rounded-md"
                    bind:value={ticket.quantity}
                  />
                </div>
              </div>
              <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-col gap-2 w-full">
                  <label for="startTime">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    id="startTime"
                    class="w-full p-2 border border-gray-300 rounded-md"
                    bind:value={ticket.startTime}
                  />
                </div>
                <div class="flex flex-col gap-2 w-full">
                  <label for="endTime">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    id="endTime"
                    class="w-full p-2 border border-gray-300 rounded-md"
                    bind:value={ticket.endTime}
                  />
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </section>
{/if}
