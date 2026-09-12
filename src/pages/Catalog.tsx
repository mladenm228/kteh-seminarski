import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { plants } from '../data/plants';
import {
  CARE_LEVEL_LABELS,
  CATEGORY_LABELS,
  SUNLIGHT_LABELS,
  type CareLevel,
  type PlantCategory,
  type SunlightLevel,
} from '../models/Plant';
import { PlantCard } from '../components/PlantCard';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../hooks/useFavorites';
import { useNotification } from '../context/NotificationContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './Catalog.css';

type SortKey = 'preporuceno' | 'cena-rastuce' | 'cena-opadajuce' | 'naziv';

const categories = Object.keys(CATEGORY_LABELS) as PlantCategory[];
const sunlightLevels = Object.keys(SUNLIGHT_LABELS) as SunlightLevel[];
const careLevels = Object.keys(CARE_LEVEL_LABELS) as CareLevel[];
const PAGE_SIZE = 8;

/** Katalog biljaka: pretraga, filtriranje po kategoriji i sortiranje, sinhronizovano sa URL parametrima. */
export function Catalog() {
  useDocumentTitle('Katalog');
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { notify } = useNotification();
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('pretraga') ?? '';
  const activeCategory = (searchParams.get('kategorija') as PlantCategory | null) ?? 'sve';
  const activeSunlight = (searchParams.get('osuncanost') as SunlightLevel | null) ?? 'sve';
  const activeCareLevel = (searchParams.get('odrzavanje') as CareLevel | null) ?? 'sve';
  const sortKey = (searchParams.get('sortiranje') as SortKey | null) ?? 'preporuceno';
  const currentPage = Math.max(1, Number(searchParams.get('stranica') ?? '1') || 1);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === '' || value === 'sve' || value === 'preporuceno') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.delete('stranica');
    setSearchParams(next);
  };

  const goToPage = (page: number) => {
    const next = new URLSearchParams(searchParams);
    if (page <= 1) {
      next.delete('stranica');
    } else {
      next.set('stranica', String(page));
    }
    setSearchParams(next);
  };

  const filteredPlants = useMemo(() => {
    let result = plants.filter((plant) =>
      plant.name.toLowerCase().includes(query.trim().toLowerCase()),
    );

    if (activeCategory !== 'sve') {
      result = result.filter((plant) => plant.category === activeCategory);
    }

    if (activeSunlight !== 'sve') {
      result = result.filter((plant) => plant.sunlightLevel === activeSunlight);
    }

    if (activeCareLevel !== 'sve') {
      result = result.filter((plant) => plant.careLevel === activeCareLevel);
    }

    switch (sortKey) {
      case 'cena-rastuce':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'cena-opadajuce':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'naziv':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'sr'));
        break;
      default:
        result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [query, activeCategory, activeSunlight, activeCareLevel, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filteredPlants.length / PAGE_SIZE));
  const pageStart = (Math.min(currentPage, totalPages) - 1) * PAGE_SIZE;
  const pagePlants = filteredPlants.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <div className="catalog">
      <div className="catalog__header">
        <h1>Katalog biljaka</h1>
        <SearchBar initialValue={query} onSearch={(value) => updateParam('pretraga', value)} />
      </div>

      <div className="catalog__filters">
        <div className="catalog__categories">
          <button
            className={activeCategory === 'sve' ? 'is-active' : ''}
            onClick={() => updateParam('kategorija', 'sve')}
          >
            Sve
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={activeCategory === category ? 'is-active' : ''}
              onClick={() => updateParam('kategorija', category)}
            >
              {CATEGORY_LABELS[category]}
            </button>
          ))}
        </div>

        <div className="catalog__selects">
          <select
            value={activeSunlight}
            onChange={(event) => updateParam('osuncanost', event.target.value)}
          >
            <option value="sve">Osunčanost: sve</option>
            {sunlightLevels.map((level) => (
              <option key={level} value={level}>
                {SUNLIGHT_LABELS[level]}
              </option>
            ))}
          </select>

          <select
            value={activeCareLevel}
            onChange={(event) => updateParam('odrzavanje', event.target.value)}
          >
            <option value="sve">Održavanje: sve</option>
            {careLevels.map((level) => (
              <option key={level} value={level}>
                {CARE_LEVEL_LABELS[level]}
              </option>
            ))}
          </select>

          <select value={sortKey} onChange={(event) => updateParam('sortiranje', event.target.value)}>
            <option value="preporuceno">Preporučeno</option>
            <option value="cena-rastuce">Cena: rastuće</option>
            <option value="cena-opadajuce">Cena: opadajuće</option>
            <option value="naziv">Naziv (A-Š)</option>
          </select>
        </div>
      </div>

      <p className="catalog__count">{filteredPlants.length} rezultata</p>

      {filteredPlants.length === 0 ? (
        <p className="catalog__empty">Nema biljaka koje odgovaraju pretrazi.</p>
      ) : (
        <>
          <div className="catalog__grid">
            {pagePlants.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                isFavorite={isFavorite(plant.id)}
                onToggleFavorite={toggleFavorite}
                onAddToCart={(p) => {
                  addToCart(p);
                  notify(`${p.name} je dodata u korpu.`);
                }}
              />
            ))}
          </div>

          <Pagination
            currentPage={Math.min(currentPage, totalPages)}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </>
      )}
    </div>
  );
}
