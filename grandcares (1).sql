-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 23, 2021 at 03:33 AM
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
    insert into user(username,password,photo,name,lastName,token,phoneNumber,genre,dateOfBirth) values
    (_username,sha1(_password),_photo,_name,_lastName,_token,_phoneNumber,_genre,_dob);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getUserByToken` (IN `_token` VARCHAR(255))  Begin
	declare _id int;
	declare exit handler for sqlexception
		begin 			
			select 1 as message;
			rollback;        
		end;
        
	set _id = (select id from user where token = _token);
    select id,username, photo, name, lastName, currentLat, currentLong, phoneNumber, genre, dateOfBirth from user where id = _id;
    select * from medicines_treatments_schedule where user = id;
    
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `alerts`
--

CREATE TABLE `alerts` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `creation_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `favoritecontacts`
--

CREATE TABLE `favoritecontacts` (
  `id` int(11) NOT NULL,
  `phoneNumber` varchar(45) NOT NULL,
  `contactName` varchar(45) NOT NULL,
  `user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `healthcarer`
--

CREATE TABLE `healthcarer` (
  `id` int(11) NOT NULL,
  `username` varchar(60) NOT NULL,
  `password` varchar(45) NOT NULL,
  `photo` varchar(45) DEFAULT NULL,
  `name` varchar(45) NOT NULL,
  `lastName` varchar(45) NOT NULL,
  `phoneNumber` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `dateOfBirth` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `healthcarer`
--

INSERT INTO `healthcarer` (`id`, `username`, `password`, `photo`, `name`, `lastName`, `phoneNumber`, `email`, `dateOfBirth`) VALUES
(1, 'serch123', 'sergio123', 'serch.jpg', 'Sergio', 'Cortes', '6641452369', 'sergio@gmail.com', '2021-01-22 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `medicines_treatments_schedule`
--

CREATE TABLE `medicines_treatments_schedule` (
  `id` int(11) NOT NULL,
  `dayOfTheWeek` int(11) NOT NULL,
  `day` varchar(45) NOT NULL,
  `hour` time NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `medicines_treatments_schedule`
--

INSERT INTO `medicines_treatments_schedule` (`id`, `dayOfTheWeek`, `day`, `hour`, `name`, `description`, `user`) VALUES
(1, 1, 'Monday', '08:00:00', 'Paracetamol', '2 pillows', 2),
(2, 2, 'Tuesday', '09:00:00', 'Jarabe', '2 spoons', 2);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(60) NOT NULL,
  `password` varchar(45) NOT NULL,
  `photo` varchar(45) DEFAULT NULL,
  `name` varchar(45) NOT NULL,
  `lastName` varchar(45) NOT NULL,
  `token` varchar(255) NOT NULL,
  `currentLat` double DEFAULT NULL,
  `currentLong` double DEFAULT NULL,
  `phoneNumber` varchar(45) NOT NULL,
  `healtCarer` int(11) DEFAULT NULL,
  `genre` varchar(45) NOT NULL,
  `dateOfBirth` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `photo`, `name`, `lastName`, `token`, `currentLat`, `currentLong`, `phoneNumber`, `healtCarer`, `genre`, `dateOfBirth`) VALUES
(2, 'johar123', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'johar.jpg', 'Johar', 'Terraza', 'cb097faa67e9be8f55c470532c2f365c08dcefb8', NULL, NULL, '664123456', NULL, 'Masculine', '2021-11-21 00:00:00'),
(15, 'johar123596', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'johar.jpg', 'Johar', 'Terraza', 'bccd4390db1e086f406ea9dc084f59493c78d802', NULL, NULL, '664123456', NULL, 'Masculine', '2021-02-02 00:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alerts`
--
ALTER TABLE `alerts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_alerts_user` (`userId`);

--
-- Indexes for table `favoritecontacts`
--
ALTER TABLE `favoritecontacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_contacts_user` (`user`);

--
-- Indexes for table `healthcarer`
--
ALTER TABLE `healthcarer`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `medicines_treatments_schedule`
--
ALTER TABLE `medicines_treatments_schedule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_medicines_user` (`user`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `fk_user_healthCarer` (`healtCarer`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alerts`
--
ALTER TABLE `alerts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `favoritecontacts`
--
ALTER TABLE `favoritecontacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `healthcarer`
--
ALTER TABLE `healthcarer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `medicines_treatments_schedule`
--
ALTER TABLE `medicines_treatments_schedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alerts`
--
ALTER TABLE `alerts`
  ADD CONSTRAINT `fk_alerts_user` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `favoritecontacts`
--
ALTER TABLE `favoritecontacts`
  ADD CONSTRAINT `fk_contacts_user` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `medicines_treatments_schedule`
--
ALTER TABLE `medicines_treatments_schedule`
  ADD CONSTRAINT `fk_medicines_user` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `fk_user_healthCarer` FOREIGN KEY (`healtCarer`) REFERENCES `healthcarer` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
