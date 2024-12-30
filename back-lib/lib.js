import fs from 'fs'
import moment from "moment-timezone";
import path from 'path';
moment.tz.setDefault("Asia/Seoul");

export const getQueryStr = (data, type, addTimeStr = '') => {
    let returnData = {
        str: '',
        question: '',
        values: []
    }
    if (type == 'insert') {

        for (const key in data) {
            returnData['str'] = returnData['str'] + `${key},`
            returnData['question'] = returnData['question'] + `?,`
            returnData['values'].push(data[key])
        }

        if (addTimeStr) {
            const now = moment().format('YYYY-MM-DD HH:mm:ss')

            console.log(returnData['str']);
            returnData['str'] = returnData['str'] + addTimeStr;
            console.log(returnData['str']);
            returnData['question'] = returnData['question'] + '?';
            returnData['values'].push(now)
        } else {
            returnData['str'] = returnData['str'].replace(/,$/, '');
            returnData['question'] = returnData['question'].replace(/,$/, '');
        }

    } else if (type == 'update') {
        const now = moment().format('YYYY-MM-DD HH:mm:ss')
        for (const key in data) {
            returnData['str'] = returnData['str'] + `${key}=?,`
            returnData['values'].push(data[key])
        }

        if (addTimeStr) {
            returnData['str'] = returnData['str'] + `${addTimeStr} = ?`;
            returnData['values'].push(now)
        } else {
            returnData['str'] = returnData['str'].replace(/,$/, '');
        }

    }

    return returnData;
}


export function deleteFolder(folderPath) {
    const targetPath = path.resolve(folderPath);

    if (fs.existsSync(targetPath)) {
        fs.rmSync(targetPath, { recursive: true, force: true });
        console.log(`${targetPath} 폴더를 삭제했습니다.`);
    } else {
        console.log(`${targetPath} 폴더가 존재하지 않습니다.`);
    }
}


export function mailSender(reciever, subject, content) {

    var transporter = nodemailer.createTransport({
        service: 'naver',   // 메일 보내는 곳
        prot: 465,
        host: 'smtp.naver.com',
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.N_MAIL_ID,
            pass: process.env.N_MAIL_PWD
        }
    });
    // 메일 옵션
    var mailOptions = {
        from: `${process.env.N_MAIL_ID}@naver.com`, // 보내는 메일의 주소
        to: reciever, // 수신할 이메일
        subject: subject, // 메일 제목
        text: content // 메일 내용
    };

    // 메일 발송    
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            // console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

