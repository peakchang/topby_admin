import express from "express";
import { sql_con } from '../back-lib/db.js'
import { getQueryStr } from '../back-lib/lib.js';
import moment from "moment-timezone";
import bcrypt from "bcrypt";
const mainRouter = express.Router();

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
            // const updateCounerPage = `UPDATE hy_site SET hy_counter = ? WHERE hy_num = ?`;
            // await sql_con.promise().query(updateCounerPage, [count, minisite_data.hy_num]);

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