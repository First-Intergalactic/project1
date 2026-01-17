import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const interests = [
  // Sports
  { name: 'Фитнес', icon: '💪', category: 'sports' },
  { name: 'Йога', icon: '🧘', category: 'sports' },
  { name: 'Бег', icon: '🏃', category: 'sports' },
  { name: 'Плавание', icon: '🏊', category: 'sports' },
  { name: 'Футбол', icon: '⚽', category: 'sports' },
  { name: 'Теннис', icon: '🎾', category: 'sports' },
  // Music
  { name: 'Рок', icon: '🎸', category: 'music' },
  { name: 'Электронная музыка', icon: '🎧', category: 'music' },
  { name: 'Джаз', icon: '🎷', category: 'music' },
  { name: 'Классика', icon: '🎻', category: 'music' },
  { name: 'Рэп', icon: '🎤', category: 'music' },
  // Food
  { name: 'Готовка', icon: '👨‍🍳', category: 'food' },
  { name: 'Суши', icon: '🍣', category: 'food' },
  { name: 'Кофе', icon: '☕', category: 'food' },
  { name: 'Вино', icon: '🍷', category: 'food' },
  { name: 'Веган', icon: '🥗', category: 'food' },
  // Travel
  { name: 'Путешествия', icon: '✈️', category: 'travel' },
  { name: 'Горы', icon: '🏔️', category: 'travel' },
  { name: 'Море', icon: '🏖️', category: 'travel' },
  { name: 'Кемпинг', icon: '⛺', category: 'travel' },
  // Entertainment
  { name: 'Кино', icon: '🎬', category: 'entertainment' },
  { name: 'Сериалы', icon: '📺', category: 'entertainment' },
  { name: 'Видеоигры', icon: '🎮', category: 'entertainment' },
  { name: 'Настольные игры', icon: '🎲', category: 'entertainment' },
  { name: 'Чтение', icon: '📚', category: 'entertainment' },
  // Creative
  { name: 'Фотография', icon: '📷', category: 'creative' },
  { name: 'Рисование', icon: '🎨', category: 'creative' },
  { name: 'Музыка', icon: '🎵', category: 'creative' },
  { name: 'Танцы', icon: '💃', category: 'creative' },
  // Lifestyle
  { name: 'Животные', icon: '🐕', category: 'lifestyle' },
  { name: 'Садоводство', icon: '🌱', category: 'lifestyle' },
  { name: 'Медитация', icon: '🧘‍♂️', category: 'lifestyle' },
  { name: 'Волонтёрство', icon: '❤️', category: 'lifestyle' }
]

const iceBreakers = [
  // Funny
  { text: 'Если бы ты был(а) пиццей, какой начинкой бы был(а)?', category: 'funny' },
  { text: 'Расскажи самый нелепый факт о себе', category: 'funny' },
  { text: 'Какой суперспособностью ты бы хотел(а) обладать?', category: 'funny' },
  { text: 'Если бы твоя жизнь была фильмом, какого жанра?', category: 'funny' },
  // Flirty
  { text: 'Что первое привлекло твоё внимание в моём профиле?', category: 'flirty' },
  { text: 'Как бы ты описал(а) идеальное первое свидание?', category: 'flirty' },
  { text: 'Если бы мы встретились в кафе, что бы ты заказал(а)?', category: 'flirty' },
  // Casual
  { text: 'Какой сериал сейчас смотришь?', category: 'casual' },
  { text: 'Куда бы ты хотел(а) поехать в следующий отпуск?', category: 'casual' },
  { text: 'Как прошли выходные?', category: 'casual' },
  { text: 'Чем обычно занимаешься после работы?', category: 'casual' },
  // Deep
  { text: 'Что для тебя важнее всего в отношениях?', category: 'deep' },
  { text: 'О чём ты мечтаешь?', category: 'deep' },
  { text: 'Какой момент в жизни тебя больше всего изменил?', category: 'deep' },
  { text: 'Что делает тебя по-настоящему счастливым?', category: 'deep' }
]

