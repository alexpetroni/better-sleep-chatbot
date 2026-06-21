# Exemplu de consultație — femeie, 48 de ani

Persona: femeie, 48 de ani, doi adolescenți, job de manager, stres ridicat. Tipar de somn: adormire grea + trezire la 4 dimineața cu mintea alertă, bufeuri, palpitații.

| | |
|---|---|
| Model interviu + extracție | `deepseek-v4-flash` |
| Model evaluare (concluzie) | `glm-5p2` |
| Acoperire finală | 9/26 domenii aplicabile |
| Cost total | **$0.0223** |

> Generat live prin pipeline-ul Fireworks (`scripts/test-woman48.mts`).

---

## Chestionarul (conversația)

**👤 Utilizator**

Bună. De vreo jumătate de an nu mai pot să adorm seara — stau cu ochii în tavan ore întregi — și apoi mă trezesc pe la 4 dimineața cu mintea care merge cu o sută la oră.

**🩺 Agent**

Bună, mă bucur că ai venit să vorbim. Ceea ce descrii — să nu poți adormi și apoi să te trezești devreme cu mintea într-un galop — e un tipar clasic, dar foarte obositor. Vreau să înțeleg exact pe ce teren se joacă.

Spune-mi: când zici „ore întregi", e vorba de 30 de minute, de o oră sau mai mult? Și ce faci, de fapt, în acel interval — te întorci pe pernă, verzi ceasul, poate ajungi să te uiți la telefon?

**👤 Utilizator**

Am 48 de ani, am doi adolescenți și un job de manager, mereu e ceva. Seara, când se liniștește casa, încep să mă gândesc la tot ce am de făcut a doua zi și nu mă pot opri.

**🩺 Agent**

Înțeleg. E momentul în care presiunea dispare și gândurile prind glas. Așa că hai să vedem cum arată seara ta concret, de la cină încoace.

Când și ce mai mănânci sau bei seara? Și înainte de culcare, ce faci în ultima oră — stai pe laptop, te uiți la ceva, mai lucrezi?

**👤 Utilizator**

Beau cam 3-4 cafele pe zi, ultima pe la 17-18 ca să rezist. Seara un pahar-două de vin mă mai relaxează. Și recunosc, stau pe telefon în pat până târziu.

**🩺 Agent**

Perfect, asta clarifică multe. Cofeina după 3-4 după-amiaza, la 48 de ani, se metabolizează mai încet — e posibil să aibă impact chiar și la 11 noaptea. Iar vinul, deși te ajută să adormi mai repede, fragmentează somnul în a doua jumătate a nopții, exact când te trezești cu mintea alertă.

Hai să completăm puțin tabloul. În zilele de lucru, la ce oră te bagi în pat (nu când adormi, ci când te bagi) și la ce te trezești? Și între zilele de lucru și weekend, programul diferă mult — te trezești mai târziu sâmbăta, de exemplu?

**👤 Utilizator**

Da, am bufeuri și transpir noaptea, ciclul e dat peste cap de vreun an. Mă trezesc uneori leoarcă. Și inima îmi bate tare când mă trezesc la 4.

**🩺 Agent**

Asta e o piesă centrală. Bufeurile noaptea, transpirațiile și inima care bate tare la trezire — la 48 de ani, cu ciclu neregulat, tabloul e aproape sigur de tranziție menopauzală. Scăderea de estrogen afectează direct termoreglarea (bufeuri) și poate activa axa stresului (cortizol), exact ceea ce te trezește alertă la 4 dimineața.

Hai să vedem două lucruri:

1. Ai discutat cu medicul ginecolog despre aceste simptome? Ți s-a oferit vreun tratament hormonal sau altceva?
2. Când ai bufeuri noaptea — te trezesc efectiv, sau doar constați dimineața că ești transpirată?

**👤 Utilizator**

Nu sforăi, din câte știu. Nu am picioare neliniștite. Ziua sunt epuizată, dar în pat parcă sunt în priză. Stresul e clar 8 din 10. Weekendul recuperez, dorm până la 10.

**🩺 Agent**

Bine că ai menționat asta — diferența între zilele de lucru și weekend e mare. Când dormi până la 10 sâmbăta, practic muti ceasul intern cu câteva ore, ceea ce face ca duminica seara să nu poți adormi și lunea să fie și mai grea. E un cerc.

Ai spus deja că te simți epuizată. Un lucru important: cum e dimineața ta, fizic? Te trezești cu gură uscată, cu dureri de cap? Și cum ți se pare că respiri noaptea — respirație normală sau simți uneori că ai respira superficial?

**👤 Utilizator**

Cam ăsta e tabloul. Ce părere ai, ce vezi?

---

## Concluzia (model: `glm-5p2`)

