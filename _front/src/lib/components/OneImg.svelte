<script>
    import imageCompression from "browser-image-compression";
    import axios from "axios";
    import { back_api } from "$src/lib/const";

    let {
        updateImg,
    } = $props();

    let imgArr = $state([]);
    // 이미지를 선택하면 사이즈 변경 (최대 1200px) 및 webp 변경 후 업로드
    const onFileSelected = (e) => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", ".png,.jpg,.jpeg");
        input.click();

        // input change
        input.onchange = async (e) => {
            const imageFile = e.target.files[0];
            const options = {
                maxSizeMB: 1, // 최대 파일 크기 (MB)
                maxWidthOrHeight: 1024, // 최대 너비 또는 높이
                useWebWorker: true, // 웹 워커 사용
            };

            try {
                const compressedFile = await imageCompression(
                    imageFile,
                    options,
                );
                console.log("Compressed file:", compressedFile);
                console.log(compressedFile.name);

                let imgForm = new FormData();

                const timestamp = new Date().getTime();
                const fileName = `${timestamp}${Math.random()
                    .toString(36)
                    .substring(2, 11)}.${compressedFile.name.split(".")[1]}`;

                console.log(fileName);

                imgForm.append("onimg", compressedFile, fileName);

                // FormData의 key 값과 value값 찾기
                // let keys = imgForm.keys();
                // for (const pair of keys) {
                //     console.log(`name : ${pair}`);
                // }

                // let values = imgForm.values();
                // for (const pair of values) {
                //     console.log(`value : ${pair}`);
                // }

                let res = {};
                try {
                    res = await axios.post(
                        `${back_api}/upload_sort_img`,
                        imgForm,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        },
                    );
                } catch (error) {
                    console.error("Error during image upload:", error.message);
                    alert("이미지 업로드 오류! 다시 시도해주세요!");
                    return;
                }

                console.log(res);

                if (res.status == 200) {
                    imgArr.push(res.data.baseUrl);
                    imgArr = [...new Set(imgArr)];
                    updateImg(imgArr);
                }
            } catch (error) {
                console.error("Error during image compression:", error);
                alert("이미지 업로드 오류! 다시 시도해주세요!");
            }
        };
    };
</script>

<button class="btn btn-info min-h-8 h-8 text-white" on:click={onFileSelected}>
    <i class="fa fa-upload" aria-hidden="true"></i>
    <span>이미지 업로드</span>
</button>
