import React, { useContext} from 'react'
import { Redirect } from "react-router-dom"
import RootStore from '../../store/rootStore'

export default function Logout() {
	const {auth, store} = useContext(RootStore)
	auth.logout()
	store.fetchPokeList()

	return <Redirect to={'/'} />
}