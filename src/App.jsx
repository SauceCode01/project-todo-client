import React, { useEffect, useRef, useState } from "react";

import app from "./initFirebase";
import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	connectAuthEmulator,
	signOut,
	onAuthStateChanged,
	getAdditionalUserInfo,
} from "firebase/auth";

const fetchData = async () => {
	const url = "https://project-todo-api.onrender.com/api/users";
	console.log("fetching from: ", url);
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const json = await response.json();
		console.log("this is the result", json);
	} catch (error) {
		console.error(error.message);
	}

	console.log("fetching complete");
};


const getUserData = async (uid) => {

	const url = `http://localhost:5000/api/users/getUserData/${uid}`;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const json = await response.json();
		console.log("this is the result", json);
		return json
	} catch (error) {
		console.error(error.message);
	}
	return {}
}

const App = () => {
	const [user, setUser] = useState(null);
	const [loggedIn, setLoggedIn] = useState(false);

	// Initialize Firebase Authentication and get a reference to the service
	const auth = getAuth(app);
	// connectAuthEmulator(auth, "http://localhost:9099");
	const provider = new GoogleAuthProvider();

	const handleSignUp = () => {
		signInWithPopup(auth, provider)
			.then((result) => {
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
				const signedInuser = result.user;
				const additionalInfo = getAdditionalUserInfo(result)
				console.log("login success", signedInuser, token, additionalInfo);
				const newUser = additionalInfo.isNewUser
				if (newUser) console.log("WELCOME NEW USER!")
				else console.log("good to see you again")
				
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				// const email = error.customData.email;
				const credential = GoogleAuthProvider.credentialFromError(error);
				console.log("An error has occured", errorCode, errorMessage, credential)
			});
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleCheckUser = () => {
		console.log(auth.currentUser);
	};

	const handleLogout = () => {
		signOut(auth);
	};

	const monitorState = async () => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setLoggedIn(true);
				setUser(user)
			} else {
				setLoggedIn(false);
				setUser(null)
			}
		});
	};
	monitorState();

	const textref = useRef(null);
	//http://localhost:5000/api/users/addUserData/uid?data=data
	const  handleSendData = async () => {
		console.log("this is the user", user)
		console.log("uid", user.uid)
		const url = `http://localhost:5000/api/users/addUserData/${user.uid}?data="my data ${textref.current.value}"`;
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}

			console.log("fetch success")
		} catch (error) {
			console.error(error.message);
		}

		console.log("fetching complete");
	}
 
	const handleLogData = async () => {
		const uid = user.uid
		const data = await  getUserData(uid);
		console.log(data)
	}

	return (
		<>
			<div>App</div>
			{loggedIn ? (
				<>
				<img src={user.photoURL}></img>
					<div>YOU ARE SIGNED IN</div>
					<div>{user.displayName}</div>
					<div>{user.email}</div>
					<div>{user.uid}</div>

					<button onClick={handleLogout}>logout</button>

					<input ref={textref} type="textarea"></input>

					<button onClick={handleSendData}>send data</button>
					<button onClick={handleLogData}>log data</button>
				</>
			) : (
				<button onClick={handleSignUp}>CLICK TO POPUP</button>
			)}
			<button onClick={handleCheckUser}>print current user</button>
		</>
	);
};

export default App;
