import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NoMatch() {
    return (<Container className="d-flex flex-column align-items-center justify-content-center m-auto">
        <Row>
            <Col className="text-center custom-text">
                <h2 style={{ fontWeight: "bold" }}>Error: page not found!</h2>
            </Col>
        </Row>
        <Row>
            <Col className="m-auto" md={6}>
                <img
                    src="/404_not_found.png"
                    alt="page not found"
                    className="my-3"
                    style={{ display: 'block', margin: 'auto', maxWidth: '100%', height: 'auto' }}
                />
            </Col>
        </Row>
        <Row>
            <Col>
                <Link to="/" className="btn custum_button-general mt-2 my-5 fs-5">
                    Go Home!
                </Link>
            </Col>
        </Row>
    </Container>
    );
}

export default NoMatch;
