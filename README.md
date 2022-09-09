# huroutes - Magyar utak vezetésre

Ez a repo tartalmazza a [huroutes](https://sp3eder.github.io/huroutes) weblap forrását, mely weblap elérhető a https://sp3eder.github.io/huroutes címen.

## Telefonos Applikáció
Elérhető telefonos applikáció **Android** operációs rendszerre a huroutes-hoz. Ehhez az apk filet (a telepítőt) [innen](https://github.com/Sp3EdeR/huroutes-android/releases) lehet letölteni. Mivel nem "hivatalos" boltból származik, a telefonon be kell kapcsolni az [ismeretlen forrásból történő telepítést](https://onlyhow.net/hu/ismeretlen-forrasbol-szarmazo-alkalmazasok-telepitese-androidon).

## Hibák és Javaslatok Bejelentése

Amennyiben hibákat vagy javaslatokat szeretnél jelezni a tartalommal kapcsolatban, kérlek az ["Issues" tabon](https://github.com/Sp3EdeR/huroutes/issues) nyiss egy [új issuet](https://github.com/Sp3EdeR/huroutes/issues/new/choose) amiben leírod a problémát. A szerkesztők kezelni fogják.

Ha általad ismert útvonalat javasolnál, akkor kérlek töltsd ki minél alaposabban az [Új útvonal](https://github.com/Sp3EdeR/huroutes/issues/new?assignees=&labels=enhancement&template=new_route.yml&title=%5BROUTE%5D%3A+) kérdőívet, hogy a szerkesztők könnyen hozzá tudják adni a javaslatot a weblaphoz. Az útvonal értékelése a dinamikus vezetés élményét próbálja jelképezni. Próbálj megnézni a térképről pár ismert útvonalat, és azokhoz hasonlítva találj egy megfelelő értékelést az útvonalnak.

## Szerkesztés

A weblap tartalma közösségi és szerkesztheti bárki és meg is köszönünk minden közreműködést a szerkesztőknek! A szerkesztéshez először is szükséges egy GitHub regisztráció. Ezek után vázlatosan:

1. Forkoljuk le [ezt a repót](https://github.com/Sp3EdeR/huroutes), a jobb-felső sarokban lévő Fork gomb/menü alatt. Ezzel egy saját másolathoz jutunk amiben kedvünkre garázdálkodhatunk.
2. A saját forkunkban szerkesszük meg a `data.json` filet. A file formátuma a [JSON](https://hu.wikipedia.org/wiki/JSON). Nagyon fontos, hogy ne vétsünk hibát a formátumában, mert az a teljes oldalt elronthatja.
3. Hozzuk létre a `data.json` fileba esetlegesen beírt új fileokat pontosan a megfelelő helyen. (Kis és nagybetű számít!)
	* Az útvonal leírására használt `.md` file tartalma [Markdown formátumú](https://en.wikipedia.org/wiki/Markdown). Pontos dokumentáció a formátumról [itt található](https://github.com/showdownjs/showdown/wiki/Showdown's-Markdown-syntax).
	* Az útvonal megrajzolásához a `.kml` filet az alábbi módon javasolt létrehozni:
		1. Menjünk el a https://mymaps.google.com/ honlapra.
		2. Kattintsunk az "új térkép készítése" gombra, vagy nyissunk meg egy korábbi, módosítható térképet.
		3. A keresőmező alatti eszköztárban kattintsunk az "Útvonalterv" ikonra, majd az újonnan megnyílt rétegen tervezzük meg az útvonalat.
		4. Ha az útvonalunk kész, kattintsunk a térkép (és nem a réteg) `...` ikonjára, majd válasszuk az "Exportálás KML-be/KMZ-be" opciót.
		5. A megnyíló ablakban az "Egész térkép" legördülőből válasszuk ki az épp most tervezett utunk rétegét és pipáljuk be az "Exportálás KML formátumban KMZ helyett" pipát.
		6. Kattintsunk a "Letöltés" gombra, és mentsük el a fileunkat a megfelelő helyre. Javasolt nem használni ékezetes karaktereket.
4. Commitoljuk a `data.json`, `.md` és `.kml` fileokban történt módosításainkat a git repóba.
	* Minden módosítás után írjunk rövid összefoglalót a commit ablakban arról, hogy mit is módosítottunk.
5. Teszteljük a módosításainkat.
	1. Ehhez a saját repónk beállításaiban görgessünk le a [GitHub Pages](https://pages.github.com/) szekcióra.
	2. Publikáljuk oldalunkat, melyért cserébe kapunk egy weblap címet. (Ezt csak egyszer kell megcsinálni.)
	3. Navigáljunk el a weblapunkra és ellenőrizzük, hogy minden jó-e.
6. Nyissunk egy "pull requestet" amivel a módosításainkat visszaküldjük a főoldalra.
	1. A saját repónkban navigáljunk a "Pull requests" tabra.
	2. Kattintsunk a "New pull request" gombra.
	3. Ellenőrizzük módosításainkat és töltsük ki az információs űrlapot.
	4. Küldjük el a pull requestet.
	
Bárki szabadon nyithat pull requestet. Ezt megkapják az oldal szerkesztői és miután ellenőrzik a módosításokat (és esetlegesen javításokat kérnek hozzá), feltehetőleg elfogadják és beengedik a pull requestet. Ennek eredményeként rögtön láthatjuk majd a fő weblapon munkánk gyümölcsét.

### Helyjelölők

Használhatunk helyjelölő linkeket az útvonalak leírásai (`.md` fileok) alatt. Ezekkel a leírásokat sokkal szemléletesebbé tehetjük az olvasó számára. A https://sp3eder.github.io/huroutes/linkmaker.html címen érhető el egy helyjelölő szerkesztő, ami segít ilyen linkeket előállítani. [Például ilyen helyjelölőket](https://sp3eder.github.io/huroutes/#geo:P%C3%A9lda@47.498345,19.040458/?b=%C3%8Dgy%20n%C3%A9z%20ki%20egy%20helyjel%C3%B6l%C5%91%20link.) lehet ennek segítségével létrehozni.

## Licensz

A repóban található információk és tartalom "közkincs"-ként használhatóak. Tetszőlegesen másolhatóak, szerkeszthetőek a forrás megjelölése nélkül. A tartalomra, annak felhasználhatóságára, helyességére, bármiféle egyéb követelményeire a szerzők NEM vállalnak felelősséget. Mindenki saját felelősségére használja ezeket.

Ezzel együtt a szerkesztők által kért felhasználási mód az lenne - a közösség megtartása érdekében - hogy igyekezzünk visszajuttatni minden hasznos információt a [huroutes oldalra](https://sp3eder.github.io/huroutes) és osszuk tovább ezt, ahol csak lehetséges. Így lesz mindenkinek jó.
