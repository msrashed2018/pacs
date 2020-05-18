-- phpMyAdmin SQL Dump
-- version 4.9.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 18, 2020 at 09:41 PM
-- Server version: 5.7.30
-- PHP Version: 7.3.6

-- SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
-- SET AUTOCOMMIT = 0;
-- START TRANSACTION;
-- SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `almustkbal_pacsdb`
--

CREATE DATABASE almustkbal_pacsdb;

--
-- User: `almustkbal_pacs`
--

CREATE USER 'almustkbal_pacs'@'localhost' IDENTIFIED  BY 'almustkbal_pacs';

GRANT ALL PRIVILEGES ON almustkbal_pacsdb.* TO 'almustkbal_pacs'@'localhost';

flush privileges;


-- --------------------------------------------------------

--
-- Table structure for table `application_entity`
--


CREATE TABLE `application_entity` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `hostname` varchar(255) NOT NULL,
  `port` int(11) NOT NULL,
  `status` bit(1) NOT NULL,
  `title` varchar(255) NOT NULL,
  `storage_path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `color`
--

CREATE TABLE `color` (
  `color_id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `equipment`
--

CREATE TABLE `equipment` (
  `pktblequipmentid` bigint(20) NOT NULL,
  `conversion_type` varchar(50) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `device_serial_number` varchar(100) DEFAULT NULL,
  `institution_address` varchar(150) DEFAULT NULL,
  `institution_name` varchar(100) DEFAULT NULL,
  `institutional_department_name` varchar(50) DEFAULT NULL,
  `manufacturer` varchar(100) DEFAULT NULL,
  `manufacturer_model_name` varchar(100) DEFAULT NULL,
  `modality` varchar(50) DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `software_version` varchar(100) DEFAULT NULL,
  `station_name` varchar(60) DEFAULT NULL,
  `pktblseriesid` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `general_tag`
--

CREATE TABLE `general_tag` (
  `id` bigint(20) NOT NULL,
  `display_order` int(11) NOT NULL,
  `required` bit(1) NOT NULL,
  `tag_id` varchar(255) NOT NULL,
  `tag_name` varchar(255) NOT NULL,
  `tag_type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `hibernate_sequence`
--

CREATE TABLE `hibernate_sequence` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `instance`
--

CREATE TABLE `instance` (
  `pktblinstanceid` bigint(20) NOT NULL,
  `acquisition_date_time` datetime DEFAULT NULL,
  `content_date_time` datetime DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `exposure_time` int(11) DEFAULT NULL,
  `image_orientation` varchar(40) DEFAULT NULL,
  `image_position` varchar(80) DEFAULT NULL,
  `image_type` varchar(40) DEFAULT NULL,
  `instance_number` int(11) DEFAULT NULL,
  `kvp` varchar(40) DEFAULT NULL,
  `media_storage_sop_instanceuid` varchar(100) DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `patient_orientation` varchar(40) DEFAULT NULL,
  `pixel_spacing` float DEFAULT NULL,
  `slice_location` float DEFAULT NULL,
  `slice_thickness` float DEFAULT NULL,
  `sop_classuid` varchar(100) DEFAULT NULL,
  `sop_instanceuid` varchar(100) DEFAULT NULL,
  `transfer_syntaxuid` varchar(100) DEFAULT NULL,
  `window_center` varchar(40) DEFAULT NULL,
  `window_width` varchar(40) DEFAULT NULL,
  `xray_tube_current` int(11) DEFAULT NULL,
  `pktblseriesid` bigint(20) DEFAULT NULL,
  `dicom_file_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `oauth_access_token`
--

CREATE TABLE `oauth_access_token` (
  `token_id` varchar(255) NOT NULL,
  `token` blob,
  `authentication_id` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `client_id` varchar(255) DEFAULT NULL,
  `authentication` blob,
  `refresh_token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `oauth_refresh_token`
--

CREATE TABLE `oauth_refresh_token` (
  `token_id` varchar(255) NOT NULL,
  `token` blob,
  `authentication` blob
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_token`
--

CREATE TABLE `password_reset_token` (
  `token_id` bigint(20) NOT NULL,
  `expiry_date` datetime DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `patient`
--

CREATE TABLE `patient` (
  `pktblpatientid` bigint(20) NOT NULL,
  `created_date` datetime DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `patient_age` varchar(10) DEFAULT NULL,
  `patient_birthday` date DEFAULT NULL,
  `patientid` varchar(100) DEFAULT NULL,
  `patient_name` varchar(100) DEFAULT NULL,
  `patient_sex` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `privilege`
--

CREATE TABLE `privilege` (
  `privilege_id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `profile_user`
--

CREATE TABLE `profile_user` (
  `user_id` bigint(20) NOT NULL,
  `account_non_expired` bit(1) DEFAULT NULL,
  `account_non_locked` bit(1) DEFAULT NULL,
  `age` int(11) NOT NULL,
  `credentials_non_expired` bit(1) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `enabled` bit(1) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `last_login_time` datetime DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `registered_date` datetime DEFAULT NULL,
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `radiation`
--

CREATE TABLE `radiation` (
  `pktblradiationid` bigint(20) NOT NULL,
  `anatomic_structure` varchar(255) DEFAULT NULL,
  `body_part_thickness` varchar(255) DEFAULT NULL,
  `ctdivol` double DEFAULT NULL,
  `comments_on_radiation_dose` varchar(255) DEFAULT NULL,
  `compression_force` varchar(255) DEFAULT NULL,
  `distance_source_to_detector` varchar(255) DEFAULT NULL,
  `distance_source_to_entrance` varchar(255) DEFAULT NULL,
  `entrance_dose` varchar(255) DEFAULT NULL,
  `entrance_dose_derivation` varchar(255) DEFAULT NULL,
  `entrance_dose_inm_gy` varchar(255) DEFAULT NULL,
  `exposed_area` varchar(255) DEFAULT NULL,
  `exposure_dose_sequence` varchar(255) DEFAULT NULL,
  `filter_material` varchar(255) DEFAULT NULL,
  `filter_type` varchar(255) DEFAULT NULL,
  `grid_focal_distance` varchar(255) DEFAULT NULL,
  `half_value_layer` varchar(255) DEFAULT NULL,
  `image_and_fluoroscopy_area_dose_product` varchar(255) DEFAULT NULL,
  `radiation_mode` varchar(255) DEFAULT NULL,
  `radionuclide_half_life` varchar(255) DEFAULT NULL,
  `radionuclide_total_dose` varchar(255) DEFAULT NULL,
  `radiopharmaceutical` varchar(255) DEFAULT NULL,
  `total_number_of_exposures` varchar(255) DEFAULT NULL,
  `total_time_of_fluoroscopy` varchar(255) DEFAULT NULL,
  `x_ray_tube_current` int(11) DEFAULT NULL,
  `x_ray_tube_current_inua` varchar(255) DEFAULT NULL,
  `pktblinstanceid` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `role_id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `series`
--

CREATE TABLE `series` (
  `pktblseriesid` bigint(20) NOT NULL,
  `body_part_examined` varchar(40) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `laterality` varchar(100) DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `operators_name` varchar(50) DEFAULT NULL,
  `patient_position` varchar(30) DEFAULT NULL,
  `protocol_name` varchar(100) DEFAULT NULL,
  `series_date_time` datetime DEFAULT NULL,
  `series_description` varchar(100) DEFAULT NULL,
  `series_instanceuid` varchar(100) DEFAULT NULL,
  `series_number` int(11) DEFAULT NULL,
  `pktblstudyid` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `study`
--

CREATE TABLE `study` (
  `pktblstudyid` bigint(20) NOT NULL,
  `accession_number` varchar(30) DEFAULT NULL,
  `additional_patient_history` varchar(300) DEFAULT NULL,
  `admitting_diagnoses_description` varchar(200) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `referring_physician_name` varchar(100) DEFAULT NULL,
  `study_date_time` datetime DEFAULT NULL,
  `study_description` varchar(300) DEFAULT NULL,
  `studyid` varchar(50) DEFAULT NULL,
  `study_instanceuid` varchar(100) DEFAULT NULL,
  `study_priorityid` varchar(40) DEFAULT NULL,
  `study_statusid` varchar(40) DEFAULT NULL,
  `pktblpatientid` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user_privileges`
--

CREATE TABLE `user_privileges` (
  `user_id` bigint(20) NOT NULL,
  `privilege_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `application_entity`
--
ALTER TABLE `application_entity`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_jq2hu8m0bk9gm2ro9lguf3ss7` (`port`),
  ADD UNIQUE KEY `UK_tjunh02ogu59sb3srf76sfl02` (`title`);

--
-- Indexes for table `color`
--
ALTER TABLE `color`
  ADD PRIMARY KEY (`color_id`),
  ADD UNIQUE KEY `UK_n3axgangk6yuxhrb2o7fk9oa7` (`name`);

--
-- Indexes for table `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`pktblequipmentid`),
  ADD KEY `FKc4nuyr4cwcf1fmwe3s31s4hbx` (`pktblseriesid`);

--
-- Indexes for table `general_tag`
--
ALTER TABLE `general_tag`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_t2gq6uhp4lv1q4d4hh63tpocf` (`tag_name`);

--
-- Indexes for table `instance`
--
ALTER TABLE `instance`
  ADD PRIMARY KEY (`pktblinstanceid`),
  ADD KEY `FKtauwyb9ji542gwpcu4e66q2we` (`pktblseriesid`);

--
-- Indexes for table `oauth_access_token`
--
ALTER TABLE `oauth_access_token`
  ADD PRIMARY KEY (`token_id`),
  ADD UNIQUE KEY `authentication_id` (`authentication_id`),
  ADD UNIQUE KEY `user_name` (`user_name`);

--
-- Indexes for table `oauth_refresh_token`
--
ALTER TABLE `oauth_refresh_token`
  ADD PRIMARY KEY (`token_id`);

--
-- Indexes for table `password_reset_token`
--
ALTER TABLE `password_reset_token`
  ADD PRIMARY KEY (`token_id`),
  ADD KEY `FK74tbfv8vc0l5kbl332iifo66u` (`user_id`);

--
-- Indexes for table `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`pktblpatientid`);

--
-- Indexes for table `privilege`
--
ALTER TABLE `privilege`
  ADD PRIMARY KEY (`privilege_id`);

--
-- Indexes for table `profile_user`
--
ALTER TABLE `profile_user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `UK_esg1kq0ic5qq6g6q94t83nfj9` (`email`),
  ADD UNIQUE KEY `UK_n2cdij93ktx06pqv1nbfya3ls` (`username`),
  ADD UNIQUE KEY `UK_y92kncol83et52y3164h4e36` (`mobile`);

--
-- Indexes for table `radiation`
--
ALTER TABLE `radiation`
  ADD PRIMARY KEY (`pktblradiationid`),
  ADD KEY `FK3if3rll52q8q7o8on5o1aw8m8` (`pktblinstanceid`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `series`
--
ALTER TABLE `series`
  ADD PRIMARY KEY (`pktblseriesid`),
  ADD KEY `FK58s8nujxd8nefppraru4vppsd` (`pktblstudyid`);

--
-- Indexes for table `study`
--
ALTER TABLE `study`
  ADD PRIMARY KEY (`pktblstudyid`),
  ADD KEY `FKhruyxa4l9q8od3vdq089y5try` (`pktblpatientid`);

--
-- Indexes for table `user_privileges`
--
ALTER TABLE `user_privileges`
  ADD PRIMARY KEY (`user_id`,`privilege_id`),
  ADD KEY `FK6rrv8daxxrco69tdpfu3a29le` (`privilege_id`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD KEY `FKrhfovtciq1l558cw6udg0h0d3` (`role_id`),
  ADD KEY `FKf1g4ldsbkan6gthf9xb5f4gxf` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `application_entity`
--
ALTER TABLE `application_entity`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `equipment`
--
ALTER TABLE `equipment`
  MODIFY `pktblequipmentid` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `instance`
--
ALTER TABLE `instance`
  MODIFY `pktblinstanceid` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `password_reset_token`
--
ALTER TABLE `password_reset_token`
  MODIFY `token_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patient`
--
ALTER TABLE `patient`
  MODIFY `pktblpatientid` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `privilege`
--
ALTER TABLE `privilege`
  MODIFY `privilege_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `profile_user`
--
ALTER TABLE `profile_user`
  MODIFY `user_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `radiation`
--
ALTER TABLE `radiation`
  MODIFY `pktblradiationid` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `role_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `series`
--
ALTER TABLE `series`
  MODIFY `pktblseriesid` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `study`
--
ALTER TABLE `study`
  MODIFY `pktblstudyid` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `equipment`
--
ALTER TABLE `equipment`
  ADD CONSTRAINT `FKc4nuyr4cwcf1fmwe3s31s4hbx` FOREIGN KEY (`pktblseriesid`) REFERENCES `series` (`pktblseriesid`) ON DELETE CASCADE;

--
-- Constraints for table `instance`
--
ALTER TABLE `instance`
  ADD CONSTRAINT `FKtauwyb9ji542gwpcu4e66q2we` FOREIGN KEY (`pktblseriesid`) REFERENCES `series` (`pktblseriesid`) ON DELETE CASCADE;

--
-- Constraints for table `password_reset_token`
--
ALTER TABLE `password_reset_token`
  ADD CONSTRAINT `FK74tbfv8vc0l5kbl332iifo66u` FOREIGN KEY (`user_id`) REFERENCES `profile_user` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `radiation`
--
ALTER TABLE `radiation`
  ADD CONSTRAINT `FK3if3rll52q8q7o8on5o1aw8m8` FOREIGN KEY (`pktblinstanceid`) REFERENCES `instance` (`pktblinstanceid`) ON DELETE CASCADE;

--
-- Constraints for table `series`
--
ALTER TABLE `series`
  ADD CONSTRAINT `FK58s8nujxd8nefppraru4vppsd` FOREIGN KEY (`pktblstudyid`) REFERENCES `study` (`pktblstudyid`) ON DELETE CASCADE;

--
-- Constraints for table `study`
--
ALTER TABLE `study`
  ADD CONSTRAINT `FKhruyxa4l9q8od3vdq089y5try` FOREIGN KEY (`pktblpatientid`) REFERENCES `patient` (`pktblpatientid`) ON DELETE CASCADE;

--
-- Constraints for table `user_privileges`
--
ALTER TABLE `user_privileges`
  ADD CONSTRAINT `FK6rrv8daxxrco69tdpfu3a29le` FOREIGN KEY (`privilege_id`) REFERENCES `privilege` (`privilege_id`),
  ADD CONSTRAINT `FKnrj4jj9cggeynv9n4txmel2vx` FOREIGN KEY (`user_id`) REFERENCES `profile_user` (`user_id`);

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `FKf1g4ldsbkan6gthf9xb5f4gxf` FOREIGN KEY (`user_id`) REFERENCES `profile_user` (`user_id`),
  ADD CONSTRAINT `FKrhfovtciq1l558cw6udg0h0d3` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
