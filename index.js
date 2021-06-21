
const express = require('express'),
      cors = require('cors'),
      path = require('path');

const { dbConnection } = require('./db/config');
require('dotenv').config();

// Crear el servidor de express
const app = express();

// Base de Datos
dbConnection();

// Directorio público
app.use( express.static('public') )

// CORS
app.use( cors() );

// Lectura y parseo del body
app.use( express.json() );

// Rutas
app.use( '/api/auth', require('./routes/auth') );

// Manejar demas rutas
app.get( '*', ( req, res ) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html' ) );
});

app.listen( process.env.PORT, () => {
    console.log(`It's alive!`);
});
