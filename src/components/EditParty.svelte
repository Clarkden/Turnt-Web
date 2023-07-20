<script lang="ts">
  import { doc, setDoc, updateDoc } from "firebase/firestore";
  import PartyEditInfo2 from "./EditForms/EditParty.svelte";
  import PartyEditInfo3 from "./EditForms/EditTickets.svelte";
  import { db } from "$lib/firebase";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let party: any;
  let localParty: any = party;

  const saveParty = async (e: any) => {
    const savedParty = await updateDoc(doc(db, "parties", localParty.id), {
      ...e.detail,
    });

    dispatch("save");
  };
</script>

<PartyEditInfo2
  data={localParty}
  on:completion={(e) => saveParty(e)}
  on:cancel={() => dispatch("save")}
/>
