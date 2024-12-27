<script>
    import { user_info } from "$src/lib/store.js";

    let { data } = $props();

    let loading = $state(true);

    let footerData = data.footerData;

    let swiperPc = $state();
    let swiperMobile = $state();

    // PC 이미지 화면 사이즈에 맞춰서!!
    let pc_image1 = $state();
    let videoWrapper1 = $state();

    let pc_image2 = $state();
    let videoWrapper2 = $state();

    let m_image1 = $state();
    let videoWrapper_m_1 = $state();

    let m_image2 = $state();
    let videoWrapper_m_2 = $state();

    let swiperTest = $state();

    $effect(() => {
        loading = false;
        positionPcVideo(pc_image1, videoWrapper1);
        positionPcVideo(pc_image2, videoWrapper2);

        positionMobileVideo1(m_image1, videoWrapper_m_1);
        positionMobileVideo2(m_image2, videoWrapper_m_2);

        swiperPc = new Swiper(".pc_swiper", {
            // Optional parameters
            autoHeight: true,
            loop: true,
            slidesPerView: 4,
            spaceBetween: 20,
            autoplay: {
                delay: 1500,
                disableOnInteraction: false,
            },
        });

        swiperMobile = new Swiper(".m_swiper", {
            // Optional parameters
            autoHeight: true,
            loop: true,
            slidesPerView: 2,
            spaceBetween: 10,
            autoplay: {
                delay: 1500,
                disableOnInteraction: false,
            },
        });
    });

    // 이미지의 크기를 계산하여 동영상 위치 설정
    function positionPcVideo(pc_img, videoWrapper) {
        var rect1 = pc_img.getBoundingClientRect();
        // 두 이미지 사이의 중간 위치를 계산
        var coordY = rect1.height / 4.65;
        var coordX = rect1.width / 2.125;
        var videoWidth = rect1.width / 2.352;

        // 동영상의 위치를 설정
        videoWrapper.style.top = coordY + "px";
        videoWrapper.style.left = coordX + "px";
        videoWrapper.style.width = videoWidth + "px";
        videoWrapper.style.display = "block";
    }

    function positionMobileVideo1(mobile_img, videoWrapper) {
        var rect1 = mobile_img.getBoundingClientRect();

        // 두 이미지 사이의 중간 위치를 계산
        var coordY = rect1.height / 14.05;
        var coordX = rect1.width / 3.42;
        var videoWidth = rect1.width / 1.573;

        // 동영상의 위치를 설정
        videoWrapper.style.top = coordY + "px";
        videoWrapper.style.left = coordX + "px";
        videoWrapper.style.width = videoWidth + "px";
        videoWrapper.style.display = "block";
    }

    function positionMobileVideo2(mobile_img, videoWrapper) {
        var rect1 = mobile_img.getBoundingClientRect();

        // 두 이미지 사이의 중간 위치를 계산
        var coordY = rect1.height / 10.24;
        var coordX = rect1.width / 3.354;
        var videoWidth = rect1.width / 1.563;

        // 동영상의 위치를 설정
        videoWrapper.style.top = coordY + "px";
        videoWrapper.style.left = coordX + "px";
        videoWrapper.style.width = videoWidth + "px";
        videoWrapper.style.display = "block";
    }
</script>

