<script lang="ts">
  import type { Field, Values } from "./types";

  let { field, values }: { field: Field; values: Values } = $props();

  function set(e: Event) {
    values[field.key] = (e.target as HTMLInputElement | HTMLSelectElement).value;
  }

  const box =
    "w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm " +
    "outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 " +
    "dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100";
</script>

<label class="block">
  <span class="mb-1 block text-xs font-medium text-stone-500 dark:text-stone-400">{field.label}</span>
  {#if field.type === "select" && field.picker}
    <div class="grid grid-cols-3 gap-2">
      {#each field.options ?? [] as o (o.value)}
        <button
          type="button"
          onclick={() => (values[field.key] = o.value)}
          class="flex flex-col items-center gap-1 rounded-xl border px-1 py-2 text-center text-[11px] leading-tight transition [&_svg]:h-6 [&_svg]:w-6 {values[
            field.key
          ] === o.value
            ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400'
            : 'border-stone-200 text-stone-500 hover:border-stone-300 dark:border-stone-700 dark:text-stone-400'}"
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
