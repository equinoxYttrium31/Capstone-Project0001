import React from 'react';
import { cbc_logo } from '../../assets/Assets';
import './NavBar.css';

function NavBar({ onLoginClick }) {
  return (
    <div className='container'>
      <div className='navbar-contents'>
        <img src={cbc_logo} alt='CBC Hagonoy Logo' className='navbar_logo' />
        <ul className='nav-links'>
          <li>About Us</li>
          <li>Beliefs</li>
          <li>Ministries</li>
          <li>Bible</li>
        </ul>
        <div className='buttons-container'>
          <button className='sign-up' onClick={() => onLoginClick('signup')}>SIGN UP</button>
          <button className='login' onClick={() => onLoginClick('login')}>LOGIN</button>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
