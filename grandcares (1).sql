-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 06, 2021 at 07:24 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `grandcares`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `addUser` (IN `_username` VARCHAR(60), IN `_password` VARCHAR(45), IN `_photo` VARCHAR(45), IN `_name` VARCHAR(45), IN `_lastName` VARCHAR(45), IN `_phoneNumber` VARCHAR(45), IN `_genre` VARCHAR(45), IN `_dob` DATETIME)  Begin
	declare _token varchar(255);
	declare exit handler for sqlexception
		begin 			
			select 1 as message;
			rollback;        
		end;
        
	set _token = sha1((concat(_username,_password)));
    insert into user(email,password,photo,name,lastName,token,phoneNumber,genre,dateOfBirth) values
    (_username,sha1(_password),_photo,_name,_lastName,_token,_phoneNumber,_genre,_dob);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `healthcarer`
--

CREATE TABLE `healthcarer` (
  `id` int(11) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(45) NOT NULL,
  `photo` varchar(45) DEFAULT NULL,
  `name` varchar(45) NOT NULL,
  `lastName` varchar(45) NOT NULL,
  `phoneNumber` varchar(45) NOT NULL,
  `dateOfBirth` varchar(45) NOT NULL,
  `genre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `healthcarer`
--

INSERT INTO `healthcarer` (`id`, `email`, `password`, `photo`, `name`, `lastName`, `phoneNumber`, `dateOfBirth`, `genre`) VALUES
(4, 'jorge@gmail.com', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'jorge.jpg', 'jorge', 'terraza', '664123456', '2021-01-23', 'masculine');

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE `location` (
  `id` int(11) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `medication`
--

CREATE TABLE `medication` (
  `id` varchar(100) NOT NULL,
  `brandName` varchar(100) DEFAULT NULL,
  `info` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `schedule`
--

CREATE TABLE `schedule` (
  `id` int(11) NOT NULL,
  `Dosage` int(11) NOT NULL,
  `takeEvery` int(11) NOT NULL,
  `totalDosis` int(11) NOT NULL,
  `startingOn` datetime NOT NULL,
  `takenDate` datetime NOT NULL,
  `nextDosisDate` datetime NOT NULL,
  `notes` varchar(100) DEFAULT NULL,
  `takenDosis` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `medication` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(45) NOT NULL,
  `photo` varchar(45) DEFAULT NULL,
  `name` varchar(45) NOT NULL,
  `lastName` varchar(45) NOT NULL,
  `token` varchar(150) NOT NULL,
  `phoneNumber` varchar(45) NOT NULL,
  `genre` varchar(45) NOT NULL,
  `dateOfBirth` varchar(45) NOT NULL,
  `healtCarer` int(11) DEFAULT NULL,
  `currentLocation` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `photo`, `name`, `lastName`, `token`, `phoneNumber`, `genre`, `dateOfBirth`, `healtCarer`, `currentLocation`) VALUES
(3, 'johar@gmail.com', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'johar.jpg', 'johar', 'terraza', 'fce8e4e47ba316aeb465c22364306fcad5299548', '664123456', 'masculine', '2021-01-21 00:00:00', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `healthcarer`
--
ALTER TABLE `healthcarer`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `medication`
--
ALTER TABLE `medication`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `schedule`
--
ALTER TABLE `schedule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_medicines_user` (`user`),
  ADD KEY `fk_schedule_medicines` (`medication`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_user_healthCarer` (`healtCarer`),
  ADD KEY `fk_user_location` (`currentLocation`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `healthcarer`
--
ALTER TABLE `healthcarer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `location`
--
ALTER TABLE `location`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `schedule`
--
ALTER TABLE `schedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `schedule`
--
ALTER TABLE `schedule`
  ADD CONSTRAINT `fk_medicines_user` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_schedule_medicines` FOREIGN KEY (`medication`) REFERENCES `medication` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `fk_user_healthCarer` FOREIGN KEY (`healtCarer`) REFERENCES `healthcarer` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_user_location` FOREIGN KEY (`currentLocation`) REFERENCES `location` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
