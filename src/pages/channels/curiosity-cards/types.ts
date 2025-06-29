export interface CardData {
  creation: string[];
  conversation: string[];
  connection: string[];
}

export type CategoryType = keyof CardData;

export interface CategoryConfig {
  key: CategoryType;
  label: string;
}
