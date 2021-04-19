import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }

  
}

function createConnection() {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:5001/chatHub")
    .build();

  connection.on("send", data => {
    console.log('enviou coisa')
  });

  return connection;
}

function send(user: string, message: string) {
  const connection = createConnection()
  return new Observable(subscribe => {
    connection.invoke("SendMessage", user, message).catch(function (err) {
      if (err) {
        console.error(err.toString());
        subscribe.error(err)
      }
      else {
        subscribe.next()
      }
    });
  })
}

function createObs(): Observable<string> {
  const connection = createConnection()
  return new Observable(subscribe => {
    connection.on("ReceiveMessage", function (user, message) {
      var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      var encodedMsg = user + " says " + msg;

      subscribe.next(encodedMsg);
    });
  })

}

// connection.start()
//   .then(() => connection.invoke("send", "Hello" ));
