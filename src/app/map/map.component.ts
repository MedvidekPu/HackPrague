import {AfterViewInit, Component, Input, OnInit} from '@angular/core';

import {Coordinate} from 'ol/coordinate';
import {View, Map, Feature} from 'ol';
import {fromLonLat, toLonLat} from 'ol/proj';
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {GeoJSON} from "ol/format";
import {Fill, Stroke, Style} from "ol/style";
import {data} from "../../assets/Obce_JTSK";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {data2} from "../../assets/data2";
import CircleStyle from "ol/style/Circle";
import {MultiPoint} from "ol/geom";
import {RegionsService} from "../services/regions.service";
import {krajeGeo} from "../../assets/krajeGeo";
import {transform} from 'ol/proj';
import {olomouc} from "../../assets/olomouc";
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

  @Input() center: Coordinate;

  @Input() zoom: number;

  @Input() layer: string;

  view: View;

  map: Map;

  a = 255;

  styles = [
    new Style({
      stroke: new Stroke({
        color: 'blue',
        width: 3,
      }),
      fill: new Fill({
        color: '#0000' + this.a.toString(),
      }),
    }),
  ];

  setColor(num: number) {
    const color = '#5c' + num.toString() + '20';
    console.log('color', color);
    return new Style({
      stroke: new Stroke({
        color: 'blue',
        width: 3,
      }),
      fill: new Fill({
        color: color,
      }),
    })
  }


  openStreetMapStandard = new TileLayer({
    source: new OSM(),
    visible: true,
  });

  constructor(private regionService: RegionsService) {
  }

  ngAfterViewInit(): void {
    this.initMap();

    this.map.on('click', (e) => {
      console.log('click');
      this.click(e);
    });
  }

  private initMap(): void {

    const features = new GeoJSON().readFeatures(krajeGeo, {featureProjection: 'EPSG:3857'});

    features.forEach((feature) => {
      const kraj = feature.get('kraj');
      console.log('kraj', kraj);
      let y = this.regionService.getRegionsColor(kraj);
      y = Math.round(y) + 30;
      console.log('yield', y);
      feature.setStyle(this.setColor(y));
      const geometry = feature.getGeometry();
      const coords = geometry.getCoordinates();
      geometry.setCoordinates(this.transformPolyCoords(coords));
    });


    const source = new VectorSource({
      features: features
    });

    // source.addFeatures(features);

    const layer = new VectorLayer({
      source: source,
      // style: this.setColor(25),
    });

    this.center = fromLonLat(this.center);

    this.map = new Map({
      layers: [this.openStreetMapStandard, layer],
      target: 'map',
      view: new View({
        center: this.center,
        zoom: 8,
      }),
    });

  }

  styleFunction(feature) {
    return this.styles[feature.getGeometry().getType()];
  };

  transformPolyCoords(a) {
    return a.map(function (aa) {
      return aa.map(function (coords) {
        return transform(coords, 'EPSG:4326', 'EPSG:3857');
      });
    });
  }

  click(e): void {

    const style = new Style({
      stroke: new Stroke({
        color: 'blue',
        width: 3,
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.1)',
      }),
    });

    this.map.forEachFeatureAtPixel(e.pixel,
      (feature, layer) => {
        // feature.setStyle(style);
          try {
            const obec = feature.get('kraj')
            console.log(obec);
            this.regionService.setChosenRegion(obec);
          } catch {
            console.log('asdfg');
          }
      });
  }

}
