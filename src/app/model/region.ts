export interface Region {
  kraje: string,
  prumer_pronajem: string,
  prumer_prodej: string,
  yield: string,
  druzstevni_vlastnictvi: string,
  y_o_y: string,
  last_month_change: string,
  budget: string,
  cena_za_m2: string,
  pronajem_za_m_2: string,
  doba_nalezeni_najemce: string,
  fond_oprav: string
}

export interface Flat {
  Nazev: string,
  Adresa: string,
  Cena: string,
  Plocha: string,
  Typ: string,
  nemovitost: string,
  Ulice: string,
  Mesto: string,
  datum: string,
  kod_obce: string,
  okres: string,
  kraj: string

}

export interface RegionColor{
  id: string,
  color: string;
}

