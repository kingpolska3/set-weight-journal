import type { AtlasGroup } from "./exercise-atlas";

export const ATLAS_DATA: Record<string, { groups: AtlasGroup[]; note: string }> = {
 "plecy": {
  "groups": [
   {
    "label": "Ćwiczenia ze sztangą (Barbell)",
    "exercises": [
     {
      "name": "Martwy ciąg klasyczny (Deadlift)",
      "desc": "To ćwiczenie buduje siłę i masę całego łańcucha tylnego, w tym prostowników grzbietu, mięśni pośladkowych i ud. Silnie angażuje dolny i środkowy odcinek pleców.",
      "tips": "Utrzymuj proste plecy przez cały ruch, aktywując mięśnie brzucha i ściągając łopatki."
     },
     {
      "name": "Martwy ciąg sumo",
      "desc": "Martwy ciąg sumo jest wariantem martwego ciągu, który bardziej angażuje wewnętrzną część ud i pośladki, jednocześnie zmniejszając obciążenie na dolny odcinek pleców. Aktywuje szerokie mięśnie grzbietu i mięśnie czworoboczne.",
      "tips": "Rozszerz kolana na boki i opuszczaj biodra prosto w dół, utrzymując klatkę piersiową wysoko."
     },
     {
      "name": "Martwy ciąg rumuński (RDL)",
      "desc": "Skupia się głównie na mięśniach dwugłowych uda i pośladkach, ale silnie angażuje również prostowniki grzbietu, wzmacniając dolny odcinek pleców. Ruch polega na zginaniu się w biodrach, nie w talii.",
      "tips": "Utrzymuj lekkie zgięcie w kolanach, pchaj biodra mocno do tyłu, a sztangę prowadź blisko nóg."
     },
     {
      "name": "Rack Pull (podciąganie z stojaków)",
      "desc": "Rack Pull to skrócona wersja martwego ciągu, która pozwala na użycie większych ciężarów i skupienie się na sile górnej części ruchu. Silnie angażuje górny i środkowy odcinek pleców oraz prostowniki grzbietu.",
      "tips": "Rozpoczynaj ruch z zablokowanymi łopatkami i aktywnie 'wciągaj' sztangę do góry, zamiast tylko podnosić."
     },
     {
      "name": "Wiosłowanie sztangą w opadzie tułowia (Bent-Over Barbell Row)",
      "desc": "Doskonałe ćwiczenie budujące masę i gęstość pleców, angażujące głównie najszersze mięśnie grzbietu, mięśnie czworoboczne i tylne aktony barków. Pracują również bicepsy i przedramiona.",
      "tips": "Utrzymuj tułów niemal równolegle do podłogi i ściągaj łopatki, celując sztangą w okolice pępka."
     },
     {
      "name": "Pendlay Row",
      "desc": "Wariant wiosłowania, w którym sztanga po każdym powtórzeniu opada na podłogę, co pozwala na pełne rozluźnienie i większą dynamikę. Intensywnie angażuje najszersze mięśnie grzbietu oraz mięśnie czworoboczne, szczególnie środkową część.",
      "tips": "Utrzymuj tułów równolegle do podłogi i dynamicznie przyciągaj sztangę do brzucha, kontrolując opuszczanie."
     },
     {
      "name": "T-Bar Row (wiosłowanie półsztangą / landmine)",
      "desc": "Ćwiczenie angażujące głównie najszerszy mięsień grzbietu i mięśnie czworoboczne, z mniejszym obciążeniem dolnego odcinka pleców niż tradycyjne wiosłowanie sztangą. Umożliwia większy zakres ruchu.",
      "tips": "Użyj uchwytu neutralnego, utrzymuj stabilną pozycję tułowia i skup się na ściąganiu łokci do tyłu, aktywując plecy."
     },
     {
      "name": "Meadows Row",
      "desc": "Jednoręczne wiosłowanie półsztangą, które pozwala na bardzo silne zaangażowanie najszerszego mięśnia grzbietu i zwiększenie jego grubości. Skupia się na pracy jednej strony pleców, co może pomóc w korekcji dysbalansu.",
      "tips": "Podeprzyj się ręką, utrzymuj stabilny tułów i mocno przyciągaj ciężar do biodra, nie do barku."
     },
     {
      "name": "Seal Row",
      "desc": "Wiosłowanie leżąc na ławce, co eliminuje zaangażowanie dolnego odcinka pleców i pozwala na pełne skupienie na najszerszych mięśniach grzbietu oraz mięśniach czworobocznych. Skutecznie buduje ich grubość.",
      "tips": "Użyj wąskiego lub średniego chwytu, ściągaj łopatki i przyciągaj sztangę do klatki piersiowej, kontrolując ruch."
     },
     {
      "name": "Good Morning",
      "desc": "Ćwiczenie wzmacniające mięśnie dwugłowe uda, pośladki i prostowniki grzbietu, które są kluczowe dla stabilności tułowia. Pomaga w budowaniu siły dolnego odcinka pleców.",
      "tips": "Utrzymuj proste plecy i lekkie ugięcie w kolanach, pochylając się w biodrach, nie w talii."
     },
     {
      "name": "Szrugsy ze sztangą (Shrugs)",
      "desc": "Ćwiczenie izolujące górną część mięśnia czworobocznego, odpowiedzialną za unoszenie barków. Buduje masę i siłę karku oraz górnej części pleców.",
      "tips": "Unosząc barki do uszu, skup się wyłącznie na ruchu pionowym, unikając krążenia barkami."
     },
     {
      "name": "High Pull",
      "desc": "Dynamiczne ćwiczenie z rodziny olimpijskich podnoszeń ciężarów, angażujące całe ciało, ale szczególnie intensywnie rozwija górną część pleców, ramiona i mięśnie czworoboczne. Buduje eksplozywną siłę.",
      "tips": "Rozpocznij ruch z bioder, a następnie dynamicznie unieś sztangę, prowadząc łokcie wysoko."
     }
    ]
   },
   {
    "label": "Ćwiczenia z hantlami (Dumbbell)",
    "exercises": [
     {
      "name": "Wiosłowanie hantlem jednorącz (One-Arm Dumbbell Row)",
      "desc": "Ćwiczenie izolujące najszerszy mięsień grzbietu, umożliwiające duży zakres ruchu i korekcję asymetrii siły. Angażuje również mięśnie czworoboczne i bicepsy.",
      "tips": "Utrzymuj prosty tułów, ściągaj łopatkę i przyciągaj hantel do biodra, nie do barku."
     },
     {
      "name": "Wiosłowanie hantlami oburącz w opadzie",
      "desc": "Podobne do wiosłowania sztangą, ale hantle pozwalają na bardziej naturalny ruch i większy zakres. Angażuje najszersze mięśnie grzbietu, mięśnie czworoboczne i tylne aktony barków.",
      "tips": "Zachowaj proste plecy, opuść tułów prawie równolegle do podłogi i ściągaj hantle do bioder."
     },
     {
      "name": "Chest-Supported Dumbbell Row (w oparciu o ławkę)",
      "desc": "Eliminuje obciążenie dolnego odcinka pleców, pozwalając na pełne skupienie na najszerszych mięśniach grzbietu, mięśniach czworobocznych i tylnych aktonach barków. Idealne do budowania masy pleców.",
      "tips": "Leż płasko na ławce, ściągaj łopatki i przyciągaj hantle do boków klatki piersiowej, kontrolując ruch."
     },
     {
      "name": "Kroc Row (ciężkie wiosłowanie jednorącz)",
      "desc": "Bardzo ciężka wersja wiosłowania hantlem jednorącz, pozwalająca na użycie znacznie większych obciążeń i angażująca całą tylną taśmę. Buduje siłę i gęstość najszerszych mięśni grzbietu.",
      "tips": "Użyj chwytu neutralnego, pozwól ciału na lekkie 'oszustwo', aby unieść ciężar, ale kontroluj negatywną fazę."
     },
     {
      "name": "Martwy ciąg z hantlami / RDL z hantlami",
      "desc": "Wariant martwego ciągu lub RDL, który pozwala na bardziej naturalny zakres ruchu ramion i może być łatwiejszy dla osób z problemami z mobilnością. Angażuje mięśnie dwugłowe uda, pośladki i prostowniki grzbietu.",
      "tips": "Utrzymuj proste plecy, hantle prowadź blisko nóg, skupiając się na ruchu bioder do tyłu."
     },
     {
      "name": "Szrugsy z hantlami",
      "desc": "Ćwiczenie izolujące górną część mięśnia czworobocznego, idealne do budowania masy i siły karku oraz górnej części pleców. Hantle pozwalają na swobodniejszy ruch.",
      "tips": "Unieś barki prosto do góry, starając się dotknąć nimi uszu, unikając ruchów okrężnych."
     },
     {
      "name": "Reverse Fly z hantlami (odwrotne rozpiętki)",
      "desc": "Ćwiczenie wzmacniające tylne aktony barków oraz środkową i górną część mięśni czworobocznych. Poprawia postawę i stabilność barków.",
      "tips": "Wykonuj ruch z lekkim zgięciem w łokciach, skupiając się na ściąganiu łopatek i otwieraniu klatki piersiowej."
     },
     {
      "name": "Pullover z hantlem",
      "desc": "Angażuje głównie najszerszy mięsień grzbietu i mięsień zębaty przedni, a także mięśnie klatki piersiowej. Rozciąga klatkę piersiową i wspomaga rozwój szerokości pleców.",
      "tips": "Utrzymuj lekko ugięte łokcie, opuszczaj hantel za głowę, czując rozciąganie w plecach i klatce, a następnie ściągaj go 'plecami'."
     },
     {
      "name": "Renegade Row",
      "desc": "Zaawansowane ćwiczenie łączące plank z wiosłowaniem hantlem, angażujące najszerszy mięsień grzbietu oraz intensywnie mięśnie core i stabilizujące. Wzmacnia stabilność tułowia.",
      "tips": "Utrzymuj stabilną pozycję bioder, minimalizuj kołysanie ciałem, skupiając się na aktywnej pracy pleców i brzucha."
     },
     {
      "name": "Gorilla Row",
      "desc": "Wariant wiosłowania hantlami, gdzie ciało pozostaje w pozycji martwego ciągu sumo, a hantle są przyciągane do brzucha. Silnie angażuje najszersze mięśnie grzbietu, mięśnie czworoboczne i prostowniki grzbietu.",
      "tips": "Utrzymuj proste plecy i szerokie ustawienie stóp, przyciągaj hantle dynamicznie, skupiając się na skurczu pleców."
     }
    ]
   },
   {
    "label": "Ćwiczenia na maszynach",
    "exercises": [
     {
      "name": "Ściąganie drążka z góry (Lat Pulldown) – szeroki, wąski, podchwyt, neutralny",
      "desc": "To ćwiczenie buduje szerokość pleców, angażując głównie najszersze mięśnie grzbietu. Różne chwyty akcentują różne części tych mięśni oraz bicepsy.",
      "tips": "Zawsze ściągaj drążek, aktywując łopatki i używając siły pleców, unikając nadmiernego bujania tułowiem."
     },
     {
      "name": "Wiosłowanie siedząc na maszynie (Seated Row / Lever Row)",
      "desc": "Izolowane ćwiczenie na środkową i dolną część pleców, szczególnie najszerszy mięsień grzbietu i mięśnie czworoboczne. Maszyna zapewnia stabilność i pozwala na skupienie się na skurczu mięśni.",
      "tips": "Trzymaj proste plecy i klatkę piersiową do przodu, ściągaj łopatki do tyłu i w dół, a uchwyt do brzucha."
     },
     {
      "name": "High Row Machine",
      "desc": "Wariant wiosłowania, który celuje bardziej w górną część pleców, w tym górne części najszerszych mięśni grzbietu i mięśnie czworoboczne. Pomaga budować grubość i pełnię górnej partii pleców.",
      "tips": "Usiądź prosto, pociągnij uchwyty wysoko w kierunku górnej części klatki piersiowej, mocno ściągając łopatki."
     },
     {
      "name": "Chest-Supported Row Machine",
      "desc": "Wersja wiosłowania z podparciem klatki piersiowej, która eliminuje zaangażowanie dolnego odcinka pleców. Pozwala na bezpieczne i efektywne budowanie masy najszerszych mięśni grzbietu i mięśni czworobocznych.",
      "tips": "Ustaw maszynę tak, aby klatka piersiowa była stabilnie oparta, a następnie skup się na ściąganiu łopatek i przyciąganiu uchwytów."
     },
     {
      "name": "Reverse Fly Machine / Pec Deck Reverse",
      "desc": "Ćwiczenie izolujące tylne aktony barków i środkową część mięśni czworobocznych, co poprawia postawę i zapobiega kontuzjom. Maszyna ułatwia kontrolę ruchu.",
      "tips": "Ustaw ławkę tak, aby ramiona były równoległe do podłogi, i skup się na ściąganiu łopatek, a nie tylko na ruchu ramion."
     },
     {
      "name": "Assisted Pull-Up Machine (podciąganie wspomagane)",
      "desc": "Umożliwia wykonanie podciągnięć osobom, które nie są w stanie zrobić tego samodzielnie, angażując najszersze mięśnie grzbietu, bicepsy i mięśnie czworoboczne. Pomaga w budowaniu siły do pełnych podciągnięć.",
      "tips": "Użyj jak najmniejszej pomocy, skup się na aktywnej pracy pleców i kontroluj fazę negatywną ruchu."
     },
     {
      "name": "Back Extension Machine (prostowanie grzbietu)",
      "desc": "Wzmacnia prostowniki grzbietu, mięśnie pośladkowe i dwugłowe uda, co jest kluczowe dla zdrowia kręgosłupa i siły w ćwiczeniach wielostawowych. Buduje wytrzymałość dolnego odcinka pleców.",
      "tips": "Utrzymuj prosty kręgosłup, schodź w dół do momentu lekkiego rozciągnięcia i wracaj do pozycji początkowej, nie przeprostowując pleców."
     },
     {
      "name": "T-Bar Row Machine / plate-loaded",
      "desc": "Maszynowa wersja T-Bar Row, zapewniająca stabilność i bezpieczeństwo, skupiająca się na najszerszych mięśniach grzbietu i mięśniach czworobocznych. Umożliwia efektywne budowanie grubości pleców.",
      "tips": "Oprzyj klatkę piersiową i utrzymuj stabilną pozycję, ściągając uchwyt do brzucha, skupiając się na skurczu pleców."
     },
     {
      "name": "Iso-Lateral Row / Lat Pulldown",
      "desc": "Maszyny izometryczne pozwalają na trening każdej strony ciała osobno, co pomaga w korekcji dysbalansu. Skupiają się na najszerszych mięśniach grzbietu, budując ich siłę i symetrię.",
      "tips": "Skup się na pełnym zakresie ruchu i kontrolowanym skurczu mięśni, pracując każdą stroną pleców niezależnie."
     },
     {
      "name": "Hammer Strength Rows i Pulldowns",
      "desc": "Maszyny Hammer Strength oferują naturalny łuk ruchu, angażując najszersze mięśnie grzbietu i mięśnie czworoboczne w specyficzny sposób. Pomagają w budowaniu gęstości i szerokości pleców.",
      "tips": "Używaj pełnego zakresu ruchu, koncentrując się na silnym skurczu mięśni pleców w szczytowej fazie ruchu."
     },
     {
      "name": "Smith Machine Row / Deadlift",
      "desc": "Maszyna Smitha zapewnia stabilny, ustalony tor ruchu, co może być przydatne do nauki techniki lub dla osób z problemami stabilizacji. Angażuje najszersze mięśnie grzbietu i prostowniki grzbietu.",
      "tips": "Mimo stabilizacji, aktywnie angażuj mięśnie stabilizujące i utrzymuj proste plecy, kontrolując ruch."
     }
    ]
   },
   {
    "label": "Ćwiczenia na wyciągu / bramie (Cable)",
    "exercises": [
     {
      "name": "Seated Cable Row (wiosłowanie siedząc)",
      "desc": "Ćwiczenie na wyciągu, które efektywnie angażuje najszersze mięśnie grzbietu, mięśnie czworoboczne i bicepsy. Pozwala na stałe napięcie mięśniowe przez cały zakres ruchu.",
      "tips": "Utrzymuj prosty tułów, ściągaj łopatki do tyłu i w dół, a uchwyt do brzucha, nie zapominając o rozciągnięciu w przód."
     },
     {
      "name": "Lat Pulldown (różne chwyty i uchwyty)",
      "desc": "Ćwiczenie na wyciągu rozwijające szerokość pleców, głównie najszersze mięśnie grzbietu. Zmiana chwytów akcentuje różne partie pleców oraz zaangażowanie bicepsów.",
      "tips": "Zawsze aktywuj łopatki na początku ruchu i skup się na ściąganiu drążka siłą pleców, nie tylko ramion."
     },
     {
      "name": "Straight-Arm Pulldown (ściąganie prostymi rękami)",
      "desc": "Izolacyjne ćwiczenie na najszersze mięśnie grzbietu, które minimalizuje zaangażowanie bicepsów. Buduje szerokość pleców i poprawia kontrolę mięśniową.",
      "tips": "Utrzymuj ramiona proste, ale nie zablokowane w łokciach, i skup się na ściąganiu drążka w dół, używając wyłącznie mięśni pleców."
     },
     {
      "name": "Face Pull",
      "desc": "Niezwykle ważne ćwiczenie wzmacniające tylne aktony barków, mięśnie rotatorów i środkową/górną część mięśni czworobocznych. Poprawia postawę i zdrowie barków.",
      "tips": "Pociągnij linkę do twarzy, rozdzielając dłonie na boki, skupiając się na ściąganiu łopatek do tyłu i w dół."
     },
     {
      "name": "Single-Arm Cable Row",
      "desc": "Jednoręczne wiosłowanie na wyciągu, które pozwala na izolację i korekcję dysbalansu siły w najszerszych mięśniach grzbietu. Zapewnia stałe napięcie mięśniowe.",
      "tips": "Utrzymuj stabilny tułów, ściągaj łopatkę i przyciągaj uchwyt do biodra, nie do barku."
     },
     {
      "name": "High-to-Low / Low-to-High Cable Row",
      "desc": "Warianty wiosłowania na wyciągu, które pozwalają na akcentowanie różnych części najszerszych mięśni grzbietu i mięśni czworobocznych. Angażują plecy pod różnymi kątami.",
      "tips": "Dostosuj wysokość wyciągu do celu ćwiczenia; high-to-low dla dolnej części pleców, low-to-high dla górnej."
     },
     {
      "name": "Cable Pullover",
      "desc": "Wersja pulloveru na wyciągu, która utrzymuje stałe napięcie mięśniowe, angażując najszersze mięśnie grzbietu i mięsień zębaty przedni. Pomaga w rozciągnięciu klatki i budowaniu szerokości pleców.",
      "tips": "Utrzymuj proste, ale nie zablokowane ramiona i ściągaj drążek w dół, używając mięśni pleców, nie tylko ramion."
     },
     {
      "name": "Standing Cable Row",
      "desc": "Wiosłowanie na wyciągu w pozycji stojącej, angażujące najszersze mięśnie grzbietu, mięśnie czworoboczne oraz stabilizatory tułowia. Pozwala na większą dynamikę i aktywację core.",
      "tips": "Utrzymuj proste plecy i stabilną pozycję, ściągając uchwyt do brzucha i aktywując łopatki."
     },
     {
      "name": "Rope Face Pull / External Rotation",
      "desc": "Wzmacnia tylne aktony barków i mięśnie rotatory, poprawiając stabilność i zdrowie stawu barkowego. Jest kluczowy dla osób z dysbalansem mięśniowym.",
      "tips": "Pociągnij linę do twarzy, jednocześnie obracając dłonie na zewnątrz, mocno ściągając łopatki."
     }
    ]
   },
   {
    "label": "Ćwiczenia z masą ciała (Bodyweight)",
    "exercises": [
     {
      "name": "Podciąganie na drążku (Pull-Ups) – szeroki, wąski, neutralny",
      "desc": "Jedno z najlepszych ćwiczeń na budowanie szerokości pleców, angażujące najszersze mięśnie grzbietu, bicepsy i mięśnie czworoboczne. Różne chwyty akcentują różne obszary.",
      "tips": "Zawsze zaczynaj od zwisu, aktywuj łopatki i ściągaj je w dół, podciągając się siłą pleców do klatki piersiowej."
     },
     {
      "name": "Chin-Ups (podchwyt)",
      "desc": "Wariant podciągania, w którym podchwyt bardziej angażuje bicepsy, ale nadal intensywnie pracuje najszerszy mięsień grzbietu i dolne partie mięśni czworobocznych. Skupia się na grubości pleców.",
      "tips": "Podciągaj się do momentu, aż podbródek znajdzie się nad drążkiem, kontrolując ruch w dół i skupiając się na skurczu pleców i bicepsów."
     },
     {
      "name": "Podciąganie z obciążeniem / wspomagane",
      "desc": "Podciąganie z obciążeniem zwiększa intensywność, budując siłę i masę pleców. Podciąganie wspomagane pomaga w nauce i budowaniu siły do pełnych podciągnięć.",
      "tips": "Niezależnie od wariantu, skup się na pełnym zakresie ruchu i aktywnej pracy mięśni pleców, kontrolując każdą fazę ruchu."
     },
     {
      "name": "Inverted Row (wiosłowanie australijskie / podciąganie w poziomie)",
      "desc": "Ćwiczenie na środkową i górną część pleców, angażujące najszersze mięśnie grzbietu, mięśnie czworoboczne i bicepsy. Regulacja nachylenia pozwala na dostosowanie trudności.",
      "tips": "Utrzymuj proste ciało od pięt do głowy, ściągaj łopatki i przyciągaj klatkę piersiową do drążka/gryfu."
     },
     {
      "name": "Superman / Back Extension na podłodze",
      "desc": "Ćwiczenia wzmacniające prostowniki grzbietu, mięśnie pośladkowe i tylną taśmę, idealne do wzmacniania dolnego odcinka pleców. Wykonywane bez sprzętu, poprawiają stabilizację.",
      "tips": "Wykonuj ruch powoli i kontrolnie, skupiając się na aktywacji mięśni grzbietu i pośladków, unikając szarpania."
     },
     {
      "name": "Bird Dog",
      "desc": "Ćwiczenie wzmacniające mięśnie core, w tym prostowniki grzbietu i mięśnie stabilizujące kręgosłup. Poprawia równowagę i koordynację, wspierając zdrowie dolnego odcinka pleców.",
      "tips": "Utrzymuj stabilny tułów, unikając kołysania biodrami, i wydłużaj kończyny w przeciwległych kierunkach."
     },
     {
      "name": "Scapular Pull-Ups / Hang",
      "desc": "Ćwiczenia skupiające się na sile i kontroli mięśni otaczających łopatki, co jest kluczowe dla zdrowia barków i efektywności ruchów pleców. Angażują dolne mięśnie czworoboczne i stabilizatory łopatki.",
      "tips": "W Scapular Pull-Ups ściągaj łopatki w dół, unosząc ciało bez zginania rąk; w Hangu skup się na pełnym rozciągnięciu."
     },
     {
      "name": "Towel Row / Doorway Row",
      "desc": "Warianty wiosłowania bez sprzętu, wykorzystujące ręcznik lub framugę drzwi, angażujące najszersze mięśnie grzbietu i mięśnie czworoboczne. Idealne do treningu w domu.",
      "tips": "Utrzymaj stabilną pozycję ciała, mocno chwytając ręcznik/framugę i ściągając klatkę piersiową do dłoni."
     },
     {
      "name": "Archer Pull-Up (zaawansowane)",
      "desc": "Zaawansowany wariant podciągania, który intensywnie angażuje jeden najszerszy mięsień grzbietu, jednocześnie budując ogromną siłę i wytrzymałość. Wzmacnia mięśnie stabilizujące.",
      "tips": "Rozpocznij z jedną ręką wyprostowaną, a drugą podciągnij się maksymalnie, utrzymując kontrolę nad ruchem."
     }
    ]
   }
  ],
  "note": "Podział według części pleców (orientacyjny):\nSzerokość (lats) → podciągania, lat pulldown, straight-arm pulldown\nGrubość (środek pleców) → wiosłowania (barbell, dumbbell, cable, machine)\nGóra / trapy → szrugsy, face pull, high rows\nDół pleców (prostowniki) → martwy ciąg, RDL, back extensions, good mornings"
 },
 "barki": {
  "groups": [
   {
    "label": "Ćwiczenia ze sztangą (Barbell)",
    "exercises": [
     {
      "name": "Wyciskanie sztangi nad głowę stojąc (Overhead Press / Military Press)",
      "desc": "Złożone ćwiczenie angażujące głównie przednie i środkowe aktony barków oraz tricepsy. Skutecznie buduje siłę i masę mięśniową barków oraz stabilność korpusu.",
      "tips": "Utrzymaj sztangę blisko ciała podczas wyciskania i opuszczania, aktywując core dla stabilności."
     },
     {
      "name": "Wyciskanie sztangi siedząc",
      "desc": "Ćwiczenie izolujące mięśnie naramienne, głównie akton przedni i środkowy, minimalizując udział nóg. Pozwala na większe skupienie się na pracy barków.",
      "tips": "Oprzyj plecy o oparcie, aby ustabilizować tułów i zapobiec bujaniu, co pozwoli na czystszą pracę barków."
     },
     {
      "name": "Wyciskanie sztangi zza karku (Behind-the-Neck Press)",
      "desc": "Ćwiczenie angażujące głównie środkowy i tylny akton barków. Wymaga dużej mobilności barków i może być kontuzjogenne dla niektórych osób.",
      "tips": "Użyj lżejszego ciężaru i skup się na pełnym zakresie ruchu, unikając nadmiernego cofania głowy i nadmiernego rozciągania stawu barkowego."
     },
     {
      "name": "Push Press / Jerk",
      "desc": "Dynamiczne ćwiczenie angażujące całe ciało, głównie przednie i środkowe aktony barków oraz tricepsy, z wykorzystaniem pędu z nóg. Buduje siłę eksplozywną i moc.",
      "tips": "Wykorzystaj mocny 'dip' i 'drive' z nóg do wygenerowania pędu, a następnie szybko zablokuj ramiona nad głową."
     },
     {
      "name": "Upright Row (podciąganie sztangi do brody)",
      "desc": "Ćwiczenie angażujące środkowy i przedni akton barków oraz górną część kapturów. Dobrze buduje szerokość barków.",
      "tips": "Trzymaj łokcie wysoko i prowadź ruch w górę, kończąc ruch sztangą w okolicy brody, unikaj szarpania."
     },
     {
      "name": "Front Raise ze sztangą",
      "desc": "Ćwiczenie izolujące przedni akton mięśnia naramiennego. Pomaga w budowaniu definicji i siły przedniej części barków.",
      "tips": "Kontroluj ruch zarówno w górę, jak i w dół, unikając bujania tułowiem i unoszenia sztangi wyżej niż poziom barków."
     },
     {
      "name": "Landmine Press",
      "desc": "Unikalne ćwiczenie wyciskające angażujące głównie przedni akton barków i tricepsy, ale w bardziej naturalnym łuku ruchu. Redukuje obciążenie stawu barkowego.",
      "tips": "Skup się na kontrolowanym ruchu i utrzymaniu stabilnej pozycji korpusu, wyciskając sztangę do pełnego wyprostu ramienia."
     },
     {
      "name": "Bradford Press",
      "desc": "Nietypowe ćwiczenie na barki, polegające na wyciskaniu sztangi z przodu za głowę i z powrotem. Angażuje głównie przedni i środkowy akton barków.",
      "tips": "Użyj lżejszego ciężaru, aby utrzymać płynny, kontrolowany ruch w pełnym zakresie, bez zatrzymywania się w górnej pozycji."
     },
     {
      "name": "Szrugsy ze sztangą",
      "desc": "Ćwiczenie ukierunkowane na rozwój mięśni czworobocznych (kapturów), głównie ich górnej części. Pomaga w budowaniu grubości karku.",
      "tips": "Skup się na unoszeniu barków prosto w górę w kierunku uszu, bez kręcenia nimi do przodu lub do tyłu, i przytrzymaj na chwilę w szczytowej pozycji."
     }
    ]
   },
   {
    "label": "Ćwiczenia z hantlami (Dumbbell)",
    "exercises": [
     {
      "name": "Wyciskanie hantli nad głowę stojąc / siedząc",
      "desc": "Skuteczne ćwiczenie na barki, głównie aktony przednie i środkowe, z dodatkową korzyścią wzmacniania stabilizatorów. Wersja stojąca angażuje więcej core.",
      "tips": "Kontroluj hantle przez cały zakres ruchu, unikając zderzania ich w górnej fazie i utrzymując stabilny korpus."
     },
     {
      "name": "Arnold Press",
      "desc": "Wielopłaszczyznowe ćwiczenie na barki, angażujące wszystkie trzy aktony mięśnia naramiennego. Ruch obrotowy zwiększa zakres pracy mięśni.",
      "tips": "Rozpocznij z dłońmi skierowanymi do siebie, a w trakcie wyciskania obróć hantle, aby dłonie skierowały się do przodu w górnej pozycji."
     },
     {
      "name": "Wznosy bokiem (Lateral Raise) – stojąc, siedząc, w wychyleniu",
      "desc": "Ćwiczenie izolujące środkowy akton mięśnia naramiennego, kluczowe dla budowania szerokości barków. Różne warianty pozwalają na lepszą izolację.",
      "tips": "Prowadź ruch łokciami, unosząc hantle tylko do wysokości barków, unikając bujania i używania ciężaru zbyt dużego."
     },
     {
      "name": "Wznosy przodem (Front Raise)",
      "desc": "Ćwiczenie izolujące przedni akton mięśnia naramiennego. Pomaga w budowaniu definicji i siły przedniej części barków.",
      "tips": "Kontroluj ruch zarówno w górę, jak i w dół, unikając bujania tułowiem i unoszenia hantli wyżej niż poziom barków."
     },
     {
      "name": "Wznosy w opadzie tułowia / Reverse Fly (tył barku)",
      "desc": "Ćwiczenie izolujące tylny akton mięśnia naramiennego oraz górną część pleców. Kluczowe dla równowagi siłowej i postawy.",
      "tips": "Trzymaj lekko zgięte łokcie i prowadź ruch, rozszerzając ramiona na boki, skupiając się na ściąganiu łopatek."
     },
     {
      "name": "Upright Row z hantlami",
      "desc": "Ćwiczenie angażujące środkowy i przedni akton barków oraz górną część kapturów. Wersja z hantlami pozwala na większy zakres ruchu i niezależną pracę ramion.",
      "tips": "Trzymaj łokcie wysoko i prowadź ruch w górę, kończąc ruch hantlami w okolicy brody, unikaj szarpania."
     },
     {
      "name": "Cubana Press / Cuban Rotation",
      "desc": "Kompleksowe ćwiczenie wzmacniające mięśnie rotatorów mankietu oraz stabilizatory barku. Poprawia mobilność i zdrowie stawu barkowego.",
      "tips": "Wykonuj ruchy powoli i kontrolując, skupiając się na wewnętrznej i zewnętrznej rotacji, z niewielkim ciężarem."
     },
     {
      "name": "One-Arm Dumbbell Press",
      "desc": "Wyciskanie hantli jedną ręką, angażujące głównie przedni i środkowy akton barków, z silnym aspektem stabilizacji core. Wyrównuje dysproporcje siłowe.",
      "tips": "Mocno aktywuj mięśnie brzucha i korpusu, aby utrzymać stabilną pozycję i zapobiec rotacji tułowia podczas wyciskania."
     },
     {
      "name": "Seated Clean / Seated Dumbbell Clean",
      "desc": "Wersja zarzutu hantli z pozycji siedzącej, angażująca dynamicznie przednie i środkowe aktony barków. Buduje siłę eksplozywną i koordynację.",
      "tips": "Skup się na dynamicznym ruchu z biodra i ramienia, aby 'wyrzucić' hantlę na barki, utrzymując stabilność siedzącą."
     },
     {
      "name": "Y-Raise / W-Raise / T-Raise",
      "desc": "Ćwiczenia na tylny akton barków, górną część pleców i mięśnie stabilizujące łopatki. Pomagają w korekcji postawy i zdrowiu barków.",
      "tips": "Wykonuj ruchy powoli i kontrolując, skupiając się na ściąganiu łopatek i angażowaniu tylnych mięśni, używając lekkiego obciążenia."
     }
    ]
   },
   {
    "label": "Ćwiczenia na maszynach",
    "exercises": [
     {
      "name": "Shoulder Press Machine (wyciskanie na maszynie)",
      "desc": "Bezpieczne i izolujące ćwiczenie na przedni i środkowy akton barków, minimalizujące potrzebę stabilizacji. Idealne dla początkujących.",
      "tips": "Ustaw siedzisko tak, aby uchwyty były na wysokości barków, i skup się na płynnym, kontrolowanym wyciskaniu bez szarpania."
     },
     {
      "name": "Iso-Lateral / Hammer Strength Shoulder Press",
      "desc": "Maszyna umożliwiająca niezależne wyciskanie każdej ręki, angażująca głównie przedni i środkowy akton barków. Pomaga w wyrównaniu dysproporcji.",
      "tips": "Wyciskaj każdą stronę niezależnie lub jednocześnie, skupiając się na pełnym zakresie ruchu i kontrolowanym opuszczaniu ciężaru."
     },
     {
      "name": "Lateral Raise Machine (wznosy bokiem na maszynie)",
      "desc": "Izolujące ćwiczenie na środkowy akton mięśnia naramiennego, stabilizujące tułów. Pozwala na skupienie się na pracy docelowej partii.",
      "tips": "Upewnij się, że ramiona są prawidłowo ułożone na podparciach, i wykonuj ruch, unosząc ciężar tylko do wysokości barków."
     },
     {
      "name": "Reverse Pec Deck / Reverse Fly Machine (tył barku)",
      "desc": "Maszynowe ćwiczenie izolujące tylny akton mięśnia naramiennego i mięśnie środkowej części pleców. Pomaga poprawić postawę i zapobiega kontuzjom.",
      "tips": "Ustaw siedzisko tak, aby uchwyty były na wysokości barków, i skup się na ściąganiu łopatek, prowadząc ruch łokciami."
     },
     {
      "name": "Smith Machine Overhead Press",
      "desc": "Wyciskanie nad głowę na maszynie Smitha, angażujące przedni i środkowy akton barków, z większą stabilizacją. Pozwala na bezpieczne podnoszenie większych ciężarów.",
      "tips": "Ustaw ławkę tak, aby sztanga poruszała się w naturalnym łuku dla Twoich barków, i kontroluj ciężar przez cały ruch."
     },
     {
      "name": "Smith Machine Upright Row",
      "desc": "Podciąganie sztangi do brody na maszynie Smitha, angażujące środkowy i przedni akton barków oraz kaptury. Zapewnia stałą ścieżkę ruchu.",
      "tips": "Trzymaj łokcie wysoko i prowadź ruch w górę, kończąc ruch sztangą w okolicy brody, unikaj szarpania."
     },
     {
      "name": "Machine Front Raise",
      "desc": "Maszynowe ćwiczenie izolujące przedni akton mięśnia naramiennego. Stabilizuje tułów, pozwalając na precyzyjną pracę docelowego mięśnia.",
      "tips": "Upewnij się, że ramiona są prawidłowo ułożone na podparciach, i wykonuj ruch, unosząc ciężar tylko do wysokości barków."
     },
     {
      "name": "Shrug Machine",
      "desc": "Maszynowe szrugsy, skupiające się na górnej części mięśni czworobocznych (kapturów). Zapewnia stabilność i pozwala na podnoszenie dużych ciężarów.",
      "tips": "Skup się na unoszeniu barków prosto w górę w kierunku uszu, bez kręcenia nimi, i przytrzymaj na chwilę w szczytowej pozycji."
     }
    ]
   },
   {
    "label": "Ćwiczenia na wyciągu / bramie (Cable)",
    "exercises": [
     {
      "name": "Cable Lateral Raise (wznosy bokiem – jednorącz, oburącz, leaning)",
      "desc": "Ćwiczenie izolujące środkowy akton mięśnia naramiennego, zapewniające stałe napięcie w całym zakresie ruchu. Wersje leaning zwiększają izolację.",
      "tips": "Prowadź ruch łokciami, unosząc linkę tylko do wysokości barków, utrzymując kontrolę i unikając bujania tułowiem."
     },
     {
      "name": "Cable Front Raise",
      "desc": "Ćwiczenie izolujące przedni akton mięśnia naramiennego, zapewniające stałe napięcie. Pomaga w budowaniu definicji i siły przedniej części barków.",
      "tips": "Kontroluj ruch zarówno w górę, jak i w dół, unikając bujania tułowiem i unoszenia linki wyżej niż poziom barków."
     },
     {
      "name": "Face Pull",
      "desc": "Ćwiczenie na tylny akton barków, rotatorów mankietu i mięśnie środkowej części pleców. Kluczowe dla zdrowia barków i równowagi mięśniowej.",
      "tips": "Przyciągaj linkę do twarzy, rozchylając łokcie na zewnątrz, skupiając się na ściąganiu łopatek i zewnętrznej rotacji."
     },
     {
      "name": "Cable Upright Row",
      "desc": "Wersja podciągania sztangi do brody z użyciem wyciągu, angażująca środkowy i przedni akton barków oraz kaptury. Zapewnia stałe napięcie.",
      "tips": "Trzymaj łokcie wysoko i prowadź ruch w górę, kończąc ruch drążkiem w okolicy brody, unikaj szarpania."
     },
     {
      "name": "Cable Reverse Fly / Rear Delt Fly",
      "desc": "Ćwiczenie izolujące tylny akton mięśnia naramiennego oraz górną część pleców, z ciągłym napięciem. Skuteczne dla budowania definicji.",
      "tips": "Trzymaj lekko zgięte łokcie i prowadź ruch, rozszerzając ramiona na boki, skupiając się na ściąganiu łopatek."
     },
     {
      "name": "Single-Arm Cable Press",
      "desc": "Wyciskanie z wyciągu jedną ręką, angażujące głównie przedni akton barków i tricepsy, z silnym aspektem stabilizacji core. Pomaga wyrównać dysproporcje.",
      "tips": "Mocno aktywuj mięśnie brzucha i korpusu, aby utrzymać stabilną pozycję i zapobiec rotacji tułowia podczas wyciskania."
     },
     {
      "name": "Cable External / Internal Rotation (rotator cuff)",
      "desc": "Ćwiczenia wzmacniające mięśnie rotatorów mankietu, kluczowe dla stabilności i zdrowia stawu barkowego. Zapobiegają kontuzjom.",
      "tips": "Wykonuj ruchy powoli i kontrolując, z niewielkim ciężarem, skupiając się na precyzyjnej rotacji ramienia w stawie barkowym."
     },
     {
      "name": "Y-Raise na wyciągu",
      "desc": "Ćwiczenie angażujące tylny akton barków i mięśnie stabilizujące łopatki, z ciągłym napięciem z wyciągu. Poprawia postawę.",
      "tips": "Wykonuj ruch powoli i kontrolując, skupiając się na unoszeniu linki do kształtu litery Y, angażując tylne mięśnie, używając lekkiego obciążenia."
     },
     {
      "name": "High Cable Rear Delt Row",
      "desc": "Wersja wiosłowania angażująca tylny akton barków oraz środkową część pleców. Linka ustawiona wysoko pozwala na inny kąt pracy.",
      "tips": "Przyciągaj linkę do twarzy lub klatki piersiowej, mocno ściągając łopatki i skupiając się na pracy tylnych aktonów barków."
     }
    ]
   },
   {
    "label": "Ćwiczenia z masą ciała (Bodyweight)",
    "exercises": [
     {
      "name": "Pike Push-Up",
      "desc": "Ćwiczenie z masą ciała angażujące głównie przedni akton barków i tricepsy, będące wstępem do pompek w staniu na rękach. Buduje siłę wyciskającą.",
      "tips": "Utrzymuj biodra wysoko i dociśnij pięty do ziemi, kierując głowę w dół i wyciskając się siłą barków."
     },
     {
      "name": "Handstand Push-Up (pompki w staniu na rękach)",
      "desc": "Zaawansowane ćwiczenie z masą ciała na barki, angażujące przedni i środkowy akton, tricepsy i stabilizację całego ciała. Buduje ogromną siłę.",
      "tips": "Rozpocznij od wersji przy ścianie i kontroluj ruch w dół, dotykając głową podłogi, a następnie dynamicznie wyciskaj się w górę."
     },
     {
      "name": "Wall Walk / Handstand Hold",
      "desc": "Ćwiczenia izometryczne i dynamiczne budujące siłę, wytrzymałość i stabilność barków oraz core. Wall Walk jest wstępem do stania na rękach.",
      "tips": "W Wall Walk skup się na kontrolowanym ruchu rękami w kierunku ściany, a w Handstand Hold na aktywnym odpychaniu się od podłoża."
     },
     {
      "name": "Pseudo Planche Push-Up",
      "desc": "Ćwiczenie z masą ciała na przedni akton barków, tricepsy i core, rozwijające siłę potrzebną do planche. Wymaga dużej siły i stabilności.",
      "tips": "Wypchnij ciało do przodu, tak aby barki znalazły się przed dłońmi, a następnie wykonuj pompkę, utrzymując napięty core."
     },
     {
      "name": "Inverted Row (szeroki chwyt – tył barku)",
      "desc": "Ćwiczenie z masą ciała, angażujące tylny akton barków oraz mięśnie pleców, szczególnie górnej części. Wariant z szerokim chwytem mocniej aktywuje tył barków.",
      "tips": "Utrzymaj ciało w prostej linii i mocno ściągaj łopatki do siebie, kierując klatkę piersiową do drążka."
     },
     {
      "name": "Dive Bomber Push-Up",
      "desc": "Dynamiczne ćwiczenie z masą ciała, łączące elementy pompki i wznosów barków, angażujące wszystkie aktony barków oraz tricepsy. Zwiększa mobilność.",
      "tips": "Wykonuj płynny ruch, przechodząc z pozycji 'psa z głową w dół' przez niską pompkę do 'kobry', a następnie cofaj się tym samym ruchem."
     },
     {
      "name": "Shoulder Taps w podporze",
      "desc": "Ćwiczenie izometryczne wzmacniające stabilizację barków i core. Pomaga w poprawie koordynacji i równowagi.",
      "tips": "Utrzymaj biodra stabilnie i unikaj kołysania tułowiem, dotykając barku przeciwną ręką w kontrolowany sposób."
     },
     {
      "name": "Bodyweight Lateral Raise (przy drzwiach / ścianie)",
      "desc": "Ćwiczenie z masą ciała izolujące środkowy akton barków, wykorzystujące opór własnego ciała. Skuteczne bez sprzętu.",
      "tips": "Oprzyj się bokiem o ścianę lub framugę i odpychaj się ramieniem na zewnątrz, skupiając się na pracy środkowego aktonu barku."
     },
     {
      "name": "Scapular Push-Ups / Wall Angels",
      "desc": "Ćwiczenia wzmacniające mięśnie stabilizujące łopatki (serratus anterior) oraz poprawiające mobilność i kontrolę barków. Kluczowe dla zdrowia stawu.",
      "tips": "W Scapular Push-Ups skup się na ruchu wyłącznie łopatkami, a w Wall Angels utrzymuj plecy i ramiona przylegające do ściany podczas ruchu."
     }
    ]
   }
  ],
  "note": "Podział według części barków (orientacyjny):\nPrzedni akton → wyciskania nad głowę, front raise, Arnold Press\nBoczny akton → lateral raise (hantle, linki, maszyna), upright row\nTylny akton → reverse fly, face pull, wznosy w opadzie, reverse pec deck\nTrapy górne → szrugsy, upright row, face pull"
 },
 "biceps": {
  "groups": [
   {
    "label": "Ćwiczenia ze sztangą (Barbell / EZ-Bar)",
    "exercises": [
     {
      "name": "Uginanie ramion ze sztangą prostą (Barbell Curl)",
      "desc": "To podstawowe ćwiczenie budujące masę bicepsów, angażuje obie głowy mięśnia dwugłowego, ze szczególnym akcentem na głowę krótką (wewnętrzną). Skutecznie wzmacnia siłę i rozmiar ramion.",
      "tips": "Unikaj zarzucania tułowiem; ruch powinien być kontrolowany, inicjowany wyłącznie siłą bicepsów."
     },
     {
      "name": "Uginanie ramion ze sztangą łamaną (EZ-Bar Curl)",
      "desc": "Alternatywa dla sztangi prostej, aktywuje biceps, ale dzięki chwytowi węższemu niż barki, pozwala na mniejsze obciążenie nadgarstków. Delikatnie bardziej angażuje głowę długą bicepsa.",
      "tips": "Używaj uchwytu, który jest dla Ciebie najbardziej komfortowy, utrzymując łokcie blisko tułowia."
     },
     {
      "name": "Preacher Curl / Scott Curl (na modlitewniku)",
      "desc": "Ćwiczenie izolujące biceps, minimalizujące zaangażowanie innych mięśni i umożliwiające pełne rozciągnięcie w dolnej fazie. Silnie angażuje głównie głowę krótką bicepsa.",
      "tips": "Nie prostuj ramienia do końca na dole, aby uniknąć nadmiernego obciążenia stawu łokciowego."
     },
     {
      "name": "Spider Curl",
      "desc": "Uginanie ramion wykonywane na ławce skośnej (zazwyczaj leżąc przodem), mocno izolujące biceps poprzez stabilizację tułowia. Doskonale rozwija szczyt bicepsa.",
      "tips": "Łokcie powinny być zablokowane i nie ruszać się do przodu ani do tyłu podczas wykonywania ruchu."
     },
     {
      "name": "Drag Curl",
      "desc": "Wariant uginania ramion, w którym sztanga prowadzona jest blisko tułowia, niemal ocierając się o klatkę piersiową i brzuch. Zwiększa napięcie w bicepsie, minimalizując udział barków.",
      "tips": "Skup się na ściąganiu łokci mocno do tyłu, utrzymując je za linią tułowia, aby zmaksymalizować skurcz bicepsa."
     },
     {
      "name": "Reverse Curl (nachwytem)",
      "desc": "Ćwiczenie angażujące głównie mięsień ramienny i ramienno-promieniowy (przedramię), ale także głowy bicepsa. Poprawia siłę chwytu i wygląd przedramion.",
      "tips": "Utrzymuj nadgarstki prosto i kontroluj ruch, aby uniknąć kompensacji i obciążenia stawów."
     },
     {
      "name": "21s (trzyczęściowe uginanie)",
      "desc": "Intensywna technika składająca się z siedmiu powtórzeń dolnej fazy, siedmiu górnej i siedmiu pełnych. Doskonale zwiększa objętość i intensywność treningu, maksymalnie pompując biceps.",
      "tips": "Używaj lżejszego ciężaru niż zazwyczaj, aby móc wykonać wszystkie fazy technicznie poprawnie."
     },
     {
      "name": "Close-Grip / Wide-Grip Curl",
      "desc": "Zmiana szerokości chwytu w uginaniu sztangą wpływa na aktywację różnych głów bicepsa. Wąski chwyt bardziej angażuje głowę długą (zewnętrzną), szeroki chwyt – głowę krótką (wewnętrzną).",
      "tips": "Przy wąskim chwycie pamiętaj o stabilizacji nadgarstków, przy szerokim unikaj nadmiernego rozciągania barków."
     },
     {
      "name": "Standing / Seated Barbell Curl",
      "desc": "Podstawowe uginanie ramion ze sztangą, wykonywane na stojąco (większe zaangażowanie stabilizatorów) lub siedząc (większa izolacja bicepsa). Buduje masę i siłę bicepsów.",
      "tips": "W pozycji stojącej unikaj bujania się, w siedzącej mocno zaprzyj plecy o oparcie, aby izolować ruch."
     }
    ]
   },
   {
    "label": "Ćwiczenia z hantlami (Dumbbell)",
    "exercises": [
     {
      "name": "Klasyczne uginanie z hantlami (Dumbbell Curl) – stojąc / siedząc",
      "desc": "Ćwiczenie unilateralne lub bilateralne angażujące obie głowy bicepsa, ze swobodą rotacji nadgarstka. Pozwala na skorygowanie dysproporcji siły między ramionami.",
      "tips": "Trzymaj łokcie zablokowane i blisko tułowia, aby uniknąć kompensacji barkami."
     },
     {
      "name": "Hammer Curl (młotkowe)",
      "desc": "Uginanie hantlami chwytem neutralnym (młotkowym), angażujące mięsień ramienny i ramienno-promieniowy, a także obie głowy bicepsa. Buduje grubość ramienia i przedramienia.",
      "tips": "Utrzymuj kciuki skierowane do góry przez cały ruch, zapewniając stałe napięcie w mięśniach przedramienia i ramiennego."
     },
     {
      "name": "Alternating Dumbbell Curl (naprzemienne)",
      "desc": "Uginanie hantlami wykonywane naprzemiennie, pozwala na dłuższą fazę rozciągania jednej ręki, podczas gdy druga pracuje. Zwiększa koncentrację na każdym ramieniu indywidualnie.",
      "tips": "Kontroluj ruch obu rąk; gdy jedna pracuje, druga powinna aktywnie rozciągać się lub stabilizować."
     },
     {
      "name": "Incline Dumbbell Curl (na ławce skośnej)",
      "desc": "Ćwiczenie wykonywane na ławce skośnej, która ustawia ramiona w pozycji za tułowiem, maksymalizując rozciągnięcie głowy długiej bicepsa. Doskonałe dla jej rozwoju.",
      "tips": "Ustaw ławkę na kąt około 45-60 stopni i pozwól ramionom swobodnie zwisać, aby uzyskać pełne rozciągnięcie."
     },
     {
      "name": "Concentration Curl (w oparciu o udo)",
      "desc": "Wysoce izolujące ćwiczenie na biceps, w którym ramię jest oparte o udo, eliminując możliwość oszukiwania. Pozwala na pełne skupienie na skurczu szczytowym bicepsa.",
      "tips": "Skup się na powolnym i kontrolowanym ruchu w dół, aby maksymalnie wykorzystać fazę negatywną."
     },
     {
      "name": "Cross-Body Hammer Curl (pinwheel)",
      "desc": "Wariant uginania młotkowego, gdzie hantel jest uginany po przekątnej ciała, w kierunku przeciwległego barku. Aktywuje mocno mięsień ramienny i ramienno-promieniowy.",
      "tips": "Staraj się dotknąć hantlem przeciwległego barku, maksymalizując skurcz w górnej fazie ruchu."
     },
     {
      "name": "Zottman Curl",
      "desc": "Ćwiczenie angażujące biceps, mięsień ramienny i przedramiona, polegające na uginaniu hantli podchwytem, a następnie opuszczaniu ich nachwytem. Wzmacnia różne partie ramion.",
      "tips": "Kontroluj fazę negatywną (opuszczanie nachwytem), ponieważ jest ona kluczowa dla zaangażowania przedramion."
     },
     {
      "name": "Preacher Curl z hantlem",
      "desc": "Izolowane uginanie ramion z użyciem hantla na modlitewniku, pozwalające na pracę unilateralną i większą swobodę ruchu nadgarstka. Skutecznie rozwija szczyt bicepsa.",
      "tips": "Upewnij się, że cała tylna część ramienia spoczywa na podkładce modlitewnika, by maksymalnie izolować biceps."
     },
     {
      "name": "Spider Curl z hantlami",
      "desc": "Uginanie hantlami wykonywane na ławce skośnej, leżąc przodem, co pozwala na izolację bicepsów i skupienie na szczycie mięśnia. Daje możliwość rotacji nadgarstków.",
      "tips": "Trzymaj łokcie zablokowane w jednej pozycji, unikając ich przesuwania w przód lub w tył podczas ruchu."
     },
     {
      "name": "One-Arm Dumbbell Curl",
      "desc": "Uginanie hantlem jednorącz, pozwalające na pełną koncentrację i maksymalne zaangażowanie jednego bicepsa naraz. Idealne do korekcji asymetrii.",
      "tips": "Drugą ręką możesz podeprzeć się o udo lub stabilizować tułów, aby uniknąć kompensacji."
     }
    ]
   },
   {
    "label": "Ćwiczenia na maszynach",
    "exercises": [
     {
      "name": "Machine Bicep Curl (uginanie na maszynie)",
      "desc": "Ćwiczenie izolujące biceps, zapewniające stałe napięcie i bezpieczny tor ruchu, idealne dla początkujących. Skutecznie rozwija masę i siłę bicepsa.",
      "tips": "Dostosuj ustawienia maszyny do swojego wzrostu, aby łokcie znajdowały się w jednej linii z osią obrotu urządzenia."
     },
     {
      "name": "Preacher Curl Machine / Lever Preacher Curl",
      "desc": "Maszynowa wersja uginania na modlitewniku, gwarantująca stałe napięcie i bezpieczeństwo. Doskonale izoluje biceps, minimalizując udział innych mięśni.",
      "tips": "Wykonuj ruch powoli i kontrolując, zarówno w fazie koncentrycznej, jak i ekscentrycznej, aby maksymalizować zaangażowanie bicepsa."
     },
     {
      "name": "Iso-Lateral Bicep Curl",
      "desc": "Maszyna pozwalająca na niezależną pracę obu ramion, co sprzyja rozwojowi symetrycznemu i korygowaniu dysproporcji. Zapewnia stałe napięcie w bicepsie.",
      "tips": "Skup się na pełnym rozciągnięciu i maksymalnym skurczu w każdej powtórzeniu, pracując nad każdym ramieniem niezależnie."
     },
     {
      "name": "Assisted Chin-Up Machine (podciąganie wspomagane – silny akcent na biceps)",
      "desc": "Podciąganie podchwytem z asystą maszyny, aktywnie angażuje biceps, mięśnie pleców i ramion. Umożliwia naukę podciągania lub zwiększenie objętości treningowej.",
      "tips": "Skup się na inicjowaniu ruchu siłą bicepsów i pleców, a nie nóg, nawet przy wsparciu maszyny."
     },
     {
      "name": "Smith Machine Curl / Drag Curl",
      "desc": "Uginanie ramion na maszynie Smitha, które wymusza stały, pionowy tor ruchu, mocno izolując biceps. Smith Machine Drag Curl wymusza prowadzenie sztangi blisko ciała.",
      "tips": "W Smith Drag Curl aktywnie ściągaj łokcie do tyłu, utrzymując sztangę blisko tułowia dla maksymalnej aktywacji bicepsa."
     }
    ]
   },
   {
    "label": "Ćwiczenia na wyciągu / bramie (Cable)",
    "exercises": [
     {
      "name": "Cable Curl (z drążkiem prostym lub EZ)",
      "desc": "Uginanie ramion na wyciągu z drążkiem, zapewniające stałe napięcie w bicepsie przez cały zakres ruchu. Efektywne dla budowania wytrzymałości i pompy.",
      "tips": "Trzymaj łokcie blisko tułowia i unikaj ich przesuwania w przód, aby utrzymać napięcie w bicepsie."
     },
     {
      "name": "Cable Hammer Curl (z liną)",
      "desc": "Uginanie młotkowe na wyciągu z użyciem liny, angażujące mięsień ramienny, ramienno-promieniowy i obie głowy bicepsa. Doskonałe dla rozwoju grubości ramion.",
      "tips": "Na szczycie ruchu spróbuj rozciągnąć linę, zwiększając skurcz w mięśniach ramion i przedramion."
     },
     {
      "name": "Single-Arm Cable Curl",
      "desc": "Uginanie ramion jednorącz na wyciągu, umożliwiające pełną koncentrację na pracy bicepsa i korekcję asymetrii siły. Zapewnia stałe napięcie mięśniowe.",
      "tips": "Wykonuj ruch powoli i z pełną kontrolą, skupiając się na izolacji i skurczu bicepsa, unikając bujania tułowiem."
     },
     {
      "name": "Bayesian Curl (tyłem do wyciągu)",
      "desc": "Uginanie ramion z wyciągiem dolnym, stojąc tyłem do maszyny, z linkami przechodzącymi między nogami. Zwiększa zakres ruchu i rozciągnięcie bicepsa w dolnej fazie.",
      "tips": "Utrzymuj tułów stabilnie i pozwól ramionom na pełne rozciągnięcie w dolnej fazie ruchu, kontrolując ciężar."
     },
     {
      "name": "Overhead Cable Curl",
      "desc": "Uginanie ramion z wyciągami ustawionymi wysoko, w pozycji, gdzie ramiona są uniesione nad głowę. Maksymalizuje rozciągnięcie i skurcz bicepsa, szczególnie głowy długiej.",
      "tips": "Utrzymuj łokcie wysoko i stabilnie, skupiając się na przyciąganiu dłoni do głowy, by intensywnie zaangażować biceps."
     },
     {
      "name": "Cable Preacher Curl",
      "desc": "Wersja uginania na modlitewniku z użyciem wyciągu, zapewniająca stałe napięcie mięśniowe i izolację bicepsa. Skuteczna dla rozwoju szczytu bicepsa.",
      "tips": "Używaj niższej wagi niż przy sztandze, aby utrzymać pełną kontrolę i unikać szarpania na wyciągu."
     },
     {
      "name": "High Cable Curl / Crucifix Curl",
      "desc": "Uginanie z wyciągami ustawionymi wysoko, stojąc pomiędzy nimi z ramionami rozłożonymi na boki. Silnie izoluje biceps, oferując intensywny szczytowy skurcz.",
      "tips": "Utrzymuj łokcie na stałej wysokości, koncentrując się na 'ściskaniu' bicepsów i przyciąganiu rąk do uszu."
     },
     {
      "name": "Reverse Cable Curl",
      "desc": "Uginanie nachwytem z wyciągiem, angażujące głównie mięsień ramienny i ramienno-promieniowy, a także biceps. Poprawia siłę przedramion i chwytu.",
      "tips": "Trzymaj nadgarstki prosto i kontroluj ciężar, by uniknąć nadmiernego obciążenia stawów nadgarstkowych."
     }
    ]
   },
   {
    "label": "Ćwiczenia z masą ciała (Bodyweight)",
    "exercises": [
     {
      "name": "Chin-Ups (podciąganie podchwytem)",
      "desc": "Klasyczne ćwiczenie złożone, mocno angażujące biceps, najszerszy grzbietu i mięśnie ramion. Zwiększa siłę funkcjonalną i masę mięśniową górnej części ciała.",
      "tips": "Skup się na 'ściąganiu' łokci w dół i do tyłu, wyciskając powietrze, aby maksymalnie aktywować biceps i plecy."
     },
     {
      "name": "Inverted Row podchwytem (wiosłowanie australijskie)",
      "desc": "Wiosłowanie z własnym ciężarem ciała, w którym nogi opierają się o podłoże, a tułów jest uginany pod drążkiem. Angażuje biceps, najszerszy grzbietu i core, z mniejszym obciążeniem niż podciąganie.",
      "tips": "Utrzymuj ciało w prostej linii od stóp do głowy, unikając opuszczania bioder, aby zaangażować mięśnie brzucha."
     },
     {
      "name": "Towel Curl / Doorway Curl",
      "desc": "Uginanie z użyciem ręcznika, który służy jako uchwyt, z drążkiem lub ościeżnicą. Intensywnie wzmacnia chwyt i angażuje biceps, mięsień ramienny i przedramię.",
      "tips": "Upewnij się, że ręcznik jest mocno zawiązany i wytrzymały, aby uniknąć wypadków."
     },
     {
      "name": "TRX / Suspension Bicep Curl",
      "desc": "Uginanie bicepsów z użyciem taśm TRX lub podobnych systemów podwieszanych, wykorzystujące ciężar własnego ciała. Zwiększa stabilizację i angażuje mięśnie głębokie.",
      "tips": "Reguluj trudność, zmieniając kąt ciała względem podłoża – im bardziej poziomo, tym trudniej."
     },
     {
      "name": "Commando Pull-Ups",
      "desc": "Wariant podciągania, w którym dłonie są ułożone jedna za drugą na drążku, a ciało podciągane jest z boku. Intensywnie angażuje biceps i mięśnie pleców unilateralnie.",
      "tips": "Skup się na 'ciągnięciu' barku do drążka, utrzymując stabilność tułowia i unikając rotacji."
     },
     {
      "name": "Sternum Chin-Ups / Gironda Chin-Ups",
      "desc": "Zaawansowana forma podciągania podchwytem, gdzie celem jest dotknięcie drążka klatką piersiową (mostkiem). Maksymalnie angażuje biceps i najszerszy grzbietu.",
      "tips": "Odchylaj się mocno do tyłu i ściągaj łokcie w dół i do tyłu, aby osiągnąć pełny zakres ruchu."
     },
     {
      "name": "One-Arm Chin-Up (zaawansowane)",
      "desc": "Bardzo zaawansowane ćwiczenie siłowe, podciąganie podchwytem na jednej ręce. Niezwykle mocno angażuje biceps, mięśnie pleców i core, budując ogromną siłę funkcjonalną.",
      "tips": "Rozpocznij od pracy z negatywami i wspomaganymi podciągnięciami, aby stopniowo budować siłę potrzebną do tego ćwiczenia."
     }
    ]
   }
  ],
  "note": "Podział według części bicepsa (orientacyjny):\nGłowa długa (szczyt) → incline curl, spider curl, Bayesian curl\nGłowa krótka → preacher curl, concentration curl, close-grip\nBrachialis (grubość) → hammer curl, reverse curl, cross-body hammer\nOgólna masa → barbell curl, EZ-bar curl, chin-ups"
 },
 "triceps": {
  "groups": [
   {
    "label": "Ćwiczenia ze sztangą (Barbell / EZ-Bar)",
    "exercises": [
     {
      "name": "Wyciskanie sztangi wąskim chwytem (Close-Grip Bench Press)",
      "desc": "To ćwiczenie buduje masę i siłę tricepsów, angażując wszystkie trzy głowy mięśnia, ze szczególnym naciskiem na głowę boczną i środkową. Wzmacnia również klatkę piersiową i barki.",
      "tips": "Utrzymuj łokcie blisko tułowia podczas ruchu, aby maksymalnie zaangażować triceps i zmniejszyć obciążenie stawów barkowych."
     },
     {
      "name": "Wyciskanie francuskie leżąc / Skull Crusher",
      "desc": "Izoluje triceps, koncentrując się na rozbudowie masy i rzeźby, szczególnie głowy długiej. Doskonale rozwija górną część tricepsa.",
      "tips": "Trzymaj łokcie stabilnie i skierowane do przodu, a ruch wykonuj głównie w stawie łokciowym, kontrolując opuszczanie sztangi za głowę, nie na czoło."
     },
     {
      "name": "Wyciskanie francuskie siedząc / stojąc (Overhead Extension)",
      "desc": "Skutecznie rozwija głowę długą tricepsa, przyczyniając się do jego pełniejszego wyglądu i większej masy. Pomaga w zwiększeniu zakresu ruchu i elastyczności.",
      "tips": "Nie rozszerzaj łokci na boki; utrzymuj je blisko głowy, by maksymalnie skupić napięcie na tricepsie i chronić barki."
     },
     {
      "name": "JM Press",
      "desc": "Jest to hybryda wyciskania wąskiego i francuskiego, mocno angażująca wszystkie głowy tricepsa, zwłaszcza głowę medialną. Buduje siłę i masę w średnim zakresie ruchu.",
      "tips": "Opuszczaj sztangę w stronę mostka, ale zamiast pełnego dotknięcia, pozwól, aby tricepsy wykonały większość pracy, jednocześnie lekko cofając łokcie."
     },
     {
      "name": "Reverse-Grip Bench Press (nachwytem odwrotnym)",
      "desc": "Mimo że skupia się na klatce piersiowej, mocno angażuje tricepsy, zwłaszcza głowę medialną. Jest to odmiana, która może zapewnić inne bodźce mięśniom.",
      "tips": "Użyj chwytu na szerokość barków, aby maksymalnie wykorzystać tricepsy, ale pamiętaj o lżejszym ciężarze, niż przy tradycyjnym wyciskaniu."
     },
     {
      "name": "Floor Press wąskim chwytem",
      "desc": "Ogranicza zakres ruchu, koncentrując się na górnej fazie wyciskania, co mocno angażuje tricepsy. Skutecznie buduje siłę bez obciążania barków i stabilizuje ruch.",
      "tips": "Utrzymuj łokcie przy ciele i kontroluj ruch, zatrzymując sztangę tuż przed dotknięciem podłogi, by utrzymać napięcie tricepsa."
     }
    ]
   },
   {
    "label": "Ćwiczenia z hantlami (Dumbbell)",
    "exercises": [
     {
      "name": "Wyciskanie francuskie z hantlami leżąc (Dumbbell Skull Crusher)",
      "desc": "Pozwala na niezależną pracę każdej ręki, korygując dysbalans mięśniowy i mocno angażując głowę długą tricepsa. Zwiększa zakres ruchu i izolację.",
      "tips": "Opuszczaj hantle po bokach głowy, nie na nią, utrzymując łokcie skierowane do przodu, aby zmaksymalizować rozciągnięcie tricepsa."
     },
     {
      "name": "Prostowanie ramion z hantlem nad głową (Overhead Dumbbell Extension) – oburącz lub jednorącz",
      "desc": "Bardzo efektywnie rozwija głowę długą tricepsa, nadając mu pełniejszy kształt i zwiększając masę. Wersja jednorącz pomaga w korekcji asymetrii siły.",
      "tips": "Trzymaj hantel stabilnie i nie pozwól, aby łokcie rozchodziły się na boki; ruch powinien odbywać się tylko w stawach łokciowych."
     },
     {
      "name": "Kickback z hantlem (Triceps Kickback)",
      "desc": "Doskonale izoluje głowę boczną tricepsa, przyczyniając się do jego definicji i twardości. Wzmacnia mięsień w pozycji pełnego napięcia.",
      "tips": "Utrzymaj ramię równolegle do podłogi i wykonuj ruch tylko w stawie łokciowym, wyciskając hantel maksymalnie do tyłu."
     },
     {
      "name": "Close-Grip Dumbbell Press",
      "desc": "Angażuje wszystkie głowy tricepsa, podobnie jak wyciskanie sztangi wąskim chwytem, ale z większą swobodą ruchu i izolacją. Pomaga w budowaniu ogólnej masy tricepsa.",
      "tips": "Przyciśnij hantle do siebie podczas wyciskania, aby zwiększyć napięcie w tricepsach i poprawić ich aktywację."
     },
     {
      "name": "Tate Press",
      "desc": "Unikalne ćwiczenie celujące w głowę boczną i medialną tricepsa, zapewniające silne uczucie palenia. Buduje definicję i wytrzymałość mięśniową.",
      "tips": "Trzymaj hantle skierowane pionowo w górę i opuszczaj je, dotykając końcówkami hantli górnej części klatki piersiowej, utrzymując łokcie na boki."
     },
     {
      "name": "One-Arm Overhead Extension",
      "desc": "Izoluje jedną stronę tricepsa, intensywnie pracując nad głową długą. Poprawia symetrię i siłę funkcjonalną.",
      "tips": "Utrzymuj łokieć blisko głowy i stabilnie, aby ruch był kontrolowany i skoncentrowany wyłącznie na tricepsie."
     },
     {
      "name": "Lying Dumbbell Extension (w poprzek twarzy)",
      "desc": "Wariant francuskiego wyciskania z hantlami, który może zapewnić inny kąt napięcia dla głowy długiej tricepsa. Pomaga w rozbudowie i definicji mięśnia.",
      "tips": "Opuszczaj hantle tak, aby końce dotykały policzków lub obszaru tuż obok uszu, utrzymując łokcie wąsko."
     }
    ]
   },
   {
    "label": "Ćwiczenia na maszynach",
    "exercises": [
     {
      "name": "Machine Triceps Extension / Lever Extension",
      "desc": "Zapewnia stałe napięcie i izolację tricepsa, idealne do pracy nad definicją i wytrzymałością mięśnia. Zmniejsza ryzyko kontuzji dzięki ustabilizowanej maszynie.",
      "tips": "Ustaw maszynę tak, aby łokcie były w jednej linii z osią obrotu ramion maszyny i skup się na pełnym wyproście ramienia."
     },
     {
      "name": "Assisted Dip Machine (dipy wspomagane)",
      "desc": "Pozwala na wykonywanie dipów z mniejszym obciążeniem, rozwijając siłę tricepsa i ogólną masę. Aktywuje wszystkie trzy głowy tricepsa oraz mięśnie klatki piersiowej.",
      "tips": "Upewnij się, że opuszczasz ciało do momentu, gdy ramiona są równoległe do podłoża, by zapewnić pełny zakres ruchu tricepsom."
     },
     {
      "name": "Triceps Press Machine",
      "desc": "Umożliwia efektywną izolację tricepsa, oferując kontrolowany ruch i stałe napięcie. Idealny dla początkujących i do pracy nad definicją.",
      "tips": "Wyprostuj ramiona całkowicie, by w pełni skurczyć triceps, i kontroluj fazę negatywną ruchu, by zmaksymalizować pracę mięśni."
     },
     {
      "name": "Smith Machine Close-Grip Bench Press",
      "desc": "Zapewnia stabilny tor ruchu, co pozwala na skupienie się na pracy tricepsa bez obawy o balans sztangi. Buduje siłę i masę wszystkich głów tricepsa.",
      "tips": "Zachowaj wąski chwyt i opuszczaj sztangę w kierunku dolnej części klatki piersiowej, utrzymując łokcie blisko tułowia."
     },
     {
      "name": "Smith Machine Skull Crusher",
      "desc": "Oferuje kontrolowany ruch dla izolacji tricepsa, szczególnie głowy długiej, zmniejszając ryzyko kontuzji w porównaniu do wolnych ciężarów. Idealne do budowania masy i definicji.",
      "tips": "Ustaw ławkę tak, aby sztanga opadała za głowę, a ruch był wykonywany wyłącznie w stawach łokciowych, utrzymując je stabilnie."
     },
     {
      "name": "Iso-Lateral Triceps Extension",
      "desc": "Pozwala na niezależną pracę każdej ręki, eliminując dysproporcje siłowe w tricepsach i poprawiając izolację. Skupia się na równomiernym rozwoju wszystkich głów mięśnia.",
      "tips": "Skup się na pełnym wyproście ramienia i silnym skurczu na szczycie ruchu, kontrolując powrót ciężaru."
     }
    ]
   },
   {
    "label": "Ćwiczenia na wyciągu / bramie (Cable)",
    "exercises": [
     {
      "name": "Prostowanie przedramion na wyciągu (Triceps Pushdown) – drążek prosty, V-bar, lina",
      "desc": "Doskonale izoluje triceps, szczególnie głowę boczną i medialną, budując definicję i wytrzymałość. Różne uchwyty pozwalają na akcentowanie różnych części mięśnia.",
      "tips": "Utrzymaj łokcie przy ciele i nie ruszaj ramionami; ruch powinien odbywać się wyłącznie w stawach łokciowych, z pełnym wyprostem na dole."
     },
     {
      "name": "Overhead Cable Extension (prostowanie nad głową)",
      "desc": "Efektywnie angażuje głowę długą tricepsa, zapewniając stałe napięcie mięśnia w pełnym zakresie ruchu. Pomaga w budowaniu masy i rzeźby górnej części tricepsa.",
      "tips": "Utrzymaj ramiona blisko głowy i łokcie skierowane do przodu, prostując ramiona całkowicie, by zmaksymalizować skurcz tricepsa."
     },
     {
      "name": "Single-Arm Cable Pushdown / Extension",
      "desc": "Umożliwia maksymalną izolację i koncentrację na pracy jednej strony tricepsa, korygując asymetrie. Wzmacnia głowy boczną i medialną.",
      "tips": "Zablokuj łokieć blisko ciała i wykonuj ruch tylko w stawie łokciowym, kontrolując ciężar zarówno w fazie pozytywnej, jak i negatywnej."
     },
     {
      "name": "Cable Kickback",
      "desc": "Zapewnia stałe napięcie i izolację głowy bocznej tricepsa, poprawiając definicję i twardość mięśnia. Zmniejsza ryzyko bujania się ciałem.",
      "tips": "Utrzymaj ramię równolegle do podłogi i skup się na pełnym wyproście, wyciskając rękojeść maksymalnie do tyłu, by mocno napiąć triceps."
     },
     {
      "name": "Reverse-Grip Pushdown",
      "desc": "Aktywuje triceps, ze szczególnym naciskiem na głowę medialną, co może dać nowe bodźce do wzrostu. Pomaga w budowaniu siły i definicji tej części mięśnia.",
      "tips": "Użyj podchwytu i utrzymuj łokcie blisko ciała, prostując ramiona w dół, by poczuć silne napięcie w dolnej części tricepsa."
     },
     {
      "name": "High Cable Overhead Extension",
      "desc": "Wariant overhead extension, który zapewnia stałe napięcie w górnej fazie ruchu, skutecznie angażując głowę długą tricepsa. Buduje masę i pełnię mięśnia.",
      "tips": "Stań tyłem do wyciągu i chwyć linę z góry, utrzymując łokcie blisko głowy, a ruch wykonuj tylko w stawach łokciowych."
     },
     {
      "name": "Cable Lying Extension",
      "desc": "Zapewnia stałe napięcie w pełnym zakresie ruchu, skutecznie izolując głowę długą tricepsa. Pomaga w budowaniu masy i definicji mięśnia, minimalizując obciążenie stawów.",
      "tips": "Połóż się na ławce, ustaw linkę na niskim bloczku i prostuj ramiona, prowadząc linę za głowę, kontrolując fazę negatywną."
     }
    ]
   },
   {
    "label": "Ćwiczenia z masą ciała (Bodyweight)",
    "exercises": [
     {
      "name": "Dipy na poręczach (Triceps Dips) – z obciążeniem lub bez",
      "desc": "Potężne ćwiczenie na budowę masy i siły wszystkich trzech głów tricepsa, angażujące również mięśnie klatki piersiowej. Zaawansowana forma wymaga dużej siły.",
      "tips": "Utrzymuj tułów prosto i łokcie blisko ciała, opuszczając się do momentu, gdy ramiona znajdą się równolegle do podłogi."
     },
     {
      "name": "Bench Dips / Chair Dips (dipy na ławce)",
      "desc": "Skuteczne ćwiczenie na tricepsy, szczególnie głowę medialną i boczną, które można wykonywać w domu. Buduje wytrzymałość i podstawową siłę.",
      "tips": "Trzymaj biodra blisko ławki i opuszczaj ciało do momentu, gdy ramiona znajdą się pod kątem 90 stopni, kontrolując ruch."
     },
     {
      "name": "Diamond Push-Ups (pompki diamentowe)",
      "desc": "Intensywnie angażuje tricepsy, zwłaszcza głowę medialną i boczną, oraz mięśnie klatki piersiowej. Wzmacnia siłę i wytrzymałość ramion.",
      "tips": "Ustaw dłonie blisko siebie, tworząc kształt diamentu pod klatką piersiową, i utrzymuj łokcie blisko ciała podczas opuszczania."
     },
     {
      "name": "Close-Grip Push-Ups",
      "desc": "Skutecznie angażuje tricepsy, podobnie jak pompki diamentowe, ale z nieco szerszym rozstawem dłoni. Buduje siłę i wytrzymałość mięśniową.",
      "tips": "Ułóż dłonie na szerokość barków, ale blisko tułowia, i utrzymuj łokcie skierowane do tyłu, a nie na boki."
     },
     {
      "name": "Pike Push-Ups (akcent na triceps)",
      "desc": "Angażuje triceps oraz mięśnie naramienne, budując siłę w górnej części ciała. Jest to krok w kierunku pompek w staniu na rękach.",
      "tips": "Podnieś biodra wysoko, tworząc literę V z ciałem, i opuszczaj głowę w kierunku podłogi, z łokciami blisko ciała, aby zaangażować triceps."
     },
     {
      "name": "Bodyweight Skull Crusher / Kneeling Extension",
      "desc": "Wersja francuskiego wyciskania z masą ciała, skupiająca się na głowie długiej tricepsa. Wymaga dobrej kontroli i siły mięśniowej.",
      "tips": "Uklęknij przed poręczą lub niskim drążkiem, chwyć go i pochyl się do przodu, opuszczając głowę w kierunku rąk, utrzymując łokcie wąsko."
     },
     {
      "name": "Floor Dips",
      "desc": "Prosta odmiana dipów, która angażuje tricepsy i mięśnie klatki piersiowej, szczególnie głowę medialną i boczną. Idealne do rozgrzewki lub jako finisher.",
      "tips": "Połóż dłonie za biodrami, palcami skierowanymi w stronę stóp, i opuszczaj biodra do podłogi, utrzymując łokcie zgięte."
     },
     {
      "name": "Handstand Push-Up (zaawansowane)",
      "desc": "Bardzo wymagające ćwiczenie, które mocno angażuje tricepsy, barki i mięśnie tułowia. Buduje ekstremalną siłę i kontrolę ciała.",
      "tips": "Kontroluj opuszczanie, aby głowa dotknęła podłogi, a następnie wyprostuj ramiona, by wrócić do pozycji wyjściowej, utrzymując ciało napięte."
     }
    ]
   }
  ],
  "note": "Podział według głów tricepsa (orientacyjny):\nGłowa długa → ćwiczenia nad głową (overhead extensions), skull crushers\nGłowa boczna → pushdowny, kickbacki, diamond push-ups\nGłowa przyśrodkowa → close-grip presses, reverse-grip, dips\nOgólna masa → close-grip bench press, dips, pushdowns"
 },
 "przedramiona": {
  "groups": [
   {
    "label": "Ćwiczenia ze sztangą (Barbell / EZ-Bar)",
    "exercises": [
     {
      "name": "Zginanie nadgarstków podchwytem (Wrist Curl)",
      "desc": "To ćwiczenie wzmacnia zginacze nadgarstków i przedramion, angażując głównie wewnętrzną stronę przedramienia. Skupia się na zwiększaniu siły chwytu i masy mięśniowej.",
      "tips": "Wykonuj pełny zakres ruchu, opuszczając sztangę/hantle aż do rozciągnięcia nadgarstków i zginając maksymalnie w górę, kontrolując ruch."
     },
     {
      "name": "Prostowanie nadgarstków nachwytem (Reverse Wrist Curl)",
      "desc": "Ćwiczenie to wzmacnia prostowniki nadgarstków i przedramion, rozwijając mięśnie po zewnętrznej stronie przedramienia. Pomaga w równowadze mięśniowej i zapobieganiu kontuzjom.",
      "tips": "Ruch powinien być powolny i kontrolowany, skupiając się na czuciu pracy mięśni, nie na podnoszeniu ciężaru."
     },
     {
      "name": "Zginanie nadgarstków za plecami (Behind-the-Back Wrist Curl)",
      "desc": "Angażuje głównie zginacze nadgarstków, podobnie jak standardowy wrist curl, ale zmienia kąt obciążenia. Może dawać unikalne uczucie skurczu w wewnętrznej części przedramienia.",
      "tips": "Używaj mniejszego ciężaru i skup się na izolacji ruchu nadgarstka, aby uniknąć kompensacji ramion."
     },
     {
      "name": "Reverse Curl (uginanie nachwytem)",
      "desc": "To ćwiczenie angażuje mięsień ramienno-promieniowy (brachioradialis) oraz prostowniki przedramion, rozwijając siłę i masę w zewnętrznej części przedramion i bicepsie. Poprawia siłę chwytu.",
      "tips": "Trzymaj łokcie blisko ciała i unikaj bujania, skupiając się na ściskaniu mięśni przedramienia na szczycie ruchu."
     },
     {
      "name": "Finger Curl (uginanie palców)",
      "desc": "Ćwiczenie to wzmacnia zginacze palców i przedramion, bezpośrednio poprawiając siłę chwytu i zdolność do trzymania ciężarów. Jest kluczowe dla sportów wymagających mocnego ściskania.",
      "tips": "Pozwól sztangielkom zjechać na palce, a następnie ściśnij je do dłoni, by w pełni aktywować mięśnie zginaczy palców."
     },
     {
      "name": "Standing Wrist Curl",
      "desc": "To odmiana zginania nadgarstków podchwytem, która angażuje zginacze przedramion, wzmacniając wewnętrzną stronę przedramienia i chwyt. Umożliwia użycie większego ciężaru.",
      "tips": "Wykonuj powolne, kontrolowane ruchy, utrzymując nadgarstki ponad ławką lub kolanami, aby izolować pracę mięśni."
     }
    ]
   },
   {
    "label": "Ćwiczenia z hantlami (Dumbbell)",
    "exercises": [
     {
      "name": "Zginanie nadgarstków z hantlami (palms-up)",
      "desc": "Skupia się na zginaczach nadgarstków i przedramion, wzmacniając wewnętrzną część przedramion oraz siłę chwytu. Hantle pozwalają na większy zakres ruchu.",
      "tips": "Utrzymaj stałą pozycję przedramion, ruch powinien odbywać się wyłącznie w nadgarstkach, kontrolując ciężar przez cały zakres ruchu."
     },
     {
      "name": "Prostowanie nadgarstków z hantlami (palms-down)",
      "desc": "Angażuje prostowniki nadgarstków i przedramion, wzmacniając zewnętrzną część przedramion. Pomaga w zapobieganiu nierównowagi mięśniowej i kontuzjom.",
      "tips": "Upewnij się, że ruch jest płynny i kontrolowany, nie używaj rozpędu, aby unieść ciężar."
     },
     {
      "name": "Hammer Curl (młotkowe – mocny akcent na brachioradialis)",
      "desc": "To ćwiczenie mocno akcentuje mięsień ramienno-promieniowy (brachioradialis), budując grubość przedramienia oraz siłę chwytu. Angażuje także biceps.",
      "tips": "Trzymaj kciuki skierowane do góry przez cały ruch, utrzymując łokcie stabilnie przy ciele i unikając bujania."
     },
     {
      "name": "Zottman Curl",
      "desc": "To złożone ćwiczenie angażuje zarówno biceps (w fazie koncentrycznej podchwytem) jak i mięsień ramienno-promieniowy/prostowniki przedramienia (w fazie ekscentrycznej nachwytem). Rozwija całe przedramiona i bicepsy.",
      "tips": "Skup się na kontrolowanym opuszczaniu ciężaru w fazie ekscentrycznej, aby maksymalnie zaangażować prostowniki przedramion."
     },
     {
      "name": "One-Arm Wrist Curl",
      "desc": "Jednoręczne zginanie nadgarstków pozwala na większą koncentrację na zginaczach przedramion, identyfikując i korygując ewentualne dysproporcje siły. Wzmacnia wewnętrzną stronę przedramienia i chwyt.",
      "tips": "Drugą ręką możesz ustabilizować przedramię ćwiczącej ręki, aby zapewnić pełną izolację ruchu nadgarstka."
     },
     {
      "name": "Pronacja / Supinacja z hantlem",
      "desc": "To ćwiczenie wzmacnia mięśnie odpowiedzialne za obracanie przedramienia (pronatory i supinatory), zwiększając mobilność i siłę rotacyjną nadgarstków. Ważne dla sportów rakietowych i rzutowych.",
      "tips": "Upewnij się, że łokieć jest stabilny i ruch pochodzi wyłącznie z obrotu przedramienia, używając niewielkiego ciężaru."
     },
     {
      "name": "Grip Crush (ściskanie hantla końcówkami palców)",
      "desc": "Ćwiczenie to koncentruje się na sile ścisku palców i wzmacnianiu zginaczy palców oraz wewnętrznych mięśni dłoni. Poprawia siłę chwytu punktowego.",
      "tips": "Zacznij od lekkiego ciężaru i skup się na powolnym, maksymalnym ściskaniu końcówkami palców, aż hantel znajdzie się w dłoni."
     }
    ]
   },
   {
    "label": "Ćwiczenia na maszynach",
    "exercises": [
     {
      "name": "Wrist Curl Machine",
      "desc": "Maszyna do zginania nadgarstków izoluje zginacze przedramion, zapewniając stałe napięcie i bezpieczeństwo. Pomaga w budowaniu masy i siły wewnętrznej części przedramion.",
      "tips": "Ustaw maszynę tak, aby nadgarstki miały pełen zakres ruchu, a przedramiona były stabilnie oparte."
     },
     {
      "name": "Reverse Wrist Curl Machine",
      "desc": "Ta maszyna izoluje prostowniki nadgarstków, wzmacniając zewnętrzną część przedramion. Jest skuteczna w budowaniu zrównoważonej siły i zapobieganiu urazom.",
      "tips": "Kontroluj ciężar przez cały zakres ruchu, nie pozwalając maszynie na szybkie opadanie."
     },
     {
      "name": "Grip Machine / Hand Gripper Machine",
      "desc": "Urządzenia te wzmacniają ogólną siłę chwytu, angażując mięśnie zginaczy dłoni i przedramion. Są doskonałe do budowania wytrzymałości chwytu.",
      "tips": "Wykonuj powtórzenia z pełnym ściskaniem i powolnym zwalnianiem, aby maksymalnie aktywować mięśnie."
     },
     {
      "name": "Cable Wrist Curl / Extension",
      "desc": "Użycie wyciągu do zginania lub prostowania nadgarstków zapewnia stałe napięcie mięśniowe przez cały zakres ruchu. Skutecznie angażuje zarówno zginacze, jak i prostowniki przedramion.",
      "tips": "Ustaw ławkę i wyciąg tak, aby uzyskać płynny ruch i pełne zaangażowanie mięśni bez szarpania."
     },
     {
      "name": "Lever Forearm Machine",
      "desc": "Specjalistyczna maszyna do przedramion, która pozwala na precyzyjną izolację różnych ruchów nadgarstka, takich jak pronacja, supinacja, zginanie czy prostowanie. Skuteczna w budowaniu siły i wytrzymałości przedramion.",
      "tips": "Skoncentruj się na płynnym, kontrolowanym ruchu, dostosowując opór do swoich możliwości, aby uniknąć kontuzji."
     }
    ]
   },
   {
    "label": "Ćwiczenia na wyciągu / bramie (Cable)",
    "exercises": [
     {
      "name": "Cable Wrist Curl (podchwytem)",
      "desc": "Ćwiczenie to angażuje zginacze nadgarstków, wzmacniając wewnętrzną stronę przedramion i siłę chwytu. Wyciąg zapewnia stałe napięcie, co jest korzystne dla rozwoju mięśni.",
      "tips": "Przyjmij stabilną pozycję, opierając przedramiona o uda lub ławkę i koncentrując się na kontrolowanym zgięciu nadgarstków."
     },
     {
      "name": "Cable Reverse Wrist Curl (nachwytem)",
      "desc": "Angażuje prostowniki nadgarstków i przedramion, budując siłę po zewnętrznej stronie przedramion. Wyciąg zapewnia płynny opór, co jest skuteczne w budowaniu masy.",
      "tips": "Upewnij się, że tylko nadgarstki się poruszają, a łokcie pozostają w stabilnej pozycji, aby izolować mięśnie."
     },
     {
      "name": "Behind-the-Back Cable Curl",
      "desc": "Ta odmiana angażuje zginacze nadgarstków w nieco inny sposób niż standardowe ćwiczenia, dzięki czemu aktywuje mięśnie z nowej perspektywy. Wzmacnia wewnętrzną stronę przedramion i chwyt.",
      "tips": "Użyj lekkiego ciężaru i skoncentruj się na czuciu pracy mięśni, utrzymując stałe napięcie poprzez wyciąg."
     },
     {
      "name": "Cable Reverse Curl",
      "desc": "Ćwiczenie to rozwija mięsień ramienno-promieniowy (brachioradialis) oraz prostowniki przedramion, budując siłę i masę w zewnętrznej części przedramion. Wyciąg zapewnia stałe napięcie.",
      "tips": "Zachowaj stabilną postawę, unikaj kołysania tułowiem i skup się na kontrolowanym ugięciu i wyproście."
     },
     {
      "name": "Single-Arm Cable Wrist Extension",
      "desc": "Jednoręczne prostowanie nadgarstków z wyciągiem pozwala na izolację prostowników przedramienia, korygowanie dysproporcji i precyzyjne wzmocnienie. Wzmacnia zewnętrzną stronę przedramion.",
      "tips": "Upewnij się, że przedramię jest stabilne, a ruch odbywa się wyłącznie w nadgarstku, maksymalizując napięcie."
     },
     {
      "name": "Rope Wrist Roller (z liną)",
      "desc": "To dynamiczne ćwiczenie buduje wytrzymałość i siłę zarówno zginaczy, jak i prostowników przedramion. Jest świetne do ogólnego wzmacniania przedramion i siły chwytu.",
      "tips": "Zacznij od mniejszego ciężaru i skup się na płynnym, kontrolowanym nawijaniu i rozwijaniu liny, używając pełnego zakresu ruchu nadgarstków."
     }
    ]
   },
   {
    "label": "Ćwiczenia z masą ciała (Bodyweight)",
    "exercises": [
     {
      "name": "Dead Hang / Zwis na drążku",
      "desc": "Zwis na drążku to doskonałe ćwiczenie na wzmocnienie siły chwytu i wytrzymałości przedramion, angażując wszystkie mięśnie dłoni i przedramion. Poprawia również siłę ramion i pleców.",
      "tips": "Staraj się wisieć tak długo, jak to możliwe, z ramionami w pełnym rozciągnięciu, koncentrując się na mocnym uścisku drążka."
     },
     {
      "name": "Towel Hang / Towel Pull-Up",
      "desc": "Ćwiczenie to ekstremalnie wzmacnia siłę chwytu i przedramion, angażując mięśnie dłoni i przedramion w nietypowy sposób. Wymaga większej aktywacji ze względu na niestabilność ręcznika.",
      "tips": "Upewnij się, że ręcznik jest solidnie zawieszony i użyj mocnego, pełnego chwytu, aby utrzymać pozycję lub wykonać podciągnięcia."
     },
     {
      "name": "Fingertip Push-Ups (pompki na palcach)",
      "desc": "Pompki na palcach wzmacniają zginacze palców, mięśnie dłoni i przedramion, poprawiając siłę chwytu i stabilność nadgarstka. Zwiększają wytrzymałość stawów palców.",
      "tips": "Zacznij od łatwiejszej wersji (np. na kolanach) i stopniowo zwiększaj trudność, dbając o to, aby palce były rozłożone i stabilne."
     },
     {
      "name": "Wrist Push-Ups",
      "desc": "Ćwiczenie to wzmacnia prostowniki nadgarstków i przedramion, a także elastyczność i wytrzymałość stawów nadgarstkowych. Pomaga w zapobieganiu kontuzjom i zwiększa stabilność.",
      "tips": "Zacznij od delikatnego oparcia na dłoniach skierowanych palcami do ciała, a następnie, jeśli czujesz się komfortowo, przejdź do pompek na nadgarstkach."
     },
     {
      "name": "Plate Pinch (ściskanie talerzy)",
      "desc": "To ćwiczenie buduje wyjątkową siłę chwytu i wzmacnia mięśnie odpowiedzialne za ściskanie i utrzymywanie przedmiotów między palcami. Skupia się na sile kciuka i palców.",
      "tips": "Trzymaj dwa gładkie talerze obiema rękami złączone stronami gładkimi, ściskając je mocno między kciukami a pozostałymi palcami."
     },
     {
      "name": "Farmer’s Walk / Spacer farmera (z masą ciała lub lekkim obciążeniem)",
      "desc": "Spacer farmera to kompleksowe ćwiczenie, które buduje ogólną siłę chwytu, wytrzymałość przedramion, siłę core i ogólną stabilność ciała. Angażuje całe ciało do utrzymania ciężaru.",
      "tips": "Wybierz ciężar, który pozwala na utrzymanie prostej postawy i kontroli ruchu przez cały dystans, unikając garbienia się."
     },
     {
      "name": "Monkey Bars / Traversing",
      "desc": "Ćwiczenie to doskonale rozwija siłę chwytu, wytrzymałość przedramion i koordynację, angażując mięśnie dłoni i przedramion w dynamiczny sposób. Poprawia siłę górnej części ciała.",
      "tips": "Skup się na mocnym, pewnym chwycie i płynnym przechodzeniu z drążka na drążek, używając siły ramion i pleców."
     },
     {
      "name": "Finger Push-Ups / Knuckle Push-Ups",
      "desc": "Pompki na palcach/kostkach wzmacniają zginacze palców, stawy dłoni i przedramiona, zwiększając siłę chwytu i odporność na kontuzje. Angażują mięśnie stabilizujące nadgarstki.",
      "tips": "Rozpocznij od pozycji na kolanach, aby zbudować siłę i stabilność, a następnie stopniowo przechodź do pełnych pompek, utrzymując proste nadgarstki."
     }
    ]
   }
  ],
  "note": "Podział według części przedramion (orientacyjny):\nZginacze (wewnętrzna strona) → wrist curls podchwytem, finger curls, grip exercises\nProstowniki (zewnętrzna strona) → reverse wrist curls, reverse curls\nBrachioradialis (góra przedramienia) → hammer curls, reverse curls, Zottman\nSiła chwytu → farmer’s walk, dead hang, plate pinch, grippers, towel work"
 },
 "brzuch": {
  "groups": [
   {
    "label": "Ćwiczenia z masą ciała (Bodyweight)",
    "exercises": [
     {
      "name": "Crunch / Spięcia brzucha",
      "desc": "To ćwiczenie angażuje głównie górne partie mięśni prostych brzucha, unosząc łopatki z podłoża. Pomaga wzmocnić ten obszar i poprawić kontrolę nad ruchem.",
      "tips": "Nie ciągnij za głowę; skup się na spięciu mięśni brzucha, delikatnie unosząc tylko barki."
     },
     {
      "name": "Sit-Up / Brzuszki",
      "desc": "Brzuszki angażują całe mięśnie proste brzucha, odrywając tułów od ziemi. Wzmacniają korpus i poprawiają elastyczność.",
      "tips": "Kontroluj ruch w dół i unikaj prostowania pleców; pracuj mięśniami brzucha, nie bioder."
     },
     {
      "name": "Reverse Crunch",
      "desc": "Ćwiczenie to koncentruje się na dolnych partiach mięśni prostych brzucha, unosząc biodra w kierunku klatki piersiowej. Pomaga wzmocnić i ujędrnić dolną część brzucha.",
      "tips": "Unikaj kołysania nogami; skup się na powolnym i kontrolowanym uniesieniu bioder z użyciem mięśni brzucha."
     },
     {
      "name": "Bicycle Crunch (rowerek)",
      "desc": "Angażuje mięśnie proste brzucha oraz mięśnie skośne, rotując tułów i naprzemiennie zbliżając łokieć do przeciwnego kolana. Efektywnie pracuje nad całą partią brzucha.",
      "tips": "Skup się na powolnym, kontrolowanym ruchu i dotykaniu łokciem kolana, bez szarpania."
     },
     {
      "name": "Leg Raise / Unoszenie nóg leżąc",
      "desc": "Głównie angażuje dolne partie mięśni prostych brzucha i zginacze bioder poprzez unoszenie nóg. Wzmacnia tę partię i poprawia stabilność miednicy.",
      "tips": "Nie odrywaj odcinka lędźwiowego od podłoża; kontroluj opuszczanie nóg, by mięśnie brzucha pracowały."
     },
     {
      "name": "Hanging Leg Raise / Knee Raise (w zwisie)",
      "desc": "To zaawansowane ćwiczenie intensywnie angażuje dolne partie mięśni prostych brzucha oraz zginacze bioder. Wzmacnia siłę chwytu i stabilność korpusu.",
      "tips": "Unikaj bujania się; kontroluj ruch z użyciem mięśni brzucha, unosząc kolana wysoko lub proste nogi."
     },
     {
      "name": "Plank (deska) – klasyczna, side plank, plank z unoszeniem kończyn",
      "desc": "Plank to izometryczne ćwiczenie, które wzmacnia całe mięśnie głębokie brzucha, pleców i ramion. Poprawia stabilność kręgosłupa i postawę.",
      "tips": "Utrzymuj proste ciało od głowy do pięt, nie opuszczając ani nie unosząc bioder zbyt wysoko."
     },
     {
      "name": "Dead Bug",
      "desc": "Dead Bug wzmacnia mięśnie głębokie brzucha, poprawiając stabilność kręgosłupa i koordynację. Angażuje korpus bez nadmiernego obciążania dolnego odcinka pleców.",
      "tips": "Utrzymuj odcinek lędźwiowy przylegający do podłoża; ruch powinien być powolny i kontrolowany."
     },
     {
      "name": "Hollow Hold / Hollow Rock",
      "desc": "Hollow Hold to izometryczne ćwiczenie angażujące całe mięśnie proste brzucha i mięśnie głębokie. Wzmacnia stabilność korpusu i jest podstawą wielu ruchów gimnastycznych.",
      "tips": "Utrzymuj odcinek lędźwiowy dociśnięty do podłoża; napnij mięśnie brzucha, a nie zginacze bioder."
     },
     {
      "name": "V-Up / Jackknife",
      "desc": "To dynamiczne ćwiczenie angażuje jednocześnie górne i dolne partie mięśni prostych brzucha, zginacze bioder. Wzmacnia całą partię brzucha i poprawia elastyczność.",
      "tips": "Staraj się dotknąć dłońmi stóp, utrzymując nogi proste i napinając mięśnie brzucha, a nie zginacze bioder."
     },
     {
      "name": "Mountain Climbers",
      "desc": "Dynamiczne ćwiczenie cardio i siłowe, które angażuje mięśnie proste brzucha, skośne oraz zginacze bioder. Poprawia wytrzymałość i koordynację.",
      "tips": "Utrzymuj stabilny korpus, nie kołysz biodrami; wykonuj ruch kolanami do klatki piersiowej w kontrolowany sposób."
     },
     {
      "name": "Russian Twist",
      "desc": "Ćwiczenie skoncentrowane na mięśniach skośnych brzucha, wykonując rotacje tułowia. Wzmacnia mięśnie boczne i poprawia stabilność rotacyjną.",
      "tips": "Skup się na rotacji tułowia z użyciem mięśni skośnych, a nie tylko ruchach ramion, unikając zginania pleców."
     },
     {
      "name": "Flutter Kicks / Nożyce",
      "desc": "Nożyce to ćwiczenie angażujące dolne partie mięśni prostych brzucha oraz zginacze bioder poprzez naprzemienne unoszenie nóg. Poprawia wytrzymałość mięśniową.",
      "tips": "Utrzymuj odcinek lędźwiowy dociśnięty do podłoża; ruchy powinny być niewielkie i kontrolowane."
     },
     {
      "name": "Dragon Flag",
      "desc": "Dragon Flag to bardzo zaawansowane ćwiczenie izometryczne i dynamiczne, angażujące całe mięśnie proste brzucha oraz mięśnie głębokie. Buduje ogromną siłę korpusu.",
      "tips": "Utrzymaj ciało proste jak deskę, nie zginaj się w biodrach; opuszczaj ciało bardzo powoli, kontrolując ruch."
     },
     {
      "name": "Ab Wheel Rollout (kółko do brzucha)",
      "desc": "To ćwiczenie angażuje całe mięśnie proste brzucha, mięśnie głębokie i zginacze bioder, poprzez wyprostowanie tułowia. Wzmacnia korpus i poprawia stabilność.",
      "tips": "Utrzymuj plecy proste, unikając wyginania w odcinku lędźwiowym; nie rozciągaj się zbyt daleko, jeśli nie masz kontroli."
     },
     {
      "name": "L-Sit",
      "desc": "L-Sit to izometryczne ćwiczenie angażujące głównie mięśnie proste brzucha, zginacze bioder i mięśnie stabilizujące ramiona. Wymaga dużej siły i kontroli korpusu.",
      "tips": "Utrzymaj nogi proste i uniesione równolegle do podłoża, angażując mięśnie brzucha i naciskając dłońmi na podłoże."
     },
     {
      "name": "Toe Touches",
      "desc": "Ćwiczenie angażujące górne partie mięśni prostych brzucha, poprzez unoszenie tułowia i dotykanie stóp. Rozciąga również mięśnie z tyłu uda.",
      "tips": "Skup się na spięciu mięśni brzucha, unosząc łopatki z podłoża; unikaj szarpania i staraj się dotknąć palców stóp."
     },
     {
      "name": "Bird Dog",
      "desc": "Bird Dog wzmacnia mięśnie głębokie brzucha, pleców i pośladków, poprawiając stabilność kręgosłupa i koordynację. Jest to ćwiczenie na stabilizację antyrotacyjną.",
      "tips": "Utrzymuj stabilny korpus i neutralny kręgosłup, wyciągając przeciwne kończyny bez rotacji bioder."
     }
    ]
   },
   {
    "label": "Ćwiczenia z hantlami / obciążeniem (Dumbbell / Weight)",
    "exercises": [
     {
      "name": "Weighted Crunch / Sit-Up (z hantlem lub talerzem)",
      "desc": "Warianty tych ćwiczeń z obciążeniem intensywniej angażują mięśnie proste brzucha, zwiększając opór. Skutecznie budują siłę i masę mięśniową w tej partii.",
      "tips": "Trzymaj obciążenie blisko klatki piersiowej lub za głową; kontroluj ruch, nie polegając na pędzie."
     },
     {
      "name": "Dumbbell Russian Twist",
      "desc": "Wariant Russian Twist z hantlem zwiększa opór, intensywniej angażując mięśnie skośne brzucha. Efektywnie buduje siłę rotacyjną korpusu.",
      "tips": "Rotuj tułów w sposób kontrolowany, używając mięśni skośnych, a nie tylko ramion; utrzymuj proste plecy."
     },
     {
      "name": "Dumbbell Side Bend (skłony boczne)",
      "desc": "Skłony boczne z hantlem angażują mięśnie skośne brzucha oraz mięśnie czworoboczne lędźwi. Wzmacniają boczne partie korpusu i poprawiają postawę.",
      "tips": "Skłaniaj się w bok w kontrolowany sposób, nie pochylając się do przodu; poczuj rozciągnięcie i spięcie mięśni skośnych."
     },
     {
      "name": "Weighted Leg Raise",
      "desc": "Unoszenie nóg z obciążeniem zwiększa intensywność ćwiczenia, angażując mocniej dolne partie mięśni prostych brzucha i zginaczy bioder. Skutecznie buduje siłę.",
      "tips": "Użyj lekkiego obciążenia na początku i pamiętaj o dociśnięciu odcinka lędźwiowego do podłoża."
     },
     {
      "name": "Dumbbell Woodchop",
      "desc": "To ćwiczenie rotacyjne angażuje mięśnie skośne brzucha, mięśnie proste i zginacze bioder. Wzmacnia siłę rotacyjną i stabilizację korpusu.",
      "tips": "Wykonuj ruch z kontrolowaną rotacją tułowia, pochodzącą z bioder i mięśni brzucha, a nie tylko ramion."
     },
     {
      "name": "Suitcase Carry / Farmer’s Walk (stabilizacja)",
      "desc": "Ćwiczenie na stabilizację, które angażuje mięśnie głębokie brzucha, mięśnie skośne i pleców, aby zapobiec bocznemu zginaniu tułowia. Poprawia siłę chwytu i postawę.",
      "tips": "Utrzymuj prostą postawę, ramiona cofnięte i klatkę piersiową wypiętą, zapobiegając przechyleniu w bok."
     },
     {
      "name": "Renegade Row (z elementem core)",
      "desc": "Renegade Row to zaawansowane ćwiczenie angażujące całe mięśnie głębokie brzucha, pleców, ramion i klatki piersiowej. Wymaga dużej stabilizacji antyrotacyjnej.",
      "tips": "Utrzymuj stabilny korpus w pozycji planku; minimalizuj ruch bioder podczas wiosłowania hantlem."
     },
     {
      "name": "Dumbbell Dead Bug",
      "desc": "Wariant Dead Bug z hantlami zwiększa obciążenie mięśni głębokich brzucha i poprawia kontrolę korpusu. Intensywniej pracuje nad stabilizacją.",
      "tips": "Zachowaj dociśnięty odcinek lędźwiowy i wykonuj powolne, kontrolowane ruchy, bez kołysania."
     }
    ]
   },
   {
    "label": "Ćwiczenia na maszynach",
    "exercises": [
     {
      "name": "Ab Crunch Machine (maszyna do spięć brzucha)",
      "desc": "Maszyna izoluje mięśnie proste brzucha, pozwalając na kontrolowane spięcia z regulowanym obciążeniem. Umożliwia efektywny trening górnych i dolnych partii.",
      "tips": "Skup się na spięciu mięśni brzucha, przyciągając klatkę piersiową do kolan, bez używania siły ramion."
     },
     {
      "name": "Captain’s Chair / Vertical Leg Raise Machine",
      "desc": "Angażuje dolne partie mięśni prostych brzucha i zginacze bioder poprzez unoszenie nóg. Maszyna zapewnia wsparcie dla pleców i ramion.",
      "tips": "Kontroluj ruch w górę i w dół; unikaj kołysania nogami i skup się na pracy mięśni brzucha."
     },
     {
      "name": "Ab Coaster / Ab Dolly",
      "desc": "Urządzenia te angażują całe mięśnie proste brzucha poprzez ruch kolan w kierunku klatki piersiowej w pozycji siedzącej/klęczącej. Poprawia ich siłę i definicję.",
      "tips": "Skup się na kontrolowanym ruchu; nie pozwól, aby ciężar ciała ciągnął Cię w dół, pracuj mięśniami brzucha."
     },
     {
      "name": "Roman Chair Sit-Up / Hyperextension Bench (warianty na brzuch)",
      "desc": "Wariant brzuszka na ławce rzymskiej angażuje mięśnie proste brzucha, zapewniając większy zakres ruchu. Wzmacnia korpus i poprawia elastyczność.",
      "tips": "Kontroluj ruch w dół i w górę; unikaj nadmiernego wyginania pleców, skupiając się na spięciu brzucha."
     },
     {
      "name": "Torso Rotation Machine",
      "desc": "Maszyna do rotacji tułowia izoluje i wzmacnia mięśnie skośne brzucha, zapewniając kontrolowany opór. Jest idealna do zwiększania siły rotacyjnej.",
      "tips": "Używaj kontrolowanych, płynnych ruchów; unikaj szarpania i skup się na pracy mięśni skośnych."
     },
     {
      "name": "Seated Ab Machine",
      "desc": "Maszyna do spięć brzucha w pozycji siedzącej izoluje mięśnie proste brzucha, oferując wsparcie i regulowane obciążenie. Skutecznie wzmacnia górne partie brzucha.",
      "tips": "Skup się na spięciu mięśni brzucha; unikaj używania siły ramion do ciągnięcia uchwytów."
     }
    ]
   },
   {
    "label": "Ćwiczenia na wyciągu / bramie (Cable)",
    "exercises": [
     {
      "name": "Cable Crunch (klęcząc lub stojąc)",
      "desc": "Ćwiczenie z linką angażuje mięśnie proste brzucha, oferując stałe napięcie i regulowany opór. Skutecznie wzmacnia i buduje mięśnie brzucha.",
      "tips": "Skup się na zginaniu tułowia w talii, przyciągając barki do bioder, z użyciem mięśni brzucha."
     },
     {
      "name": "Cable Woodchop (wysoki → niski i odwrotnie)",
      "desc": "To funkcjonalne ćwiczenie rotacyjne angażuje mięśnie skośne brzucha, mięśnie proste i zginacze bioder. Wzmacnia całą partię korpusu i poprawia siłę rotacyjną.",
      "tips": "Wykonuj ruch z kontrolowaną rotacją tułowia, pochodzącą z bioder i mięśni brzucha, bez szarpania."
     },
     {
      "name": "Pallof Press (anti-rotation)",
      "desc": "Pallof Press to ćwiczenie na stabilizację antyrotacyjną, angażujące głębokie mięśnie brzucha i skośne. Wzmacnia korpus, aby zapobiec niekontrolowanym ruchom tułowia.",
      "tips": "Utrzymuj stabilny korpus i unikaj rotacji, wypychając uchwyt przed siebie; napnij mięśnie brzucha."
     },
     {
      "name": "Cable Side Bend",
      "desc": "Skłony boczne z linką angażują mięśnie skośne brzucha, zapewniając stałe napięcie i opór. Wzmacniają boczne partie korpusu i poprawiają stabilizację.",
      "tips": "Skłaniaj się w bok w kontrolowany sposób, nie pochylając się do przodu; poczuj spięcie mięśni skośnych."
     },
     {
      "name": "Standing Cable Crunch",
      "desc": "Stojące spięcia z linką angażują mięśnie proste brzucha, pozwalając na większy zakres ruchu i skupienie na spięciu. Skuteczne w budowaniu siły brzucha.",
      "tips": "Skup się na zginaniu tułowia w talii, przyciągając barki do bioder, z użyciem mięśni brzucha, nie ciągnąc ramionami."
     },
     {
      "name": "High-to-Low / Low-to-High Cable Twist",
      "desc": "Dynamiczne ćwiczenie rotacyjne z linką, angażujące mięśnie skośne brzucha i całą partię korpusu. Poprawia siłę rotacyjną i koordynację.",
      "tips": "Wykonuj ruch z kontrolowaną rotacją tułowia, pochodzącą z bioder i mięśni brzucha, a nie tylko ramion."
     },
     {
      "name": "Cable Reverse Crunch",
      "desc": "Odwrócone spięcia z linką angażują dolne partie mięśni prostych brzucha, zwiększając opór. Skutecznie wzmacniają tę partię i poprawiają jej definicję.",
      "tips": "Kontroluj ruch unoszenia bioder i opuszczania nóg; skup się na pracy mięśni brzucha, a nie zginaczy bioder."
     }
    ]
   },
   {
    "label": "Ćwiczenia ze sztangą / innymi przyrządami",
    "exercises": [
     {
      "name": "Ab Wheel / Barbell Rollout",
      "desc": "To ćwiczenie angażuje całe mięśnie proste brzucha, mięśnie głębokie i zginacze bioder, poprzez wyprostowanie tułowia. Wzmacnia korpus i poprawia stabilność.",
      "tips": "Utrzymuj plecy proste, unikając wyginania w odcinku lędźwiowym; nie rozciągaj się zbyt daleko, jeśli nie masz kontroli."
     },
     {
      "name": "Landmine Twist / 180s",
      "desc": "Ćwiczenie rotacyjne z gryfem, które angażuje mięśnie skośne brzucha, mięśnie proste i zginacze bioder. Wzmacnia siłę rotacyjną i stabilizację korpusu.",
      "tips": "Wykonuj ruch z kontrolowaną rotacją tułowia, pochodzącą z bioder i mięśni brzucha, nie używając samych ramion."
     },
     {
      "name": "Barbell Side Bend",
      "desc": "Skłony boczne ze sztangą angażują mięśnie skośne brzucha oraz mięśnie czworoboczne lędźwi. Wzmacniają boczne partie korpusu i poprawiają postawę.",
      "tips": "Skłaniaj się w bok w kontrolowany sposób, nie pochylając się do przodu; poczuj rozciągnięcie i spięcie mięśni skośnych."
     },
     {
      "name": "Medicine Ball Slam / Russian Twist",
      "desc": "Medicine Ball Slam to dynamiczne ćwiczenie na całe mięśnie brzucha, poprawiające siłę eksplozywną i kondycję. Russian Twist z piłką angażuje mięśnie skośne z dodatkowym oporem.",
      "tips": "Przy Slam: używaj całej siły korpusu do rzutu piłką o ziemię. Przy Twist: rotuj tułów, utrzymując kontrolę."
     },
     {
      "name": "Stability Ball Crunch / Pike / Rollout",
      "desc": "Ćwiczenia na piłce stabilizacyjnej angażują mięśnie proste brzucha i mięśnie głębokie, poprawiając stabilizację i kontrolę. Zwiększają trudność tradycyjnych ćwiczeń.",
      "tips": "Utrzymuj stabilność na piłce; wykonuj ruchy powoli i kontrolowanie, aby zmaksymalizować zaangażowanie mięśni."
     },
     {
      "name": "Decline Bench Sit-Up / Crunch",
      "desc": "Ćwiczenia na ławce skośnej intensywniej angażują mięśnie proste brzucha ze względu na zwiększony zakres ruchu i grawitację. Wzmacniają całą partię brzucha.",
      "tips": "Kontroluj ruch w dół i w górę, unikając szarpania; skup się na spięciu mięśni brzucha i nie ciągnij za głowę."
     }
    ]
   }
  ],
  "note": "Podział według części brzucha (orientacyjny):\nGórna część → crunches, cable crunch, sit-ups\nDolna część → leg raises, reverse crunch, hanging raises\nSkośne → Russian twist, woodchop, side plank, bicycle\nGłęboki core / stabilizacja → plank, dead bug, Pallof press, hollow hold, ab wheel"
 },
 "uda-przod": {
  "groups": [
   {
    "label": "Ćwiczenia ze sztangą (Barbell)",
    "exercises": [
     {
      "name": "Przysiad ze sztangą na plecach (Back Squat) – high-bar / low-bar",
      "desc": "Klasyczny przysiad, angażujący głównie mięśnie czworogłowe uda, pośladki i mięśnie kulszowo-goleniowe. Wersja high-bar kładzie nacisk na uda, low-bar bardziej na pośladki i tył uda.",
      "tips": "Utrzymuj proste plecy i kolana w linii stóp, unikając ich zapadania się do środka."
     },
     {
      "name": "Przysiad przedni (Front Squat)",
      "desc": "Wariant przysiadu, w którym sztanga spoczywa na przednich aktonach barków, angażujący mocno mięśnie czworogłowe uda. Wymaga dobrej mobilności w stawach skokowych i nadgarstkach.",
      "tips": "Utrzymuj łokcie wysoko, skierowane do przodu, aby sztanga stabilnie spoczywała na barkach i nie zjeżdżała."
     },
     {
      "name": "Box Squat",
      "desc": "Przysiad, w którym schodzisz do siedzenia na ławce lub skrzyni, co pomaga kontrolować głębokość ruchu i uczyć prawidłowego wzorca. Wzmacnia fazę wyjścia z dołu, angażując mocno mięśnie pośladkowe i tylne uda.",
      "tips": "Rozluźnij biodra na skrzyni (nie siadaj ciężko), a następnie eksploduj w górę, używając bioder do rozpoczęcia ruchu."
     },
     {
      "name": "Zercher Squat",
      "desc": "Przysiad z ciężarem trzymanym w zgięciu łokciowym, blisko tułowia. Silnie angażuje mięśnie czworogłowe uda, core i górne partie pleców.",
      "tips": "Ściśnij mocno sztangę w ramionach i utrzymuj proste plecy, aby zminimalizować ból i utrzymać stabilność."
     },
     {
      "name": "Overhead Squat",
      "desc": "Wymagający przysiad ze sztangą trzymaną nad głową na wyprostowanych ramionach, rozwijający stabilizację, mobilność i siłę. Działa na całe ciało, ze szczególnym uwzględnieniem mięśni nóg i core.",
      "tips": "Utrzymuj ramiona zablokowane i aktywne, a sztangę prosto nad głową, co wymaga dużej mobilności w barkach."
     },
     {
      "name": "Anderson Squat",
      "desc": "Przysiad rozpoczynany od dołu, z ciężarem spoczywającym na stojakach. Buduje siłę w najtrudniejszej fazie ruchu i eliminuje fazę ekscentryczną, co pozwala na zastosowanie większego ciężaru.",
      "tips": "Zacznij ruch od napięcia mięśni core i nóg, zanim podniesiesz sztangę ze stojaków, aby uniknąć szarpnięcia."
     },
     {
      "name": "Landmine Squat",
      "desc": "Przysiad wykonywany ze sztangą zakotwiczoną w uchwycie typu landmine. Zapewnia bardziej naturalną ścieżkę ruchu i mniejsze obciążenie kręgosłupa, angażując mocno uda i pośladki.",
      "tips": "Trzymaj sztangę blisko ciała, z łokciami pod nią, i pozwól kolanom wyjść nieco do przodu dla większego zaangażowania mięśni czworogłowych."
     },
     {
      "name": "Cyclist Squat (pięty uniesione)",
      "desc": "Przysiad wykonywany z podłożonymi pod pięty podkładkami (np. krążkami). Zwiększa zakres ruchu w stawie skokowym, co pozwala na mocniejsze zaangażowanie mięśni czworogłowych uda.",
      "tips": "Upewnij się, że masz stabilne podparcie pod piętami i schodź głęboko, kontrolując ruch."
     }
    ]
   },
   {
    "label": "Ćwiczenia z hantlami / kettlebell (Dumbbell / KB)",
    "exercises": [
     {
      "name": "Goblet Squat",
      "desc": "Przysiad z hantlem lub kettlem trzymanym przed klatką piersiową. Pomaga w nauce prawidłowego wzorca przysiadu, utrzymując pionowy tułów i angażując mocno mięśnie czworogłowe.",
      "tips": "Trzymaj ciężar blisko ciała, łokcie schowaj pomiędzy kolana w dolnej fazie ruchu, utrzymując prosty tułów."
     },
     {
      "name": "Dumbbell Squat / Front Rack Squat",
      "desc": "Przysiad z hantlami trzymanymi wzdłuż ciała (Dumbbell Squat) lub na barkach (Front Rack Squat). Skupia się na mięśniach czworogłowych, pośladkach i mięśniach kulszowo-goleniowych.",
      "tips": "W wersji Front Rack, utrzymuj hantle stabilnie na barkach, aby nie obciążać nadgarstków."
     },
     {
      "name": "Bulgarian Split Squat (przysiad bułgarski)",
      "desc": "Jednonóżne ćwiczenie, w którym jedna noga jest oparta o podwyższenie za tobą. Intensywnie pracuje nad mięśniami czworogłowymi, pośladkami i stabilnością, szczególnie jednej nogi.",
      "tips": "Upewnij się, że kolano nogi podporowej nie wykracza zbyt daleko poza linię stopy, a tułów jest lekko pochylony do przodu."
     },
     {
      "name": "Split Squat / Lunge (wykroki / zakroki)",
      "desc": "Ćwiczenie jednonóżne, angażujące mięśnie czworogłowe, pośladki i mięśnie kulszowo-goleniowe. Wykroki (lunge) to ruch do przodu, zakroki (reverse lunge) to ruch do tyłu.",
      "tips": "Kontroluj ruch w dół i upewnij się, że oba kolana tworzą kąt około 90 stopni w dolnej pozycji."
     },
     {
      "name": "Walking Lunge",
      "desc": "Wykroki wykonywane krocząco, jeden za drugim, angażujące mięśnie czworogłowe, pośladki i stabilizatory bioder. Zwiększają wytrzymałość i koordynację.",
      "tips": "Utrzymuj stabilny tułów i wykonuj kontrolowane kroki, unikając kołysania się na boki."
     },
     {
      "name": "Reverse Lunge",
      "desc": "Zakroki, czyli wykroki wykonywane do tyłu, co zmniejsza obciążenie kolana i bardziej angażuje pośladki oraz tył uda. Poprawiają stabilność i równowagę.",
      "tips": "Opuść kolano tylnej nogi w kierunku podłogi, utrzymując tułów prosto i angażując pośladki w górnej fazie ruchu."
     },
     {
      "name": "Step-Up (wchodzenie na podwyższenie)",
      "desc": "Ćwiczenie jednonóżne, polegające na wchodzeniu na skrzynię lub ławkę. Silnie angażuje mięśnie czworogłowe i pośladki, poprawiając siłę i wytrzymałość.",
      "tips": "Skup się na używaniu mięśni nogi wchodzącej na podwyższenie do napędzania ruchu, a nie odpychaniu się od podłogi."
     },
     {
      "name": "Dumbbell Sissy Squat",
      "desc": "Wariant przysiadu sissy z hantlem trzymanym przed klatką piersiową, co zwiększa obciążenie. Intensywnie izoluje i wzmacnia mięśnie czworogłowe uda, szczególnie ich dolne partie.",
      "tips": "Zachowaj kontrolę nad ruchem, pozwól kolanom wyjść daleko przed stopy i utrzymuj biodra wyprostowane w linii z tułowiem."
     }
    ]
   },
   {
    "label": "Ćwiczenia na maszynach",
    "exercises": [
     {
      "name": "Leg Press (wypychanie nóg) – 45°, pozioma, pionowa",
      "desc": "Ćwiczenie maszynowe, które izoluje mięśnie nóg, głównie czworogłowe uda, pośladki i mięśnie kulszowo-goleniowe. Różne kąty obciążają mięśnie nieco inaczej.",
      "tips": "Nie blokuj kolan w górnej pozycji i nie odrywaj pośladków od oparcia, aby uniknąć urazów kręgosłupa."
     },
     {
      "name": "Hack Squat",
      "desc": "Ćwiczenie na maszynie, które pozwala na głęboki przysiad z mocnym zaangażowaniem mięśni czworogłowych uda. Zmniejsza obciążenie kręgosłupa w porównaniu do przysiadów ze sztangą.",
      "tips": "Ustaw stopy w odpowiedniej pozycji na platformie, aby zoptymalizować pracę mięśni czworogłowych i unikać bólu kolan."
     },
     {
      "name": "Pendulum Squat",
      "desc": "Ćwiczenie na specjalistycznej maszynie, która prowadzi ruch nóg po łuku, co maksymalnie obciąża mięśnie czworogłowe uda przy minimalnym obciążeniu stawów. Pozwala na głęboki zakres ruchu.",
      "tips": "Skup się na pełnym zakresie ruchu i kontrolowanym opuszczaniu ciężaru, aby w pełni wykorzystać potencjał maszyny."
     },
     {
      "name": "Smith Machine Squat",
      "desc": "Przysiad wykonywany na maszynie Smitha, gdzie sztanga porusza się po stałej, pionowej ścieżce. Pozwala na większą stabilizację i skupienie się na mięśniach czworogłowych, ale angażuje mniej mięśni stabilizujących.",
      "tips": "Ustaw stopy nieco przed sztangą, aby uzyskać bardziej naturalny wzorzec ruchu i mocniej zaangażować uda."
     },
     {
      "name": "Leg Extension (prostowanie nóg)",
      "desc": "Ćwiczenie izolacyjne na maszynie, które koncentruje się wyłącznie na mięśniach czworogłowych uda. Jest idealne do budowania definicji i siły w tej partii.",
      "tips": "Wykonuj ruch w pełnym zakresie, ale nie szarp, kontrolując zarówno fazę wznoszenia, jak i opuszczania ciężaru."
     },
     {
      "name": "V-Squat / Belt Squat",
      "desc": "V-Squat to przysiad na maszynie o ruchu po łuku, podobny do Hack Squat, mocno angażujący uda. Belt Squat to przysiad z obciążeniem zawieszonym na pasie, co całkowicie odciąża kręgosłup, skupiając się na nogach.",
      "tips": "W Belt Squat, utrzymuj wyprostowaną postawę i schodź głęboko, aby maksymalnie zaangażować mięśnie nóg i pośladków."
     },
     {
      "name": "Single-Leg Press",
      "desc": "Wypychanie nóg na maszynie, wykonywane jedną nogą. Zwiększa intensywność i pozwala na skorygowanie dysproporcji siły między nogami, angażując mocno mięśnie czworogłowe i pośladki.",
      "tips": "Upewnij się, że kolano porusza się w linii ze stopą i kontroluj fazę negatywną ruchu."
     },
     {
      "name": "Seated / Lying Leg Press",
      "desc": "Warianty wypychania nóg, wykonywane w pozycji siedzącej lub leżącej na maszynie. Głównie angażują mięśnie czworogłowe uda, pośladki i mięśnie kulszowo-goleniowe.",
      "tips": "Dostosuj ustawienie siedzenia/oparcia tak, aby dolny odcinek pleców był stabilny i nie odrywał się od oparcia."
     }
    ]
   },
   {
    "label": "Ćwiczenia z masą ciała (Bodyweight)",
    "exercises": [
     {
      "name": "Bodyweight Squat / Air Squat",
      "desc": "Podstawowy przysiad bez obciążenia, angażujący mięśnie czworogłowe, pośladki i mięśnie kulszowo-goleniowe. Idealny do nauki prawidłowej techniki i rozgrzewki.",
      "tips": "Skup się na schodzeniu w dół, jakbyś siadał na niewidzialnym krześle, utrzymując prosty tułów."
     },
     {
      "name": "Pistol Squat",
      "desc": "Zaawansowany przysiad jednonóżny, gdzie druga noga jest wyprostowana do przodu. Wymaga dużej siły mięśni czworogłowych, mobilności i równowagi.",
      "tips": "Pracuj nad mobilnością stawów skokowych i biodrowych, a także siłą core, zanim spróbujesz tego ćwiczenia bez wsparcia."
     },
     {
      "name": "Sissy Squat",
      "desc": "Ćwiczenie izolujące mięśnie czworogłowe uda, w którym biodra pozostają zablokowane, a kolana mocno wychodzą do przodu. Skupia się na dolnej części mięśnia czworogłowego.",
      "tips": "Jeśli brakuje Ci stabilności, użyj ławki lub stojaka do przytrzymania się rękami, aby kontrolować ruch."
     },
     {
      "name": "Reverse Nordic Curl",
      "desc": "Ćwiczenie skupiające się na ekscentrycznej pracy mięśni czworogłowych uda. Zwiększa siłę i odporność na kontuzje, opuszczając ciało do tyłu.",
      "tips": "Zacznij od wsparcia rąk i koncentruj się na powolnym i kontrolowanym opuszczaniu tułowia, aktywując mocno mięśnie uda."
     },
     {
      "name": "Wall Sit",
      "desc": "Izometryczne ćwiczenie polegające na utrzymywaniu pozycji przysiadu z plecami opartymi o ścianę. Intensywnie wzmacnia mięśnie czworogłowe uda i zwiększa ich wytrzymałość.",
      "tips": "Utrzymaj kąt 90 stopni w kolanach, jakbyś siedział na krześle, i napnij mięśnie brzucha."
     },
     {
      "name": "Jump Squat",
      "desc": "Przysiad zakończony dynamicznym wyskokiem, angażujący głównie mięśnie czworogłowe uda, pośladki i mięśnie kulszowo-goleniowe. Poprawia moc i eksplozywność.",
      "tips": "Zapewnij miękkie lądowanie, uginając kolana i biodra, aby zamortyzować uderzenie i chronić stawy."
     },
     {
      "name": "Cossack Squat",
      "desc": "Przysiad boczny, w którym jedna noga jest zgięta w kolanie, a druga wyprostowana w bok. Rozwija siłę i mobilność w biodrach, udach wewnętrznych i czworogłowych.",
      "tips": "Utrzymuj piętę nogi wyprostowanej na podłodze, jeśli to możliwe, i schodź tak głęboko, jak pozwala mobilność."
     },
     {
      "name": "Skater Squat",
      "desc": "Jednonóżne ćwiczenie, gdzie noga niezginta jest zgięta i wyciągnięta do tyłu. Podobnie do przysiadu bułgarskiego, ale bez podparcia, angażując mięśnie czworogłowe i poprawiając równowagę.",
      "tips": "Zachowaj prosty tułów i kontroluj ruch, opuszczając kolano tylnej nogi w kierunku podłogi."
     },
     {
      "name": "Elevated Split Squat",
      "desc": "Wykrok dzielony, w którym przednia noga jest uniesiona na podwyższeniu. Zwiększa zakres ruchu i intensywność dla mięśni czworogłowych i pośladków.",
      "tips": "Upewnij się, że przednia stopa jest stabilnie oparta na podwyższeniu i schodź głęboko, kontrolując ruch."
     }
    ]
   },
   {
    "label": "Ćwiczenia na wyciągu / inne",
    "exercises": [
     {
      "name": "Cable Squats / Lunges",
      "desc": "Przysiady lub wykroki wykonywane z użyciem linki wyciągu. Zapewniają stałe napięcie mięśni i mogą być dobrym sposobem na progresję lub pracę nad słabszymi stronami.",
      "tips": "Ustaw opór tak, aby linka ciągnęła Cię w sposób wspierający, a nie utrudniający prawidłową postawę."
     },
     {
      "name": "Banded Squats / Leg Extensions",
      "desc": "Przysiady lub prostowanie nóg z użyciem gumy oporowej. Gumy zwiększają napięcie w szczytowej fazie ruchu, co mocniej angażuje mięśnie czworogłowe uda i pośladki.",
      "tips": "Umieść gumę tak, aby opór był odczuwalny w całym zakresie ruchu, zwłaszcza w górnej fazie."
     },
     {
      "name": "TRX Squats / Lunges / Bulgarian",
      "desc": "Przysiady, wykroki lub przysiady bułgarskie wykonywane z użyciem taśm TRX. TRX zapewnia wsparcie i pozwala na regulację poziomu trudności, angażując mięśnie nóg i core.",
      "tips": "Wykorzystaj TRX do kontroli równowagi i skup się na świadomym angażowaniu mięśni docelowych, a nie tylko na trzymaniu się rączkami."
     },
     {
      "name": "Spanish Squat (z gumą)",
      "desc": "Przysiad wykonywany z gumą oporową założoną na wysokości kolan i zaczepioną za stabilny punkt. Guma ciągnie kolana do tyłu, co zmusza mięśnie czworogłowe do intensywnej pracy w celu utrzymania pozycji.",
      "tips": "Upewnij się, że guma jest mocno zaczepiona, a Ty pochylasz tułów lekko do przodu, aby zintensyfikować pracę ud."
     }
    ]
   }
  ],
  "note": "Podział według akcentu (orientacyjny):\nOgólna masa i siła → back/front squat, leg press, hack squat\nIzolacja → leg extension, sissy squat, reverse nordic\nJednostronne (unilateral) → Bulgarian split squat, lunges, step-ups, pistol\nDolna część czworogłowego → leg extension, sissy, heels-elevated"
 },
 "uda-tyl": {
  "groups": [
   {
    "label": "Ćwiczenia ze sztangą (Barbell)",
    "exercises": [
     {
      "name": "Martwy ciąg rumuński (Romanian Deadlift – RDL)",
      "desc": "Doskonale rozwija mięśnie dwugłowe uda i pośladki, angażując je poprzez ruch bioder. Skupia się na rozciąganiu tylnej taśmy ud.",
      "tips": "Utrzymuj lekko ugięte kolana i prosty kręgosłup; opuszczaj sztangę, wypychając biodra mocno do tyłu."
     },
     {
      "name": "Martwy ciąg na prostych nogach (Stiff-Leg Deadlift – SLDL)",
      "desc": "Intensywnie angażuje mięśnie dwugłowe uda i pośladki, mocno rozciągając tylną taśmę ud. W odróżnieniu od RDL, ruch zaczyna się z ziemi i kolana są niemal proste.",
      "tips": "Nogi pozostają proste (bez blokowania kolan); główny ruch pochodzi z bioder, a plecy są proste."
     },
     {
      "name": "Klasyczny martwy ciąg (Deadlift)",
      "desc": "Globalne ćwiczenie siłowe angażujące całe ciało, ze szczególnym naciskiem na pośladki, uda (tył i przód) oraz mięśnie pleców. Buduje ogólną siłę i masę.",
      "tips": "Rozpocznij z biodrami niżej niż ramiona, utrzymuj prosty kręgosłup i prowadź sztangę blisko ciała."
     },
     {
      "name": "Good Morning",
      "desc": "Wzmacnia mięśnie dwugłowe uda, pośladki oraz mięśnie prostowniki grzbietu. Symuluje ruch zgięcia w biodrach, podobny do RDL, ale ze sztangą na karku.",
      "tips": "Zachowaj prosty kręgosłup; zginaj się w biodrach, a nie w pasie, opuszczając tułów niemal równolegle do podłogi."
     },
     {
      "name": "Sumo Deadlift (akcent na tył)",
      "desc": "Angażuje głównie pośladki, wewnętrzną stronę ud i mięśnie dwugłowe, z nieco mniejszym obciążeniem dla prostowników grzbietu niż klasyczny. Szeroki rozstaw nóg pozwala na większy udział bioder.",
      "tips": "Stopy szeroko, palce na zewnątrz; kolana nad stopami, biodra niżej niż w klasyku."
     },
     {
      "name": "Single-Leg RDL ze sztangą",
      "desc": "Doskonale rozwija mięśnie dwugłowe uda i pośladki, a także wzmacnia stabilizację tułowia i równowagę. Obciążenie jest w pełni jednostronne.",
      "tips": "Skoncentruj się na stabilizacji biodra i utrzymaniu prostego kręgosłupa, pozwól wolnej nodze swobodnie podążać w tył."
     }
    ]
   },
   {
    "label": "Ćwiczenia z hantlami / kettlebell (Dumbbell / KB)",
    "exercises": [
     {
      "name": "Dumbbell Romanian Deadlift",
      "desc": "Rozwija mięśnie dwugłowe uda i pośladki, oferując większy zakres ruchu niż sztanga oraz lepszą kontrolę pozycji rąk. Idealny do nauki wzorca ruchowego.",
      "tips": "Trzymaj hantle blisko ud; skoncentruj się na wypychaniu bioder do tyłu i rozciąganiu tyłu ud."
     },
     {
      "name": "Single-Leg RDL z hantlem",
      "desc": "Wzmacnia mięśnie dwugłowe uda i pośladki jednej nogi, jednocześnie poprawiając równowagę i stabilność rdzenia. Hantel w ręce przeciwnej do nogi podpartej ułatwia równowagę.",
      "tips": "Wykonuj ruch powoli i kontrolowanie; utrzymuj miednicę stabilnie, unikając rotacji."
     },
     {
      "name": "Kettlebell Swing",
      "desc": "Wzmacnia tylną taśmę ciała, głównie pośladki i mięśnie dwugłowe uda, poprzez dynamiczne wypchnięcie bioder. Jest to ćwiczenie mocy i wytrzymałości.",
      "tips": "Ruch inicjuj biodrami, a nie ramionami; oddech skoordynuj z ruchem – wydech przy wypchnięciu kettlebella."
     },
     {
      "name": "Dumbbell Good Morning",
      "desc": "Angażuje mięśnie dwugłowe uda, pośladki i prostowniki grzbietu, podobnie do wersji ze sztangą, ale z hantlem trzymanym przy klatce lub na karku. Pozwala na większą kontrolę i mobilność stawów barkowych.",
      "tips": "Trzymaj hantel stabilnie; ruch inicjuj z bioder, utrzymując prosty kręgosłup i lekkie ugięcie w kolanach."
     },
     {
      "name": "Dumbbell Leg Curl (leżąc z hantlem między stopami)",
      "desc": "Izoluje i wzmacnia mięśnie dwugłowe uda. Jest to alternatywa dla maszyn, angażująca mięśnie poprzez zginanie nóg w stawie kolanowym.",
      "tips": "Ściskaj hantel mocno stopami, aby go nie upuścić; ruch wykonuj powoli i kontrolując, skupiając się na spięciu dwugłowych."
     },
     {
      "name": "Kettlebell RDL",
      "desc": "Wzmacnia mięśnie dwugłowe uda i pośladki, korzystając z kettlebella, co sprzyja lepszej pozycji początkowej i naturalniejszemu chwytowi. Świetne do nauki ruchu.",
      "tips": "Trzymaj kettlebell blisko ciała, opuszczając go do wysokości piszczeli; utrzymuj napięte mięśnie brzucha i prosty kręgosłup."
     }
    ]
   },
   {
    "label": "Ćwiczenia na maszynach",
    "exercises": [
     {
      "name": "Seated Leg Curl (uginanie nóg siedząc)",
      "desc": "Izoluje i wzmacnia mięśnie dwugłowe uda, szczególnie ich dolne partie. Dzięki pozycji siedzącej minimalizuje udział innych grup mięśniowych.",
      "tips": "Dociśnij biodra do siedzenia; ruch wykonuj płynnie, kontrolując fazę negatywną, aby w pełni zaangażować mięśnie."
     },
     {
      "name": "Lying Leg Curl (uginanie nóg leżąc)",
      "desc": "Izoluje mięśnie dwugłowe uda, szczególnie ich środkowe i górne części. Jest to jedno z najbardziej efektywnych ćwiczeń na tę grupę mięśniową.",
      "tips": "Utrzymuj biodra dociśnięte do ławki, aby uniknąć kompensacji; ruch powinien być kontrolowany i świadomy."
     },
     {
      "name": "Standing Leg Curl",
      "desc": "Pozwala na izolowane wzmocnienie mięśni dwugłowych uda, skupiając się na jednej nodze naraz. Pomaga wyrównać dysproporcje siłowe między nogami.",
      "tips": "Podeprzyj się rękami o maszynę dla stabilności; kontroluj ruch w obu fazach, skupiając się na napięciu mięśnia."
     },
     {
      "name": "Glute-Ham Raise (GHR)",
      "desc": "Wybitne ćwiczenie wzmacniające całą tylną taśmę ciała – mięśnie dwugłowe uda, pośladki i prostowniki grzbietu. Jest to złożony ruch zginania kolan i prostowania bioder.",
      "tips": "Rozpocznij od prostowania kolan, a następnie zginaj biodra, kontrolując ruch w dół i w górę."
     },
     {
      "name": "Smith Machine RDL / Good Morning",
      "desc": "Wzmacnia mięśnie dwugłowe uda, pośladki i prostowniki grzbietu, podobnie jak wolne ciężary, ale z prowadzeniem sztangi w jednej płaszczyźnie. Umożliwia skupienie się na technice lub dodanie większego obciążenia.",
      "tips": "Ustaw stopy nieco przed sztangą, aby zmaksymalizować ruch w biodrach; kontroluj tempo i zakres ruchu."
     },
     {
      "name": "Iso-Lateral Leg Curl",
      "desc": "Izoluje i wzmacnia mięśnie dwugłowe uda każdej nogi niezależnie, pozwalając na precyzyjne adresowanie ewentualnych dysbalansów. Maszyny te często oferują pełniejszy zakres ruchu.",
      "tips": "Skup się na pełnym rozciągnięciu i spięciu mięśni; pracuj każdą nogą niezależnie, aby zapewnić symetryczny rozwój."
     }
    ]
   },
   {
    "label": "Ćwiczenia z masą ciała (Bodyweight)",
    "exercises": [
     {
      "name": "Nordic Hamstring Curl (żuraw / nordic curl)",
      "desc": "Intensywnie wzmacnia ekscentrycznie mięśnie dwugłowe uda, co jest kluczowe w prewencji kontuzji. Skupia się na kontroli opadania ciała.",
      "tips": "Kontroluj opadanie ciała jak najdłużej, używając mięśni dwugłowych; jeśli to za trudne, pomóż sobie rękami w fazie wstawania."
     },
     {
      "name": "Glute Bridge / Single-Leg Glute Bridge",
      "desc": "Wzmacnia głównie pośladki oraz mięśnie dwugłowe uda, angażując je poprzez ruch prostowania bioder. Wersja jednonóż dodatkowo poprawia stabilność.",
      "tips": "Wypychaj biodra wysoko, świadomie napinając pośladki na szczycie ruchu; pięty powinny być blisko pośladków."
     },
     {
      "name": "Hamstring Walkouts",
      "desc": "Wzmacnia mięśnie dwugłowe uda i rdzeń, ucząc kontroli ruchu i stabilizacji miednicy. Wykonywane na podłodze, zwiększa świadomość ciała.",
      "tips": "Zacznij od Glute Bridge; powoli wyprostuj nogi, oddalając pięty, a następnie wróć do pozycji początkowej, kontrolując ruch."
     },
     {
      "name": "Slider / Towel Leg Curl",
      "desc": "Wzmacnia mięśnie dwugłowe uda i pośladki, wykorzystując śliską powierzchnię do zgięcia kolan. Dostępne bez sprzętu specjalistycznego, angażuje także stabilizatory.",
      "tips": "Utrzymaj biodra uniesione przez cały czas ruchu; skup się na kontroli fazy rozciągania i powrotu."
     },
     {
      "name": "Stability Ball Leg Curl",
      "desc": "Wzmacnia mięśnie dwugłowe uda, pośladki i mięśnie głębokie brzucha, dzięki konieczności stabilizowania piłki. Poprawia koordynację i kontrolę ruchową.",
      "tips": "Utrzymuj biodra uniesione; wciągnij piłkę piętami do pośladków, a następnie powoli wyprostuj nogi."
     },
     {
      "name": "Bodyweight Good Morning",
      "desc": "Wzmacnia mięśnie dwugłowe uda, pośladki i prostowniki grzbietu bez użycia dodatkowego obciążenia. Świetne do nauki wzorca ruchowego i rozgrzewki.",
      "tips": "Ręce za głową lub na biodrach; zginaj się w biodrach, utrzymując prosty kręgosłup i lekkie ugięcie w kolanach."
     },
     {
      "name": "Reverse Hyperextension (na ławce)",
      "desc": "Wzmacnia pośladki i mięśnie dwugłowe uda, a także dolny odcinek pleców, poprzez ruch unoszenia nóg w tył. Skuteczne w budowaniu siły i prewencji bólu pleców.",
      "tips": "Wykonuj ruch z kontrolą, skupiając się na spięciu pośladków na szczycie; unikaj gwałtownego prostowania nóg."
     },
     {
      "name": "Prisoner Good Morning",
      "desc": "Wzmacnia mięśnie dwugłowe uda, pośladki i prostowniki grzbietu, podobnie jak klasyczny Good Morning, ale z rękami splecionymi za głową. Zwiększa to zaangażowanie mięśni tułowia.",
      "tips": "Utrzymaj łokcie szeroko otwarte; ruch inicjuj z bioder, a nie z pleców, utrzymując je proste."
     }
    ]
   },
   {
    "label": "Ćwiczenia na wyciągu / inne",
    "exercises": [
     {
      "name": "Cable Pull-Through",
      "desc": "Skutecznie angażuje pośladki i mięśnie dwugłowe uda poprzez dynamiczne prostowanie bioder. Jest to bezpieczne ćwiczenie do nauki wypychania bioder.",
      "tips": "Stań tyłem do wyciągu, chwytając linę między nogami; wypchnij biodra do tyłu, a następnie dynamicznie prostuj je, ściskając pośladki."
     },
     {
      "name": "Cable RDL",
      "desc": "Wzmacnia mięśnie dwugłowe uda i pośladki, oferując stałe napięcie w całym zakresie ruchu dzięki wyciągowi. Jest to łagodniejsza opcja dla dolnego odcinka pleców.",
      "tips": "Trzymaj linkę blisko ciała; skoncentruj się na wypychaniu bioder do tyłu i rozciąganiu tyłu ud, utrzymując prosty kręgosłup."
     },
     {
      "name": "Banded Leg Curl / Nordic",
      "desc": "Wzmacnia mięśnie dwugłowe uda, zwiększając ich siłę i wytrzymałość ekscentryczną. Opór taśmy wspomaga lub utrudnia ruch, w zależności od zastosowania.",
      "tips": "Jeśli wspomaga: umieść taśmę pod pachami, co ułatwi powrót. Jeśli utrudnia: zastosuj taśmę do zwiększenia oporu w fazie koncentrycznej."
     },
     {
      "name": "TRX Hamstring Curl",
      "desc": "Wzmacnia mięśnie dwugłowe uda, pośladki i rdzeń, wykorzystując niestabilność zawieszenia TRX. Poprawia koordynację i aktywację mięśni stabilizujących.",
      "tips": "Utrzymuj biodra uniesione przez cały ruch; świadomie ściągaj pięty do pośladków, skupiając się na napięciu tyłu ud."
     },
     {
      "name": "Swiss Ball Hamstring Curl",
      "desc": "Wzmacnia mięśnie dwugłowe uda, pośladki i rdzeń, podobnie jak Stability Ball Leg Curl, ale z większą aktywacją stabilizatorów ze względu na miękkość piłki. Poprawia równowagę.",
      "tips": "Utrzymuj biodra stabilnie uniesione; kontroluj ruch piłki, unikając kołysania na boki."
     }
    ]
   }
  ],
  "note": "Podział według funkcji (orientacyjny):\nWyprost biodra (hip hinge) → RDL, SLDL, good morning, swings, deadlift\nZginanie kolana (knee flexion) → leg curls (seated/lying), Nordic curl, slider curls\nJednostronne → single-leg RDL, single-leg bridge\nEkscentryczne / prewencja → Nordic curl, eccentric leg curls"
 },
 "posladki": {
  "groups": [
   {
    "label": "Ćwiczenia ze sztangą (Barbell)",
    "exercises": [
     {
      "name": "Hip Thrust (wypychanie bioder)",
      "desc": "Ćwiczenie silnie angażujące pośladki, szczególnie ich górną część, poprzez dynamiczne wypchnięcie bioder w górę. Buduje masę i siłę mięśni pośladkowych.",
      "tips": "Utrzymuj stałe napięcie brzucha i unikaj przeprostu kręgosłupa w odcinku lędźwiowym na szczycie ruchu."
     },
     {
      "name": "Barbell Glute Bridge",
      "desc": "Wersja mostka biodrowego ze sztangą, angażująca pośladki i mięśnie dwugłowe uda. Skupia się na maksymalnym spięciu pośladków w górnej fazie ruchu.",
      "tips": "Dociskaj pięty do podłoża i wypychaj kolana na zewnątrz, aby aktywować bardziej mięśnie pośladkowe."
     },
     {
      "name": "Back Squat / Front Squat (głębokie)",
      "desc": "Głębokie przysiady ze sztangą angażują całe pośladki, uda i mięśnie core. Głębokość ruchu zwiększa rekrutację mięśni pośladkowych.",
      "tips": "Zejdź jak najniżej, utrzymując prosty kręgosłup i kolana w linii stóp, aby maksymalnie rozciągnąć pośladki."
     },
     {
      "name": "Romanian Deadlift (RDL)",
      "desc": "Ćwiczenie angażuje głównie pośladki (szczególnie ich dolną część) i mięśnie dwugłowe uda. Rozciąga tylną taśmę, budując siłę i elastyczność.",
      "tips": "Prowadź sztangę blisko nóg, wypychając biodra mocno do tyłu, a kolana lekko ugięte."
     },
     {
      "name": "Sumo Deadlift",
      "desc": "Wariant martwego ciągu z szerokim rozstawem nóg, który silniej angażuje pośladki, mięśnie wewnętrzne ud i czworogłowe. Pozwala na podniesienie większych ciężarów.",
      "tips": "Trzymaj klatkę piersiową wysoko i kolana wypchnięte na zewnątrz, aby maksymalnie wykorzystać siłę nóg i pośladków."
     },
     {
      "name": "Good Morning",
      "desc": "Ćwiczenie na tylną taśmę, głównie pośladki i mięśnie dwugłowe uda, z mniejszym obciążeniem kręgosłupa niż RDL. Wzmacnia mięśnie prostownika grzbietu.",
      "tips": "Utrzymuj proste plecy i wypychaj biodra mocno do tyłu, nie zaokrąglając kręgosłupa."
     },
     {
      "name": "Bulgarian Split Squat ze sztangą",
      "desc": "Jednonogie przysiady bułgarskie ze sztangą intensywnie angażują pośladki, uda i wzmacniają stabilizację. Poprawia równowagę i siłę asymetryczną.",
      "tips": "Oprzyj stopę na podwyższeniu, trzymaj tułów lekko pochylony do przodu, by bardziej zaangażować pośladek nogi zakrocznej."
     }
    ]
   },
   {
    "label": "Ćwiczenia z hantlami / kettlebell (Dumbbell / KB)",
    "exercises": [
     {
      "name": "Dumbbell Hip Thrust / Single-Leg Hip Thrust",
      "desc": "Wypychanie bioder z hantlem (lub jednonogie) skupia się na izolacji i wzmocnieniu pośladków. Idealne do budowania siły i masy mięśniowej w domu lub z mniejszym sprzętem.",
      "tips": "Wykonując jednonogie, mocno dociśnij piętę pracującej nogi i utrzymaj biodra na jednym poziomie."
     },
     {
      "name": "Goblet Squat / Sumo Squat",
      "desc": "Przysiad gobletowy lub sumo z hantlem angażuje całe uda i pośladki. Szeroki rozstaw nóg (sumo) zwiększa zaangażowanie wewnętrznych partii ud i pośladków.",
      "tips": "Przy sumo squacie, stopy szeroko rozstawione i palce na zewnątrz, schodź biodrami jak najniżej, utrzymując prosty tułów."
     },
     {
      "name": "Dumbbell RDL / Single-Leg RDL",
      "desc": "Martwy ciąg rumuński z hantlami (lub jednonogie) świetnie izoluje pośladki i mięśnie dwugłowe uda. Wersja jednonoga poprawia równowagę i siłę jednostronną.",
      "tips": "Wykonując jednonogie, skup się na kontroli i powolnym opuszczaniu, utrzymując biodra stabilnie."
     },
     {
      "name": "Bulgarian Split Squat z hantlami",
      "desc": "Przysiad bułgarski z hantlami angażuje mocno pośladki i mięśnie czworogłowe uda, poprawiając stabilizację i równowagę. Zapewnia głęboki zakres ruchu.",
      "tips": "Wybierz hantle o odpowiedniej wadze i skup się na pełnym zakresie ruchu, schodząc nisko."
     },
     {
      "name": "Step-Up z hantlami",
      "desc": "Wejścia na skrzynię z hantlami aktywują mocno pośladki i mięśnie ud, szczególnie w fazie wchodzenia. Wzmacnia mięśnie jednostronnie i poprawia równowagę.",
      "tips": "Postaw całą stopę na skrzyni i wypychaj się z pięty, unikając odbijania się od podłogi drugą nogą."
     },
     {
      "name": "Kettlebell Swing",
      "desc": "Dynamiczne ćwiczenie angażujące całe pośladki, mięśnie dwugłowe uda i core. Poprawia siłę eksplozywną i kondycję metaboliczną.",
      "tips": "Wykonuj ruch biodrami, a nie ramionami; kettlbell ma być napędzany siłą bioder, nie podnoszony."
     },
     {
      "name": "Dumbbell Frog Pump",
      "desc": "Ćwiczenie izolujące pośladki, szczególnie w ich górnej części i bocznej, z użyciem hantla dla większego oporu. Skutecznie spina mięśnie w fazie szczytowej.",
      "tips": "Stopy złączone podeszwami, kolana na boki, skup się na spięciu pośladków na szczycie ruchu."
     }
    ]
   },
   {
    "label": "Ćwiczenia na maszynach",
    "exercises": [
     {
      "name": "Hip Thrust Machine / Lever Hip Thrust",
      "desc": "Maszyna do hip thrustów zapewnia stabilne i kontrolowane środowisko do treningu pośladków. Ułatwia progresywne zwiększanie obciążenia i izolację mięśni.",
      "tips": "Upewnij się, że oparcie jest na wysokości łopatek i ruch odbywa się głównie w biodrach, nie w kręgosłupie."
     },
     {
      "name": "Smith Machine Hip Thrust / Squat",
      "desc": "Suwnica Smitha pozwala na stabilne wypychanie bioder lub przysiady, co ułatwia skupienie się na technice i izolacji pośladków. Minimalizuje potrzebę stabilizacji.",
      "tips": "Ustaw się tak, aby sztanga znajdowała się nisko na biodrach (hip thrust) lub na plecach (przysiad) i ruch był płynny."
     },
     {
      "name": "Standing Glute Kickback Machine",
      "desc": "Maszyna do wypychania nóg w tył stojąc, celująca w maksymalną izolację i aktywację pośladków. Skuteczna w kształtowaniu i wzmacnianiu tej partii.",
      "tips": "Kontroluj ruch, unikaj szarpania i skup się na pełnym spięciu pośladka na końcu zakresu ruchu."
     },
     {
      "name": "Hip Abduction Machine (odwodzenie nóg)",
      "desc": "Maszyna do odwodzenia nóg wzmacnia mięśnie pośladkowe średnie i małe, odpowiedzialne za stabilizację biodra i kształt pośladków. Celuje w boczne partie.",
      "tips": "Utrzymuj kontrolę nad ruchem, unikaj szarpania, a ruch wykonuj powoli i z pełnym zakresem."
     },
     {
      "name": "Reverse Hyperextension Machine",
      "desc": "Ćwiczenie na maszynie do hiperekstensji odwrotnej, silnie angażujące pośladki i mięśnie dwugłowe uda. Wzmacnia tylną taśmę i odciąża kręgosłup.",
      "tips": "Utrzymaj stabilny tułów i skup się na uniesieniu nóg wyłącznie siłą pośladków i tyłu ud."
     },
     {
      "name": "Cable Glute Kickback",
      "desc": "Wykopy w tył z linką wyciągu doskonale izolują i angażują pośladki, zapewniając stałe napięcie. Pomaga w kształtowaniu okrągłych pośladków.",
      "tips": "Lekko pochyl się do przodu i kontroluj ruch, aby poczuć napięcie w pośladku na szczycie wykopu."
     },
     {
      "name": "45-Degree Back Extension (z akcentem na pośladki)",
      "desc": "Hiperekstensja na ławce 45 stopni z akcentem na pośladki wzmacnia tylną taśmę, szczególnie pośladki i mięśnie dwugłowe uda. Wymaga odpowiedniej techniki.",
      "tips": "Zaokrąglij plecy, aby zmniejszyć angażowanie prostownika, a stopy ustaw szerzej z palcami na zewnątrz, by mocniej poczuć pośladki."
     }
    ]
   },
   {
    "label": "Ćwiczenia z masą ciała (Bodyweight)",
    "exercises": [
     {
      "name": "Glute Bridge / Single-Leg Glute Bridge",
      "desc": "Mostek biodrowy (lub jednonogi) to podstawowe ćwiczenie na pośladki, aktywujące również mięśnie core. Buduje siłę i świadomość mięśniową bez sprzętu.",
      "tips": "Wypychaj biodra mocno w górę, dociskając pięty i spinając pośladki na szczycie ruchu."
     },
     {
      "name": "Bodyweight Hip Thrust",
      "desc": "Wypychanie bioder bez obciążenia to doskonała aktywacja pośladków i nauka wzorca ruchu. Może być wykonywane jako rozgrzewka lub ćwiczenie w domu.",
      "tips": "Skup się na mocnym spięciu pośladków w górnej fazie ruchu i kontrolowanym opuszczaniu bioder."
     },
     {
      "name": "Frog Pump",
      "desc": "Ćwiczenie izolujące pośladki, szczególnie ich górne i boczne partie, poprzez uniesienie bioder ze złączonymi podeszwami stóp. Skutecznie rozgrzewa i aktywuje.",
      "tips": "Trzymaj kolana szeroko, pięty złączone i skup się na maksymalnym spięciu pośladków na szczycie."
     },
     {
      "name": "Donkey Kick",
      "desc": "Wykopy osiołka angażują i izolują pośladki, głównie ich górną część, bez obciążania kręgosłupa. Skuteczne w kształtowaniu i ujędrnianiu.",
      "tips": "Utrzymuj stabilny tułów, a ruch wykonuj kontrolowanie, czując napięcie w pośladku."
     },
     {
      "name": "Fire Hydrant",
      "desc": "Ćwiczenie angażujące mięśnie pośladkowe średnie i małe, odpowiedzialne za stabilizację bioder i kształt. Skutecznie aktywuje boczne partie pośladków.",
      "tips": "Utrzymuj stabilny tułów i unieś kolano na bok, kontrolując ruch bez kołysania tułowiem."
     },
     {
      "name": "Clamshell",
      "desc": "Ćwiczenie na mięśnie pośladkowe średnie i małe, wzmacniające rotatory zewnętrzne biodra i stabilizację. Doskonałe do aktywacji i rehabilitacji.",
      "tips": "Trzymaj pięty złączone, a kolano unieś do góry, czując pracę w bocznej części pośladka."
     },
     {
      "name": "Reverse Lunge / Walking Lunge",
      "desc": "Wykroki w tył lub chodzone angażują pośladki i mięśnie czworogłowe ud. Wzmacniają jednostronnie i poprawiają równowagę.",
      "tips": "Wykrok w tył pozwala na większe zaangażowanie pośladka niż wykrok w przód; skup się na wypychaniu z pięty nogi z przodu."
     },
     {
      "name": "Bulgarian Split Squat",
      "desc": "Przysiad bułgarski to unilateralne ćwiczenie angażujące pośladki, uda i mięśnie core. Zwiększa siłę i stabilizację jednostronną.",
      "tips": "Ustaw stopę na podwyższeniu, trzymaj tułów lekko pochylony do przodu, aby mocniej zaangażować pośladek nogi zakrocznej."
     },
     {
      "name": "Step-Up",
      "desc": "Wejścia na skrzynię aktywują mocno pośladki i mięśnie ud, poprawiając siłę i kondycję. Wzmacniają jednostronnie i poprawiają równowagę.",
      "tips": "Postaw całą stopę na skrzyni i wypychaj się z pięty, unikając odbijania się od podłogi drugą nogą."
     },
     {
      "name": "Single-Leg Deadlift",
      "desc": "Martwy ciąg na jednej nodze rozwija siłę pośladków, mięśni dwugłowych uda i stabilizację tułowia. Wzmacnia mięśnie głębokie i poprawia równowagę.",
      "tips": "Utrzymuj prosty kręgosłup i biodra na jednym poziomie, skupiając się na kontrolowanym opuszczaniu i powrocie."
     }
    ]
   },
   {
    "label": "Ćwiczenia na wyciągu / gumach",
    "exercises": [
     {
      "name": "Cable Pull-Through",
      "desc": "Ćwiczenie z linką wyciągu angażujące pośladki i mięśnie dwugłowe uda, naśladujące ruch hip hinge. Buduje siłę eksplozywną i wzmacnia tylną taśmę.",
      "tips": "Wypychaj biodra mocno do tyłu, a następnie eksplozywnie do przodu, spinając pośladki na szczycie ruchu."
     },
     {
      "name": "Cable Kickback / Hip Extension",
      "desc": "Wykopy z linką wyciągu w tył skutecznie izolują i angażują pośladki, zapewniając stałe napięcie. Pomaga w kształtowaniu i wzmacnianiu tej partii.",
      "tips": "Lekko pochyl się do przodu i kontroluj ruch, aby poczuć napięcie w pośladku na szczycie wykopu."
     },
     {
      "name": "Cable Hip Abduction",
      "desc": "Odwodzenie nogi z linką wyciągu celuje w mięśnie pośladkowe średnie i małe, odpowiedzialne za stabilizację biodra i kształt. Skutecznie wzmacnia boczne partie pośladków.",
      "tips": "Stój prosto, lekko przytrzymaj się czegoś, a ruch wykonuj powoli i kontrolując, czując napięcie w bocznej części pośladka."
     },
     {
      "name": "Banded Lateral Walk / Monster Walk",
      "desc": "Chód boczny lub potworny z gumą oporową angażuje mocno mięśnie pośladkowe średnie i małe. Wzmacnia stabilizację bioder i poprawia ich ruchomość.",
      "tips": "Utrzymuj lekkie ugięcie w kolanach, napięcie gumy i stawiaj małe, kontrolowane kroki."
     },
     {
      "name": "Banded Hip Thrust / Glute Bridge",
      "desc": "Wypychanie bioder lub mostek z gumą oporową zwiększa aktywację pośladków, szczególnie ich bocznych partii. Guma wymusza wypychanie kolan na zewnątrz.",
      "tips": "Załóż gumę powyżej kolan, wypychaj je na zewnątrz podczas uniesienia bioder, by maksymalnie aktywować pośladki."
     },
     {
      "name": "Banded Kickback / Donkey Kick",
      "desc": "Wykopy w tył lub osiołka z gumą oporową silnie izolują i angażują pośladki. Guma zwiększa opór, wzmacniając i ujędrniając mięśnie.",
      "tips": "Utrzymuj napięcie gumy przez cały ruch i skup się na pełnym spięciu pośladka na końcu wykopu."
     }
    ]
   }
  ],
  "note": "Podział według części pośladków (orientacyjny):\nPośladkowy wielki (główna masa) → hip thrust, glute bridge, squats, RDL, deadlift\nPośladkowy średni i mały (boki / górna część) → hip abduction, lateral walks, clamshell, fire hydrant, side-lying raises\nJednostronne → single-leg hip thrust, Bulgarian split squat, step-ups, single-leg RDL\nAktywacja / izolacja → donkey kick, frog pump, kickbacks"
 },
 "lydki": {
  "groups": [
   {
    "label": "Ćwiczenia ze sztangą (Barbell)",
    "exercises": [
     {
      "name": "Standing Calf Raise ze sztangą",
      "desc": "To ćwiczenie buduje masę mięśniową i siłę łydek, głównie aktywując mięsień brzuchaty łydki, który jest silniejszy i bardziej widoczny. Wykonuje się je na stojąco, ze sztangą opartą na barkach.",
      "tips": "Upewnij się, że masz pełen zakres ruchu, schodząc piętami maksymalnie w dół i unosząc się wysoko na palcach."
     },
     {
      "name": "Seated Calf Raise ze sztangą (sztanga na kolanach)",
      "desc": "To ćwiczenie angażuje głównie mięsień płaszczkowaty łydki, który leży pod mięśniem brzuchatym i przyczynia się do grubości łydki. Wykonywane jest w pozycji siedzącej ze sztangą na kolanach.",
      "tips": "Powoli opuszczaj pięty i kontroluj ruch w górę, aby zmaksymalizować napięcie mięśniowe."
     },
     {
      "name": "Smith Machine Standing Calf Raise",
      "desc": "Wykorzystuje maszynę Smitha do stabilnego unoszenia łydek w pozycji stojącej, koncentrując się na mięśniu brzuchatym. Zapewnia kontrolowany ruch w jednej płaszczyźnie.",
      "tips": "Ustaw platformę na odpowiedniej wysokości, aby umożliwić pełne rozciągnięcie i spięcie mięśni."
     },
     {
      "name": "Smith Machine Seated Calf Raise",
      "desc": "Podobnie jak w wersji ze sztangą, angażuje mięsień płaszczkowaty, ale maszyna Smitha stabilizuje ciężar. Pozwala na skupienie się na pracy mięśniowej bez obawy o równowagę.",
      "tips": "Trzymaj kolana w jednej linii ze stopami, aby uniknąć niepotrzebnego obciążania stawów."
     },
     {
      "name": "Single-Leg Standing Calf Raise ze sztangą",
      "desc": "To jednostronne ćwiczenie zwiększa intensywność pracy jednej łydki na raz, głównie mięśnia brzuchatego. Pomaga wyrównać dysproporcje siłowe i mięśniowe.",
      "tips": "Trzymaj stabilną pozycję, używając drugiej ręki do podparcia, jeśli to konieczne, aby nie tracić równowagi."
     }
    ]
   },
   {
    "label": "Ćwiczenia z hantlami / kettlebell (Dumbbell / KB)",
    "exercises": [
     {
      "name": "Dumbbell Standing Calf Raise",
      "desc": "Ćwiczenie angażujące mięsień brzuchaty łydki, wykonywane na stojąco z hantlami w rękach. Pozwala na większą swobodę ruchu niż sztanga, jednocześnie oferując obciążenie.",
      "tips": "Trzymaj hantle stabilnie i unikaj kołysania ciałem, aby skupić całe napięcie na łydkach."
     },
     {
      "name": "Single-Leg Dumbbell Calf Raise",
      "desc": "Intensywna wersja unilateralna, koncentrująca się na mięśniu brzuchatym jednej łydki. Zwiększa aktywację i pomaga w korekcji asymetrii.",
      "tips": "Wykonuj ćwiczenie powoli i z pełnym zakresem ruchu, aby zmaksymalizować skurcz i rozciągnięcie."
     },
     {
      "name": "Seated Dumbbell Calf Raise (hantle na kolanach)",
      "desc": "Wersja unoszenia łydek w siadzie z hantlami na kolanach, celująca w mięsień płaszczkowaty. Hantle pozwalają na łatwe dostosowanie obciążenia.",
      "tips": "Upewnij się, że hantle leżą stabilnie na udach tuż nad kolanami, aby nie zsuwały się podczas ruchu."
     },
     {
      "name": "Walking Calf Raise z hantlami",
      "desc": "To dynamiczne ćwiczenie angażuje mięśnie brzuchate i płaszczkowate, jednocześnie poprawiając wytrzymałość mięśniową. Polega na chodzeniu na palcach z obciążeniem.",
      "tips": "Utrzymuj stałe tempo i wysokie uniesienie na palcach przez cały czas trwania serii."
     },
     {
      "name": "Kettlebell Standing Calf Raise",
      "desc": "Podobne do wersji z hantlami, ale kettlebell może zapewnić nieco inny środek ciężkości, angażując głównie mięsień brzuchaty. Wygodne do trzymania przy ciele.",
      "tips": "Użyj jednego lub dwóch kettlebelli, utrzymując je stabilnie wzdłuż ciała."
     }
    ]
   },
   {
    "label": "Ćwiczenia na maszynach",
    "exercises": [
     {
      "name": "Standing Calf Raise Machine",
      "desc": "Specjalistyczna maszyna do unoszenia łydek w pozycji stojącej, skutecznie izolująca mięsień brzuchaty. Zapewnia stabilność i możliwość dużego obciążenia.",
      "tips": "Ustaw poduszki na ramionach tak, aby ciężar był równomiernie rozłożony i nie obciążał kręgosłupa."
     },
     {
      "name": "Seated Calf Raise Machine",
      "desc": "Maszyna do unoszenia łydek w siadzie, idealna do izolowania mięśnia płaszczkowatego. Umożliwia precyzyjne obciążenie i kontrolę ruchu.",
      "tips": "Upewnij się, że poduszka opiera się na udach tuż nad kolanami, a pięty swobodnie opadają poniżej platformy."
     },
     {
      "name": "Donkey Calf Raise Machine",
      "desc": "Maszyna symulująca 'donkey calf raise', gdzie obciążenie naciska na dolną część pleców, efektywnie angażując zarówno mięsień brzuchaty, jak i płaszczkowaty. Pozwala na bardzo duże rozciągnięcie.",
      "tips": "Utrzymuj tułów zgięty w biodrach i stopy równolegle, aby zmaksymalizować rozciągnięcie łydek."
     },
     {
      "name": "Leg Press Calf Raise (wypychanie piętami na suwnicy)",
      "desc": "Wykorzystuje suwnicę do wypychania platformy stopami, skupiając się na mięśniu brzuchatym i płaszczkowatym. Pozwala na bardzo duże obciążenia.",
      "tips": "Upewnij się, że nogi są wyprostowane, ale kolana nie są zablokowane, a palce stóp są ustawione na dolnej krawędzi platformy."
     },
     {
      "name": "Hack Squat Calf Raise",
      "desc": "Ćwiczenie wykonywane na maszynie do hack squatów, angażuje mięśnie łydek (głównie brzuchaty) w pozycji stojącej. Stabilizacja maszyny pozwala na skupienie się na pracy mięśniowej.",
      "tips": "Ustaw stopy nisko na platformie, aby umożliwić pełne opuszczenie pięt i rozciągnięcie łydek."
     },
     {
      "name": "Horizontal / Seated Leg Press Calf Raise",
      "desc": "Wariacja na suwnicy, gdzie nogi są ugięte lub wyprostowane, a platforma jest wypychana samymi palcami. Angażuje głównie mięsień płaszczkowaty.",
      "tips": "Zachowaj stały nacisk na platformę i kontroluj ruch, unikając dynamicznego odbicia."
     },
     {
      "name": "Calf Press Machine",
      "desc": "Specjalistyczna maszyna do wypychania łydek, często w pozycji siedzącej lub leżącej, celująca w mięsień płaszczkowaty. Zapewnia izolację i stabilność.",
      "tips": "Skup się na pełnym rozciągnięciu na dole i mocnym spięciu na szczycie ruchu, trzymając kolana lekko ugięte."
     }
    ]
   },
   {
    "label": "Ćwiczenia z masą ciała (Bodyweight)",
    "exercises": [
     {
      "name": "Standing Calf Raise (na schodku / podwyższeniu)",
      "desc": "Podstawowe ćwiczenie na mięsień brzuchaty łydki, wykonywane na podwyższeniu dla zwiększenia zakresu ruchu. Można je wykonywać z własną masą ciała lub z obciążeniem.",
      "tips": "Użyj podparcia, aby utrzymać równowagę i skupić się na pracy mięśni, a nie na stabilizacji."
     },
     {
      "name": "Single-Leg Standing Calf Raise",
      "desc": "Wersja unilateralna unoszenia łydek, skupiająca się na jednej nodze, aby wzmocnić mięsień brzuchaty i poprawić równowagę. Skuteczna dla korekcji dysproporcji.",
      "tips": "Kontroluj ruch i staraj się nie odbijać od dolnego punktu, aby utrzymać stałe napięcie mięśniowe."
     },
     {
      "name": "Seated Calf Raise (bez obciążenia lub z partnerem)",
      "desc": "Ćwiczenie na mięsień płaszczkowaty, wykonywane w siadzie, z partnerem siedzącym lub naciskającym na kolana. Dobra opcja dla domowych treningów.",
      "tips": "Partner powinien równomiernie dociskać uda, a Ty skup się na maksymalnym rozciągnięciu i spięciu łydek."
     },
     {
      "name": "Donkey Calf Raise (z partnerem lub pasem)",
      "desc": "Unoszenie łydek z tułowiem pochylonym do przodu, partner siada na Twoich biodrach lub używasz pasa z obciążeniem. Efektywnie angażuje oba mięśnie łydek z dużym rozciągnięciem.",
      "tips": "Trzymaj nogi proste (ale nie zablokowane w kolanach) i skup się na pełnym rozciągnięciu i skurczu łydek."
     },
     {
      "name": "Jump Rope / Skakanka",
      "desc": "Dynamiczne ćwiczenie cardio i plyometryczne, które wzmacnia wytrzymałość mięśni brzuchatych i płaszczkowatych łydek. Poprawia również koordynację.",
      "tips": "Ląduj miękko na śródstopiu i staraj się unikać lądowania na całych stopach, aby zminimalizować wstrząsy."
     },
     {
      "name": "Box Jump / Jump Squats (element plyometryczny)",
      "desc": "Ćwiczenia plyometryczne, które zwiększają moc i eksplozywność mięśni łydek, angażując głównie mięsień brzuchaty. Wzmacniają zdolności skokowe.",
      "tips": "Skup się na miękkim lądowaniu i natychmiastowym odbiciu, aby maksymalizować efekt plyometryczny."
     },
     {
      "name": "Farmer’s Walk on Toes",
      "desc": "Wersja spaceru farmera, w której poruszasz się wyłącznie na palcach, trzymając ciężkie hantle lub kettlebelle. Wzmacnia wytrzymałość mięśni brzuchatych i płaszczkowatych.",
      "tips": "Utrzymuj wysoką postawę i staraj się iść na palcach przez jak najdłuższy czas lub dystans."
     }
    ]
   },
   {
    "label": "Ćwiczenia na wyciągu / inne",
    "exercises": [
     {
      "name": "Cable Standing Calf Raise",
      "desc": "Unoszenie łydek w pozycji stojącej, wykorzystujące wyciąg linkowy, co zapewnia stałe napięcie w całym zakresie ruchu. Angażuje głównie mięsień brzuchaty.",
      "tips": "Ustaw uchwyt na odpowiedniej wysokości i użyj pasa, aby przymocować ciężar do bioder lub ramion, zapewniając stabilność."
     },
     {
      "name": "Banded Calf Raise",
      "desc": "Unoszenie łydek z użyciem taśmy oporowej, która zwiększa opór w górnej fazie ruchu, angażując mięsień brzuchaty. Wygodne do treningu w domu.",
      "tips": "Taśmę umieść pod palcami stóp, a końce trzymaj w rękach lub przymocuj do stabilnego punktu."
     },
     {
      "name": "TRX / Suspension Calf Raise",
      "desc": "Ćwiczenie wykorzystujące system podwieszany (TRX), gdzie obciążenie stanowi własna masa ciała, angażując mięśnie brzuchate i płaszczkowate. Pozwala na modyfikację trudności.",
      "tips": "Użyj TRX-a do wsparcia i kontroli ruchu, skupiając się na pełnym rozciągnięciu i spięciu łydek."
     },
     {
      "name": "Reverse Calf Raise (na tibialis anterior – przednia część goleni)",
      "desc": "Ćwiczenie angażujące mięśnie piszczelowe przednie, odpowiedzialne za zginanie grzbietowe stopy. Pomaga wzmocnić mięśnie przeciwstawne do łydek i zapobiega urazom.",
      "tips": "Usiądź lub stań na piętach na podwyższeniu, tak aby palce stóp były luźne, a następnie unoś je ku górze."
     }
    ]
   }
  ],
  "note": "Podział według części łydek (orientacyjny):\nGastrocnemius (górna, widoczna część) → standing calf raises (proste kolana)\nSoleus (głębsza, dolna część) → seated calf raises (zgięte kolana)\nJednostronne → single-leg calf raises\nPlyometria / wytrzymałość → skakanka, skoki, toe walks"
 }
};
