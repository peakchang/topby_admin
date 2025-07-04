import express from "express";
import { sql_con } from '../back-lib/db.js'
import { getQueryStr } from '../back-lib/lib.js';
import moment from "moment-timezone";

const adminAllDbRouter = express.Router();


adminAllDbRouter.post('/load_ex_data', async (req, res) => {
    const body = req.body;
    let queryStr = ''

    const startData = `${body.startDate} 00:00:00`;
    const endData = `${body.endDate} 23:59:59`;

    let ex_data = [];

    queryStr = `WHERE af_created_at BETWEEN '${startData}' AND '${endData}'`
    if (body.setSite != 'base') {
        queryStr += ` AND af_form_name = '${body.setSite}'`
    }
    if (body.setStatus != 'base') {
        queryStr += ` AND af_mb_status = '${body.setStatus}'`
    }

    try {
        const loadDataQuery = `WITH ranked AS (
            SELECT *, 
            ROW_NUMBER() OVER (
                PARTITION BY af_mb_name, af_mb_phone         
            ) AS rn
        FROM application_form
        ${queryStr})
        SELECT af_form_name, af_mb_name, af_mb_phone, af_mb_status, af_created_at FROM ranked WHERE rn = 1 ORDER BY af_created_at DESC;
        `
        const result = await sql_con.promise().query(loadDataQuery);

        console.log(result);

        ex_data = result[0];
        console.log(ex_data.length);

    } catch (error) {

    }




    res.json({ ex_data })
})

adminAllDbRouter.post('/delete_list', async (req, res) => {
    const deleteList = req.body.delete_list;
    console.log(deleteList);

    for (let i = 0; i < deleteList.length; i++) {
        const data = deleteList[i];
        console.log(data);

        try {
            const deleteQuery = "DELETE FROM application_form WHERE af_id = ?";
            await sql_con.promise().query(deleteQuery, [data]);
        } catch (error) {
            console.error(error.message);

        }


    }
    res.json({})
})

adminAllDbRouter.post('/delete_memo', async (req, res) => {
    const getIdx = req.body.getIdx;
    try {
        const deleteMemoQuery = "DELETE FROM memos WHERE mo_id = ?";
        await sql_con.promise().query(deleteMemoQuery, [getIdx]);
    } catch (error) {

    }
    res.json({})
})

adminAllDbRouter.post('/update_status', async (req, res) => {
    const data = req.body.data;
    try {
        const updateStatusQuery = "UPDATE application_form SET af_mb_status = ? WHERE af_id = ?";
        await sql_con.promise().query(updateStatusQuery, [data.af_mb_status, data.af_id]);
    } catch (error) {

    }
    res.json({})
})

adminAllDbRouter.post('/add_memo_content', async (req, res) => {
    const body = req.body;
    try {
        const insertMemoQuery = "INSERT INTO memos (mo_depend_id,mo_manager,mo_memo) VALUES (?,?,?)";
        await sql_con.promise().query(insertMemoQuery, [body.af_id, body.manager, body.add_memo_content]);
    } catch (error) {

    }
    res.json({})
})

