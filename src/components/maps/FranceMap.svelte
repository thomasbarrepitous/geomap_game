<script lang="ts">
  import MapBase from './MapBase.svelte';
  import { departments } from '$lib/data/franceDepartments';
  import type { MapData } from '$lib/types';

  const mapData: MapData = {
    regions: departments
  };

  let mapBaseComponent: MapBase;

  function handleZoomIn() {
    mapBaseComponent.zoomIn();
  }

  function handleZoomOut() {
    mapBaseComponent.zoomOut();
  }

  function handleResetZoom() {
    mapBaseComponent.resetZoom();
  }
</script>

<h1 class="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">Interactive Map of France</h1>

<MapBase {mapData} bind:this={mapBaseComponent}>
  <div slot="controls" class="absolute top-4 left-4 flex flex-col space-y-2">
    <button
      on:click={handleZoomIn}
      class="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 rounded-md shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label="Zoom in"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>
    <button
      on:click={handleZoomOut}
      class="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 rounded-md shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label="Zoom out"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12H6" />
      </svg>
    </button>
    <button
      on:click={handleResetZoom}
      class="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 rounded-md shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label="Reset zoom"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    </button>
  </div>
</MapBase>