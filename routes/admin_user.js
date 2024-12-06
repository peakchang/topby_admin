import express from "express";
import { sql_con } from '../back-lib/db.js'
import { getQueryStr } from '../back-lib/lib.js';
import moment from "moment-timezone";
const userManageRouter = express.Router();
userManageRouter.post('/load_users', async (req, res) => {
    let user_datas = [];
    let manager_datas = [];
    let allCount = 0;
    let allPage = 0;
    let onePageCount = 20;
    const nowPage = req.body.nowPage || 1;
    try {


        const getUserCountQuery = "SELECT count(*) AS userCount FROM users WHERE rate != 5";
        const [countRows] = await sql_con.promise().query(getUserCountQuery);
        allCount = countRows[0].userCount;
        console.log(allCount);
        allPage = Math.ceil(allCount / onePageCount);
        const startCount = (nowPage - 1) * onePageCount;

        const getManagerUserQuery = "SELECT * FROM users WHERE rate = 5"
        const [managerRows] = await sql_con.promise().query(getManagerUserQuery);
        manager_datas = managerRows;

        const getUsersQuery = `SELECT * FROM users WHERE rate != 5 ORDER BY id DESC LIMIT ${startCount}, ${onePageCount}`;
        const [userRows] = await sql_con.promise().query(getUsersQuery);
        user_datas = userRows;
        console.log(user_datas);

    } catch (err) {
        console.error(err.message);
    }

    res.json({ user_datas, allPage })
})

userManageRouter.post('/load_site_list', async (req, res) => {
    const siteSearchKeyword = req.body.site_search_keyword || "";
    let site_list = [];
    let addQuery = "";
    if (siteSearchKeyword) {
        addQuery = `WHERE sl_site_name LIKE '%${siteSearchKeyword}%'`;
    }
    try {
        const getSiteListQuery = `SELECT sl_id, sl_site_name FROM site_list  ${addQuery} ORDER BY sl_id DESC`;
        const [siteListRows] = await sql_con.promise().query(getSiteListQuery);
        site_list = siteListRows;
    } catch (err) {
        console.error(err.message);

    }
    console.log(site_list);


    res.json({ site_list })
})

export { userManageRouter }