const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base de datos de ejemplo (puedes actualizarla o conectarla después)
let usuarios = [
    { usuario: "@usuario_activo", puntos: 500, ultimaActividad: new Date() },
    { usuario: "@usuario_nuevo", puntos: 40, ultimaActividad: new Date() }
];

// --- SISTEMA AUTOMÁTICO DE EXPIRACIÓN DE PUNTOS ---
// Revisa cada 24 horas la inactividad de los usuarios
setInterval(() => {
    const ahora = new Date();
    
    usuarios = usuarios.filter(user => {
        const mesesInactivo = (ahora - new Date(user.ultimaActividad)) / (1000 * 60 * 60 * 24 * 30);
        
        // Si tiene 100 o más puntos y pasan 2 meses sin actividad -> Se borra/limpia
        if (user.puntos >= 100 && mesesInactivo >= 2) {
            console.log(`Puntos expirados (2 meses) para ${user.usuario}`);
            return false; 
        }
        // Si tiene menos de 100 puntos y pasan 3 meses sin actividad -> Se borra/limpia
        if (user.puntos < 100 && mesesInactivo >= 3) {
            console.log(`Puntos expirados (3 meses) para ${user.usuario}`);
            return false;
        }
        return true;
    });
}, 1000 * 60 * 60 * 24);

// Ruta para enviar los datos de los puntos a tu página web
app.get('/api/puntos', (req, res) => {
    res.json(usuarios);
});

// Ruta principal que carga tu archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log("Servidor ZENITH corriendo en el puerto " + PORT);
});
