import { HttpClient } from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { ChartService } from './services/chart.service';
import { ChatService } from './services/chat.service';
import {TokenService} from './services/authentication/token.service';
import {UserService} from './services/user.service';
import {LocalStorageService} from "./services/storage/storage.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  title = 'client';
  messages: string[];
  usuario: string;
  mensagem: string;

  constructor(
    public signalRService: ChartService,
    public  chatService: ChatService,
    private http: HttpClient,
    private userService: UserService,
    private localStorage: LocalStorageService
  ) {
    this.messages = [];
    this.mensagem = '';
    this.usuario = '';
    this.localStorage.save('teste', 'teste');
  }

  ngOnInit(): void {
    // createObs().subscribe(message =>{
    //   console.log(message)
    // })

    // this.signalRService.startConnection();
    // this.signalRService.addTransferChartDataListener();
    // this.startHttpRequest();
    this.chatService.start().subscribe(() => {
      this.chatService.listen().subscribe(message => {
        this.messages.push(message as unknown as string);
      });
    });
  }

  private startHttpRequest = () => {
    this.http.get('https://localhost:5001/weatherforecast')
      .subscribe((res: any) => {
        console.log(res);
      });

    this.http.get('https://localhost:5001/api/chart')
      .subscribe((res: any) => {
        console.log(res);
      });
  }

  sendMessage(): void {
    this.userService.getUser().subscribe(user => {
      this.chatService.send(user.users[0].firstname, this.mensagem)
        .subscribe(() => {
          console.log('mensagem enviada!');
        });
    });
  }
}
