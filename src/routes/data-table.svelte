<script lang="ts">
	import { createTable, Render, Subscribe, createRender } from "svelte-headless-table";
	import { writable } from "svelte/store";
	import * as Table from "$lib/components/ui/table";
	import * as Select from "$lib/components/ui/select";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";

	import DataTableActions from "./data-table-actions.svelte";
	import DataTableCheckbox from "./data-table-checkbox.svelte";

	import {
		addPagination,
		addSortBy,
		addTableFilter,
		addSelectedRows
	} from "svelte-headless-table/plugins";

	import { ArrowUpDownIcon, ListFilterIcon } from "lucide-svelte/icons";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

	import { type User } from "$lib/typings";

	type Props = {
		data: User[];
	};

	let { data }: Props = $props();

	const users = writable(data);

	let locations = $derived(
		data.map(({ location }) => ({
			country: location.country,
			city: location.city
		}))
	);

	let dropdownOpen = $state(false);
	let selectedCity: { label: string; value: string } | undefined = $state(undefined);
	let selectedCountry: { label: string; value: string } | undefined = $state(undefined);

	const table = createTable(users, {
		page: addPagination(),
		sort: addSortBy(),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		}),
		select: addSelectedRows()
	});

	const columns = table.createColumns([
		table.column({
			accessor: ({ id }) => id.value,
			id: "id",
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(DataTableCheckbox, {
					checked: allPageRowsSelected
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);

				return createRender(DataTableCheckbox, {
					checked: isSelected
				});
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ name }) => (name.title + " " + name.first + " " + name.last).trim(),
			header: "Name",
			id: "name"
		}),
		table.column({
			accessor: "email",
			header: "Email",
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ login }) => login.username,
			id: "username",
			header: "Username",
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ location }) => location.country,
			id: "country",
			header: "Country",
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ location }) => location.city,
			id: "location",
			header: "Location",
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ id }) => id,
			header: "",
			cell: ({ value }) => {
				return createRender(DataTableActions, { id: value });
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, flatColumns, rows } =
		table.createViewModel(columns);

	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
	const { filterValue } = pluginStates.filter;
	const { selectedDataIds } = pluginStates.select;
	const SORTABLE_COLUMN_IDS = ["username", "email", "name"];

	$effect(() => {
		$users = data.filter(({ location }) => {
			if (!selectedCity) return true;

			return location.city === selectedCity.value;
		});
	});

	$effect(() => {
		$users = data.filter(({ location }) => {
			if (!selectedCountry) return true;

			return location.country === selectedCountry.value;
		});
	});
</script>

<div class="rounded-lg border">
	<div class="flex flex-col gap-y-4 px-6 py-7 md:flex-row md:items-center md:justify-between">
		<div class="text-xl font-semibold">Users</div>

		<div class="flex items-center gap-x-2">
			<Input class="md:min-w-[400px]" placeholder="Search" type="text" bind:value={$filterValue} />

			<DropdownMenu.Root bind:open={dropdownOpen}>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="outline" class="ml-auto" builders={[builder]}>
						<ListFilterIcon class="mr-2 size-4" /> Filter
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="p-2">
					<div class="flex flex-col gap-y-2">
						<Select.Root
							selected={selectedCity}
							onSelectedChange={(v) => {
								v && (selectedCity = { label: v.value, value: v.value });
							}}
						>
							<Select.Trigger class="w-[180px]">
								<Select.Value placeholder="Select City" />
							</Select.Trigger>
							<Select.Content class="max-h-[300px] overflow-y-auto">
								{#each locations as { city }}
									<Select.Item value={city}>{city}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>

						<Select.Root
							selected={selectedCountry}
							onSelectedChange={(v) => {
								v && (selectedCountry = { label: v.value, value: v.value });
							}}
						>
							<Select.Trigger class="w-[180px]">
								<Select.Value placeholder="Select Country" />
							</Select.Trigger>
							<Select.Content class="max-h-[300px] overflow-y-auto">
								{#each locations as { country }}
									<Select.Item value={country}>{country}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>

						<Button
							class="w-[180px]"
							variant="ghost"
							onclick={() => {
								selectedCity = undefined;
								selectedCountry = undefined;
								dropdownOpen = false;
							}}
						>
							Reset
						</Button>
					</div>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>

	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
								<Table.Head
									{...attrs}
									class="bg-[#F9FAFB] px-6 text-xs font-medium [&:has([role=checkbox])]:pl-3"
								>
									{#if SORTABLE_COLUMN_IDS.includes(cell.id)}
										<Button
											variant="ghost"
											on:click={props.sort.toggle}
											class="w-full justify-start py-3 text-xs font-medium"
										>
											<Render of={cell.render()} />
											<ArrowUpDownIcon class={"ml-2 h-4 w-4"} />
										</Button>
									{:else}
										<Render of={cell.render()} />
									{/if}
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<Table.Row {...rowAttrs} data-state={$selectedDataIds[row.id] && "selected"}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<Table.Cell {...attrs} class="[&:has([role=checkbox])]:pl-3">
									<Render of={cell.render()} />
								</Table.Cell>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>
	<div class="flex items-center justify-end space-x-4 p-4">
		<div class="flex-1 text-sm text-muted-foreground">
			{Object.keys($selectedDataIds).length} of{" "}
			{$rows.length} row(s) selected.
		</div>

		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = $pageIndex - 1)}
			disabled={!$hasPreviousPage}>Previous</Button
		>
		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
		>
	</div>
</div>
