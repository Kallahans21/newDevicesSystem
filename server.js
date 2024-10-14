const express = require('express');
const db = require('./dbconfig.js');  // Conexión a Firebase Firestore
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));  // Middleware para manejar los datos del formulario

// Configurar EJS como motor de vistas
app.set('view engine', 'ejs');

// Ruta para mostrar los dispositivos disponibles en la página principal
app.get('/', async (req, res) => {
    try {
        const dispositivosSnapshot = await db.collection('dispositivos').where('estado', '==', 'disponible').get();
        const dispositivos = dispositivosSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.render('index', { dispositivos });
    } catch (err) {
        console.error('Error al obtener los dispositivos', err);
        res.status(500).send('Error al obtener los dispositivos');
    }
});

// Ruta para marcar uno o varios dispositivos como vendidos
app.post('/vender', async (req, res) => {
    const dispositivosIds = req.body.dispositivoIds;
    try {
        if (Array.isArray(dispositivosIds)) {
            // Si se seleccionan varios dispositivos
            for (const id of dispositivosIds) {
                await db.collection('dispositivos').doc(id).update({ estado: 'vendido' });
            }
        } else if (dispositivosIds) {
            // Si solo se selecciona un dispositivo
            await db.collection('dispositivos').doc(dispositivosIds).update({ estado: 'vendido' });
        }
        res.redirect('/');
    } catch (err) {
        console.error('Error al actualizar los dispositivos', err);
        res.status(500).send('Error al actualizar los dispositivos');
    }
});

// Ruta para agregar un nuevo dispositivo
app.post('/agregar', async (req, res) => {
    const { nombre, marca, precio, estado } = req.body;
    try {
        await db.collection('dispositivos').add({
            nombre,
            marca,
            precio: parseFloat(precio),
            estado
        });
        res.redirect('/');
    } catch (err) {
        console.error('Error al agregar el dispositivo', err);
        res.status(500).send('Error al agregar el dispositivo');
    }
});

// Ruta para mostrar todos los dispositivos (historial)
app.get('/historial', async (req, res) => {
    try {
        const dispositivosSnapshot = await db.collection('dispositivos').get();
        const dispositivos = dispositivosSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.render('historial', { dispositivos });
    } catch (err) {
        console.error('Error al obtener el historial', err);
        res.status(500).send('Error al obtener el historial');
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
