<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import type { MapData, Region } from '$lib/types';

  const dispatch = createEventDispatcher();

  export let mapData: MapData;
  export let currentRegion: string | null = null;

  const MAX_ZOOM = 1.5;
  const MIN_ZOOM = 0.5;
  let currentZoom = tweened(1, {
    duration: 300,
    easing: cubicOut
  });

  let hoveredRegion: string | null = null;
  let tooltipContent: string = '';
  let tooltipX: number = 0;
  let tooltipY: number = 0;

  let svgElement: SVGSVGElement;
  let viewBox = { x: 0, y: 0, width: 600, height: 650 };
  let isPanning = false;
  let startPoint = { x: 0, y: 0 };

  function handleRegionClick(region: Region) {
    console.log(`Clicked on ${region.name}`);
    dispatch('regionClick', region);
  }

  function handleRegionHover(event: MouseEvent, region: Region) {
    hoveredRegion = region.id;
    tooltipContent = region.name;
    tooltipX = event.clientX + 10;
    tooltipY = event.clientY + 10;
  }

  function handleRegionLeave() {
    hoveredRegion = null;
    tooltipContent = '';
  }

  function handleKeydown(event: KeyboardEvent, regionName: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      handleRegionClick(regionName);
    }
  }

  function handleWheel(event: WheelEvent) {
    event.preventDefault();
    const zoomFactor = event.deltaY > 0 ? 1.1 : 0.9;
    zoom(zoomFactor, event.clientX, event.clientY);
  }

  function zoom(factor: number, clientX: number, clientY: number) {
    const newZoom = $currentZoom * factor;
    if (newZoom < MIN_ZOOM || newZoom > MAX_ZOOM) return;

    const svgRect = svgElement.getBoundingClientRect();
    const mouseX = clientX - svgRect.left;
    const mouseY = clientY - svgRect.top;

    const viewBoxX = viewBox.x + (mouseX / svgRect.width) * viewBox.width;
    const viewBoxY = viewBox.y + (mouseY / svgRect.height) * viewBox.height;

    const newWidth = viewBox.width * factor;
    const newHeight = viewBox.height * factor;

    viewBox = {
      x: viewBoxX - (mouseX / svgRect.width) * newWidth,
      y: viewBoxY - (mouseY / svgRect.height) * newHeight,
      width: newWidth,
      height: newHeight
    };

    currentZoom.set(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom)));
  }

  function handleMouseDown(event: MouseEvent) {
    isPanning = true;
    startPoint = { x: event.clientX, y: event.clientY };
  }

  function handleMouseMove(event: MouseEvent) {
    if (!isPanning) return;
    const dx = (event.clientX - startPoint.x) * viewBox.width / svgElement.clientWidth;
    const dy = (event.clientY - startPoint.y) * viewBox.height / svgElement.clientHeight;
    viewBox.x -= dx;
    viewBox.y -= dy;
    startPoint = { x: event.clientX, y: event.clientY };
  }

  function handleMouseUp() {
    isPanning = false;
  }

  export function zoomIn() {
    zoom(0.9, svgElement.clientWidth / 2, svgElement.clientHeight / 2);
  }

  export function zoomOut() {
    zoom(1.1, svgElement.clientWidth / 2, svgElement.clientHeight / 2);
  }

  export function resetZoom() {
    viewBox = { x: 0, y: 0, width: 600, height: 650 };
    currentZoom.set(1);
  }

  onMount(() => {
    svgElement.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      svgElement.removeEventListener('wheel', handleWheel);
    };
  });
</script>

<div class="relative w-full h-[66.67vh] rounded-lg shadow-md overflow-hidden">
  <svg
    bind:this={svgElement}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="{viewBox.x} {viewBox.y} {viewBox.width} {viewBox.height}"
    on:mousedown={handleMouseDown}
    on:mousemove={handleMouseMove}
    on:mouseup={handleMouseUp}
    on:mouseleave={handleMouseUp}
    class="w-full h-full block cursor-move"
  >
    {#each mapData.regions as region}
      <path
        id={region.id}
        d={region.d}
        class="transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        fill={currentRegion === region.id ? '#3B82F6' : hoveredRegion === region.id ? '#93C5FD' : '#E5E7EB'}
        stroke={currentRegion === region.id ? '#1E40AF' : hoveredRegion === region.id ? '#3B82F6' : '#9CA3AF'}
        stroke-width={currentRegion === region.id ? '1.5' : '0.5'}
        on:click={() => handleRegionClick(region)}
        on:keydown={(e) => handleKeydown(e, region.name)}
        on:mouseenter={(e) => handleRegionHover(e, region)}
        on:mouseleave={handleRegionLeave}
        tabindex="0"
        role="button"
        aria-label={region.name}
      />
    {/each}
  </svg>
  {#if tooltipContent}
    <div class="fixed bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 p-2 rounded-md text-sm pointer-events-none z-50 shadow-lg border border-gray-700 dark:border-gray-300" style="left: {tooltipX}px; top: {tooltipY}px;">
      <span class="font-medium">{tooltipContent}</span>
    </div>
  {/if}
  <div class="absolute bottom-4 right-4 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded-md shadow-md border border-gray-300 dark:border-gray-700">
    Zoom: {$currentZoom.toFixed(2)}x
  </div>
  <slot name="controls" />
  <div class="absolute top-4 left-4 flex flex-col space-y-2">
    <button
      on:click={zoomIn}
      class="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 rounded-md shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label="Zoom in"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>
    <button
      on:click={zoomOut}
      class="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 rounded-md shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label="Zoom out"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12H6" />
      </svg>
    </button>
    <button
      on:click={resetZoom}
      class="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 rounded-md shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label="Reset zoom"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    </button>
  </div>
</div>