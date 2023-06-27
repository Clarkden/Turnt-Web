<script lang="ts">
	import EasyQrcodeReader from '@cloudparker/easy-qrcode-reader-svelte';
	import { onMount } from 'svelte';
    import {db} from '$lib/firebase';
    import {getDoc, doc, query, collection, where, onSnapshot, getDocs, deleteDoc} from 'firebase/firestore';

	let qrcodeReaderRef: EasyQrcodeReader;

	let clientWidth: number;
    let ticket: any;

	const handleQrcode = async (ev: CustomEvent) => {
		let data = ev.detail;
		if (data) {
			console.log(data);


            const unsubscribe = onSnapshot(
      query(
        collection(db, "tickets"),
        where("paymentIntentId", "==", data)
      ),
      (snapshot) => {
        const tickets: any = [];
        snapshot.forEach((doc) => {
            tickets.push({ id: doc.id, ...doc.data() });
        });
        ticket = tickets[0];
        console.log(ticket)
      }
    );
      
    

			//TODO: Handle the code and resume or close the camera
			qrcodeReaderRef.pause();

			
		}
	};

    const redeemTicket = async () => {
        try {
            await deleteDoc(doc(db, "tickets", ticket.id));
        } catch (e) {
            console.error("Error removing document: ", e);
        }
    }

	onMount(() => {
		return () => {
			qrcodeReaderRef && qrcodeReaderRef.close();
		};
	});
</script>

<div class="camera-container" bind:clientWidth>
	<EasyQrcodeReader bind:this={qrcodeReaderRef} width={clientWidth} on:qrcode={handleQrcode} />
</div>

<style>
	.camera-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>

{#if ticket}
    <button class="w-full p-2 bg-mainRed rounded mt-4 text-white" on:click={() => {
        redeemTicket();
        alert("Ticket Redeemed")
    }}>Redeem Ticket</button>
{/if}

<button on:click={() => qrcodeReaderRef.resume()} class="w-full p-2 bg-white rounded mt-4">Scan New Ticket</button>