import { TagInfo, CategoryInfo, ArticleList } from "./search_types";

declare global {
  interface Window {
    searchIndex: lunr.Index;
  }
}

export type NewWindow = Window &
  typeof globalThis & {
    store: ArticleList;
    tags: TagInfo;
    categories: CategoryInfo;
  };
