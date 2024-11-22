import { Component } from '@angular/core';
import { LineChartComponent } from './line-chart/line-chart.component'
import { DataTableComponent } from './data-table/data-table.component';
import { Router, RouterModule } from '@angular/router';
import { SharedDataService } from '../shared-data.service';
import { EnergyAssetTimeseries } from '../models/energy-asset-timeseries.interface';



@Component({
  selector: 'app-assest-details',
  standalone: true,
  imports: [LineChartComponent, DataTableComponent, RouterModule],
  templateUrl: './assest-details.component.html',
  styleUrl: './assest-details.component.css'
})


export class AssestDetailsComponent {
  energyAssetItem: string = "";
  timeSeries: EnergyAssetTimeseries[] = [];

  constructor(private router: Router
    , private sharedDataService: SharedDataService)
     {
    this.energyAssetItem = this.router.getCurrentNavigation()?.extras.state?.['data'];
  }


  ngOnInit(): void {
      this.sharedDataService.fetchTimeseries(this.energyAssetItem).subscribe({
      next: (data) => (this.timeSeries = data),
      error: (err) => console.error('Error fetching timeseries data:', err),
    });
  }
}
