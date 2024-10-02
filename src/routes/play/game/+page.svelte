<script lang="ts">
    import { onMount } from 'svelte';
    import { currentMap } from '$lib/stores/mapStore';
    import { currentGameMode } from '$lib/stores/gameStore';
    import { departments } from '$lib/data/franceDepartments';
    import NameTheRegion from './NameTheRegion.svelte';
    import FindTheRegion from './FindTheRegion.svelte';
    import { page } from '$app/stores';

    let mounted = false;
    let GameModeComponent: any;

    onMount(() => {
        mounted = true;
        if (!$currentMap) {
            currentMap.set({ name: 'France', regions: departments });
        }

        const urlParams = new URLSearchParams($page.url.searchParams);
        const modeParam = urlParams.get('mode');

        if (modeParam === 'Find the Region') {
            GameModeComponent = FindTheRegion;
            currentGameMode.set({ name: 'Find the Region', description: 'Locate specific regions on the map', component: FindTheRegion });
        } else {
            GameModeComponent = NameTheRegion;
            currentGameMode.set({ name: 'Name the Region', description: 'Identify regions on the map', component: NameTheRegion });
        }

        console.log('Page component mounted, GameModeComponent:', GameModeComponent);
    });
</script>

{#if mounted}
    <svelte:component this={GameModeComponent} />
{:else}
    <p class="text-center mb-4">Loading...</p>
{/if}
