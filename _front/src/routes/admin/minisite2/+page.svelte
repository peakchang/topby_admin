<script>
    import SortableImgSetFolder from "$src/lib/components/SortableImgSetFolder.svelte";
    import OneImg from "$src/lib/components/OneImg.svelte";

    let imgArr = $state([]);

    function updateImg(e) {
        console.log("여기는 어떻게 되야?!?!?!?!");
        console.log(e);
        imgArr = e;
    }

    function updateOneImg(e) {
        console.log(e);
    }
</script>

<div class="mb-10">
    <SortableImgSetFolder
        {updateImg}
        imgFolder="chk_folder"
        maxImgCount={9999}
        imgModifyList={[]}
    ></SortableImgSetFolder>
</div>

<OneImg updateImg={updateOneImg} imgFolder="chk_folder"></OneImg>

<div>
    <button
        on:click={() => {
            console.log(imgArr);
        }}
    >
        gogogogo
    </button>
</div>
