# Tour FTU (First Time User) - Documentación

## Resumen

Se ha implementado un tour interactivo para guiar a los nuevos usuarios a través de los 4 pasos principales del flujo de trabajo de la aplicación de ventas:

1. **Seleccionar tienda** - El usuario debe seleccionar la sucursal donde trabajará
2. **Seleccionar cliente** - Buscar y seleccionar un cliente existente o crear uno nuevo
3. **Gestionar cotizaciones** - Ver cotizaciones existentes o crear una nueva
4. **Agregar productos** - Añadir productos a la cotización

## Archivos Creados/Modificados

### Nuevos Componentes

1. **`/src/components/FTUTour.tsx`**
   - Componente principal del tour
   - Maneja la lógica de navegación entre pasos
   - Controla el overlay de resaltado
   - Detecta automáticamente cuando se completan los pasos

2. **`/src/components/TourRestartButton.tsx`**
   - Botón para reiniciar el tour
   - Solo visible en modo desarrollo
   - Limpia el localStorage para permitir reiniciar el tour

### Archivos Modificados

1. **`/src/components/Button.tsx`**
   - Agregado soporte para props adicionales HTML
   - Permite pasar atributos como `data-tour`

2. **`/src/components/Bienvenida.tsx`**
   - Agregado `data-tour="store-selector"` al select de tiendas

3. **`/src/components/Cliente.tsx`**
   - Agregado `data-tour="client-search"` al input de búsqueda de clientes

4. **`/src/components/cotizacion/CotizacionBlocked.tsx`**
   - Agregado `data-tour="quotation-section"` al contenedor principal

5. **`/src/components/cotizacion/CotizacionView.tsx`**
   - Agregado `data-tour="quotation-section"` al contenedor principal

6. **`/src/components/ProductTable.tsx`**
   - Agregado `data-tour="add-product-button"` al botón "Agregar Producto"

7. **`/src/app/page.tsx`**
   - Integrado el componente FTUTour
   - Agregado el botón de reinicio para desarrollo

## Cómo Funciona

### Inicialización Automática
- El tour se inicia automáticamente la primera vez que un usuario visita la aplicación
- Se verifica `localStorage.getItem('ftu-tour-completed')` para determinar si ya se completó

### Detección de Pasos Completados
El tour monitorea el estado global de la aplicación (`CotizacionFlow`) para detectar:
- **Paso 1**: `state.sucursalId` está definido
- **Paso 2**: `state.clienteRut` está definido  
- **Paso 3**: `state.cotizacionId` está definido O `state.isCreating` es true
- **Paso 4**: `state.productos.length > 0`

### Navegación Inteligente
- Los usuarios solo pueden avanzar a pasos que cumplan las condiciones requeridas
- El tour avanza automáticamente cuando se completa un paso
- Se puede navegar libremente entre pasos ya desbloqueados

### Resaltado Visual
- Utiliza un overlay semitransparente para destacar el elemento actual
- El elemento resaltado queda visible mientras el resto se oscurece
- Scroll automático al elemento objetivo

## Personalización

### Agregar Nuevos Pasos

Para agregar un nuevo paso al tour, edita el array `tourSteps` en `FTUTour.tsx`:

```tsx
{
    id: 'nuevo-paso',
    title: 'Nuevo Paso: Título',
    description: 'Descripción de lo que debe hacer el usuario',
    targetSelector: '[data-tour="nuevo-elemento"]',
    position: 'bottom',
    isCompleted: false, // lógica de completado
    requiredCondition: () => true // condición para habilitar
}
```

Luego agrega el atributo `data-tour="nuevo-elemento"` al componente HTML correspondiente.

### Modificar Condiciones de Completado

Las condiciones se evalúan en tiempo real basándose en el estado de `CotizacionFlow`. Para cambiar una condición, modifica la propiedad `isCompleted` del paso correspondiente.

### Cambiar Posición del Tour

Modifica la propiedad `position` de cada paso: `'top' | 'bottom' | 'left' | 'right'`

## Controles del Usuario

- **Siguiente/Anterior**: Navegar entre pasos
- **Saltar**: Completar el tour sin terminar todos los pasos  
- **Puntos de navegación**: Hacer clic en los indicadores para ir directamente a un paso
- **✕**: Cerrar el tour completamente

## Desarrollo

### Reiniciar Tour
En modo desarrollo, aparece un botón "Reiniciar Tour" en la esquina superior derecha que:
1. Borra `localStorage.getItem('ftu-tour-completed')`
2. Reinicia el componente del tour

### Testing
```bash
# Para probar el tour desde cero
localStorage.removeItem('ftu-tour-completed')
# Luego recargar la página
```

## Consideraciones Técnicas

- **Performance**: El tour usa `ResizeObserver` para actualizar posiciones dinámicamente
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Accesibilidad**: Incluye títulos descriptivos y navegación por teclado
- **Estado persistente**: Usa localStorage para recordar si ya se completó
- **Integración**: No interfiere con la funcionalidad existente de la aplicación

## Próximas Mejoras

1. **Animaciones**: Agregar transiciones más suaves entre pasos
2. **Configuración**: Permitir deshabilitar el tour desde configuración
3. **Analytics**: Tracking de qué pasos completó cada usuario
4. **Personalización**: Permitir al usuario elegir cuándo iniciar el tour
5. **Multi-idioma**: Soporte para múltiples idiomas
