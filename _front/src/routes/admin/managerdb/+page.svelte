<script>
    import moment from "moment";
    import { page } from "$app/stores";
    import { setParams } from "$src/lib/lib.js";
    import { formatPhoneNumber } from "$src/lib/lib.js";
    import axios from "axios";
    import { backIn } from "svelte/easing";
    import { back_api } from "$src/lib/const.js";
    import { user_info } from "$src/lib/store.js";
    import { invalidateAll } from "$app/navigation";
    let { data } = $props();

    console.log(data);

    let datas = $state([]);
    let pages = $state([]);
    let reverseIdxArr = $state([]);

    // 쿼리 파라미터 연관 변수
    let pageCount = $state("30");
    let nowPage = $state(1);
    let startDate = $state(moment().startOf("month").format("YYYY-MM-DD"));
    let endDate = $state(moment().format("YYYY-MM-DD"));
    let filterSite = $state("");
    let setSite = $state("base");
    let setStatus = $state("base");

    let allPageCount = $state(0);

    //
    let site_list = $state([]);
    let status_list = $state([]);

    // 고객 정보 모음
    let customerInfo = $state({});

    let add_memo_content = $state("");

    $effect(() => {
        datas = data.datas;
        pages = data.pageArr;
        nowPage = $page.url.searchParams.get("page") || 1;
        reverseIdxArr = data.reverseIdxArr;
        site_list = data.site_list;
        status_list = data.statusArr;
        allPageCount = data.allPage;
    });

    function searchFunc(e) {
        console.log("이쪽으로는 안와?!?!");
        e.preventDefault();

        let paramOption = {};
        if (startDate) {
            paramOption["sd"] = startDate;
        }
        if (endDate) {
            paramOption["ed"] = endDate;
        }
        if (pageCount) {
            paramOption["pagecount"] = pageCount;
        }
        if (filterSite) {
            paramOption["filtersite"] = filterSite;
        }
        if (setSite != "base") {
            paramOption["setsite"] = setSite;
        }
        if (setStatus != "base") {
            paramOption["setstatus"] = setStatus;
        }

        setParams(paramOption, true);
    }

    function downloadExcel() {
        console.log(pageCount);
    }

    async function openScheduleManageModal(load = false, id = 0) {
        let customer_id = 0;
        if (load == true) {
            customer_id = id;
        } else {
            customer_id = this.value;
        }
        console.log(customer_id);

        try {
            const res = await axios.post(
                `${back_api}/alldb/load_customer_info`,
                { customer_id },
            );

            if (res.status == 200) {
                customerInfo = res.data.customer_info;
                if (
                    customerInfo.memos &&
                    customerInfo.managers &&
                    customerInfo.createds
                ) {
                    console.log("들어는 와?!");

                    const memos = customerInfo.memos.split("||");
                    const managers = customerInfo.managers.split(",");
                    const createds = customerInfo.createds.split(",");

                    customerInfo.memo_list = memos.map((_, index) => {
                        const reverseIndex = memos.length - 1 - index;
                        return {
                            memo: memos[reverseIndex],
                            manager: managers[reverseIndex],
                            created: createds[reverseIndex],
                        };
                    });
                }

                console.log(customerInfo);
            }
        } catch (error) {}

        schedule_manage_modal.showModal();
    }

    async function addMemo() {
        console.log(this.value);

        if (!add_memo_content) {
            alert("메모 내용을 입력하세요.");
            return;
        }
        const af_id = this.value;

        try {
            const res = await axios.post(`${back_api}/alldb/add_memo_content`, {
                af_id,
                add_memo_content,
                manager: $user_info.name,
            });

            if (res.status == 200) {
                console.log("일단 1차");

                try {
                    const res = await axios.post(
                        `${back_api}/alldb/load_customer_info`,
                        { customer_id: af_id },
                    );

                    console.log(res);

                    if (res.status == 200) {
                        customerInfo = res.data.customer_info;
                        if (
                            customerInfo.memos &&
                            customerInfo.managers &&
                            customerInfo.createds
                        ) {
                            console.log("들어는 와?!");

                            const memos = customerInfo.memos.split("||");
                            const managers = customerInfo.managers.split(",");
                            const createds = customerInfo.createds.split(",");

                            customerInfo.memo_list = memos.map((_, index) => {
                                const reverseIndex = memos.length - 1 - index;
                                return {
                                    memo: memos[reverseIndex],
                                    manager: managers[reverseIndex],
                                    created: createds[reverseIndex],
                                };
                            });
                        }

                        console.log(customerInfo);
                    }
                } catch (err) {
                    console.error(err.message);
                }
            }
        } catch (error) {}
    }

    function movePage() {
        console.log(nowPage);

        console.log(this.value);

        console.log(allPageCount);

        let setPage = 0;
        if (this.value == "prev") {
            setPage = nowPage - 1;
            if (setPage < 1) {
                alert("처음 페이지 입니다.");
                return;
            }
        } else if (this.value == "next") {
            setPage = Number(nowPage) + 1;
            if (setPage > allPageCount) {
                alert("마지막 페이지 입니다.");
                return;
            }
        } else if (this.value == "first_page") {
            setPage = 1;
        } else if (this.value == "last_page") {
            setPage = allPageCount;
        } else {
            setPage = parseInt(this.value);
        }

        console.log(setPage);

        setParams({ page: setPage });
    }
</script>

