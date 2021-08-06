const express = require('express');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000
const app = express()

connectDB();
app.use(express.json({extended: false}));

app.get('/', (req, res)=>{
    res.status(200).send({msg:"Home"})
})

//Define Routes
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/post', require('./routes/api/post'));
app.use('/api/profile', require('./routes/api/profile'));

app.listen(PORT, ()=>{console.log(`Server is up and running on port ${PORT}`)});