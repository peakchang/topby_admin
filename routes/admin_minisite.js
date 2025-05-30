import express from "express";
import { sql_con } from '../back-lib/db.js'
import { getQueryStr, deleteFolder, aligoKakaoNotification_formanager } from '../back-lib/lib.js';
import moment from "moment-timezone";
import fs from "fs-extra";
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const minisiteRouter = express.Router();

// 여기 0409 추가한 부분!!!! 사이트 타입 조절!!!
minisiteRouter.post('/update_site_type', async (req, res) => {
    const body = req.body;
    try {
        const updateTypeQuery = "UPDATE land SET ld_view_type = ? WHERE ld_id = ?";
        await sql_con.promise().query(updateTypeQuery, [body.ld_view_type, body.ld_id]);
    } catch (error) {

    }
    res.json({})

})
// 끝!!!

minisiteRouter.post('/add_sub_domain', async (req, res) => {
    const body = req.body;

    const now = moment().format('YYYY-MM-DD HH:mm:ss');

    try {
        const addSubDomainQuery = "INSERT INTO land (ld_domain, ld_created_at) VALUES (?,?)";
        await sql_con.promise().query(addSubDomainQuery, [body.addSubDomainVal, now]);
    } catch (error) {

    }
    res.json({})

})

minisiteRouter.post('/add_hy_site', async (req, res) => {
    const hy_num = req.body.hy_num;
    const hy_site_name = req.body.hy_site_name;
    const hy_manage_site = req.body.hy_manage_site

    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    let err_message = "";
    try {
        const addHySiteQuery = `INSERT INTO hy_site (hy_num, hy_title,hy_manage_site, hy_creted_at) VALUES (?,?,?,?)`;
        await sql_con.promise().query(addHySiteQuery, [hy_num, hy_site_name, hy_manage_site, now]);
    } catch (err) {
        err_message = err.message;
        console.error(err_message);

    }

    res.json({ err_message })
})


minisiteRouter.post('/apply_site', async (req, res) => {
    const ldId = req.body.ld_id
    const setSite = req.body.setSite
    try {
        const updateLandSiteQuery = "UPDATE land SET ld_site = ? WHERE ld_id = ?";
        await sql_con.promise().query(updateLandSiteQuery, [setSite, ldId]);
    } catch (err) {
        console.error(err.message);
    }
    res.json({})
})
minisiteRouter.post('/load_site_list', async (req, res) => {
    const filterKeyword = req.body.filter_keyword;
    let addQuery = ""
    let site_list = [];
    if (filterKeyword) {
        addQuery = `WHERE sl_site_name LIKE '%${filterKeyword}%'`
    }

    try {
        const getSiteListQuery = `SELECT * FROM site_list ${addQuery}`;

        const [siteListRows] = await sql_con.promise().query(getSiteListQuery);
        site_list = siteListRows;
    } catch (error) {

    }
    res.json({ site_list });
})

minisiteRouter.post('/load_land_minisite', async (req, res) => {

    let land_minisite_data = [];
    // let allCount = 0;
    // let allPage = 0;
    // let onePageCount = 10;
    // const nowPage = req.body.nowPage || 1;
    try {
        // const getLandMinisiteCountQuery = "SELECT count(*) AS m1Count FROM hy_site";
        // const [countRows] = await sql_con.promise().query(getLandMinisiteCountQuery);
        // allCount = countRows[0].m1Count;
        // allPage = Math.ceil(allCount / onePageCount);
        // const startCount = (nowPage - 1) * onePageCount;


        const getLandMinisiteQuery = `SELECT * FROM land ORDER BY ld_id DESC`;
        const [landMiniSiteRows] = await sql_con.promise().query(getLandMinisiteQuery);
        land_minisite_data = landMiniSiteRows;
    } catch (err) {
        console.error(err.message);
    }



    res.json({ land_minisite_data })
})

minisiteRouter.get('/', (req, res) => {
    res.send('asldfjalisjdfliajsdf')
})


// 아래는 미니 사이트1 !!!!!!!!!!!!

