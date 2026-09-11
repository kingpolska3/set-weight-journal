# Dokończenie ustawień, Profilu i trybu offline

## Zakres
- Dodać w Narzędziach przełącznik „Automatycznie startuj przerwę”, zapisujący istniejące ustawienie; domyślnie pozostaje wyłączony.
- Usunąć z Profilu mapę mięśni i zastąpić ją statystykami konta na samej górze: liczba dni od pierwszego treningu, liczba treningów i łączna objętość.
- Dodać możliwość instalacji aplikacji na ekranie głównym oraz bezpieczny tryb offline.
- Zaktualizować listę prac, sprawdzić kompilację oraz kluczowe ekrany na telefonie i komputerze.

## Szczegóły techniczne
- Wykorzystać istniejące `rest.autoStart` i działający sygnał automatycznego uruchomienia timera.
- Statystyki liczyć wyłącznie z lokalnej historii użytkownika i pomijać dni bez treningu.
- Dodać manifest, ikony oraz obsługę offline zgodnie z regułami PWA projektu; rejestracja nie będzie działać w podglądzie deweloperskim.
- Nie zmieniać pozostałych funkcji ani danych użytkownika.
