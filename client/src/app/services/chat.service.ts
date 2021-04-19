import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {Observable, from, EMPTY, timer, Subject} from 'rxjs';
import {HubConnection} from '@microsoft/signalr';
import Constants from '../classes/Constants';

export const url = {
  chatHub: `${Constants.API_BASE_URL}/chatHub`
};

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() {
    this.hubConnection.onclose(err => {
      if (err){
        console.log(this.connection.state);
        // keep tryng to reconect
        const sub = timer(1000, 1000)
          .subscribe( count => {
              this.start()
                .subscribe(() => {
                  sub.unsubscribe();
                  console.log('reconectado com sucesso!');
                }, startErr => {
                  console.log('erro na conexao, tentando reconectar... ' + count);
                });
            });
      }
    });
  }
  private hubConnection: HubConnection = createConnection();
  private readonly onRecieveMessage: Subject<string> = new Subject<string>();
  public get connection(): HubConnection {
    return this.hubConnection;
  }

  public start(): Observable<void> {
    return from(this.hubConnection.start().then(res => {
      this.hubConnection.on('ReceiveMessage', (user, message) => {
        const encodedMsg = user + ' diz ' + message;

        this.onRecieveMessage.next(encodedMsg);
      });
      return res;
    }));
  }
  public send(user: string, message: string): Observable<void> {
    return  from(this.connection.invoke('SendMessage', user, message));
  }

  public listen(): Observable<string>{
    return this.onRecieveMessage;
  }

  public stop(): Observable<void> {
    if (this.hubConnection) {
      return from(this.connection.stop());
    }
    return EMPTY;
  }

}

function createConnection(): HubConnection {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(url.chatHub)
    .build();

  connection.on('send', data => {
    console.log('enviou coisa');
  });

  return connection;
}

