import express from "express";
import { sql_con } from '../back-lib/db.js'
import { getQueryStr } from '../back-lib/lib.js';
import moment from "moment-timezone";

const adminAllDbRouter = express.Router();

adminAllDbRouter.post('/load_data', async (req, res) => {
    let datas = [];
    let afAllCount = 0;

    try {
        const getAllCountApFormQuery = "SELECT count(*) AS af_count FROM application_form";
        const [countRows] = await sql_con.promise().query(getAllCountApFormQuery);
        afAllCount = countRows[0].af_count;

        const formStatusDataQuery = "SELECT * FROM application_form ORDER BY af_id DESC LIMIT 0, 30;"
        const [formStatusData] = await sql_con.promise().query(formStatusDataQuery);
        datas = formStatusData;
    } catch (error) {

    }
    
    console.log(datas);
    console.log(afAllCount);
    

    res.json({ datas, afAllCount })
})

export { adminAllDbRouter }