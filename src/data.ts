import type { Post } from '@/types';

export const posts: Post[] = [
  {
    id: '1',
    slug: 'chasha-iz-kedra',
    title: 'Чаша из кедра',
    category: 'Проект',
    date: '2026-10-14',
    dateLabel: '14 октября 2026',
    excerpt:
      'Точёная чаша из массива сибирского кедра. Годовые кольца задают ритм поверхности, льняное масло сохраняет живую текстуру дерева.',
    image:
      'https://images.pexels.com/photos/15209817/pexels-photo-15209817.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200',
    imageAlt: 'Ручная деревянная чаша в мастерской',
    aspect: 'landscape',
    featured: true,
    href: '/post/chasha-iz-kedra',
  },
  {
    id: '2',
    slug: 'ornament-perezhivshiy-stoletiya',
    title: 'Орнамент, который пережил столетия',
    category: 'Исследование',
    date: '2026-10-10',
    dateLabel: '10 октября 2026',
    excerpt:
      'Резные наличники северных деревень хранят узоры домовой резьбы XIX века. Разбираюсь, как геометрические мотивы переходили из поколения в поколение.',
    image:
      'https://images.pexels.com/photos/32217290/pexels-photo-32217290.jpeg?auto=compress&cs=tinysrgb&h=900&w=1400',
    imageAlt: 'Деталь традиционной деревянной резьбы с растительным орнаментом',
    aspect: 'landscape',
    featured: true,
    href: '/post/ornament-perezhivshiy-stoletiya',
  },
  {
    id: '3',
    slug: 'prodolzhenie-derevyannoy-traditsii',
    title: 'Продолжение деревянной традиции',
    category: 'Идея',
    date: '2026-10-05',
    dateLabel: '5 октября 2026',
    excerpt:
      'Концепция серии предметов, вдохновлённых формами старой деревянной утвари. Ищу заказчика или соавтора, которому близка эта линия.',
    image:
      'https://images.pexels.com/photos/12366674/pexels-photo-12366674.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200',
    imageAlt: 'Поднос с резными инструментами в мастерской',
    aspect: 'landscape',
    featured: true,
    href: '/post/prodolzhenie-derevyannoy-traditsii',
  },
  {
    id: '4',
    slug: 'reznoy-nalichnik',
    title: 'Резной наличник',
    category: 'Проект',
    date: '2026-09-28',
    dateLabel: '28 сентября 2026',
    excerpt:
      'Уменьшенная модель оконного наличника с геометрической резьбой по образцам северной домовой резьбы. Лиственница, ручная работа.',
    image:
      'https://images.pexels.com/photos/36496642/pexels-photo-36496642.jpeg?auto=compress&cs=tinysrgb&h=1200&w=900',
    imageAlt: 'Резная деревянная панель с традиционным орнаментом',
    aspect: 'portrait',
    featured: true,
    href: '/post/reznoy-nalichnik',
  },
  {
    id: '5',
    slug: 'rabota-s-materialom',
    title: 'Работа с материалом',
    category: 'Разработка',
    date: '2026-09-22',
    dateLabel: '22 сентября 2026',
    excerpt:
      'Как выбор породы определяет характер вещи: от первого резца до финальной отделки. Заметки о том, как дерево диктует форму.',
    image:
      'https://images.pexels.com/photos/8961539/pexels-photo-8961539.jpeg?auto=compress&cs=tinysrgb&h=1200&w=900',
    imageAlt: 'Руки мастера, работающего стамеской по дереву в лесу',
    aspect: 'portrait',
    featured: false,
    href: '/post/rabota-s-materialom',
  },
  {
    id: '6',
    slug: 'nabor-lozhek-les',
    title: 'Набор ложек «Лес»',
    category: 'Проект',
    date: '2026-09-15',
    dateLabel: '15 сентября 2026',
    excerpt:
      'Пара резных ложек из берёзы с восковой отделкой. Форма повторяет силуэт старых крестьянских ложек.',
    image:
      'https://images.pexels.com/photos/4170023/pexels-photo-4170023.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200',
    imageAlt: 'Ремесленная посуда с деревянной ложкой на столе',
    aspect: 'landscape',
    featured: false,
    href: '/post/nabor-lozhek-les',
  },
  {
    id: '7',
    slug: 'derevyannaya-fasadnaya-rezba',
    title: 'Фасадная резьба: архив',
    category: 'Исследование',
    date: '2026-09-08',
    dateLabel: '8 сентября 2026',
    excerpt:
      'Образцы орнаментальной резьбы с фасадов старых деревянных домов. Собираю и систематизирую, чтобы сохранить форму до того, как она исчезнет.',
    image:
      'https://images.pexels.com/photos/7821174/pexels-photo-7821174.jpeg?auto=compress&cs=tinysrgb&h=1200&w=900',
    imageAlt: 'Деревянный фасад с резьбой и большими окнами',
    aspect: 'portrait',
    featured: false,
    href: '/post/derevyannaya-fasadnaya-rezba',
  },
  {
    id: '8',
    slug: 'panel-pletenka',
    title: 'Панель «Плетёнка»',
    category: 'Проект',
    date: '2026-08-30',
    dateLabel: '30 августа 2026',
    excerpt:
      'Декоративное панно с геометрическим плетёным узором из ясеня, ореха и клёна, собранных в одном полотне.',
    image:
      'https://images.pexels.com/photos/39365353/pexels-photo-39365353.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200',
    imageAlt: 'Деревянная инкрустация на полу мастерской рядом с инструментом',
    aspect: 'landscape',
    featured: false,
    href: '/post/panel-pletenka',
  },
  {
    id: '9',
    slug: 'eksperiment-s-formoy',
    title: 'Эксперимент с формой',
    category: 'Разработка',
    date: '2026-08-20',
    dateLabel: '20 августа 2026',
    excerpt:
      'Поиск пропорций для новой серии: вытачиваю несколько образцов разной высоты и ширины, чтобы почувствовать баланс.',
    image:
      'https://images.pexels.com/photos/31703678/pexels-photo-31703678.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200',
    imageAlt: 'Коллекция деревянных ремесленных чаш на полке',
    aspect: 'landscape',
    featured: false,
    href: '/post/eksperiment-s-formoy',
  },
  {
    id: '10',
    slug: 'tayozhnyy-les-iskhodnyy-material',
    title: 'Таёжный лес — исходный материал',
    category: 'Запись',
    date: '2026-08-10',
    dateLabel: '10 августа 2026',
    excerpt:
      'Лес задаёт палитру и настроение работы. Фотографии, собранные во время поездки за материалом.',
    image:
      'https://images.pexels.com/photos/12944764/pexels-photo-12944764.jpeg?auto=compress&cs=tinysrgb&h=900&w=1400',
    imageAlt: 'Тихий сосновый лес с плотными стволами',
    aspect: 'landscape',
    featured: false,
    href: '/post/tayozhnyy-les-iskhodnyy-material',
  },
  {
    id: '11',
    slug: 'rezba-ryba-detall',
    title: 'Резьба: деталь с рыбой',
    category: 'Исследование',
    date: '2026-07-28',
    dateLabel: '28 июля 2026',
    excerpt:
      'Рельеф с изображением рыб на угловом элементе деревянной детали. Редкий мотив, встретившийся в одной из экспедиций.',
    image:
      'https://images.pexels.com/photos/34190801/pexels-photo-34190801.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200',
    imageAlt: 'Резные рельефы рыб на деревянной архитектурной детали',
    aspect: 'landscape',
    featured: false,
    href: '/post/rezba-ryba-detall',
  },
  {
    id: '12',
    slug: 'derevyannaya-traditsiya-okna',
    title: 'Окно в деревянной традиции',
    category: 'Исследование',
    date: '2026-07-15',
    dateLabel: '15 июля 2026',
    excerpt:
      'Архивные окна с резными наличниками — одно из самых выразительных полей для исследования орнамента.',
    image:
      'https://images.pexels.com/photos/16295136/pexels-photo-16295136.jpeg?auto=compress&cs=tinysrgb&h=1200&w=900',
    imageAlt: 'Старое деревянное окно с резным декором',
    aspect: 'portrait',
    featured: false,
    href: '/post/derevyannaya-traditsiya-okna',
  },
  {
    id: '13',
    slug: 'instrumenty-mastera',
    title: 'Инструменты мастера',
    category: 'Запись',
    date: '2026-07-02',
    dateLabel: '2 июля 2026',
    excerpt:
      'Верстак и набор инструментов — основа мастерской. Каждый резец имеет своё назначение и свою историю.',
    image:
      'https://images.pexels.com/photos/29537620/pexels-photo-29537620.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200',
    imageAlt: 'Верстак с традиционными инструментами для работы по дереву',
    aspect: 'landscape',
    featured: false,
    href: '/post/instrumenty-mastera',
  },
  {
    id: '14',
    slug: 'kamen-mokh-tekstury',
    title: 'Камень и мох — текстуры',
    category: 'Запись',
    date: '2026-06-18',
    dateLabel: '18 июня 2026',
    excerpt:
      'Природные текстуры как источник образов для резьбы: мох на камне, слоистая структура, живые линии.',
    image:
      'https://images.pexels.com/photos/1972/slippery-moss-stones-slippy.jpg?auto=compress&cs=tinysrgb&h=900&w=1200',
    imageAlt: 'Текстура мха и лишайника на поверхности камня',
    aspect: 'landscape',
    featured: false,
    href: '/post/kamen-mokh-tekstury',
  },
  {
    id: '15',
    slug: 'derevyannye-skulptury-fragmenty',
    title: 'Деревянные скульптуры: фрагменты',
    category: 'Разработка',
    date: '2026-06-05',
    dateLabel: '5 июня 2026',
    excerpt:
      'Наброски для скульптурной серии — резные фигуры, в которых этнографический мотив переосмысляется в современной форме.',
    image:
      'https://images.pexels.com/photos/36590055/pexels-photo-36590055.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200',
    imageAlt: 'Деревянные резные скульптуры лошадей с детальной резьбой',
    aspect: 'landscape',
    featured: false,
    href: '/post/derevyannye-skulptury-fragmenty',
  },
  {
    id: '16',
    slug: 'novaya-seriya-posudy',
    title: 'Новая серия посуды',
    category: 'Идея',
    date: '2026-05-22',
    dateLabel: '22 мая 2026',
    excerpt:
      'Концепция набора посуды, в котором каждый предмет — отдельная характерная форма. На стадии поиска материала и заказчика.',
    image:
      'https://images.pexels.com/photos/6692142/pexels-photo-6692142.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200',
    imageAlt: 'Минималистичная деревянная посуда с тенями на поверхности',
    aspect: 'landscape',
    featured: false,
    href: '/post/novaya-seriya-posudy',
  },
];
