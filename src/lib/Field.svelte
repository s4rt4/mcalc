<script lang="ts">
  import type { Field, Values } from "./types";

  let { field, values }: { field: Field; values: Values } = $props();

  function set(e: Event) {
    values[field.key] = (e.target as HTMLInputElement | HTMLSelectElement).value;
  }

  const box =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm " +
    "outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 " +
    "dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";
</script>

<label class="block">
  <span class="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{field.label}</span>
  {#if field.type === "select" && field.picker}
    <div class="grid grid-cols-3 gap-2">
      {#each field.options ?? [] as o (o.value)}
        <button
          type="button"
          onclick={() => (values[field.key] = o.value)}
          class="flex flex-col items-center gap-1 rounded-xl border px-1 py-2 text-center text-[11px] leading-tight transition [&_svg]:h-6 [&_svg]:w-6 {values[
            field.key
          ] === o.value
            ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
            : 'border-slate-200 text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400'}"
        >
          {#if o.icon}{@html o.icon}{/if}
          <span>{o.label}</span>
        </button>
      {/each}
    </div>
  {:else if field.type === "select"}
    <select class={box} value={values[field.key] ?? ""} onchange={set}>
      {#each field.options ?? [] as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </select>
  {:else}
    <input
      class={box}
      type="text"
      inputmode="decimal"
      placeholder={field.placeholder ?? ""}
      value={values[field.key] ?? ""}
      oninput={set}
    />
  {/if}
</label>
