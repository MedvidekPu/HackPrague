import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Flat, Region} from "../model/region";
import {RegionsService} from "../services/regions.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  flats: Flat[];

  chosenRegion$: Observable<Region>;

  constructor(private regionService: RegionsService) {
    this.chosenRegion$ = this.regionService.getChosenRegion();
    this.chosenRegion$.subscribe(region => {
      this.flats = this.regionService.getFlatsProdejByRegion(region);
      console.log('ted', this.flats);
      this.flats = this.flats.slice(0, 7);
    });
  }

  ngOnInit(): void {
  }

}
