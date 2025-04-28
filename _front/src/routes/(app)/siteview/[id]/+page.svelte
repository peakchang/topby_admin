<script>
    import axios from "axios";
    import { back_api } from "$src/lib/const";
    import { page } from "$app/stores";

    let { data } = $props();
    const allData = data.minisiteData;

    let imgList = [];
    if (data.minisiteData.hy_image_list) {
        imgList = data.minisiteData.hy_image_list.split(",");
    }

    let formArea = ""; // 폼 영역
    console.log(allData);

    // 입력받는 이름 / 전화번호
    let formName = $state("");
    let ph2 = $state(""); // 전화번호 중간
    let ph3 = $state(""); // 전화번호 마지막
    let formPhone = $state(""); // 전체 전화번호

    const smsBaseContent = `${allData.hy_title} 문의드립니다. 분양가 / 모델하우스위치가 어떻게 되나요?`;

    const imageOrigin = import.meta.env.VITE_SERVER_URL
        ? import.meta.env.VITE_SERVER_URL
        : $page.url.origin;

    function phoneChk(e, chk) {
        let input = e.target.value;

        // 숫자만
        input = input.replace(/\D/g, "");
        // 4글자 제한
        if (input.length > 4) {
            input = input.slice(0, 4);
        }
        console.log(input);
        if (chk == "ph2") {
            ph2 = input;
            console.log(ph2);
        }
    }
</script>

