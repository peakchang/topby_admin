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

    // 연결현장(site) 변경 관련!!
    let conSite = $state("");
    conSite = data.conSite; // 최초 받아온 사이트 값
    let conSiteChangeBool = $state(false); // 사이트 변경 창 열고 닫기
    let searchSite = $state(""); // 사이트 리스트 필터 input 값
    let siteList = $state([]); // 사이트 리스트!

    if (data.hyData.hy_image_list) {
        modifyImgArr = data.hyData.hy_image_list.split(",");
        // svelte-ignore state_referenced_locally
        console.log(modifyImgArr);
    }

    $effect(() => {});

    function updateImgList(e) {
        const tempImgArr = e.map((e) => e.href);
        hyData.hy_image_list = tempImgArr.join(",");
    }

    async function updateHySiteData() {
        try {
            const res = await axios.post(
                `${back_api}/minisite/update_hy_data_one`,
                hyData,
            );

            if (res.status == 200) {
                alert("수정이 완료 되었습니다.");
                invalidateAll();
            }
        } catch (error) {}
    }

    async function changeSiteFunc() {
        console.log(hyData.hy_site);
        try {
            const res = await axios.post(
                `${back_api}/minisite/change_hy_site`,
                { hy_id: hyData.hy_id, site_id: hyData.hy_site },
            );

            console.log(res.data);

            if (res.status == 200) {
                conSiteChangeBool = false;
                conSite = res.data.site_name;
                invalidateAll();
            }
        } catch (error) {}
    }

    function imageUpdate(e) {
        hyData[e.value] = e.saveUrl;
        console.log(hyData);
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
                <td class="in-td w-2/6 p-2 text-xs">
                    <div class="flex justify-between items-center mb-2">
                        {conSite}
                        <!-- svelte-ignore event_directive_deprecated -->

                        {#if conSiteChangeBool}
                            <button
                                class="btn btn-xs btn-success text-white"
                                on:click={async () => {
                                    conSiteChangeBool = false;
                                }}
                            >
                                닫기
                            </button>
                        {:else}
                            <button
                                class="btn btn-xs btn-success text-white"
                                on:click={async () => {
                                    conSiteChangeBool = true;

                                    try {
                                        const res = await axios.post(
                                            `${back_api}/minisite/get_site_list`,
                                        );
                                        if (res.status == 200) {
                                            siteList = res.data.site_list;
                                        }
                                    } catch (error) {
                                        console.error(error.message);
                                    }
                                }}
                            >
                                변경
                            </button>
                        {/if}
                    </div>

                    {#if conSiteChangeBool}
                        <div class="pt-3 text-center border-t">
                            <input
                                type="text"
                                class="border border-gray-300 py-1 px-2 rounded-md focus:outline-none focus:border-blue-500 w-36"
                                placeholder="필요하면 1차검색"
                                bind:value={searchSite}
                            />
                            <!-- svelte-ignore event_directive_deprecated -->
                            <button
                                class="btn btn-xs btn-secondary text-white"
                                on:click={async () => {
                                    try {
                                        const res = await axios.post(
                                            `${back_api}/minisite/get_site_list`,
                                            { search_site: searchSite },
                                        );
                                        if (res.status == 200) {
                                            siteList = res.data.site_list;
                                            console.log(siteList);
                                        }
                                    } catch (error) {
                                        console.error(error.message);
                                    }
                                }}
                            >
                                검색
                            </button>
                        </div>
                        <div class="mt-2 text-center">
                            <select
                                class="border border-gray-300 py-1 px-2 rounded-md focus:outline-none focus:border-blue-500 w-36"
                                bind:value={hyData.hy_site}
                            >
                                {#each siteList as site}
                                    <option value={site.sl_id}>
                                        {site.sl_site_name}
                                    </option>
                                {/each}
                            </select>
                            <!-- svelte-ignore event_directive_deprecated -->
                            <button
                                class="btn btn-xs btn-accent text-white"
                                on:click={changeSiteFunc}
                            >
                                적용
                            </button>
                        </div>
                    {/if}
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
                    SMS 컨텐츠<br />
                    (문자내용)
                </th>
                <td class="in-td">
                    <textarea
                        class="input-base text-xs"
                        cols="4"
                        bind:value={hyData.hy_sms_content}
                    ></textarea>
                </td>

                <th class="in-th text-xs bg-slate-100 border-slate-300">
                    신청 폼 위치
                </th>
                <td class="in-td">
                    <div class="flex justify-center gap-2.5">
                        <label class="flex items-center gap-1 text-sm">
                            <input
                                type="radio"
                                value="top"
                                class="radio radio-primary radio-xs"
                                bind:group={hyData.hy_form_location}
                            />
                            위쪽
                        </label>

                        <label class="flex items-center gap-1 text-sm">
                            <input
                                type="radio"
                                value="bottom"
                                class="radio radio-primary radio-xs"
                                bind:group={hyData.hy_form_location}
                            />
                            아래쪽
                        </label>

                        <label class="flex items-center gap-1 text-sm">
                            <input
                                type="radio"
                                value="both"
                                class="radio radio-primary radio-xs"
                                bind:group={hyData.hy_form_location}
                            />
                            둘다
                        </label>
                    </div>
                </td>
            </tr>

            <tr>
                <th class="in-th text-xs bg-slate-100 border-slate-300">
                    폼 위쪽 이미지
                </th>
                <td class="in-td p-2">
                    <div>
                        <OneImg
                            value={"hy_form_img"}
                            updateImg={imageUpdate}
                            imgFolder={hyData.hy_page_id}
                            imageLink={hyData.hy_form_img}
                            btnLocation={"left"}
                            btnSize={"xs"}
                        />
                    </div>
                </td>
                <th class="in-th text-xs bg-slate-100 border-slate-300">
                    우측 고정<br />
                    (폼으로 이동) <br />
                    정사각형!!
                </th>
                <td class="in-td p-2">
                    <OneImg
                        value={"hy_form_follow_img"}
                        updateImg={imageUpdate}
                        imgFolder={hyData.hy_page_id}
                        imageLink={hyData.hy_form_follow_img}
                        btnLocation={"left"}
                        btnSize={"xs"}
                    />
                </td>
            </tr>

            <tr>
                <th class="in-th text-xs bg-slate-100 border-slate-300">
                    폼 버튼 이미지
                </th>
                <td class="in-td p-2">
                    <OneImg
                        value={"hy_form_btn_img"}
                        updateImg={imageUpdate}
                        imgFolder={hyData.hy_page_id}
                        imageLink={hyData.hy_form_btn_img}
                        btnLocation={"left"}
                        btnSize={"xs"}
                    />
                </td>
                <th class="in-th text-xs bg-slate-100 border-slate-300">
                    명함 이미지
                </th>
                <td class="in-td p-2">
                    <OneImg
                        value={"hy_card_image"}
                        updateImg={imageUpdate}
                        imgFolder={hyData.hy_page_id}
                        imageLink={hyData.hy_card_image}
                        btnLocation={"left"}
                        btnSize={"xs"}
                    />
                </td>
            </tr>

            <tr>
                <th class="in-th text-xs bg-slate-100 border-slate-300">
                    하단 전화하기<br />이미지
                </th>
                <td class="in-td p-2">
                    <OneImg
                        value={"hy_ft_phone_img"}
                        updateImg={imageUpdate}
                        imgFolder={hyData.hy_page_id}
                        imageLink={hyData.hy_ft_phone_img}
                        btnLocation={"left"}
                        btnSize={"xs"}
                    />
                </td>
                <th class="in-th text-xs bg-slate-100 border-slate-300">
                    하단 SMS<br />이미지
                </th>
                <td class="in-td p-2">
                    <OneImg
                        value={"hy_ft_sms_img"}
                        updateImg={imageUpdate}
                        imgFolder={hyData.hy_page_id}
                        imageLink={hyData.hy_ft_sms_img}
                        btnLocation={"left"}
                        btnSize={"xs"}
                    />
                </td>
            </tr>

            <tr>
                <th class="in-th text-sm bg-slate-100 border-slate-300">
                    특장점
                </th>
                <td class="in-td" colspan="3">
                    <textarea
                        rows="5"
                        class="w-full p-2 border bg-gray-150 focus:outline-none focus:border-blue-500 text-xs"
                        bind:value={hyData.hy_description}
                    >
                    </textarea>
                </td>
            </tr>

            <tr>
                <th class="in-th text-xs bg-slate-100 border-slate-300">
                    푸터내용
                </th>
                <td class="in-td" colspan="3">
                    <textarea
                        class="w-full p-2 border bg-gray-150 focus:outline-none focus:border-blue-500 text-xs"
                        rows="5"
                        bind:value={hyData.hy_footer}
                    ></textarea>
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
                            value={"hy_main_image"}
                            updateImg={imageUpdate}
                            imgFolder={hyData.hy_page_id}
                            imageLink={hyData.hy_main_image}
                            btnSize={"sm"}
                        />
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="mt-5 border p-3">
        <div class="text-center font-semibold text-lg">내부 이미지 리스트!</div>
        <SortImg
            imgFolder={hyData.hy_page_id}
            imgModifyList={modifyImgArr}
            updateImg={updateImgList}
        ></SortImg>
    </div>
    <div class="my-5">
        <div class="text-center">
            <!-- if there is a button, it will close the modal -->
            <!-- svelte-ignore event_directive_deprecated -->
            <button
                type="button"
                class="btn btn-accent text-white mr-5 min-h-9 h-9"
                on:click={updateHySiteData}
            >
                업데이트
            </button>
            <!-- svelte-ignore event_directive_deprecated -->
            <button
                class="btn min-h-9 h-9"
                on:click={() => {
                    window.close();
                }}>닫기</button
            >
        </div>
    </div>
</div>
