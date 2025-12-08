import React, { useState } from 'react';
import { storage } from '../services/storage';
import { useApp } from '../App';
import { Screen } from '../types';

export const Login: React.FC = () => {
  const { setUser, setScreen } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Preencha e-mail e senha.');
      return;
    }

    const users = storage.getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      setError('E-mail ou senha inválidos.');
      return;
    }

    storage.saveCurrentUser(user);
    setUser(user);
    setScreen(Screen.HOME);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-2">CalcuFit</h1>
          <p className="text-gray-500">Sua saúde, sob controle.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="E-mail"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Senha"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primaryDark text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg shadow-primary/30"
          >
            Entrar
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setScreen(Screen.SIGNUP)}
            className="text-primary hover:text-primaryDark font-medium text-sm"
          >
            Ainda não tem conta? <span className="underline">Cadastre-se</span>
          </button>
        </div>
      </div>
    </div>
  );
};