adminAllDbRouter.post('/load_customer_info', async (req, res) => {

    const body = req.body;
    let customer_info = {}
    try {
        const getCustomerInfoQuery = `SELECT 
            c.*,
            m_all.memos,
            m_all.managers,
            m_all.ids,
            m_all.createds
        FROM application_form c
        LEFT JOIN (
            SELECT 
            mo_depend_id, 
            GROUP_CONCAT(mo_memo SEPARATOR '||') AS memos,
            GROUP_CONCAT(mo_id SEPARATOR ',') AS ids,
            GROUP_CONCAT(mo_manager SEPARATOR ',') AS managers,
            GROUP_CONCAT(mo_created_at SEPARATOR ',') AS createds
            FROM memos
            GROUP BY mo_depend_id
        ) m_all ON c.af_id = m_all.mo_depend_id
        WHERE c.af_id = ${body.customer_id};
        `
        const [customerInfoRows] = await sql_con.promise().query(getCustomerInfoQuery);

        customer_info = customerInfoRows[0]

    } catch (error) {

    }

    res.json({ customer_info })
})
adminAllDbRouter.post('/load_data', async (req, res) => {
    let datas = [];
    let allCount = 0;
    let allPage = 0;
    let onePageCount = Number(req.body.one_page_count);
    let nowPage = Number(req.body.nowPage)

    let site_list = [];
    let status_list = [];
    let status_color_list = [];

    const startDate = req.body.start_date + " 00:00:00"
    const endDate = req.body.end_date + " 23:59:59"
    const filterSite = req.body.filterSite
    const setStatus = req.body.setStatus
    const setSite = req.body.setSite

    let addQuery = "";
    if (startDate && endDate) {
        addQuery = `WHERE af_created_at BETWEEN '${startDate}' AND '${endDate}'`;
    }

    if (setStatus) {
        addQuery += ` AND af_form_status = '${setStatus}'`;
    }

    if (setSite) {
        addQuery += ` AND af_form_name = '${setSite}'`;
    }

    let statusAddQuery = "";
    if (filterSite) {
        statusAddQuery = `WHERE sl_site_name LIKE '%${filterSite}%'`;
    }

    try {

        // 상태값 / 상태값 컬러 구하기
        const getStatusQuery = "SELECT * FROM form_status WHERE fs_id = 1";
        const [statusRows] = await sql_con.promise().query(getStatusQuery);

        status_list = statusRows[0].fs_estate_status.split(',');
        status_color_list = statusRows[0].fs_estate_status_color.split(',');

        // 사이트 리스트 구하기
        const getSiteListQuery = `SELECT sl_id, sl_site_name FROM site_list ${statusAddQuery} ORDER BY sl_id DESC;`;
        const [siteListRows] = await sql_con.promise().query(getSiteListQuery);
        site_list = siteListRows;
        // const getAllCountApFormQuery = `SELECT count(*) AS af_count FROM application_form`;
        // const getAllCountApFormQuery = `SELECT count(*) AS af_count
        //     FROM application_form t
        //     JOIN (
        //         SELECT 
        //         af_form_name, 
        //         af_mb_phone, 
        //         MAX(af_id) AS max_af_id
        //         FROM application_form
        //         ${addQuery}
        //         GROUP BY af_form_name, af_mb_phone
        //     ) AS g ON g.af_form_name = t.af_form_name
        //         AND g.af_mb_phone = t.af_mb_phone
        //         AND g.max_af_id = t.af_id`;

        const getAllCountApFormQuery = `SELECT COUNT(*) AS af_count
                FROM application_form t
                JOIN (
                    SELECT 
                    COALESCE(af_form_name, '__NULL__') AS af_form_name,
                    af_mb_phone, 
                    MAX(af_id) AS max_af_id
                    FROM application_form
                    ${addQuery}
                    GROUP BY COALESCE(af_form_name, '__NULL__'), af_mb_phone
                ) AS g 
                    ON COALESCE(g.af_form_name, '__NULL__') = COALESCE(t.af_form_name, '__NULL__')
                    AND g.af_mb_phone = t.af_mb_phone
                    AND g.max_af_id = t.af_id;`;
        const [countRows] = await sql_con.promise().query(getAllCountApFormQuery);
        allCount = countRows[0].af_count;
        allPage = Math.ceil(allCount / onePageCount);
        const startCount = (nowPage - 1) * onePageCount
        // const formStatusDataQuery = `SELECT * FROM application_form ${addQuery} ORDER BY af_id DESC LIMIT 0, ${onePageCount};`
        // const formStatusDataQuery = `SELECT 
        //     t.af_id, 
        //     t.af_form_name, 
        //     t.af_mb_phone, 
        //     t.af_mb_name, 
        //     t.af_mb_status,
        //     t.af_created_at
        //     FROM application_form t
        //     JOIN (
        //         SELECT 
        //         af_form_name, 
        //         af_mb_phone, 
        //         MAX(af_id) AS max_af_id
        //         FROM application_form
        //         ${addQuery}
        //         GROUP BY af_form_name, af_mb_phone
        //     ) AS g ON g.af_form_name = t.af_form_name
        //         AND g.af_mb_phone = t.af_mb_phone
        //         AND g.max_af_id = t.af_id
        //     ORDER BY t.af_id DESC
        //     LIMIT ${startCount},${onePageCount};`

        const formStatusDataQuery = `SELECT 
            t.af_id, 
            t.af_form_name, 
            t.af_mb_phone, 
            t.af_mb_name, 
            t.af_mb_status,
            t.af_created_at,
            GROUP_CONCAT(m.mo_memo ORDER BY m.mo_created_at DESC SEPARATOR ', ') AS memo_contents,
            GROUP_CONCAT(m.mo_created_at ORDER BY m.mo_created_at DESC SEPARATOR ', ') AS memo_dates 
            FROM application_form t
            JOIN (
                SELECT 
                af_form_name, 
                af_mb_phone, 
                MAX(af_id) AS max_af_id 
                FROM application_form 
                ${addQuery}
                GROUP BY af_form_name, af_mb_phone
            ) AS g ON g.af_form_name = t.af_form_name
                AND g.af_mb_phone = t.af_mb_phone
                AND g.max_af_id = t.af_id
                LEFT JOIN memos m ON m.mo_depend_id = t.af_id
                GROUP BY t.af_id, t.af_form_name, t.af_mb_phone, t.af_mb_name, t.af_mb_status, t.af_created_at
            ORDER BY t.af_id DESC LIMIT ${startCount},${onePageCount};`


        const [formStatusData] = await sql_con.promise().query(formStatusDataQuery);
        datas = formStatusData;
    } catch (err) {
        console.error(err.message);
    }

    res.json({ datas, allPage, allCount, site_list, status_list, status_color_list })
})

export { adminAllDbRouter }