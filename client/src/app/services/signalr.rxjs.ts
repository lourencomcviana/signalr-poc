import {HubConnection} from '@microsoft/signalr';
import {EMPTY, from, Observable, Subject, timer} from 'rxjs';


export default abstract class HubConnectionObservable {
  public static readonly RETRY_TIMER = 1000;
  private readonly hubConnection: HubConnection;
  private readonly onRecieveMessage: Subject<any[]> = new Subject<any[]>();
  private readonly recieveEvent: string;
  private readonly sendEvent: string;

  constructor(
    hubConnection: HubConnection,
    recieveEvent: string,
    sendEvent: string
  ) {
    this.hubConnection = hubConnection;
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
  public get connection(): HubConnection {
    return this.hubConnection;
  }

  public start(): Observable<void> {
    const context = this;
    return from(this.hubConnection.start().then(res => {
      this.hubConnection.on(this.recieveEvent, callback);
      return res;
    }));

    function callback(args: any): void {
      console.log(... arguments);
      context.onRecieveMessage.next(Array.prototype.slice.call(arguments));
    }
  }
  public send(...args: any[]): Observable<void> {
    return  from(this.connection.invoke(this.sendEvent, ... args));
  }

  public listen(): Observable<any[]>{
    return this.onRecieveMessage;
  }

  public stop(): Observable<void> {
    if (this.hubConnection) {
      return from(this.connection.stop());
    }
    return EMPTY;
  }
}
