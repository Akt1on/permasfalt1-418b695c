// src/scripts/generate-static.ts
// ТОП-УРОВЕНЬ: Генератор статических данных для мгновенной загрузки сайта

import { createClient } from '@supabase/supabase-js';
import { writeFile, mkdir } from 'fs/promises';
import sharp from 'sharp';
import path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Определяем, нужно ли оптимизировать изображения (локально — да, на Vercel Hobby — пропускаем)
const shouldOptimizeImages = process.env.NODE_ENV !== 'production' || 
                           process.env.VERCEL_ENV === 'development' ||
                           process.env.OPTIMIZE_IMAGES === 'true';

async function optimizeAndSaveImage(imageUrl: string, outputPath: string): Promise<string> {
  if (!imageUrl || !shouldOptimizeImages) {
    console.log(`⏭️ Пропускаем оптимизацию изображения`);
    return imageUrl;
  }
  
  try {
    const response = await fetch(imageUrl);
    const buffer = Buffer.from(await response.arrayBuffer());

    await sharp(buffer)
      .resize(1200, null, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(outputPath);

    console.log(`✅ Оптимизировано: ${path.basename(outputPath)}`);
    return `/images/projects/${path.basename(outputPath)}`;
  } catch (e) {
    console.warn(`⚠️ Не удалось оптимизировать ${imageUrl}`, e);
    return imageUrl;
  }
}

export async function generateStaticData() {
  console.log('🚀 Запуск генерации статических данных...');
  console.log(`📸 Оптимизация изображений: ${shouldOptimizeImages ? 'ВКЛЮЧЕНА' : 'ОТКЛЮЧЕНА (для скорости на Vercel)'}`);

  // Получаем все актуальные данные
  const [servicesRes, projectsRes, reviewsRes, settingsRes] = await Promise.all([
    supabase.from('services').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('projects').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('reviews').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('site_settings').select('*').single(),
  ]);

  // Создаём директории
  await mkdir('public/data', { recursive: true });
  await mkdir('public/images/projects', { recursive: true });

  // Сохраняем JSON данные
  await writeFile('public/data/services.json', JSON.stringify(servicesRes.data || [], null, 2));
  await writeFile('public/data/projects.json', JSON.stringify(projectsRes.data || [], null, 2));
  await writeFile('public/data/reviews.json', JSON.stringify(reviewsRes.data || [], null, 2));
  await writeFile('public/data/settings.json', JSON.stringify(settingsRes.data || {}, null, 2));

  // Оптимизируем изображения ТОЛЬКО если разрешено
  if (shouldOptimizeImages) {
    console.log('🖼️ Начинаем оптимизацию изображений...');
    for (const project of (projectsRes.data || [])) {
      if (project.cover_image) {
        const filename = `${project.id || Date.now()}.webp`;
        const newPath = await optimizeAndSaveImage(project.cover_image, `public/images/projects/${filename}`);
        project.cover_image = newPath;
      }
    }
    await writeFile('public/data/projects.json', JSON.stringify(projectsRes.data || [], null, 2));
  } else {
    console.log('⏭️ Изображения не оптимизируются на этом билде — используются оригинальные ссылки');
  }

  console.log('🎉 Статические данные успешно сгенерированы!');
  console.log(`   → ${projectsRes.data?.length || 0} проектов | ${servicesRes.data?.length || 0} услуг`);
}
