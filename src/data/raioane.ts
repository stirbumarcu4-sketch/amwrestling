import type { Raion } from "@/types";

/**
 * Unitățile administrativ-teritoriale de nivelul al doilea din Republica
 * Moldova: 3 municipii, 32 de raioane și UTA Găgăuzia. Codurile sunt cele
 * ISO 3166-2:MD, ca să poată fi folosite direct la integrarea cu un curier.
 *
 * Stânga Nistrului (Transnistria) nu apare în listă: nu este acoperită de
 * curierii interni, deci nu are sens ca opțiune de livrare.
 */
export const raioane: Raion[] = [
  { cod: "CU", nume: "Chișinău (municipiu)" },
  { cod: "BA", nume: "Bălți (municipiu)" },
  { cod: "BD", nume: "Bender (municipiu)" },
  { cod: "AN", nume: "Anenii Noi" },
  { cod: "BS", nume: "Basarabeasca" },
  { cod: "BR", nume: "Briceni" },
  { cod: "CA", nume: "Cahul" },
  { cod: "CT", nume: "Cantemir" },
  { cod: "CL", nume: "Călărași" },
  { cod: "CS", nume: "Căușeni" },
  { cod: "CM", nume: "Cimișlia" },
  { cod: "CR", nume: "Criuleni" },
  { cod: "DO", nume: "Dondușeni" },
  { cod: "DR", nume: "Drochia" },
  { cod: "DU", nume: "Dubăsari" },
  { cod: "ED", nume: "Edineț" },
  { cod: "FA", nume: "Fălești" },
  { cod: "FL", nume: "Florești" },
  { cod: "GA", nume: "Găgăuzia (UTA)" },
  { cod: "GL", nume: "Glodeni" },
  { cod: "HI", nume: "Hîncești" },
  { cod: "IA", nume: "Ialoveni" },
  { cod: "LE", nume: "Leova" },
  { cod: "NI", nume: "Nisporeni" },
  { cod: "OC", nume: "Ocnița" },
  { cod: "OR", nume: "Orhei" },
  { cod: "RE", nume: "Rezina" },
  { cod: "RI", nume: "Rîșcani" },
  { cod: "SI", nume: "Sîngerei" },
  { cod: "SO", nume: "Soroca" },
  { cod: "ST", nume: "Strășeni" },
  { cod: "SD", nume: "Șoldănești" },
  { cod: "SV", nume: "Ștefan Vodă" },
  { cod: "TA", nume: "Taraclia" },
  { cod: "TE", nume: "Telenești" },
  { cod: "UN", nume: "Ungheni" },
];
