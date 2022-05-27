import CustomSpinner from './CustomSpinner';
import styles from './QRCodePanel.module.css'
function QRCodePanel({ qr }) {
  return (
    <div>
    <h5>Pair with NovAuth Authenticator</h5>
    <p>Scan the QR Code below with the NovAuth Authenticator App to pair your device with your new account.</p>
      <img className={`${styles.qr} mb-4`} src={qr} />
      <CustomSpinner text={'Waiting for the authenticator to be paired'}/>
    </div>
  );
}

export default QRCodePanel;
