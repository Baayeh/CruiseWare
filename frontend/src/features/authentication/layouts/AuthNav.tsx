import { Link } from 'react-router-dom';

/**
 * Renders the authentication navigation component.
 *
 * @return {JSX.Element} The rendered authentication navigation component.
 */
const AuthNav = () => {
  return (
    <nav className="auth-nav">
      <h1>
        <span>Cruise</span>Ware
      </h1>
      <Link to="/">Home</Link>
    </nav>
  );
};
export default AuthNav;
