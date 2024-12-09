import express from "express";
import { sql_con } from '../back-lib/db.js'
import { getQueryStr } from '../back-lib/lib.js';
import moment from "moment-timezone";
const minisiteRouter = express.Router();

minisiteRouter.post('/add_hy_site', async (req, res) => {
    const hy_num = req.body.hy_num;
    const hy_site_name = req.body.hy_site_name;
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    let err_message = "";
    try {
        const addHySiteQuery = `INSERT INTO hy_site (hy_num, hy_title, hy_creted_at) VALUES (?,?,?)`;
        await sql_con.promise().query(addHySiteQuery, [hy_num, hy_site_name, now]);
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
        console.log(getSiteListQuery);

        const [siteListRows] = await sql_con.promise().query(getSiteListQuery);
        site_list = siteListRows;
    } catch (error) {

    }
    console.log(site_list);
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
        // console.log(allCount);
        // allPage = Math.ceil(allCount / onePageCount);
        // const startCount = (nowPage - 1) * onePageCount;


        const getLandMinisiteQuery = `SELECT * FROM land ORDER BY ld_id DESC`;
        const [landMiniSiteRows] = await sql_con.promise().query(getLandMinisiteQuery);
        land_minisite_data = landMiniSiteRows;
    } catch (err) {
        console.error(err.message);
    }

    console.log(land_minisite_data);


    res.json({ land_minisite_data })
})

minisiteRouter.get('/', (req, res) => {
    res.send('asldfjalisjdfliajsdf')
})


// 아래는 미니 사이트1 !!!!!!!!!!!!




minisiteRouter.post('/delete_hy_raw', async (req, res) => {
    const deleteData = req.body.deleteData;
    for (let i = 0; i < deleteData.length; i++) {
        const data = deleteData[i];
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
    console.log(duplication_num);

    res.json({ duplication_num })
})


minisiteRouter.post('/update_hy_data', async (req, res) => {
    const hySiteData = req.body
    console.log(hySiteData);

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
        console.log(getHyDattaQuery);
        console.log(hyId);

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
    if (search) {
        searchStr = `WHERE hy_title LIKE '%${search}%'`;
    }

    try {
        const getMinisite1CountQuery = `SELECT count(*) AS m1Count FROM hy_site ${searchStr}`;
        console.log(getMinisite1CountQuery);

        const [countRows] = await sql_con.promise().query(getMinisite1CountQuery);
        allCount = countRows[0].m1Count;
        console.log(allCount);
        allPage = Math.ceil(allCount / onePageCount);
        const startCount = (nowPage - 1) * onePageCount;


        const getMinisite1Query = `SELECT hy_id,hy_num,hy_title,hy_counter FROM hy_site ${searchStr} ORDER BY hy_id DESC LIMIT ${startCount}, ${onePageCount}`;
        const [miniSiteRows] = await sql_con.promise().query(getMinisite1Query);
        minisiteData = miniSiteRows;
    } catch (err) {
        console.error(err.message);
    }

    res.json({ minisiteData, allPage })
})

minisiteRouter.get('/', (req, res) => {
    res.send('asldfjalisjdfliajsdf')
})


export { minisiteRouter }