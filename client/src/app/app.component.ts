import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, of } from 'rxjs';
import { SignalRService } from './services/signal-r.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  messages:string[];
  
  constructor(public signalRService: SignalRService, private http: HttpClient) {
    this.messages = []
  }

  ngOnInit() {
    // createObs().subscribe(message =>{
    //   console.log(message)
    // })

    this.signalRService.startConnection();
    this.signalRService.addTransferChartDataListener();
    this.startHttpRequest();
  }

  private startHttpRequest = () => {
    this.http.get('https://localhost:5001/weatherforecast')
      .subscribe((res: any) => {
        console.log(res);
      })

    this.http.get('https://localhost:5001/api/chart')
      .subscribe((res: any) => {
        console.log(res);
      })
  }

  sendMessage() {
    console.log('nostalgia!')
    // send('foi', 'primeira mensagem')
  }
}
