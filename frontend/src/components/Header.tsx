import styles from "./Header.module.css";
function Header() {
  return (
    <div className="text-center">
      <img src="logo512.png" className={`${styles.logo} mb-3`} alt="logo" />
      <h1>NovAuth Authentication Example</h1>
      <p className="lead">
        Push authentication made easy. Test it by yourself.
      </p>
    </div>
  );
}

export default Header;
