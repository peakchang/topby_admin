<script>
    import axios from "axios";
    import { back_api } from "$src/lib/const";
    import { page } from "$app/stores";
    import Cookies from "js-cookie";

    let { data } = $props();
    const allData = data.minisiteData;

    let imgList = $state([]);
    if (data.minisiteData.hy_image_list) {
        imgList = data.minisiteData.hy_image_list.split(",");
    }

    $effect(async () => {
        const getVisitedCookie = Cookies.get("topby_visited");
        const referrer = document.referrer;
        const setAddCount = Number(allData["hy_counter"]) + 1;
        if (!getVisitedCookie) {
            try {
                const res = await axios.post(
                    `${back_api}/minisite/update_visit_count`,
                    {
                        st_page_id: data.pageId,
                        st_visit_count: setAddCount,
                        st_referrer: referrer,
                    },
                );

                if (res.status == 200) {
                    Cookies.set("topby_visited", "ok", { expires: 1 });
                }
            } catch (error) {}
        }
    });

    console.log(allData);

    // 입력받는 이름 / 전화번호
    let formName = $state("");
    let ph2 = $state(""); // 전화번호 중간
    let ph3 = $state(""); // 전화번호 마지막

    // 스크롤 이동을 위한 폼 영역 설정!!
    let topFormArea = $state(); // 상단 폼 영역
    let bottomFormArea = $state(); // 하단 폼 영역

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
        if (chk == "ph2") {
            ph2 = input;
        } else if (chk == "ph3") {
            ph3 = input;
        }
    }

    async function addCallCountFunc() {
        const setCount = Number(allData.hy_call_count) + 1;
        try {
            const res = axios.post(
                `${back_api}/minisite/update_call_sms_count`,
                {
                    page_id: data.pageId,
                    setCount,
                    type: "call",
                },
            );
        } catch (error) {}
    }

    function addSmsCountFunc() {
        const setCount = Number(allData.hy_sms_count) + 1;
        try {
            const res = axios.post(
                `${back_api}/minisite/update_call_sms_count`,
                {
                    page_id: data.pageId,
                    setCount,
                    type: "sms",
                },
            );
        } catch (error) {}
    }

    function scrollFormFunc() {
        if (allData.hy_form_location == "bottom") {
            bottomFormArea.scrollIntoView({
                behavior: "smooth",
            });
        } else {
            topFormArea.scrollIntoView({
                behavior: "smooth",
            });
        }
    }

    async function hySiteFormSubmit(e) {
        e.preventDefault();
        console.log("폼 클릭!!!");

        if (!formName) {
            alert("이름을 입력하세요");
            return;
        }
        if (!ph2) {
            alert("전화번호 가운데를 입력하세요");
            return;
        }

        if (!ph3) {
            alert("전화번호 마지막을 입력하세요");
            return;
        }

        console.log(formName);
        const formPhone = `010${ph2}${ph3}`;
        console.log(formPhone);
        console.log(allData.hy_site);

        try {
            const res = await axios.post(
                `${back_api}/minisite/upload_form_data`,
                {
                    name: formName,
                    phone: formPhone,
                    site_id: allData.hy_site,
                },
            );

            if(res.status == 200){
                alert('접수 완료! 담당자가 빠른 시간안에 연락 드리도록 하겠습니다!')
            }
        } catch (error) {}
    }
</script>

<dialog id="personal_info_modal" class="modal suit-font">
    <div class="modal-box">
        <form method="dialog">
            <button
                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
                ✕
            </button>
        </form>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            광고성 정보수신 동의
        </h3>
        <div class="p-6 space-y-6">
            <p
                class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
            >
                ※ 서비스 안내 및 이용권유 등
            </p>
            <p
                class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
            >
                ① 제공받는 자 : 애드피크
            </p>
            <p
                class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
            >
                ② 제공목적 : 서비스 안내 및 이용권유, 사은·판촉행사 등의 마케팅
                활동, 시장조사 및 상품·서비스 개발연구 등 고객데이터 수집 및
                관리
            </p>
            <p
                class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
            >
                ③ 수집항목 : 이름, 휴대폰번호
            </p>
            <p
                class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
            >
                ④ 수집 및 이용기간 : 문의 종료일로 2년까지
            </p>
            <p
                class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
            >
                회원님은 동의를 거부할 권리가 있으며 동의 거부 시에도 서비스
                이용에 제한이 없습니다. 다만 서비스 이용권유, 판촉행사 등의
                유익한 정보를 받으실 수 없습니다.
            </p>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>

