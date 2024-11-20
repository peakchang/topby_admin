<script>
    import { tick } from "svelte";
    import imageCompression from "browser-image-compression";
    import axios from "axios";
    import { back_api } from "$src/lib/const";

    let {
        updateImg,
        maxImgCount = 999999,
        imgModifyList = [],
        btnLocation = "left",
    } = $props();

    let imgArr = $state([]);
    if (imgModifyList.length > 0) {
        imgArr = imgModifyList;
    }

    let positions = new Map();
    let animating = false;

    let hoverColor = "#FFFFD2"; // 드래그 드롭시 변경되는 배경색 (변경 가능)

    function dragOverAction() {
        updateImg(imgArr);
    }

    async function deleteImg() {
        const arrIdx = this.value;
        const deleteData = imgArr[arrIdx];

        const getImgSplit = deleteData.split("/");
        const getFolder = getImgSplit[getImgSplit.length - 2];
        const getImgName = getImgSplit[getImgSplit.length - 1];

        try {
            const res = await axios.post(`${back_api}/delete_sort_img`, {
                getFolder,
                getImgName,
            });

            if (res.status == 200) {
                imgArr.splice(arrIdx, 1);
                updateImg(imgArr);
            } else {
                alert("에러가 발생했습니다. 다시 시도해주세요");
            }
        } catch (error) {
            console.error(error.message);
        }

        // const res = await axios.post()
    }

    // 이미지를 선택하면 사이즈 변경 (최대 1200px) 및 webp 변경 후 업로드
    const onFileSelected = (e) => {
        if (imgArr.length >= maxImgCount) {
            alert(`최대 ${maxImgCount}개 이미지만 업로드 가능합니다.`);
            return false;
        }

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

                const res = await axios.post(
                    `${back_api}/upload_sort_img`,
                    imgForm,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    },
                );

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

    // *************** 아래는 정렬되는 드래그 앤 드롭 함수!!! 건들지 말자!!! ********************
    // 상태 관리
    let hoveredIndex = $state(null); // 오버된 인덱스 추적

    function measurePositions() {
        const elements = document.querySelectorAll("li");
        positions = new Map(
            Array.from(elements).map((el) => [
                el.dataset.key,
                el.getBoundingClientRect(),
            ]),
        );
    }

    async function handleDragStart(event, index) {
        measurePositions(); // 요소의 초기 위치 저장
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", index);
    }

    function handleDragOver(event, index) {
        event.preventDefault();
        hoveredIndex = index; // 현재 마우스가 위치한 인덱스를 추적
    }

    function handleDragLeave(event, index) {
        if (hoveredIndex === index) {
            hoveredIndex = null; // 마우스가 위치에서 벗어나면 초기화
        }
    }

    async function handleDrop(event, index) {
        event.preventDefault();
        const fromIndex = Number(event.dataTransfer.getData("text/plain"));

        if (fromIndex === index) return;

        // 배열 업데이트: 값 교환
        const updatedItems = [...imgArr];
        [updatedItems[fromIndex], updatedItems[index]] = [
            updatedItems[index],
            updatedItems[fromIndex],
        ];

        // 애니메이션 트리거
        await animateSwap(fromIndex, index);

        imgArr = updatedItems;
        dragOverAction(imgArr);

        hoveredIndex = null; // 드롭 후 초기화
    }

    async function animateSwap(fromIndex, toIndex) {
        animating = true;

        // 새로운 위치 측정
        measurePositions();

        const fromKey = imgArr[fromIndex];
        const toKey = imgArr[toIndex];

        const fromPos = positions.get(fromKey);
        const toPos = positions.get(toKey);

        const deltaX = toPos.left - fromPos.left;
        const deltaY = toPos.top - fromPos.top;

        // 요소 이동
        const fromElement = document.querySelector(`li[data-key="${fromKey}"]`);
        const toElement = document.querySelector(`li[data-key="${toKey}"]`);

        fromElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        toElement.style.transform = `translate(${-deltaX}px, ${-deltaY}px)`;

        // 애니메이션 적용
        await tick();
        fromElement.style.transition = "transform 0.3s ease";
        toElement.style.transition = "transform 0.3s ease";

        await new Promise((resolve) => setTimeout(resolve, 300)); // 애니메이션 시간 대기

        // 초기화
        fromElement.style.transform = "";
        toElement.style.transform = "";
        fromElement.style.transition = "";
        toElement.style.transition = "";

        animating = false;
    }

    let addItemVal = $state("");
</script>

<ul>
    {#each imgArr as img, index (img)}
        <!-- svelte-ignore event_directive_deprecated -->
        <li
            draggable="true"
            data-key={img}
            on:dragstart={(event) => handleDragStart(event, index)}
            on:dragover={(event) => handleDragOver(event, index)}
            on:dragleave={(event) => handleDragLeave(event, index)}
            on:drop={(event) => handleDrop(event, index)}
            class={hoveredIndex === index ? "hovered" : ""}
            style="--hover-color: {hoverColor}"
        >
            <div class="w-full h-full flex items-center relative">
                <button
                    class="absolute top-0 right-0 text-red-600 cursor-default"
                    value={index}
                    on:click={deleteImg}
                >
                    <i class="fa fa-times-circle-o"></i>
                </button>
                <img src={img} alt="" />
            </div>
        </li>
    {/each}
</ul>

<div id="app" class="pretendard mt-3">
    <div
        class:text-left={btnLocation == "left"}
        class:text-center={btnLocation == "center"}
        class:text-right={btnLocation == "right"}
    >
        <button
            class="gap-1 bg-green-600 py-1 px-3 rounded-md text-white text-sm"
            on:click={onFileSelected}
        >
            <i class="fa fa-file-image-o" aria-hidden="true"></i>
            이미지 업로드
        </button>
    </div>
</div>

<style>
    ul {
        list-style: none;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
    li {
        padding: 5px;
        width: 120px;
        height: 120px;
        background: #f3f3f3;
        border: 1px solid #ddd;
        cursor: grab;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        transition: background-color 0.3s ease;
    }
    li.hovered {
        background: var(--hover-color, red); /* 오버된 상태의 배경색 */
    }
</style>
