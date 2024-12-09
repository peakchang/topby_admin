import axios from "axios";
import { back_api } from "$lib/const.js";
import { getPagination } from "$lib/lib.js"

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {

    // const nowPage = url.searchParams.get('page') || 1;
    // const search = url.searchParams.get('search');
    // let pageArr = []
    let datas = [];
    let afAllCount = 0;
    try {
        const res = await axios.post(`${back_api}/alldb/load_data`, {  })
        if (res.status == 200) {
            datas = res.data.datas;
            afAllCount = res.data.afAllCount;
            // pageArr = getPagination(parseInt(nowPage), res.data.allPage);
        }
    } catch (error) {

    }

    console.log(datas);
    

    return { datas }
}