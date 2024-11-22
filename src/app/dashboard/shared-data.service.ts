import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnergyAssetTimeseries } from './models/energy-asset-timeseries.interface';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  // Generic GET request
  get<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(url, { params });
  }

  fetchTimeseries(endpoint: string): Observable<EnergyAssetTimeseries[]> {
    return this.http.get<EnergyAssetTimeseries[]>(`${this.baseUrl}/${endpoint}`);
  }
}
