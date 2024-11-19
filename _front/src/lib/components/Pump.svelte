<script>
    // import { createEventDispatcher } from "svelte";
    // const dispatch = createEventDispatcher();

    let { inflate, deflate } = $props();
    let power = $state([15,13,24]);
</script>

<button onclick={() => inflate(power)}> inflate </button>
<button onclick={() => deflate(power)}> deflate </button>
<button onclick={() => power--}>-</button>
Pump power: {power}
<button onclick={() => power++}>+</button>
