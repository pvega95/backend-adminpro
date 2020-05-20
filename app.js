// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

// Inizializar variables
var app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// Conexion a la base de datos
var URI = 'mongodb://localhost:27017/hospitalDB'
mongoose.connection.openUri(URI,  { useUnifiedTopology: true, useNewUrlParser: true , useFindAndModify: false } , ( err, res )=> {
  
  if (err) throw err;

  console.log('base de datos online')

});

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, ()=>{
  console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m','online');
});