import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {HubConnection} from '@microsoft/signalr';
import Constants from '../classes/Constants';
import HubConnectionObservable from './signalr.rxjs';

export const url = {
  chatHub: `${Constants.API_BASE_URL}/chatHub`
};

@Injectable({
  providedIn: 'root'
})
export class ChatService extends  HubConnectionObservable<string>{

  constructor() {
    super(createConnection(), 'ReceiveMessage', 'SendMessage');
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