const demoUsers = [
  {
    email: 'anna@demo.com',
    name: 'Анна',
    gender: 'female',
    bio: 'Люблю путешествия и хорошую музыку. Ищу интересного собеседника для серьёзных отношений.',
    birthDate: new Date('2002-05-15'),
    relationshipGoal: 'serious',
    occupation: 'Дизайнер',
    education: 'МГУ',
    height: 168,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Путешествия', 'Фотография', 'Йога', 'Кино'],
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
  },
  // === NEW 30 PROFILES (18-25 years old) ===
  // Women
  {
    email: 'sofia@demo.com',
    name: 'София',
    gender: 'female',
    bio: 'Студентка медицинского. Обожаю танцы и вечеринки с друзьями. Ищу весёлого парня!',
    birthDate: new Date('2004-03-12'),
    relationshipGoal: 'casual',
    occupation: 'Студентка',
    height: 165,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Танцы', 'Музыка', 'Кофе', 'Сериалы'],
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400'
  },
  {
    email: 'alisa@demo.com',
    name: 'Алиса',
    gender: 'female',
    bio: 'Фотограф-фрилансер. Путешествую по миру с камерой. Ищу попутчика по жизни.',
    birthDate: new Date('2001-07-22'),
    relationshipGoal: 'serious',
    occupation: 'Фотограф',
    height: 170,
    smoking: 'never',
    drinking: 'never',
    interests: ['Фотография', 'Путешествия', 'Кофе', 'Рисование'],
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'
  },
  {
    email: 'victoria@demo.com',
    name: 'Виктория',
    gender: 'female',
    bio: 'Модель и студентка. Люблю моду, искусство и хорошую еду. Давай сходим куда-нибудь!',
    birthDate: new Date('2003-11-08'),
    relationshipGoal: 'not_sure',
    occupation: 'Модель',
    height: 175,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Танцы', 'Кино', 'Готовка', 'Путешествия'],
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400'
  },
  {
    email: 'daria@demo.com',
    name: 'Дарья',
    gender: 'female',
    bio: 'Учусь на психолога. Интересуюсь людьми и их историями. Открыта к новым знакомствам!',
    birthDate: new Date('2002-01-25'),
    relationshipGoal: 'serious',
    occupation: 'Студентка психфака',
    education: 'МГУ',
    height: 163,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Чтение', 'Медитация', 'Кофе', 'Кино'],
    photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400'
  },
  {
    email: 'polina@demo.com',
    name: 'Полина',
    gender: 'female',
    bio: 'Фитнес-тренер. Веду активный образ жизни. Ищу спортивного парня для совместных тренировок!',
    birthDate: new Date('2000-06-14'),
    relationshipGoal: 'serious',
    occupation: 'Фитнес-тренер',
    height: 168,
    smoking: 'never',
    drinking: 'never',
    interests: ['Фитнес', 'Йога', 'Бег', 'Готовка'],
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'
  },
  {
    email: 'karina@demo.com',
    name: 'Карина',
    gender: 'female',
    bio: 'Работаю в IT, но душой я художник. Рисую, пишу музыку. Ищу творческую личность!',
    birthDate: new Date('2001-09-30'),
    relationshipGoal: 'serious',
    occupation: 'UX дизайнер',
    height: 160,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Рисование', 'Музыка', 'Видеоигры', 'Кофе'],
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400'
  },
  {
    email: 'milana@demo.com',
    name: 'Милана',
    gender: 'female',
    bio: 'Танцую с 5 лет. Хореограф в танцевальной студии. Энергичная и позитивная!',
    birthDate: new Date('2003-04-18'),
    relationshipGoal: 'casual',
    occupation: 'Хореограф',
    height: 167,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Танцы', 'Фитнес', 'Музыка', 'Кино'],
    photo: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400'
  },
  {
    email: 'eva@demo.com',
    name: 'Ева',
    gender: 'female',
    bio: 'Люблю море, солнце и приключения. Мечтаю объехать весь мир! Погнали?',
    birthDate: new Date('2002-08-05'),
    relationshipGoal: 'not_sure',
    occupation: 'SMM-менеджер',
    height: 164,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Путешествия', 'Море', 'Фотография', 'Вино'],
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
  },
  {
    email: 'arina@demo.com',
    name: 'Арина',
    gender: 'female',
    bio: 'Будущий врач. Серьёзная, но с хорошим чувством юмора. Ценю честность.',
    birthDate: new Date('2001-12-20'),
    relationshipGoal: 'serious',
    occupation: 'Студентка-медик',
    education: 'МГМУ',
    height: 166,
    smoking: 'never',
    drinking: 'never',
    interests: ['Чтение', 'Йога', 'Классика', 'Готовка'],
    photo: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=400'
  },
  {
    email: 'vasilisa@demo.com',
    name: 'Василиса',
    gender: 'female',
    bio: 'Журналист и блогер. Люблю истории и людей. Расскажи мне что-нибудь интересное!',
    birthDate: new Date('2000-02-28'),
    relationshipGoal: 'serious',
    occupation: 'Журналист',
    height: 169,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Чтение', 'Кино', 'Путешествия', 'Кофе'],
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400'
  },
  {
    email: 'kristina@demo.com',
    name: 'Кристина',
    gender: 'female',
    bio: 'Работаю стилистом. Помогу подобрать образ и для тебя! Люблю красоту во всём.',
    birthDate: new Date('2001-05-10'),
    relationshipGoal: 'casual',
    occupation: 'Стилист',
    height: 172,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Танцы', 'Кино', 'Фотография', 'Путешествия'],
    photo: 'https://images.unsplash.com/photo-1557053910-d9eadeed1c58?w=400'
  },
  {
    email: 'diana@demo.com',
    name: 'Диана',
    gender: 'female',
    bio: 'Играю на скрипке в оркестре. Классика - моя страсть. Ищу ценителя прекрасного.',
    birthDate: new Date('2002-10-15'),
    relationshipGoal: 'serious',
    occupation: 'Музыкант',
    education: 'Консерватория',
    height: 165,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Классика', 'Музыка', 'Чтение', 'Кино'],
    photo: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400'
  },
  {
    email: 'alexandra@demo.com',
    name: 'Александра',
    gender: 'female',
    bio: 'Маркетолог в tech-компании. После работы - спортзал или кино. Активная и целеустремлённая!',
    birthDate: new Date('2000-07-03'),
    relationshipGoal: 'serious',
    occupation: 'Маркетолог',
    height: 168,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Фитнес', 'Кино', 'Путешествия', 'Кофе'],
    photo: 'https://images.unsplash.com/photo-1496440737103-cd596325d314?w=400'
  },
  {
    email: 'nika@demo.com',
    name: 'Ника',
    gender: 'female',
    bio: 'Веб-дизайнер. Создаю красивые сайты днём, смотрю аниме ночью. Ищу гика!',
    birthDate: new Date('2003-01-22'),
    relationshipGoal: 'not_sure',
    occupation: 'Веб-дизайнер',
    height: 158,
    smoking: 'never',
    drinking: 'never',
    interests: ['Видеоигры', 'Рисование', 'Сериалы', 'Кофе'],
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400'
  },
  {
    email: 'veronika@demo.com',
    name: 'Вероника',
    gender: 'female',
    bio: 'Учитель английского. Люблю путешествовать и практиковать языки. Let\'s talk!',
    birthDate: new Date('2001-04-08'),
    relationshipGoal: 'serious',
    occupation: 'Преподаватель',
    education: 'МГЛУ',
    height: 167,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Путешествия', 'Чтение', 'Кино', 'Кофе'],
    photo: 'https://images.unsplash.com/photo-1464863979621-258859e62245?w=400'
  },
  // Men
  {
    email: 'maksim@demo.com',
    name: 'Максим',
    gender: 'male',
    bio: 'Программист, играю в баскетбол. Ищу девушку с чувством юмора для серьёзных отношений.',
    birthDate: new Date('2001-08-17'),
    relationshipGoal: 'serious',
    occupation: 'Backend разработчик',
    height: 186,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Видеоигры', 'Фитнес', 'Кино', 'Путешествия'],
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
  },
  {
    email: 'nikita@demo.com',
    name: 'Никита',
    gender: 'male',
    bio: 'Фотограф и видеограф. Снимаю красоту вокруг. Давай создадим что-то вместе!',
    birthDate: new Date('2000-11-25'),
    relationshipGoal: 'not_sure',
    occupation: 'Фотограф',
    height: 180,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Фотография', 'Путешествия', 'Кино', 'Музыка'],
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
  },
  {
    email: 'artem@demo.com',
    name: 'Артём',
    gender: 'male',
    bio: 'Фитнес-блогер. Живу спортом и правильным питанием. Ищу активную девушку!',
    birthDate: new Date('2002-04-30'),
    relationshipGoal: 'serious',
    occupation: 'Фитнес-блогер',
    height: 183,
    smoking: 'never',
    drinking: 'never',
    interests: ['Фитнес', 'Бег', 'Готовка', 'Путешествия'],
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400'
  },
  {
    email: 'egor@demo.com',
    name: 'Егор',
    gender: 'male',
    bio: 'Студент-архитектор. Рисую, проектирую, мечтаю. Ищу музу для вдохновения.',
    birthDate: new Date('2003-06-12'),
    relationshipGoal: 'serious',
    occupation: 'Студент',
    education: 'МАРХИ',
    height: 179,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Рисование', 'Кино', 'Музыка', 'Путешествия'],
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400'
  },
  {
    email: 'danil@demo.com',
    name: 'Данил',
    gender: 'male',
    bio: 'Играю на гитаре в группе. Рок - моя религия. Ищу девушку, которая это понимает.',
    birthDate: new Date('2001-09-08'),
    relationshipGoal: 'casual',
    occupation: 'Музыкант',
    height: 177,
    smoking: 'sometimes',
    drinking: 'sometimes',
    interests: ['Рок', 'Музыка', 'Кино', 'Кофе'],
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400'
  },
  {
    email: 'kirill@demo.com',
    name: 'Кирилл',
    gender: 'male',
    bio: 'Предприниматель, развиваю свой стартап. Амбициозный и целеустремлённый. Ищу партнёра по жизни.',
    birthDate: new Date('2000-01-15'),
    relationshipGoal: 'serious',
    occupation: 'Предприниматель',
    education: 'ВШЭ',
    height: 182,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Путешествия', 'Теннис', 'Чтение', 'Вино'],
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
  },
  {
    email: 'roman@demo.com',
    name: 'Роман',
    gender: 'male',
    bio: 'Работаю в банке, но душой я путешественник. Был в 20 странах. Куда поедем вместе?',
    birthDate: new Date('2000-12-03'),
    relationshipGoal: 'serious',
    occupation: 'Финансист',
    height: 181,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Путешествия', 'Горы', 'Фотография', 'Вино'],
    photo: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400'
  },
  {
    email: 'vladislav@demo.com',
    name: 'Владислав',
    gender: 'male',
    bio: 'Врач-стоматолог. Серьёзный подход к жизни и работе. Ищу девушку для создания семьи.',
    birthDate: new Date('2000-05-20'),
    relationshipGoal: 'serious',
    occupation: 'Стоматолог',
    education: 'МГМУ',
    height: 184,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Фитнес', 'Путешествия', 'Готовка', 'Кино'],
    photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400'
  },
  {
    email: 'timur@demo.com',
    name: 'Тимур',
    gender: 'male',
    bio: 'Диджей и продюсер. Создаю музыку и хорошее настроение. Ищу девушку для танцев!',
    birthDate: new Date('2002-02-14'),
    relationshipGoal: 'casual',
    occupation: 'DJ',
    height: 178,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Электронная музыка', 'Танцы', 'Путешествия', 'Кофе'],
    photo: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=400'
  },
  {
    email: 'gleb@demo.com',
    name: 'Глеб',
    gender: 'male',
    bio: 'Геймдизайнер. Создаю игры днём, играю в них ночью. Ищу девушку-геймера!',
    birthDate: new Date('2001-10-28'),
    relationshipGoal: 'not_sure',
    occupation: 'Геймдизайнер',
    height: 175,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Видеоигры', 'Настольные игры', 'Кино', 'Рисование'],
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400'
  },
  {
    email: 'mark@demo.com',
    name: 'Марк',
    gender: 'male',
    bio: 'Тренер по йоге. Помогу найти гармонию. Ищу осознанную девушку для глубоких отношений.',
    birthDate: new Date('2000-08-08'),
    relationshipGoal: 'serious',
    occupation: 'Инструктор йоги',
    height: 180,
    smoking: 'never',
    drinking: 'never',
    interests: ['Йога', 'Медитация', 'Путешествия', 'Веган'],
    photo: 'https://images.unsplash.com/photo-1520409364224-63400afe26e5?w=400'
  },
  {
    email: 'lev@demo.com',
    name: 'Лев',
    gender: 'male',
    bio: 'Актёр театра. Живу на сцене, но хочу найти главную роль в жизни - рядом с тобой.',
    birthDate: new Date('2001-03-21'),
    relationshipGoal: 'serious',
    occupation: 'Актёр',
    education: 'ГИТИС',
    height: 183,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Кино', 'Танцы', 'Музыка', 'Чтение'],
    photo: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=400'
  },
  {
    email: 'anton@demo.com',
    name: 'Антон',
    gender: 'male',
    bio: 'Data Scientist. Анализирую данные, но не людей - хочу узнать тебя лично!',
    birthDate: new Date('2000-07-17'),
    relationshipGoal: 'serious',
    occupation: 'Data Scientist',
    education: 'МФТИ',
    height: 179,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Видеоигры', 'Чтение', 'Кофе', 'Настольные игры'],
    photo: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400'
  },
  {
    email: 'stepan@demo.com',
    name: 'Степан',
    gender: 'male',
    bio: 'Повар в ресторане. Готовлю с любовью. Ищу девушку, которую буду баловать вкусняшками!',
    birthDate: new Date('2002-11-11'),
    relationshipGoal: 'serious',
    occupation: 'Шеф-повар',
    height: 176,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Готовка', 'Путешествия', 'Кино', 'Вино'],
    photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65adc8?w=400'
  },
  {
    email: 'bogdan@demo.com',
    name: 'Богдан',
    gender: 'male',
    bio: 'Сноубордист и экстремал. Зимой - горы, летом - сёрфинг. Ищу напарницу для приключений!',
    birthDate: new Date('2001-01-05'),
    relationshipGoal: 'casual',
    occupation: 'Инструктор',
    height: 182,
    smoking: 'never',
    drinking: 'sometimes',
    interests: ['Горы', 'Путешествия', 'Фитнес', 'Фотография'],
    photo: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=400'
  }
]

