// AuthContext.js
// 這只是模板 還要加東西！
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [userToken, setUserToken] = useState(null);

	const login = async (username, password) => {
		try {
			// Make a request to login API endpoint
			const response = await fetch('http://127.0.0.1:8000/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					grant_type: '',
					username,
					password,
					scope: '',
					client_id: '',
					client_secret: '',
				}),
			});

			// Check if the request was successful
			if (!response.ok) {
				// Handle unsuccessful login (e.g., show an error message)
				console.error('Login failed:', response.statusText);
				return;
			}

			// Parse the response as JSON
			const data = await response.json();

			// Set user info using setUserToken
			setUserToken({
				access_token: data.access_token,
				token_type: data.token_type,
				user_id: data.user_id, // Assuming your API returns user_id
			});
		} catch (error) {
			console.error('Error during login:', error);
		}
	};

	const logout = () => {
		// Implement logout logic and clear user info
		setUserToken(null);
	};

	return (
		<AuthContext.Provider value={{ userToken, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
