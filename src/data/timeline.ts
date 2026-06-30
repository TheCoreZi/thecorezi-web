export type TimelineEra =
	| 'central-war'
	| 'first-intercontinental'
	| 'future'
	| 'neo-zenebas'
	| 'prehistory'
	| 'rebirth-century'
	| 'second-intercontinental'
	| 'tribal-wars'
	| 'western-continent';

export interface TimelineEvent {
	date: string;
	description: string;
	era: TimelineEra;
	newZoids?: string[];
	title: string;
}

export interface TimelineEraGroup {
	color: string;
	era: TimelineEra;
	events: TimelineEvent[];
	label: string;
	yearRange: string;
}

export interface TimelineSource {
	code: string;
	description: string;
}

const events: TimelineEvent[] = [
	// === Prehistoria ===
	{
		date: 'Hace 12,000 millones de años',
		description: 'Ocurre el Big Bang (hace 13.8 mil millones de años).',
		era: 'prehistory',
		title: 'El Big Bang',
	},
	{
		date: 'Hace 5,000 millones de años',
		description: 'Se forma el sistema solar Zoid Zone, incluyendo el Planeta Zi.',
		era: 'prehistory',
		title: 'Formación del Planeta Zi',
	},
	{
		date: 'Hace 4,800 millones de años',
		description: 'El pequeño pero pesado Planeta Mi colisiona con el Planeta Zi, lanzando un cuarto de su corteza al espacio y formando las tres lunas de Zi. Aparecen organismos termofílicos simples.',
		era: 'prehistory',
		title: 'Colisión con el Planeta Mi',
	},
	{
		date: 'Hace 3,000 millones de años',
		description: 'Aparecen las primeras "Formas de Vida Metálicas Primigenias", criaturas similares a animales terrestres pero con altas cantidades de metales pesados, capaces de soportar calor y presión extremos. Aún no son Zoids.',
		era: 'prehistory',
		newZoids: ['Formas de vida metálicas'],
		title: 'Primeras Formas de Vida Metálicas',
	},
	{
		date: 'Hace 200 millones de años',
		description: 'Evolucionan los "Organismos de Exoesqueleto Metálico", criaturas con sus órganos vitales condensados en un Zoid Core y un caparazón metálico como cuerpo.',
		era: 'prehistory',
		newZoids: ['Zoids salvajes'],
		title: 'Evolución de los Primeros Zoids',
	},
	{
		date: 'Hace 50 millones de años',
		description: 'Debido a cambios en el ritmo de fusión de su sol, Zi entra repentinamente en una larga era de hielo, enviando a la extinción a la mayoría de los Zoids tipo dinosaurio.',
		era: 'prehistory',
		title: 'Era de Hielo en Zi',
	},
	{
		date: 'Hace 30 millones de años',
		description: 'Los nichos ecológicos dejados por los Zoids tipo dinosaurio son ocupados por nuevos Zoids tipo mamífero.',
		era: 'prehistory',
		title: 'Surgimiento de Zoids Mamíferos',
	},
	{
		date: 'Hace 700,000 años',
		description: 'Ocho planetesimales caen sobre Zi, trayendo grandes cantidades de agua y produciendo la geografía y atmósfera actuales del planeta.',
		era: 'prehistory',
		title: 'Impacto de Planetesimales',
	},
	{
		date: 'Hace 100,000 años',
		description: 'Los Zoidianos humanoides evolucionan como un tipo de "Organismo de Membrana Mucosa Metálica", un grupo distinto de los Zoids que también incluye a las plantas de Zi.',
		era: 'prehistory',
		title: 'Evolución de los Zoidianos',
	},

	// === Guerras Tribales ===
	{
		date: 'Hace 10,000 años ~ ZAC 1600',
		description: 'Los Zoidianos en el Continente Central viven en más de 50 tribus pequeñas, en constante peligro por volcanes y terremotos, por lo que poca historia sobrevive.',
		era: 'tribal-wars',
		newZoids: ['Zoids domesticados'],
		title: 'Inicio de la Era Tribal',
	},
	{
		date: '~ZAC 1600',
		description: 'Los incidentes sísmicos importantes se calman, permitiendo a las tribus expandirse y que la historia sea registrada de forma segura.',
		era: 'tribal-wars',
		title: 'Fin de la Actividad Sísmica',
	},
	{
		date: 'ZAC 1693',
		description: 'El geólogo Babahot descubre una placa de hierro grabada en ruinas antiguas, probando que la escritura y los Zoids domesticados se usaban en tiempos prehistóricos. Se define "ZAC 1" como el año en que la placa fue creada.',
		era: 'tribal-wars',
		title: 'Descubrimiento de la Placa de Babahot',
	},
	{
		date: '~ZAC 1700',
		description: 'Todos los eventos sísmicos cesan y las tribus se mueven a nuevas áreas, buscando más recursos y combinándose gradualmente en dominios más grandes.',
		era: 'tribal-wars',
		title: 'Expansión de las Tribus',
	},
	{
		date: '~ZAC 1850',
		description: 'Con más recursos y capacidad de cooperación, las tribus y dominios siguen creciendo y combinándose, pero los conflictos se vuelven más frecuentes.',
		era: 'tribal-wars',
		title: 'Inicio de los Conflictos',
	},
	{
		date: 'ZAC 1890',
		description: 'Se producen los primeros "meca organismos" o "Zoids artificiales" (el core de un Zoid salvaje colocado en un cuerpo artificial). La tecnología aún es de nivel medieval.',
		era: 'tribal-wars',
		newZoids: ['Zoids artificiales'],
		title: 'Primeros Zoids Artificiales',
	},
	{
		date: 'ZAC 1920',
		description: 'Los ~30 dominios se combinan en dos grandes alianzas, lideradas por Helic Muroa (de la Tribu del Viento) y Guylos (de la Tribu de las Profundidades de la Tierra). Un intento de invasión por Guylos lleva a una guerra total.',
		era: 'tribal-wars',
		title: 'Guerras Tribales',
	},
	{
		date: 'ZAC 1955',
		description: 'Entristecido por la larga guerra, Helic viaja en secreto al Continente Oscuro en busca de "ayuda" y envía al Ejército Oscuro a atacar el Continente Central para que las dos alianzas se unan contra ellos.',
		era: 'tribal-wars',
		title: 'Helic y el Ejército Oscuro',
	},
	{
		date: 'ZAC 1956-1957',
		description: 'El Ejército Oscuro (del helado Continente Oscuro) es rechazado por las fuerzas de los ejércitos combinadas y gracias al calor repentino del verano.',
		era: 'tribal-wars',
		title: 'Derrota del Ejército Oscuro',
	},
	{
		date: 'ZAC 1957',
		description: 'Guylos y Helic trabajan juntos para formar una sola nación Helic es elegido como rey ys e crea la República de Helic,. Helic se casa con una mujer de la Tribu del Viento, quien da a luz a Helic Muroa II. La unificación del continente lleva a una revolución industrial.',
		era: 'tribal-wars',
		title: 'Fundación de la República de Helic',
	},
	{
		date: 'ZAC 1959',
		description: 'Zenebas Muroa nace de la segunda esposa del Rey Helic (la hermana menor de Guylos).',
		era: 'tribal-wars',
		title: 'Nacimiento de Zenebas Muroa',
	},
	{
		date: 'ZAC 1960',
		description: 'Se descubren colonias subterráneas de Zoids salvajes tipo dinosaurio.',
		era: 'tribal-wars',
		title: 'Descubrimiento de Zoids Tipo Dinosaurio',
	},
	{
		date: 'ZAC 1975',
		description: 'El Rey Helic muere a los 78 años, dejando una carta a sus dos hijos (ahora Presidente y Comandante Supremo del Ejército) explicando sus acciones en la vieja guerra y pidiéndoles trabajar juntos.',
		era: 'tribal-wars',
		title: 'Muerte del Rey Helic',
	},
	{
		date: 'ZAC 1978',
		description: 'Frustrado por el pacifismo del Presidente Helic II, Zenebas se rebela, abandona la República y funda el Imperio de Zenebas en el oeste del continente Central.',
		era: 'tribal-wars',
		title: 'Fundación del Imperio Zenebas',
	},
	{
		date: 'ZAC 1980',
		description: 'Los dos países chocan en la Batalla del Río Rojo. Tras cuatro meses de batalla, las tropas del Imperio son repelidas con ayuda de Alpha y la guardia costera de la República, pero esta sufre grandes pérdidas.',
		era: 'tribal-wars',
		title: 'Batalla del Río Rojo',
	},
	{
		date: 'ZAC 2018',
		description: 'Al enterarse de que el Imperio planea una invasión, la República lanza un ataque preventivo y comienza la Batalla del Desierto.',
		era: 'tribal-wars',
		title: 'Batalla del Desierto',
	},
	{
		date: 'ZAC 2029',
		description: 'Una rebelión estalla a bordo del Globally III, una nave espacial terricola, que aterriza de emergencia en la Cordillera Grandvalos, interrumpiendo la larga batalla. La República captura a los supervivientes mientras el Imperio encuentra a los rebeldes que huyeron. Ambos bandos comienzan a modernizar su tecnología bajo la guía de los terricolas.',
		era: 'tribal-wars',
		title: 'Llegada de los Terricolas',
	},

	// === Guerra del Continente Central ===
	{
		date: 'ZAC 2030',
		description: 'Mientras Zenebas es distraído por inteligencia falsa, el ejército de la República, liderado por el Gojulas mejorado, avanza hasta la capital del Imperio (un castillo en la montaña). Sin embargo, las fuerzas Imperiales regresan justo a tiempo para salvar la capital. El Imperio crea varios modelos custom de Redhorn para ganar tiempo mientras desarrolla un Zoid más poderoso.',
		era: 'central-war',
		newZoids: ['Zoid Gojulas', 'Redhorn'],
		title: 'Gojulas vs Redhorn',
	},
	{
		date: 'ZAC 2031',
		description: 'Ambos bandos modernizan sus Zoids más pequeños y lanzan varios modelos nuevos. Una flota de Furolesios y Barigators es atacada por Sinkers en el Océano Florecio, abriendo las puertas a batallas marítimas y aéreas.',
		era: 'central-war',
		newZoids: ['Sinker', 'Barigator', 'Salamander'],
		title: 'Apertura del Frente Naval y Aéreo',
	},
	{
		date: 'Octubre ZAC 2032',
		description: 'Una gran fuerza de invasión Imperial es emboscada en el Bosque de Ardannes, comenzando la primera gran batalla con Zoids modernizados. La eventual llegada de una fuerza de Gojulas lleva a la victoria de la República.',
		era: 'central-war',
		title: 'Batalla de Ardannes',
	},
	{
		date: 'ZAC 2032',
		description: 'Decepcionados porque el Emperador Zenebas descuida a sus ciudadanos, algunos de sus soldados se rebelan y toman el control de su residencia. Zenebas ordena a su superior, Gambino, que "se encargue de ellos", pero Gambino les muestra una ruta de escape y se suicida después.',
		era: 'central-war',
		title: 'Golpe de Estado en el Imperio',
	},
	{
		date: 'ZAC 2032',
		description: 'El Imperio completa el Iron Kong y envía 150 unidades a invadir territorio de la República. La República reúne sus 200 Gojulas funcionales y los repele, pero sufre grandes pérdidas.',
		era: 'central-war',
		newZoids: ['Ironkong'],
		title: 'Despliegue del Ironkong',
	},
	{
		date: 'ZAC 2033',
		description: 'Zenebas comienza a construir un ejército masivo de Redhorns. Helic declara leyes de emergencia nacional "X-Day". La República crea prototipos de Gojulas custom, uno de los cuales se convierte en el prototipo del Gojulas Mk-II.',
		era: 'central-war',
		title: 'Escalada Armamentista',
	},
	{
		date: 'ZAC 2034',
		description: 'Impulsados por el Ironkong, ambos bandos desarrollan muchos Zoids nuevos como el Helcat y Snakes, superando rápidamente los modelos enemigos.',
		era: 'central-war',
		newZoids: ['Iguan', 'Hammerrock', 'Gustav'],
		title: 'Carrera de Desarrollo de Zoids',
	},
	{
		date: 'ZAC 2035',
		description: 'La Batalla de Blood Rock comienza en la montaña White Rock. La República recibe noticias de un nuevo Zoid Imperial a gran escala en desarrollo y envía un solo Gojulas a investigar. Este se infiltra en la fábrica Imperial, fotografía el nuevo Zoid y escapa a través del techo para ser recogido por Salamanders de transporte.',
		era: 'central-war',
		title: 'Batalla de Blood Rock',
	},
	{
		date: 'ZAC 2036',
		description: 'El Imperio lanza su nuevo Zoid: el Sabretiger, lo suficientemente rápido para derrotar a los Zoids más grandes de la República. Su única forma de detenerlo es atacar desde el aire.',
		era: 'central-war',
		newZoids: ['Sabretiger'],
		title: 'Despliegue del Sabretiger',
	},
	{
		date: '6/ZAC 2036',
		description: 'La violenta operación "June of Blood" comienza en Blood Rock. El General Mayor Isaac pierde a su hijo Kendall en los combates.',
		era: 'central-war',
		title: 'June of Blood',
	},
	{
		date: '~ZAC 2036 a 2038',
		description: 'Una gran fuerza de Sinkers intenta atacar la capital de la República vía la Bahía Helic, pero es repelida por Alpha y la guardia costera. La República presenta el Salamander durante la Batalla de Blood Rock, causando pánico en el Imperio. Envían 3 prototipos Saicurtis en una misión de prueba para destruir un Salamander, pero los resultados son desconocidos.',
		era: 'central-war',
		newZoids: ['Salamander', 'Saicurtis'],
		title: 'Contraataque Naval',
	},
	{
		date: 'ZAC 2037',
		description: 'Un comando espía Imperial llamado "Echo" captura el prototipo del Ultrasaurus de la República e intenta atacar la capital Helic City, pero el Capitán R.S. Toamath dispara a su cockpit con un Cannontortoise y Echo eyecta. El Imperio crea el Yeti Kong y Space Kong para oponerse al Ultrasaurus, y sus datos de prueba se usan para crear el Ironkong Mk-II. Echo usa una señal SOS falsa para atraer al Ultrasaurus a una emboscada en el lejano norte, pero el Gojulas Mk-II de Toamath derrota por poco a su Ironkong Mk-II, matándolo.',
		era: 'central-war',
		newZoids: ['Ultrasaurus', 'Ironkong Mk-II', 'Gojulas Mk-II'],
		title: 'El Robo del Ultrasaurus',
	},
	{
		date: 'ZAC 2038',
		description: 'El Imperio lanza una invasión a gran escala de la República. El Ultrasaurus usa un ataque especial omnidireccional para escapar. La República lanza una contraofensiva secreta, aterriza en la Bahía Mivalos y bombardea el cuartel general Imperial, ganando la ventaja.',
		era: 'central-war',
		title: 'Gran Invasión Imperial y Contraataque',
	},
	{
		date: '9/ZAC 2038',
		description: 'Ambos países envían sus ejércitos completos a Blood Rock. A pesar del nuevo Ironkong del Imperio, la República los arrincona en 10 días. Derrotados, los restos del Imperio huyen por el océano al Continente Oscuro.',
		era: 'central-war',
		title: 'Batalla Final de Blood Rock',
	},
	{
		date: 'ZAC 2039',
		description: 'La República invade la capital Imperial, derrota al Bronze Kong sin piloto y busca al Emperador. Zenebas se esconde bajo tierra y escapa al Continente Oscuro en un Sinker, con el General Danny Duncan sacrificándose para salvar al Emperador.',
		era: 'central-war',
		newZoids: ['Twinhorn', 'Storch'],
		title: 'Caída de la Capital Imperial',
	},
	{
		date: 'ZAC 2039-2041',
		description: 'El Imperio Zenebas regresa en los desembarcos del Día D, atacando la Bahía Valecia con Whale Kaisers y un nuevo ejército. Las bases de la República caen ante las habilidades de jamming del Dimetrodon. Algunos grupos guerrilleros luchan, incluyendo los Blue Pirates.',
		era: 'central-war',
		newZoids: ['Dimetrodon', 'Wardick', 'Attack Zoids'],
		title: 'El Regreso de Zenebas — Día D',
	},
	{
		date: 'ZAC 2042',
		description: 'El Imperio es detenido por una nueva fuerza de alta velocidad liderada por el Shieldliger. El Imperio busca recapturar el área Uranisk y el enorme Zoid oculto en una base subterránea.',
		era: 'central-war',
		newZoids: ['Shieldliger', 'Command Wolf'],
		title: 'El Shieldliger Detiene al Imperio',
	},
	{
		date: 'ZAC 2043',
		description: 'La República descubre que el Imperio construye un nuevo Zoid aún más grande que el Gojulas. El Coronel Johann Ericsson investiga, pero los imperiales destruyen la instalación, dejando solo huellas enormes.',
		era: 'central-war',
		title: 'Descubrimiento del Proyecto Secreto',
	},
	{
		date: 'ZAC 2044',
		description: 'El Imperio despliega su nuevo Deathsaurer, armado con un Charged Particle Cannon, custodiado por los pequeños pero poderosos Zoids24. Pilotado por Toby Duncan, el Deathsaurer ataca una base llena de Gojulas. El Ultrasaurus del Coronel Ericsson lo enfrenta; Ericsson muere pero sus últimas palabras son de elogio para Danny Duncan.',
		era: 'central-war',
		newZoids: ['Deathsaurer', 'Deathpion', 'Roadskipper'],
		title: 'Aparición del Deathsaurer',
	},
	{
		date: 'otoño ZAC 2044',
		description: 'Incapaz de oponerse al Deathsaurer, la capital Helic City finalmente cae. El pueblo de la República escapa a través de numerosos túneles secretos, pareciendo desaparecer del Continente Central.',
		era: 'central-war',
		newZoids: ['Reddra'],
		title: 'Caída de Helic City',
	},
	{
		date: '12/ZAC 2044',
		description: 'El ejército de la República ataca Cook Base con una batería de cañones disfrazada de iceberg, luego se retira por el océano hacia una región llena de icebergs. La fuerza del Capitán Franz Hartman los persigue y encuentra lo que parece ser el Ultrasaurus personal del Presidente Helic, pero es emboscada y aniquilada por otros Zoids de la República — ambos Ultrasaurus (y sus pilotos) son dobles.',
		era: 'central-war',
		newZoids: ['Brachios'],
		title: 'Ataque a Cook Base y los Dobles de Helic',
	},
	{
		date: '3/ZAC 2045',
		description: 'Mientras el verdadero Presidente Helic dirige su ejército desde una isla en el Océano Florecio, incontables dobles de Helic lideran las fuerzas dispersas de la República en ataques guerrilleros por todo el continente. Algunos generales lanzan una operación para capturar un Deathsaurer sin autorización de Helic, pero fracasa, y Helic prohíbe más intentos no aprobados.',
		era: 'central-war',
		title: 'Guerra de Guerrillas con Dobles de Helic',
	},
	{
		date: '5/ZAC 2045',
		description: 'Mientras Zenebas mueve todos sus Deathsaurers a territorio de la República, Helic reúne sus Ultrasaurus y los convierte en tipos de transporte para tomar el control del Océano Florecio. La República usa Zoids acuáticos no tripulados para atraer a las flotas imperiales y luego las aniquila con Pterases y Ultrasaurus. El Imperio intenta contraatacar con sus nuevos Reddras, pero la flota de la República está más lejos de lo esperado, dejando a los Reddras sin combustible para pelear.',
		era: 'central-war',
		newZoids: ['Reddra'],
		title: 'Batalla Naval del Océano Florecio',
	},
	{
		date: '6/ZAC 2045',
		description: 'Franz entra en la República afirmando ser un prisionero escapado con documentos operacionales del Deathsaurer. Con su ayuda, la República logra capturar un Deathsaurer y lo lleva a la base secreta de Helic en una isla. Pero Franz saca un Roadskipper de un compartimiento en el vientre del Deathsaurer y secuestra al Presidente. Es derrotado por Rosa, una de las guardaespaldas de Helic, quien elige no matarlo. Franz escapa y detona remotamente el Deathsaurer para evitar que caiga en manos de la República.',
		era: 'central-war',
		newZoids: ['Megatopros', 'Battlerover', 'Neptune'],
		title: 'La Trampa de Franz',
	},
	{
		date: '7/ZAC 2045',
		description: 'Mientras la República prepara un desembarco en la Península Germandy, envían un solo Ultrasaurus y algunos Zoids pequeños a la Playa Diepp en la costa opuesta como distracción. Un Deathsaurer cercano muerde el anzuelo, destruyendo la fuerza falsa antes de darse cuenta de su error. Sin embargo, el Ultrasaurus moribundo dispara al ventilador de admisión del Deathsaurer, permitiendo al resto del ejército hundirlo fácilmente. La República asegura la península, permitiendo a sus fuerzas dispersas reagruparse por mar.',
		era: 'central-war',
		title: 'Desembarco en la Península Germandy',
	},
	{
		date: 'ZAC 2043-2045',
		description: 'El Deathsaurer no puede entrar en la escarpada Cordillera Central, así que envían Reddras y Deathpions en su lugar. Descubren que la República ha desarrollado su propia fuerza de Zoids24 en una base secreta en las montañas, y estalla una guerra de guerrillas.',
		era: 'central-war',
		newZoids: ['Megatopros', 'Battlerover', 'Neptune'],
		title: 'Guerra de Guerrillas en la Cordillera Central',
	},
	{
		date: '8/ZAC 2045',
		description: 'Un piloto herido de Command Wolf descubre una aldea formada enteramente por huérfanos de guerra, quienes ahuyentan a la fuerza Imperial persecutora usando varios esquemas, como secuestrar un Twinhorn y provocar un derrumbe de rocas.',
		era: 'central-war',
		title: 'La Aldea de los Huérfanos de Guerra',
	},
	{
		date: '9/ZAC 2045',
		description: 'El ejército de la República gana el control del Camino de la Montaña Sur que conecta Illusion City y el Puerto Etsumi.',
		era: 'central-war',
		title: 'Control del Camino Sur',
	},
	{
		date: '10/ZAC 2045',
		description: 'La República corta la Autopista Central a través de las montañas.',
		era: 'central-war',
		title: 'Corte de la Autopista Central',
	},
	{
		date: '3/ZAC 2046',
		description: 'La República sitia la base más grande del Imperio en las montañas, buscando cortar las rutas de suministro del norte. Mientras el duro invierno obstaculiza a las fuerzas de apoyo Imperiales, la República transporta 5 Ultrasaurus desmontados por la secreta Ruta Helic, los reconstruye cerca y los usa para asaltar la base.',
		era: 'central-war',
		title: 'Sitio de la Base Imperial en las Montañas',
	},
	{
		date: 'ZAC 2046',
		description: 'El Green Horn del Imperio, un Redhorn custom con un Escudo Anti-Partículas Cargadas, es capturado por espías de la República. Su tecnología de escudo será usada más tarde por el Madthunder.',
		era: 'central-war',
		title: 'Captura del Green Horn',
	},
	{
		date: '8/ZAC 2046',
		description: 'Habiendo capturado la mayor parte de la Cordillera Central, la República comienza a recuperar las llanuras orientales. La fuerza en el Río Rojo avanza demasiado en territorio enemigo y queda rodeada, así que el Presidente Helic lleva su Centaur personal a rescatarlos. Mientras tanto, el cuartel general de la República es destruido por el Deathdog de Franz, que luego ataca al Centaur. Quedándose sin energía, Rosa (la copiloto) eyecta a Helic a la fuerza, luego deja que el Deathdog muerda el cuello del Centaur antes de elevarse por los aires. Deja caer ambos Zoids desde 100 metros, destruyéndolos, aunque ambos pilotos sobreviven milagrosamente.',
		era: 'central-war',
		title: 'El Sacrificio de Rosa',
	},
	{
		date: '10-11/ZAC 2046',
		description: 'Con las líneas de suministro del Imperio ahora limitadas al extremo norte de la Cordillera Central, la República continúa su contraataque a gran escala, organizando una fuerza de asalto de Dibisons.',
		era: 'central-war',
		newZoids: ['Dibison'],
		title: 'Contraataque con los Dibisons',
	},
	{
		date: '12/ZAC 2046',
		description: 'El Presidente Helic II propone matrimonio a la herida Rosa en un hospital de campaña.',
		era: 'central-war',
		title: 'Helic Propone Matrimonio a Rosa',
	},
	{
		date: '4/ZAC 2047',
		description: 'Mientras el Dibison custom "Big Bad John" causa caos en la capital de la República, una fuerza de Megatopros sigue los canales de agua subterráneos hasta la prisión y libera al capturado Profesor Chester. El Arosaurer de alta velocidad que lo transporta es atrapado por un Deathsaurer, pero su cabeza se separa y vuela lejos.',
		era: 'central-war',
		newZoids: ['Arosaurer'],
		title: 'Rescate del Profesor Chester',
	},
	{
		date: '6/ZAC 2047',
		description: 'Preparándose para retomar su capital, la República intenta cortar las últimas líneas de suministro del Imperio, pero la fuerza de ataque es derrotada por el nuevo Greatsabre.',
		era: 'central-war',
		newZoids: ['Greatsabre'],
		title: 'Aparición del Greatsabre',
	},
	{
		date: '7-12/ZAC 2047',
		description: 'Los excéntricos soldados republicanos Lewis y Martin lanzan la "Operación Estufa y Golondrina", montando enormes cantidades de instalaciones militares falsas en una isla para desperdiciar los recursos del Imperio y desviar su atención de donde realmente se lleva a cabo el desarrollo de Zoids — dentro de un Salamander custom que pasa la mayor parte del tiempo en el aire.',
		era: 'central-war',
		title: 'Operación Estufa y Golondrina',
	},
	{
		date: '11/ZAC 2047',
		description: 'El hijo del Presidente Helic II y Rosa Lauri nace. El Emperador Zenebas le envía un brazalete familiar como regalo de felicitación.',
		era: 'central-war',
		title: 'Nacimiento del Heredero de Helic',
	},
	{
		date: '1/ZAC 2048',
		description: 'Buscando al Profesor Chester, el Imperio envía al Deathbird a bombardear una instalación de la República. Derriba a la fuerza de Puterasu que contraataca y regresa a su base, sin darse cuenta de que ha sido seguido por el Zoid sigiloso Suterasu. La República envía una fuerza de emboscada pero son ellos los emboscados por el Death Shadow, que los caza a todos.',
		era: 'central-war',
		title: 'El Deathbird y el Death Shadow',
	},
	{
		date: '8/ZAC 2048',
		description: 'El Imperio aumenta su eficiencia de producción y construye un enorme ejército, planeando usar un ataque de pinza para atrapar a la República en las montañas y aniquilarla. La República resiste un tiempo con ayuda de un Ultrasaurus, pero el nuevo Gorem del Mayor Hobart recoge un cañón caído y dispara a las torretas del Ultra, luego trepa dentro y coloca una bomba.',
		era: 'central-war',
		newZoids: ['Gorem'],
		title: 'La Pinza Imperial y el Gorem',
	},
	{
		date: 'ZAC 2048',
		description: 'Frustrado por la constante resistencia y guerra de guerrillas de la República, Zenebas envía la "fuerza más poderosa" del Imperio, compuesta por modelos Mk-II. En respuesta, la República crea su propia Fuerza Mk-II.',
		era: 'central-war',
		newZoids: ['Greatsabre', 'Shieldliger Mk-II'],
		title: 'La Fuerza Mk-II',
	},
	{
		date: '9/ZAC 2048',
		description: 'El Imperio detecta otra instalación de la República y envía al Deathbird a bombardearla, pero despacha un Gorem para infiltrarla y capturar al Profesor Chester primero. El Gorem descubre que la base es otra falsa y los "nuevos Zoids" son solo carcasas colocadas sobre restos de Gojulas. Intenta cancelar el bombardeo, pero sus aliados tienen órdenes de ignorar todos los mensajes por si son transmisiones falsas. Mientras tanto, cerca de Arthur City, el Profesor Chester finalmente ha completado su nuevo Zoid...',
		era: 'central-war',
		title: 'La Base Señuelo',
	},
	{
		date: '10/ZAC 2048',
		description: 'La República envía toda su fuerza aérea a la Cordillera Central para apoyar a sus tropas en dificultades, y lanza el Madthunder hacia su capital mientras las tropas del Imperio están enfocadas en las montañas. En el camino hay una base Imperial custodiada por un Ironkong en la cima de una torre alta, así que el Madthunder usa sus Magnezers para derribar la torre.',
		era: 'central-war',
		newZoids: ['Madthunder'],
		title: 'Despliegue del Madthunder',
	},
	{
		date: 'ZAC 2048',
		description: 'La República finalmente presenta el Madthunder, equipado con un escudo capaz de resistir el Charged Particle Cannon del Deathsaurer. Los dos gigantes chocan en la Llanura Oberia, con el Madthunder ganando.',
		era: 'central-war',
		title: 'Madthunder vs Deathsaurer en Oberia',
	},
	{
		date: '12/ZAC 2048',
		description: 'El Mayor Michael Hobart espera al Madthunder con su último Deathsaurer custom, el Death Fighter. El Madthunder lo derrota fácilmente y Michael es capturado. Conoce al enfermo Profesor Chester, quien le pide completar el trabajo en un set de extremidades protésicas (originalmente diseñadas por el padre de Michael). La República recaptura su capital y luego lanza las prótesis avanzadas desde el aire a pueblos llenos de soldados Zenebas heridos.',
		era: 'central-war',
		newZoids: ['Lidier'],
		title: 'Derrota del Death Fighter',
	},
	{
		date: 'ZAC 2049',
		description: 'Usando la poderosa división Madthunder y el nuevo Raynos, la República logra retomar su capital.',
		era: 'central-war',
		newZoids: ['Raynos'],
		title: 'La República Retoma su Capital',
	},
	{
		date: 'ZAC 2050',
		description: 'Con el Imperio en retirada, la República reconquista todo su antiguo territorio antes de invadir profundamente en territorio Imperial.',
		era: 'central-war',
		title: 'La República Recupera su Territorio',
	},
	{
		date: '8/1/ZAC 2051',
		description: 'Apenas termina el cese al fuego de Año Nuevo, los Madthunders que rodean la capital Imperial rompen las murallas y capturan la ciudad. Las fuerzas imperiales supervivientes se reúnen en la Bahía Valecia.',
		era: 'central-war',
		title: 'Caída de la Capital del Imperio Zenebas',
	},

	// === Primera Guerra Intercontinental ===
	{
		date: '3/ZAC 2051',
		description: 'Arrinconado pero sin rendirse, Zenebas envía un mensajero al Continente Oscuro. El Ejército Oscuro llega con Zoids increíblemente poderosos como el Deadborder. Luego se vuelven contra Zenebas, capturando a su hija Elena y absorbiendo las fuerzas Zenebas en su propio ejército.',
		era: 'first-intercontinental',
		newZoids: ['Deadborder', 'Heldigunner'],
		title: 'Intervención del Ejército Oscuro',
	},
	{
		date: '10/ZAC 2051',
		description: 'Entre los objetos recuperados del Whale Kaiser derrotado hay un documento codificado con el "código HZ", que Helic y Zenebas inventaron de niños. Es una carta de Zenebas advirtiendo que el Ejército Oscuro desarrolla un "arma definitiva".',
		era: 'first-intercontinental',
		newZoids: ['Dark Horn'],
		title: 'La Carta de Zenebas',
	},
	{
		date: 'ZAC 2052-2053',
		description: 'Cosas terribles suceden al medio ambiente del Continente Central. El científico Shuu descubre que están vinculadas al Ejército Oscuro y lidera una expedición al Continente Oscuro. La República desarrolla el Gunbluster y logra establecer una cabecera de playa.',
		era: 'first-intercontinental',
		newZoids: ['Cannonfort', 'Gunbluster', 'Houndsoldier', 'Zeekdober'],
		title: 'Invasión al Continente Oscuro',
	},
	{
		date: 'ZAC 2053-2054',
		description: 'El Ejército Oscuro libera su trampa: el Gil Vader, un Zoid súper poderoso que derrota fácilmente incluso a los Madthunders. Cruza el océano y bombardea Helic City, matando a 80,000 personas. El Capitán Graham muere intentando detenerlo.',
		era: 'first-intercontinental',
		newZoids: ['Gul Tiger', 'Salamander F2', 'Gil Vader'],
		title: 'El Terror del Gil Vader',
	},
	{
		date: 'ZAC 2054',
		description: 'Los 35 Madthunders restantes en el Continente Central son convertidos para batalla naval para rescatar a las fuerzas en el Continente Oscuro, pero son emboscados y aniquilados por Gil Vaders. Helic descubre que Zenebas sigue vivo pero prisionero. Krüger pilota el prototipo Orudios para derrotar a un Gil Vader, y Helic envía una transmisión falsa diciendo que 500 Orudios han sido desplegados.',
		era: 'first-intercontinental',
		newZoids: ['Orudios'],
		title: 'El Orudios y el Engaño de Helic',
	},
	{
		date: 'ZAC 2056',
		description: 'La República invade el Continente Oscuro una vez más, avanzando hacia la capital Darkness. Usando toda su tecnología, crean el King Gojulas, un Zoid ultra poderoso. Pero antes de que pueda enfrentar al Descat, una de las lunas de Zi es impactada por el cometa Thorne, causando la Gran Catástrofe: el Continente Central se divide en 3, parte del Continente Oscuro se hunde y tormentas magnéticas inmovilizan a todos los Zoids de combate.',
		era: 'first-intercontinental',
		newZoids: ['King Gojulas', 'Descat', 'Gungyalado'],
		title: 'La Gran Catástrofe',
	},

	// === Rebirth Century ===
	{
		date: 'ZAC 2057',
		description: 'Ambos países comienzan a reconstruirse, pero en secreto trabajan en Zoids que puedan funcionar entre las tormentas magnéticas. Durante el funeral de Zenebas, quien murió durante la Gran Catástrofe, el científico Kenneth Oldvine solicita desenterrar los restos del King Gojulas para aprovechar su supertecnología de gravedad.',
		era: 'rebirth-century',
		title: 'Reconstrucción Post-Catástrofe',
	},
	{
		date: 'ZAC 2057-2058',
		description: 'Helic y Elena viajan al neutral Continente Occidental para una negociación de paz, pero son emboscados por el ejército del Imperio y el nuevo Valga de Ramberg, que usa tecnología de gravedad del King Gojulas.',
		era: 'rebirth-century',
		newZoids: ['Dos Godos', 'Valga'],
		title: 'Emboscada en el Continente Occidental',
	},
	{
		date: 'ZAC 2058-2059',
		description: 'Helic lanza la Operación Mano de Hierro para borrar la supertecnología de gravedad. La República invade la Isla Levante del Imperio pero descubre que toda la isla es una trampa. La misión fracasa. El nuevo Tiga Godos se desarrolla para combatir los Valga.',
		era: 'rebirth-century',
		newZoids: ['Crimson Horn', 'Tiga Godos'],
		title: 'Operación Mano de Hierro',
	},
	{
		date: 'ZAC 2059',
		description: 'La República envía King Ligers en misiones de espionaje al Continente Oscuro aprovechando el hielo extenso, pero el Imperio usa Gul Tiger GCs — los primeros Zoids de combate aéreo desde la Gran Catástrofe — para destruirlos.',
		era: 'rebirth-century',
		newZoids: ['Gul Tiger GC'],
		title: 'Espionaje y Contraataque Aéreo',
	},
	{
		date: 'ZAC 2089',
		description: 'Aún recuperándose de la Gran Catástrofe, ambas naciones organizan equipos para rastrear y recapturar Zoids callejeros escapados como forma económica de reconstruir sus ejércitos. El equipo EXTY 138 de la República captura un Iron Kong callejero en el Continente Occidental.',
		era: 'rebirth-century',
		title: 'Cacería de Zoids Callejeros',
	},
	{
		date: '10/ZAC 2098',
		description: 'Un año después de la muerte del Emperador Guylos, su único pariente sobreviviente, Rudolph Zeppelin de 10 años, es coronado Emperador. Gunther Prozen, miembro de una familia de alto rango Guylos, se convierte en Regente.',
		era: 'rebirth-century',
		title: 'Coronación de Rudolph Zeppelin',
	},

	// === Guerra del Continente Occidental ===
	{
		date: '6/ZAC 2099',
		description: 'Prozen declara la guerra a la República Helic. Como Triangle Daras se ha vuelto intransitable desde la Gran Catástrofe, el Imperio envía 90 divisiones al Continente Occidental de Europa, tomando el 30% del norte en dos semanas.',
		era: 'western-continent',
		title: 'Inicio de la Guerra del Continente Occidental',
	},
	{
		date: 'ZAC 2099',
		description: 'Ambos ejércitos luchan por la posición estratégica del Monte Olympus. La República descubre que el Imperio intenta resucitar al extinto Death Saurer usando tecnología antigua de las ruinas. El Death Saurer a medio construir enloquece y ataca todo con su Charged Particle Cannon, pero L.G. Halford logra arrancar su Zoid Core.',
		era: 'western-continent',
		title: 'Batalla del Monte Olympus',
	},
	{
		date: '1/ZAC 2100',
		description: 'El Imperio descubre que el Organoid System (basado en tecnología antigua del Monte Olympus) puede aumentar significativamente la fuerza, velocidad y curación de los Zoids, a costa de hacerlos más difíciles de controlar.',
		era: 'western-continent',
		newZoids: ['Geno Saurer'],
		title: 'Descubrimiento del Organoid System',
	},
	{
		date: '3/ZAC 2100',
		description: 'Ambos bandos envían sus últimos Zoids al sur para capturar más ruinas y tecnología antigua. A pesar de los esfuerzos de Arthur Borgmann, el Geno Saurer de Ritz Runstedt logra recuperar un Zoid Core antiguo de las Ruinas Garil.',
		era: 'western-continent',
		newZoids: ['Rev Rapter', 'Blade Liger', 'Storm Sworder', 'Gun Sniper'],
		title: 'Batalla por las Ruinas Garil',
	},
	{
		date: 'ZAC 2100',
		description: 'La República gana el control del cielo con los Storm Sworders. Bombardea persistentemente las líneas de suministro imperiales. En respuesta desesperada, envían su fuerza de defensa más fuerte, dejando el Continente Central desguarnecido.',
		era: 'western-continent',
		title: 'Dominio Aéreo de la República',
	},
	{
		date: '7/ZAC 2100',
		description: 'El Imperio lanza un ataque masivo de pinza contra Rob Base. Las tropas acuáticas son derrotadas por el nuevo Hammer Head, mientras las terrestres son rechazadas con ayuda de mercenarios como Irvine. Cinco días después, el Death Stinger (crecido del core antiguo de Garil) recibe daño, enloquece y aniquila a ambos bandos antes de retirarse bajo tierra.',
		era: 'western-continent',
		newZoids: ['Hammer Head', 'Geno Breaker', 'Lightning Saix', 'Death Stinger'],
		title: 'Batalla de Rob Base y el Death Stinger',
	},
	{
		date: '10/ZAC 2100',
		description: 'La batalla entre rivales Ritz Runstedt y Arthur Borgmann los lleva a ruinas antiguas donde descubren que el Death Stinger se ha estado clonando. Trabajan juntos para matarlo, con Arthur sacrificándose para salvar a Ritz. La República avanza hasta Nixie Base, donde Wolff Muroa roba el prototipo Berserk Führer, pero Ray Gregg roba el otro prototipo liger.',
		era: 'western-continent',
		newZoids: ['Elephander'],
		title: 'Clones del Death Stinger y el Berserk Führer',
	},
	{
		date: '1/ZAC 2101',
		description: 'El Presidente Camford ofrece una tregua que Prozen rechaza. La República remodela el Ultra Saurus mientras el Imperio envía Whale Kings llenos de Zabats no tripulados para bombardearlo.',
		era: 'western-continent',
		newZoids: ['Spinosapper', 'Zabat'],
		title: 'La Tregua Rechazada',
	},
	{
		date: '3/ZAC 2101',
		description: 'Prozen envía Wardicks y 10 Death Stinger KFDs controlables gracias al Interface. Sin embargo, son aniquilados por la nueva Ray Force y sus Liger Zeroes equipados con CAS.',
		era: 'western-continent',
		newZoids: ['Liger Zero'],
		title: 'La Ray Force y el Liger Zero',
	},

	// === Segunda Guerra Intercontinental ===
	{
		date: '6/ZAC 2101',
		description: 'La República lanza su primera flota de invasión al Continente Oscuro. Al borde de la derrota en la Batalla del Mar Andar, toman refugio en Triangle Daras. Sus Zoids enloquecen por las tormentas, hasta que un misterioso Zoid Imperial nuevo los guía por un camino seguro.',
		era: 'second-intercontinental',
		newZoids: ['Shadow Fox', 'Berserk Führer'],
		title: 'Batalla del Mar Andar',
	},
	{
		date: '7/ZAC 2101',
		description: 'La República desembarca en el Continente Oscuro. Las defensas imperiales parecen débiles — un Shadow Fox descubre que el Eisen Dragoon (liderado por Wolff Muroa) está destruyendo las defensas en el camino de la República.',
		era: 'second-intercontinental',
		title: 'Desembarco en el Continente Oscuro',
	},
	{
		date: '8/ZAC 2101',
		description: 'Se revela el plan del Eisen Dragoon: son leales a Zenebas que buscan desgastar tanto a Helic como a Guylos para que el Imperio Zenebas pueda regresar. El Bloody Demon, una variante experimental del Death Saurer, emerge y masacra a la Ray Force. Ray usa partes CAS mixtas para derrotarlo.',
		era: 'second-intercontinental',
		title: 'La Conspiración del Eisen Dragoon',
	},
	{
		date: '9/ZAC 2101',
		description: 'Prozen despliega 50 Death Saurers y todas las reservas en un asalto total contra la República. Schwarz y Hermann descubren la conspiración de Prozen. La República desarrolla el König Wolf y nuevos Zoids anti-jamming.',
		era: 'second-intercontinental',
		newZoids: ['König Wolf', 'Liger Zero X'],
		title: 'El Asalto Total de Prozen',
	},
	{
		date: '10-11/ZAC 2101',
		description: 'Más de 100,000 Zoids y 2 millones de soldados chocan en la Llanura Vana. Al sexto día, Schwarz y Hermann llegan para pedir un cese al fuego y revelar la conspiración de Prozen, uniendo los restos de los ejércitos Helic y Guylos contra él.',
		era: 'second-intercontinental',
		title: 'Batalla de la Llanura Vana',
	},
	{
		date: '11/ZAC 2101',
		description: 'Prozen usa a los Prozen Knights para tomar Valhalla y al Emperador Rudolph como rehén. Revela que es Gunther Prozen Muroa, hijo de Zenebas y emperador fundador del Imperio Neo Zenebas. Ha escondido docenas de Zoid Cores de Death Saurer bajo la ciudad conectados a su Bloody Death Saurer, planeando autodestruirlos. Rudolph lo desafía, Schwarz dispara al cockpit, y Prozen detona la bomba, obliterando la ciudad.',
		era: 'second-intercontinental',
		newZoids: ['Dark Spiner', 'Killer Dome'],
		title: 'La Caída de Valhalla',
	},

	// === Era Neo Zenebas ===
	{
		date: '11/ZAC 2101',
		description: 'El Eisen Dragoon invade el Continente Central, usando las ondas de jamming de los Dark Spiners para congelar y secuestrar las ya diezmadas fuerzas de la República. Liderados por Wolff Muroa, conquistan la mitad occidental del continente en tres semanas, fundando oficialmente el Imperio Neo Zenebas.',
		era: 'neo-zenebas',
		title: 'Fundación del Imperio Neo Zenebas',
	},
	{
		date: 'ZAC 2102',
		description: 'El Eisen Dragoon captura la Fortaleza Monte Arthur y luego la capital de la República. La Presidenta Camford huye en un Saberlion — resulta ser Elena, hija de Zenebas y tía de Wolff.',
		era: 'neo-zenebas',
		newZoids: ['Saberlion', 'Guntiger'],
		title: 'Conquista de la Capital de la República',
	},
	{
		date: 'ZAC 2102-2103',
		description: 'El Neo Zenebas despliega la fuerza de defensa oceánica Trident. La corporación ZOITEC del Continente Oriental inventa los Blox, Zoids modulares con cores artificiales. Los ofrece primero al Imperio, pero ante sus políticas agresivas, da la tecnología a los remanentes de la República.',
		era: 'neo-zenebas',
		newZoids: ['Leoblaze', 'Nightwise', 'Flyscissors'],
		title: 'La Era de los Blox',
	},
	{
		date: 'ZAC 2104',
		description: 'La República hunde la Marine Kaiser 1 y luego la Marine Kaiser 3 en batallas navales, abriendo el camino para un desembarco a gran escala en el Continente Central.',
		era: 'neo-zenebas',
		title: 'Batallas Navales y la Caída de las Marine Kaisers',
	},
	{
		date: '10/ZAC 2105',
		description: 'El Black Dragoon ataca una base secreta de la República. Congelados por Dark Spiners, ningún Zoid puede luchar excepto un Gojulas The Ogre que destruye todos los Dark Spiners solo, permitiendo al casi terminado Gojulasgiga derrotar al resto.',
		era: 'neo-zenebas',
		newZoids: ['Gojulasgiga', 'Buster Eagle'],
		title: 'El Gojulasgiga Entra en Batalla',
	},
	{
		date: 'ZAC 2106',
		description: 'El Neo Zenebas completa el Seismosaurus, equipado con un Super-Focused Charged Particle Cannon capaz de destruir al Gojulasgiga a distancias extremas. Un equipo de 10 Seismosaurus destruye la Fortaleza Cook. Completamente derrotada, la República escapa al Continente Oriental.',
		era: 'neo-zenebas',
		newZoids: ['Seismosaurus'],
		title: 'El Seismosaurus y la Caída de Cook',
	},
	{
		date: 'ZAC 2106-2108',
		description: 'La República desarrolla el Gairyuki (basado en un Zoid tipo Tyrannosaurus capaz de absorber ataques de partículas) y nuevos Zoids transformables. Logran recapturar la Fortaleza Cook con el Leogator y el Monte Arthur con el Dimetroptera.',
		era: 'neo-zenebas',
		newZoids: ['Gairyuki', 'Leogator', 'Dimetroptera'],
		title: 'Contraataque con Zoids Transformables',
	},
	{
		date: '12/ZAC 2108',
		description: 'Un grupo de 29 Ligerzero Phoenixes invade Crockett City. Descubren un Seismosaurus dentro, y Wolff en el nuevo Energy Liger frustra los intentos de captura, aunque la ciudad es tomada.',
		era: 'neo-zenebas',
		newZoids: ['Phoenix', 'Energy Liger', 'Jet Falcon'],
		title: 'Batalla de Crockett City',
	},
	{
		date: 'ZAC 2109',
		description: 'La República envía 30,000 Zoids hacia la antigua capital por tres rutas. Ray Gregg descubre el Seismo Cannon, un superarma custodiada por Wolff. Forma el Liger Zero Falcon y dispara al core del cañón, desencadenando una sobrecarga. Wolff y Ray trabajan juntos para desviar la energía, limitando la explosión. Con Wolff desaparecido, el comandante imperial Signer Feuer contacta en secreto a Rob Hermann para un cese al fuego.',
		era: 'neo-zenebas',
		title: 'Batalla Final y Cese al Fuego',
	},
	{
		date: '~ZAC 2109',
		description: 'Se celebran juicios de guerra, el Imperio Neo Zenebas es oficialmente disuelto y se elige un nuevo presidente de Delpoi, unificando el continente y poniendo fin a la guerra.',
		era: 'neo-zenebas',
		title: 'Fin de la Guerra y Unificación',
	},

	// === Futuro ===
	{
		date: '5/ZAC 2230',
		description: 'En Blue City, Continente Oriental, los Zoids se usan solo para propósitos constructivos y entretenimiento. La megacorporación ZOITEC obtiene los cores de tres legendarios Zoids tipo tigre, pero debe dividir el primero en dos Zoids combinables para evitar sobrecarga.',
		era: 'future',
		newZoids: ['Whitz Wolf', 'Savinga'],
		title: 'La Era de los Torneos',
	},
	{
		date: '6/ZAC 2230',
		description: 'La compañía rival Zi-Arms se entera de los cores de tigre y ataca a ZOITEC con su propio Zoid de fusión, el Decalto Dragon. Los nuevos Zoids de ZOITEC se combinan en el Whitz Tiger para oponerse, pero el sistema de control se sobrecarga y el Decalto Dragon escapa, secuestrando al director de ZOITEC.',
		era: 'future',
		newZoids: ['Death Raser', 'Parablade'],
		title: 'Conflicto ZOITEC vs Zi-Arms',
	},
	{
		date: '7/ZAC 2230',
		description: 'Para rescatar a su director, ZOITEC construye apresuradamente al segundo tigre legendario, el Rayse Tiger, y lo envía a invadir el Whale King de Zi-Arms. Sin embargo, Zi-Arms ya ha completado al tercer tigre legendario, el Brastle Tiger.',
		era: 'future',
		newZoids: ['Rayse Tiger', 'Brastle Tiger'],
		title: 'La Batalla de los Tigres Legendarios',
	},
	{
		date: '8/ZAC 2230',
		description: 'Zi-Arms ha creado el Mega Death Saurer, planeando equiparlo con los tres cores de tigre para hacerlo el Zoid más fuerte de la historia. Sin embargo, los tres tigres se unen para derrotarlo, y el Whale King dañado cae a la superficie, llevándose a los cuatro Zoids con él.',
		era: 'future',
		title: 'Derrota del Mega Death Saurer',
	},
	{
		date: 'Futuro lejano',
		description: 'En la República Beith, los Zoids se usan para propósitos constructivos y torneos ilegales "ZiEL". El Imperio Dynas descubre la tecnología Changemize que permite a los Blox Zoids combinarse, y ataca la capital. Ambos bandos excavan cores de Zoids legendarios antiguos para crear fusiones aún más fuertes.',
		era: 'future',
		newZoids: ['Bravejaguar', 'LB Gojulas', 'LB Red Horn'],
		title: 'República Beith vs Imperio Dynas',
	},
];

