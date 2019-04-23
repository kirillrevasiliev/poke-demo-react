import React, {useState, useContext} from 'react'
import RootStore from '../../store/rootStore'
import { Row, Col, TextInput} from 'react-materialize'
import classes from './AuthPage.css'
import Button from 'react-materialize/lib/Button';

export default function AuthPage(props) {
	
	const {auth, store} = useContext(RootStore)
	
	const [state, setState] = useState({
		isFormValid: false,
		formControls: {
			email: {
				value: '',
				valid: false,
				validation: {
					required: true,
					email: true
				}
			},
			password: {
				value: '',
				valid: false,
				validation: {
					required: true,
					minLength: 6
				}
			}
		}
	})

	const loginHandler = async () => { 
		const resp = await auth.authHandler(
			state.formControls.email.value,
			state.formControls.password.value,
			true
			)
		if (resp) {
			store.setUid(auth.uid)
			store.fetchPokeList()
			props.history.push('/')
		}
	}
	const registerHandler = () => {
		const resp = auth.authHandler(
			state.formControls.email.value,
			state.formControls.password.value,
			false
		)
		if (resp) {
			props.history.push('/')
		}
	}

	const validateControl = (value, validation) => {
		if (!validation) {
			return true
		}
		let isValid = true

		if (validation.required) {
			isValid = value.trim() !== '' && isValid
		}
		if (validation.email) {
			// eslint-disable-next-line
			const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			return re.test(String(value).toLowerCase()) && isValid
		}
		if (validation.minLength) {
			isValid = value.length >= validation.minLength && isValid
		}

		return isValid
	}

	const onChangeHandler = (event, controlName) => {
		const formControls = { ...state.formControls}
		let control = { ...formControls[controlName]}
		
		control.value = event.target.value
		control.valid = validateControl(control.value, control.validation)
		
		formControls[controlName] = control
		let isFormValid = true
		Object.keys(formControls).forEach(name => {
			isFormValid = formControls[name].valid && isFormValid
		})
		setState({isFormValid, formControls})
	}

	const onBlureHandler = (event, controlName)=> {
		const control = { ...state.formControls[controlName] }
		if (control.valid) {
			event.target.classList.remove('invalid')
			event.target.classList.add('valid')
		} else {
			event.target.classList.remove('valid')
			event.target.classList.add('invalid')
		}
	}

	return (
		<Row>
			<Col m={8} s={12} offset={'m2'}>
				<div className={classes.formContainer} style={{}}>
					<TextInput 
						label="Email"
						icon="email"
						email
						error="Enter correct email"
						onBlur={event => onBlureHandler(event, 'email')}
						onChange={(event) => onChangeHandler(event, 'email')}
					/>
					<TextInput 
						label="Password"
						icon="create"
						password
						error="Password must be at least 6 characters"
						onBlur={event => onBlureHandler(event, 'password')}
						onChange={(event) => onChangeHandler(event, 'password')}
					/>
					<p style={{marginLeft:'60px'}}>
						<Button 
							onClick={loginHandler} 
							disabled={!state.isFormValid}
							style={{marginRight: '20px'}}
							>Login</Button>
						<Button 
							onClick={registerHandler} 
							disabled={!state.isFormValid}
							>Register</Button>
					</p>
				</div>
			</Col>
		</Row>
	)
}
