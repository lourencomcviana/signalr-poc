# signalr-poc

Demonstrativo de integração entre signalR, DotNetCore re Angular


## Idéia do projeto
Disponibilizar um chat que é capaz de receber mensagens e enviar mensagens para todos os usuários conectados.

## Funcionamento
Uma única tela com campod e texto para informar nome do usuário e um para a mensagem em si.

## DotNet
projeto dotnetcore 3.1 que acessa disponibilzia as apis

O projeto SignalRTest possui implementação bem simples onde:
- SendMessage: nome do método de envio de mensagens
- ReceiveMessage: nome do evento gerado para os clientes conectados

``` C#

    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
```

## Angular
Um único serviço fica responsável por gerenciar as conexões, semelhante a biblioteca http padrão do angular.


### Objetivos
- Criar um modelo padronizado para criar novas conexoes
- Proteções contra falhas de rede ou conexão
- Capaz de aplicar interceptors
- Utiliza https para a segurança das informações
- extensível a partir da interface ou classe abstrata. Novos observables com comportamento mais delicado podem ser implementados

### SneakPeak
Classe abstrata HubConnectionObservable implementa a seguinte interface

``` javascript
export interface IHubConnectionObservable {
  // retorna conexão no seu estado primitivo
  readonly connection: HubConnection;

  // inicia a conexão, ao concluir um cold observable notifica a conclusão
  start(): Observable<void>;

  // envia requisição e escuta o resultado através de um cold observable
  send(...args: any[]): Observable<void>;
  
  // iniciar a escutar a eventos por um hot observable
  listen(): Observable<any[]>;

  // paraliza a execução
  stop(): Observable<void>;
  
  // método utilizado para criar uma nova conexão, classe abstrata não deve implementar este método
  create(): HubConnection;
}
```

### Implementação
``` javascript 
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
export class ChatService extends  HubConnectionObservable{
  // seta qual o nome da mensagem de ´recebimento´ e ´envio´
  constructor() {
    super('ReceiveMessage', 'SendMessage');
  }
  // cria a conexão em si. A classe abstrata utiliza esse método quando necessário. 
  create(): HubConnection {
    return  new signalR.HubConnectionBuilder()
      .withUrl(url.chatHub)
      .build();
  }
  // Outras opções estão implementadas na classe abstrata e não há a necessidade de futuras customizações para o 
  // objetivo deste exemplo. Situações mais complexas podem necessitar que métodos herdados sejam sobreescritos
}
```
