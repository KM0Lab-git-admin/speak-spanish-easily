La causa no es solo “faltan 12px”. Esos 12px existen visualmente entre círculos, pero el layout actual no puede usarlos bien por cómo está montado el componente:

1. En `HomeModules` hay 4 botones fijos.
   - Cada círculo mide `68px`.
   - Pero cada botón no ocupa solo 68px: el label también participa en el ancho del botón.
   - El label más largo, `Ayuntamiento`, con `whitespace-nowrap`, hace que su botón mida bastante más que el círculo.

2. Por eso el cálculo real no es:

```text
4 × 68px = 272px
```

Sino algo más parecido a:

```text
Agenda label + KM0 CHAT label + Ayuntamiento label + Comercios label + gaps
```

El cuello de botella es el texto, no el círculo.

3. Además, la Home portrait y la vista aislada no están usando exactamente el mismo envoltorio.
   - En `HomeContent.tsx`, la sección de “Accesos rápidos” sigue con `px-6 py-6`.
   - En landscape ya está con `px-[10px] py-[10px]`.
   - Eso significa que portrait pierde 48px internos solo por padding de la sección, antes de que `HomeModules` pinte nada.

4. Dentro de `HomeModules` todavía hay otro `px-3`.
   - Si el contenedor visible mide ~350px, la fila útil pasa a ~326px.
   - Si la sección Home además usa `px-6`, el ancho útil baja todavía más.

5. `justify-around` reparte espacio alrededor de cada botón, pero no “recupera” espacio cuando un label ancho empuja el ancho real del botón. En un carril justo, esa distribución puede dejar los círculos con hueco aparente mientras los labels se pisan o se recortan.

Conclusión: visualmente parece que hay hueco entre iconos, pero el navegador está maquetando por el ancho completo de cada botón, y ese ancho lo agrandan los labels. El problema viene de la combinación:

```text
sección portrait con px-6
+ HomeModules con px-3
+ labels nowrap
+ botones cuyo ancho depende del label
+ justify-around
```

Plan de corrección si quieres que lo implemente:

1. Igualar el wrapper de “Accesos rápidos” en portrait al de landscape:
   - Cambiar la sección de `HomeContent.tsx` a `space-y-3 px-[10px] py-[10px]`, igual que pediste para landscape.

2. Hacer que cada módulo tenga un ancho fijo común, no dependiente del label:
   - Por ejemplo `w-[78px]` o `w-[80px]` para cada botón.
   - El círculo seguirá centrado dentro.
   - Así `Ayuntamiento` no ensancha su botón ni desplaza a los demás.

3. Cambiar la fila de `justify-around` a una distribución determinista:
   - `justify-between gap-0` o `grid grid-cols-4`.
   - Con 4 columnas iguales, el componente se verá igual en Home y en aislado.

4. Permitir que el texto quepa sin cortar:
   - Mantener font pequeño.
   - Quitar dependencia de `max-w-[120%]`.
   - Usar `max-w-full` y, si hace falta, permitir 2 líneas solo para labels largos.

Esto atacaría la causa real: el ancho variable de los botones por el label y los paddings distintos del contenedor.