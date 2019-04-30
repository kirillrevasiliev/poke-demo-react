import React from 'react';
import Navigation from '../components/Navigation/Navigation';

const Layout = ({ token, children }) => (
  <React.Fragment>
    <Navigation token={token} />
    <div className="container">
      {children}
    </div>
  </React.Fragment>
);

export default Layout;