minisiteRouter.post('/copy_hy_data', async (req, res) => {
    const body = req.body;

    try {
        const getHyDataQuery = "SELECT * FROM hy_site WHERE hy_id = ?";
        const [getHyDataRow] = await sql_con.promise().query(getHyDataQuery, body.copyData.hy_id);
        const getHyData = getHyDataRow[0];

        delete getHyData.hy_creted_at
        delete getHyData.hy_id

        const originHyNum = getHyData.hy_num
        for (const key in getHyData) {
            const val = getHyData[key];
            if (val && typeof val === 'string') {
                if (getHyData[key].includes(originHyNum)) {
                    getHyData[key] = getHyData[key].replaceAll(originHyNum, body.copyId)
                }
            }
        }
        

        // 폴더 복사 시작욤
        const getOldFolder = path.join(process.cwd(), 'public', 'uploads', 'image', originHyNum);
        const getNewFolder = path.join(process.cwd(), 'public', 'uploads', 'image', body.copyId);
        if (fs.existsSync(getOldFolder)) {
            fs.copySync(getOldFolder, getNewFolder);
        } else {
        }

        const queryStr = getQueryStr(getHyData, 'insert', 'hy_creted_at')
        const addHyDataQuery = `INSERT INTO hy_site (${queryStr.str}) VALUES (${queryStr.question})`;
        await sql_con.promise().query(addHyDataQuery, queryStr.values);
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ message: '아이디 값이 중복됩니다.' })
    }

    return res.json({})
})


minisiteRouter.post('/delete_hy_raw', async (req, res) => {
    const deleteData = req.body.deleteData;
    for (let i = 0; i < deleteData.length; i++) {
        const data = deleteData[i];
        const deletePath = `./public/uploads/image/${data.hy_num}`
        deleteFolder(deletePath)
        try {
            const deleteHyRawQuery = "DELETE FROM hy_site WHERE hy_id = ?";
            await sql_con.promise().query(deleteHyRawQuery, data.hy_id);
        } catch (error) {
        }
    }
    res.json({})
})
minisiteRouter.post('/update_hy_raw', async (req, res) => {
    const updateData = req.body.updateData;
    let duplication_num = 0;
    for (let i = 0; i < updateData.length; i++) {
        const data = updateData[i];
        const hyId = data.hy_id;
        delete data.hy_id;
        const queryStr = getQueryStr(data, 'update');
        queryStr.values.push(hyId);

        try {
            const updateHyRawQuery = `UPDATE hy_site SET ${queryStr.str} WHERE hy_id = ?`;
            await sql_con.promise().query(updateHyRawQuery, queryStr.values);
        } catch (error) {
            console.error(error.message);

            duplication_num++
        }
    }

    res.json({ duplication_num })
})


minisiteRouter.post('/update_hy_data', async (req, res) => {
    const hySiteData = req.body

    const hyId = hySiteData.hy_id;
    delete hySiteData.hy_id;
    hySiteData.hy_creted_at = moment(hySiteData.hy_creted_at).format('YYYY-MM-DD HH:mm:ss');
    const queryStr = getQueryStr(hySiteData, 'update');
    queryStr.values.push(hyId)

    try {
        const hySiteUpdateQuery = `UPDATE hy_site SET ${queryStr.str} WHERE hy_id = ?`;
        await sql_con.promise().query(hySiteUpdateQuery, queryStr.values);
    } catch (err) {
        console.error(err.message);
    }
    res.json({})
})

minisiteRouter.post('/load_hy_data', async (req, res) => {
    const hyId = req.body.getHyId;
    let hyData = {}
    try {
        const getHyDattaQuery = "SELECT * FROM hy_site WHERE hy_id = ? ";
        const [hyDataRows] = await sql_con.promise().query(getHyDattaQuery, [hyId.id]);
        hyData = hyDataRows[0]

    } catch (err) {
        console.error(err.message);
    }

    res.json({ hyData })
})

