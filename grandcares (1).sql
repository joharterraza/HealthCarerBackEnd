-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 12, 2021 at 04:03 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.3
use grandcares;

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


-- --------------------------------------------------------

--
-- Table structure for table `emergency`
--

CREATE TABLE `emergency` (
  `id` int(11) NOT NULL,
  `creation_date` datetime NOT NULL,
  `user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `emergency`
--

INSERT INTO `emergency` (`id`, `creation_date`, `user`) VALUES
(2, '2021-10-11 12:30:11', 15),
(3, '2021-10-11 13:52:47', 6),
(4, '2021-10-11 14:33:23', 18),
(5, '2021-10-11 18:59:54', 19);

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
(4, 'jorge@gmail.com', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'jorge.jpg', 'jorge', 'terraza', '664123456', '2021-01-23', 'masculine'),
(10, 'sergio@gmail.com', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'sergio.jpg', 'sergio', 'cortes', '664123452', '1999-01-23', 'masculine'),
(11, 'dante@gmail.com', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'dante.jpg', 'Dante', 'Martin', '664128452', '2003-01-23', 'masculine');

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE `location` (
  `id` int(11) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `location`
--

INSERT INTO `location` (`id`, `latitude`, `longitude`) VALUES
(2, 36, -103),
(3, 66, -25),
(11, 30.365412, -30.52984),
(14, 30.365412, -30.52988),
(15, 31.365412, -32.52988);

-- --------------------------------------------------------

--
-- Table structure for table `schedule`
--

CREATE TABLE `schedule` (
  `id` int(11) NOT NULL,
  `Dosage` varchar(50) NOT NULL,
  `takeEvery` int(11) NOT NULL,
  `totalDosis` int(11) NOT NULL,
  `startingOn` datetime NOT NULL,
  `takenDate` datetime DEFAULT NULL,
  `nextDosisDate` datetime DEFAULT NULL,
  `notes` varchar(100) DEFAULT NULL,
  `takenDosis` int(11) NOT NULL DEFAULT 0,
  `status` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `medication` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `schedule`
--

INSERT INTO `schedule` (`id`, `Dosage`, `takeEvery`, `totalDosis`, `startingOn`, `takenDate`, `nextDosisDate`, `notes`, `takenDosis`, `status`, `user`, `medication`) VALUES
(5, '10 mg Tab', 12, 3, '2021-10-07 15:12:14', '2021-10-07 15:12:14', '2021-10-08 03:12:14', 'Should take after meal', 1, 1, 6, 'Paracetamol'),
(7, '1 pill 20 mg', 2, 10, '2021-01-01 08:55:21', NULL, NULL, 'should take after meal', 0, 1, 6, 'Paracetamol'),
(9, '1 pill 20 mg', 2, 10, '2021-01-01 08:55:21', NULL, NULL, 'should take after meal', 0, 1, 6, 'Ibuprofeno'),
(10, '1 pill 20 mg', 2, 10, '2021-01-01 08:55:21', NULL, NULL, 'should take after meal', 0, 1, 18, 'Ibuprofeno'),
(11, '1 pill 20 mg', 2, 10, '2021-01-01 08:55:21', NULL, NULL, 'should take after meal', 0, 1, 19, 'Ibuprofeno');

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
(3, 'johar@gmail.com', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'johar.jpg', 'johar', 'terraza', 'fce8e4e47ba316aeb465c22364306fcad5299548', '664123456', 'masculine', '2021-01-21 00:00:00', 4, 2),
(5, 'Raul@gmail.com', '20eabe5d64b0e216796e834f52d61fd0b70332fc', 'raul.jpg', 'Raul', 'Gonzales', 'dd931406b1e2dce8f05981e2a5e8b186b0cc3391', '6641478523', 'masculine', '2021-01-25 00:00:00', 4, 3),
(6, 'Brandon@gmail.com', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'Brandon.jpg', 'Brandon', 'Rodruiguez', '9dda0cc7733602100e14187bd80c4a869df692a4', '6641478524', 'masculine', '1999-11-01 00:00:00', 10, NULL),
(15, 'nicole@gmail.com', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'nico.jpg', 'Nicole', 'Martin', '9b3d4345cdf40867e04093165cbbda070ecbe414', '6641478424', 'femenine', '2005-11-01 00:00:00', NULL, 11),
(18, 'mauricio@gmail.com', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'mau.jpg', 'Mauricio', 'Malo', '3ab5971abd9f2c6539bf32d4f3efc68b16a2d789', '6641478424', 'Masculine', '2005-11-01 00:00:00', 4, 14),
(19, 'marina@gmail.com', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'vaquera.jpg', 'Marina', 'Camacho', '588d23cc3d91d6f9b2cdd7c39cf344e10de4775c', '6641478424', 'Masculine', '2005-11-01 00:00:00', 4, 15);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `emergency`
--
ALTER TABLE `emergency`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user` (`user`);

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
-- Indexes for table `schedule`
--
ALTER TABLE `schedule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_medicines_user` (`user`);

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
-- AUTO_INCREMENT for table `emergency`
--
ALTER TABLE `emergency`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `healthcarer`
--
ALTER TABLE `healthcarer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `location`
--
ALTER TABLE `location`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `schedule`
--
ALTER TABLE `schedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `emergency`
--
ALTER TABLE `emergency`
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `schedule`
--
ALTER TABLE `schedule`
  ADD CONSTRAINT `fk_medicines_user` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

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
