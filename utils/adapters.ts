import { PersonCast, PersonCrew } from '~/types/person';

/**
 * Adapta um item de elenco para uso no componente PersonFilmography
 * @param cast Item do elenco
 * @returns Item adaptado com poster_path garantido como string
 */
export function adaptCastForPersonFilmography(cast: PersonCast) {
  return {
    ...cast,
    poster_path: cast.poster_path || '' // Garantir que nunca é null
  };
}

/**
 * Adapta um item de equipe para uso no componente PersonFilmography
 * @param crew Item da equipe
 * @returns Item adaptado com poster_path garantido como string
 */
export function adaptCrewForPersonFilmography(crew: PersonCrew) {
  return {
    ...crew,
    poster_path: crew.poster_path || '' // Garantir que nunca é null
  };
}