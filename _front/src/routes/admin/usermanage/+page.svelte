<script>
    import { goto, invalidateAll } from "$app/navigation";
    import { page } from "$app/stores";
    import { back_api } from "$src/lib/const.js";
    import axios from "axios";
    import moment from "moment";
    import { tick } from "svelte";

    
    let { data } = $props();

    $effect(() => {
        console.log('여기에는?!?!');
    })
    console.log(data);

    let users = $state(data.user_datas);
    console.log(users);
    
    let pages = $state(data.pageArr);
    let nowPage = $state($page.url.searchParams.get("page") || 1);
    let siteList = $state([]);
    let siteSearchKeyword = $state("");
    let selectedEstate = $state([]);

    async function loadSiteListFunc(e) {
        try {
            const res = await axios.post(
                `${back_api}/usermanage/load_site_list`,
                { site_search_keyword: siteSearchKeyword },
            );
            if (res.status == 200) {
                console.log(res);
                siteList = res.data.site_list;
                selectedEstate = e.target.value.split(",");

                // console.log(siteList);
            }
        } catch (error) {}
    }

    async function updateSiteList() {
        console.log(selectedEstate);
    }
</script>

<dialog id="manage_estate_modal" class="modal">
    <div class="w-1/3 flex items-center gap-1">
        <input type="text" class="input-base" bind:value={siteSearchKeyword} />
        <button
            class="btn btn-info btn-sm text-white"
            on:click={loadSiteListFunc}
        >
            검색
        </button>
        <button
            class="btn btn-accent btn-sm text-white"
            on:click={updateSiteList}
        >
            적용
        </button>
        <form method="dialog">
            <div class="flex gap-1">
                <button class="btn btn-error btn-sm text-white"> 닫기 </button>
            </div>
        </form>
    </div>
    <div class="modal-box w-11/12 max-w-5xl relative max-h-[500px]">
        <form method="dialog">
            <button
                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
                ✕
            </button>
        </form>

        <div class="grid grid-cols-4 gap-1 mt-5">
            {#each siteList as site, idx}
                <label
                    ><div class="border p-2 flex items-center gap-2">
                        <input
                            type="checkbox"
                            class="checkbox checkbox-xs md:checkbox-sm"
                            bind:group={selectedEstate}
                            value={site.sl_site_name}
                        />
                        {site.sl_site_name}
                    </div>
                </label>
            {/each}
        </div>
    </div>
</dialog>

<table class="w-full text-xs md:text-sm text-center">
    <thead>
        <tr>
            <th class="in-th w-12">
                <div class="flex items-center justify-center">
                    <input
                        type="checkbox"
                        class="checkbox checkbox-xs md:checkbox-sm"
                    />
                </div>
            </th>
            <th class="in-th">아이디</th>
            <th class="in-th">등급</th>
            <th class="in-th">비번변경</th>
            <th class="in-th">이메일</th>
            <th class="in-th">휴대폰</th>
            <th class="in-th">관리현장</th>
            <th class="in-th">가입일</th>
        </tr>
    </thead>
    <tbody>
        {#each users as user, idx}
            <tr>
                <td class="in-td py-2">
                    <div class="flex items-center justify-center">
                        <input
                            type="checkbox"
                            class="checkbox checkbox-xs md:checkbox-sm"
                        />
                    </div>
                </td>
                <td class="in-td py-2 px-2">
                    {user.userid}
                </td>
                <td class="in-td py-2 px-2">
                    <div class="flex justify-center items-center gap-1">
                        <select
                            class="select select-bordered select-sm w-full max-w-xs"
                        >
                            <option selected={user.rate == 2}>분양사</option>
                            <option selected={user.rate == 1}>일반</option>
                        </select>

                        <button class="btn btn-info btn-xs text-white">
                            변경
                        </button>
                    </div>
                </td>
                <td class="in-td py-2 px-2">
                    <div class="flex justify-center items-center gap-1">
                        <input type="text" class="input-base" />

                        <button class="btn btn-primary btn-xs text-white">
                            변경
                        </button>
                    </div>
                </td>
                <td class="in-td py-2 px-2">
                    <div class="flex justify-center items-center gap-1">
                        <input
                            type="text"
                            class="input-base text-xs"
                            bind:value={users[idx]["user_email"]}
                        />

                        <button class="btn btn-accent btn-xs text-white">
                            변경
                        </button>
                    </div>
                </td>
                <td class="in-td py-2 px-2">
                    <div class="flex justify-center items-center gap-1">
                        <input
                            type="text"
                            class="input-base text-xs"
                            bind:value={users[idx]["user_phone"]}
                        />

                        <button class="btn btn-secondary btn-xs text-white">
                            변경
                        </button>
                    </div>
                </td>
                <td class="in-td py-2 px-2">
                    {#if user.manage_estate}
                        {#each user.manage_estate.split(",") as manage}
                            <div>
                                {manage}
                            </div>
                        {/each}
                        <button
                            class="btn btn-primary btn-xs"
                            value={user.manage_estate}
                            on:click={(e) => {
                                loadSiteListFunc(e);
                                manage_estate_modal.showModal();
                            }}
                        >
                            변경하기
                        </button>
                    {:else}
                        <button
                            class="btn btn-primary btn-xs"
                            value={user.manage_estate}
                            on:click={(e) => {
                                loadSiteListFunc(e);
                                manage_estate_modal.showModal();
                            }}
                        >
                            추가하기
                        </button>
                    {/if}
                </td>

                <td class="in-td py-2 px-2">
                    {moment(user.created_at).format("YY-MM-DD HH:mm:ss")}
                </td>
            </tr>
        {/each}
    </tbody>
</table>

<div class="flex justify-center items-center my-5 gap-1">
    <button class="page-btn w-8 h-8 text-sm border rounded-md">
        <i class="fa fa-angle-double-left" aria-hidden="true"></i>
    </button>
    <button class="page-btn w-8 h-8 text-sm border rounded-md">
        <i class="fa fa-angle-left" aria-hidden="true"></i>
    </button>
    {#each pages as page}
        {#if nowPage == page}
            <button
                class="page-btn w-8 h-8 text-sm border rounded-md border-orange-400 bg-orange-400 text-white"
            >
                {page}
            </button>
        {:else}
            <button
                class="page-btn w-8 h-8 text-sm border rounded-md"
                value={page}
                on:click={(e) => {
                        goto(`?page=${e.target.value}`);
                        nowPage = e.target.value;
                    }}
            >
                {page}
            </button>
        {/if}
    {/each}
    <button class="page-btn w-8 h-8 text-sm border rounded-md">
        <i class="fa fa-angle-right" aria-hidden="true"></i>
    </button>
    <button class="page-btn w-8 h-8 text-sm border rounded-md">
        <i class="fa fa-angle-double-right" aria-hidden="true"></i>
    </button>
</div>
