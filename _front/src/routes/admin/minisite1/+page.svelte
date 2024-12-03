<script>
    import axios from "axios";
    import { back_api } from "$lib/const.js";
    import { goto, invalidateAll } from "$app/navigation";
    

    // let loading = true;
    let { data } = $props();
    console.log(data);

    let minisiteData = $derived(data.minisiteData);
    let pageArr = $derived(data.pageArr);
    let hyData = $state({});

    let nowPage = $state(1);

    $effect(() => {});

    function chkFunc() {
        console.log(minisiteData);
    }

    async function openEditWindow() {
        const hyId = this.getAttribute('data')
        const url = `/mini_window/${hyId}`; // 열고 싶은 페이지의 URL
        const windowName = "smallWindow"; // 새 창의 이름
        const features = "width=700,height=900,top=100,left=100"; // 창 크기와 위치 설정

        window.open(url, windowName, features);
    }
    function updateImg(sortImgArr) {
        console.log(sortImgArr);
    }
</script>

<dialog id="my_modal" class="modal">
    
</dialog>

<div class="">
    <div class="pb-5">
        <!-- svelte-ignore event_directive_deprecated -->
        <button class="btn btn-accent min-h-8 h-8 text-white">Accent</button>
        <!-- svelte-ignore event_directive_deprecated -->
        <button class="btn btn-info min-h-8 h-8 text-white" on:click={chkFunc}>
            체크체크!!
        </button>
    </div>
    <table class="w-full text-xs md:text-sm text-center">
        <thead>
            <tr>
                <th class="in-th w-14">
                    <div class="flex justify-center items-center">
                        <input
                            type="checkbox"
                            class="checkbox checkbox-xs md:checkbox-sm"
                        />
                    </div>
                </th>
                <th class="in-th"> 아이디 </th>
                <th class="in-th"> 현장명 </th>
                <th class="in-th"> 바로보기 </th>
                <th class="in-th"> 조회수 </th>
            </tr>
        </thead>
        <tbody>
            {#each minisiteData as data, idx}
                <tr>
                    <td class="in-td py-3">
                        <div class="flex justify-center items-center">
                            <input
                                type="checkbox"
                                value={minisiteData[idx].hy_id}
                                class="checkbox checkbox-xs md:checkbox-sm"
                            />
                        </div>
                    </td>
                    <td class="in-td w-1/5">
                        <input
                            type="text"
                            class="input-base"
                            bind:value={minisiteData[idx].hy_num}
                        />
                    </td>
                    <td class="in-td">
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <!-- svelte-ignore event_directive_deprecated -->
                        <span
                            class="cursor-pointer"
                            data={minisiteData[idx].hy_id}
                            on:click={openEditWindow}
                        >
                            {minisiteData[idx].hy_title}
                        </span>
                    </td>
                    <td class="in-td">
                        <button
                            class="btn btn-outline btn-accent min-h-8 h-8 text-xs"
                            >바로가기</button
                        >
                    </td>
                    <td class="in-td"> {minisiteData[idx].hy_counter} </td>
                </tr>
            {/each}
        </tbody>
    </table>

    <div class="flex">
        <div class="join mt-3 mx-auto">
            {#each pageArr as page}
                <!-- svelte-ignore event_directive_deprecated -->
                <input
                    class="join-item btn w-10 min-h-10 h-10 checked:!bg-blue-500 checked:border-none"
                    type="radio"
                    name="options"
                    checked={nowPage == page}
                    value={page}
                    aria-label={page}
                    on:click={(e) => {
                        goto(`?page=${e.target.value}`);
                        nowPage = e.target.value;
                    }}
                />
            {/each}
        </div>
    </div>
</div>