**Unde ești acum**

Corpul tău a ajuns într-o stare în care comutatorul dintre „epuizare" și „priză" s-a blocat pe poziția de alertă. E ca un computer care a fost închis forțat prea de multe ori: când încerci să-l repornești, pornește direct în modul de urgență, nu în modul de repaus. Sistemul nervos simpatic — cel care te pregătește să reacționezi la amenințări — a preluat comanda, iar creierul tău interpretează patul nu ca un loc de odihnă, ci ca un loc unde trebuie să proceseze tot ce n-ai procesat ziua. La 4 dimineața, există o fereastră fiziologică normală în care cortizolul începe să urce ca să te pregătească pentru dimineață. Dar la tine, această rampă de lansare a devenit o catapultă: te trezești cu inima bătând tare și mintea în galop, pentru că axa stresului este deja întinsă la maximum și nu mai există o frână care să tempereze răspunsul.

Pe deasupra, în perimenopauză, scăderea de estrogen destabilizează două lucruri: termoregularea (de unde bufeturile și transpirațiile care te scot din somn) și modularea sistemului nervos (estrogenul ajută creierul să mențină un ton calm). Împreună, aceste mecanisme creează trezirea clasică de la 4 dimineață: un val de căldură te scoată din somn, iar cortizolul care urcă prematur transformă trezirea într-un episod de alertă totală, cu inimă accelerată și gânduri care aleargă.

**Ce hrănește bucla**

