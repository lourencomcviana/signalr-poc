## Criando projeto de exemplo
https://docs.microsoft.com/pt-br/aspnet/core/tutorials/signalr?view=aspnetcore-3.1&tabs=visual-studio-code

## Adaptando para funcionar com angular 
https://code-maze.com/netcore-signalr-angular/

## Criar aplicação como serviço
https://dev.to/sumitkharche/how-to-host-asp-net-core-3-1-web-applications-as-windows-service-52k2"

### Pacotes para adicionar
- dotnet add package Microsoft.Extensions.Hosting.WindowsServices

### Publish
- dotnet publish -c Release -r win-x64 --self-contained
- sc create SignalRTest binPath="H:\workspace\zup\SignalRTest\bin\SignalRTest.exe"
  
### Start and check
- net start SignalRTest
- sc query SignalRTest

## Rodar .netCore
https://dotnet.microsoft.com/download/dotnet/thank-you/sdk-3.1.408-windows-x64-installer
dotnet run