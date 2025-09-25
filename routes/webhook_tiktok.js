import express from "express";
import moment from "moment-timezone";
import fs from "fs";
import path from "path";
import { mailSender, aligoKakaoNotification_formanager } from '../back-lib/lib.js';
import request from "request"
import { sql_con } from '../back-lib/db.js'
import axios from "axios";
import aligoapi from 'aligoapi'

// ---------

const tiktokRouter = express.Router();

tiktokRouter.get('/', (req, res) => {
    console.log('만들어짐!?!?!?!?!??!?!');
    let status = true;
    res.json({ status })
});

tiktokRouter.post('/', (req, res) => {
    console.log('진입함?!?!?!?!?!??!?!');
    let status = true;
    res.json({ status })
});

export { tiktokRouter }