const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Ruta de prueba para verificar que el servidor está activo
app.get('/', (req, res) => {
    res.send('Servidor de puntos de la comunidad activo y funcionando.');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
