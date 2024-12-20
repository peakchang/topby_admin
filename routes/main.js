import express from "express";
import { sql_con } from '../back-lib/db.js'
import { getQueryStr } from '../back-lib/lib.js';
import moment from "moment-timezone";
import bcrypt from "bcrypt";
const mainRouter = express.Router();

mainRouter.post('/load_minisite_info', async (req, res) => {
    const hyId = req.body.hy_id;
    console.log(hyId);

    let minisite_data = {};
    try {
        const getMinisiteDataQuery = "SELECT * FROM hy_site WHERE hy_num = ?"
        const [minisiteDataRows] = await sql_con.promise().query(getMinisiteDataQuery, [hyId]);
        minisite_data = minisiteDataRows[0]
    } catch (error) {

    }
    
    res.json({ minisite_data })
})

mainRouter.get('/load_footer', async (req, res) => {
    let footerData = {};
    try {
        const getFooterDataQuery = "SELECT * FROM form_status"
        const [footerDataRows] = await sql_con.promise().query(getFooterDataQuery);
        footerData = footerDataRows[0]
    } catch (error) {

    }
    res.json({ footerData })
})


export { mainRouter }