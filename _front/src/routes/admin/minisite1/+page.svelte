<script>
    import axios from "axios";
    import { back_api } from "$lib/const.js";
    import { goto, invalidateAll } from "$app/navigation";
    import SortableImgSetFolder from "$src/lib/components/SortableImgSetFolder.svelte";

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

    async function openEditModal() {
        console.log(this);
        const getHyId = this.getAttribute("data");
        console.log(getHyId);

        try {
            const res = await axios.post(`${back_api}/minisite1/load_hy_data`, {
                getHyId,
            });
            if (res.status == 200) {
                console.log(res.data);
                hyData = res.data.hyData;
                my_modal.showModal();
            }
        } catch (error) {
            alert("에러 발생 다시 시도 해주세요.");
        }
    }

    function updateImg(sortImgArr) {
        console.log(sortImgArr);
    }
</script>

<dialog id="my_modal" class="modal">
    <div class="modal-box w-11/12 md:w-5/6 max-w-5xl">
        <form method="dialog">
            <div class="pb-3 text-base flex justify-between">
                <span> 현장명 수정 페이지 </span>

                <button>
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
        </form>
        <table class="w-full">
            <tbody>
                <tr>
                    <th class="in-th">현장명</th>
                    <td class="in-td">
                        <input
                            type="text"
                            class="input-base"
                            bind:value={hyData.hy_title}
                        />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">간략설명</th>
                    <td class="in-td">
                        <input
                            type="text"
                            class="input-base"
                            bind:value={hyData.hy_description}
                        />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">사이트명</th>
                    <td class="in-td">
                        <input
                            type="text"
                            class="input-base"
                            bind:value={hyData.hy_site_name}
                        />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">사업명</th>
                    <td class="in-td">
                        <input
                            type="text"
                            class="input-base"
                            bind:value={hyData.hy_businessname}
                        />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">분류</th>
                    <td class="in-td">
                        <input
                            type="text"
                            class="input-base"
                            bind:value={hyData.hy_type}
                        />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">규모</th>
                    <td class="in-td">
                        <input
                            type="text"
                            class="input-base"
                            bind:value={hyData.hy_scale}
                        />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">전용면적</th>
                    <td class="in-td">
                        <input
                            type="text"
                            class="input-base"
                            bind:value={hyData.hy_areasize}
                        />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">세대수</th>
                    <td class="in-td">
                        <input
                            type="text"
                            class="input-base"
                            bind:value={hyData.hy_house_number}
                        />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">공급위치</th>
                    <td class="in-td">
                        <input
                            type="text"
                            class="input-base"
                            bind:value={hyData.hy_location}
                        />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">입주예정</th>
                    <td class="in-td">
                        <input
                            type="text"
                            class="input-base"
                            bind:value={hyData.hy_scheduled}
                        />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">카카오링크</th>
                    <td class="in-td">
                        <input
                            type="text"
                            class="input-base"
                            bind:value={hyData.hy_kakao_link}
                        />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">특장점</th>
                    <td class="in-td">
                        <textarea
                            rows="12"
                            class="w-full border bg-gray-150 focus:outline-none focus:border-blue-500"
                            bind:value={hyData.hy_features}
                        >
                        </textarea>
                    </td>
                </tr>
                <tr>
                    <th class="in-th">추가 스크립트</th>
                    <td class="in-td">
                        <textarea
                            rows="8"
                            class="w-full border bg-gray-150 focus:outline-none focus:border-blue-500"
                            bind:value={hyData.hy_add_script}
                        >
                        </textarea>
                    </td>
                </tr>
                <tr>
                    <th class="in-th">전화번호</th>
                    <td class="in-td">
                        <input
                            type="text"
                            class="input-base"
                            bind:value={hyData.hy_callnumber}
                        />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">문자번호</th>
                    <td class="in-td">
                        <input
                            type="text"
                            class="input-base"
                            bind:value={hyData.hy_sms}
                        />
                    </td>
                </tr>
                <tr>
                    <th class="in-th">명함이미지</th>
                    <td class="in-td">
                        <div></div>
                    </td>
                </tr>
                <tr>
                    <th class="in-th">메인이미지</th>
                    <td class="in-td"> </td>
                </tr>
            </tbody>
        </table>
        <div class="mt-3 p-3 border rounded-md">
            <div class="mb-3 font-semibold">이미지 리스트</div>
            <SortableImgSetFolder {updateImg} btnLocation="center"></SortableImgSetFolder>
        </div>

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
                        <span
                            class="cursor-pointer"
                            data={minisiteData[idx].hy_id}
                            on:click={openEditModal}
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
