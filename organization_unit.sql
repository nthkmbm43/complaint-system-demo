-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: sql113.infinityfree.com
-- Generation Time: Apr 24, 2026 at 05:08 AM
-- Server version: 11.4.10-MariaDB
-- PHP Version: 7.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `if0_40673385_complaint_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `organization_unit`
--

CREATE TABLE `organization_unit` (
  `Unit_id` int(4) NOT NULL,
  `Unit_name` varchar(100) NOT NULL COMMENT 'ชื่อหน่วยงาน/คณะ/สาขา/แผนก',
  `Unit_type` varchar(20) NOT NULL COMMENT 'ประเภท: faculty, major, department',
  `Unit_icon` varchar(50) DEFAULT NULL COMMENT 'ไอคอน',
  `Unit_parent_id` int(4) DEFAULT NULL COMMENT 'หน่วยงานต้นสังกัด',
  `Unit_tel` varchar(10) DEFAULT NULL COMMENT 'เบอร์ติดต่อ',
  `Unit_email` varchar(100) DEFAULT NULL COMMENT 'อีเมล'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `organization_unit`
--

INSERT INTO `organization_unit` (`Unit_id`, `Unit_name`, `Unit_type`, `Unit_icon`, `Unit_parent_id`, `Unit_tel`, `Unit_email`) VALUES
(1, 'คณะครุศาสตร์อุตสาหกรรม', 'faculty', '🎓', NULL, NULL, NULL),
(2, 'คณะวิศวกรรมศาสตร์', 'faculty', '⚙️', NULL, NULL, NULL),
(3, 'คณะบริหารธุรกิจ', 'faculty', '💼', NULL, NULL, NULL),
(4, 'งานทะเบียนและประมวลผล', 'department', '📋', NULL, '043123456', 'registration@rmuti.ac.th'),
(5, 'งานกิจการนักศึกษา', 'department', '👥', NULL, '043123457', 'student.affairs@rmuti.ac.th'),
(6, 'งานอาคารสถานที่', 'department', '🏢', NULL, '043123458', 'building@rmuti.ac.th'),
(7, 'งานเทคโนโลยีสารสนเทศ', 'department', '💻', NULL, '043123459', 'it@rmuti.ac.th'),
(8, 'งานการเงินและบัญชี', 'department', '💰', NULL, '043123460', 'finance@rmuti.ac.th'),
(9, 'งานบุคลากร', 'department', '👔', NULL, '043123461', 'hr@rmuti.ac.th'),
(10, 'งานประชาสัมพันธ์', 'department', '📢', NULL, '043123462', 'pr@rmuti.ac.th'),
(11, 'งานวิเทศสัมพันธ์', 'department', '🌍', NULL, '043123463', 'international@rmuti.ac.th'),
(12, 'งานประกันคุณภาพการศึกษา', 'department', '✅', NULL, '043123464', 'qa@rmuti.ac.th'),
(13, 'ศูนย์คอมพิวเตอร์', 'department', '🖥️', NULL, '043123465', 'computer.center@rmuti.ac.th'),
(14, 'หอสมุดกลาง', 'department', '📚', NULL, '043123466', 'library@rmuti.ac.th'),
(15, 'งานรักษาความปลอดภัย', 'department', '🔒', NULL, '043123467', 'security@rmuti.ac.th'),
(16, 'งานยานพาหนะ', 'department', '🚗', NULL, '043123468', 'transport@rmuti.ac.th'),
(17, 'งานสวัสดิการ', 'department', '🏥', NULL, '043123469', 'welfare@rmuti.ac.th'),
(18, 'ช่างโยธา (ปวส.)', 'major', '🏗️', 1, NULL, NULL),
(19, 'ช่างก่อสร้าง (ปวส.)', 'major', '🧱', 1, NULL, NULL),
(20, 'ช่างเครื่องมือกลอัตโนมัติ (ปวส.)', 'major', '🤖', 1, NULL, NULL),
(21, 'ช่างยนต์ (ปวส.)', 'major', '🚗', 1, NULL, NULL),
(22, 'ช่างกลเกษตร (ปวส.)', 'major', '🚜', 1, NULL, NULL),
(23, 'ช่างกลโรงงาน (ปวส.)', 'major', '🏭', 1, NULL, NULL),
(24, 'ช่างท่อและประสาน (ปวส.)', 'major', '🔧', 1, NULL, NULL),
(25, 'การออกแบบนวัตกรรมเครื่องจักรกล (ปวส.)', 'major', '⚙️', 1, NULL, NULL),
(26, 'วิศวกรรมไฟฟ้า', 'major', '⚡', 2, NULL, NULL),
(27, 'วิศวกรรมโยธา', 'major', '🏗️', 2, NULL, NULL),
(28, 'วิศวกรรมอิเล็กทรอนิกส์', 'major', '🔟', 2, NULL, NULL),
(29, 'วิศวกรรมคอมพิวเตอร์', 'major', '💻', 2, NULL, NULL),
(30, 'วิศวกรรมเมคคาทรอนิกส์', 'major', '🤖', 2, NULL, NULL),
(31, 'วิศวกรรมเครื่องกล', 'major', '⚙️', 2, NULL, NULL),
(32, 'วิศวกรรมเครื่องจักรกลเกษตร', 'major', '🚜', 2, NULL, NULL),
(33, 'วิศวกรรมอาหารและชีวภาพ', 'major', '🧬', 2, NULL, NULL),
(34, 'การบัญชี', 'major', '📊', 3, NULL, NULL),
(35, 'เทคโนโลยีธุรกิจดิจิทัล', 'major', '💻', 3, NULL, NULL),
(36, 'การตลาด', 'major', '📈', 3, NULL, NULL),
(37, 'โลจิสติกส์', 'major', '📦', 3, NULL, NULL),
(38, 'การจัดการ', 'major', '👨‍💼', 3, NULL, NULL),
(39, 'วิศวะเครื่องจักรกลโรงงาน', 'major', '🛠️', 2, '042159753', 'testaemail@gmail.com'),
(40, 'บริหาร', 'faculty', '🔌', NULL, '02123456', 'testing1@gmail.com'),
(41, 'IT', 'major', '🏢', 40, '02123457', 'testing12@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `organization_unit`
--
ALTER TABLE `organization_unit`
  ADD PRIMARY KEY (`Unit_id`),
  ADD KEY `idx_unit_type` (`Unit_type`),
  ADD KEY `idx_unit_parent` (`Unit_parent_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
