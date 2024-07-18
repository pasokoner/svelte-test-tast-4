<script lang="ts">
	import DataTableSkeleton from "./data-table-skeleton.svelte";
	import DataTable from "./data-table.svelte";

	let { data } = $props();
</script>

<main class="space-y-[40px] py-20 md:space-y-[60px]">
	<div class="container max-w-[1440px] space-y-4 md:space-y-6 xl:px-28">
		<h1 class="text-center text-3xl font-semibold md:text-6xl">
			Feature-Rich Data Table in SvelteKit 5
		</h1>
		<div>
			<p class="text-[#475467 text-center lg:px-52 xl:px-72">
				A data table with sorting, checkbox selection, search, filtering, pagination, and
				loading/error states using SvelteKit 5 and Tailwind CSS.
			</p>
		</div>
	</div>

	{#await data.users}
		<div class="container max-w-[1440px] px-4 lg:px-28">
			<DataTableSkeleton />
		</div>
	{:then users}
		<div class="container max-w-[1440px] px-4 lg:px-28">
			<DataTable data={users} />
		</div>
	{:catch error}
		<div class="container max-w-[1440px] px-4 text-center text-2xl lg:px-28">
			Error loading users {error.message}
		</div>
	{/await}
</main>
