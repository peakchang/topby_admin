<script>
    import { tick } from "svelte";

    let items = $state(["Item 1", "Item 2", "Item 3", "Item 4"]);
    let positions = new Map();
    let animating = false;

    let hoverColor = "#FFFFD2"; // 드래그 드롭시 변경되는 배경색 (변경 가능)

    function dragOverAction(e) {
        console.log(e);
    }

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
        const updatedItems = [...items];
        [updatedItems[fromIndex], updatedItems[index]] = [
            updatedItems[index],
            updatedItems[fromIndex],
        ];

        // 애니메이션 트리거
        await animateSwap(fromIndex, index);

        items = updatedItems;
        dragOverAction(items)

        hoveredIndex = null; // 드롭 후 초기화
    }

    async function animateSwap(fromIndex, toIndex) {
        animating = true;

        // 새로운 위치 측정
        measurePositions();

        const fromKey = items[fromIndex];
        const toKey = items[toIndex];

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

<div class="mb-3">
    <input type="text" class="border" bind:value={addItemVal} />

    <button
        on:click={() => {
            items.push(addItemVal);
        }}
    >
        gogogogo
    </button>
</div>

<ul>
    {#each items as item, index (item)}
        <!-- svelte-ignore event_directive_deprecated -->
        <li
            draggable="true"
            data-key={item}
            on:dragstart={(event) => handleDragStart(event, index)}
            on:dragover={(event) => handleDragOver(event, index)}
            on:dragleave={(event) => handleDragLeave(event, index)}
            on:drop={(event) => handleDrop(event, index)}
            class={hoveredIndex === index ? "hovered" : ""}
            style="--hover-color: {hoverColor}"
        >
            {item}
        </li>
    {/each}
</ul>

<style>
    ul {
        list-style: none;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
    li {
        padding: 10px;
        width: 80px;
        height: 80px;
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
