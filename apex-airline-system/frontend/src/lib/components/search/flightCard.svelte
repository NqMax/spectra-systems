<script lang="ts">
  import { Pyramid } from "lucide-svelte";
  import FlightCardModal from "$lib/components/search/flightCardModal.svelte";
  export let flight: Flight;
  export let passengers: string | null;
  export let user: User;
  export let form;
</script>

<div class="rounded-lg my-3 grid grid-cols-2 bg-background shadow w-full">
  <!-- Left Container -->
  <div class="flex flex-col gap-y-5 p-5">
    <!-- Upper -->
    <div class="flex gap-x-3">
      <div class="flex flex-col">
        <div class="text-3xl font-bold">
          {flight.departureDate.split(" ")[1]}
        </div>
        <div class="text-muted-foreground">{flight.originCityName}</div>
      </div>
      <div class="flex flex-col justify-between w-96">
        <div class="flex items-center h-full">
          <hr class="grow" />
          <Pyramid class="mx-3 h-5 w-5" />
          <hr class="grow" />
        </div>
        <div class="text-muted-foreground self-center">No stops</div>
      </div>
      <div class="flex flex-col">
        <div class="text-3xl font-bold">{flight.arrivalDate.split(" ")[1]}</div>
        <div class="text-muted-foreground">{flight.destinationCityName}</div>
      </div>
    </div>
    <!-- Lower -->
    <FlightCardModal {flight} {form} {user}/>
  </div>
  <!-- Right Container -->
  <div class="flex p-5 gap-x-5 rounded-r-lg bg-muted">
    {#if Number(flight.touristQuantity) < Number(passengers)}
      <div
        class="flex flex-col border rounded-md p-3 w-1/2 gap-y-3 shadow bg-background"
      >
        <div class="text-sm text-muted-foreground">
          <div>Tourist</div>
          <div>{flight.touristQuantity} available</div>
        </div>
        <div class="text-3xl font-medium tracking-tighter">
          Not enough tickets available
        </div>
      </div>
    {:else}
      <a
        href={`/checkout?flightId=${flight.flightId}&passengers=${passengers}&category=economy`}
        class="flex flex-col border rounded-md p-3 w-1/2 gap-y-3 shadow bg-background"
      >
        <div class="text-sm text-muted-foreground">
          <div>Tourist</div>
          <div>{flight.touristQuantity} available</div>
        </div>
        <div class="text-3xl font-medium tracking-tighter">
          {flight.touristPrice} $
        </div>
      </a>
    {/if}
    {#if Number(flight.businessQuantity) < Number(passengers)}
      <div
        class="flex flex-col border rounded-md p-3 w-1/2 gap-y-3 shadow bg-background"
      >
        <div class="text-sm text-muted-foreground">
          <div>Business</div>
          <div>{flight.businessQuantity} available</div>
        </div>
        <div class="text-3xl font-medium tracking-tighter">
          Not enough tickets available
        </div>
      </div>
    {:else}
      <a
        href={`/checkout?flightId=${flight.flightId}&passengers=${passengers}&category=premium`}
        class="flex flex-col border rounded-md p-3 w-1/2 gap-y-3 shadow bg-background"
      >
        <div class="text-sm text-muted-foreground">
          <div>Business</div>
          <div>{flight.businessQuantity} available</div>
        </div>
        <div class="text-3xl font-medium tracking-tighter">
          {flight.businessPrice} $
        </div>
      </a>
    {/if}
  </div>
</div>
