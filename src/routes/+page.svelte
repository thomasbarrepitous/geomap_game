<script lang="ts">
  import { onMount } from 'svelte';
  import FranceMap from '../components/maps/FranceMap.svelte';
  import { currentMap } from '$lib/stores/mapStore';
  import { departments } from '$lib/data/franceDepartments';

  let mounted = false;

  onMount(() => {
    mounted = true;
    currentMap.set({ regions: departments });
    console.log('Page component mounted');
  });
</script>

{#if mounted}
  <FranceMap />
{:else}
  <p class="text-center mb-4">Loading...</p>
{/if}
