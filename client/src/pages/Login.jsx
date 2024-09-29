import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Form, Alert, Button } from "react-bootstrap";
import "../css/Login.css"

function Login({ handleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const credentials = { username, password }
      await handleLogin(credentials)
      navigate("/");
    } catch (err) {
      if (err.message === "Unauthorized")
        setErrorMessage("Invalid username and/or password");
      else
        setErrorMessage(err.message);
      setShow(true);
    }


  }

  return (

    <Col xl={3} className="custom-login">
      <h1 className="pb-3 custom-text-login">Login</h1>
      <Form onSubmit={handleSubmit} className="custom-form">
        <Alert
          dismissible
          show={show}
          onClose={() => setShow(false)}
          variant="danger">
          {errorMessage}
        </Alert>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label style={{ color: "#EFF6E0", fontSize: "1.3rem" }}>Username or Email</Form.Label>
          <Form.Control

            value={username} placeholder="Enter the Username/Email."
            onChange={(ev) => setUsername(ev.target.value)}
            required={true} minLength={5}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label style={{ color: "#EFF6E0", fontSize: "1.3rem" }}>Password</Form.Label>
          <Form.Control
            type="password"
            value={password} placeholder="Enter the password."
            onChange={(ev) => setPassword(ev.target.value)}
            required={true} minLength={5}
          />
        </Form.Group>
        <Button className="mt-3 w-100 custum_button" type="submit">Login</Button>
      </Form>
    </Col>

  )
}
function LogoutButton({ handleLogout }) {
  return (
    <Button variant="outline-light" className="custum_button-log" onClick={handleLogout}>Logout <i className="bi bi-box-arrow-right me-2"></i></Button>
  )
}

function LoginButton() {
  const navigate = useNavigate();
  return (
    <Button variant="outline-light" className="custum_button-log" onClick={() => navigate('/login')}>Login <i className="bi bi-box-arrow-in-right me-2"></i></Button>
  )
}

export { Login, LoginButton, LogoutButton };