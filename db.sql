-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 18, 2017 at 11:46 AM
-- Server version: 10.1.13-MariaDB
-- PHP Version: 5.6.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `childline`
--

-- --------------------------------------------------------

--
-- Table structure for table `children`
--

CREATE TABLE `children` (
  `id` int(11) NOT NULL,
  `id_contact` int(11) NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `sex` enum('m','f','u') NOT NULL DEFAULT 'u',
  `age` enum('0-1','2-4','5-8','9-12','13-16','17','18','Adult','Age Unknown') NOT NULL DEFAULT 'Age Unknown',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `id` int(11) NOT NULL,
  `case_number` varchar(64) NOT NULL,
  `name_of_caller` varchar(64) DEFAULT NULL,
  `name_of_volunteer` varchar(64) DEFAULT NULL,
  `phone_number` varchar(64) DEFAULT NULL,
  `name_mother` varchar(64) DEFAULT NULL,
  `name_father` varchar(64) DEFAULT NULL,
  `surname` varchar(64) DEFAULT NULL,
  `address` text,
  `notes` text,
  `primary_call_reason` varchar(64) NOT NULL,
  `secondary_call_reason` varchar(64) DEFAULT NULL,
  `follow_up` enum('y','n') DEFAULT NULL,
  `anonymity` enum('y','n','Not Discussed') NOT NULL DEFAULT 'Not Discussed',
  `category` varchar(64) NOT NULL,
  `aa_custody_sergeant` int(11) DEFAULT NULL,
  `aa_reason` int(11) DEFAULT NULL,
  `aa_first_name_minor` int(11) DEFAULT NULL,
  `aa_middle_name_minor` int(11) DEFAULT NULL,
  `aa_surname_minor` int(11) DEFAULT NULL,
  `aa_dob` int(11) DEFAULT NULL,
  `aa_gender` enum('m','f') DEFAULT 'm',
  `aa_arrest_reason` int(11) DEFAULT NULL,
  `aa_arresting_officer_name` int(11) DEFAULT NULL,
  `aa_arresting_officer_number` int(11) DEFAULT NULL,
  `aa_interviewed` enum('y','n') DEFAULT 'n',
  `aa_interviewers` text,
  `aa_rights_read` enum('y','n') DEFAULT 'n',
  `aa_searched` enum('y','n') DEFAULT 'n',
  `aa_injuries` enum('y','n') DEFAULT 'n',
  `aa_injury_details` text,
  `aa_others_involved` text,
  `aa_case_notes` text,
  `aa_your_action` text,
  `aa_informed` enum('y','n') DEFAULT 'n',
  `aa_lawyer` enum('y','n') DEFAULT 'n',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(64) NOT NULL,
  `salt` varchar(64) NOT NULL,
  `hash` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `children`
--
ALTER TABLE `children`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `children`
--
ALTER TABLE `children`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
