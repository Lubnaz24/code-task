import { Component, Input } from '@angular/core';
import * as echarts from 'echarts';
import { CommonModule, NgIf } from '@angular/common';
import { EnergyAssetTimeseries } from '../../models/energy-asset-timeseries.interface';
import { DatePipe } from '@angular/common';




@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
  providers: [
    DatePipe
  ]
})
export class DataTableComponent<T> {
  @Input() timeSeries: EnergyAssetTimeseries[] = [];
  @Input() assetName: string = '';

}
