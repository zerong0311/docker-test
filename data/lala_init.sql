
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+08:00";

CREATE DATABASE IF NOT EXISTS `LALAMOVE`;
USE `LALAMOVE`;

CREATE TABLE `lala_order` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `START_LATITUDE` varchar(100) NOT NULL ,
  `START_LONGITUDE` varchar(100) NOT NULL,
  `END_LATITUDE` varchar(100) NOT NULL,
  `END_LONGITUDE` varchar(100) NOT NULL,
  `distance` INT NOT NULL,
  `order_status` int DEFAULT '0',
  `stamp_created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `stamp_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (order_id)
);


INSERT INTO `lala_order` (`order_id`, `START_LATITUDE`, `START_LONGITUDE`, `END_LATITUDE`, `END_LONGITUDE`, `order_status`, `stamp_created`, `stamp_updated`) VALUES
(1, 'START1', 'START2', 'END1', 'END2', 0, '2020-10-20 03:18:32', '2020-10-20 03:18:32');


COMMIT;