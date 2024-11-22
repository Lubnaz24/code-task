import { Component } from '@angular/core';
import {LineChartComponent} from './assest-details/line-chart/line-chart.component'
import { HttpClient  } from '@angular/common/http';
import {DataTableComponent} from './assest-details/data-table/data-table.component';
import { AsyncPipe } from '@angular/common';
import {  NgFor } from '@angular/common';
import { Item } from './energyAssets.interface'; // Import the interface
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LineChartComponent, DataTableComponent, AsyncPipe, NgFor, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  items: Item[] = [];  // Array to hold the fetched items
  onButtonClick(hero: any){
    this.router.navigate(['/details'], { state: { data: hero } });
  }
  
  constructor(private http: HttpClient,
     private router: Router) {}

  ngOnInit(): void {
    this.fetchItems();
  }

  fetchItems(): void {
    const url = 'http://localhost:3000/items'; 
    this.http.get<Item[]>(url).subscribe((data) => {
      // Extract items from the JSON response
      this.items = data;
    });
  }
}
