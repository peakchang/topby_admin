import express from "express";
import { sql_con } from '../back-lib/db.js'
import { getQueryStr } from '../back-lib/lib.js';
const minisite1Router = express.Router();

minisite1Router.post('/load_minisite', async (req, res) => {

    let minisiteData = [];
    let allCount = 0;
    let allPage = 0;
    let onePageCount = 10;
    const nowPage = req.body.nowPage || 1;
    try {
        const getMinisite1CountQuery = "SELECT count(*) AS m1Count FROM hy_site";
        const [countRows] = await sql_con.promise().query(getMinisite1CountQuery);
        allCount = countRows[0].m1Count;
        console.log(allCount);
        allPage = Math.ceil(allCount / onePageCount);
        const startCount = (nowPage - 1) * onePageCount;


        const getMinisite1Query = `SELECT hy_id,hy_num,hy_title,hy_counter FROM hy_site ORDER BY hy_id DESC LIMIT ${startCount}, ${onePageCount}`;
        const [miniSiteRows] = await sql_con.promise().query(getMinisite1Query);
        minisiteData = miniSiteRows;
    } catch (err) {
        console.error(err.message);
    }

    res.json({ minisiteData, allPage })
})

minisite1Router.get('/', (req, res) => {
    res.send('asldfjalisjdfliajsdf')
})


export { minisite1Router }