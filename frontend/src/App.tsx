import styles from "./App.module.css";
import { Button, Col, Container, Form, Row, Tab, Tabs } from "react-bootstrap";

function App() {
  return (
    <Container className={styles.baseContainer}>
      <Row className="justify-content-center align-items-center">
        <Col className={`${styles.centeredContainer}`}>
          <div className="text-center">
            <img
              src="logo512.png"
              className={`${styles.logo} mb-3`}
              alt="logo"
            />
            <h1>NovAuth Authentication Example</h1>
            <p className="lead">
              Push authentication made easy. Test it by yourself.
            </p>
          </div>
          <div className={`p-4 ${styles.formContainer} mb-3`}>
            <Tabs
              defaultActiveKey="sign-up"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="sign-up" title="Sign Up">
                <p>
                  Create a test account here and associate it with the NovAuth
                  Authenticator app on your phone.
                </p>
                <Form>
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="username"
                      placeholder="Enter username"
                    />
                    <Form.Text className="text-muted">
                      Whoah, no password? Welcome to the passwordless future. :)
                    </Form.Text>
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Sign Up
                  </Button>
                </Form>
              </Tab>
              <Tab eventKey="sign-in" title="Sign In">
                <p>
                  Provide your username here, then authenticate to the service
                  by receiving a push notification on the NovAuth Authenticator
                  app on your phone.
                </p>
                <Form>
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="username"
                      placeholder="Enter username"
                    />
                    <Form.Text className="text-muted">
                      Remember, your phone is the key to access your account.
                    </Form.Text>
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Sign In
                  </Button>
                </Form>
              </Tab>
            </Tabs>
          </div>
          <p className="text-center">
            Learn more on{" "}
            <a href="https://github.com/novauth/novauth">GitHub</a>.
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
