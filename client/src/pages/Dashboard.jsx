import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Button, Alert, Card, Spinner } from 'react-bootstrap';

import dayjs from 'dayjs';
import "../css/Dashboard.css"
import API from '../API';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { FeedbackContext } from '../context/FeedbackContext';
import DrawResult from '../components/DrawResult';
//plugin per estendere le funzionalità di dayjs permettendogli di fare ulteriori operazioni con le durate,covertire la data in utc e sicronozzzarsi con il fuso orario locale dell'utente(utilizzato per formattare il timer sotto)
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);
function Dashboard(props) {
    const [selectedNumbers, setSelectedNumbers] = useState([]);//numeri selezionati
    const [timeRemaining, setTimeRemaining] = useState(null);//tempo rimanente alla coclusione dell'estrazione corrente
    const [drawId, setDrawID] = useState(null);
    const [betPlaced, setBetPlaced] = useState(false); //la scomessa è stata fatta?
    const showFeedback = useContext(FeedbackContext);//contex per il toast di error o successo
    const [showResultModal, setShowResultModal] = useState(false);//stato per la visualizzazione del modal del risulato
    const [dataResult, setDataResult] = useState(null); //stato per contenere l esito della bet
    const [result, setResult] = useState(null);//stato per definire il tipo di esito della bet allNUmbers, noNumbers, someNumebrs
    const [loading, setLoading] = useState(true); // Stato per gestire il caricamento
    const [pointsCheck, setPointsCheck] = useState(0);//stato per gestire i punti durante la punata


    //funzioni caricamento punti utente necessaria per avere i punti sempre aggiornati al valore corrente
    const fetchUserInfo = async () => {
        try {
            const user_info = await API.getUserInfo();
            props.setUser(user_info);
            setPointsCheck(user_info.points);
        } catch (err) {
            console.log(err);
        }
    }
    

    //funzione per la visualizzazione dei risulati
    const fetchDrawResult = async (draw_Id) => {
        try {
            const draw_result = await API.getResultDraw(draw_Id);
            props.setUser((prevUser) => { return { ...prevUser, points: prevUser.points + draw_result.total_win } });
            setPointsCheck((prevPoints) => prevPoints + draw_result.points_earnd)
            setDataResult({ ...draw_result });
            if (draw_result.guessed_numbers.length === draw_result.bet_numbers.length) {
                setResult('allNumbers');
            } else if (draw_result.guessed_numbers.length > 0) {
                setResult('someNumbers')
            } else {
                setResult('noNumbers')
            }
            setShowResultModal(true);
        } catch (error) {
            setPointsCheck(props.user.points);//se sono stati inseriti dei numeri ma non è stata piazzata la bet il valore torna a quello effettivo
        }

    }


    //heandler per creare la puntata
    const handleOnClick = async (event) => {
        try {
            event.preventDefault();
            const res = await props.handleCreateBet({ draw_id: drawId, numbers: selectedNumbers });
            setBetPlaced(true); //bet piazzata
            showFeedback(res.message, 'success');
        } catch (error) {
            showFeedback(error.message, 'danger');
        }

    }

    useEffect(() => {
        let intervalId;
        let timeoutId1;
        let timeoutId2;
      //funzione per il caricamento e l'individuazione dei risulati(se è stata effettuata la bet) dell'estrazione corrente  e delle successive
        const updateDrawData = async () => {
          try {
            const draw = await API.getCurrentDraw();
            setDrawID(draw.id);
            
            const nextDrawTime = dayjs(draw.draw_date).utc().local().add(121000, 'millisecond');
            const now = dayjs();
            const diff = nextDrawTime.diff(now);
      
            // Controlla se c'è già una scommessa per questa estrazione
            const bet = await API.getBet(draw.id);
            if (bet.id) {
              const bet_numbers = [bet.number_0, bet.number_1, bet.number_2].filter((num) => num !== 0);
              setSelectedNumbers(bet_numbers);
              setPointsCheck((prevPoints) => prevPoints - 5 * bet_numbers.length);
              setBetPlaced(true);
            }
      
            //Timer visualizzato a schermo aggiornato ogni secondo
            intervalId = setInterval(() => {
              const remainingTime = nextDrawTime.diff(dayjs());
              if (remainingTime <= 0) {
                clearInterval(intervalId);
                setBetPlaced(true);// quando è finito il tempo non si ha la possibilità di piazzare una bet
                setTimeRemaining('00:00');
              } else {
                const duration = dayjs.duration(remainingTime);
                const formattedTime = `${duration.minutes().toString().padStart(2, '0')}:${duration.seconds().toString().padStart(2, '0')}`;
                setTimeRemaining(formattedTime);
              }
            }, 1000);
      
            // Primo timeout: fetch dei risultati
            timeoutId1 = setTimeout(() => {
              fetchDrawResult(draw.id);
            }, diff + 500); // 1.5 secondo dopo la fine prevista dell'estrazione
      
            // Secondo timeout: preparazione per la prossima estrazione
            timeoutId2 = setTimeout(() => {
              clearInterval(intervalId);
              setSelectedNumbers([]);
              setBetPlaced(false);
              updateDrawData(); // Avvia il ciclo per la prossima estrazione
            }, diff + 1000); // 2 secondi dopo la fine
      
            setLoading(false);
          } catch (error) {
            setLoading(false);
            showFeedback(error.message, 'danger');
          }
        };
      
        fetchUserInfo();
        updateDrawData();
      
        return () => {
          clearInterval(intervalId);
          clearTimeout(timeoutId1);
          clearTimeout(timeoutId2);
        };
      }, []);

    useEffect(() => {
        fetchUserInfo();
    }, [])


    //funzione per la scelta dei numeri da puntare 
    const handleNumberClick = (number) => {
        setSelectedNumbers(prevSelected => {
            if (prevSelected.includes(number)) {
                setPointsCheck((prevPoint) => prevPoint + 5);
                return prevSelected.filter(num => num !== number);
            } else if (prevSelected.length < 3) {
                setPointsCheck((prevPoint) => prevPoint - 5);
                return [...prevSelected, number];
            }
            return prevSelected;
        });
    };

    const renderNumberButtons = () => {
        return Array.from({ length: 90 }, (_, i) => i + 1).map(number => (
            <Col key={number} className='my-1' style={{ display: "contents" }}>
                <Button
                    className={!selectedNumbers.includes(number) ? 'custum_button-outline' : null}
                    variant={selectedNumbers.includes(number) ? 'success' : null}
                    onClick={() => handleNumberClick(number)}
                    disabled={((selectedNumbers.length >= 3 || pointsCheck <= 0) && !selectedNumbers.includes(number)) || betPlaced || props.user.points <= 0}
                    style={{ width: '41px', height: '41px', borderRadius: '60px' }}
                >
                    {number}
                </Button>
            </Col>
        ));
    };

    return (
        <Container fluid className=" m-auto p-auto" >
            {loading ? (
                // Mostra un indicatore di caricamento durante il caricamento
                <div className="text-center my-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : <>
                <DrawResult showResultModal={showResultModal} setShowResultModal={setShowResultModal} dataResult={dataResult} result={result} ></DrawResult>
                <Col md={9} className='m-auto'>
                    <Row  >
                        <Col >
                            <Card className='card-custom my-4'>
                                <Row className='h-100' >
                                    <Col className='my-auto'> <img
                                        src="/user.png"
                                        alt="page not found"
                                        style={{ display: 'block', margin: 'auto', maxWidth: '15rem' }}
                                    /> </Col>
                                    <Col className='my-auto'>
                                        <h1 className='custom-text-dashboard'>{props.user.username}</h1>
                                        <h2 className='custom-text-dashboard' >Points: {pointsCheck}</h2>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col>
                            <Card className='card-custom my-4'>
                                <Row className='h-100' >
                                    <Col className='my-auto'> <img
                                        src="/lottery.png"
                                        alt="page not found"
                                        style={{ display: 'block', margin: 'auto', maxWidth: '15rem' }}
                                    /> </Col>
                                    <Col className='my-auto'>
                                        <h1 className='custom-text-dashboard text-center'>Draw n. {drawId}</h1>
                                        <h2 className='custom-text-dashboard text-center' >{timeRemaining ? timeRemaining : <Spinner></Spinner>}</h2>
                                    </Col>
                                </Row>

                            </Card>
                        </Col>
                    </Row>
                    <Alert variant="info" className="text-center">
                        {props.user.points <= 0 ? "You don't have enough points" : betPlaced ? 'You have already placed a bet for this draw, wait until the deadline to see the results.' :  'You can select up to 3 numbers between 1 and 90.'}
                    </Alert>
                    <Row className='d-flex justify-content-center gap-2 '>
                        {renderNumberButtons()}
                    </Row>
                    <Row className='my-4 m-auto w-50'>
                        <Button className='custum_button-general' onClick={handleOnClick} disabled={betPlaced || props.user.points <= 0 || selectedNumbers.length === 0} >Place a bet</Button>
                    </Row>
                </Col>
            </>}
        </Container>
    );
}

export default Dashboard;
