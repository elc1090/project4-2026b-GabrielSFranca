'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({ placeholder = 'Buscar filmes na TMDB...' }: SearchBarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const initialQuery = searchParams.get('query') ?? '';
  const [term, setTerm] = useState(initialQuery);

//   useEffect(() => {
//     setTerm(searchParams.get('query') ?? '');
//   }, [searchParams]);

  function updateUrlQuery(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const cleaned = value.trim();

    if (cleaned) {
      params.set('query', cleaned);
    } else {
      params.delete('query');
    }

    const qs = params.toString();
    replace(qs ? `${pathname}?${qs}` : pathname);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const nextValue = e.target.value;
    setTerm(nextValue);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateUrlQuery(term);
  }

  function handleClear() {
    setTerm('');
    updateUrlQuery('');
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', maxWidth: 520 }}>
      <input
        type="search"
        value={term}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Buscar filmes"
        style={{ flex: 1, padding: '0.6rem 0.85rem', borderRadius: 6, border: '1px solid #ccc' }}
      />
      <button type="submit" style={{ padding: '0.6rem 1rem', borderRadius: 6, cursor: 'pointer' }}>
        Buscar
      </button>
      {term && (
        <button
          type="button"
          onClick={handleClear}
          style={{ padding: '0.6rem 0.75rem', borderRadius: 6, cursor: 'pointer' }}
        >
          Limpar
        </button>
      )}
    </form>
  );
}