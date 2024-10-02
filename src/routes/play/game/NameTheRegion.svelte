<script lang="ts">
  import { onMount } from 'svelte';
  import { currentMap } from '$lib/stores/mapStore';
  import { score, gameTime } from '$lib/stores/gameStore';
  import type { Region } from '$lib/types';
  import MapBase from '../../../components/maps/MapBase.svelte';

  let regions: Region[] = [];
  let currentRegion: Region | null = null;
  let userInput = '';
  let feedback = '';
  let gameStarted = false;
  let gameEnded = false;
  let timer: NodeJS.Timeout;

  onMount(() => {
    if ($currentMap) {
      regions = [...$currentMap.regions];
      startGame();
    }
  });

  function startGame() {
    gameStarted = true;
    score.set(0);
    gameTime.set(60);
    selectNextRegion();
    startTimer();
  }

  function selectNextRegion() {
    if (regions.length > 0) {
      const randomIndex = Math.floor(Math.random() * regions.length);
      currentRegion = regions[randomIndex];
      regions.splice(randomIndex, 1);
    } else {
      endGame();
    }
  }

  function checkAnswer() {
    if (currentRegion) {
      if (userInput.toLowerCase() === currentRegion.name.toLowerCase()) {
        feedback = 'Correct!';
        score.update(n => n + 1);
      } else {
        feedback = `Incorrect. The correct answer was ${currentRegion.name}.`;
      }
      userInput = '';
      setTimeout(() => {
        feedback = '';
        selectNextRegion();
      }, 1500);
    }
  }

  function startTimer() {
    timer = setInterval(() => {
      gameTime.update(t => {
        if (t <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function endGame() {
    gameEnded = true;
    clearInterval(timer);
  }

  function restartGame() {
    if ($currentMap) {
      regions = [...$currentMap.regions];
      gameEnded = false;
      startGame();
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6 text-center">Name the Region</h1>

  {#if gameStarted && !gameEnded}
    <div class="mb-6 text-center">
      <p class="text-xl">Time remaining: {$gameTime} seconds</p>
      <p class="text-xl">Score: {$score}</p>
    </div>

    <div class="flex justify-center mb-6">
      <MapBase mapData={$currentMap} />
    </div>

    <div class="text-center mb-6">
      <input
        type="text"
        bind:value={userInput}
        placeholder="Enter region name"
        class="px-4 py-2 border rounded-md mr-2"
      />
      <button
        on:click={checkAnswer}
        class="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Submit
      </button>
    </div>

    {#if feedback}
      <p class="text-center text-xl font-semibold">{feedback}</p>
    {/if}
  {:else if gameEnded}
    <div class="text-center">
      <h2 class="text-2xl font-bold mb-4">Game Over!</h2>
      <p class="text-xl mb-4">Your final score: {$score}</p>
      <button
        on:click={restartGame}
        class="px-4 py-2 bg-green-500 text-white rounded-md"
      >
        Play Again
      </button>
    </div>
  {/if}
</div>
