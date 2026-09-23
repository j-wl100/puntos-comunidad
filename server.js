const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Base de datos de puntos de la comunidad
let puntosComunidad = [
    { usuario: "UsuarioEjemplo1", puntos: 150 },
    { usuario: "UsuarioEjemplo2", puntos: 80 },
    { usuario: "UsuarioEjemplo3", puntos: 300 },
    { usuario: "CyberUser", puntos: 450 }
];

// Ruta para que la web obtenga los puntos actualizados
app.get('/api/puntos', (req, res) => {
    res.json(puntosComunidad);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
