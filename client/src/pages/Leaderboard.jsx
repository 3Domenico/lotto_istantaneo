import { useEffect, useState, useContext } from "react";
import { FeedbackContext } from '../context/FeedbackContext';
import API from "../API";
import { Container, Col, Card, Spinner } from 'react-bootstrap';


function Leaderboard() {
    const showFeedback = useContext(FeedbackContext);
    const [loading, setLoading] = useState(true); // Stato per gestire il caricamento
    const [users, setUsers] = useState([]);
    const fetchLeaderboard = async () => {
        try {
            setLoading(true); // Inizia il caricamento
            const users_leaderboard = await API.getTopThreeUsers();
            setUsers(users_leaderboard);
            setLoading(false); // Fine caricamento
        } catch (error) {
            setLoading(false); // Fine caricamento
            showFeedback(error.message, 'danger');
        }
    }

    useEffect(() => {
        fetchLeaderboard()
    }, [])

    return (<>


        <Container fluid className="m-auto p-2">

            <Col className="m-auto text-center" md={9}>
                <h1 style={{ color: "#EFF6E0" }} className="mb-4"><strong>Leaderboard</strong></h1>
                {loading ? (
                    // Mostra un indicatore di caricamento durante il caricamento
                    <div className="text-center my-5">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : users.length === 0 ? (
                    <Card className='p-3 leaderboard-card text-center my-2'>
                        <Card.Body>
                            <h3>No users in the leaderboard yet.</h3>
                        </Card.Body>
                    </Card>
                ) : (
                    users.map((user, index) => (
                        <Col key={index} xs={12} md={6} className="m-auto">

                            <Card className='p-1 leaderboard-card text-center my-2'>

                                <Card.Body className="d-flex justify-content-between">
                                    <div className="d-flex ">
                                        <img
                                            src={index === 0 ? "/first_place.svg" : index === 1 ? "/second_place.svg" : index === 2 ? "/third_place.svg" : ""}
                                            width={'47px'}
                                            className="my-3"
                                            style={{ display: 'block', height: 'auto' }}
                                        />
                                        <i className="bi bi-person-square mx-4 " style={{ fontSize: "4.5rem" }}></i>
                                        <h3 className="my-auto mx-2"> {user.username}</h3>
                                    </div>
                                    <h2 className="my-auto ml-0">{user.points}p</h2>
                                </Card.Body>
                            </Card>
                        </Col>

                    ))
                )
                }
            </Col>
        </Container>

    </>)
}
export default Leaderboard