<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { currentMap } from '$lib/stores/mapStore';
  import { currentGameMode } from '$lib/stores/gameStore';
  import type { MapData, GameMode } from '$lib/types';

  let maps: MapData[] = [
    { name: 'France', regions: [] },
    // Add more maps as needed
  ];

  let gameModes: GameMode[] = [
    { name: 'Name the Region', description: 'Identify regions on the map' },
    { name: 'Find the Region', description: 'Locate specific regions on the map' },
    // Add more game modes as needed
  ];

  let selectedMap: MapData | null = null;
  let selectedGameMode: GameMode | null = null;

  function selectMap(map: MapData) {
    selectedMap = map;
    currentMap.set(map);
  }

  function selectGameMode(mode: GameMode) {
    selectedGameMode = mode;
    currentGameMode.set(mode);
  }

  function startGame() {
    if (selectedMap && selectedGameMode) {
      // Navigate to the game page
      window.location.href = '/play/game';
    }
  }

  onMount(() => {
    // Reset selections when the component mounts
    currentMap.set(null);
    currentGameMode.set(null);
  });
</script>

<div class="container mx-auto px-4 py-12 max-w-4xl">
  <h1 in:fade={{ duration: 300, delay: 150 }} class="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">Choose Your Adventure</h1>

  <div in:fly={{ y: 20, duration: 300, delay: 300 }} class="mb-12">
    <h2 class="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-200">Select a Map</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each maps as map}
        <button
          class="p-6 border-2 rounded-xl text-left transition-all duration-300 transform hover:scale-105 {selectedMap === map ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}"
          on:click={() => selectMap(map)}
        >
          <h3 class="text-xl font-semibold mb-2 {selectedMap === map ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}">{map.name}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Explore the regions of {map.name}</p>
        </button>
      {/each}
    </div>
  </div>

  <div in:fly={{ y: 20, duration: 300, delay: 450 }} class="mb-12">
    <h2 class="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-200">Select a Game Mode</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {#each gameModes as mode}
        <button
          class="p-6 border-2 rounded-xl text-left transition-all duration-300 transform hover:scale-105 {selectedGameMode === mode ? 'border-green-500 bg-green-50 dark:bg-green-900' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}"
          on:click={() => selectGameMode(mode)}
        >
          <h3 class="text-xl font-semibold mb-2 {selectedGameMode === mode ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'}">{mode.name}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">{mode.description}</p>
        </button>
      {/each}
    </div>
  </div>

  <div in:fade={{ duration: 300, delay: 600 }} class="text-center">
    <button
      class="px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      on:click={startGame}
      disabled={!selectedMap || !selectedGameMode}
    >
      Start Your Journey
    </button>
  </div>
</div>
