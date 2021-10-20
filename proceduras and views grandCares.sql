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

drop procedure addTakenDosis
DELIMITER $$
CREATE PROCEDURE addTakenDosis(
  IN _idUser int,
  IN _idPresc int 
)
Begin
	declare _newTakenDosis int;  
    declare _takeEvery int;
	declare exit handler for sqlexception
		begin			
			select 1 as message;            
			rollback;        
		end;
	set _newTakenDosis = (select takenDosis from schedule where user = _idUser and id = _idPresc) + 1; 
	if _newTakenDosis <= (select totalDosis from schedule where user = _idUser and id = _idPresc) then
		set _takeEvery = (select takeEvery from schedule where user = _idUser and id = _idPresc);
		update schedule set takenDosis = _newTakenDosis, takenDate = Now(), nextDosisDate = (Now() + Interval _takeEvery hour)
		where user = _idUser and id = _idPresc and status = 1;
	else 
		update schedule set status = 0 where user = _idUser and id = _idPresc and status = 1;
	end if;
    
    
END$$
DELIMITER ;











