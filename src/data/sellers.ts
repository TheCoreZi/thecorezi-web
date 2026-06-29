export interface Seller {
	cons: string[];
	description: string;
	id: string;
	image?: string;
	link: string;
	name: string;
	pros: string[];
}

export interface CountryGroup {
	country: string;
	sellers: Seller[];
}

export const sellersByCountry: CountryGroup[] = [
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
				],
				description:
					'¿Presupuesto ajustado pero ganas de Zoidear? La Isla se adentra en los rincones más oscuros del mercado para rescatar Zoids seminuevos, refacciones y esas piezas que dabas por perdidas. Todo a precios que no duelen. Al grito de ¡CASCAJITOO! La Isla siempre te tiene cubierto.',
				id: 'la-isla',
				image: '/images/sellers/la_isla.jpg',
				link: 'https://www.facebook.com/laisladelcoleccionista',
				name: 'La Isla del Coleccionista',
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
					'Lidera una mafia de vendedores que planean controlar todo Facebook'
				],
				description:
					'¿Buscas un Zoid vintage o de los próximos lanzamientos y no sabes dónde comprarlo? Zoid Model Kits te lo consigue. Un verdadero apasionado que te guía desde las marcas hasta el lore de cada modelo. ¿Un mini? Lo tiene. ¿Una carta? Es tuya. ¿Una mona encuerable? Será discreto. Si existe, él te lo encuentra.',
				id: 'zoid-model-kits',
				image: '/images/sellers/modelkits.jpg',
				link: 'https://www.facebook.com/ZoidianosDeLasSombras/',
				name: 'Zoid Model Kits',
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
				pros: [
					'Tiene muchas recomendaciones que lo respaldan',
					'Tiene varios contactos para conseguir los Zoids que quieras.',
					'Incluye suaves en tus pedidos'
				],
			},
		],
	},
	{
		country: '🇯🇵',
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
				pros: [
					'Catálogo extenso con casi todos los lanzamientos nuevos',
					'Precios de retail japonés, sin sobreprecio de revendedor',
					'Respaldo y garantía de Amazon',
					'La mayoría de productos tienen envío internacional',
					'Puedes usar tu cuenta de Amazon existente',
					'Envían el mismo día del lanzamiento y llega muy rápido, casi siempre por DHL',
				],
			},
		],
	},
];
