export const BASE_URL="https://api.themoviedb.org/3";
export const TOKEN=process.env.TMDB_ACCESS_TOKEN;
const IDIOMA_PORTUGUES_PADRAO="pt-BR";
const filmePTBR= "https://api.themoviedb.org/3/movie/550?language=pt-BR";
const appendToResponse=  "https://api.themoviedb.org/3/movie/550?append_to_respose=videos,images,credits";

// Filmes
// Series= trocar movies por tv
const movies="https://api.themoviedb.org/3/movie/popular";

export const IMAGEM_URL="https://image.tmdb.org/t/p/"


// Parametros importantes
// query=texto pesquisado 
// language=idioma de resposta

export type Genero={
  id: number;
  name: string;
}

export type MembroElenco={
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

// dados do filme na The Movie DataBase API
export type TMovieResponse={
  id: number; // id
  title: string; // titulo
  release_date?: string | null; // data lancamento
  poster_path: string; // caminho da imagem do poster
}

export type TMovieDetails = TMovieResponse & {
  original_title: string;
  original_language: string;
  overview: string; // sinopse
  vote_average: number; // avaliacao media nota 1-10
  runtime?: number | null; // tempo de filme em horas
  adult: boolean;
  genres: Genero[];
  credits?: {
    cast: MembroElenco[];
  }
}

export type SearchResponse={
  results: TMovieResponse[];
  page: number;
  total_pages: number;
  total_results: number;
}

type Resenha={
    titulo: string;
    conteudo: string;
}

type Estado={
    tMovieID: number;
    fav: boolean;
    assistido: boolean;
    nota?: number | null;
    avaliado: boolean;
    resenha: Resenha;
}


//   tmdb_id: tmdbID; // id
//   overview?: string; // sinopse
//     vote_average: number | null; // avaliacao media nota 1-10
//       // backdrop_path?: string | null; // nao sei oq eh
//   runtime?: number | null; // tempo de filme em horas


async function testPesquisaFilmes(query: string) {
  const response = await fetch(
    BASE_URL +
      new URLSearchParams({
        query,
        language: "pt-BR",
      }),
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        accept: "application/json",
      },
    },
  );
  return response;
}


function obterTokenAcessoAPI(): string{
  const TOKEN_ACESSO=process.env.TMDB_ACCESS_TOKEN;
  if(!TOKEN_ACESSO){
    throw new Error("Variavel de ambiente de token nao configurada");
  }
  return TOKEN_ACESSO;
}

export async function pesquisaFilmes(term: string){
  const termoLimpo=term.trim();

  if(!termoLimpo){
    return [];
  }

  const TOKEN=obterTokenAcessoAPI();

  const url=new URL(`${BASE_URL}/search/movie`)
  url.searchParams.set("query", termoLimpo)
  url.searchParams.set("language", IDIOMA_PORTUGUES_PADRAO)

  const resposta=await fetch(url.toString(), {
    headers:{
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/json"
    },
    next: { revalidate: 300 }, // Cache de 5 minutos para buscas repetidas
  })

  if(!resposta.ok){
    throw new Error(
      `Falha na busca de filmes na TMDB (HTTPStatus ${resposta.status}`
    );
  }

  const dados: SearchResponse=await resposta.json()
  return dados.results
}

export function obterURLPoster(
  caminho: string | null, 
  tamanho="w342"
): string | null {
  if(!caminho) { return null; }

  return `${IMAGEM_URL}${tamanho}${caminho}`; 
}