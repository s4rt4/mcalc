<script lang="ts">
  import { categories, toolsByCat } from "./lib/tools";
  import ToolView from "./lib/ToolView.svelte";
  import { fade } from "svelte/transition";
  import moonIcon from "../svg/moon.svg?raw";
  import sunIcon from "../svg/sun.svg?raw";
  import chevronLeft from "../svg/chevron-left.svg?raw";
  import chevronRight from "../svg/chevron-right.svg?raw";

  let chipScroller: HTMLDivElement;

  let activeCat = $state(categories[0].id);
  let activeToolId = $state(toolsByCat(categories[0].id)[0].id);
  let dark = $state(initDark());

  // Status scroll chip row (untuk fade tepi & enable/disable panah)
  let canLeft = $state(false);
  let canRight = $state(false);

  function initDark(): boolean {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  $effect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  });

  const catTools = $derived(toolsByCat(activeCat));
  const activeTool = $derived(catTools.find((t) => t.id === activeToolId) ?? catTools[0]);

  function pickCat(id: string) {
    activeCat = id;
    activeToolId = toolsByCat(id)[0].id;
  }

  function updateScrollState() {
    const el = chipScroller;
    if (!el) return;
    canLeft = el.scrollLeft > 1;
    canRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
  }

  // Recompute saat daftar chip (kategori) berubah.
  $effect(() => {
    void catTools;
    requestAnimationFrame(updateScrollState);
  });

  // Chip aktif otomatis ter-scroll ke tengah.
  $effect(() => {
    const id = activeToolId;
    const el = chipScroller?.querySelector(`[data-tool="${id}"]`) as HTMLElement | null;
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  });

  // Wheel vertikal → scroll horizontal di chip row (ala tab strip browser).
  function wheelToHorizontal(e: WheelEvent) {
    const el = e.currentTarget as HTMLElement;
    if (e.deltaY !== 0) {
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }

  // Geser manual via tombol panah.
  function scrollChips(dir: number) {
    chipScroller?.scrollBy({ left: dir * 120, behavior: "smooth" });
  }
</script>

<div class="flex h-full flex-col bg-stone-50 text-stone-800 dark:bg-stone-900 dark:text-stone-100">
  <!-- Chip row: panah kiri/kanan mengapit chip yang bisa di-scroll -->
  <nav class="flex items-center border-b border-stone-200 px-1 py-2 dark:border-stone-700">
    <button
      onclick={() => scrollChips(-1)}
      disabled={!canLeft}
      class="shrink-0 rounded-lg p-1 text-stone-400 transition hover:bg-stone-200 hover:text-stone-600 active:scale-90 disabled:opacity-25 disabled:hover:bg-transparent dark:hover:bg-stone-700 dark:hover:text-stone-200 [&_svg]:h-5 [&_svg]:w-5"
      aria-label="Geser kiri"
    >
      {@html chevronLeft}
    </button>

    <div class="relative flex-1 overflow-hidden">
      <div
        bind:this={chipScroller}
        onscroll={updateScrollState}
        class="no-scrollbar flex gap-2 overflow-x-auto scroll-smooth px-1"
        onwheel={wheelToHorizontal}
      >
        {#each catTools as t (t.id)}
          <button
            data-tool={t.id}
            onclick={() => (activeToolId = t.id)}
            class="flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-sm transition active:scale-95 [&_svg]:h-4 [&_svg]:w-4 {t.id ===
            activeTool.id
              ? 'bg-brand-600 text-white'
              : 'bg-stone-200 text-stone-600 dark:bg-stone-700 dark:text-stone-300'}"
          >
            {@html t.icon}
            {t.label}
          </button>
        {/each}
      </div>
      <!-- Fade tepi sebagai petunjuk masih bisa di-scroll -->
      <div
        class="pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-stone-50 to-transparent transition-opacity dark:from-stone-900 {canLeft
          ? 'opacity-100'
          : 'opacity-0'}"
      ></div>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-stone-50 to-transparent transition-opacity dark:from-stone-900 {canRight
          ? 'opacity-100'
          : 'opacity-0'}"
      ></div>
    </div>

    <button
      onclick={() => scrollChips(1)}
      disabled={!canRight}
      class="shrink-0 rounded-lg p-1 text-stone-400 transition hover:bg-stone-200 hover:text-stone-600 active:scale-90 disabled:opacity-25 disabled:hover:bg-transparent dark:hover:bg-stone-700 dark:hover:text-stone-200 [&_svg]:h-5 [&_svg]:w-5"
      aria-label="Geser kanan"
    >
      {@html chevronRight}
    </button>
  </nav>

  <!-- Konten: alat aktif (transisi halus saat berganti) -->
  <main class="thin-scroll flex-1 overflow-y-auto p-4">
    {#key activeTool.id}
      <div in:fade={{ duration: 120 }}>
        <ToolView tool={activeTool} />
      </div>
    {/key}
  </main>

  <!-- Bottom bar: kategori + toggle tema -->
  <nav class="flex items-stretch border-t border-stone-200 dark:border-stone-700">
    {#each categories as c (c.id)}
      <button
        onclick={() => pickCat(c.id)}
        class="relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] transition active:scale-95 {c.id ===
        activeCat
          ? 'text-brand-600 dark:text-brand-400'
          : 'text-stone-500 dark:text-stone-400'}"
      >
        {#if c.id === activeCat}
          <span class="absolute inset-x-4 top-0 h-0.5 rounded-full bg-brand-600 dark:bg-brand-400"></span>
        {/if}
        <span class="[&_svg]:h-5 [&_svg]:w-5">{@html c.icon}</span>
        {c.label}
      </button>
    {/each}
    <button
      onclick={() => (dark = !dark)}
      class="flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] text-stone-500 transition active:scale-95 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
      aria-label="Ganti tema"
    >
      <span class="[&_svg]:h-5 [&_svg]:w-5">{@html dark ? sunIcon : moonIcon}</span>
      {dark ? "Terang" : "Gelap"}
    </button>
  </nav>
</div>
