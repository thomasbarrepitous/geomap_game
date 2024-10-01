<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import type { MapData, Region } from '$lib/types';

  const dispatch = createEventDispatcher();

  export let mapData: MapData;

  const MAX_ZOOM = 5;
  const MIN_ZOOM = 0.1;
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

  function handleRegionClick(regionName: string) {
    console.log(`Clicked on ${regionName}`);
    // Add your click handling logic here
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

    currentZoom.set(newZoom);
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
    zoom(0.8, svgElement.clientWidth / 2, svgElement.clientHeight / 2);
  }

  export function zoomOut() {
    zoom(1.25, svgElement.clientWidth / 2, svgElement.clientHeight / 2);
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

<div class="relative w-full h-[76.67vh] rounded-lg shadow-md overflow-hidden">
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
        fill={hoveredRegion === region.id ? '#3B82F6' : '#E5E7EB'}
        stroke={hoveredRegion === region.id ? '#1E40AF' : '#9CA3AF'}
        stroke-width="0.5"
        on:click={() => handleRegionClick(region.name)}
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
</div>