use grandcares

drop procedure addUser
DELIMITER $$
CREATE PROCEDURE addUser(
  IN _username VARCHAR(60),
  IN _password VARCHAR(45),
  IN _photo VARCHAR(45),
  IN _name VARCHAR(45),
  IN _lastName VARCHAR(45),
  IN _phoneNumber VARCHAR(45),
  IN _genre VARCHAR(45),  
  IN _dob datetime,
  IN _lat int,
  IN _long int
  
)
Begin
	declare _token varchar(255);
    declare _lastLocationId int;
	declare exit handler for sqlexception
		begin
			delete from location where id = _lastLocationId;
			select 1 as message;
            
			rollback;        
		end;
	set _lastLocationId = 0;
	set _token = sha1((concat(_username,_password)));
    insert into location(latitude,longitude) values (_lat,_long);
    set _lastLocationId = (select id from location order by id desc limit 1);	
    insert into user(email,password,photo,name,lastName,token,phoneNumber,genre,dateOfBirth, currentLocation) values
    (_username,sha1(_password),_photo,_name,_lastName,_token,_phoneNumber,_genre,_dob, _lastLocationId);
END$$
DELIMITER ;