minisiteRouter.post('/load_minisite', async (req, res) => {

    let minisiteData = [];
    let allCount = 0;
    let allPage = 0;
    let onePageCount = 10;
    const nowPage = req.body.nowPage || 1;
    const search = req.body.search || "";
    let searchStr = "";


    let site_list = [];
    if (search) {
        searchStr = `WHERE hy_title LIKE '%${search}%'`;
    }

    try {
        const getMinisite1CountQuery = `SELECT count(*) AS m1Count FROM hy_site ${searchStr}`;

        const [countRows] = await sql_con.promise().query(getMinisite1CountQuery);
        allCount = countRows[0].m1Count;
        allPage = Math.ceil(allCount / onePageCount);
        const startCount = (nowPage - 1) * onePageCount;


        const getMinisite1Query = `SELECT hy_id,hy_num,hy_title,hy_manage_site,hy_counter FROM hy_site ${searchStr} ORDER BY hy_id DESC LIMIT ${startCount}, ${onePageCount}`;
        const [miniSiteRows] = await sql_con.promise().query(getMinisite1Query);
        minisiteData = miniSiteRows;



        const getSiteListQuery = "SELECT sl_id, sl_site_name FROM site_list ORDER BY sl_id DESC";
        [site_list] = await sql_con.promise().query(getSiteListQuery);
    } catch (err) {
        console.error(err.message);
    }

    res.json({ minisiteData, allPage, site_list })
})


minisiteRouter.post('/update_minisite_manager', async (req, res) => {
    const body = req.body;

    try {
        const updateManageSiteQuery = "UPDATE hy_site SET hy_manage_site = ? WHERE hy_id = ?";
        await sql_con.promise().query(updateManageSiteQuery, [body.get_site, body.hy_id]);
    } catch (error) {

    }

    res.json({})
})




// 미니사이트 ONE 단일 페이지!!!!!!!!!!!!!!!!!

minisiteRouter.post('/delete_minisite_one_raw', async (req, res) => {


    const deleteData = req.body.deleteData;

    for (let i = 0; i < deleteData.length; i++) {
        const data = deleteData[i];
        const deletePath = `./public/uploads/image/${data.hy_page_id}`
        deleteFolder(deletePath)
        try {
            const deleteHyRawQuery = "DELETE FROM hy_site_one WHERE hy_id = ?";
            await sql_con.promise().query(deleteHyRawQuery, data.hy_id);
        } catch (error) {
            return res.status(400).json({ message: '삭제 실패! 다시 시도해주세요!' })
        }
    }
    return res.json({})
})


minisiteRouter.post('/copy_minisite_one', async (req, res) => {
    const body = req.body;
    let copyData = {}

    // 먼저 원래 page id 값 변수 지정 (나중에 데이터에서 삭제되니까~)
    const originalPageId = body.copyData.hy_page_id
    // DB 내용 불러오기
    try {
        const getCopyDataQuery = "SELECT * FROM hy_site_one WHERE hy_id = ?";
        const [getCopyData] = await sql_con.promise().query(getCopyDataQuery, [body.copyData.hy_id]);
        copyData = getCopyData[0];
    } catch (error) {
        return res.status(400).json({ message: '불러오기 실패! 다시 시도해주세요!' })
    }

    try {
        // 복사할 데이터 셋팅

        // 일단 뺄거 빼고 페이지 아이디 값은 새로 지정~
        delete copyData.hy_id;
        delete copyData.hy_creted_at;
        delete copyData.hy_page_id;
        copyData['hy_page_id'] = body.copyId

        // DB 내 이미지 파일들 지정된 폴더명 변경 해주기
        for (const key in copyData) {
            const val = copyData[key];
            if (val && typeof val === 'string') {
                if (copyData[key].includes(originalPageId) && copyData[key].includes('img')) {
                    copyData[key] = copyData[key].replaceAll(`img/${originalPageId}/`, `img/${body.copyId}/`);
                }
            }

        }
        // DB 복사 시작욤
        const queryStr = getQueryStr(copyData, 'insert', 'hy_creted_at');
        const insertQuery = `INSERT INTO hy_site_one (${queryStr.str}) VALUES (${queryStr.question})`;
        await sql_con.promise().query(insertQuery, queryStr.values);

        // 폴더 복사 시작욤
        const getOldFolder = path.join(process.cwd(), 'public', 'uploads', 'image', body.copyData.hy_page_id);
        const getNewFolder = path.join(process.cwd(), 'public', 'uploads', 'image', body.copyId);

        if (fs.existsSync(getOldFolder)) {
            fs.copySync(getOldFolder, getNewFolder);
        } else {
        }


    } catch (err) {
        console.error(err.message);

        return res.status(400).json({ message: '아이디 값이 중복됩니다.' })
    }


    return res.json({})
})

