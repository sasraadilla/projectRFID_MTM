-- ============================================================
-- DATABASE: db_troli
-- SISTEM:   Controlling Packaging – IoT RFID
-- COMPANY:  PT Menara Terus Makmur (Astra Otoparts Group)
-- VERSION:  2.0 Production-Ready
-- DATE:     2026-02-24
-- ENGINE:   InnoDB | CHARSET: utf8mb4 | MySQL 8.0+
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET FOREIGN_KEY_CHECKS = 0;
SET time_zone = "+07:00";
SET NAMES utf8mb4;

-- Buat database jika belum ada, lalu gunakan
CREATE DATABASE IF NOT EXISTS `db_troli`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `db_troli`;

START TRANSACTION;

-- ============================================================
-- DROP EXISTING TABLES (urut dari child → parent)
-- ============================================================
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `forecast_input`;
DROP TABLE IF EXISTS `forecast_month`;
DROP TABLE IF EXISTS `actual_packaging`;
DROP TABLE IF EXISTS `kebutuhan_packaging`;
DROP TABLE IF EXISTS `repairs`;
DROP TABLE IF EXISTS `asset_events`;
DROP TABLE IF EXISTS `assets`;
DROP TABLE IF EXISTS `rfid_tags`;
DROP TABLE IF EXISTS `lead_time`;
DROP TABLE IF EXISTS `part`;
DROP TABLE IF EXISTS `packagings`;
DROP TABLE IF EXISTS `packaging_types`;
DROP TABLE IF EXISTS `readers`;
DROP TABLE IF EXISTS `drivers`;
DROP TABLE IF EXISTS `vehicles`;
DROP TABLE IF EXISTS `customers`;
DROP TABLE IF EXISTS `kalender_kerja`;
DROP TABLE IF EXISTS `users`;

-- ============================================================
-- ██  MASTER DATA TABLES
-- ============================================================

-- ----------------------------------------------------------
-- 1. USERS
-- Menyimpan data pengguna sistem: admin, operator, viewer
-- ----------------------------------------------------------
CREATE TABLE `users` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username`   VARCHAR(50)  NOT NULL UNIQUE,
  `email`      VARCHAR(100) DEFAULT NULL,
  `password`   VARCHAR(255) NOT NULL COMMENT 'bcrypt hash',
  `name`       VARCHAR(100) NOT NULL,
  `role`       ENUM('admin','operator','viewer') NOT NULL DEFAULT 'viewer',
  `is_active`  TINYINT(1)   NOT NULL DEFAULT 1,
  `last_login` DATETIME     DEFAULT NULL,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME     DEFAULT NULL COMMENT 'soft delete',
  PRIMARY KEY (`id`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_active` (`is_active`),
  KEY `idx_users_deleted` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Master pengguna sistem';

-- ----------------------------------------------------------
-- 2. CUSTOMERS
-- Master data customer / pelanggan
-- ----------------------------------------------------------
CREATE TABLE `customers` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `customer_code` VARCHAR(30)  NOT NULL UNIQUE,
  `customer_name` VARCHAR(100) NOT NULL,
  `address`       TEXT         DEFAULT NULL,
  `contact_person`VARCHAR(100) DEFAULT NULL,
  `phone`         VARCHAR(20)  DEFAULT NULL,
  `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    DATETIME     DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_customers_code` (`customer_code`),
  KEY `idx_customers_deleted` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Master data customer';

-- ----------------------------------------------------------
-- 3. PACKAGING TYPES (Tipe Packaging)
-- Jenis packaging: Trolley, Pallet, Box, Dolley, dll
-- ----------------------------------------------------------
CREATE TABLE `packaging_types` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `type_name`   VARCHAR(50)  NOT NULL UNIQUE,
  `description` VARCHAR(200) DEFAULT NULL,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`  DATETIME     DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_pkg_types_deleted` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Tipe / jenis packaging';

