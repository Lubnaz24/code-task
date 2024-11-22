import { Component, Input, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { EnergyAssetTimeseries } from '../../models/energy-asset-timeseries.interface';
import { SharedDataService } from '../../shared-data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [NgxEchartsDirective, FormsModule, CommonModule],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css',
  providers: [
    provideEcharts(),
    DatePipe
  ]
})

export class LineChartComponent implements OnInit {
  @Input() assetName: string = '';
  energyAssets: string[] = []; // List of unique asset IDs
  selectedAssetId: string = ''; // Currently selected asset
  timeSeriesData: EnergyAssetTimeseries[] = []; // All time-series data
  filteredData: EnergyAssetTimeseries[] = []; // Filtered data for the chart
  startDate: string = '';
  endDate: string = '';
  chartInstance!: echarts.ECharts; // ECharts instance

  constructor(private sharedDataService: SharedDataService,
     private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.loadTimeseriesData();
  }

  // Fetch and filter the last 48 hours of data
  loadTimeseriesData(): void {
    this.sharedDataService.fetchTimeseries(this.assetName).subscribe({
      next: (data) => {
        this.timeSeriesData = data;
        this.filterLast24Hours();
      },
      error: (err) => console.error('Error fetching timeseries data:', err),
    });
  }

  // Filter data for the last 48 hours
  filterLast24Hours(): void {
    const now = new Date();
    const last48Hours = new Date(now.getTime() - 48 * 60 * 60 * 1000).getTime();

    this.filteredData = this.timeSeriesData.filter((item) => {
      const timestamp = new Date(item.timestamp).getTime();
      return timestamp >= last48Hours;
    }).map((item) => {
      // Transform the timestamp format
      return {
        ...item,
        formattedTimestamp: this.datePipe.transform(item.timestamp, 'medium'),
      };
    });
    this.updateChart();
  }

  // Update the chart
  updateChart(): void {
    if (!this.chartInstance) {
      const chartDom = document.getElementById('chart-container')!;
      this.chartInstance = echarts.init(chartDom);
    }

    const options: echarts.EChartsOption = {
      title: {
        text: 'Energy Asset Time-Series (Last 24 Hours)',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross', // Crosshair pointer
        },
      },
      legend: {
        data: ['Active Power'],
        top: '10%',
        right: 'center',
      },
      toolbox: {
        feature: {
          saveAsImage: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
        },
      },
      dataZoom: [
        {
          type: 'inside',
        },
        {
          type: 'slider',
          start: 0,
          end: 100,
        },
      ],
      xAxis: {
        type: 'category',
        data: this.filteredData.map((item) => item.formattedTimestamp),
        name: 'Timestamp',
      },
      yAxis: {
        type: 'value',
        name: 'Active Power (W)',
      },
      series: [
        {
          name: 'Active Power',
          type: 'line',
          smooth: true,
          data: this.filteredData.map((item) => item.activePower),
        },
      ],
    };

    this.chartInstance.setOption(options);
  }
}


