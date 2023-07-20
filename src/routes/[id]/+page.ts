import { db } from "$lib/firebase";
import { getDoc, doc } from "firebase/firestore";
import type { PageLoadEvent } from "./$types";

export const load = async ({ params }: PageLoadEvent) => {
  try {
    const party = await getDoc(doc(db, "parties", params.id));

    if (!party.exists()) {
      return {
        status: 404,
      };
    }


    return {
      id: party.id,
      name: party.data().name,
      description: party.data().description,
      flyerPath: party.data().flyerPath,
    };
  } catch (err) {
    console.log(err)
    return {
      status: 500,
    };
  }
};
