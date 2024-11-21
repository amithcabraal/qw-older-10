export interface Movie {
  id: number;
  title: string;
  release_date: string;
  character: string;
}

export interface Actor {
  id: number;
  name: string;
  profile_path: string;
  birthday: string;
  deathday?: string;
  age: number;
  movies?: Movie[];
}