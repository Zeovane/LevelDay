export interface Task {
  id: number;
  title: string;
  tag: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  description?: string;
  column: number;
  totalColumns: number;
  day?: number;
  month?: number;
  year?: number;
  completed?: boolean;
}

export interface Annotation {
  id: number;
  time: string;
  text: string;
  tag?: string;
  startHour?: number;
  startMinute?: number;
  endHour?: number;
  endMinute?: number;
  description?: string;
  day?: number;
  month?: number;
  year?: number;
  isScheduled?: boolean;
}

export interface Note {
  id: number;
  title: string;
  annotations: Annotation[];
}

export type TabType = 'Perfil' | 'Agenda' | 'Loja';
export type PageType = 'perfil' | 'settings' | 'agenda' | 'notes' | 'noteDetail' | 'loja' | 'inventory';