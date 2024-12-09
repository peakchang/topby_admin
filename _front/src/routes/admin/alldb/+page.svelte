<script>
    import moment from "moment";
    import { formatPhoneNumber } from "$src/lib/lib.js";
    let { data } = $props();
    let datas = $state([]);
    let afAllCount = $state(0);

    let startDate = $state(moment().startOf("month").format('YYYY-MM-DD'));
    let endDate = $state(moment().format('YYYY-MM-DD'));
    console.log(startDate);
    
    $effect(() => {
        datas = data.datas;
    });
</script>

<div class="mb-4">
    <div class="flex items-center gap-2">
        <input type="date" class="border px-2 py-1 rounded-md" bind:value={startDate} />
        <span class="">~</span>
        <input type="date" class="border px-2 py-1 rounded-md" bind:value={endDate} />

        <label class="input input-sm input-bordered flex items-center gap-2">
            <input type="text" class="grow" placeholder="현장 1차 검색" />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="h-4 w-4 opacity-70"
            >
                <path
                    fill-rule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clip-rule="evenodd"
                />
            </svg>
        </label>

        <select class="select select-sm select-bordered">
            <option value="base">현장 선택</option>
        </select>

        <select class="select select-sm select-bordered">
            <option value="base">가망</option>
        </select>

        <select class="select select-sm select-bordered">
            <option value="base">30</option>
            <option value="base">50</option>
            <option value="base">100</option>
        </select>

        <button class="btn btn-neutral btn-sm">검색</button>

        <button class="btn btn-info btn-sm text-white">DB 엑셀 다운</button>
    </div>
</div>
<table class="w-full">
    <thead>
        <tr class="text-center">
            <th class="in-th"> 접수번호 </th>
            <th class="in-th"> 고객명 </th>
            <th class="in-th"> 전화번호 </th>
            <th class="in-th"> 현장 </th>
            <th class="in-th"> 메모 </th>
            <th class="in-th"> 상태 </th>
            <th class="in-th"> 접수시간 </th>
        </tr>
    </thead>
    <tbody>
        {#each datas as data, idx}
            <tr class="text-center">
                <td class="in-td p-2"> 1 </td>
                <td class="in-td p-2">
                    {data.af_mb_name}
                </td>
                <td class="in-td p-2">
                    {formatPhoneNumber(data.af_mb_phone)}
                </td>
                <td class="in-td p-2">
                    {data.af_form_name}
                </td>
                <td class="in-td p-2"> </td>
                <td class="in-td p-2"> </td>
                <td class="in-td p-2">
                    {moment(data.af_created_at).format("YY-MM-DD HH:mm:ss")}
                </td>
            </tr>
        {/each}
    </tbody>
</table>

<div class="my-5">asdlijflaisdjfliajsfd</div>
