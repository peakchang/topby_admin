<script>
    import SortableImgSetFolder from "$src/lib/components/SortableImgSetFolder.svelte";
    import OneImg from "$src/lib/components/OneImg.svelte";

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

<div class="mb-10">
    <SortableImgSetFolder
        {updateImg}
        imgFolder="test_folder"
        maxImgCount={9999}
        imgModifyList={[]}
    ></SortableImgSetFolder>
</div>

<OneImg {updateImg}></OneImg>
