[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/FadZhxrK)
# Projekt z bezpieczeństwa aplikacji webowych

---

## Uruchomienie projektu

Aby uruchomić projekt należy w pierwszej kolejności uruchomić kontenery dockerowe z pomocą `docker-compose up`. Po tym jak wstanie neo4j o nieszczęśnie długim czasie uruchamiania oraz keycloak możemy uruchomić `api` oraz `kiosk-app` przechodząc do kolejno `./api` oraz `./kiosk-app` i wykonując polecenie `npm run start`.

## Opis projektu

Projekt składa się z aplikacji webowej napisanej przy pomocy React, serwisu api napisanego w Node.js z pomocą expressa, typescripta oraz oidc-client użytego do autoryzacji oraz z identity provider w postaci Keycloaka. Jako baza danych dla api używany jest neo4j.

Część projektu(api) powstała podczas zeszłego semetru i jest wykorzystywana przez prymitywny frontend

Dostęp do keycloak jest pod adressem localhost:8080, login:
> admin

hasło:
> admin

Poza tym instnieje jeden user o loginie:
> panda3


i haśle:
> passwd

---

W aplikacji webowej zabezpieczone są wszystkie ścieżki poza rootem na którym widnieje przycisk do zalogowania się. Próba wejścia na zabezpieczoną ścieżke kończy się przekierowaniem do logowania w Keycloaku. Aplikacja zabezpieczona jest paczką react-oidc-context która automatycznie odświeża token dzięki czemu nie musimy logować się ponownie. Aby móc wykonywać zapytania do api musimy do każdego zapytania dodać nagłówek Authorization w którym przekazujemy access token uzyskany przy logowaniu(zapenia nam to paczka react-oidc-context).

Aplikacja niestety musi chodzić lokalnie na dev serwerze ze względu na redirecty. Na dev serwerze są przechwytywane automatycznie, natomiast wersja produkcyjna zauważa brak odpowiednich scieżek. Z braku czasu zdecydowałem się zostać przy dev serwerze choć problem prawdopodobnie można rozwiązać nginxem przekierowując wszystkie zapytania w odpowiednie miejsce.

---

Serwis api opiera się o oidc-client który udostępnia szeroką gamę metod do autentykacji i autoryzacji. Wybrałem ją ponad keyclok-connect ze względu na to, że keycloak-connect jest zdeprecjonowany od paru lat, ponad to opierał się, i nie chciał autoryzować zapytań. W przypadku oidc-client musimy stworzyć własne middlewarey do zabezpieczania ścieżek, ale daje nam to większą swobodę. Zabezpieczenie api opiera się o 2 middleware'y. Jeden z nich przechwytuje token z nagłówka authorization i dodaje go do expressowego obiektu request.
2 middleware odpowiedzialny jest za właściwą autoryzacje. Przyjmuje tablice ról jaką musi posiadać dany użytkownik aby mógł otrzymać dostęp. Middleware sprawdzą czy przekazany access token jest aktywny oraz czy zawiera role (dodane prze role-mapper w keycloaku). Aby to zrobić używamy scieżki przeznaczonej do introspekcji tokenów. 

Oryginalnie wszystkie komponenty projektu miały znajdować się w kontenerach i opalać się przy pomocy docker compose ale okazuje się, że keycloak posiada pewną specyficzna właściwość która utrudnia introspekcje tokenów w takim układzie(w przypadku braku nginxa). Aby przeprowadzić introspekcję host do którego wysyłamy zapytanie z tokenem musi pokrywać się z hostem który wygenerował token. Brzmi sensownie ale w przypadku gry aplikacja webowa znajduje się poza dockerem odnosi się do localhost'a gdzie aplikacje w dockerze używają nazwy serwisu. Taki układ uniemożliwia introspekcje. Rozwiązaniem jak przypuszczam byłby nginx ale zabrakło mi czasu aby przetestować moją teorię.

