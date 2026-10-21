FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

COPY backend/JobTracker.sln ./backend/

COPY backend/src/JobTracker.Domain/JobTracker.Domain.csproj ./backend/src/JobTracker.Domain/
COPY backend/src/JobTracker.Application/JobTracker.Application.csproj ./backend/src/JobTracker.Application/
COPY backend/src/JobTracker.Infrastructure/JobTracker.Infrastructure.csproj ./backend/src/JobTracker.Infrastructure/
COPY backend/src/JobTracker.WebApi/JobTracker.WebApi.csproj ./backend/src/JobTracker.WebApi/

RUN dotnet restore backend/JobTracker.sln

COPY backend/ ./backend/

WORKDIR /app/backend
RUN dotnet publish src/JobTracker.WebApi/JobTracker.WebApi.csproj -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /out .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "JobTracker.WebApi.dll"]