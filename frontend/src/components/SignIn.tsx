import { useState } from "react";
import { Button, Form } from "react-bootstrap";

function SignIn({ onSubmit }) {
  const [username, setUsername] = useState("");

  return (
    <>
      <p>
        Provide your username here, then authenticate to the service by
        receiving a push notification on the NovAuth Authenticator app on your
        phone.
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
            Remember, your phone is the key to access your account.
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">
          Sign In
        </Button>
      </Form>
    </>
  );
}

export default SignIn;
