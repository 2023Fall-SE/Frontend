// AuthContext.js
// 這只是模板 還要加東西！
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [userInfo, setUserInfo] = useState(null);

	const login = async (username, password) => {
		// Implement your login logic and fetch user info
		// Set user info using setUserInfo
	};

	const logout = () => {
		// Implement logout logic and clear user info
		setUserInfo(null);
	};

	return (
		<AuthContext.Provider value={{ userInfo, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
