import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' — הבילד עובד מכל נתיב, כולל פתיחה ישירה ושרתים סטטיים
export default defineConfig({
  plugins: [react()],
  base: './',
});
