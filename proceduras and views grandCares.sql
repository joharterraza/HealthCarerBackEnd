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
  IN _dob datetime
  
)
Begin
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


