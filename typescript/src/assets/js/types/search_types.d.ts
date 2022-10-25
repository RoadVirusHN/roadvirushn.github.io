export interface PostList {
  [path: string]: PostData;
}
interface PositionList {
  position: [[number, number]];
}
export interface SearchSetting {
  query: string;
  tags: string[];
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
  tags: string[];
  content: string;
}
export interface QueryResult {
  url: string;
  date: string;
  tags: string[];
  title: string;
  titleMatchs: QueryMatchData[];
  content: string;
  contentMatchs: QueryMatchData[];
}
interface QueryMatchData {
  query: string;
  position: [[number, number]];
}

interface TagInfo {
  [tag: string]: {
    "background-color": string;
    color: string;
  };
}
interface CategoryInfo {
  categories: { [categories: string]: CategoryInfo };
  posts: string[];
}
