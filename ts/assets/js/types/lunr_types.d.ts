import { TagInfo, CategoryInfo, PostList } from "./search_types";

declare global {
  interface Window {
    searchIndex: lunr.Index;
  }
}

export type NewWindow = Window &
  typeof globalThis & {
    store: PostList;
    tags: TagInfo;
    categories: CategoryInfo;
  };
