export type AtlasExercise = { name: string; desc: string; tips: string };
export type AtlasCategory = { key: string; label: string; exercises: AtlasExercise[] };

const e = (name: string, desc: string, tips: string): AtlasExercise => ({ name, desc, tips });

const chest = (): AtlasCategory => ({
  key: "klatka",
  label: "Klatka piersiowa",
  exercises: [
    e("Ława płaska wyciskanie sztangą", "Podstawowe ćwiczenie wielostawowe na klatkę, przednie aktony barków i triceps. Sztangę opuszczasz kontrolowanie do dolnej części mostka i wypychasz w górę.", "Łopatki ściągnięte, stopy stabilnie na podłodze, łokcie ok. 45° od tułowia."),
    e("Ława dodatnia wyciskanie hantli", "Wyciskanie na ławce ustawionej pod kątem 30–45°, mocniej angażuje górną część klatki. Hantle dają większy zakres ruchu.", "Nie ustawiaj zbyt stromego kąta — przejmą pracę barki."),
    e("Rozpiętki z hantlami", "Ćwiczenie izolowane rozciągające klatkę. Ramiona prowadzisz łukiem przy lekko ugiętych łokciach.", "Stały kąt w łokciach, ruch kończ przed pełnym złączeniem hantli."),
    e("Rozpiętki butterfly", "Izolacja klatki na maszynie, stałe napięcie w całym zakresie ruchu.", "Zatrzymaj się na sekundę w pełnym spięciu."),
    e("Pompki", "Ćwiczenie z masą ciała na klatkę, triceps i korpus. Ciało tworzy prostą linię.", "Napnij brzuch i pośladki, nie opuszczaj bioder."),
    e("Dipy na poręczach (pochylenie)", "Pochylenie tułowia do przodu przenosi akcent na dolną część klatki.", "Schodź tylko do komfortowej głębokości dla barków."),
  ],
});
const back = (): AtlasCategory => ({
  key: "plecy",
  label: "Plecy",
  exercises: [
    e("Podciąganie na drążku", "Klasyczne ćwiczenie na najszerszy grzbietu i biceps. Unosisz ciało aż broda minie drążek.", "Zacznij ruch od ściągnięcia łopatek, unikaj bujania."),
    e("Ściąganie drążka wyciągu górnego", "Alternatywa dla podciągania z regulowanym obciążeniem. Drążek prowadzisz do górnej części klatki.", "Nie odchylaj się mocno do tyłu, łokcie prowadź w dół."),
    e("Wiosłowanie sztangą w opadzie", "Wielostawowe ćwiczenie na grubość pleców. Sztangę przyciągasz do brzucha przy pochylonym tułowiu.", "Neutralny kręgosłup przez cały ruch."),
    e("Wiosłowanie hantlem jednorącz", "Ćwiczenie jednostronne z podparciem o ławkę, pozwala wyrównać dysproporcje.", "Prowadź łokieć blisko tułowia w kierunku biodra."),
    e("Martwy ciąg", "Ćwiczenie całego tylnego łańcucha: prostowniki, pośladki, dwugłowe ud. Podnosisz sztangę z ziemi do pełnego wyprostu.", "Sztanga blisko nóg, plecy proste, wyprost bioder i kolan jednocześnie."),
    e("Hiperekstensja", "Wzmacnia prostowniki grzbietu i pośladki na ławce rzymskiej.", "Nie przeprostowuj odcinka lędźwiowego w górnej fazie."),
  ],
});
const shoulders = (): AtlasCategory => ({
  key: "barki",
  label: "Barki",
  exercises: [
    e("Wyciskanie żołnierskie (OHP)", "Wyciskanie sztangi nad głowę na stojąco, buduje siłę barków i stabilizację korpusu.", "Napnij brzuch i pośladki, sztangę prowadź blisko twarzy."),
    e("Wyciskanie hantli siedząc", "Wyciskanie hantli nad głowę z oparciem, bezpieczna wersja na przednie i boczne aktony.", "Nie blokuj łokci gwałtownie w górze."),
    e("Unoszenie hantli bokiem", "Izolacja bocznego aktonu barków, nadaje szerokość sylwetce.", "Lekki ciężar, łokcie lekko ugięte, unoś do wysokości barków."),
    e("Unoszenie hantli przodem", "Izolacja przedniego aktonu barków.", "Bez bujania tułowiem."),
    e("Face pull", "Przyciąganie liny wyciągu do twarzy — tylne aktony i rotatory, zdrowie barków.", "Łokcie wysoko, na końcu rotacja zewnętrzna."),
    e("Odwrotne rozpiętki", "Izolacja tylnego aktonu barków w opadzie lub na maszynie.", "Ruch z barków, nie ściągaj mocno łopatek."),
  ],
});
const biceps = (): AtlasCategory => ({
  key: "biceps",
  label: "Biceps",
  exercises: [
    e("Uginanie ramion ze sztangą", "Podstawowe ćwiczenie na biceps, pozwala użyć dużego obciążenia.", "Łokcie przy tułowiu, nie odchylaj się."),
    e("Uginanie ramion z hantlami z supinacją", "Hantle obracasz w trakcie ruchu, maksymalnie angażując biceps.", "Pełny zakres, kontrolowane opuszczanie."),
    e("Uginanie młotkowe", "Chwyt neutralny akcentuje mięsień ramienny i przedramiona.", "Kciuki skierowane w górę przez cały ruch."),
    e("Modlitewnik", "Uginanie na ławce Scotta eliminuje oszukiwanie i izoluje biceps.", "Nie prostuj łokcia całkowicie z ciężarem."),
  ],
});
const triceps = (): AtlasCategory => ({
  key: "triceps",
  label: "Triceps",
  exercises: [
    e("Prostowanie ramion na wyciągu", "Izolacja tricepsa z drążkiem lub liną na wyciągu górnym.", "Łokcie nieruchomo przy tułowiu."),
    e("Wyciskanie francuskie", "Opuszczanie sztangi łamanej za głowę w leżeniu, mocno rozciąga długą głowę tricepsa.", "Łokcie skierowane w sufit, nie rozchylaj ich."),
    e("Wyciskanie wąskim chwytem", "Wielostawowe ćwiczenie na triceps i klatkę.", "Chwyt na szerokość barków, nie węższy."),
    e("Dipy na poręczach", "Pompki na poręczach z wyprostowanym tułowiem akcentują triceps.", "Tułów pionowo, kontrolowane zejście."),
  ],
});
const forearms = (): AtlasCategory => ({
  key: "przedramiona",
  label: "Przedramiona",
  exercises: [
    e("Uginanie nadgarstków", "Izolacja zginaczy przedramion ze sztangą lub hantlami.", "Przedramiona oparte, ruch tylko w nadgarstku."),
    e("Spacer farmera", "Chodzenie z ciężkimi hantlami — chwyt, przedramiona, korpus.", "Wyprostowana sylwetka, krótkie kroki."),
  ],
});
const abs = (): AtlasCategory => ({
  key: "brzuch",
  label: "Brzuch",
  exercises: [
    e("Plank (deska)", "Statyczne ćwiczenie wzmacniające cały korpus.", "Prosta linia ciała, nie zadzieraj bioder."),
    e("Unoszenie nóg w zwisie", "Mocno angażuje dolną część mięśnia prostego brzucha.", "Podwijaj miednicę, nie bujaj się."),
    e("Allahy na wyciągu", "Spięcia brzucha w klęku z liną wyciągu.", "Zginaj tułów brzuchem, nie biodrami."),
    e("Brzuszki", "Klasyczne spięcia brzucha w leżeniu.", "Odrywaj tylko łopatki, nie ciągnij głowy rękami."),
    e("Russian twist", "Skręty tułowia w siadzie — mięśnie skośne.", "Ruch z tułowia, nie tylko z rąk."),
  ],
});
const quads = (): AtlasCategory => ({
  key: "uda-przod",
  label: "Uda – przód",
  exercises: [
    e("Przysiad ze sztangą", "Król ćwiczeń na nogi: czworogłowe, pośladki, korpus.", "Kolana w linii palców, schodź co najmniej do równoległej."),
    e("Wypychanie na suwnicy (leg press)", "Bezpieczne ćwiczenie na czworogłowe z dużym obciążeniem.", "Nie odrywaj lędźwi od oparcia, nie blokuj kolan."),
    e("Wykroki z hantlami", "Ćwiczenie jednonóż na czworogłowe i pośladki, poprawia równowagę.", "Tułów prosto, kolano nie ucieka do środka."),
    e("Prostowanie nóg na maszynie", "Izolacja mięśnia czworogłowego.", "Zatrzymaj się w górze na sekundę."),
    e("Przysiad bułgarski", "Przysiad jednonóż z tylną nogą na ławce.", "Większy krok = więcej pośladków, krótszy = więcej czworogłowych."),
  ],
});
const hams = (): AtlasCategory => ({
  key: "uda-tyl",
  label: "Uda – tył",
  exercises: [
    e("Martwy ciąg rumuński", "Ruch zawiasowy w biodrach, mocno rozciąga dwugłowe ud i pośladki.", "Lekko ugięte kolana, biodra cofaj do tyłu."),
    e("Uginanie nóg leżąc", "Izolacja dwugłowych ud na maszynie.", "Biodra dociśnięte do ławki."),
    e("Uginanie nóg siedząc", "Wersja siedząca pracuje w większym rozciągnięciu mięśnia.", "Kontrolowany powrót."),
  ],
});
const glutes = (): AtlasCategory => ({
  key: "posladki",
  label: "Pośladki",
  exercises: [
    e("Hip thrust ze sztangą", "Najskuteczniejsze ćwiczenie izolujące pośladki. Plecy oparte o ławkę, wypychasz biodra w górę.", "Broda przy klatce, w górze mocne spięcie pośladków."),
    e("Glute bridge", "Unoszenie bioder w leżeniu, dobra wersja na start lub rozgrzewkę.", "Pięty blisko pośladków."),
    e("Odwodzenie nóg na maszynie", "Izolacja pośladka średniego.", "Lekko pochyl tułów do przodu dla większego zaangażowania."),
    e("Kickback na wyciągu", "Wyprost biodra z mankietem na wyciągu dolnym.", "Nie wyginaj lędźwi, ruch z biodra."),
    e("Przysiad sumo", "Szeroki rozstaw stóp akcentuje przywodziciele i pośladki.", "Palce na zewnątrz, kolana w ich linii."),
  ],
});
const calves = (): AtlasCategory => ({
  key: "lydki",
  label: "Łydki",
  exercises: [
    e("Wspięcia na palce stojąc", "Podstawowe ćwiczenie na mięsień brzuchaty łydki.", "Pełne rozciągnięcie na dole, pauza w górze."),
    e("Wspięcia na palce siedząc", "Akcentuje mięsień płaszczkowaty.", "Wolne tempo, bez odbijania."),
  ],
});

export const ATLAS: Record<"m" | "k", AtlasCategory[]> = {
  m: [chest(), back(), shoulders(), biceps(), triceps(), forearms(), abs(), quads(), hams(), glutes(), calves()],
  k: [glutes(), quads(), hams(), abs(), back(), shoulders(), chest(), biceps(), triceps(), calves()],
};

export const ATLAS_NAMES: string[] = Array.from(
  new Set([...ATLAS.m, ...ATLAS.k].flatMap((c) => c.exercises.map((x) => x.name))),
);
