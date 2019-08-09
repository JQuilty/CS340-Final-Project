-- Creating new entries
INSERT INTO `planets` (`planet_name`, `planet_population`, `planet_environment`) 
VALUES (:pName_input, :pPopulation_input, :pEnvironment_input);

INSERT INTO `factions` (`faction_name`, `faction_goal`, `faction_size`)
VALUES (:fName_input, :fGoal_input, :fSize_input);

INSERT INTO `characters` (`character_name`, `character_origin`, `character_faction`, `character_role`)
VALUES (:cName_input, :cFaction_input, :cRole_input, :cOrigin_input);

INSERT INTO `planet_factions` (`pid`, `fid`)
VALUES (:PlanetID_input, :FactionID_input);

INSERT INTO `vehicles` (`vehicle_name`, `vehicle_capacity`, `vehicle_lightspeed`, `vehicle_pilot`)
VALUES (:vName_input, :vCapacity_input, :vLightspeed_Input, :vPilot_Input);

-- Selecting the tables for display

SELECT * FROM characters LEFT JOIN planets on character_origin = planet_id
LEFT JOIN factions ON character_faction = faction_id ORDER BY character_id; 

SELECT * FROM `factions`; 

SELECT planet_id, planet_name, planet_population, planet_environment FROM planets;  

SELECT vehicle_name, vehicle_capacity, vehicle_lightspeed, vehicle_pilot, vehicle_id, character_name, character_id FROM vehicles
LEFT JOIN characters ON character_id = vehicle_pilot ORDER BY vehicle_id; 

SELECT planet_id, planet_name, faction_id, faction_name FROM planet_factions INNER JOIN
planets on planet_id = pid INNER JOIN factions on fid = faction_id ORDER BY pid; 


-- Getting factions and planets for dropdowns
SELECT planet_id, planet_name, faction_id, faction_name FROM planets LEFT JOIN 
factions ON planet_id = faction_id UNION ALL SELECT planet_id, planet_name, faction_id, faction_name 
FROM planets RIGHT JOIN factions ON planet_id = faction_id WHERE planet_id IS NULL; 

-- Filtering the character table
SELECT * FROM `characters` WHERE `name` = :cName_filter;

SELECT * FROM `characters` WHERE `faction` = :cFaction_filter;

SELECT * FROM `characters` WHERE `origin` = :cOrigin_filter;

SELECT * FROM `characters` WHERE `role` = :cRole_filter;

-- Update 

UPDATE `characters` SET `character_name` = :cName_update, `character_origin` = :cOrigin_update, 
`character_faction` = :cFaction_update, `character_role` = cRole_update WHERE `character_id` = :character_id_update; 

UPDATE `planets` SET `planet_name` = :pName_update, `planet_population` = :pPopulation_update, 
`planet_environment` = :pEnvironment_update WHERE `planet_id` = :planet_id_update;

UPDATE `factions` SET `faction_name` = :fName_update, `faction_goal` = :fGoal_update, 
`faction_size` = :fSize_update WHERE `faction_id` = :faction_id_update;

UPDATE `vehicles` SET `vehicle_name` = :vName_update, `vehicle_capacity` = :vCapacity_update, 
`vehicle_lightspeed` = :vLightspeed_Update, `vehicle_pilot` = vPilot_Update WHERE `vehicle_id;` = :vehicle_id_update;

UPDATE `planet_factions` SET `pid` = :planet_id_update, `fid` = :faction_id_update, 
WHERE `fid` = :old_faction_id AND `pid` = :old_planet_id;

--Delete

DELETE FROM `characters` WHERE `character_id` = :character_delete; 

DELETE FROM `planets` WHERE `planet_id` = :planet_delete;

DELETE FROM `factions` WHERE `faction_id` = :faction_delete;

DELETE FROM `vehicles` WHERE `vehicle_id` = :vehicle_delete;

DELETE FROM `planet_factions` WHERE `pid` = :PlanetID_delete AND `fid` = :FactionID_delete; 