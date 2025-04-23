import mysql, {} from "mysql2"
import dotenv from "dotenv"
dotenv.config();


export const sql_con = mysql.createConnection({
    host: process.env.HOST || '127.0.0.1',
    user: 'root',
    password: process.env.DBPWD,
    database: process.env.SCHEMA
})


/*

ALTER TABLE users ADD COLUMN refresh_token TEXT DEFAULT NULL;
ALTER TABLE hy_site MODIFY COLUMN hy_main_image VARCHAR(255);
ALTER TABLE hy_site MODIFY COLUMN hy_card_image VARCHAR(255);


ALTER TABLE land ADD COLUMN ld_mobile_bt_event_img VARCHAR(255) AFTER ld_popup_img;
ld_mobile_bt_phone_img
ld_mobile_bt_event_img
ld_event_img

ALTER TABLE land ADD COLUMN ld_sms_content VARCHAR(255) AFTER ld_sms_clickcount;

ALTER TABLE land ADD COLUMN ld_json_menus TEXT AFTER ld_ft_address;
ALTER TABLE land ADD COLUMN ld_json_main TEXT AFTER ld_ft_address;
ALTER TABLE land ADD COLUMN ld_json_header TEXT AFTER ld_ft_address;

ALTER TABLE land ADD COLUMN ld_personal_info_view VARCHAR(10) AFTER ld_json_menus;

ALTER TABLE land ADD COLUMN ld_view_type VARCHAR(10) AFTER ld_personal_info_view;

ALTER TABLE land ADD COLUMN ld_db_input_subject VARCHAR(10) AFTER ld_add_scripts;

ALTER TABLE land ADD COLUMN ld_card_image TEXT AFTER ld_main_img;

ALTER TABLE land ADD COLUMN ld_card_image TEXT AFTER ld_main_img;


ALTER TABLE land ADD COLUMN ld_invite_message TEXT AFTER ld_db_input_subject;
ALTER TABLE land MODIFY COLUMN ld_db_input_subject VARCHAR(100);

ALTER TABLE land ADD COLUMN ld_invite_image VARCHAR(250) AFTER ld_card_image;
 
*/