<dialog id="schedule_manage_modal" class="modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Hello!</h3>

        <div class="">
            <table class="w-full">
                <tbody>
                    <tr>
                        <th class="in-th bg-blue-100">현장</th>
                        <td class="in-td p-2"> {customerInfo.af_form_name} </td>
                    </tr>
                    <tr>
                        <th class="in-th bg-blue-100">이름</th>
                        <td class="in-td p-2"> {customerInfo.af_mb_name} </td>
                    </tr>
                    <tr>
                        <th class="in-th bg-blue-100">전화번호</th>
                        <td class="in-td p-2"> {customerInfo.af_mb_phone} </td>
                    </tr>
                    <tr>
                        <th class="in-th bg-blue-100">상태</th>
                        <td class="in-td p-2">
                            <select class="select select-sm select-bordered">
                                {#each status_list as status}
                                    <option value={status}>{status}</option>
                                {/each}
                            </select>
                            <button class="btn btn-secondary btn-sm">
                                변경
                            </button>
                            <!-- {customerInfo.af_mb_status}  -->
                        </td>
                    </tr>
                    <tr>
                        <th class="in-th bg-blue-100">접수시간</th>
                        <td class="in-td p-2">
                            {moment(customerInfo.af_created_at).format(
                                "YY-MM-DD HH:mm:ss",
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="mt-3">
                <div class="flex items-center gap-1">
                    <input
                        type="text"
                        class="input-base"
                        bind:value={add_memo_content}
                    />
                    <button
                        class="btn btn-primary btn-sm"
                        value={customerInfo.af_id}
                        on:click={addMemo}
                    >
                        메모 추가
                    </button>
                </div>
                <ul class="border-t border-r border-l mt-3 h-96 overflow-auto">
                    {#each customerInfo.memo_list as memo}
                        <li class="border-b p-2">
                            <div
                                class="flex justify-between gap-2 items-center"
                            >
                                <span>{memo.memo}</span>
                                <button class="btn btn-info btn-xs text-white"
                                    >스케줄 추가</button
                                >
                            </div>
                            <div class="text-right text-xs mt-0.5">
                                {memo.created}
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
        <div class="modal-action">
            <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn">Close</button>
            </form>
        </div>
    </div>
</dialog>

<div class="mb-4">
    <form on:submit={searchFunc}>
        <div class="flex flex-wrap items-center gap-2">
            <input
                type="date"
                class="border px-2 py-1 rounded-md"
                bind:value={startDate}
            />
            <span class="">~</span>
            <input
                type="date"
                class="border px-2 py-1 rounded-md"
                bind:value={endDate}
            />

            <select
                class="select select-sm select-bordered"
                bind:value={setSite}
            >
                <option value="base">현장 선택</option>
                {#each site_list as site}
                    <option value={site.sl_site_name}
                        >{site.sl_site_name}</option
                    >
                {/each}
            </select>

            <select
                class="select select-sm select-bordered"
                bind:value={setStatus}
            >
                <option value="base">상태선택</option>
                {#each status_list as status}
                    <option value={status}>{status}</option>
                {/each}
            </select>

            <select
                class="select select-sm select-bordered"
                bind:value={pageCount}
            >
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>

            <button class="btn btn-neutral btn-sm"> 검색 </button>

            <button
                type="button"
                class="btn btn-info btn-sm text-white"
                on:click={downloadExcel}
            >
                DB 엑셀 다운
            </button>
        </div>
    </form>
</div>
<table class="w-full">
    <thead>
        <tr class="text-center">
            <th class="in-th"> 접수번호 </th>
            <th class="in-th"> 고객명 </th>
            <th class="in-th"> 전화번호 </th>
            <th class="in-th"> 현장 </th>
            <th class="in-th"> 메모 / 상태 </th>
            <th class="in-th"> 상태 </th>
            <th class="in-th"> 접수시간 </th>
        </tr>
    </thead>
    <tbody>
        {#each datas as data, idx}
            <tr class="text-center">
                <td class="in-td p-2 w-[70px]">
                    {reverseIdxArr[idx]}
                </td>
                <td class="in-td p-2 w-[180px]">
                    {data.af_mb_name}
                </td>
                <td class="in-td p-2 w-[180px]">
                    {formatPhoneNumber(data.af_mb_phone) || data.af_mb_phone}
                </td>
                <td class="in-td p-2">
                    {data.af_form_name}
                </td>
                <td class="in-td p-2">
                    <div>
                        <!-- class=" bg-green-600 px-3 py-1 text-xs rounded-md text-white active:bg-green-700" -->
                        <button
                            class="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-3 rounded-md transform transition-transform duration-150
    active:scale-95"
                            value={data.af_id}
                            on:click={openScheduleManageModal}
                        >
                            메모/상태 확인 및 수정
                        </button>
                    </div>
                </td>
                <td class="in-td p-2">
                    {data.af_mb_status}
                </td>
                <td class="in-td p-2">
                    {moment(data.af_created_at).format("YY-MM-DD HH:mm:ss")}
                </td>
            </tr>
        {/each}
    </tbody>
</table>

<div class="flex justify-center items-center my-5 gap-1">
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button
        class="page-btn w-8 h-8 text-sm border rounded-md"
        value="first_page"
        on:click={movePage}
    >
        <i class="fa fa-angle-double-left" aria-hidden="true"></i>
    </button>
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button
        class="page-btn w-8 h-8 text-sm border rounded-md"
        value="prev"
        on:click={movePage}
    >
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
                on:click={movePage}
            >
                {page}
            </button>
        {/if}
    {/each}
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button
        class="page-btn w-8 h-8 text-sm border rounded-md"
        value="next"
        on:click={movePage}
    >
        <i class="fa fa-angle-right" aria-hidden="true"></i>
    </button>
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button
        class="page-btn w-8 h-8 text-sm border rounded-md"
        value="last_page"
        on:click={movePage}
    >
        <i class="fa fa-angle-double-right" aria-hidden="true"></i>
    </button>
</div>
