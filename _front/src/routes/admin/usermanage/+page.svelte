<script>
    import { goto, invalidateAll } from "$app/navigation";
    import { page } from "$app/stores";
    import { back_api } from "$src/lib/const.js";
    import axios from "axios";
    import moment from "moment";
    import { isHashedPassword } from "$src/lib/lib.js";

    let { data } = $props();
    let users = $state([]);
    let managers = $state([]);
    let pages = $state([]);

    $effect(() => {
        users = data.user_datas;
        managers = data.manager_datas;
        console.log("여기에는?!?!");
        pages = data.pageArr;
    });
    console.log(data);

    let nowPage = $state($page.url.searchParams.get("page") || 1);
    let siteList = $state([]);
    let siteSearchKeyword = $state("");
    let selectedEstate = $state([]);
    let selectedEstateStr = $state("");
    let userId = $state(0);

    async function loadSiteListFunc(e) {
        if (e.target.getAttribute("data-id")) {
            userId = e.target.getAttribute("data-id");
        }
        selectedEstateStr = e.target.value;
        selectedEstate = selectedEstateStr.split(",");

        try {
            const res = await axios.post(
                `${back_api}/usermanage/load_site_list`,
                { site_search_keyword: siteSearchKeyword },
            );
            if (res.status == 200) {
                console.log(res);
                siteList = res.data.site_list;

                // console.log(siteList);
            }
        } catch (error) {}
    }

    async function updateUserSiteList() {
        console.log(selectedEstate);
        console.log(userId);

        const selectedEstateStr = selectedEstate.join(",");
        try {
            const res = await axios.post(
                `${back_api}/usermanage/update_user_site_list`,
                { selectedEstateStr, userId },
            );
            if (res.status == 200) {
                alert("변경이 완료되었습니다.");
                invalidateAll();
            }
        } catch (error) {}
    }
    function closeModal() {
        siteSearchKeyword = "";
        siteList = [];
        selectedEstateStr = "";
        selectedEstate = [];
    }

    async function updateUserInfo() {
        const getIdx = this.value;
        const type = this.getAttribute("data-type");
        console.log(users[getIdx]);
        console.log(this.getAttribute("data-type"));

        console.log(users[getIdx]["password"]);
        console.log(isHashedPassword(users[getIdx]["password"]));

        if (type == "password") {
            if (
                isHashedPassword(users[getIdx]["password"]) ||
                !users[getIdx]["password"]
            ) {
                alert("변경하실 패스워드를 올바르게 입력 해주세요");
                return;
            }
        }

        try {
            const res = await axios.post(
                `${back_api}/usermanage/update_user_info`,
                { user_info: users[getIdx], type },
            );
            if (res.status == 200) {
                alert("업데이트가 완료 되었습니다.");
                invalidateAll();
            }
        } catch (error) {}
    }
</script>

<dialog id="manage_estate_modal" class="modal">
    <div class="w-1/3 flex items-center gap-1">
        <input type="text" class="input-base" bind:value={siteSearchKeyword} />
        <!-- svelte-ignore event_directive_deprecated -->
        <button
            class="btn btn-info btn-sm text-white"
            value={selectedEstateStr}
            on:click={loadSiteListFunc}
        >
            검색
        </button>
        <!-- svelte-ignore event_directive_deprecated -->
        <button
            class="btn btn-accent btn-sm text-white"
            value={selectedEstateStr}
            on:click={updateUserSiteList}
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
            <!-- svelte-ignore event_directive_deprecated -->
            <button
                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                on:click={closeModal}
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

<div class="mb-4 flex items-center gap-2">
    <select class="select select-bordered select-sm">
        <option value="">전체</option>
        <option value="">분양사</option>
        <option value="">일반</option>
    </select>

    <span> 이름(닉네임) : </span>
    <input
        type="text"
        class="input input-bordered input-sm"
        placeholder="부분 입력 가능"
    />

    <span>이메일 : </span>
    <input
        type="text"
        class="input input-bordered input-sm"
        placeholder="부분 입력 가능"
    />

    <button class="btn btn-sm btn-info text-white">조회</button>
    <button class="btn btn-sm btn-error text-white">선택삭제</button>
