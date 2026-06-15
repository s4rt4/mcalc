<script lang="ts">
  import { categories, toolsByCat } from "./lib/tools";
  import ToolView from "./lib/ToolView.svelte";
  import moonIcon from "../svg/moon.svg?raw";
  import sunIcon from "../svg/sun.svg?raw";
  import chevronLeft from "../svg/chevron-left.svg?raw";
  import chevronRight from "../svg/chevron-right.svg?raw";

  let chipScroller: HTMLDivElement;

  let activeCat = $state(categories[0].id);
  let activeToolId = $state(toolsByCat(categories[0].id)[0].id);
  let dark = $state(initDark());

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
      class="shrink-0 rounded-lg p-1 text-stone-400 hover:bg-stone-200 hover:text-stone-600 dark:hover:bg-stone-700 dark:hover:text-stone-200 [&_svg]:h-5 [&_svg]:w-5"
      aria-label="Geser kiri"
    >
      {@html chevronLeft}
    </button>
    <div
      bind:this={chipScroller}
      class="no-scrollbar flex flex-1 gap-2 overflow-x-auto scroll-smooth px-1"
      onwheel={wheelToHorizontal}
    >
      {#each catTools as t (t.id)}
        <button
          onclick={() => (activeToolId = t.id)}
          class="flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-sm transition [&_svg]:h-4 [&_svg]:w-4 {t.id === activeTool.id
            ? 'bg-brand-600 text-white'
            : 'bg-stone-200 text-stone-600 dark:bg-stone-700 dark:text-stone-300'}"
        >
          {@html t.icon}
          {t.label}
        </button>
      {/each}
    </div>
    <button
      onclick={() => scrollChips(1)}
      class="shrink-0 rounded-lg p-1 text-stone-400 hover:bg-stone-200 hover:text-stone-600 dark:hover:bg-stone-700 dark:hover:text-stone-200 [&_svg]:h-5 [&_svg]:w-5"
      aria-label="Geser kanan"
    >
      {@html chevronRight}
    </button>
  </nav>

  <!-- Konten: alat aktif -->
  <main class="thin-scroll flex-1 overflow-y-auto p-4">
    <ToolView tool={activeTool} />
  </main>

  <!-- Bottom bar: kategori + toggle tema -->
  <nav class="flex items-stretch border-t border-stone-200 dark:border-stone-700">
    {#each categories as c (c.id)}
      <button
        onclick={() => pickCat(c.id)}
        class="flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] transition {c.id === activeCat
          ? 'text-brand-600 dark:text-brand-400'
          : 'text-stone-500 dark:text-stone-400'}"
      >
        <span class="[&_svg]:h-5 [&_svg]:w-5">{@html c.icon}</span>
        {c.label}
      </button>
    {/each}
    <button
      onclick={() => (dark = !dark)}
      class="flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] text-stone-500 transition hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
      aria-label="Ganti tema"
    >
      <span class="[&_svg]:h-5 [&_svg]:w-5">{@html dark ? sunIcon : moonIcon}</span>
      {dark ? "Terang" : "Gelap"}
    </button>
  </nav>
</div>
