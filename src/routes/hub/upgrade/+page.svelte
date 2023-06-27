<script lang="ts">
  import { db } from "../../../lib/firebase";
  import { getDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
  import { authStore, memberType } from "../../../stores/authStore";

  const upgrade = () => {
    const user = $authStore.currentUser;
    if (user) {
      getDoc(doc(db, "pro-members", user["uid"])).then((document) => {
        if (document.exists()) {
          memberType.update((curr: any) => {
            return { ...curr, isPro: true };
          });
        } else {
          setDoc(doc(db, "pro-members", user["uid"]), {
            uid: user["uid"],
            email: user["email"],
          });
          memberType.update((curr: any) => {
            return { ...curr, isPro: true };
          });
        }
      });
    }
  };

  const downgrade = () => {
    const user = $authStore.currentUser;
    if (user) {
      getDoc(doc(db, "pro-members", user["uid"])).then((document) => {
        try{
            if (document.exists()) {
          deleteDoc(doc(db, "pro-members", user["uid"]));
          
        }
        } catch(error){
            console.log(error)
        } finally {
            memberType.update((curr: any) => {
            return { ...curr, isPro: false };
          });
        }
       
      });
    }
  };
</script>

<div class="text-white">
  <button
    on:click={() => {
      upgrade();
    }}>Upgrade</button
  >
  <button
    on:click={() => {
      downgrade();
    }}>Downgrade</button
  >
  <h1>{$memberType.isPro}</h1>
</div>
