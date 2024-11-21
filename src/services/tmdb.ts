import axios from 'axios';
import { differenceInYears, parse } from 'date-fns';
import { Actor, Movie } from '../types/actor';

const API_KEY = '3f2af1df74075e194bc154e7f3233e60';
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

const MAX_PAGES = 50;

export const fetchPopularActors = async (page = 1) => {
  try {
    const { data } = await api.get('/person/popular', { params: { page } });
    return data.results.filter((actor: any) => actor.profile_path && actor.popularity > 2);
  } catch (error) {
    throw new Error('Failed to fetch popular actors');
  }
};

export const fetchActorPool = async (pageCount: number = 3): Promise<any[]> => {
  try {
    const pages = new Set<number>();
    while (pages.size < pageCount) {
      pages.add(Math.floor(Math.random() * MAX_PAGES) + 1);
    }

    const requests = Array.from(pages).map(page => fetchPopularActors(page));
    const responses = await Promise.all(requests);
    return responses.flat();
  } catch (error) {
    throw new Error('Failed to fetch actor pool');
  }
};

const fetchActorMovies = async (id: number): Promise<Movie[]> => {
  try {
    const { data } = await api.get(`/person/${id}/movie_credits`);
    return data.cast
      .filter((movie: any) => movie.release_date && movie.character)
      .sort((a: any, b: any) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
      .slice(0, 5)
      .map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        character: movie.character,
      }));
  } catch (error) {
    return [];
  }
};

export const fetchActorDetails = async (id: number): Promise<Actor | null> => {
  try {
    const [{ data }, movies] = await Promise.all([
      api.get(`/person/${id}`),
      fetchActorMovies(id),
    ]);
    
    if (!data.birthday || !data.profile_path) return null;

    const birthDate = parse(data.birthday, 'yyyy-MM-dd', new Date());
    const deathDate = data.deathday ? parse(data.deathday, 'yyyy-MM-dd', new Date()) : null;
    
    // Calculate age at death if applicable, otherwise current age
    const age = deathDate 
      ? differenceInYears(deathDate, birthDate)
      : differenceInYears(new Date(), birthDate);

    if (age < 1 || !data.profile_path) return null;

    return {
      id: data.id,
      name: data.name,
      profile_path: data.profile_path,
      birthday: data.birthday,
      deathday: data.deathday || undefined,
      age,
      movies,
    };
  } catch (error) {
    return null;
  }
};