-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 16, 2026 at 03:17 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_troli`
--

-- --------------------------------------------------------

--
-- Table structure for table `actual_packaging`
--

CREATE TABLE `actual_packaging` (
  `id` int(5) NOT NULL,
  `part_id` int(5) NOT NULL,
  `qty_actual` int(5) NOT NULL,
  `tanggal` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `actual_packaging`
--

INSERT INTO `actual_packaging` (`id`, `part_id`, `qty_actual`, `tanggal`, `created_at`) VALUES
(1, 1, 150, '2026-02-03', NULL),
(2, 2, 150, '2026-02-04', NULL),
(3, 3, 55, '2026-02-04', NULL),
(4, 4, 39, '2026-02-04', NULL),
(5, 5, 60, '2026-02-04', NULL),
(6, 6, 100, '2026-02-12', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `assets`
--

CREATE TABLE `assets` (
  `id` int(5) NOT NULL,
  `rfid_tag` varchar(30) NOT NULL,
  `asset_code` varchar(30) NOT NULL,
  `packaging_id` int(5) NOT NULL,
  `part_id` int(5) NOT NULL,
  `status` varchar(30) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assets`
--

INSERT INTO `assets` (`id`, `rfid_tag`, `asset_code`, `packaging_id`, `part_id`, `status`, `created_at`) VALUES
(1, 'RF3001', 'AST-101', 1, 1, 'in', '2026-01-20 08:00:00'),
(2, 'RF3002', 'AST-102', 2, 2, 'repair', '2026-01-20 08:00:00'),
(3, 'RF3003', 'AST-103', 3, 3, 'in', '2026-01-20 08:00:00'),
(4, 'RF3004', 'AST-104', 4, 4, 'out', '2026-01-20 08:00:00'),
(5, 'RF3005', 'AST-105', 5, 5, 'in', '2026-01-20 08:00:00'),
(6, 'RF3006', 'AST-106', 1, 2, 'out', '2026-01-21 08:00:00'),
(7, 'RF3007', 'AST-107', 2, 3, 'in', '2026-01-21 08:00:00'),
(8, 'RF3008', 'AST-108', 3, 4, 'out', '2026-01-21 08:00:00'),
(9, 'RF3009', 'AST-109', 4, 5, 'in', '2026-01-21 08:00:00'),
(10, 'RF3010', 'AST-110', 5, 1, 'out', '2026-01-21 08:00:00'),
(11, 'RF3011', 'AST-111', 1, 3, 'in', '2026-01-22 08:00:00'),
(12, 'RF3012', 'AST-112', 2, 4, 'out', '2026-01-22 08:00:00'),
(13, 'RF3013', 'AST-113', 3, 5, 'in', '2026-01-22 08:00:00'),
(14, 'RF3014', 'AST-114', 4, 1, 'out', '2026-01-22 08:00:00'),
(15, 'RF3015', 'AST-115', 5, 2, 'in', '2026-01-22 08:00:00'),
(16, 'RF3016', 'AST-116', 1, 4, 'out', '2026-01-23 08:00:00'),
(17, 'RF3017', 'AST-117', 2, 5, 'in', '2026-01-23 08:00:00'),
(18, 'RF3018', 'AST-118', 3, 1, 'out', '2026-01-23 08:00:00'),
(19, 'RF3019', 'AST-119', 4, 2, 'in', '2026-01-23 08:00:00'),
(20, 'RF3020', 'AST-120', 5, 3, 'in', '2026-01-23 08:00:00'),
(21, 'RF2008', 'AST-012', 5, 3, 'in', '2026-02-14 13:55:25'),
(22, 'RF0657', 'AVG001', 5, 6, 'in', '2026-02-16 09:11:55');

-- --------------------------------------------------------

--
-- Table structure for table `asset_events`
--

