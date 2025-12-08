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

export interface Recipe {
  id: string;
  title: string;
  kcal: number;
  tag: string;
  image: string;
}

export enum Screen {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  HOME = 'HOME',
  TRACKER = 'TRACKER',
  RECIPES = 'RECIPES',
  PROFILE = 'PROFILE',
}