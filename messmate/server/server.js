const express = require('express');
const cors = require('cors');
const pool = require('./db.js');
const studentRoutes = require('./routes/student.routes');
const router = express.Router();
const adminRoutes = require('./routes/admin.routes');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/student', studentRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    console.log(req.body)
    res.send('Hello World!');
});


app.post('/add', (req, res) => {
    const { name, email } = req.body;
    console.log(name, email);
    res.send('Data received!');

})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});