import { Link } from 'react-router-dom';
import { plants } from '../data/plants';
import { PlantingPlanner } from '../models/PlantingPlanner';
import { usePlantingPlan } from '../hooks/usePlantingPlan';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Button } from '../components/Button';
import './PlantingPlan.css';

/** Lista biljaka koje korisnik planira da posadi, sa ciljnim datumom i beleškom. */
export function PlantingPlan() {
  useDocumentTitle('Plan sadnje');
  const { items, removeFromPlan } = usePlantingPlan();

  const planner = new PlantingPlanner(items);
  const upcoming = planner.upcoming();
  const overdue = planner.overdue();

  const findPlant = (plantId: string) => plants.find((p) => p.id === plantId);

  if (items.length === 0) {
    return (
      <div className="planting-plan planting-plan--empty">
        <h1>Nemate stavki u planu sadnje</h1>
        <p>Otvorite detalje biljke i dodajte je u plan sa željenim datumom sadnje.</p>
        <Link to="/katalog">
          <Button>Idi na katalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="planting-plan">
      <h1>Plan sadnje</h1>
      <p className="planting-plan__summary">
        {planner.count()} {planner.count() === 1 ? 'stavka' : 'stavki'} u planu
        {overdue.length > 0 && ` • ${overdue.length} sa prošlim datumom`}
      </p>

      {overdue.length > 0 && (
        <section className="planting-plan__section">
          <h2>Prošli datumi</h2>
          <ul className="planting-plan__list">
            {overdue.map((item) => {
              const plant = findPlant(item.plantId);
              if (!plant) return null;
              return (
                <li key={item.plantId} className="planting-plan__item is-overdue">
                  <Link to={`/biljka/${plant.id}`} className="planting-plan__plant">
                    <span>{plant.icon}</span> {plant.name}
                  </Link>
                  <span className="planting-plan__date">
                    {new Date(item.targetDate).toLocaleDateString('sr-RS')}
                  </span>
                  {item.note && <p className="planting-plan__note">{item.note}</p>}
                  <button className="planting-plan__remove" onClick={() => removeFromPlan(item.plantId)}>
                    Ukloni
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="planting-plan__section">
          <h2>Predstojeće</h2>
          <ul className="planting-plan__list">
            {upcoming.map((item) => {
              const plant = findPlant(item.plantId);
              if (!plant) return null;
              return (
                <li key={item.plantId} className="planting-plan__item">
                  <Link to={`/biljka/${plant.id}`} className="planting-plan__plant">
                    <span>{plant.icon}</span> {plant.name}
                  </Link>
                  <span className="planting-plan__date">
                    {new Date(item.targetDate).toLocaleDateString('sr-RS')}
                  </span>
                  {item.note && <p className="planting-plan__note">{item.note}</p>}
                  <button className="planting-plan__remove" onClick={() => removeFromPlan(item.plantId)}>
                    Ukloni
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
