import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../services/storage';
import { useApp } from '../App';
import { Screen, User } from '../types';

export const SignUp: React.FC = () => {
  const { setUser, setScreen } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPass) {
      setError('Preencha todos os campos.');
      return;
    }
    if (password !== confirmPass) {
      setError('As senhas não coincidem.');
      return;
    }

    const users = storage.getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setError('E-mail já cadastrado.');
      return;
    }

    const newUser: User = {
      id: uuidv4(),
      name,
      email,
      password,
      settings: {
        calorieGoal: 2000,
        waterGoal: 2000,
      },
      records: {
        food: [],
        water: [],
      },
    };

    users.push(newUser);
    storage.saveUsers(users);
    storage.saveCurrentUser(newUser);
    setUser(newUser);
    setScreen(Screen.HOME);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-primary mb-8 text-center">Criar conta</h1>

        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            placeholder="Nome"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="E-mail"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirmar senha"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primaryDark text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg shadow-primary/30 mt-4"
          >
            Cadastrar
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setScreen(Screen.LOGIN)}
            className="text-primary hover:text-primaryDark font-medium text-sm"
          >
            Já tem conta? <span className="underline">Entrar</span>
          </button>
        </div>
      </div>
    </div>
  );
};