// 미니사이트one 리스트 불러오기! (전체 리스트 및 수정 페이지)
minisiteRouter.post('/load_minisite_one', async (req, res) => {

    let minisiteData = [];
    let allCount = 0;
    let allPage = 0;
    let onePageCount = 10;
    const nowPage = req.body.nowPage || 1;
    const search = req.body.search || "";

    let searchStr = "";
    if (search) {
        searchStr = `WHERE hy_title LIKE '%${search}%'`;
    }

    try {
        const getMinisite1CountQuery = `SELECT count(*) AS m1Count FROM hy_site_one ${searchStr}`;

        const [countRows] = await sql_con.promise().query(getMinisite1CountQuery);
        allCount = countRows[0].m1Count;
        allPage = Math.ceil(allCount / onePageCount);
        const startCount = (nowPage - 1) * onePageCount;


        const getMinisite1Query = `SELECT hy_id,hy_page_id,hy_title,hy_counter FROM hy_site_one ${searchStr} ORDER BY hy_id DESC LIMIT ${startCount}, ${onePageCount}`;
        const [miniSiteRows] = await sql_con.promise().query(getMinisite1Query);
        minisiteData = miniSiteRows;

    } catch (err) {
        '진따 에러가 나는거야?'
        console.error(err.message);
    }

    res.json({ minisiteData, allPage })
})



// 현장 추가 (뒤에 주소 추가하기)
minisiteRouter.post('/add_hy_site_one', async (req, res) => {
    const hy_page_id = req.body.hy_page_id;
    const hy_title = req.body.hy_title;
    const hy_site = req.body.hy_site
    const now = moment().format('YYYY-MM-DD HH:mm:ss');

    let err_message = "";
    try {
        const addHySiteQuery = `INSERT INTO hy_site_one (hy_page_id, hy_title, hy_site, hy_creted_at) VALUES (?,?,?,?)`;
        await sql_con.promise().query(addHySiteQuery, [hy_page_id, hy_title, hy_site, now]);
    } catch (err) {
        err_message = err.message;
        console.error(err_message);
    }

    res.json({ err_message })
})

// 사이트 리스트 불러오기! (hy_site / hy_site_one 페이지 두개 동일하게 쓰는중!)
minisiteRouter.post('/get_site_list', async (req, res) => {
    let site_list = [];
    const searchSite = req.body.search_site
    let addQuery = ""
    if (searchSite) {
        addQuery = `WHERE sl_site_name LIKE '%${searchSite}%'`
    }
    try {
        const getSiteListQuery = `SELECT sl_id,sl_site_name FROM site_list ${addQuery} ORDER BY sl_id DESC`;
        [site_list] = await sql_con.promise().query(getSiteListQuery);

    } catch (error) {

    }

    res.json({ site_list })
})

// hy_site_one 페이지 데이터 불러오기!!
minisiteRouter.post('/load_hy_data_one', async (req, res) => {
    const hyId = req.body.getHyId;
    let hyData = {}
    let con_site = ""
    try {
        const getHyDattaQuery = "SELECT * FROM hy_site_one WHERE hy_id = ? ";
        const [hyDataRows] = await sql_con.promise().query(getHyDattaQuery, [hyId.id]);
        hyData = hyDataRows[0]

        const getConSite = "SELECT sl_site_name FROM site_list WHERE sl_id = ?"
        const [conSite] = await sql_con.promise().query(getConSite, [hyData.hy_site]);
        con_site = conSite[0]
    } catch (err) {
        console.error(err.message);
    }

    res.json({ hyData, con_site })
})


// hy_site_one 페이지 데이터 업데이트!!!
minisiteRouter.post('/update_hy_data_one', async (req, res) => {
    const hySiteData = req.body

    const hyId = hySiteData.hy_id;
    delete hySiteData.hy_id;
    hySiteData.hy_creted_at = moment(hySiteData.hy_creted_at).format('YYYY-MM-DD HH:mm:ss');
    const queryStr = getQueryStr(hySiteData, 'update');
    queryStr.values.push(hyId)

    try {
        const hySiteUpdateQuery = `UPDATE hy_site_one SET ${queryStr.str} WHERE hy_id = ?`;
        await sql_con.promise().query(hySiteUpdateQuery, queryStr.values);
    } catch (err) {
        console.error(err.message);
    }
    res.json({})
})