async function main() {
  console.log('🌱 Seeding database...')

  // Create interests
  console.log('Creating interests...')
  for (const interest of interests) {
    await prisma.interest.upsert({
      where: { name: interest.name },
      update: {},
      create: interest
    })
  }
  console.log(`✅ Created ${interests.length} interests`)

  // Create ice breakers
  console.log('Creating ice breakers...')
  await prisma.iceBreaker.deleteMany()
  await prisma.iceBreaker.createMany({ data: iceBreakers })
  console.log(`✅ Created ${iceBreakers.length} ice breakers`)

  // Create demo users
  console.log('Creating demo users...')
  const passwordHash = await bcrypt.hash('demo123', 10)

  for (const userData of demoUsers) {
    const { interests: userInterests, photo, ...userDataWithoutInterests } = userData

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userDataWithoutInterests,
        passwordHash,
        isProfileComplete: true,
        isVerified: Math.random() > 0.3, // 70% verified
        preferences: { create: { minAge: 18, maxAge: 25 } },
        photos: {
          create: {
            url: photo || `https://i.pravatar.cc/400?u=${userData.email}`,
            isPrimary: true,
            order: 0
          }
        },
        location: {
          create: {
            latitude: 55.7558 + (Math.random() - 0.5) * 0.2,
            longitude: 37.6173 + (Math.random() - 0.5) * 0.2,
            city: 'Москва',
            country: 'Россия'
          }
        }
      }
    })

    // Add interests
    const interestRecords = await prisma.interest.findMany({
      where: { name: { in: userInterests } }
    })

    for (const interest of interestRecords) {
      await prisma.userInterest.upsert({
        where: {
          userId_interestId: { userId: user.id, interestId: interest.id }
        },
        update: {},
        create: { userId: user.id, interestId: interest.id }
      })
    }

    console.log(`  ✅ Created user: ${user.name}`)
  }

  console.log('\n🎉 Seeding complete!')
  console.log('\nDemo accounts (password: demo123):')
  demoUsers.forEach(u => console.log(`  - ${u.email}`))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
