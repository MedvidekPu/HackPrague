import { Component, OnInit } from '@angular/core';
import {RegionsService} from "../services/regions.service";
import {Region} from "../model/region";
import {Observable} from "rxjs";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  chosenRegion$: Observable<Region>;

  constructor(private regionService: RegionsService) {
    this.chosenRegion$ = regionService.getChosenRegion();
  }

  ngOnInit(): void {
  }

}
