const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
})

//Settings
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(express.json())

app.get("/", (req, res) => {
    res.json({ message: "Welcome to HealthCarer."});
});

//Routes
app.use(require('./routes/user'));
app.use(require('./routes/carer'));

//Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port 3000')
});