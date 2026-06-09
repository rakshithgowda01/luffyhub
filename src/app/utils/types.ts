export interface Program {
  id: number;
  title: string;
  shortTitle: string;
  code: string;
  explanation: string;
  output: string;
}

export const BUSY_MESSAGE =
  "luffy's kinda busy and its a draggggg to complete this fully so wait till its done";

export const ADMIN_USERNAME = "luffy";
export const ADMIN_PASSWORD = "luffy";

export type Section = "home" | "notes" | "lab programs" | "important";
