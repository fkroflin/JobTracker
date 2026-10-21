FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /app

COPY src/JobTracker.Domain/JobTracker.Domain.csproj src/JobTracker.Domain/
COPY src/JobTracker.Application/JobTracker.Application.csproj src/JobTracker.Application/
COPY src/JobTracker.Infrastructure/JobTracker.Infrastructure.csproj src/JobTracker.Infrastructure/
COPY src/JobTracker.WebApi/JobTracker.WebApi.csproj src/JobTracker.WebApi/

RUN dotnet restore src/JobTracker.WebApi/JobTracker.WebApi.csproj

COPY src/ src/

RUN dotnet publish src/JobTracker.WebApi/JobTracker.WebApi.csproj -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS runtime
WORKDIR /app
COPY --from=build /out .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "JobTracker.WebApi.dll"]