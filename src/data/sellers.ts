export type SellerType = 'community' | 'independent' | 'store';

export interface Seller {
	cons: string[];
	description: string;
	id: string;
	image?: string;
	link: string;
	name: string;
	pros: string[];
	type: SellerType;
}

export interface CountryGroup {
	country: string;
	sellers: Seller[];
}

export const sellersByCountry: CountryGroup[] = [
	{
		country: '🌎',
		sellers: [
			{
				cons: [
					'Además del envío hay que pagar tarifa de importación',
					'Solo disponible en japonés e inglés',
					'El envío internacional se agota rápido si no es preventa, hay que estar cazando',
					'No todos los productos tienen envío internacional',
					'Hay que verificar que el vendedor sea Amazon o la tienda oficial para evitar sorpresas',
					'Requiere tarjeta de crédito para el pago',
				],
				description:
					'La fuente directa desde Japón. Si no quieres depender de revendedores ni intermediarios, Amazon Japón es tu mejor opción para conseguir los lanzamientos más recientes al precio original. Es la forma más cercana de comprar como si estuvieras en una tienda japonesa, pero desde tu sillón.',
				id: 'amazon-japon',
				image: '/images/sellers/amazon.png',
				link: 'https://www.amazon.co.jp',
				name: 'Amazon Japón',
				type: 'store',
				pros: [
					'Catálogo extenso con casi todos los lanzamientos nuevos',
					'Precios de retail japonés, sin sobreprecio de revendedor',
					'Respaldo y garantía de Amazon',
					'La mayoría de productos tienen envío internacional',
					'Puedes usar tu cuenta de Amazon existente',
					'Envían el mismo día del lanzamiento y llega muy rápido, casi siempre por DHL',
				],
			},
			{
				cons: [
					'Solo se enfoca en artículos recientes, imposible encontrar artículos más antiguos',
					'No considera impuestos de importación, así que te toca lidiar con la aduana por tu cuenta',
					'Los artículos exclusivos de tiendas específicas no están disponibles',
					'El stock rota rápido y rara vez reponen lo que se agota',
				],
				description:
					'Una de las tiendas de hobby japonesas con más trayectoria en el mercado internacional. Desde model kits hasta figuras y accesorios, HLJ lleva años ayudando a coleccionistas de todo el mundo. Su plataforma es sencilla, su reputación sólida, y si buscas algún lanzamiento reciente, probablemente lo encuentras aquí.',
				id: 'hlj',
				image: '/images/sellers/hlj.png',
				link: 'https://www.hlj.com',
				name: 'Hobby Link Japan',
				type: 'store',
				pros: [
					'Cobertura amplia de lanzamientos y novedades del mercado japonés',
					'Sistema de almacén privado por 90 días para acumular pedidos y consolidar envíos',
					'Múltiples servicios de paquetería internacional a elegir',
					'Tarifas de envío relativamente bajas',
				],
			},
			{
				cons: [
					'Cobran comisión por cada artículo (6% del precio).',
					'Te hace creer que todo es barato pero entre comisiones y envío, la cuenta final se elevará mucho',
					'Ni se te ocurra pedir protección extra de empaque, recibirás un paquete del tamaño de un refrigerador con un envío más caro que una casa',
					'Los impuestos de importación no están incluidos, así que te toca lidiar con la aduana por tu cuenta',
					'No permite negociar el precio con vendedores de segunda mano',
				],
				description:
					'El intermediario más popular para comprar en tiendas japonesas que no envían al extranjero. Buyee compra por ti, recibe el producto en su almacén en Japón y te lo reenvía a donde estés. Si viste un Zoid que solo se vende en Japón, Buyee es tu solución. Y si tu billetera lo permite, incluso puedes participar en las subastas.',
				id: 'buyee',
				image: '/images/sellers/buyee.png',
				link: 'https://buyee.jp',
				name: 'Buyee',
				type: 'store',
				pros: [
					'Puede comprar por ti Zoids exclusivos.',
					'Perfecto para Zoids de segunda mano.',
					'Acceso a más de 150 tiendas y plataformas japonesas que normalmente no envían fuera de Japón',
					'Te mandan fotos del Zoid cuando llega a su almacén para que verifiques el estado antes del envío',
					'Permite consolidar varios pedidos en un solo paquete para ahorrar en envío',
				],
			},
		],
	},
	{
		country: '🇯🇵',
		sellers: [
			{
				cons: [
					'No puedes comprar directamente desde fuera de Japón, necesitas un servicio de Proxy',
					'Las subastas pueden volverse impredecibles y terminar pagando mucho más de lo que esperabas, además de que pueden provocar adicción.',
					'Los vendedores son particulares, así que la calidad y honestidad varían mucho, tienes que revisar los detalles muy bien.',
					'Todo está en japonés',
					'Prepárate para una guerra de nervios en los últimos segundos',
				],
				description:
					'Si te sobran billetes y buscas tu santo grial, este es el lugar para ti. El mercado de subastas más grande de Japón, una mina de oro para Zoids vintage y rarezas que no vas a encontrar en ningún otro lado. Aquí aparecen Zoids que fueron premios de concursos, lotes completos de coleccionistas que se retiran y modelos que ni sabías que existían. No es para quienes tienen un presupuesto ajustado, pero si quieres ese Zoid que tanto has buscado, prepara el traductor y la tarjeta de crédito que tarde o temprano aparecerá aquí.',
				id: 'yahoo-auctions',
				image: '/images/sellers/yahoo_auctions.png',
				link: 'https://auctions.yahoo.co.jp/search/search?p=%E3%82%BE%E3%82%A4%E3%83%89',
				name: 'Yahoo Auctions Japan',
				type: 'store',
				pros: [
					'La mayor selección de Zoids vintage, descontinuados y rarezas que existe en internet',
					'De cierta forma el precio lo decides tú',
					'Aparecen piezas, refacciones y lotes completos que no vas a encontrar en ningún otro lado',
					'Es la forma en la que los coleccionistas más curtidos consiguen sus piezas raras',
				],
			},
		],
	},
	{
		country: '🇲🇽',
		sellers: [
			{
				cons: [
					'La actividad del grupo ha bajado considerablemente',
					'De sus 10 administradores, solo uno trabaja de vez en cuando',
					'Algunos vendedores toman la subasta como inflador de precios',
				],
				description:
					'Grupo de Facebook dedicado exclusivamente al intercambio y venta de Zoids. Aquí la comunidad se lo toma en serio: nada de publicaciones fuera de tema. Su administrador principal se encarga de mantener el grupo libre de estafas y da seguimiento cuando hay problemas. Cuenta con subastas periódicas y una buena variedad de vendedores. No es el grupo más activo del momento, pero sigue vivo y enfocado en lo que importa.',
				id: 'zoidianos',
				image: '/images/sellers/zoidianos.jpg',
				link: 'https://www.facebook.com/groups/1194809623913908',
				name: 'Zoidianos: Intercambio, Venta y Más',
				type: 'community',
				pros: [
					'Comunidad enfocada 100% en Zoids',
					'Administración activa contra estafas',
					'Subastas periódicas con variedad de productos',
					'Buena diversidad de vendedores',
				],
			},
			{
				cons: [
					'Puedes tener que esperar para encontrar el modelo que buscas',
					'Casi siempre maneja sus ventas por lotes de llegada',
					'A veces se deja el bigote y puede dar miedo si no lo conoces',
					'Una vez una señora se lo quiso llevar a su casa para "armar Zoids"',
					'Sus envíos a Puebla no son los mejores',
					'Se enoja cuando está comiendo pechuga de pollo.'
				],
				description:
					'¿Presupuesto ajustado pero ganas de Zoidear? La Isla se adentra en los rincones más oscuros del mercado para rescatar Zoids seminuevos, refacciones y esas piezas que dabas por perdidas. Todo a precios que no duelen. Al grito de ¡CASCAJITOO! La Isla siempre te tiene cubierto.',
				id: 'la-isla',
				image: '/images/sellers/la_isla.jpg',
				link: 'https://www.facebook.com/laisladelcoleccionista',
				name: 'La Isla del Coleccionista',
				type: 'independent',
				pros: [
					'Gran variedad de figuras, especialmente Zoids armados',
					'Precios bajos comparados con modelos nuevos',
					'Te muestra los modelos exactamente como los recibirás',
					'Capaz de cruzar montañas, valles y hasta llegar a Tlalpan con tal de entregarte tu pedido',
				],
			},
			{
				cons: [
					'No garantiza incrementos de precio por parte de las marcas',
					'Requiere anticipo para apartar',
					'Sus mensajes son dificiles de entender',
					'Tiene una obsesión insana con las cabinas y cajas',
					'Tiene un excel para todo',
					'Lidera una mafia de vendedores que planean controlar todo Facebook',
				],
				description:
					'¿Buscas un Zoid vintage o de los próximos lanzamientos y no sabes dónde comprarlo? Zoid Model Kits te lo consigue. Un verdadero apasionado que te guía desde las marcas hasta el lore de cada modelo. ¿Un mini? Lo tiene. ¿Una carta? Es tuya. ¿Una mona encuerable? Será discreto. Si existe, él te lo encuentra.',
				id: 'zoid-model-kits',
				image: '/images/sellers/modelkits.jpg',
				link: 'https://www.facebook.com/ZoidianosDeLasSombras/',
				name: 'Zoid Model Kits',
				type: 'independent',
				pros: [
					'Tiene muchas recomendaciones y ventas que lo respaldan',
					'Transparente con los costos desde el primer mensaje',
					'Te asesora para que tomes la mejor decisión',
					'Garantía de entrega.',
					'Puede conseguir casi cualquier articulo que busques'
				],
			},
			{
				cons: [
					'Miembro de la mafia de model kits.',
					'Le gustan mucho los caballos.',
					'Si le dejas tus Zoids sin pagar mas de un año lo vende y no te regresa tu dinero.',
					'Tiene acento curioso.'
				],
				description:
					'Conocido como Model Kits del norte, este vendedor con varios años de rexperiencia puede ayudarte a conseguir el Zoid que quieras, solo no olvides pagar pues tiene contactos en Sinaloa',
				id: 'brian-nunez',
				image: '/images/sellers/brian.jpg',
				link: 'https://www.facebook.com/brian.nunezgamez',
				name: 'Brian Nuñez',
				type: 'independent',
				pros: [
					'Tiene muchas recomendaciones que lo respaldan',
					'Tiene varios contactos para conseguir los Zoids que quieras.',
					'Incluye suaves en tus pedidos'
				],
			},
		],
	},
	{
		country: '🇵🇪',
		sellers: [
			{
				cons: [
					'No es una tienda específica de Zoids',
					'Solo vende figuras nuevas, no maneja segunda mano',
				],
				description:
					'Si buscas ese Zoid que ya nadie tiene, GERAL es tu mejor aliado en Perú.  Además de las líneas actuales de Zoids, se especializa en rastrear Zoids antiguos motorizados (OJR, NJR) y kits de Supernova, este vendedor se mueve entre catálogos y contactos para rastrear esos kits que el tiempo ya se llevó. No importa qué tan difícil sea de encontrar, si existe, GERAL lo busca.',
				id: 'geral-modelkits-store',
				image: '/images/sellers/geral.jpg',
				link: 'https://www.facebook.com/geralmodelkitstore/',
				name: 'GERAL Modelkits Store',
				pros: [
					'Puede conseguir kits escasos o descontinuados en muy buenas condiciones',
					'Vende piezas de repuesto',
					'Amplia variedad de franquicias mecha',
					'Mantiene informados a sus clientes sobre el estado de sus pedidos',
					'Buen servicio en la entrega de los kits',
					'Envíos a todo el Perú',
				],
				type: 'store',
			},
			{
				cons: [
					'No es una tienda específica de Zoids',
					'Solo vende figuras nuevas, no maneja segunda mano',
				],
				description:
					'MPJ es una tienda peruana que maneja los nuevos lanzamientos de Zoids, además de kits de otras franquicias. También vende herramientas y pinturas para el hobby, así que puedes armar tu pedido completo en un solo lugar.',
				id: 'mpj-pe',
				image: '/images/sellers/mpj.jpg',
				link: 'https://www.facebook.com/MPJ.PE/',
				name: 'MechaPremium J',
				pros: [
					'Amplia variedad de kits de otras franquicias',
					'Vende herramientas y pinturas para el hobby',
					'Envíos a todo el Perú',
				],
				type: 'store',
			},
			{
				cons: [
					'No es una tienda específica de Zoids',
					'Solo vende figuras nuevas, no maneja segunda mano',
					'No sabemos que signifique su nombre',
				],
				description:
					'Una opción versátil para el coleccionista peruano. R&R no se limita a una sola franquicia: si es anime y viene en kit, probablemente lo pueden traer. Para quienes prefieren ver antes de comprar, tienen un espacio físico donde puedes ir a curiosear. Y si eres de los que quiere estar al tanto de cada novedad, su canal de WhatsApp te mantiene informado.',
				id: 'r-and-r-coleccionables',
				image: '/images/sellers/ryr.jpg',
				link: 'https://www.facebook.com/ryrcoleccionables/',
				name: 'R&R Coleccionables',
				pros: [
					'Kits de distintas líneas de anime',
					'También consigue herramientas para el hobby',
					'Cuenta con tienda física',
					'Canal de noticias en WhatsApp para estar al tanto de novedades',
					'Su logo está bueno',
				],
				type: 'store',
			},
			{
				cons: [
					'En su mayoría son preventas, hay que esperar por los kits',
					'Solo vende figuras nuevas, no maneja segunda mano',
					'No es una tienda específica de Zoids',
				],
				description:
					'El punto de entrada ideal si estás en Perú y quieres empezar a coleccionar Zoids sin que tu billetera sufra demasiado. Zerox & Zig se especializa en preventas, lo que significa que puedes asegurar tu kit antes del lanzamiento a precios que difícilmente encontrarás después. Si te gustan los Zoids aquí vas a sentirte como en casa.',
				id: 'zerox-and-zig',
				image: '/images/sellers/zerox.jpg',
				link: 'https://www.facebook.com/ZeroXandZig/',
				name: 'Zerox & Zig',
				pros: [
					'Preventas a muy buen precio',
					'Buen servicio en la entrega de los kits',
					'Mantiene informados a sus clientes sobre el estado de sus pedidos',
					'El nombre suena bien',
				],
				type: 'store',
			},
		],
	},
];
