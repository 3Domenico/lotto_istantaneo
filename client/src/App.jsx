import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css'
import { useState, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import PageLayout from './pages/PageLayout'
import NoMatch from './pages/NoMatch';
import Home from './pages/Home';
import Header from './components/Header';
import API from './API';
import { Login } from './pages/Login';
import Dashboard from './pages/Dashboard';
import { FeedbackProvider } from './context/FeedbackContext';
import Leaderboard from './pages/Leaderboard';
import ResultsDraws from './pages/ResultDraws';
function App() {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState();
  /**
    * Questa funzione gestisce il processo di login.
    * Richiede un nome utente e una password all'interno di un oggetto “credenziali”.
    */
  const handleLogin = async (credentials) => {
    const user = await API.logIn(credentials);
    setUser(user); setLoggedIn(true);
  };
  /**
      * Questa funzione gestisce il processo di logout.
      */
  const handleLogout = async () => {
    await API.logout();
    setLoggedIn(false);
    setUser(null);

  };
  /**
       * Questa funzione gestisce il processo di creazione della scommessa.
       */

  const handleCreateBet = async (bet) => {
    return await API.createBet(bet);
  }



  useEffect(() => {
    // Verifica se l'utente ha già effettuato il login
    // Questo useEffect viene richiamato solo la prima volta che il componente viene montato (cioè quando la pagina viene (ri)caricata).
    API.getUserInfo()
      .then(user => {
        setLoggedIn(true);
        setUser(user);  // qui ci sono le informazioni sull'utente, se già loggato
      }).catch(e => {
        if (loggedIn)    // errore di stampa solo se lo stato è incoerente (ad esempio, l'app è stata configurata per essere loggata)
          setLoggedIn(false); setUser(null);
      });
  }, []);


  return (
    <FeedbackProvider>
      <div className="min-vh-100 d-flex flex-column " >
        <Header loggedIn={loggedIn} handleLogout={handleLogout} ></Header>
        <Routes >
          <Route path='/' element={<PageLayout></PageLayout>}></Route>
          <Route index element={<Home loggedIn={loggedIn} user={user}  ></Home>} ></Route>
          <Route path='/lottery' element={!loggedIn ? <Navigate replace to='/'></Navigate> : <Dashboard user={user} setUser={setUser} handleCreateBet={handleCreateBet} ></Dashboard>} ></Route>
          <Route path='/leaderboard' element={!loggedIn ? <Navigate replace to='/'></Navigate> : <Leaderboard user={user} setUser={setUser} handleCreateBet={handleCreateBet} ></Leaderboard>} ></Route>
          <Route path='/drawresult' element={!loggedIn ? <Navigate replace to='/'></Navigate> : <ResultsDraws></ResultsDraws>} ></Route>
          <Route path='/login' element={
            !loggedIn ? <Login handleLogin={handleLogin}></Login> : <Navigate replace to='/'></Navigate>}></Route>
          <Route path='*' element={<NoMatch></NoMatch>}></Route>
        </Routes>
      </div>
    </FeedbackProvider>
  )
}

export default App