<div class="container max-w-2xl px-1 mx-auto suit-font">
    {#if allData.hy_main_image}
        <img src={imageOrigin + allData.hy_main_image} alt="" />
    {/if}

    <form method="post" id="user_form">
        <div
            class="my-4 mx-auto border relative py-5 rounded-lg"
            bind:this={formArea}
        >
            <div class="text-center">
                {#if allData.hy_form_img}
                    <div class="mb-3 max-w-full mx-auto">
                        <img
                            src={imageOrigin + allData.hy_form_img}
                            alt=""
                            class="mx-auto"
                        />
                    </div>
                {/if}
                <div
                    class="mt-8 w-full px-3 mx-auto grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div
                        class="flex items-center border border-gray-300 rounded-full overflow-hidden py-1 px-3"
                    >
                        <div class="w-1/5 border-r">이름</div>
                        <div class="w-4/5">
                            <input
                                type="text"
                                name="af_mb_name"
                                class="w-full py-1 pl-3 border-none rounded-full focus:outline-none"
                                placeholder="이름을 입력하세요!"
                                bind:value={formName}
                            />
                        </div>
                    </div>

                    <div
                        class="flex items-center border border-gray-300 rounded-full overflow-hidden py-1 px-3"
                    >
                        <div class="w-1/5 border-r">연락처</div>
                        <div class="w-4/5 flex">
                            <input
                                type="text"
                                name="phnum_1"
                                value="010"
                                class="border-none px-4 py-1 rounded-md w-1/3 focus:outline-none"
                                readonly
                            />
                            <span class="flex items-center">-</span>
                            <input
                                type="text"
                                name="phnum_2"
                                class="border-none px-4 py-1 rounded-md w-1/3 focus:outline-none"
                                on:input={(e) => {
                                    phoneChk(e, "ph2");
                                }}
                                bind:value={ph2}
                            />
                            <span class="flex items-center">-</span>
                            <input
                                type="text"
                                name="phnum_3"
                                class="border-none px-4 py-1 rounded-md w-1/3 focus:outline-none"
                                on:input={phoneChk}
                                bind:value={ph3}
                            />
                        </div>
                    </div>
                </div>

                <div class="w-3/4 md:w-1/2 mx-auto">
                    <div class=" py-1 mt-4">
                        <label class="flex items-center gap-2">
                            <input type="checkbox" class="allchk" />
                            <span>전체동의</span>
                        </label>
                    </div>

                    <div class=" text-xs md:text-sm py-1">
                        <label class="flex items-center gap-2">
                            <input
                                type="checkbox"
                                class="personal_info"
                                checked
                            />
                            <span>개인정보 수집 동의</span>
                            <!-- svelte-ignore event_directive_deprecated -->
                            <button
                                type="button"
                                on:click={() => {
                                    personal_info_modal.showModal();
                                }}
                            >
                                [보기]
                            </button>
                        </label>
                    </div>

                    <div class=" text-xs md:text-sm pb-4">
                        <label class="flex items-center gap-2">
                            <input type="checkbox" class="ad_info" checked />
                            <span>광고성 정보수신 동의</span>
                            <!-- svelte-ignore event_directive_deprecated -->
                            <button
                                type="button"
                                on:click={() => {
                                    ad_info_modal.showModal();
                                }}
                            >
                                [보기]
                            </button>
                        </label>
                    </div>
                </div>

                {#if allData.hy_form_btn_img}
                    <div class="mb-3 max-w-full mx-auto">
                        <img
                            src={imageOrigin + allData.hy_form_btn_img}
                            alt=""
                            class="mx-auto"
                        />
                    </div>
                {:else}
                    <button
                        class="w-3/4 md:w-1/2 text-white rounded-md py-1 font-bold mx-auto"
                    >
                        <img
                            src="/minisite/success_btn.webp"
                            alt=""
                            class="max-w-fit w-full mx-auto"
                        />
                    </button>
                {/if}
            </div>
        </div>
    </form>

    {#if allData.hy_description}
        <div class="border-b-2 mb-3 pb-3">
            <div>
                <div
                    class="border border-l-8 border-l-red-700 rounded-lg p-1 pl-6 font-semibold text-xl tracking-widest"
                >
                    현장 특장점
                </div>
            </div>

            <div>
                <div
                    class="border rounded-lg p-4 mt-4 hy_features_area whitespace-pre-line"
                >
                    {@html allData.hy_description}
                </div>
            </div>
        </div>
    {/if}

    {#if imgList.length > 0}
        {#each imgList as img}
            <div class="mb-3">
                <img src={imageOrigin + img} alt="" class="w-full" />
            </div>
        {/each}
    {/if}

    <div class="border-t mt-3 pt-3 mb-24 md:mb-12">
        {#if allData.hy_footer}
            {allData.hy_footer}
        {/if}
    </div>
</div>

<!-- 우측 고정!!! -->
{#if allData.hy_form_follow_img}
    <div class="fixed bottom-36 right-5 z-50 text-lg">
        <div class="w-16 md:w-24 rounded-full overflow-hidden animate-pulse">
            <img
                src={imageOrigin + allData.hy_form_follow_img}
                alt=""
                class="w-full"
            />
        </div>
    </div>
{/if}

<!-- 모바일 하단 고정!! -->
<div
    class="fixed bottom-0 left-0 w-full z-30 grid grid-cols-2 text-center text-lg text-white md:hidden"
    style="background-color: rgba( 0, 34, 102, 0.7 );"
>
    {#if allData.hy_callnumber}
        {#if allData.hy_ft_phone_img}
            <a href="TEL:{allData.hy_callnumber}">
                <div>
                    <img
                        src={imageOrigin + allData.hy_ft_phone_img}
                        alt=""
                        class="w-full"
                    />
                </div>
            </a>
        {:else}
            <a href="TEL:{allData.hy_callnumber}">
                <div>
                    <img src="/minisite/call_btn.webp" alt="" />
                </div>
            </a>
        {/if}
    {/if}

    {#if allData.hy_sms}
        {#if allData.hy_ft_sms_img}
            <a
                href="SMS:{allData.hy_sms}?body={allData.hy_sms_content
                    ? allData.hy_sms_content
                    : smsBaseContent}"
            >
                <div>
                    <img src={imageOrigin + allData.hy_ft_sms_img} alt="" />
                </div>
            </a>
        {:else}
            <a
                href="SMS:{allData.hy_sms}?body={allData.hy_sms_content
                    ? allData.hy_sms_content
                    : smsBaseContent}"
            >
                <div>
                    <img src="/minisite/sms_btn.webp" alt="" />
                </div>
            </a>
        {/if}
    {/if}
</div>