const eraDefinitions: Omit<TimelineEraGroup, 'events'>[] = [
	{ color: '#9c77f3', era: 'prehistory', label: 'Prehistoria', yearRange: 'Origen ~ Hace 100,000 años' },
	{ color: '#df55f7', era: 'tribal-wars', label: 'Guerras Tribales', yearRange: 'Hace 10,000 años ~ ZAC 2029' },
	{ color: '#ef4444', era: 'central-war', label: 'Guerra del Continente Central', yearRange: 'ZAC 2030 ~ ZAC 2051' },
	{ color: '#f97316', era: 'first-intercontinental', label: 'Primera Guerra Intercontinental', yearRange: 'ZAC 2051 ~ ZAC 2056' },
	{ color: '#22c55e', era: 'rebirth-century', label: 'Rebirth Century', yearRange: 'ZAC 2057 ~ ZAC 2098' },
	{ color: '#64e2ed', era: 'western-continent', label: 'Guerra del Continente Occidental', yearRange: 'ZAC 2099 ~ ZAC 2101' },
	{ color: '#3b82f6', era: 'second-intercontinental', label: 'Segunda Guerra Intercontinental', yearRange: 'ZAC 2101' },
	{ color: '#ec4899', era: 'neo-zenebas', label: 'Era Neo Zenebas', yearRange: 'ZAC 2101 ~ ZAC 2109' },
	{ color: '#f59e0b', era: 'future', label: 'Futuro', yearRange: 'ZAC 2230 ~' },
];

