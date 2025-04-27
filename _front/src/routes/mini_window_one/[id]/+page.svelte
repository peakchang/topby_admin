<script>
    import SortImg from "$src/lib/components/SortImg.svelte";
    import SortableImgsDrag from "$src/lib/components/SortableImgsDrag.svelte";
    import OneImg from "$src/lib/components/OneImg.svelte";
    import { page } from "$app/stores";
    import axios from "axios";
    import { back_api } from "$src/lib/const.js";
    import { invalidateAll } from "$app/navigation";

    let { data } = $props();
    let hyData = $state({});
    let modifyImgArr = $state([]);

    hyData = data.hyData;
    console.log(hyData);

    if (data.hyData.hy_image_list) {
        modifyImgArr = data.hyData.hy_image_list.split(",");
    }

    $effect(() => {});
    function updateImg(e) {
        hyData.hy_image_list = e.join(",");
    }

    function cardImageUpload(e) {
        hyData.hy_card_image = e;
    }

    function mainImageUpload(e) {
        hyData.hy_main_image = e;
    }

    async function updateHySite() {
        try {
            const res = await axios.post(
                `${back_api}/minisite/update_hy_data`,
                hyData,
            );

            if (res.status == 200) {
                alert("수정이 완료 되었습니다.");
                invalidateAll();
            }
        } catch (error) {}
    }

    function updateImggo() {
        console.log("업데이뚜!");
    }
</script>

<div class="suit-font px-3 mt-3">
    <div class="pb-3 text-xl text-center font-bold">
        <span> 현장명 수정 페이지 </span>
    </div>
    <table class="w-full">
        <tbody>
            <tr>
                <th class="in-th text-xs bg-slate-100 border-slate-300 w-1/6">
                    현장명
                </th>
                <td class="in-td">
                    <input
                        type="text"
                        class="input-base text-xs"
                        bind:value={hyData.hy_title}
                    />
                </td>
                <th class="in-th text-xs bg-slate-100 border-slate-300 w-1/6">
                    연결현장
                </th>
                <td class="in-td w-2/6">
                    <input
                        type="text"
                        class="input-base text-xs"
                        bind:value={hyData.hy_site_name}
                    />
                </td>
            </tr>

            <tr>
                <th class="in-th text-xs bg-slate-100 border-slate-300">
                    전화번호
                </th>
                <td class="in-td">
                    <input
                        type="text"
                        class="input-base text-xs"
                        bind:value={hyData.hy_callnumber}
                    />
                </td>
                <th class="in-th text-xs bg-slate-100 border-slate-300">
                    문자번호
                </th>
                <td class="in-td">
                    <input
                        type="text"
                        class="input-base text-xs"
                        bind:value={hyData.hy_sms}
                    />
                </td>
            </tr>

            <tr>
                <th class="in-th text-xs bg-slate-100 border-slate-300">
                    폼 위쪽 이미지
                </th>
                <td class="in-td">
                    <input
                        type="text"
                        class="input-base text-xs"
                        bind:value={hyData.hy_callnumber}
                    />
                </td>
                <th class="in-th text-xs bg-slate-100 border-slate-300">
                    폼 위쪽 멘트
                </th>
                <td class="in-td">
                    <input
                        type="text"
                        class="input-base text-xs"
                        bind:value={hyData.hy_sms}
                    />
                </td>
            </tr>

            <tr>
                <th class="in-th text-xs bg-slate-100 border-slate-300">
                    폼 버튼 이미지
                </th>
                <td class="in-td">
                    <input
                        type="text"
                        class="input-base text-xs"
                        bind:value={hyData.hy_callnumber}
                    />
                </td>
                <th class="in-th text-xs bg-slate-100 border-slate-300">
                    명함 이미지
                </th>
                <td class="in-td">
                    <input
                        type="text"
                        class="input-base text-xs"
                        bind:value={hyData.hy_sms}
                    />
                </td>
            </tr>

            <tr>
                <th class="in-th text-xs bg-slate-100 border-slate-300">
                    하단 전화하기<br />이미지
                </th>
                <td class="in-td">
                    <input
                        type="text"
                        class="input-base text-xs"
                        bind:value={hyData.hy_callnumber}
                    />
                </td>
                <th class="in-th text-xs bg-slate-100 border-slate-300">
                    하단 SMS<br />이미지
                </th>
                <td class="in-td">
                    <input
                        type="text"
                        class="input-base text-xs"
                        bind:value={hyData.hy_sms}
                    />
                </td>
            </tr>

            <tr>
                <th class="in-th text-sm bg-slate-100 border-slate-300"
                    >특장점</th
                >
                <td class="in-td" colspan="3">
                    <textarea
                        rows="8"
                        class="w-full p-2 border bg-gray-150 focus:outline-none focus:border-blue-500 text-xs"
                        bind:value={hyData.hy_features}
                    >
                    </textarea>
                </td>
            </tr>
            <tr>
                <th class="in-th text-sm bg-slate-100 border-slate-300"
                    >추가 스크립트</th
                >
                <td class="in-td" colspan="3">
                    <textarea
                        rows="5"
                        class="w-full border bg-gray-150 focus:outline-none focus:border-blue-500 text-xs"
                        bind:value={hyData.hy_add_script}
                    >
                    </textarea>
                </td>
            </tr>

            <tr>
                <th class="in-th text-sm bg-slate-100 border-slate-300">
                    메인이미지
                </th>
                <td class="in-td" colspan="3">
                    <div>
                        <OneImg
                            updateImg={mainImageUpload}
                            imgFolder={hyData.hy_num}
                            imageLink={hyData.hy_main_image}
                        ></OneImg>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="mt-3 p-3 border rounded-md">
        <div class="mb-3 font-semibold">이미지 리스트</div>
        <SortableImgsDrag
            {updateImg}
            imgFolder={hyData.hy_num}
            btnLocation="center"
            imgModifyList={modifyImgArr}
        ></SortableImgsDrag>
    </div>

    <div class="my-5">
        <div class="text-center">
            <!-- if there is a button, it will close the modal -->
            <!-- svelte-ignore event_directive_deprecated -->
            <button
                type="button"
                class="btn btn-accent text-white mr-5 min-h-9 h-9"
                on:click={updateHySite}
            >
                업데이트
            </button>
            <button
                class="btn min-h-9 h-9"
                on:click={() => {
                    window.close();
                }}>닫기</button
            >
        </div>
    </div>

    <div>
        <SortImg imgModifyList={modifyImgArr} {updateImggo}></SortImg>
    </div>
</div>
