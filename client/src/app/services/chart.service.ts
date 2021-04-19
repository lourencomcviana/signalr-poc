import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ChartModel } from '../interfaces/ChartModel';
import Constants from '../classes/Constants';


export const url = {
  chartHub: `${Constants.API_BASE_URL}/chart`
};

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  public data: ChartModel[];
  private hubConnection?: signalR.HubConnection

  constructor() {
    this.data = [];
  }

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(url.chartHub)
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  public addTransferChartDataListener = () => {
    if (this.hubConnection) {
      this.hubConnection.on('transferchartdata', (data) => {
        this.data = data;
        console.log(data);
      });
    } else {
      console.log('precisa iniciar a conexão');
    }
  }
}
