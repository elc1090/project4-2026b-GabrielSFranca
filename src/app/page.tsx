import Link from 'next/link';
import { Suspense } from 'react';
import { SearchBar } from '@/components/searchbar/SearchBar';
import { obterURLPoster, pesquisaFilmes } from "./lib/services/tmdb"
interface HomePageProps {
  searchParams: Promise<{ query?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.query?.trim() ?? '';
  const movies = query ? await pesquisaFilmes(query) : [];

  return (
    <main style={{ maxWidth: 960, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Explorar Filmes</h1>
      <p>Busque títulos na TMDB e acesse os detalhes para salvar na sua biblioteca.</p>

      <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        <Suspense fallback={<p>Carregando busca...</p>}>
          <SearchBar />
        </Suspense>
      </div>

      {!query ? (
        <p style={{ color: '#555' }}>Digite o nome de um filme para começar a busca.</p>
      ) : movies.length === 0 ? (
        <p style={{ color: '#555' }}>
          Nenhum filme encontrado para <strong>&ldquo;{query}&rdquo;</strong>.
        </p>
      ) : (
        <section
          aria-label="Resultados da busca"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {movies.map((movie) => {
            const poster = obterURLPoster(movie.poster_path);
            const year = movie.release_date ? movie.release_date.slice(0, 4) : '—';

            return (
              <Link
                key={movie.id}
                href={`/filmes/${movie.id}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  border: '1px solid #e2e2e2',
                  borderRadius: 8,
                  padding: '0.75rem',
                }}
              >
                {poster ? (
                  <img
                    src={poster}
                    alt={movie.title}
                    style={{ width: '100%', aspectRatio: '2 / 3', objectFit: 'cover', borderRadius: 6 }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '2 / 3',
                      borderRadius: 6,
                      background: '#f0f0f0',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '0.85rem',
                      color: '#666',
                    }}
                  >
                    Sem pôster
                  </div>
                )}

                <strong style={{ fontSize: '1rem' }}>{movie.title}</strong>
                <span style={{ fontSize: '0.85rem', color: '#666' }}>
                   {year} • ★{/* {movie.vote_avarage.toFixed(1)} */}
                </span>
              </Link>
            );
          })}
        </section>
      )}
    </main>
  );
}



// import { alterarEstado, listarTarefas } from './actions/tarefa';
// import { TarefaItem  } from '@/components/tarefaitem/TarefaItem';

// export default async function HomePage() {
//   const tarefas = await listarTarefas();

//   return (
//     <main style={{ maxWidth: 640, margin: '2rem auto', padding: '0 1rem' }}>
//       <h1>Minhas Tarefas</h1>
//       <p>Exemplo full stack com Next.js, React, TypeScript e Server Actions.</p>

//       <TarefaItem />

//       <ul style={{ listStyle: 'none', padding: 0, marginTop: '1.5rem', display: 'grid', gap: '0.5rem' }}>
//         {tarefas.map((tarefa) => {
//           const toggleAction = alterarEstado.bind(null, tarefa.id);

//           return (
//             <li
//               key={tarefa.id}
//               style={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 padding: '0.75rem',
//                 border: '1px solid #ddd',
//                 borderRadius: 6,
//               }}
//             >
//               <span style={{ textDecoration: tarefa.concluida ? 'line-through' : 'none' }}>
//                 {tarefa.titulo}
//               </span>

//               <form action={toggleAction}>
//                 <button type="submit" style={{ cursor: 'pointer' }}>
//                   {tarefa.concluida ? 'Reabrir' : 'Concluir'}
//                 </button>
//               </form>
//             </li>
//           );
//         })}
//       </ul>
//     </main>
//   );
// }