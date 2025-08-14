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


ALTER TABLE land ADD COLUMN ld_location VARCHAR(50) AFTER ld_name;
ALTER TABLE land ADD COLUMN ld_mobile_bt_event_img VARCHAR(255) AFTER ld_popup_img;
ALTER TABLE land ADD COLUMN ld_mobile_bt_phone_img VARCHAR(255) AFTER ld_popup_img;
ALTER TABLE land ADD COLUMN ld_event_img VARCHAR(255) AFTER ld_popup_img;
ALTER TABLE land ADD COLUMN ld_sms_content VARCHAR(255) AFTER ld_sms_clickcount;

ALTER TABLE land ADD COLUMN ld_json_menus TEXT AFTER ld_ft_address;
ALTER TABLE land ADD COLUMN ld_json_main TEXT AFTER ld_ft_address;
ALTER TABLE land ADD COLUMN ld_json_header TEXT AFTER ld_ft_address;

ALTER TABLE land ADD COLUMN ld_personal_info_view VARCHAR(10) AFTER ld_json_menus;
ALTER TABLE land ADD COLUMN ld_view_type VARCHAR(10) AFTER ld_personal_info_view;
ALTER TABLE land ADD COLUMN ld_db_input_subject VARCHAR(10) AFTER ld_add_scripts;
ALTER TABLE land ADD COLUMN ld_card_image TEXT AFTER ld_main_img;

ALTER TABLE land ADD COLUMN ld_invite_message TEXT AFTER ld_db_input_subject;
ALTER TABLE land MODIFY COLUMN ld_db_input_subject VARCHAR(100);




아래 두개 XXXX
ALTER TABLE land ADD COLUMN ld_card_image TEXT AFTER ld_main_img;
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


CREATE TABLE IF NOT EXISTS land (
    ld_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ld_domain VARCHAR(50),
    ld_site VARCHAR(100),
    ld_menu VARCHAR(255),
    ld_name VARCHAR(100),
    ld_location VARCHAR(50),
    ld_description VARCHAR(255),
    ld_add_scripts TEXT,
    ld_db_input_subject VARCHAR(10),
    ld_invite_message TEXT,
    ld_logo VARCHAR(100),
    ld_ph_img VARCHAR(100),
    ld_bgcolor VARCHAR(50),
    ld_txtcolor VARCHAR(50),
    ld_manager_email VARCHAR(100),
    ld_phone_num VARCHAR(100),
    ld_sms_num VARCHAR(100),
    ld_kakao VARCHAR(255),
    ld_banner_img TEXT,
    ld_main_img TEXT,
    ld_card_image TEXT,
    ld_invite_image VARCHAR(250),
    ld_pg0 TEXT,
    ld_pg1 TEXT,
    ld_pg2 TEXT,
    ld_pg3 TEXT,
    ld_pg4 TEXT,
    ld_popup_img VARCHAR(255),
    ld_mobile_bt_event_img VARCHAR(255),
    ld_mobile_bt_phone_img VARCHAR(255),
    ld_event_img VARCHAR(255),
    ld_db_location VARCHAR(10),
    ld_visit_count INT DEFAULT 0,
    ld_call_clickcount INT DEFAULT 0,
    ld_sms_clickcount INT DEFAULT 0,
    ld_sms_content VARCHAR(255),
    ld_footer TEXT,
    ld_ft_name VARCHAR(50),
    ld_ft_phone VARCHAR(50),
    ld_ft_address VARCHAR(50),
    ld_json_header TEXT,
    ld_json_main TEXT,
    ld_json_menus TEXT,
    ld_personal_info_view VARCHAR(10),
    ld_view_type VARCHAR(10),
    ld_created_at DATETIME DEFAULT NULL
);



ALTER TABLE hy_site_one DROP COLUMN hy_form_ment;
ALTER TABLE hy_site_one ADD COLUMN hy_form_follow_img VARCHAR(255) AFTER hy_form_img;







0429 추가추가!!
ALTER TABLE hy_site ADD COLUMN hy_manage_site VARCHAR(100) AFTER hy_title;
ALTER TABLE site_list ADD CONSTRAINT unique_site UNIQUE (sl_site_name);


ALTER TABLE hy_site_one ADD COLUMN hy_form_location VARCHAR(255) AFTER hy_form_img;


CREATE TABLE IF NOT EXISTS hy_site_visit(
    st_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    st_page_id VARCHAR(100),
    st_ip VARCHAR(100),
    st_ua VARCHAR(255),
    st_referrer VARCHAR(100),
    st_created_at DATETIME
);

ALTER TABLE hy_site_one MODIFY hy_description TEXT;
*/