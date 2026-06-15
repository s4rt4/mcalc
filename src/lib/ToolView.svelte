<script lang="ts">
  import type { Tool, Values } from "./types";
  import FieldInput from "./Field.svelte";

  let { tool }: { tool: Tool } = $props();

  let values = $state<Values>({});
  let lastId = "";

  // Saat alat berganti: reset input & isi default untuk dropdown unit.
  $effect(() => {
    if (tool.id !== lastId) {
      lastId = tool.id;
      const seed: Values = {};
      for (const f of tool.fields({})) {
        if (f.type === "select" && f.options && f.options[0]?.value !== "") {
          seed[f.key] = f.options[0].value;
        }
      }
      values = seed;
    }
  });

  const fields = $derived(tool.fields(values));
  const result = $derived(tool.compute(values));
</script>

<!-- Display hasil -->
<div class="mb-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-stone-800">
  {#if result.caption}
    <div class="text-xs text-stone-400 dark:text-stone-500">{result.caption}</div>
  {/if}
  <div
    class="mt-1 break-words text-3xl font-semibold tabular-nums {result.ok
      ? 'text-brand-600 dark:text-brand-400'
      : 'text-stone-300 dark:text-stone-600'}"
  >
    {result.main}
  </div>
</div>

<!-- Input -->
<div class="space-y-3">
  {#each fields as field (field.key)}
    <FieldInput {field} {values} />
  {/each}
</div>
