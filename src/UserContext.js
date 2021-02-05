import React from "react";

export const mainContext = React.createContext({
	isLoggedIn: false,
	serverName: '185.8.172.29:8084',
	token_id: '2875b029a6a87c9b3b7f04fd207a9b8386c78172',
	user_id: null,
	sideBar: false,
	showPopup: false,
	agileBoard: {
		data: null
	},
	inProgress: [],
});

export default mainContext

const key = 'mainState'

export const loadState = () => {
	try {
		const serializedState = localStorage.getItem(key);
		if (serializedState === null) {
			return undefined;
		}
		return JSON.parse(serializedState);
	} catch (err) {
		return undefined;
	}
};

export const saveState = (state) => {
	try {
		console.log(state)
		const serializedState = JSON.stringify(state);
		localStorage.setItem(key, serializedState);
	} catch { }
};

export const GetCustomSetState = (setState) => {
	return (state) => {
		saveState(state)
		console.log("here")
		console.log(setState)
		setState(state)
	}
}