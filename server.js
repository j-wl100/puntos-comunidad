const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Esto le dice a Express que lea archivos estáticos de una carpeta llamada 'public'
app.use(express.static('public'));

// Ruta principal por si acaso
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
