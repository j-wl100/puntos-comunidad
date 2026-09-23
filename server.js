const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base de datos de ejemplo en memoria
let usuarios = [
    { usuario: "@usuario_activo", puntos: 500, ultimaActividad: new Date() },
    { usuario: "@usuario_nuevo", puntos: 40, ultimaActividad: new Date() }
];

// --- SISTEMA AUTOMÁTICO DE EXPIRACIÓN DE PUNTOS ---
setInterval(() => {
    const ahora = new Date();
    usuarios = usuarios.filter(user => {
        const mesesInactivo = (ahora - new Date(user.ultimaActividad)) / (1000 * 60 * 60 * 24 * 30);
        if (user.puntos >= 100 && mesesInactivo >= 2) return false; 
        if (user.puntos < 100 && mesesInactivo >= 3) return false;
        return true;
    });
}, 1000 * 60 * 60 * 24);

// API para leer los puntos
app.get('/api/puntos', (req, res) => {
    res.json(usuarios);
});

// API protegida para modificar/agregar/eliminar usuarios con la contraseña
app.post('/api/admin/actualizar', (req, res) => {
    const { password, accion, usuarioMeta, nuevoNombre, nuevosPuntos } = req.body;
    
    // Contraseña de acceso (puedes cambiarla aquí cuando quieras)
    if (password !== "#J") {
        return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    if (accion === "agregar") {
        usuarios.push({ usuario: nuevoNombre, puntos: Number(nuevosPuntos) || 0, ultimaActividad: new Date() });
    } else if (accion === "editar") {
        let user = usuarios.find(u => u.usuario === usuarioMeta);
        if (user) {
            if (nuevoNombre) user.usuario = nuevoNombre;
            if (nuevosPuntos !== undefined) user.puntos = Number(nuevosPuntos);
            user.ultimaActividad = new Date();
        }
    } else if (accion === "eliminar") {
        usuarios = usuarios.filter(u => u.usuario !== usuarioMeta);
    }

    res.json({ success: true, usuarios });
});

// Ruta principal (Carga index.html directamente desde la raíz)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log("Servidor ZENITH corriendo en el puerto " + PORT);
});