<dialog id="ad_info_modal" class="modal suit-font">
    <div class="modal-box">
        <form method="dialog">
            <button
                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
                ✕
            </button>
        </form>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            개인정보 제3자 제공 동의
        </h3>
        <div class="p-6 space-y-6">
            <p
                class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
            >
                ※ 서비스 안내 및 이용권유 등
            </p>
            <p
                class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
            >
                ① 제공받는 자 : 애드피크
            </p>
            <p
                class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
            >
                ② 제공목적 : 서비스 안내 및 이용권유, 사은·판촉행사 등의 마케팅
                활동, 시장조사 및 상품·서비스 개발연구 등 고객데이터 수집 및
                관리
            </p>
            <p
                class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
            >
                ③ 수집항목 : 이름, 휴대폰번호
            </p>
            <p
                class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
            >
                ④ 수집 및 이용기간 : 문의 종료일로 2년까지
            </p>
            <p
                class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
            >
                회원님은 동의를 거부할 권리가 있으며 동의 거부 시에도 서비스
                이용에 제한이 없습니다. 다만 서비스 이용권유, 판촉행사 등의
                유익한 정보를 받으실 수 없습니다.
            </p>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>

<div class="container max-w-2xl px-1 mx-auto suit-font">
    {#if allData.hy_main_image}
        <img src={imageOrigin + allData.hy_main_image} alt="" />
    {/if}

    <!-- svelte-ignore event_directive_deprecated -->

    {#if !allData.hy_form_location || allData.hy_form_location == "top" || allData.hy_form_location == "both"}
        <form method="post" on:submit={hySiteFormSubmit}>
            <div
                class="my-4 mx-auto border relative py-5 rounded-lg"
                bind:this={topFormArea}
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
                                <!-- svelte-ignore event_directive_deprecated -->
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
                                <!-- svelte-ignore event_directive_deprecated -->
                                <input
                                    type="text"
                                    name="phnum_3"
                                    class="border-none px-4 py-1 rounded-md w-1/3 focus:outline-none"
                                    on:input={(e) => {
                                        phoneChk(e, "ph3");
                                    }}
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
                                <input
                                    type="checkbox"
                                    class="ad_info"
                                    checked
                                />
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
                            <button>
                                <img
                                    src={imageOrigin + allData.hy_form_btn_img}
                                    alt=""
                                    class="mx-auto"
                                />
                            </button>
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
    {/if}

    {#if allData.hy_description}
        <div class="border-b-2 my-3 pb-3">
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

    {#if !allData.hy_form_location || allData.hy_form_location == "bottom" || allData.hy_form_location == "both"}
        <!-- svelte-ignore event_directive_deprecated -->
        <form method="post" on:submit={hySiteFormSubmit}>
            <div
                class="my-4 mx-auto border relative py-5 rounded-lg"
                bind:this={bottomFormArea}
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
                                <!-- svelte-ignore event_directive_deprecated -->
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
                                <!-- svelte-ignore event_directive_deprecated -->
                                <input
                                    type="text"
                                    name="phnum_3"
                                    class="border-none px-4 py-1 rounded-md w-1/3 focus:outline-none"
                                    on:input={(e) => {
                                        phoneChk(e, "ph3");
                                    }}
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
                                <input
                                    type="checkbox"
                                    class="ad_info"
                                    checked
                                />
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
                            <button>
                                <img
                                    src={imageOrigin + allData.hy_form_btn_img}
                                    alt=""
                                    class="mx-auto"
                                />
                            </button>
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
    {/if}

    <div class="border-t mt-3 pt-3 mb-24 md:mb-12 whitespace-pre-line">
        {#if allData.hy_footer}
            {@html allData.hy_footer}
        {/if}
    </div>
</div>

<!-- 우측 고정!!! -->
{#if allData.hy_form_follow_img}
    <div class="fixed bottom-36 right-5 z-50 text-lg">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore event_directive_deprecated -->
        <div
            class="w-16 md:w-24 rounded-full overflow-hidden animate-pulse cursor-pointer"
            on:click={scrollFormFunc}
        >
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
            <!-- svelte-ignore event_directive_deprecated -->
            <a href="TEL:{allData.hy_callnumber}" on:click={addCallCountFunc}>
                <div>
                    <img
                        src={imageOrigin + allData.hy_ft_phone_img}
                        alt=""
                        class="w-full"
                    />
                </div>
            </a>
        {:else}
            <!-- svelte-ignore event_directive_deprecated -->
            <a href="TEL:{allData.hy_callnumber}" on:click={addCallCountFunc}>
                <div>
                    <img src="/minisite/call_btn.webp" alt="" />
                </div>
            </a>
        {/if}
    {/if}

    {#if allData.hy_sms}
        {#if allData.hy_ft_sms_img}
            <!-- svelte-ignore event_directive_deprecated -->
            <a
                href="SMS:{allData.hy_sms}?body={allData.hy_sms_content
                    ? allData.hy_sms_content
                    : smsBaseContent}"
                on:click={addSmsCountFunc}
            >
                <div>
                    <img src={imageOrigin + allData.hy_ft_sms_img} alt="" />
                </div>
            </a>
        {:else}
            <!-- svelte-ignore event_directive_deprecated -->
            <a
                href="SMS:{allData.hy_sms}?body={allData.hy_sms_content
                    ? allData.hy_sms_content
                    : smsBaseContent}"
                on:click={addSmsCountFunc}
            >
                <div>
                    <img src="/minisite/sms_btn.webp" alt="" />
                </div>
            </a>
        {/if}
    {/if}
</div>
