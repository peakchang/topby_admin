<script>
    import SortableImg from "$src/lib/components/SortableImg.svelte";

    function updateImgeList(e){
        console.log('여기는 어떻게 되야?!?!?!?!');
        console.log(e);
        
        console.log(e.detail);
        
    }
</script>

<SortableImg on:updateImgeList={updateImgeList}></SortableImg>
