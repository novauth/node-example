import styles from "./App.module.css";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Header from "./components/Header";
import { useState } from "react";

type AppState =
  | "initial"
  | "registration_pending"
  | "registered"
  | "auth_pending"
  | "auth_successful";

function App() {
  const [appState, setAppState] = useState<AppState>("initial");
  const [tab, setTab] = useState<string>("sign-up");

  function onSignUpSubmit(e, username) {
    e.preventDefault()
    setAppState("registration_pending");

  }

  function onSignInSubmit(e, username) {
    e.preventDefault()
    setAppState("auth_pending");

  }

  return (
    <Container className={styles.baseContainer}>
      <Row className="justify-content-center align-items-center">
        <Col className={`${styles.centeredContainer}`}>
          <Header />
          <div className={`p-4 ${styles.formContainer} mb-3`}>
            <Tabs
              defaultActiveKey={tab}
              id="form-tabs"
              className="mb-3"
              onSelect={(k) => setTab(k != null ? k : "sign-up")}
            >
              <Tab
                eventKey="sign-up"
                title="Sign Up"
                disabled={appState !== "initial" && tab !== "sign-up"}
              >
                <SignUp onSubmit={onSignUpSubmit} />
              </Tab>
              <Tab
                eventKey="sign-in"
                title="Sign In"
                disabled={appState !== "initial" && tab !== "sign-in"}
              >
                <SignIn onSubmit={onSignInSubmit} />
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
