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