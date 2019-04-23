import React, { useEffect, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Row, Col, Preloader } from 'react-materialize'
import PokeCard from '../PokeCard/PokeCard'
import RootStore from '../../store/rootStore'
import classes from './PokeFavorite.css';

const PokeFavorite = () => {

	const {store} = useContext(RootStore)
	
	useEffect(() => {
		store.fetchPokeFavorite()
	}, [])

	return (
		<Row>
			<Col s={12} m={12}>
				<h3>Poke-Favorite</h3>
				<Row>
					{store.pokeList ? store.pokeList.map((poke, index) => {
						return (<PokeCard pokemon={poke} url={poke.url} index={index} key={poke.name} />)
					}) : null
					}
					{store.state === 'pending'
						? <Col s={12}>
							<div className={classes.cardContainer}>
								<Preloader size="big" flashing />
							</div>
						</Col>
						: null
					}
					{store.state === 'empty' && !store.pokeList.length
						? <div className={classes.cardContainer}>
							<h3>Nothing to show</h3>
						</div>
						: null
					}
				</Row>
			</Col>
		</Row>
	)
}

export default observer(PokeFavorite)