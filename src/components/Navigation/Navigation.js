import React from 'react'
import {NavLink} from 'react-router-dom'
import {Navbar} from 'react-materialize'
import classes from './Navigation.css'

const Navigation = (props) => {

  const cls = [classes.Navigation]
  cls.push('lighten-1')
  cls.push('teal')

  

  const triggerMenu = () => {
    const elem = document.querySelectorAll('.sidenav')
    const instance = window.M.Sidenav.init(elem)[0]
    instance.close()
  }

  let links = [
    { to: '/', name: 'Home', exact: true, click: triggerMenu}
  ]

  if (props.token) {
    links.push({ to: '/favorite', name: 'Favorite', exact: true, click: triggerMenu})
    links.push({ to: '/logout', name: 'Logout', exact: true, click: triggerMenu})
  } else {
    links.push({ to: '/login', name: 'Login', exact: true, click: triggerMenu})
  }

	return (
    <Navbar 
      alignLinks="left"
      className={cls.join(' ')}
      >
      {links.map((link, index) => {
        return(
          <NavLink 
            to={link.to} 
            key={index} 
            exact={link.exact}
            onClick={link.click}
          >
          {link.name}
          </NavLink>
        )
      })}
    </Navbar>
	)
}

export default Navigation
