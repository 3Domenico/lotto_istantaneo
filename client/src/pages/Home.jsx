import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
function Home({ loggedIn, user }) {

    return (
        <Container fluid className=" m-auto">
            <Row className="justify-content-center">
                <Col md={7} className='custom-text  mb-4 '>
                    <h1 className="text-center mb-4 fw-bold">Welcome {loggedIn ? user.username : null} to the Instant Lottery!</h1>
                    <p>
                        The Instant Lotto game consists of the periodic drawing of five numbers in the range 1-90. Players can bet on 1, 2 or 3 different numbers in an attempt to win points.
                        Each player has an initial budget of 100 points and can bet on specific numbers before each draw.
                    </p>
                    <h3>Rules of the Game:</h3>
                    <ul>
                        <li>A five-number draw takes place every two minutes.</li>
                        <li>Betting on 1 number costs 5 points, on 2 numbers 10 points, and on 3 numbers 15 points.</li>
                        <li>If a player guesses all the numbers he has bet on, he wins double the amount of points used for the bet.</li>
                        <li>If a player does not guess any numbers, he does not win any points.</li>
                        <li>If a player only guesses a few numbers, he wins points proportionally.</li>
                        <li>Each player may only place one bet per draw.</li>
                        <li>When a player's budget is reset, he can no longer play.</li>
                    </ul>
                    <div className="text-center mt-4">
                        {!loggedIn ? (
                            <p className='fw-bold'>
                                You are not logged in yet. Make the  <Link className='custom-link ' to="/login">Login</Link> to start playing!
                            </p>
                        ) : (
                            <p className='fw-bold'>Good luck and have fun!<Link className='custom-link ' to="/lottery"> Extraction</Link></p>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );

}
export default Home