<script lang="ts">
  import { doc, setDoc, updateDoc } from "firebase/firestore";
  import PartyEditInfo3 from "./EditForms/EditTickets.svelte";
  import { db } from "$lib/firebase";
  import { createEventDispatcher } from "svelte";
  import { stringify } from "postcss";

  const dispatch = createEventDispatcher();

  export let party: any;
  let localParty: any = party;

  const saveTickets = async (e: any) => {

    if(!e.detail) return;

    const savedTickets = await updateDoc(doc(db, "parties", localParty.id), {
      tickets: JSON.stringify(e.detail.tickets),
    });

    dispatch("save");
  };
</script>

<PartyEditInfo3
  data={localParty}
  on:completion={(e) => saveTickets(e)}
  on:cancel={() => dispatch("save")}
/>
