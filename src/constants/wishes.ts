export type WishCategory = 'all' | 'funny' | 'romantic' | 'extreme' | 'creative' | 'social';

export interface CategorizedWish {
  text: string;
  category: WishCategory;
}

export const CATEGORIZED_WISHES: CategorizedWish[] = [
  // СМЕШНЫЕ (Funny)
  { text: "Спеть песню голосом мультяшного персонажа", category: 'funny' },
  { text: "Станцевать танец робота 30 секунд", category: 'funny' },
  { text: "Рассказать анекдот про животных", category: 'funny' },
  { text: "Изобразить животное, другие угадывают", category: 'funny' },
  { text: "Говорить 2 минуты без остановки", category: 'funny' },
  { text: "Изобразить любого игрока", category: 'funny' },
  { text: "Похвалить себя 1 минуту", category: 'funny' },
  { text: "Показать свой любимый танцевальный трюк", category: 'funny' },
  { text: "Изобразить известного человека", category: 'funny' },
  { text: "Спеть песню наоборот", category: 'funny' },
  { text: "Говорить только рифмами следующие 2 минуты", category: 'funny' },
  { text: "Показать свою лучшую модельную походку", category: 'funny' },
  { text: "Попытаться облизать свой локоть", category: 'funny' },
  { text: "Говорить в течение минуты как пират", category: 'funny' },
  { text: "Станцевать танец пингвина", category: 'funny' },
  { text: "Изобразить как готовится еда в микроволновке", category: 'funny' },
  { text: "Говорить следующие 3 минуты очень медленно", category: 'funny' },
  { text: "Рассказать страшную историю смешным голосом", category: 'funny' },
  { text: "Показать свои худшие танцевальные движения", category: 'funny' },
  { text: "Изобразить как просыпается медведь после спячки", category: 'funny' },
  { text: "Спеть детскую песню оперным голосом", category: 'funny' },
  { text: "Показать пантомиму 'застрявший в невидимой коробке'", category: 'funny' },
  { text: "Говорить следующие 5 минут очень громким шёпотом", category: 'funny' },
  { text: "Изобразить инопланетянина, изучающего человеческую еду", category: 'funny' },
  { text: "Попытаться жонглировать тремя невидимыми предметами", category: 'funny' },
  { text: "Изобразить супергероя с бесполезной суперспособностью", category: 'funny' },
  { text: "Спеть гимн страны которую ты придумал", category: 'funny' },
  { text: "Показать как ты выглядишь когда никто не видит", category: 'funny' },
  { text: "Изобразить борьбу с невидимым противником", category: 'funny' },
  { text: "Рассказать сказку, меняя голос для каждого персонажа", category: 'funny' },

  // РОМАНТИЧЕСКИЕ (Romantic)
  { text: "Сделать комплимент каждому игроку", category: 'romantic' },
  { text: "Признаться в чем-то хорошем о соседе слева", category: 'romantic' },
  { text: "Сказать что тебе нравится в каждом игроке", category: 'romantic' },
  { text: "Обнять всех игроков по очереди", category: 'romantic' },
  { text: "Сказать три комплимента игроку напротив", category: 'romantic' },
  { text: "Признаться в самом романтичном поступке", category: 'romantic' },
  { text: "Описать идеальное свидание", category: 'romantic' },
  { text: "Сказать комплимент глазам соседа справа", category: 'romantic' },
  { text: "Рассказать о самом трогательном моменте в жизни", category: 'romantic' },
  { text: "Написать короткое стихотворение о любви", category: 'romantic' },
  { text: "Признаться что тебя вдохновляет в людях", category: 'romantic' },
  { text: "Рассказать о своей мечте", category: 'romantic' },
  { text: "Сделать массаж плеч соседу справа", category: 'romantic' },
  { text: "Спеть романтическую песню", category: 'romantic' },
  { text: "Рассказать о человеке который изменил твою жизнь", category: 'romantic' },
  { text: "Назвать 5 качеств идеального партнера", category: 'romantic' },
  { text: "Поделиться самым счастливым воспоминанием детства", category: 'romantic' },
  { text: "Описать место где хотел бы встретить любовь", category: 'romantic' },
  { text: "Рассказать о самом добром поступке который видел", category: 'romantic' },
  { text: "Признаться что ценишь в дружбе больше всего", category: 'romantic' },

  // ЭКСТРЕМАЛЬНЫЕ (Extreme)
  { text: "Сделать 10 приседаний", category: 'extreme' },
  { text: "Простоять на одной ноге 1 минуту", category: 'extreme' },
  { text: "Сделать планку 30 секунд", category: 'extreme' },
  { text: "Попрыгать на месте 20 раз", category: 'extreme' },
  { text: "Сделать 15 отжиманий", category: 'extreme' },
  { text: "Простоять в позе йоги 1 минуту", category: 'extreme' },
  { text: "Сделать 20 прыжков со скакалкой (или без)", category: 'extreme' },
  { text: "Держать стакан воды на голове 1 минуту", category: 'extreme' },
  { text: "Сделать 10 выпадов", category: 'extreme' },
  { text: "Постоять на руках у стены 15 секунд", category: 'extreme' },
  { text: "Сделать мостик и продержаться 20 секунд", category: 'extreme' },
  { text: "Сделать 25 прыжков на одной ноге", category: 'extreme' },
  { text: "Пробежать на месте 2 минуты", category: 'extreme' },
  { text: "Сделать стойку 'ласточка' 30 секунд", category: 'extreme' },
  { text: "Выполнить 10 берпи", category: 'extreme' },
  { text: "Сделать 20 jumping jacks", category: 'extreme' },
  { text: "Присесть у стены 45 секунд", category: 'extreme' },
  { text: "Сделать 30 скручиваний на пресс", category: 'extreme' },
  { text: "Выполнить 5 медленных отжиманий (5 секунд вниз, 5 вверх)", category: 'extreme' },
  { text: "Держать планку на локтях 1 минуту", category: 'extreme' },

  // ТВОРЧЕСКИЕ (Creative)
  { text: "Нарисовать портрет соседа за 1 минуту", category: 'creative' },
  { text: "Сочинить короткую песню об игре", category: 'creative' },
  { text: "Создать танец из 5 движений и научить всех", category: 'creative' },
  { text: "Придумать новое правило для игры", category: 'creative' },
  { text: "Сочинить стихотворение о бутылочке", category: 'creative' },
  { text: "Изобразить статую, другие угадывают что это", category: 'creative' },
  { text: "Создать рэп на месте про всех игроков", category: 'creative' },
  { text: "Придумать новое слово и объяснить его значение", category: 'creative' },
  { text: "Нарисовать животное с закрытыми глазами", category: 'creative' },
  { text: "Сочинить сказку про игроков", category: 'creative' },
  { text: "Создать хореографию на 30 секунд", category: 'creative' },
  { text: "Придумать рекламный слоган для игры", category: 'creative' },
  { text: "Изобразить эмоцию без слов и звуков", category: 'creative' },
  { text: "Сочинить хокку о текущем моменте", category: 'creative' },
  { text: "Создать уникальное рукопожатие", category: 'creative' },
  { text: "Придумать суперспособность и показать её", category: 'creative' },
  { text: "Нарисовать левой рукой (или правой если левша)", category: 'creative' },
  { text: "Создать короткую сценку с одним реквизитом", category: 'creative' },
  { text: "Придумать и показать новый вид спорта", category: 'creative' },
  { text: "Сочинить рекламу несуществующего продукта", category: 'creative' },

  // СОЦИАЛЬНЫЕ (Social)
  { text: "Рассказать самый смешной случай из жизни", category: 'social' },
  { text: "Показать свое самое странное фото в телефоне", category: 'social' },
  { text: "Сделать селфи со всеми игроками", category: 'social' },
  { text: "Рассказать о своем самом неловком моменте", category: 'social' },
  { text: "Назвать 5 своих положительных качеств", category: 'social' },
  { text: "Рассказать смешную историю про друга", category: 'social' },
  { text: "Объяснить правила любой игры", category: 'social' },
  { text: "Выпить стакан воды залпом", category: 'social' },
  { text: "Позвонить случайному контакту и сказать что-то смешное", category: 'social' },
  { text: "Показать свой последний поисковый запрос", category: 'social' },
  { text: "Съесть что-то необычное (если есть)", category: 'social' },
  { text: "Рассказать о своей самой большой мечте", category: 'social' },
  { text: "Поделиться лайфхаком который ты знаешь", category: 'social' },
  { text: "Рассказать о месте которое хочешь посетить", category: 'social' },
  { text: "Назвать фильм который изменил твою жизнь", category: 'social' },
  { text: "Поделиться самым странным фактом который знаешь", category: 'social' },
  { text: "Рассказать историю из детства", category: 'social' },
  { text: "Описать свой идеальный день", category: 'social' },
  { text: "Рассказать о хобби которое хотел бы попробовать", category: 'social' },
  { text: "Поделиться советом который тебе помог в жизни", category: 'social' },
  { text: "Назвать 3 вещи за которые ты благодарен сегодня", category: 'social' },
  { text: "Рассказать о книге которая тебя вдохновила", category: 'social' },
  { text: "Поделиться своей суперсилой если бы мог выбрать", category: 'social' },
  { text: "Описать свой любимый сезон года и почему", category: 'social' },
  { text: "Рассказать о самом смелом поступке", category: 'social' },
  { text: "Назвать песню которая поднимает настроение", category: 'social' },
  { text: "Поделиться забавной привычкой", category: 'social' },
  { text: "Рассказать о человеке которым восхищаешься", category: 'social' },
  { text: "Описать идеальное приключение", category: 'social' },
  { text: "Назвать блюдо которое готовишь лучше всего", category: 'social' },
];

// Старый массив для обратной совместимости
export const WISHES = CATEGORIZED_WISHES.map(w => w.text);

// Функция для получения желаний по категориям
export function getWishesByCategories(categories: WishCategory[]): string[] {
  if (categories.includes('all')) {
    return WISHES;
  }

  return CATEGORIZED_WISHES
    .filter(wish => categories.includes(wish.category))
    .map(wish => wish.text);
}

// Названия категорий
export const CATEGORY_NAMES: Record<WishCategory, string> = {
  all: 'Все',
  funny: 'Смешные',
  romantic: 'Романтические',
  extreme: 'Экстремальные',
  creative: 'Творческие',
  social: 'Социальные',
};

// Эмодзи для категорий
export const CATEGORY_EMOJIS: Record<WishCategory, string> = {
  all: '🎯',
  funny: '😂',
  romantic: '💕',
  extreme: '🔥',
  creative: '🎨',
  social: '👥',
};
