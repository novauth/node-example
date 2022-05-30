import styles from "./App.module.css";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Header from "./components/Header";
import { useState } from "react";
import axios from "axios";
import Loading from "./components/Loading";
import QRCodePanel from "./components/QRCodePanel";
import { io } from "socket.io-client";

type AppState =
  | "initial"
  | "registration_pending"
  | "registered"
  | "auth_pending"
  | "auth_successful";

const API_URL = process.env.API_URL || "/api";

function App() {
  const [socket, setSocket] = useState<any>(null);
  const [appState, setAppState] = useState<AppState>("initial");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<string>("sign-up");
  const [QRCode, setQRCode] = useState("");

  async function onSignUpSubmit(e, username) {
    e.preventDefault();
    setAppState("registration_pending");
    setLoading(true);
    const response = await axios.post(`${API_URL}/sign-up`, { username });

    const socket = io();

    socket.on("connect", () => {
      socket.emit("join", username);
    });

    socket.on("pairing_verified", () => {
      setAppState("registered");
    });

    setSocket(io);

    setQRCode(response.data.qrCode);
    setLoading(false);
  }

  async function onSignInSubmit(e, username) {
    e.preventDefault();
    setAppState("auth_pending");

    const response = await axios.post(`${API_URL}/sign-in`, { username });
  }

  return (
    <Container className={`${styles.baseContainer} py-5`}>
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
                {loading ? (
                  <Loading />
                ) : appState === "registration_pending" ? (
                  <QRCodePanel qr={QRCode} />
                ) : appState === "registered" ? (
                  <div>REGISTERED!</div>
                ) : (
                  <SignUp onSubmit={onSignUpSubmit} />
                )}
              </Tab>
              <Tab
                eventKey="sign-in"
                title="Sign In"
                disabled={appState !== "initial" && tab !== "sign-in"}
              >
                {loading ? <Loading /> : <SignIn onSubmit={onSignInSubmit} />}
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
