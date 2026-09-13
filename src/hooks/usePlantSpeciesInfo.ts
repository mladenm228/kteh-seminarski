import { useEffect, useState } from 'react';
import { fetchSpeciesByName, type IPerenualSpecies } from '../services/perenualApi';

interface PlantSpeciesInfoState {
  species: IPerenualSpecies | null;
  loading: boolean;
  error: string | null;
}

/** Dovlači dodatne podatke o vrsti biljke (fotografija, uslovi gajenja) sa Perenual API-ja. */
export function usePlantSpeciesInfo(plantName: string | undefined) {
  const [state, setState] = useState<PlantSpeciesInfoState>({
    species: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!plantName) {
      return;
    }

    let cancelled = false;
    setState({ species: null, loading: true, error: null });

    fetchSpeciesByName(plantName)
      .then((species) => {
        if (!cancelled) {
          setState({ species, loading: false, error: null });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ species: null, loading: false, error: 'Podaci trenutno nisu dostupni.' });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [plantName]);

  return state;
}
