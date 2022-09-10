export interface SearchData {
  [id: string]: { title: string; url: string; content: string };
}
export type NewWindow = Window & typeof globalThis & { store: SearchData };
interface Position {
  position: [[number, number]];
}
interface Attributes {
  content: Position;
  id: Position;
  title: Position;
}
export interface MyMetadata {
  [query: string]: Attributes;
}
