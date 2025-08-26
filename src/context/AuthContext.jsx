import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const { data } = await axios.get('/api/users/profile');
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('/api/users/auth', { email, password },{
  withCredentials: true,
});
    setUser(data);
    return data;
  };

  const register = async (userData) => {
    const { data } = await axios.post('/api/users', userData);
    setUser(data); 
    return data;
  };

  const logout = async () => {
    await axios.post('/api/users/logout');
    setUser(null);
  };

  const updateProfile = async (userData) => {
    const { data } = await axios.put('/api/users/profile', userData);
    setUser(data);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;