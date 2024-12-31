import express from "express";
import { sql_con } from '../back-lib/db.js'
import { getQueryStr } from '../back-lib/lib.js';
import moment from "moment-timezone";
import bcrypt from "bcrypt";
const mainRouter = express.Router();




mainRouter.post('/update_normal', async (req, res) => {
    const updateList = req.body.copyList;
    console.log(updateList);

    let normalVal = "접수완료";
    try {
        const getStatusStr = "SELECT fs_estate_status FROM form_status;";
        const [statusRows] = await sql_con.promise().query(getStatusStr);
        normalVal = statusRows[0]['fs_estate_status'].split(',')[0]
    } catch (error) {

    }

    console.log(normalVal);
    for (let i = 0; i < updateList.length; i++) {
        try {
            const data = updateList[i];
            const updateDateNormal = "UPDATE application_form SET af_mb_status = ? WHERE af_id = ?";
            await sql_con.promise().query(updateDateNormal, [normalVal, data.af_id]);
        } catch (err) {
            console.error(err.message);

        }
    }

    res.json({})
})
mainRouter.post('/load_minisite_info', async (req, res) => {
    const hyId = req.body.hy_id;
    const userStatus = req.body.user_status;

    let minisite_data = {};

    res.cookie('visit', 'ok')

    try {
        const getMinisiteDataQuery = "SELECT * FROM hy_site WHERE hy_num = ?"
        const [minisiteDataRows] = await sql_con.promise().query(getMinisiteDataQuery, [hyId]);
        minisite_data = minisiteDataRows[0]
        if (!userStatus && !req.cookies.visit) {
            console.log('들어와?!');

            let count = 1;
            if (Number(minisite_data.hy_counter) > 0) {
                count = Number(minisite_data.hy_counter) + 1
            }
            const updateCounerPage = `UPDATE hy_site SET hy_counter = ? WHERE hy_num = ?`;
            await sql_con.promise().query(updateCounerPage, [count, minisite_data.hy_num]);

        } else {
            console.log('안들어와?!');
        }
    } catch (err) {
        console.error(err.message);
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