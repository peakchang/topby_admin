<script>
    import axios from "$node_modules/axios/index.js";
    import { back_api } from "$src/lib/const.js";

    $effect(async () => {
        let ip = null;
        try {
            const res = await fetch("https://api64.ipify.org?format=json");
            const data = await res.json();
            ip = data.ip;
            console.log(ip);
        } catch (error) {
            console.error("IP 가져오기 실패:", error);
        }
        try {
            console.log(`${back_api}/api/v3/err_ip_chk`);

            const res = await axios.post(`${back_api}/api/v3/err_ip_chk`, {
                ip,
            });
            console.log(res.data);
        } catch (error) {}
    });
</script>

<div class="wrapper kbo-font">
    <img src="/err_img.png" alt="" class="mx-auto" />
    <div class="mt-5">
        <span>페이지가 존재하지 않습니다.</span>
    </div>
    <div class="mt-5">
        <span>확인 후 다시 시도 해주세요</span>
    </div>
</div>

<style>
    .wrapper {
        padding-top: 100px;
        text-align: center;
        font-size: 32px;
    }
</style>
