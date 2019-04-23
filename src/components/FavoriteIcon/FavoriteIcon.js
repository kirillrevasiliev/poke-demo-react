import React, {useContext} from 'react'
import {Icon} from 'react-materialize'
import classes from './FavoriteIcon.css'
import { observer } from 'mobx-react-lite'
import RootStore from '../../store/rootStore'

const FavoriteIcon = (props) => {

	const {store} = useContext(RootStore)
	let check = false

	const addToFavorite = (id) => {
		if (!check) {
			check = true
			if (!store.toggleToFavorite(id)) {
				check = false
			}
		}
	}

	const renderHtml = () => {
		if (props.fav) {
			return (
			<div className={classes.favoritConent} >
				<span>
						<Icon className={props.cls}>{props.cls}</Icon>
				</span>
			</div >
		)
		} else {
			return (
				<div className={classes.favoritConent} >
					<span onClick={() => addToFavorite(props.id)}>
						{props.cls === 'delete'
							? <Icon className={props.cls}>{props.cls}</Icon>
							: <Icon>{props.cls}</Icon>
						}
						
					</span>
				</div >
			)
		}
	}
	
	return renderHtml()	
}

export default observer(FavoriteIcon)