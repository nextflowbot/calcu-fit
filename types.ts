export interface FoodRecord {
  id: string;
  name: string;
  kcal: number;
  carbs: number;
  protein: number;
  fat: number;
  date: string;
}

export interface WaterRecord {
  id: string;
  ml: number;
  date: string;
}

export interface UserSettings {
  calorieGoal: number;
  waterGoal: number;
}

export interface UserRecords {
  food: FoodRecord[];
  water: WaterRecord[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  settings: UserSettings;
  records: UserRecords;
}

// Recipe interface removed as feature is replaced

export enum Screen {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  HOME = 'HOME',
  TRACKER = 'TRACKER',
  REPORTS = 'REPORTS', // Replaces RECIPES
  PROFILE = 'PROFILE',
}