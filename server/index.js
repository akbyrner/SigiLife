import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
const app = express();

const PORT = process.env.PORT || 3000;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Routes
app.get('/', (req, res) => {
    res.send('Hello SigiLife!');
});

app.get('/user', (req, res) => {
    res.send(JSON.stringify({user: 'HopeyClarkey', gmail: 'someGmail', friends: ['BernMan'], sigils: [{sigilName: sigilOne},{sigilName: sigilTwo},{sigilName: sigilThree},]}))
})

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

const server = app.listen(PORT, (err) => {
    if (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
    console.log(`Server is running on http://localhost:${PORT}`);
});
