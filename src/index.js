const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method,email,password');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//Settings
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(express.json())



app.get("/", (req, res) => {
    res.json({ message: "Welcome to HealthCarer." });
});

//Routes
app.use(require('./routes/user'));
app.use(require('./routes/carer'));

//Handle 404
app.use(function(req, res, next) {
    jsonResponse = { Status: 404, message: "Page not found" }

    res.status(404).json(jsonResponse)
})

//Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port 3000')
});