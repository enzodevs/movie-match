// Tipos relacionados a pessoas (atores, diretores, etc.)

export interface Person {
    id: number;
    name: string;
    profile_path: string | null;
    biography: string;
    birthday: string | null;
    place_of_birth: string | null;
    gender: number;
    known_for_department: string;
  }
  
  export interface PersonCredits {
    cast: PersonCast[];
    crew: PersonCrew[];
  }
  
  export interface PersonCast {
    id: number;
    title: string;
    poster_path: string | null;
    character: string;
    popularity: number;
  }
  
  export interface PersonCrew {
    id: number;
    title: string;
    poster_path: string | null;
    job: string;
    popularity: number;
  }
  
  export interface PersonState {
    // Cache
    personDetails: Record<number, Person>;
    personCredits: Record<number, PersonCredits>;
    personImages: Record<number, PersonImages>;
    
    // Loading estados
    isLoadingDetails: Record<number, boolean>;
    isLoadingCredits: Record<number, boolean>;
    isLoadingImages: Record<number, boolean>;
  }
  
  export interface PersonImages {
    profiles: PersonProfile[];
  }
  
  export interface PersonProfile {
    file_path: string;
    width: number;
    height: number;
  }