// 연결 현장 변경하기!! (site_id 값으로 다 하자!)
minisiteRouter.post('/change_hy_site', async (req, res) => {
    const hyId = req.body.hy_id
    const siteId = req.body.site_id

    let site_name = ""

    try {
        const updateHySiteQuery = "UPDATE hy_site_one SET hy_site = ? WHERE hy_id = ?";
        await sql_con.promise().query(updateHySiteQuery, [siteId, hyId]);
        const getSiteNameQuery = "SELECT sl_site_name FROM site_list WHERE sl_id = ?"
        const [getSiteName] = await sql_con.promise().query(getSiteNameQuery, [siteId]);
        site_name = getSiteName[0]['sl_site_name']
    } catch (error) {

    }

    res.json({ site_name })
})

// 방문자수 올리기 + hy_site_one 방문자 기록 테이블에 업로드 하기!!
minisiteRouter.post('/update_visit_count', async (req, res) => {

    const b = req.body
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    b['st_ip'] = ipAddress
    b['st_ua'] = userAgent

    try {
        const visitCount = b.st_visit_count
        const updateHySiteOneCountQuery = "UPDATE hy_site_one SET hy_counter = ? WHERE hy_page_id = ?";
        await sql_con.promise().query(updateHySiteOneCountQuery, [visitCount, b.st_page_id]);
        delete b.st_visit_count
        const queryStr = getQueryStr(b, 'insert', 'st_created_at')
        const insertSiteVisitQuery = `INSERT INTO hy_site_visit (${queryStr.str}) VALUES (${queryStr.question})`;
        await sql_con.promise().query(insertSiteVisitQuery, queryStr.values);
    } catch (error) {
        console.error(error.message);

    }

    res.json({})
})

// 전화번호나 SMS 버튼 클릭 했을때 카운트 올리기!!
minisiteRouter.post('/update_call_sms_count', async (req, res) => {
    const b = req.body;

    try {
        let tableName = ""
        if (b.type == 'call') {
            tableName = "hy_call_count"
        } else {
            tableName = "hy_sms_count"
        }
        const updateCallOrSmsCountQuery = `UPDATE hy_site_one SET ${tableName} = ? WHERE hy_page_id = ?`;
        await sql_con.promise().query(updateCallOrSmsCountQuery, [b.setCount, b.page_id]);
    } catch (err) {
        console.error(err.message);
    }

    res.json({})
})


minisiteRouter.post('/upload_form_data', async (req, res) => {
    const b = req.body;

    try {
        const getSiteNameQuery = "SELECT sl_site_name FROM site_list WHERE sl_id = ?";
        const [getSiteName] = await sql_con.promise().query(getSiteNameQuery, [b.site_id]);
        const siteName = getSiteName[0]['sl_site_name']
        const now = moment().format('YYYY-MM-DD HH:mm:ss');
        const uploadFormQuery = "INSERT INTO application_form (af_form_name,af_form_type_in, af_form_location, af_mb_name, af_mb_phone, af_created_at) VALUES (?,?,?,?,?,?)"
        await sql_con.promise().query(uploadFormQuery, [siteName, '분양', 'mini-one', b.name, b.phone, now]);


        const getManagerQuery = `SELECT * FROM users WHERE manage_estate LIKE '%${siteName}%'`
        const [getManager] = await sql_con.promise().query(getManagerQuery);

        if (getManager && getManager.length > 0) {
            const kakaoObj = {
                ciReceiver: b.phone,
                ciSite: siteName,
                ciName: b.name,
            }

            for (let i = 0; i < getManager.length; i++) {
                const m = getManager[i];
                kakaoObj['ciPhone'] = m.user_phone;
                aligoKakaoNotification_formanager(req, kakaoObj)
            }
        }

    } catch (err) {
        console.error(err.message);
    }
    res.json({})
})






minisiteRouter.get('/', (req, res) => {
    res.send('asldfjalisjdfliajsdf')
})


export { minisiteRouter }