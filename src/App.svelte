<script lang="ts">
  import { categories, toolsByCat } from "./lib/tools";
  import ToolView from "./lib/ToolView.svelte";
  import moonIcon from "../svg/moon.svg?raw";
  import sunIcon from "../svg/sun.svg?raw";

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
</script>

<div class="flex h-full flex-col bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
  <!-- Chip row + toggle tema -->
  <nav class="flex items-center gap-2 border-b border-slate-200 px-2 py-2 dark:border-slate-700">
    <div class="no-scrollbar flex flex-1 gap-2 overflow-x-auto scroll-smooth" onwheel={wheelToHorizontal}>
      {#each catTools as t (t.id)}
        <button
          onclick={() => (activeToolId = t.id)}
          class="flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-sm transition [&_svg]:h-4 [&_svg]:w-4 {t.id === activeTool.id
            ? 'bg-indigo-600 text-white'
            : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}"
        >
          {@html t.icon}
          {t.label}
        </button>
      {/each}
    </div>
    <button
      onclick={() => (dark = !dark)}
      class="shrink-0 rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 [&_svg]:h-5 [&_svg]:w-5"
      aria-label="Ganti tema"
    >
      {@html dark ? sunIcon : moonIcon}
    </button>
  </nav>

  <!-- Konten: alat aktif -->
  <main class="thin-scroll flex-1 overflow-y-auto p-4">
    <ToolView tool={activeTool} />
  </main>

  <!-- Bottom tabs: kategori -->
  <nav class="grid grid-cols-4 border-t border-slate-200 dark:border-slate-700">
    {#each categories as c (c.id)}
      <button
        onclick={() => pickCat(c.id)}
        class="flex flex-col items-center gap-0.5 py-2 text-[11px] transition {c.id === activeCat
          ? 'text-indigo-600 dark:text-indigo-400'
          : 'text-slate-500 dark:text-slate-400'}"
      >
        <span class="[&_svg]:h-5 [&_svg]:w-5">{@html c.icon}</span>
        {c.label}
      </button>
    {/each}
  </nav>
</div>
