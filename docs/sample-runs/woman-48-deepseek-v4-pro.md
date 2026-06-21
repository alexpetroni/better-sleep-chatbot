# Exemplu de consultație — femeie, 48 de ani

Persona: femeie, 48 de ani, doi adolescenți, job de manager, stres ridicat. Tipar de somn: adormire grea + trezire la 4 dimineața cu mintea alertă, bufeuri, palpitații.

| | |
|---|---|
| Model interviu + extracție | `deepseek-v4-flash` |
| Model evaluare (concluzie) | `deepseek-v4-pro` |
| Acoperire finală | 8/26 domenii aplicabile |
| Cost total | **$0.0110** |

> Generat live prin pipeline-ul Fireworks (`scripts/test-woman48.mts`).

---

## Chestionarul (conversația)

**👤 Utilizator**

Bună. De vreo jumătate de an nu mai pot să adorm seara — stau cu ochii în tavan ore întregi — și apoi mă trezesc pe la 4 dimineața cu mintea care merge cu o sută la oră.

**🩺 Agent**

Bună, mă bucur că ai venit. Hai să lămurim ce se întâmplă exact — nu e un test, nu trebuie să ghicești nimic, doar să povestești cum simți tu.

Să încep cu miezul: spui că stai cu ochii în tavan ore întregi. Să punem un număr pe asta — cât timp îți ia, în medie, să adormi seara? Și cât de des se întâmplă trezirea la 4?

**👤 Utilizator**

Am 48 de ani, am doi adolescenți și un job de manager, mereu e ceva. Seara, când se liniștește casa, încep să mă gândesc la tot ce am de făcut a doua zi și nu mă pot opri.

**🩺 Agent**

Ai 48 de ani, doi adolescenți acasă și un job de manager — e ca și cum ai trăi în două schimburi, fiecare cu lista lui de sarcini. Are sens că seara, când tăcerea vine, toată lista aceea ți se rulează în cap.

Hai să fixăm un număr: cât timp trece, de regulă, de când te bagi în pat până când chiar adormi? Și apropo de trezirea la 4 — în fiecare noapte, sau în valuri?

**👤 Utilizator**

Beau cam 3-4 cafele pe zi, ultima pe la 17-18 ca să rezist. Seara un pahar-două de vin mă mai relaxează. Și recunosc, stau pe telefon în pat până târziu.

**🩺 Agent**

Ok, să trag o concluzie intermediară — corectează-mă dacă greșesc:

3-4 cafele pe zi, ultima în jurul orei 17-18, asta înseamnă că la 22-23, când încerci să dormi, încă ai cofeină circulând (se elimină în 6-8 ore, uneori mai mult). Apoi vinul seara — relaxează la început, dar metabolismul alcoolului pe la 2-3 dimineața dă un rebound de adrenalină care exact pe la 4 te trezește. Iar telefonul în pat ține creierul în modul „scanare / alertă".

Astea sunt mecanisme foarte clare, nu e nimic misterios — dar nu le schimbăm pe toate deodată.

Înainte să vorbim de soluții: cum arată programul tău de somn în zilele de lucru față de weekend? Te culci și te trezești cam la aceeași oră? Și cum ai defini cronotipul tău natural — dacă n-ai avea nicio obligație, la ce oră ai adormi și la ce te-ai trezi singură?

**👤 Utilizator**

Da, am bufeuri și transpir noaptea, ciclul e dat peste cap de vreun an. Mă trezesc uneori leoarcă. Și inima îmi bate tare când mă trezesc la 4.

**🩺 Agent**

Perfect, acum tabloul începe să se lege. Ceea ce descrii — bufeuri, transpirații nocturne, ciclu neregulat de ~un an — e perimenopauză clasică. Iar trezirea la 4 cu inima bătând tare poate veni din exact acea furtună hormonală: scăderea estrogenului destabilizează termoreglarea și afectează axul care ține cortizolul sub control noaptea. Rezultatul: un val de căldură trezește creierul și cortizolul urcă brusc — hopa, gândurile și inima accelerată.

