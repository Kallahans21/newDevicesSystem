const express = require('express');
const db = require('./dbconfig.js');  // Conexión a Firebase Firestore
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // Middleware para manejar JSON

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

// Ruta para agregar un nuevo dispositivo
app.post('/agregar', async (req, res) => {
    const { nombre, marca, costo_compra, fecha_ingreso, imei, gastos_extra, descripcion_gasto, estado } = req.body;

    try {
        const nuevoDispositivo = {
            nombre,
            marca,
            costo_compra: parseFloat(costo_compra),
            fecha_ingreso: fecha_ingreso ? new Date(fecha_ingreso) : new Date(),
            imei,
            gastos_extra: parseFloat(gastos_extra),
            descripcion_gasto,
            estado: estado || 'disponible'
        };

        const docRef = await db.collection('dispositivos').add(nuevoDispositivo);
        const idGenerado = docRef.id;

        // Actualizar el documento con el ID generado
        await db.collection('dispositivos').doc(idGenerado).update({ id: idGenerado });

        res.redirect('/');
    } catch (err) {
        console.error('Error al agregar el dispositivo', err);
        res.status(500).send('Error al agregar el dispositivo');
    }
});

// Ruta para cambiar el estado del dispositivo
app.post('/cambiar-estado', async (req, res) => {
    const { id, estado, costo_venta, fecha_venta } = req.body;

    if (!id) {
        return res.status(400).send('ID no proporcionado');
    }

    try {
        const updateData = { estado };
        if (estado === 'vendido') {
            updateData.costo_venta = parseFloat(costo_venta);
            updateData.fecha_venta = fecha_venta ? new Date(fecha_venta) : new Date();
        }

        await db.collection('dispositivos').doc(id).update(updateData);
        res.sendStatus(200);
    } catch (err) {
        console.error('Error al cambiar el estado del dispositivo', err);
        res.status(500).send('Error al cambiar el estado del dispositivo');
    }
});

// Ruta para editar un dispositivo
app.post('/editar', async (req, res) => {
    const { id, gastos_extra, descripcion_gasto, costo_venta } = req.body;

    if (!id) {
        return res.status(400).send('ID no proporcionado');
    }

    try {
        const updateData = {
            gastos_extra: parseFloat(gastos_extra),
            descripcion_gasto
        };
        
        if (costo_venta) {
            updateData.costo_venta = parseFloat(costo_venta);
        }

        await db.collection('dispositivos').doc(id).update(updateData);
        res.redirect('/');
    } catch (err) {
        console.error('Error al editar el dispositivo', err);
        res.status(500).send('Error al editar el dispositivo');
    }
});

// Ruta para obtener los datos de un dispositivo
app.get('/obtener-dispositivo/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const dispositivoDoc = await db.collection('dispositivos').doc(id).get();
        if (dispositivoDoc.exists) {
            res.json(dispositivoDoc.data());
        } else {
            res.status(404).send('Dispositivo no encontrado');
        }
    } catch (err) {
        console.error('Error al obtener el dispositivo', err);
        res.status(500).send('Error al obtener el dispositivo');
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
