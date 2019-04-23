import React from 'react'
import Navigation from '../components/Navigation/Navigation'

const Layout = (props) => {
	
	return (
		<div>
      <Navigation token={props.token}/>
      <div className="container">
				{props.children}
      </div>
		</div>
	)
}

export default Layout