import { useState } from "react";
import { Button, Form } from "react-bootstrap";

function SignUp({ onSubmit }) {
  const [username, setUsername] = useState("");

  return (
    <>
      <p>
        Create a test account here and associate it with the NovAuth
        Authenticator app on your phone.
      </p>
      <Form onSubmit={(e) => onSubmit(e, username)}>
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Form.Text className="text-muted">
            Whoah, no password? Welcome to the passwordless future. :)
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">
          Sign Up
        </Button>
      </Form>
    </>
  );
}

export default SignUp;
