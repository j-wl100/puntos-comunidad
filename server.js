const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base de datos de ejemplo
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

// API para los puntos
app.get('/api/puntos', (req, res) => {
    res.json(usuarios);
});

// PAGINA PRINCIPAL (Todo en uno: Puntos + Juego abajo del todo)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ZENITH - Comunidad</title>
            <style>
                body { background: #fff; color: #000; font-family: monospace; padding: 20px; max-width: 500px; margin: auto; }
                .box { border: 1px solid #001240; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                h2 { color: #001240; border-bottom: 2px solid #001240; padding-bottom: 5px; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
                button { width: 100%; padding: 10px; background: #001240; color: #fff; border: none; border-radius: 5px; margin-top: 10px; cursor: pointer; font-family: monospace; }
            </style>
        </head>
        <body>

            <!-- TABLA DE PUNTOS -->
            <div class="box">
                <h2>LISTA PUNTOS</h2>
                <table>
                    <thead><tr><th>Usuario</th><th>Puntos</th></tr></thead>
                    <tbody id="cuerpo-tabla">
                        <tr><td colspan="2">Cargando...</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- ========================================================= -->
            <!-- ⬇️ JUEGO PRUEBA (BORRAR ESTE BLOQUE CUANDO QUIERAS QUITARLO) ⬇️ -->
            <!-- ========================================================= -->
            <div class="box" style="border-color: #ff0055; text-align: center;">
                <h2 style="color: #ff0055; border-color: #ff0055;">ZONA JUEGO PRUEBA</h2>
                <p style="font-size: 0.8rem;">Dispara a los bloques que caen</p>
                <canvas id="gameCanvas" width="280" height="300" style="background:#111; border:1px solid #ff0055;"></canvas>
                <div>
                    <button onclick="moverIzq()" style="width: 30%; background:#ff0055; display:inline-block;">Izquierda</button>
                    <button onclick="disparar()" style="width: 35%; background:#ff0055; display:inline-block;">Disparar</button>
                    <button onclick="moverDer()" style="width: 30%; background:#ff0055; display:inline-block;">Derecha</button>
                </div>
            </div>
            <!-- ========================================================= -->
            <!-- ⬆️ FIN DEL JUEGO PRUEBA ⬆️ -->
            <!-- ========================================================= -->

            <script>
                // Cargar datos de puntos
                fetch('/api/puntos')
                    .then(res => res.json())
                    .then(data => {
                        let tabla = document.getElementById('cuerpo-tabla');
                        tabla.innerHTML = '';
                        data.forEach(u => {
                            tabla.innerHTML += \`<tr><td>\${u.usuario}</td><td>\${u.puntos}</td></tr>\`;
                        });
                    });

                // Script del Juego Prueba
                const canvas = document.getElementById("gameCanvas");
                const ctx = canvas.getContext("2d");
                let playerX = 120;
                let bullets = [];
                let enemies = [{x: 100, y: 10, width: 20, height: 20, speed: 1}];
                let score = 0;

                function moverIzq() { if(playerX > 10) playerX -= 15; }
                function moverDer() { if(playerX < canvas.width - 30) playerX += 15; }
                function disparar() { bullets.push({x: playerX + 8, y: 270, width: 4, height: 10}); }

                function loop() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Jugador
                    ctx.fillStyle = "#001240";
                    ctx.fillRect(playerX, 280, 30, 10);

                    // Balas
                    ctx.fillStyle = "#ff0055";
                    bullets.forEach((b, index) => {
                        b.y -= 5;
                        ctx.fillRect(b.x, b.y, b.width, b.height);
                        if(b.y < 0) bullets.splice(index, 1);
                    });

                    // Enemigos
                    ctx.fillStyle = "#000";
                    enemies.forEach((e, index) => {
                        e.y += e.speed;
                        ctx.fillRect(e.x, e.y, e.width, e.height);

                        // Colisión
                        bullets.forEach((b, bIndex) => {
                            if(b.x < e.x + e.width && b.x + b.width > e.x && b.y < e.y + e.height && b.y + b.height > e.y) {
                                enemies.splice(index, 1);
                                bullets.splice(bIndex, 1);
                                score += 10;
                                enemies.push({x: Math.random() * 240, y: 0, width: 20, height: 20, speed: 1.2});
                            }
                        });

                        if(e.y > canvas.height) e.y = 0;
                    });

                    ctx.fillStyle = "#ff0055";
                    ctx.font = "12px monospace";
                    ctx.fillText("Score: " + score, 10, 20);

                    requestAnimationFrame(loop);
                }
                loop();
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT);
});
