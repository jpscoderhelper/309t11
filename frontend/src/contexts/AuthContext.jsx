import React, { createContext, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// TODO: get the BACKEND_URL.

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

/*
 * This provider should export a `user` context state that is 
 * set (to non-null) when:
 *     1. a hard reload happens while a user is logged in.
 *     2. the user just logged in.
 * `user` should be set to null when:
 *     1. a hard reload happens when no users are logged in.
 *     2. the user just logged out.
 */
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);


    const fetchCurrentUser = async (token) => {
    try {
      const res = await fetch(`${BACKEND_URL}/user/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      setUser(null);
    }
  };

    
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }

    fetchCurrentUser(token);
  }, []);

    /*
     * Logout the currently authenticated user.
     *
     * @remarks This function will always navigate to "/".
     */
    const logout = () => {
        // TODO: complete me
        localStorage.removeItem('token');
        setUser(null);

        navigate("/");
    };

    /**
     * Login a user with their credentials.
     *
     * @remarks Upon success, navigates to "/profile". 
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @returns {string} - Upon failure, Returns an error message.
     */
    const login = async (username, password) => {
        // TODO: complete me
         try {
            const res = await fetch(`${BACKEND_URL}/login`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                return data.message || 'Login failed';
            }

            const token = data.token;
            localStorage.setItem('token', token);
            await fetchCurrentUser(token);
            navigate('/profile');
            } catch (err) {
            return err?.message || 'Network error while logging in';
          }
    };

    /**
     * Registers a new user. 
     * 
     * @remarks Upon success, navigates to "/".
     * @param {Object} userData - The data of the user to register.
     * @returns {string} - Upon failure, returns an error message.
     */
    const register = async (userData) => {
        // TODO: complete me
        try {
        const res = await fetch(`${BACKEND_URL}/register`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await res.json();

        if (!res.ok) {
            return data.message || 'Registration failed';
        }
        navigate('/success');
        } catch (err) {
        return 'Network error while registering';
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
        {children}
        </AuthContext.Provider>
    );
    };

    export const useAuth = () => {
    return useContext(AuthContext);
    };