Fiecare piesă din programul tău actual alimentează exact mecanismul care te ține trează. Cafeaua de la 17-18 — cofeina se înjumătățează abia în 5-6 ore, deci la 23:00 încă ai jumătate din doză în sistem, iar la 48 de ani, ficatul o procesează și mai lent. Cofeina mimează adrenalina: spune corpului că există un motiv să rămână alert. Vinul de seară e mai perfid: te ajută să adormi pentru că e un depresor al sistemului nervos central, dar pe măsură ce e metabolizat (în a doua jumătate a nopții), produce un efect de rebound — somnul se fragmentează exact în intervalul 3-5 dimineața, momentul în care oricum cortizolul începe să urce și bufeturile lovesc. Apoi, telefonul în pat: lumina albastră inhibă melatonina (semnalul chimic al întunericului care spune creierului „e noapte, poți dormi"), iar conținutul — fie el și pașnic — menține cortexul prefrontal într-o stare de procesare activă. În loc să stingă lumina de administrație a creierului, menții biroul deschis.

Iar apoi, weekendul. Când dormi până la 10, creezi un „jet lag social" — ceasul intern se mută cu 2-3 ore, ca și cum ai zbura într-un alt fus orar în fiecare vineri și te întorci duminică seara. Corpul nu mai știe care e dimineața și care e seara, așa că duminica noapte nu poți adormi pentru că ceasul intern încă spune „e doar 21:00". Acest oscilator dereglat amplifică toate celelalte probleme: cortizolul iese și mai des din ritm, termoregularea se destabilizează și mai tare, iar insomnia devine o constantă, nu un accident.

**Ce aș sugera, iar ordinea contează**

*Săptămânile 1-2: Pârghiile care costă cel mai puțin și dau cel mai mult.*

Primul lucru nu e un supliment, ci o decizie de timing. Mută ultima cafea înainte de 13:00. Motivul e mecanic, nu doctrinar: la 48 de ani, în perimenopauză, metabolizarea cofeinei încetinește, iar jumătatea de viață se poate extinde la 8 ore. O cafea la 18:00 înseamnă încă cofeină activă în sistem la 2 dimineața, exact când corpul ar trebui să fie în cel mai profund somn. Nu trebuie să renunți la cafea — doar să o muți mai devreme, astfel încât seara sistemul tău nu mai primește semnalul „suntem în alertă".

Al doilea: stabilizează trezirea. Nu la 5:30, nu drastic — dar fixează o oră de trezire pe care o respecți inclusiv weekendul, cu o variație maximă de 30 de minute. Acest singur lucru, banal ca efort, recalibrează ceasul intern. Când te trezești la aceeași oră, cortizolul învață să urce la momentul potrivit, iar melatonina începe să secrete la timpul corect seara. Fără asta, toate celelalte intervenții lucrează împotriva curentului.

Al treilea: scoate telefonul din pat. Nu-l lăsa în altă cameră încă, dacă asta pare prea mult — dar pune-l pe noptieră, cu ecranul în jos, și nu-l atinge după ce te bagi. Lumina albastră inhibă melatonina, dar și mai important, actul de a consuma informație menține creierul într-o stare de procesare activă, exact opusul ceea ce trebuie pentru adormire.

*Săptămânile 3-4: Reducerea fragmentării.*

Vinul: nu trebuie să-l elimini complet dintr-o dată, dar reduce-l la un pahar, maxim, și termină-l până la 19:30. Scopul nu e moral, ci fiziologic: corpul are nevoie de 3-4 ore pentru a metaboliza alcoolul suficient încât să nu mai fragmenteze somnul în a doua jumătate a nopții. Un pahar la 19:30 înseamnă procesare încheiată pe la 23:00 — momentul în care intri în somn, nu momentul în care alcoolul îți distruge a doua jumătate de noapte.

Adaugă o fereastră de lumină naturală dimineața, 10-15 minute, ideally în primele 30 de minute după trezire. Nu pe telefon — la fereastră, afară, oricât de posomorât pare cerul. Luxul de dimineață calibrează ceasul intern mai puternic decât orice supliment. Acest lucru, combinat cu trezirea stabilă, face ca seara creierul să înceapă să producă melatonină la momentul corect, nu la 1 noaptea.

De asemenea, în această fază, creează un „ritual de închidere" — 15 minute în care pui pe hârtie tot ce ai de făcut a doua zi. Nu în pat, nu în cap, ci la masă, cu pix și hârtie. Motivul e simplu: creierul tău nu poate deconecta pentru că ține activă o listă de sarcini ca să nu le uite. Când le-ai scris, exteriorizezi memorarea și creierul poate lăsa garda jos.

*Luna 2+: Suplimentare țintită și evaluare hormonală.*

După ce comportamentul e așezat, putem adăuga suport specific. Magnesiu glicinat (200-300 mg, cu 30-60 minute înainte de culcare) calmează sistemul nervos și susține relaxarea musculară, fără să sedateze. Dacă trezirile de la 4 dimineața persistă, putem explora un adaptogen care modulezează răspunsul la cortizol — dar numai după ce fundația comportamentală e solidă.

Partea care ne-ar schimba cel mai mult stratégia: evaluarea hormonală cu ginecologul. Bufeurile și transpirațiile nocturne sunt semnale că sistemul hormonal e în tranziție profundă, iar intervenția hormonală țintită (dacă e potrivită pentru tine) poate reduce semnificativ trezirile nocturne. Fără acest pas, lucrăm pe fundație, dar ignorăm unul dintre motoarele principale ale problemei.

**Versiunea sinceră**

Nu va fi ușor și nu se va întâmpla într-o săptămână. Schimbarea trezirii stabile în weekend va fi, probabil, cel mai greu lucru — după o săptămână de lucru epuizant, corpul tău va cere să dormi până la 10, iar tu va trebui să te trezești la 7:30. În primele 10-14 zile s-ar putea să te simți și mai obosită, pentru că corpul se re-calibrează. Nu e un semn că nu funcționează — e un semn că sistemul se reorganizează.

Renunțarea la vinul de seară poate părea ca și cum îți iei singurul moment de respiro. Dar ceea ce descoperi de obicei după 2-3 săptămâni fără alcool seara e că somnul devine propriul tău moment de recuperare — și e un respiro incomparabil mai profund.

Schimbările ar trebui să devină vizibile în 3-4 săptămâni: adormire mai rapidă, treziri mai puțin violente, dimineți în care inima nu mai bate ca și cum ai fi alergat. Dacă după 6-8 săptămâni de schimbări consistente trezirea de la 4 dimineața cu inimă accelerată persistă, acela e momentul să facem evaluarea cardiovasculară și metabolică pe care o merită simptomul — nu ca semn de alarmă, ci ca pe un pas necesar pentru a înțelege dacă există o componentă metabolică (cum ar fi o scădere a glicemiei în timpul nopții care declanșează adrenalina) care contribuie la trezire.

Revenim în 4 săptămâni să vedem ce s-a schimbat și ce mai are nevoie de ajustare.


---

## Anexă A — checklist intern (digest trimis modelului de evaluare)

```
Profil: sex=female, vârstă=48.
Problema principală: Insomnie mixtă: dificultate de adormire și trezire precoce cu ruminare mentală

Domenii investigate:
- Ritm circadian & cronotip [complete]: Program diferit weekend vs lucru: se culcă mai târziu în weekend, se trezește până la 10, ceea ce creează un jet lag social semnificativ.
- Expunere la lumină [partial]: Nu a menționat expunerea la lumină naturală dimineața sau întunericul din dormitor.
- Igienă de somn & comportamente de seară [complete]: Stă pe telefon în pat până târziu, nu menționează relaxare seara, somnul de weekend prelungit. Igiena de somn deficitară.
- Cofeină, alcool, nicotină, canabis [complete]: 3-4 cafele pe zi, ultima la 17-18; seara bea 1-2 pahare de vin, care fragmentează somnul în a doua jumătate a nopții.
- Alimentație seara [partial]: Nu a menționat ce mănâncă seara sau dacă consumă lichide multe înainte de culcare.
- Medicamente & istoric de tratament [partial]: Nu a menționat medicații sau suplimente actuale. Nu a discutat cu medicul ginecolog despre simptomele menopauzei.
- Mediul fizic de somn [partial]: Nu a descris mediul fizic al dormitorului (întuneric, zgomot, temperatură).
- Partener, copii, animale [partial]: Are doi adolescenți, dar nu a menționat dacă aceștia sau partenerul îi perturbă somnul.
- Câmpuri electromagnetice & poluanți [pending]: (neatins)
- Respirație în somn / apnee [complete]: Nu sforăie, conform propriei declarații.
- Neurologic-motor [complete]: Nu are picioare neliniștite sau zvâcniri.
- Durere & musculo-scheletal [pending]: (neatins)
- Digestiv & axa intestin-creier [pending]: (neatins)
- Urinar / nocturie [pending]: (neatins)
- Cardiovascular & circulator [partial]: Inima bate tare când se trezește la 4 AM – posibil legat de bufeuri și cortizol, nu neapărat de o problemă cardiacă.
- Hormonal feminin [complete]: 48 de ani, ciclu neregulat de un an, bufeuri și transpirații nocturne care trezesc, inimă accelerată la trezirea de la 4 AM. Tablou tipic perimenopauză.
- Endocrin general [pending]: (neatins)
- Metabolic — glicemie [pending]: (neatins)
- Deficiențe nutriționale [pending]: (neatins)
- Inflamație, imunitate, alergii, histamină [pending]: (neatins)
- Hiperactivare neurovegetativă [complete]: Ziua epuizată, în pat alertă, cu gânduri care aleargă, senzație de priză la culcare. Trecerea de la epuizare la hiperactivare neurovegetativă.
- Cognitiv-emoțional [complete]: Gânduri despre sarcinile de a doua zi care nu se opresc seara, mintea alertă la trezirea de la 4 AM, dificultate de a închide ziua.
- Psihiatric [partial]: Stres 8/10, dar nu a menționat depresie sau anxietate clinică.
- Stres & context de viață [complete]: Stres 8 din 10, job de manager cu doi adolescenți, stresor cronic de cel puțin jumătate de an (de când a început insomnia).
- Siguranță & mediu psihologic [pending]: (neatins)
- Insomnie condiționată / învățată [partial]: Nu a menționat dacă doarme mai bine în altă parte sau dacă patul e asociat cu alertă.

Semnale de alarmă observate: Trezire nocturnă cu inima accelerată (necesită evaluare cardiovasculară și metabolică); Trezire 4 AM cu inimă accelerată + transpirații nocturne — context perimenopauză cu posibilă hiperactivare HPA; semn de remarcat
```

## Anexă B — progresul extracției pe ture

**Tura 1** · profil: sex=?, vârstă=? · acoperire 0/25 · updates: V:partial, U:partial, Z:partial · → domeniul A

**Tura 2** · profil: sex=female, vârstă=48 · acoperire 0/26 · updates: V:partial, X:partial, H:partial · → domeniul A

**Tura 3** · profil: sex=female, vârstă=48 · acoperire 1/26 · updates: A:partial, D:complete, C:partial, U:partial, V:partial · → domeniul A

**Tura 4** · profil: sex=female, vârstă=48 · acoperire 5/26 · updates: D:complete, C:complete, A:partial, P:complete, O:partial, U:complete, X:partial · ⚑ Trezire nocturnă cu inima accelerată (necesită evaluare cardiovasculară și metabolică) · → domeniul B

**Tura 5** · profil: sex=female, vârstă=48 · acoperire 9/26 · updates: A:complete, B:partial, C:complete, D:complete, E:partial, F:partial, G:partial, H:partial, J:complete, K:complete, O:partial, P:complete, U:complete, V:complete, W:partial, X:complete, Z:partial · → domeniul B

**Tura 6** · profil: sex=female, vârstă=48 · acoperire 9/26 · updates: A:complete, C:complete, D:complete, P:complete, U:complete, V:complete, X:complete · ⚑ Trezire 4 AM cu inimă accelerată + transpirații nocturne — context perimenopauză cu posibilă hiperactivare HPA; semn de remarcat · → HANDOFF

## Anexă C — cost detaliat

| model | apeluri | tokens in | tokens out | cost |
|---|---|---|---|---|
| `deepseek-v4-flash` | 11 | 35457 | 3615 | $0.00640 |
| `glm-5p2` | 1 | 2996 | 2543 | $0.01594 |
| **TOTAL** | | | | **$0.02234** |
