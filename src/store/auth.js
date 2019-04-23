import { decorate, observable } from 'mobx'
import axios from '../axios/axios-poke'

export class Auth {
	token = null
	uid = null
	authHandler = async (email, password, isLogin) => {
		const authData = {
			email,
			password,
			returnSecureToken: true
		}
		let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyADtdC00yeLJUtRA8pBPrlzE60xXsrRh1c'
		if (isLogin) {
			url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyADtdC00yeLJUtRA8pBPrlzE60xXsrRh1c'
		}
		try {
			const response = await axios.post(url, authData)
			const data = response.data
			const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000)

			localStorage.setItem('token', data.idToken)
			localStorage.setItem('userId', data.localId)
			localStorage.setItem('expirationDate', expirationDate)
			
			this.authSuccess(data.idToken, data.localId)
			this.autoLogout(data.expiresIn)
			return true
		} catch (error) {
			this.showMessage(error.response.data.error.message)
			return false
		}
	}
	
	autoLogout(time) {
		setTimeout(() => {
			this.logout()
		}, time * 1000)
	}

	logout() {
		localStorage.removeItem('token')
		localStorage.removeItem('userId')
		localStorage.removeItem('expirationDate')
		this.token = null
		this.uid = null
	}

	autoLogin() {
		const token = localStorage.getItem('userId')
		const uid = localStorage.getItem('userId')
		if (!token) {
			this.logout()
		} else {
			const expirationDate = new Date(localStorage.getItem('expirationDate'))
			if (expirationDate <= new Date()) {
				this.logout()
			} else {
				this.authSuccess(token, uid)
				this.autoLogout((expirationDate.getTime() - new Date().getTime()) / 1000)
			}
		}
	}

	authSuccess(token, uid) {
		this.token = token
		this.uid = uid
	}

	showMessage = message => {
		window.M.toast({
			classes: 'red',
			html: message
		})
	}

}

decorate(Auth, {
	auth: observable,
	uid: observable
})

export default Auth
