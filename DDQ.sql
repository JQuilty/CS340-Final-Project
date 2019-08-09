DROP TABLE IF EXISTS `planet_factions`; 
DROP TABLE IF EXISTS `vehicles`;
DROP TABLE IF EXISTS `characters`; 
DROP TABLE IF EXISTS `factions`; 
DROP TABLE IF EXISTS `planets`; 

CREATE TABLE `characters` (
  `character_id` int(11) NOT NULL AUTO_INCREMENT,
  `character_name` varchar(100) DEFAULT NULL,
  `character_origin` int(11),
  `character_faction` int(11),
  `character_role` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`character_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `characters` (`character_id`, `character_name`, `character_origin`, `character_faction`, `character_role`) VALUES
(1, 'Anakin Skywalker', 1, 3, 'Jedi'),
(2, 'Rey', 2, 3, 'Jedi'),
(3, 'Darth Vader', 1, 4, 'Sith'),
(4, 'Han Solo', 3, 2, 'Fighter');

CREATE TABLE `factions` (
  `faction_id` int(11) NOT NULL AUTO_INCREMENT,
  `faction_name` varchar(100) NOT NULL,
  `faction_goal` varchar(100) DEFAULT NULL,
  `faction_size` int(11) NOT NULL,
  PRIMARY KEY (`faction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `factions` (`faction_id`, `faction_name`, `faction_goal`, `faction_size`) VALUES
(1, 'Empire', 'To rule the Galaxy', 50000000),
(2, 'Rebels', 'To rid the galaxy of the empire and evil.', 50000),
(3, 'Jedi', 'To bring peace to the galaxy.', 500),
(4, 'Sith', 'To control the galaxy through fear and manipulation.', 20);

CREATE TABLE `planets` (
  `planet_id` int(11) NOT NULL AUTO_INCREMENT,
  `planet_name` varchar(100) NOT NULL,
  `planet_population` int(11) NOT NULL,
  `planet_environment` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`planet_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `planets` (`planet_id`, `planet_name`, `planet_population`, `planet_environment`) VALUES
(1, 'Tatooine', 5000000, 'Desert'),
(2, 'Jakku', 500000, 'Desert'),
(3, 'Corellia', 10000000, 'Industrial'),
(4, 'Alderaan', 2000000, 'Forest');


CREATE TABLE `planet_factions` (
  `pid` int(11) NOT NULL,
  `fid` int(11) NOT NULL,
  PRIMARY KEY (`pid`,`fid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `planet_factions` (`pid`, `fid`) VALUES
(2, 1),
(2, 2),
(3, 2),
(4, 2),
(4, 3),
(1, 4),
(1, 3),
(1, 1);



CREATE TABLE `vehicles` (
  `vehicle_id` int(11) NOT NULL AUTO_INCREMENT,
  `vehicle_name` varchar(100) DEFAULT NULL,
  `vehicle_capacity` int(11) DEFAULT NULL,
  `vehicle_lightspeed` tinyint(1) DEFAULT NULL,
  `vehicle_pilot` int(11) NOT NULL,
  PRIMARY KEY (`vehicle_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `vehicles` (`vehicle_id`, `vehicle_name`, `vehicle_capacity`, `vehicle_lightspeed`, `vehicle_pilot`) VALUES
(3, 'Millenium Falcon', 15, 1, 4),
(4, 'TIE Interceptor', 1, 0, 3),
(5, 'Snowspeeder', 2, 0, 1);


ALTER TABLE `characters`
  ADD CONSTRAINT `char_faction2character` FOREIGN KEY (`character_faction`) REFERENCES `factions` (`faction_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `char_planet2character` FOREIGN KEY (`character_origin`) REFERENCES `planets` (`planet_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `planet_factions`
--
ALTER TABLE `planet_factions`
  ADD CONSTRAINT `faction2planet` FOREIGN KEY (`pid`) REFERENCES `planets` (`planet_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `planet2faction` FOREIGN KEY (`fid`) REFERENCES `factions` (`faction_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `vehicle_pilot2vehicle` FOREIGN KEY (`vehicle_pilot`) REFERENCES `characters` (`character_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;
 
