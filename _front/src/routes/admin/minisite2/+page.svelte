<script>
    import SortableImg from "$src/lib/components/SortableImg.svelte";

    
    function updateImg(e) {
        console.log("여기는 어떻게 되야?!?!?!?!");
        console.log(e);

        console.log(e.detail);
    }

    let size = $state(15);
    let burst = $state(false);

    function onAnswerNo(e) {
        alert(e.detail);
    }

    function onAnswerYes(e) {
        alert(e);
    }
</script>

<SortableImg {updateImg} maxImgCount={9999} imgModifyList={[]}
></SortableImg>
