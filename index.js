const express = require('express');
const app = express();

const dotenv =  require('dotenv');
const mongoose =  require('mongoose');

//Import routes
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts')

dotenv.config();


//Conneect to DB
mongoose.connect(
    process.env.DB_CONNECTION,
    { useUnifiedTopology: true },
    () => {
        console.log('connected')
});


//Middlewares
app.use(express.json());




//Routes middlewares
app.use('/api/user', authRoute)
app.use('/api/posts', postsRoute)



app.listen(3000, () => console.log("Running"));