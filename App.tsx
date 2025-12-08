import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, Screen } from './types';
import { storage } from './services/storage';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { Home } from './components/Home';
import { Tracker } from './components/Tracker';
import { Profile } from './components/Profile';
import { Layout } from './components/Layout';

// Context for global state
interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  screen: Screen;
  setScreen: (screen: Screen) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [screen, setScreen] = useState<Screen>(Screen.LOGIN);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setScreen(Screen.HOME);
    }
    setLoading(false);
  }, []);

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    storage.updateUserInStorage(updatedUser);
  };

  const logout = () => {
    storage.removeCurrentUser();
    setUser(null);
    setScreen(Screen.LOGIN);
  };

  if (loading) return null;

  return (
    <AppContext.Provider value={{ user, setUser, screen, setScreen, updateUser, logout }}>
      <div className="min-h-screen bg-background font-sans text-slate-800 selection:bg-primary selection:text-white">
        {screen === Screen.LOGIN && <Login />}
        {screen === Screen.SIGNUP && <SignUp />}
        
        {user && screen !== Screen.LOGIN && screen !== Screen.SIGNUP && (
          <Layout>
            {screen === Screen.HOME && <Home />}
            {screen === Screen.TRACKER && <Tracker />}
            {screen === Screen.PROFILE && <Profile />}
          </Layout>
        )}
      </div>
    </AppContext.Provider>
  );
}