import type { Profile, Service, Message } from './models';

export const profiles: Profile[] = [
  {
    id: "me",
    name: "Александр Морозов",
    role: "Мастер по дому",
    about:
      "Помогаю с ремонтом и бытовыми задачами. Обсудим детали и найдём удобное время.",
    location: "Москва",
  },
  {
    id: "anna",
    name: "Анна Соколова",
    role: "Преподаватель английского",
    about:
      "Объясняю сложное простыми словами. Индивидуальные занятия для взрослых и подростков.",
    location: "Онлайн",
  },
  {
    id: "maria",
    name: "Мария Волкова",
    role: "Специалист по уборке",
    about: "Бережная уборка и внимание к каждой детали.",
    location: "Москва",
  },
];

const photo = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

export const services: Service[] = [
  {
    id: "english",
    title: "Английский, который пригодится в жизни",
    description:
      "Разговорная практика, понятная грамматика и программа под ваши цели. Первое занятие посвятим знакомству и определению уровня.",
    category: "Обучение",
    price: 1500,
    unit: "hour",
    image: photo("photo-1434030216411-0b793f4b4173"),
    ownerId: "anna",
    location: "Онлайн",
  },
  {
    id: "repair",
    title: "Мастер на час: всё снова работает",
    description:
      "Установлю полки, соберу мебель и помогу с мелким ремонтом. Стоимость материалов согласуем отдельно до начала работы.",
    category: "Помощь по дому",
    price: 1200,
    unit: "hour",
    image: photo("photo-1581578731548-c64695cc6952"),
    ownerId: "me",
    location: "Москва",
  },
  {
    id: "clean",
    title: "Чистый дом без лишних хлопот",
    description:
      "Поддерживающая уборка квартиры: кухня, комнаты и санузел. Объём работ и необходимые средства обсудим заранее.",
    category: "Уборка и клининг",
    price: 3500,
    unit: "service",
    image: photo("photo-1581578731548-c64695cc6952"),
    ownerId: "maria",
    location: "Москва",
  },
  {
    id: "plumber",
    title: "Сантехника: установка и мелкий ремонт",
    description:
      "Заменю смеситель, подключу стиральную машину и устраню небольшую протечку. Перед выездом уточним задачу по фотографии.",
    category: "Ремонт и строительство",
    price: 2000,
    unit: "service",
    image: photo("photo-1504148455328-c376907d081c"),
    ownerId: "me",
    location: "Москва",
  },
  {
    id: "math",
    title: "Математика без страха и пробелов",
    description:
      "Разберём школьную программу, подготовимся к контрольной и научимся решать задачи самостоятельно. Занятия в спокойном темпе.",
    category: "Обучение",
    price: 1300,
    unit: "hour",
    image: photo("photo-1456513080510-7bf3a84b82f8"),
    ownerId: "anna",
    location: "Онлайн",
  },
  {
    id: "furniture",
    title: "Аккуратная сборка вашей мебели",
    description:
      "Соберу шкаф, комод или рабочий стол по инструкции производителя. Инструменты привезу с собой, упаковку сложу после работы.",
    category: "Помощь по дому",
    price: 2500,
    unit: "service",
    image: photo("photo-1504148455328-c376907d081c"),
    ownerId: "me",
    location: "Москва",
  },
];

export const demo = process.env.NEXT_PUBLIC_DATA_MODE !== "http";

const prefix = "rabotyagi:";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(prefix + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(prefix + key, JSON.stringify(value));
  } catch {
    throw new Error(
      "Не удалось сохранить данные в браузере. Освободите место и повторите.",
    );
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error("Не задан адрес API");
  const response = await fetch(`${base.replace(/\/$/, "")}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!response.ok)
    throw new Error(
      `Сервер недоступен или запрос отклонён (${response.status})`,
    );
  return response.json() as Promise<T>;
}

export const repository = {
  services: () =>
    demo
      ? Promise.resolve(read<Service[]>("services", services))
      : request<Service[]>("/services/"),
  profiles: () =>
    demo
      ? Promise.resolve(read<Profile[]>("profiles", profiles))
      : request<Profile[]>("/profiles/"),
  async saveService(value: Service) {
    if (!demo)
      return request<Service>(
        `/services/${value.id === "new" ? "" : value.id + "/"}`,
        {
          method: value.id === "new" ? "POST" : "PATCH",
          body: JSON.stringify(value),
        },
      );
    const records = await this.services();
    const result = {
      ...value,
      id: value.id === "new" ? crypto.randomUUID() : value.id,
    };
    write("services", [
      result,
      ...records.filter((item) => item.id !== result.id),
    ]);
    return result;
  },
  async saveProfile(value: Profile) {
    if (!demo)
      return request<Profile>(`/profiles/${value.id}/`, {
        method: "PATCH",
        body: JSON.stringify(value),
      });
    const records = await this.profiles();
    write(
      "profiles",
      records.map((item) => (item.id === value.id ? value : item)),
    );
    return value;
  },
  messages: (peer: string) =>
    demo
      ? Promise.resolve(read<Message[]>(`messages:${peer}`, []))
      : request<Message[]>(`/conversations/${peer}/messages/`),
  async sendMessage(peer: string, text: string) {
    if (!demo)
      return request<Message>(`/conversations/${peer}/messages/`, {
        method: "POST",
        body: JSON.stringify({ text }),
      });
    const message = {
      id: crypto.randomUUID(),
      text,
      senderId: "me",
      createdAt: new Date().toISOString(),
    };
    write(`messages:${peer}`, [...(await this.messages(peer)), message]);
    return message;
  },
};
