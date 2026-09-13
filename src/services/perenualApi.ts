const PERENUAL_BASE_URL = 'https://perenual.com/api/v2';
const API_KEY = import.meta.env.VITE_PERENUAL_API_KEY as string | undefined;

export interface IPerenualSpecies {
  id: number;
  commonName: string;
  scientificName: string;
  imageUrl: string | null;
  sunlight: string[];
  watering: string;
  cycle: string;
  maintenance: string | null;
}

interface PerenualListResponse {
  data: Array<{
    id: number;
    common_name: string;
    scientific_name: string[];
    default_image: { regular_url?: string; medium_url?: string } | null;
    sunlight?: string[];
    watering?: string;
    cycle?: string;
    maintenance?: string | null;
  }>;
}

function mapSpecies(raw: PerenualListResponse['data'][number]): IPerenualSpecies {
  return {
    id: raw.id,
    commonName: raw.common_name,
    scientificName: raw.scientific_name?.[0] ?? raw.common_name,
    imageUrl: raw.default_image?.regular_url ?? raw.default_image?.medium_url ?? null,
    sunlight: raw.sunlight ?? [],
    watering: raw.watering ?? 'Nepoznato',
    cycle: raw.cycle ?? 'Nepoznato',
    maintenance: raw.maintenance ?? null,
  };
}

/**
 * Traži vrstu biljke po nazivu preko Perenual API-ja.
 * Vraća null ako ključ nije podešen ili API ne pronađe rezultat.
 */
export async function fetchSpeciesByName(name: string): Promise<IPerenualSpecies | null> {
  if (!API_KEY) {
    return null;
  }

  const url = `${PERENUAL_BASE_URL}/species-list?key=${API_KEY}&q=${encodeURIComponent(name)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Perenual API greška: ${response.status}`);
  }

  const payload = (await response.json()) as PerenualListResponse;
  const first = payload.data?.[0];
  return first ? mapSpecies(first) : null;
}
