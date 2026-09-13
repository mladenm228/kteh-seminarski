Web Rasadnik 

Online prodavnica sobnog i bastenskog bilja, sukulenata, sadnica i pribora za negu.
Izradjeno u React-u i TypeScript-u, uz react-router-dom za rutiranje.

Pokretanje projekta

```bash
npm install
npm run dev
```

Aplikacija se pokrece na `http://localhost:5173`.

Za produkcijski build:

```bash
npm run build
```

Podesavanje API kljuca (opciono)

Stranica pojedinacne biljke povlaci dodatne podatke (fotografiju, naucni naziv, uslove gajenja) sa
[Perenual API-ja](https://perenual.com/user/developer). Za lokalni rad sa realnim podacima:

```bash
cp .env.example .env
```

i u `.env` upisati besplatan API kljuc dobijen na perenual.com/user/developer u `VITE_PERENUAL_API_KEY`.
Bez kljuca ta sekcija prikazuje jasnu poruku da podaci trenutno nisu dostupni, ostatak aplikacije radi normalno.

Struktura projekta

```
src/
  components/   reusable komponente (Navbar, Footer, Button, FormField, PlantCard, SearchBar, StarRating, Toast, Layout, ProtectedRoute, Pagination, WateringAdvice)
  pages/        stranice aplikacije (Home, Catalog, PlantDetail, Cart, Favorites, PlantingPlan, Contact, Login, About, NotFound)
  models/       interfejsi i klase (Plant, User, IStorageService, LocalStorageService, ShoppingCart, FormValidator, PlantingPlanItem, PlantingPlanner)
  context/      React context provideri (CartContext, AuthContext, ThemeContext, NotificationContext)
  hooks/        custom hookovi (useFavorites, useDocumentTitle, useRecentlyViewed, usePlantingPlan, usePlantSpeciesInfo, useLocalWeather)
  services/     pozivi ka spoljnim API-jima (perenualApi, weatherApi)
  data/         mock podaci kataloga (plants.ts)
```

Pregled funkcionalnosti

 Pretraga i filtriranje kataloga po nazivu, kategoriji, osuncanosti i zahtevima za odrzavanje, sortiranje po ceni/nazivu (uskladjeno sa URL parametrima preko `useSearchParams`), sa paginacijom rezultata

 Korpa: dodavanje, izmena kolicine, uklanjanje stavki i izracunavanje ukupne cene (`ShoppingCart` klasa)

 Lista omiljenih biljaka sa perzistencijom u `localStorage` (zasticena ruta, dostupna samo prijavljenim korisnicima)

 Plan sadnje: dodavanje biljke sa ciljnim datumom sadnje, razdvajanje predstojecih i zakasnelih stavki (`PlantingPlanner` klasa), perzistencija u `localStorage` (zasticena ruta)

 Podaci o vrsti (fotografija, naucni naziv, uslovi gajenja) sa Perenual API-ja na stranici biljke

 Savet za zalivanje na osnovu trenutnog vremena za lokaciju korisnika, preko Open-Meteo API-ja (bez potrebe za API kljucem)

 Prijava sa validacijom forme i preusmeravanjem korisnika nazad na stranicu sa koje je dosao

 Kontakt forma sa validacijom (`FormValidator` klasa)

 "Nedavno pregledano" na stranici pojedinacne biljke

 Svetla/tamna tema sa perzistencijom

 Toast obavestenja pri dodavanju u korpu, prijavi i slanju poruke

 Responzivan prikaz za mobilne uredjaje

Autori:

Mladen Milosavljevic
Vukasin Zivkovic
Njegos Stankovic