Astea nu exclud cafeaua, vinul și telefonul — ele adaugă gaz pe foc — dar schimbarea hormonală e probabil arzătorul principal.

Acum, întrebare practică: ai discutat cu un medic despre tranziția asta? Și ce ai încercat până acum pentru somn — melatonină, plante, rețete, terapie? Vreau să știu ce ai deja în geantă, ca să nu repet.

**👤 Utilizator**

Nu sforăi, din câte știu. Nu am picioare neliniștite. Ziua sunt epuizată, dar în pat parcă sunt în priză. Stresul e clar 8 din 10. Weekendul recuperez, dorm până la 10.

**🩺 Agent**

Clar. Weekendul recuperezi — asta e o informație importantă. Spune-mi: în weekend, când dormi până la 10, ce oră e ultima cafea? Și ce oră bei vinul, dacă bei?

Și încă una: ce se întâmplă fix înainte de culcare — ultima oră înainte să stingi lumina? Ești pe telefon? Sau ai vreun ritual care să spună creierului „gata, se închide ziua"?

**👤 Utilizator**

Cam ăsta e tabloul. Ce părere ai, ce vezi?

---

## Concluzia (model: `deepseek-v4-pro`)

**Unde ești acum**

Imaginează-ți corpul ca pe o casă cu doi etaje. La etaj, sistemul de securitate — cortizolul, adrenalina — stă cu senzorii blocați pe „alertă maximă". La parter, centrala pe lemne — ovarele — aruncă pe foc bușteni la întâmplare, pentru că rezerva de progesteron și estrogen fluctuează haotic. Așa arată perimenopauza: termostatul (termoreglarea) se dereglează, bufeurile nocturne devin un incendiu care forțează sistemul de securitate să tragă alarma. Cortizolul — care ar trebui să fie la minim la ora 4 dimineața — primește semnal fals de urgență, explodează, te trezește cu inima bătând și mintea deja pe turație maximă. Același cortizol, în mod normal, ar fi trebuit să scadă lin seara ca să permită melatoninei să deschidă poarta somnului. Dar când seara îi dai sistemului de securitate motive suplimentare să rămână în priză — lumină albastră din telefon, cofeină care încă patrulează prin sânge — adormirea devine aproape imposibilă. Nu e vorba că nu ești suficient de obosită, e că sistemul tău de alertă nu primește semnalul de „stingere". Iar weekendul, când dormi până la 10, nu faci decât să împingi ceasul intern cu câteva ore mai târziu — un jet lag social care face ca lunea să reînceapă de la zero. Nu ai făcut nimic greșit; e un sistem care s-a blocat într-o buclă.

**Ce hrănește bucla**

Cafeaua de la 17–18 e un combustibil direct pe cortizol. Timpul de înjumătățire al cofeinei e de 6 ore, deci la 23 încă ai jumătate din doză activă blocând receptorii de adenozină — exact substanța care îți spune creierului „ai obosit, merită să dormi". Apoi, paharul-două de vin seara: alcoolul e sedativ, dar e un sedativ fals. Odată metabolizat, pe la 3–4 dimineața, lasă în urmă un val de glutamat și adrenalină — exact mecanismul care explică trezirea bruscă, cu tahicardie. Telefonul în pat, fără o perdea de relaxare între tine și ecran, menține cortexul prefrontal în mod „scanare și anticipare": regretele și lista de mâine se rostogolesc pentru că nu ai dat creierului un semnal clar de încheiere a zilei. Apoi, perimenopauza: scăderea estrogenului destabilizează centrii termoreglatori din hipotalamus, iar lipsa progesteronului (care în mod normal e ușor sedativ și anxiolitic) lasă sistemul GABA-ergic nepăzit — anxietatea și ruminația nocturnă au teren liber. Stresul cronic de 8/10 menține tonusul simpatic permanent ridicat, iar recuperarea din weekend (trezirea la 10) dereglează ritmul circadian, creând un decalaj pe care creierul îl resimte ca pe o micro-schimbare de fus orar în fiecare săptămână. Toate acestea se susțin reciproc: cu cât dormi mai prost, cu atât ai nevoie de mai multă cafea să funcționezi; cu cât ești mai stresată, cu atât vinul pare soluția de seară; cu cât te culci mai greu, cu atât stai mai mult pe telefon.

