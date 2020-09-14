const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

//initializations
const app = express();
app.use(cors());

//settings
app.set('port', process.env.PORT || 8083);

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//Global Variables
app.use((req, res, next) => {
    next();
});

//Routes
app.use('/apis', require('./routes'));
app.use('/apis/admission', require('./routes/admission'));
app.use('/apis/anyactivity', require('./routes/anyactivity'));
app.use('/apis/auth', require('./routes/authentication'));
app.use('/apis/refund', require('./routes/refund'));
app.use('/apis/receipt', require('./routes/receipt'));
app.use('/apis/invioce', require('./routes/invoice'));
app.use('/apis/report', require('./routes/report'));



//Public
app.use(express.static('uploads'));
app.use('/pdf', express.static('pdf'));

//Starting the server on backend
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})