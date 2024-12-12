import express from "express";
import { sql_con } from '../back-lib/db.js'
import { getQueryStr } from '../back-lib/lib.js';
import moment from "moment-timezone";
import bcrypt from "bcrypt";

const userManageRouter = express.Router();


userManageRouter.post('/update_user_site_list', async (req, res) => {
    const selectedEstateStr = req.body.selectedEstateStr;
    const userId = req.body.userId;
    try {
        const updateUserEstateQuery = "UPDATE users SET manage_estate = ? WHERE id = ?";
        await sql_con.promise().query(updateUserEstateQuery, [selectedEstateStr, userId])
    } catch (err) {
        console.error(err.message);
    }

    res.json({})
})

userManageRouter.post('/update_user_info', async (req, res) => {
    console.log('고고고고');

    const userInfo = req.body.user_info;
    const userId = userInfo.id;
    delete userInfo.id;
    let hashedPassword = ""
    userInfo.created_at = moment(userInfo.created_at).format('YYYY-MM-DD HH:mm:ss');
    if (userInfo.type == 'password') {
        hashedPassword = await bcrypt.hash(password, 10);
        userInfo.password = hashedPassword;
    } else {
        delete userInfo.password;
    }

    try {
        const queryStr = getQueryStr(userInfo, 'update');
        console.log(queryStr);
        const updateUserInfoQuery = `UPDATE users SET ${queryStr.str} WHERE id = ${userId}`;
        await sql_con.promise().query(updateUserInfoQuery, queryStr.values)
    } catch (err) {
        console.error(err.message);

    }


    res.json({})
})
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

    res.json({ user_datas, allPage, manager_datas })
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