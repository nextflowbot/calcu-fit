import { User } from '../types';

const USERS_KEY = 'calcufit_users';
const CURRENT_USER_KEY = 'calcufit_current_user';

export const storage = {
  getUsers: (): User[] => {
    try {
      const json = localStorage.getItem(USERS_KEY);
      return json ? JSON.parse(json) : [];
    } catch (e) {
      return [];
    }
  },

  saveUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getCurrentUser: (): User | null => {
    try {
      const json = localStorage.getItem(CURRENT_USER_KEY);
      return json ? JSON.parse(json) : null;
    } catch (e) {
      return null;
    }
  },

  saveCurrentUser: (user: User) => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },

  removeCurrentUser: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  updateUserInStorage: (updatedUser: User) => {
    // Update current session
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    
    // Update database
    const users = storage.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      storage.saveUsers(users);
    }
  }
};