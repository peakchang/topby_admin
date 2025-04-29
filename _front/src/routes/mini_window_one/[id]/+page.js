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

        console.log(res.data);


        if (res.status == 200) {
            if (res.data.hyData) {
                hyData = res.data.hyData;
            }

            if (res.data.con_site) {
                conSite = res.data.con_site.sl_site_name
            }


        }
    } catch (error) {
        
        console.error(error.message);

        // alert("에러 발생 다시 시도 해주세요.");
    }


    return { hyData, getHyId, conSite }
}