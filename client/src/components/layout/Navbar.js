import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({auth, logout}) => {

  const authLinks = (
    <ul>
      <li>
        <a onClick={logout} href="/login">
          <i className = 'fas fa-sign-out-alt'/>{' '}
          <span className='hide-sm'>Logout</span>
        </a>
        </li>
    </ul>
  )

  const guestLinks = (
    <ul>
      <li><a href="profiles.html">Developers</a></li>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </ul>
  )


    return (
        <nav className="navbar bg-dark">
      <h1>
        <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
      </h1>
      {!auth.loading && (<>{auth.isAuthenticated? authLinks : guestLinks}</>)}
    </nav>
    )
}

Navbar.Prototypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state=>({
  auth:state.auth
})

export default connect(mapStateToProps, {logout})(Navbar)