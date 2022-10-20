export interface PostList {
  [url: string]: PostData;
}
interface PositionList {
  position: [[number, number]];
}
export interface SearchSetting {
  query: string;
  categories: string[];
}

interface Attributes {
  content?: PositionList;
  id?: PositionList;
  title?: PositionList;
}
export interface MyMetadata {
  [query: string]: Attributes;
}
export interface PostData {
  title: string;
  date: string;
  url: string;
  categories: string[];
  content: string;
}
export interface QueryResult {
  url: string;
  date: string;
  categories: string[];
  title: string;
  titleMatchs: QueryMatchData[];
  content: string;
  contentMatchs: QueryMatchData[];
}
interface QueryMatchData {
  query: string;
  position: [[number, number]];
}

interface categoryInfo {
  [category: string]: {
    "background-color": string;
    color: string;
  };
}
