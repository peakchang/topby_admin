import axios from "axios";
import { back_api } from "$lib/const.js";
import { getPagination } from "$lib/lib.js"

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {

    const nowPage = url.searchParams.get('page') || 1;
    let pageArr = []
    let minisiteData = [];
    try {
        const res = await axios.post(`${back_api}/minisite1/load_minisite`, { nowPage })
        if (res.status == 200) {
            minisiteData = res.data.minisiteData;
            pageArr = getPagination(parseInt(nowPage), res.data.allPage);
        }
    } catch (error) {

    }


    return { minisiteData, pageArr }
}