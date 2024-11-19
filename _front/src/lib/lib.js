

export const dataURItoBlob = (dataURI) => {
    const bytes =
        dataURI.split(",")[0].indexOf("base64") >= 0
            ? atob(dataURI.split(",")[1])
            : unescape(dataURI.split(",")[1]);
    const mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const max = bytes.length;
    const ia = new Uint8Array(max);
    for (let i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
    return new Blob([ia], { type: mime });
};


export function getPagination(currentPage, maxPage = 30) {
    const range = 7; // 보여줄 페이지 범위
    const halfRange = Math.floor(range / 2);

    let start = Math.max(1, currentPage - halfRange);
    let end = Math.min(maxPage, currentPage + halfRange);

    // Adjust start and end if the range is less than 7
    if (end - start < range - 1) {
        if (start === 1) {
            end = Math.min(maxPage, start + range - 1);
        } else if (end === maxPage) {
            start = Math.max(1, end - range + 1);
        }
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}