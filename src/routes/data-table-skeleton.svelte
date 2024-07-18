<script lang="ts">
	import { Skeleton } from "$lib/components/ui/skeleton";
	import * as Table from "$lib/components/ui/table/index.js";
</script>

<div class="rounded-lg border">
	<div class="flex flex-col gap-y-4 px-6 py-7 md:flex-row md:items-center md:justify-between">
		<Skeleton class="h-8 w-12" />

		<div class="flex items-center gap-x-2">
			<Skeleton class="h-6 flex-1 md:min-w-[400px]" />

			<Skeleton class="h-6 w-20" />
		</div>
	</div>

	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>
					<Skeleton class="h-6 w-24" />
				</Table.Head>
				<Table.Head>
					<Skeleton class="h-6 w-24" />
				</Table.Head>
				<Table.Head>
					<Skeleton class="h-6 w-24" />
				</Table.Head>
				<Table.Head>
					<Skeleton class="h-6 w-24" />
				</Table.Head>
				<Table.Head>
					<Skeleton class="h-6 w-24" />
				</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each Array(5) as _, i (i)}
				<Table.Row>
					<Table.Cell class="font-medium"><Skeleton class="h-6 w-24" /></Table.Cell>
					<Table.Cell class="font-medium"><Skeleton class="h-6 w-24" /></Table.Cell>
					<Table.Cell class="font-medium"><Skeleton class="h-6 w-24" /></Table.Cell>
					<Table.Cell class="font-medium"><Skeleton class="h-6 w-24" /></Table.Cell>
					<Table.Cell class="font-medium"><Skeleton class="h-6 w-24" /></Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	<div class="flex items-center justify-end space-x-4 p-4">
		<div class="flex flex-1 items-center gap-x-2 text-sm text-muted-foreground">
			<Skeleton class="h-4 w-6" />
			<Skeleton class="size-4" />
			<Skeleton class="h-4 w-6" />
		</div>

		<Skeleton class="h-6 w-[70px]" />
		<Skeleton class="h-6 w-[70px]" />
	</div>
</div>
