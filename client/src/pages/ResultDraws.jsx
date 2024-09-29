import { useState, useEffect, useContext } from "react";
import { FeedbackContext } from '../context/FeedbackContext';
import { Card, Spinner, Alert, Container } from "react-bootstrap";
import API from "../API";

function ResultsDraws() {
    const [results, setResult] = useState([]);
    const [loading, setLoading] = useState(true);
    const showFeedback = useContext(FeedbackContext);//contex per il toast di error o successo

    const fetchResultsDraws = async () => {
        try {
            setLoading(true); // Inizia il caricamento
            const results = await API.getResultsByUser();
            setResult(results);
            setLoading(false); // Fine caricamento
        } catch (error) {
            setLoading(false); // Fine caricamento
            showFeedback(error.message, 'danger');
        }
    }

    const getCardStyle = (winStatus) => {
        switch (winStatus) {
            case 'all':
                return 'success'; // verde per tutte le scommesse indovinate
            case 'some':
                return 'warning'; // giallo per alcune scommesse indovinate
            case 'none':
                return 'danger'; // rosso per nessuna scommessa indovinata
            default:
                return '';
        }
    };

    useEffect(() => {
        fetchResultsDraws()
    }, [])

    return (<Container fluid className="mt-4">
        {loading ? (
            <div className="d-flex justify-content-center">
                <Spinner animation="border" />
            </div>
        ) : results.length === 0 ? (
            <Alert variant="info" className="text-center mx-4">
                No results available, what are you waiting for to play?
            </Alert>
        ) : (
            <div className="m-auto" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
                {results.map((result, index) => (
                    <Card
                        key={index}
                        bg={getCardStyle(result.win_status)}
                        text={getCardStyle(result.win_status) === 'warning' ? 'dark' : 'white'}
                        className="mb-3 shadow card-hover"
                    >
                        <Card.Header>Extraction n. {result.draw_id}</Card.Header>
                        <Card.Body>
                            <Card.Title>Date of Extraction: {result.draw_date}</Card.Title>
                            <h3>
                                {result.total_win >= 0 ? 'You won:' : 'You lose:'} {result.total_win}p</h3>
                            <Card.Text>
                                <strong>Bet numbers:</strong> {result.bet_numbers.join(', ')} <br />
                                <strong>Drawn numbers:</strong> {result.draw_numbers.join(', ')} <br />
                                <strong>Guessed numbers:</strong> {result.guessed_numbers.join(', ')} <br />
                                <strong>Points used:</strong> {result.points_used} <br />
                                <strong>Earning points:</strong> {result.points_earnd}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ))};
            </div>
        )}
    </Container>

    );
}

export default ResultsDraws;