**Ce aș sugera, iar ordinea contează**

**Săptămânile 1–2: cele trei pârghii mari, cu impact imediat**

1. Mută ultima cafea înainte de ora 13:00. Știm că timpul de înjumătățire e de 6 ore, așa că până la 22–23 vei fi eliminat suficientă cofeină cât să nu mai blocheze somnul profund. Dacă ți-e greu brusc, redu treptat: o ceașcă mai puțin la fiecare 2 zile, iar după-amiaza înlocuiește cu un ceai fără cofeină sau simplă apă fierbinte — gestul cald păcălește nevoia de ritual.

2. Renunță complet la alcool în aceste două săptămâni. Nu e o judecată morală, e o testare curată: vrem să vedem cât din trezirea la 4 dispare fără reboundul adrenergic dat de metabolizarea alcoolului. Înlocuiește vinul cu o băutură caldă, neîndulcită, asociată cu un moment de „stop" — un ceai de roiniță, o cană cu apă și lămâie.

3. Introdu o rutină de seară cu o oră înainte de stingere, fără ecrane. Nu e vorba de perfecțiune, ci de a da creierului un semnal de încheiere. Telefonul iese din dormitor — îl lași la încărcat în bucătărie sau pe hol. În schimb, creezi un micro-ritual: un duș cald (scăderea ulterioară a temperaturii corpului ajută somnul), 10 minute de respirație lentă (inspir 4 secunde, expir 6 — activează vagal și reduce cortizolul), notarea pe hârtie a 3 lucruri care te îngrijorează pentru mâine („brain dump" descarcă memoria de lucru).

**Săptămânile 3–4: stabilizează ritmul și adaugă lumină**

4. Fixează o oră de trezire constantă, 7 zile din 7. Dacă simți nevoia de recuperare, poți adăuga 30 de minute în weekend, dar nu mai mult. Trezirea la aceeași oră este ancora circadiană principală — mai puternică decât ora de culcare. În plus, în primele 30 de minute după trezire, ieși la lumină naturală (balcon, fereastră deschisă). Lumina dimineții inhibă melatonina, setează ceasul intern și îmbunătățește adormirea seara. Dacă nu ai lumină naturală, o lampă de 10.000 lux timp de 20 de minute e o investiție excelentă.

**Luna 2+: suportul nutrițional și evaluarea medicală**

5. După ce ai stabilizat primele schimbări, poți lua în considerare magneziu bisglicinat seara (200–300 mg) — susține GABA și relaxarea musculară. Melatonina poate fi utilă, dar doar dacă ora de culcare e constantă și expunerea la lumină e corectă; altfel riști să o iei degeaba. Începi cu 0.5–1 mg cu 30 minute înainte de culcare.

6. **Evaluare medicală dedicată**: descrierea ta — bufeuri, transpirații nocturne, ciclu neregulat — e perimenopauză tipică. Ai nevoie de o discuție cu un medic care înțelege această tranziție. Nu e vorba de boală, ci de o etapă care, gestionată bine, nu trebuie să fie chin. De asemenea, trezirea la 4 cu tahicardie merită un control cardiovascular (tensiune arterială, EKG) pentru excluderea altor cauze. Aceste evaluări nu complică povestea, ci o fac mai ușor de rezolvat — pentru că știm exact cum stăm.

**Versiunea sinceră**

Nu va fi ușor în primele 10–14 zile. Corpul tău e obișnuit cu cofeina de după-amiază, cu micro-sedarea alcoolului de seară, cu stimularea ecranului. Primele nopți fără aceste cârje externe pot părea mai grele, pentru că nivelul de alertă internă e încă nesupravegheat. Dar exact acolo e punctul de cotitură: pe măsură ce scoți factorii perturbatori, oferi creierului tău șansa să își regăsească singur ritmul. Schimbările hormonale nu dispar peste noapte, dar somnul tău nu trebuie să fie prizonierul lor. Așteaptă-te ca primele semne de îmbunătățire a adormirii să apară în 7–10 zile de la aplicarea constantă a pașilor 1–3. Trezirile la 4 se vor domoli treptat odată cu eliminarea alcoolului și stabilizarea glicemiei nocturne. Nu ai pierdut capacitatea de a dormi; ai pierdut temporar condițiile. Le reconstruim, pas cu pas. Revino cu feedback după 3 săptămâni — e suficient să vedem ce a mers și ce trebuie ajustat.


---

## Anexă A — checklist intern (digest trimis modelului de evaluare)

```
Profil: sex=female, vârstă=48.
Problema principală: Insomnie de adormire si trezire precoce cu 4 AM cu agitatie, pe fond de perimenopauza si stres cronic

Domenii investigate:
- Ritm circadian & cronotip [partial]: Program neregulat: in timpul saptamanii probabil se culca tarziu, in weekend recupereaza pana la 10. Nu stim ora exacta de culcare in timpul saptamanii sau cronotipul natural. Decalajul (jet lag social) e probabil.
- Expunere la lumină [partial]: Sta pe telefon in pat pana tarziu, dar nu stim expunerea la lumina naturala dimineata sau cat de intuneric e dormitorul.
- Igienă de somn & comportamente de seară [complete]: Stă pe telefon în pat până târziu, ecranul în pat ține creierul în stare de alertă/scanare. Nu există rutină de relaxare seara.
- Cofeină, alcool, nicotină, canabis [complete]: 3-4 cafele pe zi, ultima pe la 17-18. Un pahar-doua de vin seara. Nu mentioneaza nicotina sau canabis.
- Alimentație seara [partial]: Nu s-a discutat despre ora cinei, conținutul ei, sau consumul de lichide seara (relevant pentru nocturie, mai ales în perimenopauză).
- Medicamente & istoric de tratament [partial]: Nu a incercat nimic pentru somn pana acum (nu stie medicul, nu a luat suplimente/medicamente).
- Mediul fizic de somn [pending]: (neatins)
- Partener, copii, animale [partial]: Are doi adolescenti acasa. Nu detaliaza daca partenerul sau copiii ii afecteaza somnul.
- Câmpuri electromagnetice & poluanți [pending]: (neatins)
- Respirație în somn / apnee [complete]: Nu sforaie, din cate stie. Nu sunt semne de apnee obstructiva.
- Neurologic-motor [complete]: Nu are picioare nelinistite sau zvacniri, conform spuselor.
- Durere & musculo-scheletal [pending]: (neatins)
- Digestiv & axa intestin-creier [pending]: (neatins)
- Urinar / nocturie [partial]: Nu s-a discutat despre treziri pentru urinat — relevant în contextul perimenopauzei și al consumului de lichide seara.
- Cardiovascular & circulator [partial]: Treziri cu inima accelerată la 4 AM — poate fi rebound adrenergic din alcool, dar și un semn cardiovascular. Nu s-a detaliat tensiunea sau palpitațiile în general.
- Hormonal feminin [complete]: Are 48 de ani, ciclu neregulat de un an, bufeuri si transpiratii nocturne (se trezeste leoarca). Perimenopauza evidenta.
- Endocrin general [partial]: Perimenopauza implica fluctuatii hormonale majore (estrogen, progesteron) care afecteaza somnul. Nu stim despre cortizol sau tiroida.
- Metabolic — glicemie [partial]: Trezirea la 4 cu inima accelerata poate fi si hipoglicemie nocturna, dar ea mentioneaza si transpiratii/bufeuri, deci e mai probabil hormonal. Nu stim daca are foame sau tremur la trezire.
- Deficiențe nutriționale [pending]: (neatins)
- Inflamație, imunitate, alergii, histamină [pending]: (neatins)
- Hiperactivare neurovegetativă [complete]: Ziua epuizata, seara in priza, nu poate opri gandurile. Corp incordat la culcare, mintea merge cu 100 la ora la trezire. Hiperactivare neurovegetativa clara.
- Cognitiv-emoțional [complete]: Seara, când casa se liniștește, începe să regrete/gândească tot ce are de făcut a doua zi — gânduri care aleargă, incapacitate de a închide ziua. Perfecționism/control sugerat de stilul de manager.
- Psihiatric [pending]: (neatins)
- Stres & context de viață [complete]: Stres 8/10, job de manager, doi adolescenti, mereu e ceva. Stresor principal: incarcatura generala.
- Siguranță & mediu psihologic [partial]: Nu stim nimic despre siguranta sau tensiunile din casa dincolo de adolescenti si stres general.
- Insomnie condiționată / învățată [partial]: Stă cu ochii în tavan ore întregi — poate dezvolta teamă de pat și de somn, dar nu a menționat sentimentul de alertă în pat sau că doarme mai bine în altă parte.

Semnale de alarmă observate: Perimenopauză manifestă cu bufeuri și transpirații nocturne care fragmentează somnul — necesită abordare hormonală și non-hormonală.; Trezire la 4 cu palpitații (necesită evaluare cardiovasculară și hormonală); Stres 8/10 cronic, cu epuizare diurnă - risc de burnout
```

## Anexă B — progresul extracției pe ture

**Tura 1** · profil: sex=?, vârstă=? · acoperire 0/25 · updates: U:partial, V:partial · → domeniul A

**Tura 2** · profil: sex=female, vârstă=48 · acoperire 0/26 · updates: A:partial, C:partial, V:partial, U:partial, X:partial, H:partial · → domeniul A

**Tura 3** · profil: sex=female, vârstă=48 · acoperire 0/26 · updates: A:partial, B:partial, C:partial, D:partial, H:partial, U:partial, V:partial, X:partial, Z:partial · → domeniul A

**Tura 4** · profil: sex=female, vârstă=48 · acoperire 5/26 · updates: P:complete, A:partial, C:complete, D:complete, H:partial, U:partial, V:complete, O:partial, E:partial, N:partial · ⚑ Perimenopauză manifestă cu bufeuri și transpirații nocturne care fragmentează somnul — necesită abordare hormonală și non-hormonală. · → domeniul B

**Tura 5** · profil: sex=female, vârstă=48 · acoperire 8/26 · updates: A:partial, C:partial, D:complete, P:complete, U:complete, V:partial, X:complete, J:refused, K:refused · ⚑ Trezire la 4 cu palpitații (necesită evaluare cardiovasculară și hormonală); Stres 8/10 cronic, cu epuizare diurnă - risc de burnout · → domeniul B

**Tura 6** · profil: sex=female, vârstă=48 · acoperire 8/26 · updates: A:partial, B:partial, C:partial, D:complete, F:partial, H:partial, J:complete, K:complete, P:complete, U:complete, V:partial, X:complete, R:partial, Q:partial, Y:partial · → HANDOFF

## Anexă C — cost detaliat

| model | apeluri | tokens in | tokens out | cost |
|---|---|---|---|---|
| `deepseek-v4-flash` | 11 | 36141 | 4515 | $0.00678 |
| `deepseek-v4-pro` | 1 | 3510 | 3140 | $0.00424 |
| **TOTAL** | | | | **$0.01102** |
