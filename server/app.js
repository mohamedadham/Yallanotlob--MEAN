const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose')
const indexRouter = require('./routes/index');
const cors = require('cors')
const multer= require('multer')
var fileExtension = require('file-extension')
const webpush = require('web-push');

const session = require('express-session');
const app = express();

const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/order')
const groupsRouter = require('./routes/group')
const notificationRouter= require('./routes/notification')
const subscriptionsModel= require('./models/subscription')

const vapidKeys = {
  publicKey:"BFT1CBDhl_ch4lyiCLY4_aSSpQFEBrpGBO_Or7gAXU5BtwpD7yKjbsWeA0Xnzvn-i7LTH1XCHqXc0nqLIfV4khk",
  privateKey:"gA7puVGnh8ZZGanbRIB4ZzboWUqi2PIFXbBbhPNO9D8"
}

webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);



const sendNewsletter= async(req, res) =>{

    const allSubscriptions = await subscriptionsModel.find({}).exec()
    console.log(allSubscriptions)

    console.log('Total subscriptions', allSubscriptions.length);

    const notificationPayload = {
        "notification": {
            "title": "Angular News",
            "body": "Newsletter Available!",
            "icon": "assets/main-page-logo-small-hat.png",
            "vibrate": [100, 50, 100],
            "data": {
                "dateOfArrival": Date.now(),
                "primaryKey": 1
            },
            "actions": [{
                "action": "explore",
                "title": "Go to the site"
            }]
        }
    };

    Promise.all(allSubscriptions.map(sub => webpush.sendNotification(
        sub, JSON.stringify(notificationPayload) )))
        .then(() => res.status(200).json({message: 'Newsletter sent successfully.'}))
        .catch(err => {
            console.error("Error sending notification, reason: ", err);
            res.sendStatus(500);
        });
}
app.route('/api/newsletter').post(sendNewsletter);


const storage = multer.diskStorage({

  // Setting directory on disk to save uploaded files
  destination: function (req, file, cb) {
      cb(null, 'public/images/orders_images')
  },

  // Setting name of file saved
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: {
      // Setting Image Size Limit to 2MBs
      fileSize: 2000000
  },
  fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          //Error 
          cb(new Error('Please upload JPG and PNG images only!'))
      }
      //Success 
      cb(undefined, true)
  }
})

app.use(cors({origin:true,credentials: true}));

const MongoStore = require('connect-mongo')(session)

const TWO_HOURS = 1000 * 60 * 60 * 2 * 2
const db = mongoose.connection


const {
  SESS_LIFETIME = TWO_HOURS,
  NODE_ENV = 'development',
  SESS_SECRET = '54858-2542-32152'
} = process.env

const IN_PROD = NODE_ENV === 'production'


//-----------mongoose connect-------------------
mongoose.connect('mongodb://localhost:27017/yalanotlob', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => { }, (err) => {
  console.log(err)
})


//--------------middlewares------------------------
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//----------------Setup session-------------------
app.use(session({
  cookie: {
    maxAge: SESS_LIFETIME,
    sameSite: false,
    secure: false,
  },
  name: 'session-id',
  secret: SESS_SECRET,
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({ mongooseConnection: db })
}))

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
  if (req.method === "OPTIONS") {
      return res.status(200).end();
  } else {
      next();
  }
});

//---------------------------routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter)
app.use('/groups', groupsRouter)
app.use('/notifications', notificationRouter);


app.post('/uploadfile', upload.single('uploadedImage'), (req, res, next) => {
  const file = req.file
  if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
  }
  res.status(200).send({
      statusCode: 200,
      status: 'success',
      uploadedFile: file
  })

}, (error, req, res, next) => {
  res.status(400).send({
      error: error.message
  })
})




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).send({ error: err.message });

});

module.exports = app;
