<script lang="ts">
  import { doc, setDoc, updateDoc } from "firebase/firestore";
  import PartyEditInfo3 from "./EditForms/PartyEditInfo3.svelte";
  import { db } from "$lib/firebase";
  import { createEventDispatcher } from "svelte";
  import { stringify } from "postcss";

  const dispatch = createEventDispatcher();

  export let party: any;
  let localParty: any = party;

  const saveParty = async (e: any) => {

    const savedParty = await updateDoc(doc(db, "parties", localParty.id), {
      tickets: JSON.stringify(e.details),
    });

    dispatch("save");
  };
</script>

<PartyEditInfo3
  data={localParty}
  on:save={(e) => saveParty(e)}
  on:cancel={() => dispatch("save")}
/>
