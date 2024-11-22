export interface EnergyAssetTimeseries {
    formattedTimestamp: any;
    assetId: string;       // UUID of the asset
    timestamp: string;     
    activePower: number;  
    voltage: number;       
  }