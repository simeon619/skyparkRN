import { createRandomPosts } from './RandomPost';

type Author = {
  name: string;
  picture: string;
};

type Comment = {
  author: {
    name: string;
    id: string;
  };
  content: string;
  timestamp: string;
};

type Image = {
  url: string;
  caption: string;
};

export type PostSchema = {
  id: string;
  author: Author;
  type: string;
  content: string;
  images?: string[];
  videos?: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
};

export type PostList = {
  posts: PostSchema[];
};

export const POST_DATA: PostSchema[] = createRandomPosts(19);
export const POST_DATA2: PostSchema[] = createRandomPosts(19);
