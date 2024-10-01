import { writable } from 'svelte/store';
import type { MapData } from '$lib/types';

export const currentMap = writable<MapData | null>(null);
