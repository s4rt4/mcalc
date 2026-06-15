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

  const checkBadge =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
</script>

<label class="block">
  <span class="mb-1 block text-xs font-medium text-stone-500 dark:text-stone-400">{field.label}</span>
  {#if field.type === "select" && field.picker}
    <div class="grid grid-cols-3 gap-2">
      {#each field.options ?? [] as o (o.value)}
        <button
          type="button"
          onclick={() => (values[field.key] = o.value)}
          class="relative flex flex-col items-center gap-1 rounded-xl border px-1 py-2 text-center text-[11px] leading-tight transition active:scale-95 [&_svg]:h-6 [&_svg]:w-6 {values[
            field.key
          ] === o.value
            ? 'border-brand-500 bg-brand-50 text-brand-600 ring-2 ring-brand-500/30 dark:bg-brand-500/10 dark:text-brand-400'
            : 'border-stone-200 text-stone-500 hover:border-stone-300 dark:border-stone-700 dark:text-stone-400'}"
        >
          {#if values[field.key] === o.value}
            <span
              class="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-white [&_svg]:h-2.5 [&_svg]:w-2.5"
            >
              {@html checkBadge}
            </span>
          {/if}
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
