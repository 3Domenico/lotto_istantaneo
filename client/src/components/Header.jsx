import { Col, Navbar, Row, Nav } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { LogoutButton, LoginButton } from "../pages/Login";
import { Link } from "react-router-dom";

function Header(props) {
    return (
        <Navbar className="navbar">
            <Container fluid className="px-0">
                <Row className="w-100 align-items-center">
                    <Col>
                        <Navbar.Brand as={Link} to="/"><span className="custom-text" style={{ fontWeight: "bold", fontSize: "1.4rem" }}><i className="bi bi-piggy-bank-fill"></i> Instant Lottery</span></Navbar.Brand> {/* Classe per il brand */}
                    </Col>
                    <Col className="d-flex justify-content-end align-items-center p-0">
                        <Nav className="d-flex gap-4 p-2">

                            <Link to="/" className="custom-link" style={{ textDecoration: "none" }} >
                                Rules
                            </Link>
                            {props.loggedIn ?
                                <>
                                    <Link to="/lottery" className="custom-link" style={{ textDecoration: "none" }} >
                                        Game
                                    </Link>
                                    <Link to="/leaderboard" className="custom-link" style={{ textDecoration: "none" }} >
                                        Leaderboard
                                    </Link>
                                    <Link to="/drawresult" className="custom-link" style={{ textDecoration: "none" }} >
                                        Result
                                    </Link>

                                </>
                                : null}



                            {props.loggedIn ? <LogoutButton handleLogout={props.handleLogout}></LogoutButton> : <LoginButton></LoginButton>}

                        </Nav>
                    </Col>

                </Row>
            </Container>
        </Navbar>
    )
}

export default Header;