-- ----------------------------------------------------------
-- 4. PACKAGINGS (Master Packaging)
-- Detail packaging – nama, kapasitas, warna, tipe
-- ----------------------------------------------------------
CREATE TABLE `packagings` (
  `id`                  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `packaging_name`      VARCHAR(100) NOT NULL,
  `packaging_type_id`   INT UNSIGNED NOT NULL,
  `kapasitas_packaging` INT          NOT NULL DEFAULT 0,
  `warna`               VARCHAR(50)  DEFAULT NULL,
  `created_at`          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`          DATETIME     DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_packagings_type` (`packaging_type_id`),
  KEY `idx_packagings_deleted` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Master data packaging';

-- ----------------------------------------------------------
-- 5. PART (Master Parts)
-- Nomor & nama part yang dikaitkan ke customer
-- ----------------------------------------------------------
CREATE TABLE `part` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `part_number`  VARCHAR(50)  NOT NULL UNIQUE,
  `part_name`    VARCHAR(100) NOT NULL,
  `customer_id`  INT UNSIGNED NOT NULL,
  `qty_per_pack` INT          NOT NULL DEFAULT 1,
  `keterangan`   VARCHAR(200) DEFAULT NULL,
  `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`   DATETIME     DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_part_customer` (`customer_id`),
  KEY `idx_part_number` (`part_number`),
  KEY `idx_part_deleted` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Master data part / komponen';

-- ----------------------------------------------------------
-- 6. RFID TAGS
-- Master RFID tag yang terdaftar di sistem
-- ----------------------------------------------------------
CREATE TABLE `rfid_tags` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `tag_uid`    VARCHAR(50)  NOT NULL UNIQUE COMMENT 'UID dari RFID reader',
  `tag_code`   VARCHAR(50)  DEFAULT NULL COMMENT 'Kode internal',
  `status`     ENUM('active','inactive','lost') NOT NULL DEFAULT 'active',
  `notes`      VARCHAR(200) DEFAULT NULL,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME     DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_rfid_uid` (`tag_uid`),
  KEY `idx_rfid_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Master RFID tag yang terdaftar';

-- ----------------------------------------------------------
-- 7. ASSETS (Asset Master)
-- Asset packaging yang memiliki tag RFID
-- status: in=di internal, out=di customer, repair=sedang diperbaiki
-- ----------------------------------------------------------
CREATE TABLE `assets` (
  `id`           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `rfid_tag`     VARCHAR(50)   NOT NULL UNIQUE COMMENT 'Tag UID RFID',
  `asset_code`   VARCHAR(50)   NOT NULL UNIQUE,
  `packaging_id` INT UNSIGNED  NOT NULL,
  `part_id`      INT UNSIGNED  DEFAULT NULL,
  `customer_id`  INT UNSIGNED  DEFAULT NULL COMMENT 'Customer pemegang asset saat ini (NULL = internal)',
  `status`       ENUM('in','out','repair','lost') NOT NULL DEFAULT 'in'
                 COMMENT 'in=di internal/warehouse, out=di customer, repair=maintenance',
  `location`     VARCHAR(100)  DEFAULT 'Warehouse',
  `created_at`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`   DATETIME      DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_assets_rfid` (`rfid_tag`),
  KEY `idx_assets_code` (`asset_code`),
  KEY `idx_assets_packaging` (`packaging_id`),
  KEY `idx_assets_part` (`part_id`),
  KEY `idx_assets_customer` (`customer_id`),
  KEY `idx_assets_status` (`status`),
  KEY `idx_assets_deleted` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Master asset packaging ber-RFID';

-- ----------------------------------------------------------
-- 8. READERS (RFID Reader)
-- Perangkat RFID reader di setiap gate/lokasi
-- ----------------------------------------------------------
CREATE TABLE `readers` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `reader_code` VARCHAR(30)  NOT NULL UNIQUE,
  `reader_name` VARCHAR(100) NOT NULL,
  `location`    VARCHAR(100) NOT NULL,
  `ip_address`  VARCHAR(45)  DEFAULT NULL,
  `is_active`   TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`  DATETIME     DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_readers_code` (`reader_code`),
  KEY `idx_readers_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Master RFID reader / gate scanner';

-- ----------------------------------------------------------
-- 9. DRIVERS
-- ----------------------------------------------------------
CREATE TABLE `drivers` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `driver_code` VARCHAR(20)  DEFAULT NULL UNIQUE,
  `driver_name` VARCHAR(100) NOT NULL,
  `phone`       VARCHAR(20)  DEFAULT NULL,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`  DATETIME     DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Master data driver';

-- ----------------------------------------------------------
-- 10. VEHICLES
-- ----------------------------------------------------------
CREATE TABLE `vehicles` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `plate_number` VARCHAR(20)  NOT NULL UNIQUE,
  `vehicle_type` VARCHAR(50)  NOT NULL,
  `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`   DATETIME     DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Master data kendaraan';

-- ============================================================
-- ██  TRANSACTION TABLES
-- ============================================================

-- ----------------------------------------------------------
-- 11. ASSET EVENTS (Transaksi RFID Scan)
-- Setiap scan RFID dicatat di sini – inti dari sistem
-- event_type: in = masuk (dari customer ke gudang)
--             out = keluar (dari gudang ke customer)
-- ----------------------------------------------------------
CREATE TABLE `asset_events` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `asset_id`    INT UNSIGNED NOT NULL,
  `reader_id`   INT UNSIGNED NOT NULL,
  `event_type`  ENUM('in','out') NOT NULL COMMENT 'in=barang masuk internal, out=barang keluar ke customer',
  `location`    VARCHAR(100) NOT NULL,
  `customer_id` INT UNSIGNED DEFAULT NULL COMMENT 'Customer tujuan (untuk OUT) atau asal (untuk IN)',
  `driver_id`   INT UNSIGNED DEFAULT NULL,
  `vehicle_id`  INT UNSIGNED DEFAULT NULL,
  `scanned_by`  INT UNSIGNED NOT NULL COMMENT 'user_id operator yang scan',
  `scan_time`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notes`       VARCHAR(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ae_asset` (`asset_id`),
  KEY `idx_ae_reader` (`reader_id`),
  KEY `idx_ae_customer` (`customer_id`),
  KEY `idx_ae_event_type` (`event_type`),
  KEY `idx_ae_scan_time` (`scan_time`),
  KEY `idx_ae_scanned_by` (`scanned_by`),
  KEY `idx_ae_date_type` (`scan_time`, `event_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Log transaksi RFID scan IN/OUT';

-- ----------------------------------------------------------
-- 12. REPAIRS (Perbaikan Asset)
-- ----------------------------------------------------------
CREATE TABLE `repairs` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `asset_id`    INT UNSIGNED NOT NULL,
  `repair_date` DATE         NOT NULL,
  `repair_type` VARCHAR(100) NOT NULL COMMENT 'Jenis kerusakan/perbaikan',
  `location`    VARCHAR(100) NOT NULL DEFAULT 'Warehouse',
  `repaired_by` INT UNSIGNED DEFAULT NULL COMMENT 'user_id teknisi',
  `status`      ENUM('ongoing','finished') NOT NULL DEFAULT 'ongoing',
  `finished_at` DATE         DEFAULT NULL,
  `notes`       TEXT         DEFAULT NULL,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_repairs_asset` (`asset_id`),
  KEY `idx_repairs_status` (`status`),
  KEY `idx_repairs_date` (`repair_date`),
  KEY `idx_repairs_repaired_by` (`repaired_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Riwayat perbaikan / maintenance asset';

-- ============================================================
-- ██  PLANNING & REPORTING TABLES
-- ============================================================

-- ----------------------------------------------------------
-- 13. KALENDER KERJA
-- ----------------------------------------------------------
CREATE TABLE `kalender_kerja` (
  `id`        INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `bulan`     VARCHAR(20)  NOT NULL,
  `tahun`     YEAR         NOT NULL,
  `hari_kerja`INT          NOT NULL DEFAULT 0,
  `created_at`DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_kalender` (`bulan`, `tahun`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Hari kerja per bulan per tahun';

-- ----------------------------------------------------------
-- 14. LEAD TIME (per part)
-- ----------------------------------------------------------
CREATE TABLE `lead_time` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `part_id`       INT UNSIGNED NOT NULL UNIQUE,
  `lt_production` INT          NOT NULL DEFAULT 0 COMMENT 'Lead time produksi (hari)',
  `lt_store`      INT          NOT NULL DEFAULT 0 COMMENT 'Lead time gudang (hari)',
  `lt_customer`   INT          NOT NULL DEFAULT 0 COMMENT 'Lead time di customer (hari)',
  `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_lt_part` (`part_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Lead time per part (produksi, gudang, customer)';

-- ----------------------------------------------------------
-- 15. FORECAST MONTH
-- ----------------------------------------------------------
CREATE TABLE `forecast_month` (
  `id`             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `part_id`        INT UNSIGNED NOT NULL,
  `bulan`          VARCHAR(20)  NOT NULL,
  `tahun`          YEAR         NOT NULL,
  `forecast_month` INT          NOT NULL DEFAULT 0,
  `created_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_forecast` (`part_id`,`bulan`,`tahun`),
  KEY `idx_fm_part` (`part_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Forecast kebutuhan packaging per bulan';

-- ----------------------------------------------------------
-- 16. FORECAST INPUT
-- ----------------------------------------------------------
CREATE TABLE `forecast_input` (
  `id`               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `forecast_month_id`INT UNSIGNED NOT NULL,
  `packaging_id`     INT UNSIGNED NOT NULL,
  `kalender_kerja`   INT          NOT NULL DEFAULT 0,
  `lead_time`        INT          NOT NULL DEFAULT 0,
  `actual_packaging` INT          NOT NULL DEFAULT 0,
  `created_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_fi_forecast_month` (`forecast_month_id`),
  KEY `idx_fi_packaging` (`packaging_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Input detail forecast packaging';

-- ----------------------------------------------------------
-- 17. ACTUAL PACKAGING (Realisasi)
-- ----------------------------------------------------------
CREATE TABLE `actual_packaging` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `part_id`     INT UNSIGNED NOT NULL,
  `qty_actual`  INT          NOT NULL DEFAULT 0,
  `tanggal`     DATE         NOT NULL,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_actual_part` (`part_id`),
  KEY `idx_actual_tanggal` (`tanggal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Realisasi actual penggunaan packaging';

-- ----------------------------------------------------------
-- 18. KEBUTUHAN PACKAGING
-- Rencana kebutuhan packaging per customer per periode
-- ----------------------------------------------------------
CREATE TABLE `kebutuhan_packaging` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `customer_id`  INT UNSIGNED NOT NULL,
  `packaging_id` INT UNSIGNED NOT NULL,
  `part_id`      INT UNSIGNED DEFAULT NULL,
  `bulan`        VARCHAR(20)  NOT NULL,
  `tahun`        YEAR         NOT NULL,
  `qty_kebutuhan`INT          NOT NULL DEFAULT 0 COMMENT 'Jumlah packaging yang dibutuhkan',
  `qty_tersedia` INT          NOT NULL DEFAULT 0 COMMENT 'Jumlah packaging tersedia',
  `keterangan`   VARCHAR(200) DEFAULT NULL,
  `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_kbth_customer` (`customer_id`),
  KEY `idx_kbth_packaging` (`packaging_id`),
  KEY `idx_kbth_period` (`bulan`, `tahun`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Perencanaan kebutuhan packaging per customer';

-- ============================================================
-- ██  AUDIT / SYSTEM TABLES
-- ============================================================

-- ----------------------------------------------------------
-- 19. AUDIT LOGS
-- Mencatat semua perubahan penting pada data sistem
-- ----------------------------------------------------------
CREATE TABLE `audit_logs` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `table_name`  VARCHAR(50)     NOT NULL,
  `record_id`   INT UNSIGNED    NOT NULL,
  `action`      ENUM('INSERT','UPDATE','DELETE') NOT NULL,
  `old_values`  JSON            DEFAULT NULL,
  `new_values`  JSON            DEFAULT NULL,
  `changed_by`  INT UNSIGNED    DEFAULT NULL COMMENT 'user_id',
  `ip_address`  VARCHAR(45)     DEFAULT NULL,
  `changed_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_audit_table_record` (`table_name`,`record_id`),
  KEY `idx_audit_changed_at` (`changed_at`),
  KEY `idx_audit_changed_by` (`changed_by`),
  KEY `idx_audit_action` (`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Audit trail semua perubahan data penting';

COMMIT;

-- ============================================================
-- ██  FOREIGN KEY CONSTRAINTS
-- ============================================================

ALTER TABLE `packagings`
  ADD CONSTRAINT `fk_packagings_type` FOREIGN KEY (`packaging_type_id`) REFERENCES `packaging_types`(`id`) ON UPDATE CASCADE;

ALTER TABLE `part`
  ADD CONSTRAINT `fk_part_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE CASCADE;

ALTER TABLE `assets`
  ADD CONSTRAINT `fk_assets_packaging` FOREIGN KEY (`packaging_id`) REFERENCES `packagings`(`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_assets_part`      FOREIGN KEY (`part_id`)      REFERENCES `part`(`id`)      ON UPDATE CASCADE ON DELETE SET NULL,
  ADD CONSTRAINT `fk_assets_customer`  FOREIGN KEY (`customer_id`)  REFERENCES `customers`(`id`) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE `asset_events`
  ADD CONSTRAINT `fk_ae_asset`    FOREIGN KEY (`asset_id`)    REFERENCES `assets`(`id`)    ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ae_reader`   FOREIGN KEY (`reader_id`)   REFERENCES `readers`(`id`)   ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ae_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE CASCADE ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ae_driver`   FOREIGN KEY (`driver_id`)   REFERENCES `drivers`(`id`)   ON UPDATE CASCADE ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ae_vehicle`  FOREIGN KEY (`vehicle_id`)  REFERENCES `vehicles`(`id`)  ON UPDATE CASCADE ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ae_user`     FOREIGN KEY (`scanned_by`)  REFERENCES `users`(`id`)     ON UPDATE CASCADE;

ALTER TABLE `repairs`
  ADD CONSTRAINT `fk_repairs_asset` FOREIGN KEY (`asset_id`)    REFERENCES `assets`(`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_repairs_user`  FOREIGN KEY (`repaired_by`) REFERENCES `users`(`id`)  ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE `lead_time`
  ADD CONSTRAINT `fk_lt_part` FOREIGN KEY (`part_id`) REFERENCES `part`(`id`) ON UPDATE CASCADE;

ALTER TABLE `forecast_month`
  ADD CONSTRAINT `fk_fm_part` FOREIGN KEY (`part_id`) REFERENCES `part`(`id`) ON UPDATE CASCADE;

ALTER TABLE `forecast_input`
  ADD CONSTRAINT `fk_fi_forecast_month` FOREIGN KEY (`forecast_month_id`) REFERENCES `forecast_month`(`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_fi_packaging`      FOREIGN KEY (`packaging_id`)       REFERENCES `packagings`(`id`)     ON UPDATE CASCADE;

ALTER TABLE `actual_packaging`
  ADD CONSTRAINT `fk_actual_part` FOREIGN KEY (`part_id`) REFERENCES `part`(`id`) ON UPDATE CASCADE;

ALTER TABLE `kebutuhan_packaging`
  ADD CONSTRAINT `fk_kbth_customer`  FOREIGN KEY (`customer_id`)  REFERENCES `customers`(`id`)  ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_kbth_packaging` FOREIGN KEY (`packaging_id`) REFERENCES `packagings`(`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_kbth_part`      FOREIGN KEY (`part_id`)      REFERENCES `part`(`id`)       ON UPDATE CASCADE ON DELETE SET NULL;

-- ============================================================
-- ██  TRIGGERS
-- ============================================================
DELIMITER $$

-- ----------------------------------------------------------
-- Trigger 1: Update status asset OTOMATIS saat RFID di-scan
-- Jika event_type = 'out' → status = 'out', customer_id = customer event
-- Jika event_type = 'in'  → status = 'in',  customer_id = NULL (kembali ke internal)
-- ----------------------------------------------------------
CREATE TRIGGER `trg_asset_event_after_insert`
AFTER INSERT ON `asset_events`
FOR EACH ROW
BEGIN
  IF NEW.event_type = 'out' THEN
    UPDATE `assets`
    SET `status`      = 'out',
        `customer_id` = NEW.customer_id,
        `location`    = NEW.location,
        `updated_at`  = NOW()
    WHERE `id` = NEW.asset_id;
  ELSEIF NEW.event_type = 'in' THEN
    UPDATE `assets`
    SET `status`      = 'in',
        `customer_id` = NULL,
        `location`    = NEW.location,
        `updated_at`  = NOW()
    WHERE `id` = NEW.asset_id;
  END IF;
END$$

-- ----------------------------------------------------------
-- Trigger 2: Saat repair di-INSERT → set asset status = 'repair'
-- ----------------------------------------------------------
CREATE TRIGGER `trg_repair_after_insert`
AFTER INSERT ON `repairs`
FOR EACH ROW
BEGIN
  UPDATE `assets`
  SET `status`     = 'repair',
      `updated_at` = NOW()
  WHERE `id` = NEW.asset_id;
END$$

-- ----------------------------------------------------------
-- Trigger 3: Saat repair di-UPDATE dan status = finished
--            → kembalikan asset status = 'in'
-- ----------------------------------------------------------
CREATE TRIGGER `trg_repair_after_update`
AFTER UPDATE ON `repairs`
FOR EACH ROW
BEGIN
  IF NEW.status = 'finished' AND OLD.status = 'ongoing' THEN
    UPDATE `assets`
    SET `status`     = 'in',
        `location`   = 'Warehouse',
        `updated_at` = NOW()
    WHERE `id` = NEW.asset_id;
  END IF;
END$$

DELIMITER ;

-- ============================================================
-- ██  VIEWS – DASHBOARD
-- ============================================================

-- ----------------------------------------------------------
-- View 1: view_dashboard_summary
-- Ringkasan total asset per status untuk header dashboard
-- ----------------------------------------------------------
CREATE OR REPLACE VIEW `view_dashboard_summary` AS
SELECT
  COUNT(*)                                              AS total_supporting_facility,
  SUM(CASE WHEN status = 'out'    THEN 1 ELSE 0 END)   AS total_di_customer,
  SUM(CASE WHEN status = 'in'     THEN 1 ELSE 0 END)   AS total_di_internal,
  SUM(CASE WHEN status = 'repair' THEN 1 ELSE 0 END)   AS total_repair,
  SUM(CASE WHEN status = 'lost'   THEN 1 ELSE 0 END)   AS total_lost
FROM `assets`
WHERE `deleted_at` IS NULL;

-- ----------------------------------------------------------
-- View 2: view_asset_status
-- Status per customer + asset type dengan IN/OUT count
-- ----------------------------------------------------------
CREATE OR REPLACE VIEW `view_asset_status` AS
SELECT
  c.customer_name,
  pt.type_name     AS asset_type,
  p.packaging_name AS packaging_name,
  SUM(CASE WHEN ae.event_type = 'in'  AND DATE(ae.scan_time) = CURDATE() THEN 1 ELSE 0 END) AS qty_in_today,
  SUM(CASE WHEN ae.event_type = 'out' AND DATE(ae.scan_time) = CURDATE() THEN 1 ELSE 0 END) AS qty_out_today,
  COUNT(DISTINCT a.id) AS total_asset
FROM `assets` a
JOIN `packagings`      p  ON a.packaging_id = p.id
JOIN `packaging_types` pt ON p.packaging_type_id = pt.id
LEFT JOIN `customers`  c  ON a.customer_id = c.id
LEFT JOIN `asset_events` ae ON ae.asset_id = a.id
    AND DATE(ae.scan_time) = CURDATE()
WHERE a.deleted_at IS NULL
GROUP BY c.customer_name, pt.type_name, p.packaging_name;

-- ----------------------------------------------------------
-- View 3: view_daily_delta
-- Delta harian: IN - OUT per customer per packaging type
-- ----------------------------------------------------------
CREATE OR REPLACE VIEW `view_daily_delta` AS
SELECT
  c.id             AS customer_id,
  c.customer_name,
  pt.type_name     AS packaging_type,
  SUM(CASE WHEN ae.event_type = 'in'  AND DATE(ae.scan_time) = CURDATE()             THEN 1 ELSE 0 END) AS today_in,
  SUM(CASE WHEN ae.event_type = 'out' AND DATE(ae.scan_time) = CURDATE()             THEN 1 ELSE 0 END) AS today_out,
  SUM(CASE WHEN ae.event_type = 'in'  AND DATE(ae.scan_time) = DATE_SUB(CURDATE(),INTERVAL 1 DAY) THEN 1 ELSE 0 END) AS yesterday_in,
  SUM(CASE WHEN ae.event_type = 'out' AND DATE(ae.scan_time) = DATE_SUB(CURDATE(),INTERVAL 1 DAY) THEN 1 ELSE 0 END) AS yesterday_out,
  (
    SUM(CASE WHEN ae.event_type = 'in'  AND DATE(ae.scan_time) = CURDATE() THEN 1 ELSE 0 END) -
    SUM(CASE WHEN ae.event_type = 'out' AND DATE(ae.scan_time) = CURDATE() THEN 1 ELSE 0 END)
  ) AS delta_harian
FROM `asset_events` ae
JOIN `assets`          a  ON ae.asset_id = a.id
JOIN `packagings`      p  ON a.packaging_id = p.id
JOIN `packaging_types` pt ON p.packaging_type_id = pt.id
LEFT JOIN `customers`  c  ON ae.customer_id = c.id
GROUP BY c.id, c.customer_name, pt.type_name;

-- ----------------------------------------------------------
-- View 4: view_weekly_delta
-- Delta mingguan: minggu ini vs minggu lalu
-- ----------------------------------------------------------
CREATE OR REPLACE VIEW `view_weekly_delta` AS
SELECT
  c.id             AS customer_id,
  c.customer_name,
  pt.type_name     AS packaging_type,
  SUM(CASE WHEN ae.event_type = 'out' AND YEARWEEK(ae.scan_time,1) = YEARWEEK(CURDATE(),1) THEN 1 ELSE 0 END) AS week_out,
  SUM(CASE WHEN ae.event_type = 'in'  AND YEARWEEK(ae.scan_time,1) = YEARWEEK(CURDATE(),1) THEN 1 ELSE 0 END) AS week_in,
  SUM(CASE WHEN ae.event_type = 'out' AND YEARWEEK(ae.scan_time,1) = YEARWEEK(CURDATE(),1) - 1 THEN 1 ELSE 0 END) AS last_week_out,
  SUM(CASE WHEN ae.event_type = 'in'  AND YEARWEEK(ae.scan_time,1) = YEARWEEK(CURDATE(),1) - 1 THEN 1 ELSE 0 END) AS last_week_in,
  (
    SUM(CASE WHEN ae.event_type = 'out' AND YEARWEEK(ae.scan_time,1) = YEARWEEK(CURDATE(),1) THEN 1 ELSE 0 END) -
    SUM(CASE WHEN ae.event_type = 'out' AND YEARWEEK(ae.scan_time,1) = YEARWEEK(CURDATE(),1) - 1 THEN 1 ELSE 0 END)
  ) AS delta_mingguan
FROM `asset_events` ae
JOIN `assets`          a  ON ae.asset_id = a.id
JOIN `packagings`      p  ON a.packaging_id = p.id
JOIN `packaging_types` pt ON p.packaging_type_id = pt.id
LEFT JOIN `customers`  c  ON ae.customer_id = c.id
GROUP BY c.id, c.customer_name, pt.type_name;

-- ----------------------------------------------------------
-- View 5: view_mtd_accumulation
-- Akumulasi Month-To-Date: total OUT minus total IN bulan ini
-- Nilai positif = lebih banyak di customer (OUT > IN)
-- ----------------------------------------------------------
CREATE OR REPLACE VIEW `view_mtd_accumulation` AS
SELECT
  c.id             AS customer_id,
  c.customer_name,
  pt.type_name     AS packaging_type,
  MONTH(ae.scan_time) AS bulan,
  YEAR(ae.scan_time)  AS tahun,
  SUM(CASE WHEN ae.event_type = 'out' THEN 1 ELSE 0 END) AS mtd_out,
  SUM(CASE WHEN ae.event_type = 'in'  THEN 1 ELSE 0 END) AS mtd_in,
  SUM(CASE WHEN ae.event_type = 'out' THEN 1 ELSE -1 END) AS akum_mtd
FROM `asset_events` ae
JOIN `assets`          a  ON ae.asset_id = a.id
JOIN `packagings`      p  ON a.packaging_id = p.id
JOIN `packaging_types` pt ON p.packaging_type_id = pt.id
LEFT JOIN `customers`  c  ON ae.customer_id = c.id
WHERE MONTH(ae.scan_time) = MONTH(CURDATE())
  AND YEAR(ae.scan_time)  = YEAR(CURDATE())
GROUP BY c.id, c.customer_name, pt.type_name, MONTH(ae.scan_time), YEAR(ae.scan_time);

-- ============================================================
-- FK CONSTRAINTS
-- ============================================================

ALTER TABLE `packagings`
  ADD CONSTRAINT `fk_packagings_type` FOREIGN KEY (`packaging_type_id`) REFERENCES `packaging_types`(`id`) ON UPDATE CASCADE;

ALTER TABLE `part`
  ADD CONSTRAINT `fk_part_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE CASCADE;

ALTER TABLE `assets`
  ADD CONSTRAINT `fk_assets_packaging` FOREIGN KEY (`packaging_id`) REFERENCES `packagings`(`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_assets_part`      FOREIGN KEY (`part_id`)      REFERENCES `part`(`id`)      ON UPDATE CASCADE ON DELETE SET NULL,
  ADD CONSTRAINT `fk_assets_customer`  FOREIGN KEY (`customer_id`)  REFERENCES `customers`(`id`) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE `asset_events`
  ADD CONSTRAINT `fk_ae_asset`    FOREIGN KEY (`asset_id`)    REFERENCES `assets`(`id`)    ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ae_reader`   FOREIGN KEY (`reader_id`)   REFERENCES `readers`(`id`)   ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ae_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE CASCADE ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ae_driver`   FOREIGN KEY (`driver_id`)   REFERENCES `drivers`(`id`)   ON UPDATE CASCADE ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ae_vehicle`  FOREIGN KEY (`vehicle_id`)  REFERENCES `vehicles`(`id`)  ON UPDATE CASCADE ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ae_user`     FOREIGN KEY (`scanned_by`)  REFERENCES `users`(`id`)     ON UPDATE CASCADE;

ALTER TABLE `repairs`
  ADD CONSTRAINT `fk_repairs_asset` FOREIGN KEY (`asset_id`)    REFERENCES `assets`(`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_repairs_user`  FOREIGN KEY (`repaired_by`) REFERENCES `users`(`id`)  ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE `lead_time`
  ADD CONSTRAINT `fk_lt_part` FOREIGN KEY (`part_id`) REFERENCES `part`(`id`) ON UPDATE CASCADE;

ALTER TABLE `forecast_month`
  ADD CONSTRAINT `fk_fm_part` FOREIGN KEY (`part_id`) REFERENCES `part`(`id`) ON UPDATE CASCADE;

ALTER TABLE `forecast_input`
  ADD CONSTRAINT `fk_fi_forecast_month` FOREIGN KEY (`forecast_month_id`) REFERENCES `forecast_month`(`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_fi_packaging`      FOREIGN KEY (`packaging_id`)       REFERENCES `packagings`(`id`)     ON UPDATE CASCADE;

ALTER TABLE `actual_packaging`
  ADD CONSTRAINT `fk_actual_part` FOREIGN KEY (`part_id`) REFERENCES `part`(`id`) ON UPDATE CASCADE;

ALTER TABLE `kebutuhan_packaging`
  ADD CONSTRAINT `fk_kbth_customer`  FOREIGN KEY (`customer_id`)  REFERENCES `customers`(`id`)  ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_kbth_packaging` FOREIGN KEY (`packaging_id`) REFERENCES `packagings`(`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_kbth_part`      FOREIGN KEY (`part_id`)      REFERENCES `part`(`id`)       ON UPDATE CASCADE ON DELETE SET NULL;
-- ============================================================
-- TRIGGERS
-- ============================================================
DELIMITER $$

CREATE TRIGGER `trg_asset_event_after_insert`
AFTER INSERT ON `asset_events`
FOR EACH ROW
BEGIN
  IF NEW.event_type = 'out' THEN
    UPDATE `assets`
    SET `status`      = 'out',
        `customer_id` = NEW.customer_id,
        `location`    = NEW.location,
        `updated_at`  = NOW()
    WHERE `id` = NEW.asset_id;
  ELSEIF NEW.event_type = 'in' THEN
    UPDATE `assets`
    SET `status`      = 'in',
        `customer_id` = NULL,
        `location`    = NEW.location,
        `updated_at`  = NOW()
    WHERE `id` = NEW.asset_id;
  END IF;
END$$

CREATE TRIGGER `trg_repair_after_insert`
AFTER INSERT ON `repairs`
FOR EACH ROW
BEGIN
  UPDATE `assets`
  SET `status`     = 'repair',
      `updated_at` = NOW()
  WHERE `id` = NEW.asset_id;
END$$

CREATE TRIGGER `trg_repair_after_update`
AFTER UPDATE ON `repairs`
FOR EACH ROW
BEGIN
  IF NEW.status = 'finished' AND OLD.status = 'ongoing' THEN
    UPDATE `assets`
    SET `status`     = 'in',
        `location`   = 'Warehouse',
        `updated_at` = NOW()
    WHERE `id` = NEW.asset_id;
  END IF;
END$$

DELIMITER ;

-- ============================================================
-- VIEWS
-- ============================================================

CREATE OR REPLACE VIEW `view_dashboard_summary` AS
SELECT
  COUNT(*)                                              AS total_supporting_facility,
  SUM(CASE WHEN status = 'out'    THEN 1 ELSE 0 END)   AS total_di_customer,
  SUM(CASE WHEN status = 'in'     THEN 1 ELSE 0 END)   AS total_di_internal,
  SUM(CASE WHEN status = 'repair' THEN 1 ELSE 0 END)   AS total_repair,
  SUM(CASE WHEN status = 'lost'   THEN 1 ELSE 0 END)   AS total_lost
FROM `assets`
WHERE `deleted_at` IS NULL;

CREATE OR REPLACE VIEW `view_asset_status` AS
SELECT
  COALESCE(c.customer_name, 'INTERNAL') AS customer_name,
  pt.type_name     AS asset_type,
  p.packaging_name,
  COUNT(a.id)      AS total_asset,
  SUM(CASE WHEN a.status = 'in'     THEN 1 ELSE 0 END) AS qty_in,
  SUM(CASE WHEN a.status = 'out'    THEN 1 ELSE 0 END) AS qty_out,
  SUM(CASE WHEN a.status = 'repair' THEN 1 ELSE 0 END) AS qty_repair
FROM `assets` a
JOIN `packagings`      p  ON a.packaging_id = p.id
JOIN `packaging_types` pt ON p.packaging_type_id = pt.id
LEFT JOIN `customers`  c  ON a.customer_id = c.id
WHERE a.deleted_at IS NULL
GROUP BY c.customer_name, pt.type_name, p.packaging_name;

CREATE OR REPLACE VIEW `view_daily_delta` AS
SELECT
  c.id             AS customer_id,
  COALESCE(c.customer_name, 'INTERNAL') AS customer_name,
  pt.type_name     AS packaging_type,
  SUM(CASE WHEN ae.event_type = 'in'  AND DATE(ae.scan_time) = CURDATE()                        THEN 1 ELSE 0 END) AS today_in,
  SUM(CASE WHEN ae.event_type = 'out' AND DATE(ae.scan_time) = CURDATE()                        THEN 1 ELSE 0 END) AS today_out,
  SUM(CASE WHEN ae.event_type = 'in'  AND DATE(ae.scan_time) = DATE_SUB(CURDATE(),INTERVAL 1 DAY) THEN 1 ELSE 0 END) AS yesterday_in,
  SUM(CASE WHEN ae.event_type = 'out' AND DATE(ae.scan_time) = DATE_SUB(CURDATE(),INTERVAL 1 DAY) THEN 1 ELSE 0 END) AS yesterday_out,
  (SUM(CASE WHEN ae.event_type = 'in'  AND DATE(ae.scan_time) = CURDATE() THEN 1 ELSE 0 END) -
   SUM(CASE WHEN ae.event_type = 'out' AND DATE(ae.scan_time) = CURDATE() THEN 1 ELSE 0 END)) AS delta_harian
FROM `asset_events` ae
JOIN `assets`          a  ON ae.asset_id = a.id
JOIN `packagings`      p  ON a.packaging_id = p.id
JOIN `packaging_types` pt ON p.packaging_type_id = pt.id
LEFT JOIN `customers`  c  ON ae.customer_id = c.id
GROUP BY c.id, c.customer_name, pt.type_name;

CREATE OR REPLACE VIEW `view_weekly_delta` AS
SELECT
  c.id AS customer_id,
  COALESCE(c.customer_name, 'INTERNAL') AS customer_name,
  pt.type_name AS packaging_type,
  SUM(CASE WHEN ae.event_type = 'out' AND YEARWEEK(ae.scan_time,1) = YEARWEEK(CURDATE(),1)     THEN 1 ELSE 0 END) AS week_out,
  SUM(CASE WHEN ae.event_type = 'in'  AND YEARWEEK(ae.scan_time,1) = YEARWEEK(CURDATE(),1)     THEN 1 ELSE 0 END) AS week_in,
  SUM(CASE WHEN ae.event_type = 'out' AND YEARWEEK(ae.scan_time,1) = YEARWEEK(CURDATE(),1) - 1 THEN 1 ELSE 0 END) AS last_week_out,
  SUM(CASE WHEN ae.event_type = 'in'  AND YEARWEEK(ae.scan_time,1) = YEARWEEK(CURDATE(),1) - 1 THEN 1 ELSE 0 END) AS last_week_in,
  (SUM(CASE WHEN ae.event_type='out' AND YEARWEEK(ae.scan_time,1)=YEARWEEK(CURDATE(),1)   THEN 1 ELSE 0 END) -
   SUM(CASE WHEN ae.event_type='out' AND YEARWEEK(ae.scan_time,1)=YEARWEEK(CURDATE(),1)-1 THEN 1 ELSE 0 END)) AS delta_mingguan
FROM `asset_events` ae
JOIN `assets`          a  ON ae.asset_id = a.id
JOIN `packagings`      p  ON a.packaging_id = p.id
JOIN `packaging_types` pt ON p.packaging_type_id = pt.id
LEFT JOIN `customers`  c  ON ae.customer_id = c.id
GROUP BY c.id, c.customer_name, pt.type_name;

CREATE OR REPLACE VIEW `view_mtd_accumulation` AS
SELECT
  c.id AS customer_id,
  COALESCE(c.customer_name, 'INTERNAL') AS customer_name,
  pt.type_name AS packaging_type,
  MONTH(ae.scan_time) AS bulan,
  YEAR(ae.scan_time)  AS tahun,
  SUM(CASE WHEN ae.event_type = 'out' THEN 1 ELSE 0 END)  AS mtd_out,
  SUM(CASE WHEN ae.event_type = 'in'  THEN 1 ELSE 0 END)  AS mtd_in,
  SUM(CASE WHEN ae.event_type = 'out' THEN 1 ELSE -1 END) AS akum_mtd
FROM `asset_events` ae
JOIN `assets`          a  ON ae.asset_id = a.id
JOIN `packagings`      p  ON a.packaging_id = p.id
JOIN `packaging_types` pt ON p.packaging_type_id = pt.id
LEFT JOIN `customers`  c  ON ae.customer_id = c.id
WHERE MONTH(ae.scan_time) = MONTH(CURDATE())
  AND YEAR(ae.scan_time)  = YEAR(CURDATE())
GROUP BY c.id, c.customer_name, pt.type_name, MONTH(ae.scan_time), YEAR(ae.scan_time);
-- ============================================================
-- â–ˆâ–ˆ  DUMMY DATA â€“ MASTER DATA
-- ============================================================

-- USERS (password: Admin123! bcrypt hash)
INSERT INTO `users` (`id`,`username`,`email`,`password`,`name`,`role`,`is_active`,`created_at`) VALUES
(1,'admin','admin@mtm.co.id','$2b$10$lreruX8TBL.DEdyUjeeTGOuqDiG0vHVc4GxgPKBT87SiKgbkcmMFK','Administrator','admin',1,'2026-01-01 07:00:00'),
(2,'operator1','operator1@mtm.co.id','$2b$10$lreruX8TBL.DEdyUjeeTGOuqDiG0vHVc4GxgPKBT87SiKgbkcmMFK','Budi Santoso','operator',1,'2026-01-01 07:00:00'),
(3,'operator2','operator2@mtm.co.id','$2b$10$lreruX8TBL.DEdyUjeeTGOuqDiG0vHVc4GxgPKBT87SiKgbkcmMFK','Siti Nurhaliza','operator',1,'2026-01-01 07:00:00'),
(4,'viewer1','viewer1@mtm.co.id','$2b$10$lreruX8TBL.DEdyUjeeTGOuqDiG0vHVc4GxgPKBT87SiKgbkcmMFK','Andi Wijaya','viewer',1,'2026-01-02 07:00:00');

-- CUSTOMERS
INSERT INTO `customers` (`id`,`customer_code`,`customer_name`,`address`,`contact_person`,`phone`,`created_at`) VALUES
(1,'AHM-001','PT Astra Honda Motor','Jl. Laksda Yos Sudarso, Jakarta Utara','Pak Hendra','021-4358888','2026-01-01 07:00:00'),
(2,'ADM-001','PT Astra Daihatsu Motor','Jl. Gaya Motor III, Jakarta Utara','Ibu Rina','021-6512121','2026-01-01 07:00:00'),
(3,'TAM-001','PT Toyota Astra Motor','Jl. Yos Sudarso, Sunter','Pak Budi','021-6530555','2026-01-01 07:00:00'),
(4,'SIM-001','PT Suzuki Indomobil Motor','Jl. P. Diponegoro Km 38, Bekasi','Pak Agus','021-8870551','2026-01-02 07:00:00'),
(5,'NIM-001','PT Nusantara Motor','Jl. Puri Kencana, Jakarta Barat','Ibu Dewi','021-5800988','2026-01-02 07:00:00');

-- PACKAGING TYPES
INSERT INTO `packaging_types` (`id`,`type_name`,`description`,`created_at`) VALUES
(1,'Trolley','Trolley besi beroda untuk distribusi line produksi','2026-01-01 07:00:00'),
(2,'Dolley','Dolley flat untuk angkut part berukuran besar','2026-01-01 07:00:00'),
(3,'Pallet','Pallet kayu/plastik standar','2026-01-01 07:00:00'),
(4,'Box','Box plastik tertutup untuk part kecil','2026-01-01 07:00:00'),
(5,'Rack','Rak besi modular','2026-01-01 07:00:00');

-- PACKAGINGS
INSERT INTO `packagings` (`id`,`packaging_name`,`packaging_type_id`,`kapasitas_packaging`,`warna`,`created_at`) VALUES
(1,'Trolley Biru Kecil',1,50,'Biru','2026-01-01 07:00:00'),
(2,'Trolley Merah Besar',1,100,'Merah','2026-01-01 07:00:00'),
(3,'Dolley Hijau',2,80,'Hijau','2026-01-01 07:00:00'),
(4,'Pallet Kayu Standard',3,200,'Natural','2026-01-01 07:00:00'),
(5,'Pallet Plastik Hitam',3,150,'Hitam','2026-01-01 07:00:00'),
(6,'Box Plastik Biru 50L',4,100,'Biru','2026-01-01 07:00:00'),
(7,'Box Plastik Hijau 30L',4,60,'Hijau','2026-01-01 07:00:00'),
(8,'Rack Besi Medium',5,120,'Abu-abu','2026-01-01 07:00:00');

-- PART
INSERT INTO `part` (`id`,`part_number`,`part_name`,`customer_id`,`qty_per_pack`,`keterangan`,`created_at`) VALUES
(1,'39101-K0J-V01','Frame Assembly RH',1,25,'Rangka unit kanan','2026-01-01 07:00:00'),
(2,'50300-KVB-900','Gear Box Unit',1,15,'Gearbox transmisi','2026-01-01 07:00:00'),
(3,'17520-KYZ-900','Oil Tank Complete',2,10,'Tangki oli lengkap','2026-01-01 07:00:00'),
(4,'50200-KWB-770','Bracket Mounting FR',3,30,'Bracket depan','2026-01-01 07:00:00'),
(5,'83700-K35-N00','Panel Cover LH',4,20,'Cover kiri','2026-01-01 07:00:00'),
(6,'61300-KYJ-900','Handle Bar Sub-Assy',1,8,'Sub-assy stang','2026-01-01 07:00:00'),
(7,'87100-K35-N00','Rear Fender',2,15,'Spakbor belakang','2026-01-01 07:00:00'),
(8,'45100-KVB-013','Brake Disc Front',3,12,'Cakram rem depan','2026-01-01 07:00:00');

-- RFID TAGS
INSERT INTO `rfid_tags` (`id`,`tag_uid`,`tag_code`,`status`,`created_at`) VALUES
(1,'E2000017221104A60000000000000001','TAG-001','active','2026-01-01 07:00:00'),
(2,'E2000017221104A60000000000000002','TAG-002','active','2026-01-01 07:00:00'),
(3,'E2000017221104A60000000000000003','TAG-003','active','2026-01-01 07:00:00'),
(4,'E2000017221104A60000000000000004','TAG-004','active','2026-01-01 07:00:00'),
(5,'E2000017221104A60000000000000005','TAG-005','active','2026-01-01 07:00:00'),
(6,'E2000017221104A60000000000000006','TAG-006','active','2026-01-01 07:00:00'),
(7,'E2000017221104A60000000000000007','TAG-007','active','2026-01-01 07:00:00'),
(8,'E2000017221104A60000000000000008','TAG-008','active','2026-01-01 07:00:00'),
(9,'E2000017221104A60000000000000009','TAG-009','active','2026-01-01 07:00:00'),
(10,'E2000017221104A6000000000000000A','TAG-010','active','2026-01-01 07:00:00'),
(11,'E2000017221104A6000000000000000B','TAG-011','active','2026-01-01 07:00:00'),
(12,'E2000017221104A6000000000000000C','TAG-012','active','2026-01-01 07:00:00'),
(13,'E2000017221104A6000000000000000D','TAG-013','active','2026-01-01 07:00:00'),
(14,'E2000017221104A6000000000000000E','TAG-014','active','2026-01-01 07:00:00'),
(15,'E2000017221104A6000000000000000F','TAG-015','active','2026-01-01 07:00:00'),
(16,'E2000017221104A60000000000000010','TAG-016','active','2026-01-01 07:00:00'),
(17,'E2000017221104A60000000000000011','TAG-017','active','2026-01-01 07:00:00'),
(18,'E2000017221104A60000000000000012','TAG-018','active','2026-01-01 07:00:00'),
(19,'E2000017221104A60000000000000013','TAG-019','active','2026-01-01 07:00:00'),
(20,'E2000017221104A60000000000000014','TAG-020','active','2026-01-01 07:00:00');

-- READERS
INSERT INTO `readers` (`id`,`reader_code`,`reader_name`,`location`,`ip_address`,`is_active`,`created_at`) VALUES
(1,'RD-01','Gate Produksi IN','Line Produksi - Gate Masuk','192.168.1.101',1,'2026-01-01 07:00:00'),
(2,'RD-02','Gate QC','Area Quality Control','192.168.1.102',1,'2026-01-01 07:00:00'),
(3,'RD-03','Gate Loading','Area Loading / Pengiriman','192.168.1.103',1,'2026-01-01 07:00:00'),
(4,'RD-04','Gate Unloading','Area Unloading / Penerimaan','192.168.1.104',1,'2026-01-01 07:00:00'),
(5,'RD-05','Gate Warehouse','Gudang Utama','192.168.1.105',1,'2026-01-01 07:00:00');

-- DRIVERS
INSERT INTO `drivers` (`id`,`driver_code`,`driver_name`,`phone`,`created_at`) VALUES
(1,'DRV-001','Andi Prasetyo','081234567001','2026-01-01 07:00:00'),
(2,'DRV-002','Budi Hartono','081234567002','2026-01-01 07:00:00'),
(3,'DRV-003','Charlie Kusuma','081234567003','2026-01-01 07:00:00'),
(4,'DRV-004','Deni Setiawan','081234567004','2026-01-01 07:00:00');

-- VEHICLES
INSERT INTO `vehicles` (`id`,`plate_number`,`vehicle_type`,`created_at`) VALUES
(1,'B 1234 MTM','Truck Box','2026-01-01 07:00:00'),
(2,'B 5678 MTM','Wingbox','2026-01-01 07:00:00'),
(3,'B 9012 MTM','Trailer','2026-01-01 07:00:00'),
(4,'B 3456 MTM','Pickup','2026-01-01 07:00:00');

-- ============================================================
-- ASSETS (20 asset, status sesuai skenario riil)
-- 34 di internal (in), 17 di customer (out), 9 repair = total 60
-- Sesuai dashboard screenshot
-- ============================================================
INSERT INTO `assets` (`id`,`rfid_tag`,`asset_code`,`packaging_id`,`part_id`,`customer_id`,`status`,`location`,`created_at`) VALUES
-- Di Internal (in) = 34
(1, 'RF-A001','AST-T001',1,1,NULL,'in','Warehouse','2026-01-05 07:00:00'),
(2, 'RF-A002','AST-T002',1,1,NULL,'in','Warehouse','2026-01-05 07:00:00'),
(3, 'RF-A003','AST-T003',1,2,NULL,'in','Warehouse','2026-01-05 07:00:00'),
(4, 'RF-A004','AST-T004',2,2,NULL,'in','Warehouse','2026-01-05 07:00:00'),
(5, 'RF-A005','AST-T005',2,3,NULL,'in','Warehouse','2026-01-05 07:00:00'),
(6, 'RF-A006','AST-T006',2,3,NULL,'in','Warehouse','2026-01-05 07:00:00'),
(7, 'RF-A007','AST-T007',3,4,NULL,'in','Warehouse','2026-01-06 07:00:00'),
(8, 'RF-A008','AST-T008',3,4,NULL,'in','Warehouse','2026-01-06 07:00:00'),
(9, 'RF-A009','AST-T009',4,5,NULL,'in','Warehouse','2026-01-06 07:00:00'),
(10,'RF-A010','AST-T010',4,5,NULL,'in','Warehouse','2026-01-06 07:00:00'),
(11,'RF-A011','AST-T011',5,6,NULL,'in','Warehouse','2026-01-06 07:00:00'),
(12,'RF-A012','AST-T012',5,6,NULL,'in','Warehouse','2026-01-06 07:00:00'),
(13,'RF-A013','AST-T013',6,7,NULL,'in','Warehouse','2026-01-07 07:00:00'),
(14,'RF-A014','AST-T014',6,7,NULL,'in','Warehouse','2026-01-07 07:00:00'),
(15,'RF-A015','AST-T015',6,8,NULL,'in','Warehouse','2026-01-07 07:00:00'),
(16,'RF-A016','AST-T016',7,8,NULL,'in','Warehouse','2026-01-07 07:00:00'),
(17,'RF-A017','AST-T017',7,1,NULL,'in','Warehouse','2026-01-07 07:00:00'),
(18,'RF-A018','AST-T018',7,1,NULL,'in','Warehouse','2026-01-08 07:00:00'),
(19,'RF-A019','AST-T019',8,2,NULL,'in','Warehouse','2026-01-08 07:00:00'),
(20,'RF-A020','AST-T020',8,2,NULL,'in','Warehouse','2026-01-08 07:00:00'),
(21,'RF-A021','AST-T021',1,3,NULL,'in','Warehouse','2026-01-08 07:00:00'),
(22,'RF-A022','AST-T022',1,3,NULL,'in','Warehouse','2026-01-08 07:00:00'),
(23,'RF-A023','AST-T023',2,4,NULL,'in','Warehouse','2026-01-09 07:00:00'),
(24,'RF-A024','AST-T024',2,4,NULL,'in','Warehouse','2026-01-09 07:00:00'),
(25,'RF-A025','AST-T025',3,5,NULL,'in','Warehouse','2026-01-09 07:00:00'),
(26,'RF-A026','AST-T026',3,5,NULL,'in','Warehouse','2026-01-09 07:00:00'),
(27,'RF-A027','AST-T027',4,6,NULL,'in','Warehouse','2026-01-10 07:00:00'),
(28,'RF-A028','AST-T028',4,6,NULL,'in','Warehouse','2026-01-10 07:00:00'),
(29,'RF-A029','AST-T029',5,7,NULL,'in','Warehouse','2026-01-10 07:00:00'),
(30,'RF-A030','AST-T030',5,7,NULL,'in','Warehouse','2026-01-10 07:00:00'),
(31,'RF-A031','AST-T031',6,8,NULL,'in','Warehouse','2026-01-11 07:00:00'),
(32,'RF-A032','AST-T032',6,8,NULL,'in','Warehouse','2026-01-11 07:00:00'),
(33,'RF-A033','AST-T033',7,1,NULL,'in','Warehouse','2026-01-11 07:00:00'),
(34,'RF-A034','AST-T034',7,1,NULL,'in','Warehouse','2026-01-11 07:00:00'),
-- Di Customer (out) = 17
(35,'RF-A035','AST-T035',1,2,1,'out','PT Astra Honda Motor','2026-01-12 07:00:00'),
(36,'RF-A036','AST-T036',1,2,1,'out','PT Astra Honda Motor','2026-01-12 07:00:00'),
(37,'RF-A037','AST-T037',2,3,1,'out','PT Astra Honda Motor','2026-01-12 07:00:00'),
(38,'RF-A038','AST-T038',2,3,2,'out','PT Astra Daihatsu Motor','2026-01-13 07:00:00'),
(39,'RF-A039','AST-T039',3,4,2,'out','PT Astra Daihatsu Motor','2026-01-13 07:00:00'),
(40,'RF-A040','AST-T040',3,4,2,'out','PT Astra Daihatsu Motor','2026-01-13 07:00:00'),
(41,'RF-A041','AST-T041',4,5,3,'out','PT Toyota Astra Motor','2026-01-14 07:00:00'),
(42,'RF-A042','AST-T042',4,5,3,'out','PT Toyota Astra Motor','2026-01-14 07:00:00'),
(43,'RF-A043','AST-T043',5,6,3,'out','PT Toyota Astra Motor','2026-01-14 07:00:00'),
(44,'RF-A044','AST-T044',5,6,4,'out','PT Suzuki Indomobil','2026-01-15 07:00:00'),
(45,'RF-A045','AST-T045',6,7,4,'out','PT Suzuki Indomobil','2026-01-15 07:00:00'),
(46,'RF-A046','AST-T046',6,7,4,'out','PT Suzuki Indomobil','2026-01-15 07:00:00'),
(47,'RF-A047','AST-T047',7,8,5,'out','PT Nusantara Motor','2026-01-16 07:00:00'),
(48,'RF-A048','AST-T048',7,8,5,'out','PT Nusantara Motor','2026-01-16 07:00:00'),
(49,'RF-A049','AST-T049',8,1,1,'out','PT Astra Honda Motor','2026-01-16 07:00:00'),
(50,'RF-A050','AST-T050',8,1,1,'out','PT Astra Honda Motor','2026-01-17 07:00:00'),
(51,'RF-A051','AST-T051',1,2,2,'out','PT Astra Daihatsu Motor','2026-01-17 07:00:00'),
-- Repair = 9
(52,'RF-A052','AST-T052',2,3,NULL,'repair','Workshop Repair','2026-01-18 07:00:00'),
(53,'RF-A053','AST-T053',3,4,NULL,'repair','Workshop Repair','2026-01-18 07:00:00'),
(54,'RF-A054','AST-T054',4,5,NULL,'repair','Workshop Repair','2026-01-18 07:00:00'),
(55,'RF-A055','AST-T055',5,6,NULL,'repair','Workshop Repair','2026-01-19 07:00:00'),
(56,'RF-A056','AST-T056',6,7,NULL,'repair','Workshop Repair','2026-01-19 07:00:00'),
(57,'RF-A057','AST-T057',7,8,NULL,'repair','Workshop Repair','2026-01-19 07:00:00'),
(58,'RF-A058','AST-T058',8,1,NULL,'repair','Workshop Repair','2026-01-20 07:00:00'),
(59,'RF-A059','AST-T059',1,2,NULL,'repair','Workshop Repair','2026-01-20 07:00:00'),
(60,'RF-A060','AST-T060',2,3,NULL,'repair','Workshop Repair','2026-01-20 07:00:00');

-- ============================================================
-- ASSET EVENTS (Sample transaksi RFID bulan Februari 2026)
-- Nonaktifkan FK sementara agar insert bisa langsung
-- ============================================================
SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO `asset_events` (`id`,`asset_id`,`reader_id`,`event_type`,`location`,`customer_id`,`driver_id`,`vehicle_id`,`scanned_by`,`scan_time`) VALUES
-- Minggu lalu (16-20 Feb 2026)
(1,1,3,'out','Area Loading',1,1,1,2,'2026-02-17 08:10:00'),
(2,3,3,'out','Area Loading',1,1,1,2,'2026-02-17 08:20:00'),
(3,5,3,'out','Area Loading',2,2,2,2,'2026-02-17 08:30:00'),
(4,7,3,'out','Area Loading',3,2,2,3,'2026-02-17 09:00:00'),
(5,9,3,'out','Area Loading',4,3,3,3,'2026-02-18 08:00:00'),
(6,11,3,'out','Area Loading',4,3,3,3,'2026-02-18 08:15:00'),
(7,2,4,'in','Area Unloading',1,1,1,2,'2026-02-18 10:00:00'),
(8,35,4,'in','Area Unloading',1,1,1,2,'2026-02-18 10:10:00'),
(9,36,4,'in','Area Unloading',1,1,1,2,'2026-02-18 10:20:00'),
(10,13,3,'out','Area Loading',1,1,1,2,'2026-02-19 08:00:00'),
(11,15,3,'out','Area Loading',2,2,2,3,'2026-02-19 08:30:00'),
(12,17,3,'out','Area Loading',3,3,3,3,'2026-02-19 09:00:00'),
(13,38,4,'in','Area Unloading',2,2,2,2,'2026-02-19 14:00:00'),
(14,39,4,'in','Area Unloading',2,2,2,2,'2026-02-19 14:10:00'),
(15,19,3,'out','Area Loading',5,4,4,2,'2026-02-20 08:00:00'),
(16,21,3,'out','Area Loading',5,4,4,2,'2026-02-20 08:20:00'),
(17,41,4,'in','Area Unloading',3,3,3,3,'2026-02-20 13:00:00'),
-- Kemarin (23 Feb 2026)
(18,23,3,'out','Area Loading',1,1,1,2,'2026-02-23 08:00:00'),
(19,25,3,'out','Area Loading',2,2,2,3,'2026-02-23 08:30:00'),
(20,27,3,'out','Area Loading',3,2,2,3,'2026-02-23 09:00:00'),
(21,43,4,'in','Area Unloading',3,2,2,2,'2026-02-23 14:00:00'),
(22,44,4,'in','Area Unloading',4,3,3,3,'2026-02-23 14:30:00'),
(23,29,3,'out','Area Loading',4,3,3,3,'2026-02-23 09:30:00'),
-- Hari ini (24 Feb 2026)
(24,31,3,'out','Area Loading',1,1,1,2,'2026-02-24 08:00:00'),
(25,33,3,'out','Area Loading',2,2,2,3,'2026-02-24 08:15:00'),
(26,46,4,'in','Area Unloading',4,3,3,3,'2026-02-24 10:00:00'),
(27,47,4,'in','Area Unloading',5,4,4,2,'2026-02-24 10:10:00');

SET FOREIGN_KEY_CHECKS = 1;

-- REPAIRS
INSERT INTO `repairs` (`id`,`asset_id`,`repair_date`,`repair_type`,`location`,`repaired_by`,`status`,`finished_at`,`notes`,`created_at`) VALUES
(1,52,'2026-01-18','Rangka Bengkok','Workshop Repair',2,'finished','2026-01-22','Sudah diperbaiki dan dicat ulang','2026-01-18 08:00:00'),
(2,53,'2026-01-18','Roda Rusak','Workshop Repair',2,'finished','2026-01-20','Ganti 2 roda baru','2026-01-18 08:30:00'),
(3,54,'2026-01-18','Las Putus','Workshop Repair',2,'ongoing',NULL,'Menunggu material','2026-01-18 09:00:00'),
(4,55,'2026-01-19','Rangka Retak','Workshop Repair',3,'ongoing',NULL,'Sedang proses pengelasan','2026-01-19 08:00:00'),
(5,56,'2026-01-19','Engsel Patah','Workshop Repair',3,'ongoing',NULL,NULL,'2026-01-19 08:30:00'),
(6,57,'2026-01-19','Cat Terkelupas','Workshop Repair',2,'ongoing',NULL,'Antri pengecatan','2026-01-19 09:00:00'),
(7,58,'2026-01-20','Roda Macet','Workshop Repair',3,'ongoing',NULL,NULL,'2026-01-20 08:00:00'),
(8,59,'2026-01-20','Bracket Bengkok','Workshop Repair',2,'ongoing',NULL,'Perlu fabrikasi ulang','2026-01-20 08:30:00'),
(9,60,'2026-01-20','Body Penyok','Workshop Repair',3,'ongoing',NULL,NULL,'2026-01-20 09:00:00');

-- KALENDER KERJA
INSERT INTO `kalender_kerja` (`id`,`bulan`,`tahun`,`hari_kerja`,`created_at`) VALUES
(1,'Januari',2026,23,'2026-01-01 07:00:00'),
(2,'Februari',2026,20,'2026-01-01 07:00:00'),
(3,'Maret',2026,22,'2026-01-01 07:00:00'),
(4,'April',2026,22,'2026-01-01 07:00:00'),
(5,'Mei',2026,19,'2026-01-01 07:00:00'),
(6,'Juni',2026,22,'2026-01-01 07:00:00');

-- LEAD TIME
INSERT INTO `lead_time` (`id`,`part_id`,`lt_production`,`lt_store`,`lt_customer`,`created_at`) VALUES
(1,1,8,15,6,'2026-01-01 07:00:00'),
(2,2,7,14,5,'2026-01-01 07:00:00'),
(3,3,10,20,7,'2026-01-01 07:00:00'),
(4,4,5,10,3,'2026-01-01 07:00:00'),
(5,5,6,12,4,'2026-01-01 07:00:00'),
(6,6,9,18,6,'2026-01-01 07:00:00'),
(7,7,7,15,5,'2026-01-01 07:00:00'),
(8,8,8,16,6,'2026-01-01 07:00:00');

-- FORECAST MONTH
INSERT INTO `forecast_month` (`id`,`part_id`,`bulan`,`tahun`,`forecast_month`,`created_at`) VALUES
(1,1,'Februari',2026,120,'2026-02-01 07:00:00'),
(2,2,'Februari',2026,90,'2026-02-01 07:00:00'),
(3,3,'Februari',2026,150,'2026-02-01 07:00:00'),
(4,4,'Februari',2026,200,'2026-02-01 07:00:00'),
(5,5,'Februari',2026,80,'2026-02-01 07:00:00'),
(6,1,'Maret',2026,130,'2026-02-01 07:00:00'),
(7,2,'Maret',2026,100,'2026-02-01 07:00:00');

-- FORECAST INPUT
INSERT INTO `forecast_input` (`id`,`forecast_month_id`,`packaging_id`,`kalender_kerja`,`lead_time`,`actual_packaging`,`created_at`) VALUES
(1,1,1,20,8,110,'2026-02-01 07:00:00'),
(2,2,2,20,7,85,'2026-02-01 07:00:00'),
(3,3,3,20,10,140,'2026-02-01 07:00:00'),
(4,4,4,20,5,195,'2026-02-01 07:00:00');

-- ACTUAL PACKAGING
INSERT INTO `actual_packaging` (`id`,`part_id`,`qty_actual`,`tanggal`,`created_at`) VALUES
(1,1,110,'2026-02-03','2026-02-03 17:00:00'),
(2,2,85,'2026-02-03','2026-02-03 17:00:00'),
(3,3,60,'2026-02-04','2026-02-04 17:00:00'),
(4,4,42,'2026-02-04','2026-02-04 17:00:00'),
(5,5,65,'2026-02-05','2026-02-05 17:00:00'),
(6,1,115,'2026-02-10','2026-02-10 17:00:00'),
(7,2,88,'2026-02-10','2026-02-10 17:00:00'),
(8,3,62,'2026-02-17','2026-02-17 17:00:00'),
(9,4,45,'2026-02-17','2026-02-17 17:00:00'),
(10,5,70,'2026-02-24','2026-02-24 17:00:00');

-- KEBUTUHAN PACKAGING
INSERT INTO `kebutuhan_packaging` (`id`,`customer_id`,`packaging_id`,`part_id`,`bulan`,`tahun`,`qty_kebutuhan`,`qty_tersedia`,`keterangan`,`created_at`) VALUES
(1,1,1,1,'Februari',2026,10,8,'Kurang 2 unit Trolley untuk AHM','2026-02-01 07:00:00'),
(2,1,6,2,'Februari',2026,15,15,'Terpenuhi','2026-02-01 07:00:00'),
(3,2,2,3,'Februari',2026,8,6,'Kurang 2 unit Trolley Besar','2026-02-01 07:00:00'),
(4,3,4,4,'Februari',2026,20,20,'Terpenuhi','2026-02-01 07:00:00'),
(5,4,5,5,'Februari',2026,12,10,'Kurang 2 unit Pallet','2026-02-01 07:00:00'),
(6,5,7,6,'Februari',2026,6,6,'Terpenuhi','2026-02-01 07:00:00');

-- ============================================================
-- RESET FK DAN COMMIT
-- ============================================================
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

-- ============================================================
-- END OF db_packaging.sql
-- Database: db_troli
-- Total: 19 Tables | 3 Triggers | 5 Views
-- Ready for: MySQL 8.0+ / MariaDB 10.4+
-- Import: mysql -u root -p < db_packaging.sql
-- ============================================================
