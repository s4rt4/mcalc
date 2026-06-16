<script lang="ts">
  import type { Tool, Values } from "./types";
  import FieldInput from "./Field.svelte";
  import { fade } from "svelte/transition";

  let { tool, seed = {} }: { tool: Tool; seed?: Values } = $props();

  // Komponen di-remount tiap navigasi (key di App), jadi cukup inisialisasi sekali:
  // isi default field + default select, lalu timpa dengan seed (mis. bentuk terpilih dari search).
  function initial(): Values {
    const s: Values = {};
    for (const f of tool.fields(seed)) {
      if (f.default != null) s[f.key] = f.default;
      else if (f.type === "select" && f.options && f.options[0]?.value !== "") s[f.key] = f.options[0].value;
    }
    return { ...s, ...seed };
  }

  let values = $state<Values>(initial());

  const fields = $derived(tool.fields(values));
  const result = $derived(tool.compute(values));

  // Salin hasil ke clipboard
  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout>;
  async function copyResult() {
    if (!result.ok) return;
    try {
      await navigator.clipboard.writeText(result.main);
      copied = true;
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => (copied = false), 1200);
    } catch {
      // abaikan bila clipboard tak tersedia
    }
  }

  const copyIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
  const checkIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
</script>

<!-- Display hasil -->
<div class="relative mb-4 rounded-2xl bg-white p-4 pr-12 shadow-sm dark:bg-stone-800">
  {#if result.caption}
    <div class="text-[10px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
      {result.caption}
    </div>
  {/if}
  {#key result.main}
    <div
      in:fade={{ duration: 140 }}
      class="mt-1 break-words text-4xl font-bold tabular-nums {result.ok
        ? 'text-brand-600 dark:text-brand-400'
        : 'text-stone-300 dark:text-stone-600'}"
    >
      {result.main}
    </div>
  {/key}
  <button
    onclick={copyResult}
    disabled={!result.ok}
    aria-label="Salin hasil"
    title="Salin hasil"
    class="absolute right-3 top-3 rounded-lg p-1.5 transition hover:bg-stone-100 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-stone-700 [&_svg]:h-4 [&_svg]:w-4 {copied
      ? 'text-green-600 dark:text-green-400'
      : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'}"
  >
    {@html copied ? checkIcon : copyIcon}
  </button>
</div>

<!-- Input -->
<div class="space-y-3">
  {#each fields as field (field.key)}
    <FieldInput {field} {values} />
  {/each}
</div>
