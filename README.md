# Wellness App - Aplicación de Bienestar Universitario

Una aplicación web moderna desarrollada con React y Vite que combina inteligencia artificial, gamificación y comunidad para apoyar el bienestar de estudiantes universitarios.

## 🌟 Características Principales

### 🤖 Chatbot IA Empático
- Conversaciones inteligentes sobre bienestar emocional
- Detección automática del estado de ánimo
- Recomendaciones personalizadas
- Respuestas categorizadas (académico, bienestar, motivación)

### 🎮 Gamificación del Autocuidado
- Mascota virtual que responde al cuidado personal
- Sistema de objetivos diarios
- Racha de días consecutivos
- Recompensas por completar actividades de bienestar

### 📊 Dashboard de Bienestar
- Seguimiento de métricas de salud mental
- Visualización interactiva de datos
- Recomendaciones basadas en el estado actual
- Tendencias semanales y análisis

### 📅 Calendario Inteligente
- Predicción de carga mental
- Integración de eventos académicos y de bienestar
- Recomendaciones automáticas de descanso
- Alertas preventivas de estrés

### 👥 Comunidad Anónima
- Foros temáticos moderados por IA
- Intercambio de consejos entre estudiantes
- Sistema de validación de contenido positivo
- Categorías especializadas (sueño, concentración, ansiedad, etc.)

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Styling**: CSS Variables + CSS-in-JS
- **Charts**: Recharts (para futuras visualizaciones)
- **Date Handling**: date-fns

## 🎨 Personalización de Marca

La aplicación está diseñada para ser fácilmente personalizable. Todos los colores, tipografías y elementos de marca se pueden modificar desde el archivo `src/index.css`:

### Colores Principales
```css
:root {
  /* Colores de marca - Personaliza estos valores */
  --color-primary: #3B82F6;
  --color-secondary: #10B981;
  --color-accent: #F59E0B;
  
  /* Colores de estado */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
}
```

### Tipografía
```css
:root {
  --font-family-primary: 'Inter', sans-serif;
  --font-size-base: 1rem;
  /* Más variables de tipografía... */
}
```

### Espaciado y Bordes
```css
:root {
  --spacing-4: 1rem;
  --radius-lg: 0.75rem;
  /* Sistema completo de espaciado... */
}
```

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 16+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]
cd wellness-app

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Linting del código
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Layout.tsx      # Layout principal
│   └── Navigation.tsx  # Navegación responsive
├── contexts/           # Contextos de React
│   └── WellnessContext.tsx  # Estado global de bienestar
├── pages/             # Páginas principales
│   ├── Home.tsx       # Página de inicio
│   ├── Chatbot.tsx    # Chat con IA
│   ├── Dashboard.tsx  # Dashboard de métricas
│   ├── Calendar.tsx   # Calendario inteligente
│   └── Community.tsx  # Comunidad anónima
├── App.tsx           # Componente raíz
├── main.tsx         # Punto de entrada
├── index.css        # Estilos globales y variables
└── App.css         # Estilos específicos de la app
```

## 🎯 Funcionalidades Detalladas

### Contexto de Bienestar (`WellnessContext`)
Maneja todo el estado relacionado con:
- Métricas de bienestar (ánimo, energía, estrés, sueño, etc.)
- Estado de la mascota virtual
- Objetivos diarios y progreso
- Racha de días consecutivos

### Navegación Responsive
- **Mobile**: Navegación inferior con tabs
- **Desktop**: Sidebar lateral fijo
- Transiciones suaves entre páginas

### Sistema de Recomendaciones IA
El chatbot analiza el input del usuario y proporciona:
- Respuestas contextuales basadas en palabras clave
- Consejos académicos (técnica Pomodoro, organización)
- Apoyo emocional personalizado
- Tips de bienestar y autocuidado

### Gamificación
- **Mascota Virtual**: Felicidad y salud que decaen con el tiempo
- **Objetivos Diarios**: Categorizados por tipo (académico, bienestar, social)
- **Sistema de Recompensas**: Completar objetivos alimenta y mejora la mascota

## 🔧 Personalización Avanzada

### Modificar Respuestas del Chatbot
Edita el objeto `botResponses` en `src/pages/Chatbot.tsx`:

```typescript
const botResponses = {
  greeting: [
    "¡Hola! ¿Cómo te sientes hoy?",
    // Agregar más respuestas...
  ],
  // Más categorías...
};
```

### Agregar Nuevas Métricas de Bienestar
1. Actualiza la interfaz `WellnessData` en `src/contexts/WellnessContext.tsx`
2. Agrega la nueva métrica al array `metrics` en `src/pages/Dashboard.tsx`
3. Incluye el ícono y color correspondiente

### Personalizar Categorías de Comunidad
Modifica el array `interests` en `src/pages/Community.tsx`:

```typescript
const interests: Interest[] = [
  {
    id: 'nueva-categoria',
    name: 'Nueva Categoría',
    icon: <IconComponent size={20} />,
    color: '#COLOR',
    members: 0
  },
  // Más categorías...
];
```

## 🌐 Despliegue

### Build de Producción
```bash
npm run build
```

### Despliegue en Netlify/Vercel
1. Conecta tu repositorio
2. Configura el comando de build: `npm run build`
3. Directorio de salida: `dist`

### Variables de Entorno (Futuro)
Para integraciones futuras, crea un archivo `.env`:
```
VITE_API_URL=https://tu-api.com
VITE_AI_API_KEY=tu-clave-api
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico o preguntas sobre personalización:
- Abre un issue en GitHub
- Consulta la documentación en línea
- Contacta al equipo de desarrollo

---

**Desarrollado con ❤️ para el bienestar estudiantil universitario**