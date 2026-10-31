import { z } from 'zod';

export type Service = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  unit: "hour" | "service";
  image: string;
  ownerId: string;
  location: string;
};

export type Profile = {
  id: string;
  avatar?: string;
  name: string;
  role: string;
  about: string;
  location: string;
};

export type Message = {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
};

export const categories = [
  "Все услуги",
  "Обучение",
  "Ремонт и строительство",
  "Уборка и клининг",
  "Красота и здоровье",
  "IT и дизайн",
  "Помощь по дому",
];

export const serviceSchema = z.object({
  title: z.string().min(5, "Минимум 5 символов").max(120),
  description: z.string().min(20, "Минимум 20 символов").max(5000),
  category: z.string().min(1, "Выберите категорию"),
  price: z.number().positive("Цена должна быть больше нуля").max(10000000),
  unit: z.enum(["hour", "service"]),
  image: z.string().min(1, "Добавьте изображение"),
  location: z.string().min(2, "Укажите город или «Онлайн»"),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

export const profileSchema = z.object({
  avatar: z.string().optional(),
  name: z.string().min(2, "Минимум 2 символа").max(100),
  role: z.string().min(2, "Укажите специализацию").max(100),
  about: z.string().min(20, "Минимум 20 символов").max(2000),
  location: z.string().min(2, "Укажите город").max(100),
});