</div>
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
        {#each managers as manager, idx}
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
                    {manager.userid}
                </td>
                <td class="in-td py-2 px-2">
                    <div class="flex justify-center items-center gap-1">
                        매니저
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
                            bind:value={managers[idx]["user_email"]}
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
                            bind:value={managers[idx]["user_phone"]}
                        />

                        <button class="btn btn-secondary btn-xs text-white">
                            변경
                        </button>
                    </div>
                </td>
                <td class="in-td py-2 px-2">
                    {#if manager.manage_estate}
                        {#each manager.manage_estate.split(",") as manage}
                            <div>
                                {manage}
                            </div>
                        {/each}
                        <!-- svelte-ignore event_directive_deprecated -->
                        <button
                            class="btn btn-primary btn-xs"
                            value={manager.manage_estate}
                            on:click={(e) => {
                                loadSiteListFunc(e);
                                manage_estate_modal.showModal();
                            }}
                        >
                            변경하기
                        </button>
                    {:else}
                        <!-- svelte-ignore event_directive_deprecated -->
                        <button
                            class="btn btn-primary btn-xs"
                            value={manager.manage_estate}
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
                    {moment(manager.created_at).format("YY-MM-DD HH:mm:ss")}
                </td>
            </tr>
        {/each}
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
                            bind:value={users[idx]["rate"]}
                        >
                            <option value="2">분양사</option>
                            <option value="1">일반</option>
                        </select>

                        <!-- svelte-ignore event_directive_deprecated -->
                        <button
                            class="btn btn-info btn-xs text-white"
                            value={idx}
                            on:click={updateUserInfo}
                        >
                            변경
                        </button>
                    </div>
                </td>
                <td class="in-td py-2 px-2">
                    <div class="flex justify-center items-center gap-1">
                        <!-- svelte-ignore event_directive_deprecated -->
                        <input
                            type="text"
                            class="input-base"
                            on:input={(e) => {
                                users[idx]["password"] = e.target.value;
                            }}
                        />

                        <!-- svelte-ignore event_directive_deprecated -->
                        <button
                            class="btn btn-primary btn-xs text-white"
                            value={idx}
                            data-type="password"
                            on:click={updateUserInfo}
                        >
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

                        <!-- svelte-ignore event_directive_deprecated -->
                        <button
                            class="btn btn-accent btn-xs text-white"
                            value={idx}
                            on:click={updateUserInfo}
                        >
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

                        <!-- svelte-ignore event_directive_deprecated -->
                        <button
                            class="btn btn-secondary btn-xs text-white"
                            value={idx}
                            on:click={updateUserInfo}
                        >
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
                        <!-- svelte-ignore event_directive_deprecated -->
                        <button
                            class="btn btn-primary btn-xs"
                            value={user.manage_estate}
                            data-id={user.id}
                            on:click={(e) => {
                                loadSiteListFunc(e);
                                manage_estate_modal.showModal();
                            }}
                        >
                            변경하기
                        </button>
                    {:else}
                        <!-- svelte-ignore event_directive_deprecated -->
                        <button
                            class="btn btn-primary btn-xs"
                            value={user.manage_estate}
                            data-id={user.id}
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
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button class="page-btn w-8 h-8 text-sm border rounded-md">
        <i class="fa fa-angle-double-left" aria-hidden="true"></i>
    </button>
    <!-- svelte-ignore a11y_consider_explicit_label -->
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
            <!-- svelte-ignore event_directive_deprecated -->
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
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button class="page-btn w-8 h-8 text-sm border rounded-md">
        <i class="fa fa-angle-right" aria-hidden="true"></i>
    </button>
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button class="page-btn w-8 h-8 text-sm border rounded-md">
        <i class="fa fa-angle-double-right" aria-hidden="true"></i>
    </button>
</div>
