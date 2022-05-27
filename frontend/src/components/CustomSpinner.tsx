import { Spinner } from "react-bootstrap";

function CustomSpinner({ text }) {
  return (
    <div className='text-center'>
      <Spinner className="mb-3" variant="primary" animation="grow" />
      <p className="text-muted">{text}</p>
    </div>
  );
}

export default CustomSpinner;
