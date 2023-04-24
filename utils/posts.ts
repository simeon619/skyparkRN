import { createRandomPosts } from './RandomPost';

type Author = {
  name: string;
  picture: string;
  id: string;
};

// type Comment = {
//   author: {
//     name: string;
//     id: string;
//   };
//   content: string;
//   timestamp: string;
// };

export type PostSchema = {
  keyId: string;
  id: string;
  author: Author;
  type: string;
  content: string;
  images?: string[];
  videos?: string;
  likes: number;
  timestamp: string;
};

export type PostList = {
  posts: PostSchema[];
};

export const POST_DATA: PostSchema[] = createRandomPosts(19);
