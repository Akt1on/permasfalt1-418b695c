// src/lib/static-data.ts
// Утилиты для работы со статическими данными (быстрая загрузка)

export interface Project {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  // ... другие поля
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price?: string;
}

// Импорт статических JSON (Vite обрабатывает их как модули)
export const projects = (await import('../../public/data/projects.json')).default as Project[];
export const services = (await import('../../public/data/services.json')).default as Service[];
export const reviews = (await import('../../public/data/reviews.json')).default;
export const siteSettings = (await import('../../public/data/settings.json')).default;
