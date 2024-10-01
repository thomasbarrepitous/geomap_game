import { writable } from 'svelte/store';
import type { GameMode } from '$lib/types';

export const currentGameMode = writable<GameMode | null>(null);
export const score = writable(0);
export const gameTime = writable(0);
