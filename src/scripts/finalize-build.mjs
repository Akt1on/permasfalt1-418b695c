// src/scripts/finalize-build.mjs
// Финализация билда: копирование статических данных и cleanup
import { cp, mkdir } from 'fs/promises';
import path from 'path';

async function finalizeBuild() {
  console.log('🔧 Финализация сборки...');
  try {
    await mkdir('dist/client/public', { recursive: true });
    await cp('public', 'dist/client/public', { recursive: true });
    console.log('✅ Статические файлы скопированы');
  } catch (e) {
    console.warn('⚠️ Проблема с копированием:', e.message);
  }
  console.log('🎉 Финализация завершена!');
}
finalizeBuild().catch(console.error);