CREATE TABLE `asset_events` (
  `id` int(5) NOT NULL,
  `asset_id` int(5) NOT NULL,
  `reader_id` int(5) NOT NULL,
  `event_type` varchar(20) NOT NULL,
  `location` varchar(50) NOT NULL,
  `driver_id` int(5) NOT NULL,
  `vehicle_id` int(5) NOT NULL,
  `scanned_by` int(5) NOT NULL,
  `scan_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `asset_events`
--

INSERT INTO `asset_events` (`id`, `asset_id`, `reader_id`, `event_type`, `location`, `driver_id`, `vehicle_id`, `scanned_by`, `scan_time`) VALUES
(1, 1, 1, 'in', 'Warehouse IN', 1, 1, 1, '2026-01-20 08:10:00'),
(2, 1, 2, 'out', 'Quality Control', 1, 1, 1, '2026-01-21 09:00:00'),
(3, 1, 3, 'in', 'Area Loading', 1, 1, 1, '2026-01-22 10:30:00'),
(4, 2, 1, 'out', 'Warehouse OUT', 1, 1, 1, '2026-01-20 09:15:00'),
(5, 2, 3, 'in', 'Area Loading', 1, 1, 1, '2026-01-21 11:20:00'),
(6, 2, 4, 'out', 'Area Unloading', 1, 1, 1, '2026-01-23 14:00:00'),
(7, 3, 1, 'in', 'Warehouse IN', 1, 1, 1, '2026-01-20 10:00:00'),
(8, 3, 2, 'out', 'Quality Control', 1, 1, 1, '2026-01-22 13:10:00'),
(9, 3, 1, 'in', 'Warehouse IN', 1, 1, 1, '2026-01-24 16:40:00'),
(10, 4, 1, 'out', 'Warehouse OUT', 1, 1, 1, '2026-01-20 11:00:00'),
(11, 4, 4, 'out', 'Area Unloading', 1, 1, 1, '2026-01-22 15:00:00'),
(12, 5, 1, 'in', 'Warehouse IN', 1, 1, 1, '2026-01-20 12:00:00'),
(13, 5, 3, 'in', 'Area Loading', 1, 1, 1, '2026-01-21 14:20:00'),
(14, 6, 2, 'out', 'Quality Control', 1, 1, 1, '2026-01-21 08:30:00'),
(15, 6, 4, 'out', 'Area Unloading', 1, 1, 1, '2026-01-22 09:45:00'),
(16, 7, 1, 'in', 'Warehouse IN', 1, 1, 1, '2026-01-21 09:00:00'),
(17, 7, 2, 'in', 'Quality Control', 1, 1, 1, '2026-01-23 11:00:00'),
(18, 8, 3, 'out', 'Area Loading', 1, 1, 1, '2026-01-21 10:00:00'),
(19, 8, 4, 'out', 'Area Unloading', 1, 1, 1, '2026-01-24 15:00:00'),
(20, 9, 1, 'in', 'Warehouse IN', 1, 1, 1, '2026-01-21 11:00:00'),
(21, 9, 2, 'out', 'Quality Control', 1, 1, 1, '2026-01-22 16:00:00'),
(22, 9, 1, 'in', 'Warehouse IN', 1, 1, 1, '2026-01-25 09:30:00'),
(23, 10, 1, 'out', 'Warehouse OUT', 1, 1, 1, '2026-01-21 12:00:00'),
(24, 11, 1, 'in', 'Warehouse IN', 1, 1, 1, '2026-01-22 08:00:00'),
(25, 12, 3, 'out', 'Area Loading', 1, 1, 1, '2026-01-22 09:00:00'),
(26, 13, 1, 'in', 'Warehouse IN', 1, 1, 1, '2026-01-22 10:00:00'),
(27, 14, 4, 'out', 'Area Unloading', 1, 1, 1, '2026-01-22 11:00:00'),
(28, 15, 1, 'in', 'Warehouse IN', 1, 1, 1, '2026-01-22 12:00:00'),
(29, 16, 2, 'out', 'Quality Control', 1, 1, 1, '2026-01-23 08:00:00'),
(30, 17, 1, 'in', 'Warehouse IN', 1, 1, 1, '2026-01-23 09:00:00'),
(31, 18, 3, 'out', 'Area Loading', 1, 1, 1, '2026-01-23 10:00:00'),
(32, 19, 1, 'in', 'Warehouse IN', 1, 1, 1, '2026-01-23 11:00:00'),
(33, 20, 4, 'out', 'Area Unloading', 1, 1, 1, '2026-01-23 12:00:00'),
(34, 1, 1, 'in', 'Warehouse A', 1, 1, 1, '2026-02-16 03:14:58');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(5) NOT NULL,
  `customer_code` varchar(30) NOT NULL,
  `customer_name` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `customer_code`, `customer_name`, `created_at`) VALUES
(1, '1108', 'PT Nusantara Motor', '2026-02-03 17:12:35'),
(2, '1109', 'PT Sentosa Abadi', '2026-02-03 17:12:35'),
(3, '1110', 'PT Global Industri', '2026-02-03 17:12:35'),
(4, '1111', 'PT Mega Karya', '2026-02-03 17:12:35'),
(5, '1112', 'PT Sinar Jaya', '2026-02-03 17:12:35'),
(6, 'AAA', 'FBGH', '2026-02-14 13:54:40'),
(7, '1111111', 'AHMB', '2026-02-16 09:10:08');

-- --------------------------------------------------------

--
-- Table structure for table `drivers`
--

CREATE TABLE `drivers` (
  `id` int(5) NOT NULL,
  `driver_name` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `drivers`
--

INSERT INTO `drivers` (`id`, `driver_name`, `created_at`) VALUES
(1, 'Andi Supir', '2026-02-03 17:12:35'),
(2, 'Budi Supir', '2026-02-03 17:12:35'),
(3, 'Charlie Supir', '2026-02-03 17:12:35'),
(4, 'Deni Supir', '2026-02-03 17:12:35');

-- --------------------------------------------------------

--
-- Table structure for table `forecast_input`
--

CREATE TABLE `forecast_input` (
  `id` int(11) NOT NULL,
  `forecast_month_id` int(11) DEFAULT NULL,
  `kalender_kerja` int(11) DEFAULT NULL,
  `packaging_id` int(11) DEFAULT NULL,
  `lead_time` int(11) DEFAULT NULL,
  `actual_packaging` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `forecast_input`
--

INSERT INTO `forecast_input` (`id`, `forecast_month_id`, `kalender_kerja`, `packaging_id`, `lead_time`, `actual_packaging`, `created_at`) VALUES
(1, 1, 0, 1, 0, 120, '2026-02-05 04:28:35'),
(2, 2, 0, 1, 0, 200, '2026-02-05 04:28:35'),
(7, 7, 0, 1, 0, 0, '2026-02-16 02:13:18'),
(8, 8, 0, 1, 0, 0, '2026-02-16 02:13:18');

-- --------------------------------------------------------

--
-- Table structure for table `forecast_month`
--

CREATE TABLE `forecast_month` (
  `id` int(5) NOT NULL,
  `part_id` int(5) NOT NULL,
  `bulan` varchar(20) DEFAULT NULL,
  `tahun` varchar(10) DEFAULT NULL,
  `forecast_month` int(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `forecast_month`
--

INSERT INTO `forecast_month` (`id`, `part_id`, `bulan`, `tahun`, `forecast_month`, `created_at`) VALUES
(1, 1, 'Februari', '2026', 10000, NULL),
(2, 2, 'Februari', '2026', 15000, NULL),
(7, 1, 'Maret', '2026', 100, NULL),
(8, 2, 'Maret', '2026', 200, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `kalender_kerja`
--

CREATE TABLE `kalender_kerja` (
  `id` int(5) NOT NULL,
  `bulan` varchar(100) NOT NULL,
  `tahun` varchar(10) NOT NULL,
  `hari_kerja` int(5) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kalender_kerja`
--

INSERT INTO `kalender_kerja` (`id`, `bulan`, `tahun`, `hari_kerja`, `created_at`) VALUES
(1, 'Februari', '2026', 20, '2026-02-04 05:09:07');

-- --------------------------------------------------------

--
-- Table structure for table `lead_time`
--

CREATE TABLE `lead_time` (
  `id` int(5) NOT NULL,
  `part_id` int(5) NOT NULL,
  `lt_production` int(5) NOT NULL,
  `lt_store` int(5) NOT NULL,
  `lt_customer` int(5) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lead_time`
--

INSERT INTO `lead_time` (`id`, `part_id`, `lt_production`, `lt_store`, `lt_customer`, `created_at`) VALUES
(1, 1, 8, 15, 6, '2026-02-04 06:39:10'),
(2, 2, 8, 10, 3, '2026-02-10 09:01:04'),
(3, 6, 15, 10, 4, '2026-02-16 02:11:00');

-- --------------------------------------------------------

--
-- Table structure for table `packagings`
--

CREATE TABLE `packagings` (
  `id` int(5) NOT NULL,
  `packaging_name` varchar(50) NOT NULL,
  `kapasitas_packaging` int(5) NOT NULL,
  `packaging_type_id` int(5) NOT NULL,
  `warna` varchar(30) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `packagings`
--

INSERT INTO `packagings` (`id`, `packaging_name`, `kapasitas_packaging`, `packaging_type_id`, `warna`, `created_at`) VALUES
(1, 'Box Plastik Biru', 100, 1, 'Biru', '2026-02-03 17:12:35'),
(2, 'Box Plastik Hijau', 100, 2, 'Hijau', '2026-02-03 17:12:35'),
(3, 'Rack Besi Medium', 100, 3, 'Abu-abu', '2026-02-03 17:12:35'),
(4, 'Rack Besi Besar', 50, 3, 'Hitam', '2026-02-03 17:12:35'),
(5, '6604', 100, 4, 'Putih', '2026-02-03 17:12:35'),
(7, '6055', 50, 4, 'Biru', '2026-02-10 14:19:24');

-- --------------------------------------------------------

--
-- Table structure for table `packaging_types`
--

CREATE TABLE `packaging_types` (
  `id` int(5) NOT NULL,
  `type_name` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `packaging_types`
--

INSERT INTO `packaging_types` (`id`, `type_name`, `created_at`) VALUES
(1, 'Trolley', '2026-02-03 17:12:35'),
(2, 'Dolley', '2026-02-03 17:12:35'),
(3, 'Pallet', '2026-02-03 17:12:35'),
(4, 'Box', '2026-02-04 07:56:15');

-- --------------------------------------------------------

--
-- Table structure for table `part`
--

CREATE TABLE `part` (
  `id` int(5) NOT NULL,
  `part_number` varchar(30) NOT NULL,
  `part_name` varchar(50) NOT NULL,
  `customer_id` int(5) NOT NULL,
  `qty_per_pack` int(5) NOT NULL,
  `keterangan` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `part`
--

INSERT INTO `part` (`id`, `part_number`, `part_name`, `customer_id`, `qty_per_pack`, `keterangan`, `created_at`) VALUES
(1, 'PN-003', 'Frame Assembly', 1, 25, 'Part rangka utama', '2026-02-03 17:12:35'),
(2, 'PN-004', 'Gear Box', 1, 15, 'Transmisi mesin', '2026-02-03 17:12:35'),
(3, 'PN-005', 'Oil Tank', 3, 10, 'Tangki oli', '2026-02-03 17:12:35'),
(4, 'PN-006', 'Bracket Mounting', 4, 30, 'Bracket dudukan', '2026-02-03 17:12:35'),
(5, 'PN-007', 'Panel Cover', 5, 20, 'Cover pelindung', '2026-02-03 17:12:35'),
(6, '1234', 'AVGI', 7, 100, '-', '2026-02-16 09:10:32');

-- --------------------------------------------------------

--
-- Table structure for table `readers`
--

CREATE TABLE `readers` (
  `id` int(5) NOT NULL,
  `reader_code` varchar(30) NOT NULL,
  `reader_name` varchar(50) NOT NULL,
  `location` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `readers`
--

INSERT INTO `readers` (`id`, `reader_code`, `reader_name`, `location`, `created_at`) VALUES
(1, 'RD-03', 'Gate Produksi', 'Line Produksi', '2026-02-03 17:12:35'),
(2, 'RD-04', 'Gate QC', 'Quality Control', '2026-02-03 17:12:35'),
(3, 'RD-05', 'Gate Loading', 'Area Loading', '2026-02-03 17:12:35'),
(4, 'RD-06', 'Gate Unloading', 'Area Unloading', '2026-02-03 17:12:35');

-- --------------------------------------------------------

--
-- Table structure for table `repairs`
--

CREATE TABLE `repairs` (
  `id` int(11) NOT NULL,
  `asset_id` int(11) NOT NULL,
  `repair_date` date NOT NULL,
  `repair_type` varchar(100) NOT NULL,
  `location` varchar(100) NOT NULL,
  `status` enum('ongoing','finished') DEFAULT 'ongoing',
  `finished_at` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `repairs`
--

INSERT INTO `repairs` (`id`, `asset_id`, `repair_date`, `repair_type`, `location`, `status`, `finished_at`, `notes`, `created_at`) VALUES
(1, 20, '2026-02-04', 'Rangka', 'Warehouse', 'finished', '2026-02-04', '-', '2026-02-04 02:09:27'),
(2, 2, '2026-02-04', 'Rangka', 'Warehouse', 'ongoing', NULL, 'iii', '2026-02-04 02:48:03'),
(3, 22, '2026-02-16', 'Rangka', 'Warehouse A', 'finished', '2026-02-16', 'Rusak', '2026-02-16 02:12:15');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(5) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(50) NOT NULL,
  `role` varchar(20) NOT NULL,
  `is_active` varchar(5) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `name`, `role`, `is_active`, `created_at`) VALUES
(1, 'admin', 'admin@gmail.com', '$2b$10$lreruX8TBL.DEdyUjeeTGOuqDiG0vHVc4GxgPKBT87SiKgbkcmMFK', 'Administrator', 'admin', '1', '2026-01-28 10:28:09');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int(5) NOT NULL,
  `plate_number` varchar(15) NOT NULL,
  `vehicle_type` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`id`, `plate_number`, `vehicle_type`, `created_at`) VALUES
(1, 'B 1111 AA', 'Truck Box', '2026-02-03 17:12:35'),
(2, 'B 2222 BB', 'Wingbox', '2026-02-03 17:12:35'),
(3, 'B 3333 CC', 'Trailer', '2026-02-03 17:12:35'),
(4, 'B 4444 DD', 'Pickup', '2026-02-03 17:12:35');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `actual_packaging`
--
ALTER TABLE `actual_packaging`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `assets`
--
ALTER TABLE `assets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `asset_events`
--
ALTER TABLE `asset_events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `drivers`
--
ALTER TABLE `drivers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `forecast_input`
--
ALTER TABLE `forecast_input`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `forecast_month`
--
ALTER TABLE `forecast_month`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kalender_kerja`
--
ALTER TABLE `kalender_kerja`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lead_time`
--
ALTER TABLE `lead_time`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `packagings`
--
ALTER TABLE `packagings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `packaging_types`
--
ALTER TABLE `packaging_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `part`
--
ALTER TABLE `part`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `readers`
--
ALTER TABLE `readers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `repairs`
--
ALTER TABLE `repairs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `actual_packaging`
--
ALTER TABLE `actual_packaging`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `assets`
--
ALTER TABLE `assets`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `asset_events`
--
ALTER TABLE `asset_events`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `drivers`
--
ALTER TABLE `drivers`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `forecast_input`
--
ALTER TABLE `forecast_input`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `forecast_month`
--
ALTER TABLE `forecast_month`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `kalender_kerja`
--
ALTER TABLE `kalender_kerja`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `lead_time`
--
ALTER TABLE `lead_time`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `packagings`
--
ALTER TABLE `packagings`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `packaging_types`
--
ALTER TABLE `packaging_types`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `part`
--
ALTER TABLE `part`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `readers`
--
ALTER TABLE `readers`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `repairs`
--
ALTER TABLE `repairs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
