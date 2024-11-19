import express from "express";
import multer from "multer";
import moment from "moment-timezone";
import fs from "fs";

const apiRouter = express.Router();

let img_upload = multer({
    storage: multer.diskStorage({
        // 경로를 설정
        destination(req, file, cb) {
            const setFolder = imgFolderChk();
            cb(null, setFolder);
        },
        filename(req, file, cb) {
            //파일명 설정
            cb(null, file.originalname);
        },
    }),
    // limits: { fileSize: 10 * 1024 * 1024 },
});

apiRouter.get('/', (req, res) => {
    res.send('asldfjalisjdfliajsdf')
})

apiRouter.post('/img_upload', img_upload.single('onimg'), (req, res, next) => {
    let status = true;
    let baseUrl
    let saveUrl

    try {
        const lastFolderArr = req.file.destination.split('/');
        const lastFolder = lastFolderArr[lastFolderArr.length - 1];
        var origin = req.get('host');
        baseUrl = req.protocol + '://' + origin + '/image/' + lastFolder + '/' + req.file.filename;
        saveUrl = req.file.path

    } catch (error) {
        status = false;
    }

    res.json({ status, baseUrl, saveUrl })
})

function imgFolderChk() {
    let setFolder
    const now = moment().format('YYMMDD')

    try {
        fs.readdirSync(`public`);
    } catch (error) {
        fs.mkdirSync(`public`);
    }


    try {
        fs.readdirSync(`public/uploads`);
    } catch (error) {
        fs.mkdirSync(`public/uploads`);
    }

    try {
        fs.readdirSync(`public/uploads/image`);
    } catch (error) {
        fs.mkdirSync(`public/uploads/image`);
    }

    try {
        fs.readdirSync(`public/uploads/image/img${now}`);
    } catch (error) {
        fs.mkdirSync(`public/uploads/image/img${now}`);
    }
    setFolder = `public/uploads/image/img${now}`


    return setFolder;
}

export { apiRouter }