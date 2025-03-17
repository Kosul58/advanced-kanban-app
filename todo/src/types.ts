export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
  date: string;
};

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
  priority: string;
};

export type Day = {
  date: number; // The date of the day (1-31)
  isActive: boolean; // Whether the day is the currently active day
  isInactive: boolean; // Whether the day is part of the previous or next month
};

export type Days = Day[];
