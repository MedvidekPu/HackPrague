import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Flat, Region} from "../model/region";
import {Subject, Observable, of} from "rxjs";
import {prodej} from "../../assets/prodej";
import {krajeGeo} from "../../assets/krajeGeo";
import {krajeData} from "../../assets/krajeData";


@Injectable({
  providedIn: 'root'
})
export class RegionsService {

  url = '';

  private chosenOkres = new Subject<Region>()

  constructor(private http: HttpClient) {

  }

  getRegionById(nazev: string): Region {
    return krajeData.filter(kraj => kraj.kraje == nazev)[0] as Region;
  }

  getChosenRegion(): Observable<Region> {
    return this.chosenOkres.asObservable();
  }

  setChosenRegion(okresId): void {
    this.chosenOkres.next(this.getRegionById(okresId));
  }

  getAllRegions(): Region[] {
      return [];
  }

  getFlatsProdejByRegion(kraj): Flat[] {
    console.log('kraj', kraj.kraje);
    return prodej.filter((flat) => {
      console.log('flat', flat.kraj);
      return flat.kraj === kraj.kraje;
    }) as Flat[];
  }

  getFlatsRentByRegion(kraj): Flat[] {
    return prodej.filter((flat) => flat.kraj === kraj) as Flat[];
  }

  // getFlatById(id: string): Flat {
  //
  // }

  getRegionsColor(nazev: string): number {
    const kraj = krajeData.filter(kraj => kraj.kraje == nazev)[0];
    console.log('kraj', kraj);
    return +kraj.yield;

  }


//
}
