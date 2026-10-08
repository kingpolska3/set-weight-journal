export type AtlasExercise = { name: string; desc: string; tips: string };
export type AtlasGroup = { label: string; exercises: AtlasExercise[] };
export type AtlasCategory = {
  key: string;
  label: string;
  exercises: AtlasExercise[];
  groups?: AtlasGroup[];
  note?: string;
};

const e = (name: string, desc: string, tips: string): AtlasExercise => ({ name, desc, tips });

const chestGroups = [
  { label: "Ćwiczenia ze sztangą (Barbell)", exercises: [
    e("Wyciskanie sztangi na ławce płaskiej (Bench Press)", "Podstawowy ruch siłowy na całą klatkę, przednie barki i triceps. Najlepiej buduje środkową część klatki.", "Ściągnij łopatki i utrzymaj stopy w podłodze – nie odbijaj sztangi od mostka."),
    e("Wyciskanie sztangi na ławce skośnej dodatniej (Incline Bench Press)", "Wyciskanie na ławce 30–45°, akcent na górną część klatki i przednie barki.", "Opuszczaj sztangę na górną część mostka, nie pod szyję."),
    e("Wyciskanie sztangi na ławce skośnej ujemnej (Decline Bench Press)", "Wyciskanie z głową niżej niż biodra, akcent na dolną część klatki. Mniejsze obciążenie barków.", "Zablokuj nogi pod wałkami i prowadź sztangę do dolnej części klatki."),
    e("Wyciskanie sztangi na podłodze (Floor Press)", "Wyciskanie leżąc na podłodze w skróconym zakresie – siła w środkowej fazie i triceps.", "Zatrzymaj łokcie na podłodze na chwilę, bez odbijania."),
    e("Guillotine Press (wyciskanie do szyi)", "Wyciskanie z łokciami szeroko i sztangą prowadzoną nad szyję, mocno rozciąga górną klatkę.", "Tylko lekki ciężar i asekuracja – to ruch ryzykowny dla barków."),
    e("Close-grip Bench Press (wąski chwyt)", "Wyciskanie wąskim chwytem, przenosi pracę na triceps i wewnętrzną część klatki.", "Chwyt na szerokość barków, łokcie blisko tułowia."),
    e("Pullover ze sztangą", "Opuszczanie sztangi za głowę w leżeniu, rozciąga klatkę i najszerszy grzbietu.", "Lekko ugięte łokcie i kontrolowany zakres – bez bólu barków."),
  ] },
  { label: "Ćwiczenia z hantlami (Dumbbell)", exercises: [
    e("Wyciskanie hantli na ławce płaskiej", "Wyciskanie hantli daje większy zakres ruchu niż sztanga i wyrównuje siłę stron.", "Opuszczaj hantle do linii klatki, łokcie ok. 45° od tułowia."),
    e("Wyciskanie hantli na ławce skośnej dodatniej", "Akcent na górną część klatki z pełnym rozciągnięciem.", "Nie ustawiaj ławki wyżej niż 45° – przejmą barki."),
    e("Wyciskanie hantli na ławce skośnej ujemnej", "Akcent na dolną część klatki przy mniejszym obciążeniu barków.", "Stabilnie zablokuj nogi, hantle prowadź nad dolną klatką."),
    e("Wyciskanie hantli na podłodze", "Skrócony zakres chroniący barki, dobry do pracy nad siłą i tricepsem.", "Łokcie dotykają podłogi miękko, bez odbicia."),
    e("Rozpiętki z hantlami na ławce płaskiej (Dumbbell Fly)", "Izolacja klatki z mocnym rozciągnięciem w dolnej fazie.", "Stały, lekki kąt w łokciach – to nie wyciskanie."),
    e("Rozpiętki na ławce skośnej dodatniej", "Izolacja górnej części klatki.", "Kończ ruch nad górną klatką, nie stukaj hantlami."),
    e("Rozpiętki na ławce skośnej ujemnej", "Izolacja dolnej części klatki.", "Kontrolowane zejście, nie opuszczaj ramion poniżej linii barków."),
    e("Pullover z hantlem (jednorącz)", "Wersja pulloveru z jednym hantlem, rozciąga klatkę i plecy.", "Trzymaj żebra w dole, nie wyginaj lędźwi."),
    e("Wyciskanie hantli jednorącz (Single-arm Press)", "Wyciskanie jedną ręką – klatka plus mocna praca mięśni stabilizujących korpus.", "Nie pozwól, by tułów obracał się za hantlem."),
    e("Around the World (krążenia hantli)", "Lekkie hantle prowadzone łukiem od bioder nad głowę w leżeniu – klatka i ruchomość barków.", "Mały ciężar, wolne tempo i płynny łuk."),
  ] },
  { label: "Ćwiczenia na maszynach", exercises: [
    e("Wyciskanie na maszynie Chest Press (płaska)", "Bezpieczne wyciskanie po stałym torze, dobre do pracy do upadku.", "Ustaw uchwyty na wysokości środka klatki."),
    e("Wyciskanie na maszynie skośnej (Incline Chest Press)", "Maszynowa wersja wyciskania na górną klatkę.", "Plecy i łopatki cały czas przy oparciu."),
    e("Wyciskanie na maszynie decline (Decline Chest Press)", "Maszynowa wersja wyciskania na dolną klatkę.", "Nie prostuj łokci do pełnego zablokowania."),
    e("Hammer Strength / plate-loaded Chest Press (płaska, skośna, decline)", "Maszyna na talerze z niezależnymi ramionami – naturalny tor i praca każdej strony osobno.", "Pracuj obiema stronami równo, bez szarpania."),
    e("Pec Deck / Butterfly (motylek)", "Izolacja środkowej części klatki ze stałym napięciem.", "Zatrzymaj się na sekundę w pełnym spięciu."),
    e("Lever Chest Press / Lever Fly", "Maszyna dźwigniowa łącząca wyciskanie lub rozpiętki z naturalnym łukiem ruchu.", "Ruch wolny i kontrolowany w obu fazach."),
    e("Maszyna Smitha – wyciskanie płaskie, skośne, decline", "Wyciskanie po prowadnicy – stabilniej i bezpieczniej bez asekuracji.", "Ustaw ławkę tak, by sztanga opadała na właściwą część klatki."),
    e("Assisted Dip Machine (dipy wspomagane)", "Dipy z odciążeniem, dobre do nauki ruchu – dolna klatka i triceps.", "Lekko pochyl tułów, by mocniej pracowała klatka."),
  ] },
  { label: "Ćwiczenia na wyciągu / bramie (Cable)", exercises: [
    e("Rozpiętki na bramie (Cable Crossover)", "Izolacja klatki ze stałym napięciem linek w całym zakresie.", "Krok do przodu i stabilna pozycja – ruch tylko z ramion."),
    e("Rozpiętki z góry w dół (High-to-Low Cable Fly)", "Linki z góry prowadzone w dół – akcent na dolną część klatki.", "Kończ ruch na wysokości bioder, łokcie lekko ugięte."),
    e("Rozpiętki z dołu w górę (Low-to-High Cable Fly)", "Linki z dołu prowadzone w górę – akcent na górną część klatki.", "Kończ na wysokości brody, nie unoś barków."),
    e("Wyciskanie na bramie (Cable Chest Press)", "Wyciskanie linek przed siebie ze stałym oporem.", "Jedna noga z przodu dla stabilności, nie wyginaj pleców."),
    e("Single-arm Cable Fly / Press", "Jednorącz rozpiętki lub wyciskanie na wyciągu – korekta asymetrii.", "Nie rotuj tułowia za ręką."),
    e("Cable Pullover", "Pullover na wyciągu górnym, stałe napięcie klatki i najszerszego.", "Ręce prawie proste, ruch z barków."),
  ] },
  { label: "Ćwiczenia z masą ciała (Bodyweight)", exercises: [
    e("Pompki klasyczne (Push-ups)", "Podstawowe ćwiczenie na klatkę, triceps i korpus.", "Ciało w jednej linii – nie opuszczaj bioder."),
    e("Pompki szerokie", "Szeroki rozstaw dłoni mocniej angażuje klatkę.", "Nie rozstawiaj dłoni zbyt szeroko – łokcie nie mogą uciekać w bok pod kątem 90°."),
    e("Pompki diamentowe / wąskie", "Dłonie blisko siebie – akcent na triceps i wewnętrzną klatkę.", "Łokcie prowadź wzdłuż tułowia."),
    e("Pompki na poręczach / dipy na klatkę", "Dipy z pochyleniem do przodu – dolna klatka i triceps.", "Schodź tylko do komfortowej dla barków głębokości."),
    e("Pompki z nogami w górze (Decline Push-ups)", "Stopy na podwyższeniu – akcent na górną część klatki i barki.", "Napnij brzuch, by nie wyginać lędźwi."),
    e("Pompki z rękami wyżej (Incline Push-ups)", "Dłonie na podwyższeniu – łatwiejsza wersja, akcent na dolną klatkę.", "Im wyżej dłonie, tym łatwiej – stopniuj trudność."),
    e("Pompki archer (jednoręczne wariacje)", "Przenoszenie ciężaru na jedną rękę – progresja w stronę pompek jednorącz.", "Druga ręka prosta, tylko asekuruje."),
    e("Pompki z klaskaniem / plyometryczne", "Eksplozywne pompki budujące moc i szybkość.", "Ląduj miękko na lekko ugiętych łokciach."),
    e("Pompki na jednej ręce (zaawansowane)", "Najtrudniejsza wersja pompek – siła klatki, tricepsa i stabilizacja.", "Szerzej rozstaw stopy dla równowagi."),
    e("Pompki z obciążeniem (kamizelka, plecak, talerz)", "Klasyczne pompki z dodatkowym ciężarem dla progresji siły.", "Obciążenie na górze pleców, nie na lędźwiach."),
  ] },
]; 
const chest = (): AtlasCategory => ({
  key: "klatka",
  label: "Klatka piersiowa",
  groups: chestGroups,
  exercises: chestGroups.flatMap((g) => g.exercises),
  note: "Podział według części klatki (orientacyjny):\nGóra klatki → wyciskania i rozpiętki na skosie dodatnim (30–45°), low-to-high cable fly\nŚrodek → wyciskania płaskie, klasyczne rozpiętki, pec deck\nDół klatki → decline press, high-to-low cable fly, dipy z pochyleniem",
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
