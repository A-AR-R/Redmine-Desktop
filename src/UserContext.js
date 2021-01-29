import React from "react";

export const mainContext = React.createContext();

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
		const serializedState = JSON.stringify(state);
		localStorage.setItem(key, serializedState);
	} catch { }
};

export const GetCostomSetState = (setState) => {
	return (state) => {
		saveState(state)
		setState(state)
	}
}