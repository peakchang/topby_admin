import mysql, { } from "mysql2"
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
 
CREATE TABLE IF NOT EXISTS hy_site_one(
    hy_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    hy_page_id VARCHAR(100) UNIQUE,
    hy_site VARCHAR(100),
    hy_title VARCHAR(100),
    hy_description VARCHAR(255),
    hy_add_script TEXT,
    hy_main_image VARCHAR(255),
    hy_image_list TEXT,
    hy_form_img VARCHAR(255),
    hy_form_follow_img VARCHAR(255),
    hy_form_btn_img VARCHAR(255),
    hy_card_image VARCHAR(255),
    hy_callnumber VARCHAR(50),
    hy_sms VARCHAR(50),
    hy_sms_content VARCHAR(255),
    hy_ft_phone_img VARCHAR(255),
    hy_ft_sms_img VARCHAR(255),
    hy_counter INT NOT NULL DEFAULT 0,
    hy_call_count INT NOT NULL DEFAULT 0,
    hy_sms_count INT NOT NULL DEFAULT 0,
    hy_footer VARCHAR(255),
    hy_creted_at DATETIME 
);



ALTER TABLE hy_site_one DROP COLUMN hy_form_ment;
ALTER TABLE hy_site_one ADD COLUMN hy_form_follow_img VARCHAR(255) AFTER hy_form_img;



ALTER TABLE hy_site ADD COLUMN hy_manage_site VARCHAR(100) AFTER hy_title;

*/