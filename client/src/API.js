const SERVER_URL = 'http://localhost:3001/api';

/**
 * Questa funzione vuole nome utente e password all'interno di un oggetto “credenziali”.
 * Esegue il log-in.
 */
const logIn = async (credentials) => {
  return await fetch(SERVER_URL + '/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',  // questo parametro specifica che il cookie di autenticazione deve essere forzato. È incluso in tutte le API autenticate.
    body: JSON.stringify(credentials),
  }).then(handleInvalidResponse)
    .then(response => response.json());
};

/**
 * Questa funzione è utilizzata per verificare se l'utente è ancora connesso.
 * Restituisce un oggetto JSON con le informazioni sull'utente.
 */
const getUserInfo = async () => {
  return await fetch(SERVER_URL + '/sessions/current', {
    method: 'GET',
    credentials: 'include'
  }).then(handleInvalidResponse)
    .then(response => response.json());
};

/**
* Questa funzione distrugge la sessione dell'utente corrente (eseguendo il log-out).
*/
const logout = async () => {
  return await fetch(SERVER_URL + '/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  }).then(handleInvalidResponse);
};


const getCurrentDraw = async () => {
  const draw = await fetch(SERVER_URL + '/draw', {
    method: 'GET',
    credentials: 'include'
  }).then(handleInvalidResponse).then((res) => res.json());
  return draw;

}

const createBet = async (bet) => {
  return await fetch(SERVER_URL + '/bet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(bet)
  }).then(handleInvalidResponse).then((res) => res.json())

}

const getBet = async (draw_id) => {
  return await fetch(SERVER_URL + `/bet/${draw_id}`, {
    method: 'GET',
    credentials: 'include'
  }).then(res => res.json())

}

const getResultDraw = async (draw_id) => {
  return await fetch(SERVER_URL + `/draw/result/${draw_id}`, {
    method: 'GET',
    credentials: 'include'
  }).then(handleInvalidResponse).then(res => res.json())
}



const getTopThreeUsers = async () => {
  const users = await fetch(SERVER_URL + '/top-user', {
    method: 'GET',
    credentials: 'include'
  }).then(handleInvalidResponse).then((res) => res.json());
  return users;

}

const getResultsByUser = async () => {
  const result = await fetch(SERVER_URL + '/user-results', {
    method: 'GET',
    credentials: 'include'
  }).then(handleInvalidResponse).then((res) => res.json());
  return result;

}


async function handleInvalidResponse(response) {
  if (!response.ok) {
    const errorJson = await response.json();
    //in alcuni casi, per esmpio negli errori di validazione ci potrebbe essere un array errors come json e non solo error come nel caso seplice
    if (errorJson.errors) {
      throw Error(errorJson.errors[0].msg)
    }
    throw Error(errorJson.error)
  }
  let type = response.headers.get('Content-Type');
  // Controlla se l'header 'Content-Type' della risposta è presente e contiene 'application/json'.
  if (type !== null && type.indexOf('application/json') === -1) {
    throw new TypeError(`Expected JSON, got ${type}`)
  }
  return response;
};

const API = { logIn, getUserInfo, logout, getCurrentDraw, createBet, getBet, getResultDraw, getTopThreeUsers, getResultsByUser }
export default API;