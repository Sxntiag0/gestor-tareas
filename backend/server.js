const express = require('express');
const cors = require('cors');
const db = require('./db'); 
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


app.get('/api/tasks', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM tasks ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post('/api/tasks', async (req, res) => {
    try {
        // Obtenemos los datos que el usuario nos envía
        const { title, description } = req.body; 
        

        const [result] = await db.execute(
            'INSERT INTO tasks (title, description) VALUES (?, ?)',
            [title, description]
        );
        
        
        res.status(201).json({ id: result.insertId, title, description, status: 'pendiente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { title, description, status } = req.body;
        // req.params.id toma el número que pongas al final de la URL
        await db.execute(
            'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?',
            [title, description, status, req.params.id]
        );
        res.json({ message: 'Tarea actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM tasks WHERE id = ?', [req.params.id]);
        res.json({ message: 'Tarea eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
