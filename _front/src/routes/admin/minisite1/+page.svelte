<script>
    import { goto, invalidateAll } from "$app/navigation";

    // let loading = true;
    let { data } = $props();
    console.log(data);

    let minisiteData = $derived(data.minisiteData);
    let pageArr = $derived(data.pageArr);

    let nowPage = $state(1);

    $effect(() => {});

    function chkFunc() {
        console.log(minisiteData);
    }

    function openEditModal() {
        my_modal.showModal();
    }
</script>

<dialog id="my_modal" class="modal">
    <div class="modal-box w-11/12 md:w-5/6 max-w-5xl">
        <table class="w-full">
            <tbody>
                <tr>
                    <th class="in-th">현장명</th>
                    <td class="in-td">
                        <input type="text" class="input-base" />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">간략설명</th>
                    <td class="in-td">
                        <input type="text" class="input-base" />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">사이트명</th>
                    <td class="in-td">
                        <input type="text" class="input-base" />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">사업명</th>
                    <td class="in-td">
                        <input type="text" class="input-base" />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">분류</th>
                    <td class="in-td">
                        <input type="text" class="input-base" />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">규모</th>
                    <td class="in-td">
                        <input type="text" class="input-base" />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">전용면적</th>
                    <td class="in-td">
                        <input type="text" class="input-base" />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">세대수</th>
                    <td class="in-td">
                        <input type="text" class="input-base" />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">공급위치</th>
                    <td class="in-td">
                        <input type="text" class="input-base" />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">입주예정</th>
                    <td class="in-td">
                        <input type="text" class="input-base" />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">카카오링크</th>
                    <td class="in-td">
                        <input type="text" class="input-base" />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">특장점</th>
                    <td class="in-td">
                        <input type="text" class="input-base" />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">추가 스크립트</th>
                    <td class="in-td">
                        <input type="text" class="input-base" />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">전화번호</th>
                    <td class="in-td">
                        <input type="text" class="input-base" />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">문자번호</th>
                    <td class="in-td">
                        <input type="text" class="input-base" />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">명함이미지</th>
                    <td class="in-td">
                        <input type="text" class="input-base" />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">메인이미지</th>
                    <td class="in-td">
                        <input type="text" class="input-base" />
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="mt-5">
            <form method="dialog">
                <div class="text-right">
                    <!-- if there is a button, it will close the modal -->
                    <!-- svelte-ignore event_directive_deprecated -->
                    <button
                        type="button"
                        class="btn btn-accent text-white mr-5"
                        on:click={() => {
                            alert("업데이트가 완료 되었습니다.");
                        }}
                    >
                        업데이트
                    </button>
                    <button class="btn">닫기</button>
                </div>
            </form>
        </div>
    </div>
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
                        <span class="cursor-pointer" on:click={openEditModal}>
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