export const timelineByEra: TimelineEraGroup[] = eraDefinitions.map((def) => ({
	...def,
	events: events.filter((e) => e.era === def.era),
}));

export const sources: TimelineSource[] = [
	{ code: 'K', description: 'Cajas/manuales de model kits [TOMY+Takara Tomy, 1983-2009]' },
	{ code: 'G1~G21', description: 'Zoids Data / Zoids Graphics volúmenes 1 a 21 [TOMY, 1984-1990]' },
	{ code: 'H', description: 'History of Zoids [TOMY, 1985]' },
	{ code: 'A', description: 'All About Battle Machine Beasts [Shogakukan, 1986]' },
	{ code: 'B1~B5', description: 'Zoids Battle Story volúmenes 1 a 5 [Shogakukan, 1987-1990]' },
	{ code: 'D', description: 'Dengeki Hobby Magazine [ASCII MediaWorks, 1998-2015]' },
	{ code: 'F1~F5', description: 'Official Fan Book volúmenes 1 a 5 [Shogakukan, 2000-2004 + 2024]' },
	{ code: 'W', description: 'Zoids Web Comic [TOMY, 2001-2003]' },
	{ code: 'X1~X12', description: 'Official Fan Book EX volúmenes 1 a 12 [TOMY, 2002-2004]' },
	{ code: 'Z', description: 'The Zoids Bible (Zi History File) [TOMY, 2003]' },
	{ code: 'R', description: 'Rebirth Century [Takara Tomy, 2008-2009]' },
];
