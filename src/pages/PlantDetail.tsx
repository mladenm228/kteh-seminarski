import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { plants } from '../data/plants';
import { CATEGORY_LABELS, type IPlant } from '../models/Plant';
import { StarRating } from '../components/StarRating';
import { Button } from '../components/Button';
import { PlantCard } from '../components/PlantCard';
import { WateringAdvice } from '../components/WateringAdvice';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../hooks/useFavorites';
import { useNotification } from '../context/NotificationContext';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePlantSpeciesInfo } from '../hooks/usePlantSpeciesInfo';
import { usePlantingPlan } from '../hooks/usePlantingPlan';
import { useAuth } from '../context/AuthContext';
import './PlantDetail.css';

export function PlantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const plant = plants.find((p) => p.id === id);

  useDocumentTitle(plant ? plant.name : 'Biljka nije pronađena');

  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { notify } = useNotification();
  const { user } = useAuth();
  const recentIds = useRecentlyViewed(plant?.id);
  const [quantity, setQuantity] = useState(1);
  const { species, loading: speciesLoading, error: speciesError } = usePlantSpeciesInfo(plant?.name);
  const { addToPlan, removeFromPlan, isInPlan } = usePlantingPlan();
  const [planDate, setPlanDate] = useState('');
  const [showPlanForm, setShowPlanForm] = useState(false);

  if (!plant) {
    return (
      <div className="plant-detail plant-detail--missing">
        <h1>Biljka nije pronađena</h1>
        <p>Proverite adresu ili se vratite na katalog.</p>
        <Button onClick={() => navigate('/katalog')}>Nazad na katalog</Button>
      </div>
    );
  }

  const related = plants
    .filter((p) => p.category === plant.category && p.id !== plant.id)
    .slice(0, 3);

  const recentlyViewed = recentIds
    .map((recentId) => plants.find((p) => p.id === recentId))
    .filter((p): p is IPlant => Boolean(p) && p!.id !== plant.id)
    .slice(0, 4);

  return (
    <div className="plant-detail">
      <Link to="/katalog" className="plant-detail__back">
        ← Nazad na katalog
      </Link>

      <div className="plant-detail__main">
        <div className="plant-detail__art" style={{ background: plant.color }}>
          <span>{plant.icon}</span>
        </div>

        <div className="plant-detail__info">
          <span className="plant-detail__category">{CATEGORY_LABELS[plant.category]}</span>
          <h1>{plant.name}</h1>
          <StarRating rating={plant.rating} />
          <p className="plant-detail__description">{plant.description}</p>

          <dl className="plant-detail__facts">
            <div>
              <dt>Nivo nege</dt>
              <dd>{plant.careLevel}</dd>
            </div>
            <div>
              <dt>Svetlost</dt>
              <dd>{plant.light}</dd>
            </div>
            <div>
              <dt>Zalivanje</dt>
              <dd>{plant.watering}</dd>
            </div>
            <div>
              <dt>Na stanju</dt>
              <dd>{plant.stock} kom</dd>
            </div>
          </dl>

          <p className="plant-detail__price">{plant.price.toLocaleString('sr-RS')} RSD</p>

          <div className="plant-detail__actions">
            <div className="plant-detail__quantity">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Smanji količinu">
                −
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(plant.stock, q + 1))}
                aria-label="Povećaj količinu"
              >
                +
              </button>
            </div>

            <Button
              disabled={plant.stock === 0}
              onClick={() => {
                addToCart(plant, quantity);
                notify(`${quantity}x ${plant.name} je dodato u korpu.`);
              }}
            >
              Dodaj u korpu
            </Button>

            <Button variant="secondary" onClick={() => toggleFavorite(plant.id)}>
              {isFavorite(plant.id) ? '❤ U omiljenima' : '🤍 Dodaj u omiljene'}
            </Button>

            {user ? (
              isInPlan(plant.id) ? (
                <Button variant="ghost" onClick={() => removeFromPlan(plant.id)}>
                  ✅ U planu sadnje — ukloni
                </Button>
              ) : (
                <Button variant="ghost" onClick={() => setShowPlanForm((open) => !open)}>
                  📅 Dodaj u plan sadnje
                </Button>
              )
            ) : (
              <Link to="/prijava" className="plant-detail__login-hint">
                Prijavite se za plan sadnje
              </Link>
            )}
          </div>

          {showPlanForm && !isInPlan(plant.id) && (
            <form
              className="plant-detail__plan-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (!planDate) return;
                addToPlan(plant.id, planDate, `Planirana sadnja: ${plant.name}`);
                notify(`${plant.name} je dodata u plan sadnje.`);
                setShowPlanForm(false);
                setPlanDate('');
              }}
            >
              <label htmlFor="plan-date">Ciljni datum sadnje</label>
              <input
                id="plan-date"
                type="date"
                value={planDate}
                onChange={(event) => setPlanDate(event.target.value)}
                required
              />
              <Button type="submit">Sačuvaj</Button>
            </form>
          )}
        </div>
      </div>

      <section className="plant-detail__section">
        <WateringAdvice />

        <div className="plant-detail__species-info">
          <h3>Podaci sa Perenual API-ja</h3>
          {speciesLoading && <p className="plant-detail__muted">Učitavanje podataka o vrsti…</p>}
          {speciesError && <p className="plant-detail__muted">{speciesError}</p>}
          {!speciesLoading && !speciesError && !species && (
            <p className="plant-detail__muted">
              Podaci trenutno nisu dostupni (nedostaje API ključ ili vrsta nije pronađena).
            </p>
          )}
          {species && (
            <div className="plant-detail__species-card">
              {species.imageUrl && <img src={species.imageUrl} alt={species.commonName} />}
              <div>
                <p className="plant-detail__species-name">
                  <em>{species.scientificName}</em>
                </p>
                <p>Ciklus: {species.cycle}</p>
                <p>Zalivanje (API): {species.watering}</p>
                {species.sunlight.length > 0 && <p>Osunčanost (API): {species.sunlight.join(', ')}</p>}
              </div>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="plant-detail__section">
          <h2>Slične biljke</h2>
          <div className="plant-detail__grid">
            {related.map((p) => (
              <PlantCard
                key={p.id}
                plant={p}
                isFavorite={isFavorite(p.id)}
                onToggleFavorite={toggleFavorite}
                onAddToCart={(item) => {
                  addToCart(item);
                  notify(`${item.name} je dodata u korpu.`);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {recentlyViewed.length > 0 && (
        <section className="plant-detail__section">
          <h2>Nedavno pregledano</h2>
          <div className="plant-detail__recent">
            {recentlyViewed.map((p) => (
              <Link key={p!.id} to={`/biljka/${p!.id}`} className="plant-detail__recent-item">
                <span>{p!.icon}</span>
                {p!.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
