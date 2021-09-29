import {HubConnection} from '@microsoft/signalr';
import {EMPTY, from, Observable, Subject, timer} from 'rxjs';

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

export default abstract class HubConnectionObservable implements IHubConnectionObservable {
  public static readonly RETRY_TIMER = 1000;
  private readonly hubConnection: HubConnection;
  private readonly onRecieveMessage: Subject<any[]> = new Subject<any[]>();
  private readonly recieveEvent: string;
  private readonly sendEvent: string;

  protected constructor(
    recieveEvent: string,
    sendEvent: string
  ) {
    this.hubConnection = this.create();
    this.recieveEvent = recieveEvent;
    this.sendEvent = sendEvent;
    this.hubConnection.onclose(err => {
      if (err){
        console.log(this.connection.state);
        // keep tryng to reconect
        const sub = timer(HubConnectionObservable.RETRY_TIMER, HubConnectionObservable.RETRY_TIMER)
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

  abstract create(): HubConnection;
  get connection(): HubConnection {
    return this.hubConnection;
  }

  start(): Observable<void> {
    const context = this;
    return from(this.hubConnection.start().then(res => {
      this.hubConnection.on(this.recieveEvent, callback);
      return res;
    }));

    function callback(args: any): void {
      console.log(...arguments);
      context.onRecieveMessage.next(Array.prototype.slice.call(arguments));
    }
  }

  send(...args: any[]): Observable<void> {
    return from(this.connection.invoke(this.sendEvent, ...args));
  }

  listen(): Observable<any[]> {
    return this.onRecieveMessage;
  }

  stop(): Observable<void> {
    if (this.hubConnection) {
      return from(this.connection.stop());
    }
    return EMPTY;
  }
}
