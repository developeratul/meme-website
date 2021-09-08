export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  portfolio: string;
  time: number;
  memes: any[];
  photoUrl: string;
}

export interface Meme {
  _id: string;
  title: string;
  photoUrl: string;
  photoId: string;
  author: User;
  likes: string[];
  time: number;
}
