// imports
import cors from 'cors'; // CORS middleware
import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import morgan from 'morgan';
import UserDao from './db/dao-user.mjs';
import AuthController from './controllers/auth-controller.mjs';
import { startDraws } from './controllers/draw-controller.mjs';
import DrawController from './controllers/draw-controller.mjs';
import BetController from './controllers/bet-controller.mjs';
import UserController from './controllers/controller-user.mjs';
import { check } from 'express-validator';
import ResultController from './controllers/result-contoller.mjs';
const userDao = new UserDao();

// inizializza express
const app = new express();
const port = 3001;

//aiutare lo sviluppatore a vedere la registrazione della richiesta http 
app.use(morgan('dev'));
app.use(express.json());
/** Impostare e abilitare la condivisione delle risorse cross-origine (CORS) **/
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true //coockie
};
app.use(cors(corsOptions));


/** Imposta la strategia di autenticazione per cercare nel DB un utente con una password corrispondente.
 * L'oggetto utente conterrà altre informazioni estratte dal metodo userDao.getUserByCredentials() (ad esempio, id, username, name).
 **/
passport.use(new LocalStrategy(async function verify(identifier, password, callback) {
  const user = await userDao.getUserByCredentials(identifier, password)
  if (!user)
    return callback(null, false, 'Incorrect username/email or password');

  return callback(null, user);
}));

// Serializzare nella sessione l'oggetto utente dato da LocalStrategy(verify).
passport.serializeUser(function (user, callback) {
  callback(null, user);
});

// Partendo dai dati della sessione, estraiamo l'utente corrente (loggato).
passport.deserializeUser(function (user, callback) {
  return callback(null, user); // questo sarà disponibile in req.user
});


/** Creazione della sessione */
app.use(session({
  secret: "This is a very secret information used to initialize the session!",
  resave: false,                  // Impedisce il salvataggio della sessione già inizializzate se non sono stati apportati cambiamenti
  saveUninitialized: false,       //Impedisce di salvare una sessione vuota, viene creata solo se necessario
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,   // Scadenza del cookie: 24 ore
    secure: false,                 // non viene usato HTTPS se no true
    httpOnly: true,               // Il cookie è accessibile solo tramite HTTP(S), non da JavaScript lato client
    sameSite: 'lax'              
  }
}));

app.use(passport.authenticate('session'));


/** Definizione del middleware di verifica dell'autenticazione **/
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized' });
}

/*** Authentication APIs ***/
const auth = new AuthController()

// POST /api/sessions
// Questo percorso viene utilizzato per eseguire il login.
app.post('/api/sessions', auth.login);

// GET /api/sessions/current
// Questa rotta controlla se l'utente è connesso o meno e restituscie informazioni sull'utente loggato
app.get('/api/sessions/current', auth.getCurrentSession);

// DELETE /api/session/current
// Questo percorso viene utilizzato per la disconnessione dell'utente corrente.
app.delete('/api/sessions/current', auth.logout);

/*** Draws API ***/
const draw=new DrawController();
//GET /api/draw
//Questo percorso consente di ottenere l'estrazione corrente
app.get('/api/draw',isLoggedIn,draw.getCurrentDraw);

//GET /api/draw/result/:drawId
//Questo percorso fornisce il risultato di un sorteggio per un utente specifico
app.get('/api/draw/result/:drawId',isLoggedIn,[
  check('drawId').isInt({ min: 1 }).withMessage('drawId must be a positive integer')
],draw.getResultDraw)


/***Bets API***/
const bet=new BetController();
//POST /api/bet
//Questo percorso consente di piazzare una scommessa
app.post('/api/bet',isLoggedIn,[
  check('draw_id').isInt({ min: 1 }).withMessage('draw_id must be a positive integer'),
  check('numbers').isArray({ min: 1, max: 3 }).withMessage('You can only bet on 1, 2, or 3 numbers'),
  check('numbers.*').isInt({ min: 1, max: 90 }).withMessage('Each number must be between 1 and 90')
],bet.createBet);

//GET /api/bet
//questa API fornisce la puntata di un'estrazione per un utente specifico
app.get('/api/bet/:drawId',[
  check('drawId').isInt({ min: 1 }).withMessage('drawId must be a positive integer')
],isLoggedIn,bet.getBet);


/***Users API***/
const user= new UserController();
//GET /api/top-user
//questa api dà i migliori 3 utenti
app.get('/api/top-user',isLoggedIn,user.getTopThreeUsers);


/**Results API */
const result= new ResultController();
//GET /api/user-results
//questa api fornisce la cronologia dei risulati delle bet precedentemente fatte dall'utente
app.get('/api/user-results',isLoggedIn,result.getResultsByUser);


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  startDraws();
  setInterval(startDraws, 2 * 60 * 1000);

});
