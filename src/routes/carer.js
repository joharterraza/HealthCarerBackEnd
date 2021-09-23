const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database.js');

function isEmpty(val){
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}
//ADD carer
router.post('/carer/add', (req, res) => {
    headers = req.headers;
    // const query = `CALL addUser(?,?,?,?,?,?,?,?);`;
    if(isEmpty(headers.username) || isEmpty(headers.password) || isEmpty(headers.photo) || isEmpty(headers.name) ||        
    isEmpty(headers.lastname) || isEmpty(headers.phonenumber) || isEmpty(headers.email) || isEmpty(headers.dob)){

        res.json({Status : 900, mensaje: 'Missing parameters'})
    }    
    else{
        const query = `insert into healthcarer (username, password, photo, name, lastName, 
            phoneNumber, email, dateOfBirth) values(?,?,?,?,?,?,?,?)`;
        // console.log(headers.username)
        // console.log(headers.password)
        // console.log(headers.photo)
        // console.log(headers.name)
        // console.log(headers.lastname)
        // console.log(headers.phonenumber)
        // console.log(headers.email)
        // console.log(headers.dob)
        mysqlConnection.query(query, [headers.username, headers.password, headers.photo,
            headers.name, headers.lastname, headers.phonenumber, headers.email, headers.dob], 
            (err, rows, fields) => {
                
                if(!err) {
                    console.log(rows);
                    if(rows.affectedRows > 0){
                        res.json({Status : 0, mensaje: 'Health Carer added successfuly'})        
                    }
                    else{
                        res.json({Status : 1, mensaje: 'Could not add carer'})
                    } 
                }else {
                    res.json({Status : 1, mensaje: 'Could not add carer'})
                }
        });
    }
    
  
});



module.exports = router;