<!-- <svelte:window bind:innerWidth /> -->
{#if loading}
    <div class="text-center my-10">
        <span class="loading loading-dots loading-lg"></span>
    </div>
{/if}
<div class="px-1 hidden md:block">
    <div class="relative bg-black">
        <div class="absolute" style="top: 180px; z-index: 10;">
            <img src="/pc/main1_img.png" alt="" class="mx-auto" />
        </div>

        <div class="">
            <img src="/pc/main_move_top.webp" alt="" class="mr-auto" />
        </div>

        <div class="py-24"></div>

        <div>
            <img src="/pc/main_move_bottom.webp" alt="" class="ml-auto mt-20" />
        </div>
    </div>

    <img src="/pc/img_2.webp" alt="" class="mx-auto" />
    <img src="/pc/img_3.jpg" alt="" class="mx-auto" />

    <div class="containers">
        <img
            src="/pc/img_4.jpg"
            id="image1"
            alt=""
            class="mx-auto"
            bind:this={pc_image1}
        />
        <div
            id="videoWrapper1"
            class="video-wrapper text-white border border-white"
            bind:this={videoWrapper1}
        >
            <video autoplay loop muted>
                <source src="/introduce_company.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    </div>

    <div class="containers">
        <img
            src="/pc/img_5.jpg"
            id="image2"
            alt=""
            class="mx-auto"
            bind:this={pc_image2}
        />
        <div
            id="videoWrapper2"
            class="video-wrapper text-white border border-white"
            bind:this={videoWrapper2}
        >
            <video autoplay loop muted>
                <source src="/introduce_company2.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    </div>

    <div class="swiper pc_swiper">
        <div class="swiper-wrapper">
            <div class="swiper-slide">
                <img src="/swipe_katalk/kakao_1.jpg" alt="" />
            </div>
            <div class="swiper-slide">
                <img src="/swipe_katalk/kakao_2.jpg" alt="" />
            </div>
            <div class="swiper-slide">
                <img src="/swipe_katalk/kakao_3.jpg" alt="" />
            </div>
            <div class="swiper-slide">
                <img src="/swipe_katalk/kakao_4.jpg" alt="" />
            </div>
            <div class="swiper-slide">
                <img src="/swipe_katalk/kakao_5.jpg" alt="" />
            </div>
            <div class="swiper-slide">
                <img src="/swipe_katalk/kakao_6.jpg" alt="" />
            </div>
            <div class="swiper-slide">
                <img src="/swipe_katalk/kakao_7.jpg" alt="" />
            </div>
            <div class="swiper-slide">
                <img src="/swipe_katalk/kakao_8.jpg" alt="" />
            </div>
            <div class="swiper-slide">
                <img src="/swipe_katalk/kakao_9.jpg" alt="" />
            </div>
            <div class="swiper-slide">
                <img src="/swipe_katalk/kakao_10.jpg" alt="" />
            </div>
        </div>
        <div class="swiper-pagination"></div>
    </div>

    <img src="/pc/img_6.jpg" alt="" class="mx-auto" />
    <img src="/pc/img_7.jpg" alt="" class="mx-auto" />
</div>

<div class="px-1 blodk md:hidden">
    <div class="bg-black">
        <img src="/m/main_move_top.webp" alt="" class="mr-auto" />
        <img src="/m/main1_img.jpg" alt="" class="mx-auto" />
        <img src="/m/main_move_bottom.webp" alt="" class="ml-auto mt-20" />
    </div>

    <img src="/m/img_2.webp" alt="" class="mx-auto" />
    <img src="/m/img_3.jpg" alt="" class="mx-auto" />

    <div class="containers">
        <img
            src="/m/img_4.jpg"
            id="m_image1"
            alt=""
            class="mx-auto"
            bind:this={m_image1}
        />
        <div
            id="videoWrapper_m_1"
            class="video-wrapper text-white border border-white"
            bind:this={videoWrapper_m_1}
        >
            <video autoplay loop muted>
                <source src="/introduce_company.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    </div>

    <div class="containers">
        <img
            src="/m/img_5.jpg"
            id="m_image2"
            alt=""
            class="mx-auto"
            bind:this={m_image2}
        />
        <div
            id="videoWrapper_m_2"
            class="video-wrapper text-white border border-white"
            bind:this={videoWrapper_m_2}
        >
            <video autoplay loop muted>
                <source src="/introduce_company2.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    </div>

    <div class="swiper m_swiper">
        <div class="swiper-wrapper">
            <div class="swiper-slide">
                <img src="/swipe_katalk/kakao_1.jpg" alt="" />
            </div>
            <div class="swiper-slide">
                <img src="/swipe_katalk/kakao_2.jpg" alt="" />
            </div>
            <div class="swiper-slide">
                <img src="/swipe_katalk/kakao_3.jpg" alt="" />
            </div>
            <div class="swiper-slide">
                <img src="/swipe_katalk/kakao_4.jpg" alt="" />
            </div>
            <div class="swiper-slide">
                <img src="/swipe_katalk/kakao_5.jpg" alt="" />
            </div>
            <div class="swiper-slide">
                <img src="/swipe_katalk/kakao_6.jpg" alt="" />
            </div>
            <div class="swiper-slide">
                <img src="/swipe_katalk/kakao_7.jpg" alt="" />
            </div>
            <div class="swiper-slide">
                <img src="/swipe_katalk/kakao_8.jpg" alt="" />
            </div>
            <div class="swiper-slide">
                <img src="/swipe_katalk/kakao_9.jpg" alt="" />
            </div>
            <div class="swiper-slide">
                <img src="/swipe_katalk/kakao_10.jpg" alt="" />
            </div>
        </div>
        <div class="swiper-pagination"></div>
    </div>
    <img src="/m/img_6.jpg" alt="" class="mx-auto" />
    <img src="/m/img_7.jpg" alt="" class="mx-auto" />
</div>

<div id="ft">
    <div class="container pb-10 suit-font mx-auto">
        <div class="grid grid-cols-4">
            <div
                class="col-span-4 md:col-span-1 flex justify-center items-center"
            >
                <div class="max-w-44">
                    <img src="/footer-logo.png" alt="" />
                </div>
            </div>

            <div class="col-span-4 md:col-span-3 text-center">
                <div class="suit_font text-center mt-5 text-xs md:text-base">
                    {#if footerData.fs_personal_officer}
                        <span class="inline-block mr-4">
                            개인정보책임자 : {footerData.fs_personal_officer}
                        </span>
                    {/if}

                    {#if footerData.fs_owner}
                        <span class="inline-block mr-4">
                            대표 : {footerData.fs_owner}
                        </span>
                    {/if}

                    {#if footerData.fs_company}
                        <span class="inline-block mr-4">
                            회사명 : {footerData.fs_company}
                        </span>
                    {/if}

                    {#if footerData.fs_address}
                        <span class="inline-block mr-4">
                            주소 : {footerData.fs_address}
                        </span>
                    {/if}

                    {#if footerData.fs_email}
                        <span class="inline-block mr-4">
                            이메일 : {footerData.fs_email}
                        </span>
                    {/if}

                    {#if footerData.fs_business_num}
                        <span class="inline-block mr-4">
                            사업자번호 : {footerData.fs_business_num}
                        </span>
                    {/if}

                    {#if footerData.fs_callnumber}
                        <span class="inline-block mr-4">
                            전화 : {footerData.fs_callnumber}
                        </span>
                    {/if}

                    {#if footerData.fs_report_number}
                        <span class="inline-block mr-4">
                            통신판매업신고번호 : {footerData.fs_report_number}
                        </span>
                    {/if}

                    {#if $user_info.rate > 3}
                        <span class=" text-blue-600">
                            <a class="nav-link" href="/admin" target="_blank"
                                >CRM 바로가기</a
                            >
                        </span>
                    {:else}
                        <span class="text-blue-600">
                            <a class="nav-link" href="/admin" target="_blank">
                                CRM 바로가기
                            </a>
                        </span>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .containers {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .image {
        width: 100%;
        max-width: 600px;
    }

    .video-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        /* display: none; */
        /* Initially hidden */
    }

    .video-wrapper video {
        width: 100%;
        height: auto;
    }

    .swiper {
        padding: 30px 0;
        width: 100%;
        height: 100%;
    }

    .swiper-slide {
        text-align: center;
        font-size: 18px;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        height: auto;
    }

    .swiper-slide img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>
