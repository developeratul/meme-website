export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  portfolio: string;
  time: number;
  memes: Meme[];
  photoUrl: string;
  photoId: string;
}

interface Comment {
  _id: string;
  text: string;
  time: number;
  user: User;
  meme: Meme;
}

export interface Meme {
  _id: string;
  title: string;
  photoUrl: string;
  photoId: string;
  author: User;
  likes: string[];
  comments: Comment[];
  time: number;
}
