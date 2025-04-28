import axios from "axios";
import { back_api } from "$lib/const.js";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {

    let hyData = {}
    let conSite = ""
    const getHyId = params;
    

    try {
        const res = await axios.post(`${back_api}/minisite/load_hy_data_one`, {
            getHyId,
        });
        
        if (res.status == 200) {
            hyData = res.data.hyData;
            conSite = res.data.con_site.sl_site_name
        }
    } catch (error) {
        alert("에러 발생 다시 시도 해주세요.");
    }
    
    
    return { hyData, getHyId, conSite }
}