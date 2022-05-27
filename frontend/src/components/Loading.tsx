import { Col, Row, Spinner } from "react-bootstrap";
import CustomSpinner from "./CustomSpinner";
import styles from "./Loading.module.css";

function Loading() {
  return (
    <Row
      className={`${styles.spinnerContainer} justify-content-center align-items-center`}
    >
      <Col>
        <CustomSpinner text={"Loading"} />
      </Col>
    </Row>
  );
}

export default Loading;
