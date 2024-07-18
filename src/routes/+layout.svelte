<script>
	import "../app.css";

	let { children } = $props();
</script>

<svelte:head>
	<title>Svelte Test Task 4</title>
</svelte:head>

{@render children()}
