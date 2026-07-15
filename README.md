# Portfolio Frontend

Proyecto frontend del portfolio hecho con React, TypeScript, Vite y Tailwind CSS.

## Navbar responsive

La navbar esta pensada para funcionar de dos formas distintas:

- En desktop queda fija a la izquierda.
- En tablet y mobile se transforma en un menu hamburguesa arriba de la pantalla.

Los archivos principales son:

- `src/components/header/Header.tsx`
- `src/components/header/header.css`
- `src/App.css`

## Estructura del header

En `Header.tsx` se usa un estado local:

```tsx
const [isMenuOpen, setIsMenuOpen] = useState(false)
```

Ese estado controla si el menu esta abierto o cerrado.

El boton hamburguesa cambia su clase segun el estado:

```tsx
className={`menu-toggle ${isMenuOpen ? 'menu-open' : ''}`}
```

Y el `nav` tambien cambia su clase:

```tsx
<nav id="main-navigation" className={isMenuOpen ? 'nav-open' : ''}>
```

Cuando se hace click en un link del menu, se ejecuta `closeMenu`, que cierra la navbar automaticamente.

## Desktop

En pantallas grandes, el header usa:

```css
.header {
  position: fixed;
  inset: 0 auto 0 0;
  width: 240px;
}
```

Esto deja el header fijo a la izquierda. El contenido principal se corre hacia la derecha desde `App.css` usando:

```css
.page-content {
  margin-left: 240px;
}
```

## Tablet y mobile

Desde `1024px` hacia abajo, el header cambia:

```css
@media (max-width: 1024px) {
  .header {
    position: sticky;
    top: 0;
    z-index: 1000;
    width: 100%;
  }
}
```

Esto hace que el header quede arriba, visible al hacer scroll, sin tapar permanentemente el contenido del `main`.

En ese mismo breakpoint aparece el boton hamburguesa:

```css
.menu-toggle {
  display: flex;
}
```

## Animacion hamburguesa a X

El boton tiene tres `span`, que representan las tres lineas del icono hamburguesa.

Cuando el menu esta cerrado, se ven las tres lineas normales.

Cuando el menu esta abierto, se agrega la clase `.menu-open`:

```css
.menu-toggle.menu-open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.menu-toggle.menu-open span:nth-child(2) {
  opacity: 0;
}

.menu-toggle.menu-open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}
```

Resultado:

- La primera linea baja y rota.
- La segunda linea desaparece.
- La tercera linea sube y rota.
- Las dos lineas visibles forman una X.

La transicion se logra con:

```css
transition: opacity 0.2s ease, transform 0.25s ease;
```

## Overlay del nav mobile

En tablet y mobile, el `nav` se comporta como un overlay:

```css
.header nav {
  position: fixed;
  top: 77px;
  left: 0;
  z-index: 999;
  width: 100%;
  height: calc(100svh - 77px);
}
```

Detalles importantes:

- `z-index: 999` hace que el nav quede por arriba del contenido.
- El header usa `z-index: 1000`, por eso la X queda visible encima del nav.
- `top: 77px` evita que el overlay tape el header.
- `height: calc(100svh - 77px)` hace que ocupe el alto disponible debajo del header.

## Opacidad y blur

El nav usa un fondo con transparencia:

```css
background: rgba(255, 255, 255, 0.86);
backdrop-filter: blur(8px);
```

Eso permite que el contenido del `main` se vea suavemente por debajo del menu.

Para modo oscuro se cambia el fondo:

```css
@media (prefers-color-scheme: dark) and (max-width: 1024px) {
  .header nav {
    background: rgba(22, 23, 29, 0.86);
  }
}
```

## Animacion de apertura del nav

Cuando el nav esta cerrado:

```css
opacity: 0;
visibility: hidden;
pointer-events: none;
transform: translateY(-12px);
```

Cuando esta abierto:

```css
.header nav.nav-open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateY(0);
}
```

La animacion combina:

- Opacidad.
- Movimiento vertical.
- Cambio de visibilidad.

La transicion esta definida asi:

```css
transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease;
```

## Animacion de escritura del hero

El titulo principal del hero usa una animacion tipo maquina de escribir.

En `Main.tsx`, el `h1` tiene la clase `typing-title`:

```tsx
<h1 className="typing-title ...">
  Hola, soy Nico Dev
</h1>
```

La animacion esta definida en `src/components/main/Main.css`.

La idea principal es ocultar el texto con `overflow: hidden` y revelar el ancho poco a poco:

```css
.typing-title {
  display: inline-block;
  width: 18ch;
  overflow: hidden;
  white-space: nowrap;
  padding-right: 6px;
  border-right: 3px solid currentColor;
  animation: typing 2.2s steps(18) both, blink 0.75s step-end infinite;
}
```

Detalles importantes:

- `display: inline-block` permite animar el ancho del texto.
- `width: 18ch` define el ancho final aproximado del titulo.
- `overflow: hidden` es lo que esconde el texto mientras se escribe.
- `white-space: nowrap` evita que el titulo salte a otra linea durante la animacion.
- `padding-right: 6px` separa el cursor del texto.
- `border-right` funciona como cursor.

La animacion que revela el texto es:

```css
@keyframes typing {
  from {
    width: 0;
  }
}
```

Como `.typing-title` ya tiene `width: 18ch`, el navegador anima desde `width: 0` hasta `width: 18ch`.

La parte `steps(18)` hace que el movimiento sea por saltos, parecido a letras apareciendo una por una:

```css
animation: typing 2.2s steps(18) both;
```

Para ajustar la animacion:

- Si el texto es mas largo, aumenta `width`.
- Si queres que se escriba mas lento, aumenta `2.2s`.
- Si queres mas saltos, aumenta `steps(18)`.
- Si el cursor queda pegado al texto, aumenta `padding-right`.

El cursor parpadea con esta animacion:

```css
@keyframes blink {
  50% {
    border-color: transparent;
  }
}
```

Y se aplica junto con la animacion de escritura:

```css
animation: typing 2.2s steps(18) both, blink 0.75s step-end infinite;
```

En mobile hay un ajuste para que el titulo no se corte:

```css
@media (max-width: 640px) {
  .typing-title {
    width: 18ch;
    max-width: 100%;
    font-size: 2rem;
  }
}
```

## Rutas con React Router

El proyecto usa `react-router-dom` para separar la pagina principal del portfolio y la pagina de login.

La idea quedo asi:

- `/` muestra la pagina `Home`.
- `/login` muestra la pagina `Login`.

## Paso 1: envolver la app con BrowserRouter

En `src/main.tsx` se importa `BrowserRouter`:

```tsx
import { BrowserRouter } from 'react-router-dom'
```

Y se envuelve `App`:

```tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

`BrowserRouter` permite que React maneje las rutas del navegador sin recargar toda la pagina.

## Paso 2: definir las rutas en App

En `src/App.tsx` se importan `Routes` y `Route`:

```tsx
import { Route, Routes } from 'react-router-dom'
```

Tambien se importan las paginas:

```tsx
import Home from './pages/Home'
import Login from './pages/Login'
```

Luego se definen las rutas:

```tsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}
```

Esto significa:

- Si la URL es `/`, se renderiza `<Home />`.
- Si la URL es `/login`, se renderiza `<Login />`.

## Paso 3: crear la pagina Home

La pagina `Home` vive en `src/pages/Home.tsx`.

Esta pagina contiene el layout principal del portfolio:

```tsx
function Home() {
  return (
    <div className="App">
      <Header />
      <div className="page-content">
        <Main />
        <Footer />
      </div>
    </div>
  )
}
```

El header queda separado del contenido principal porque en desktop esta fijo a la izquierda.

`Main` y `Footer` van dentro de `.page-content` para que queden a la derecha del header en desktop, y debajo del header en mobile/tablet.

## Paso 4: crear la pagina Login

La pagina `Login` vive en `src/pages/Login.tsx`.

Es una pagina aparte, por eso no usa `Header`, `Main` ni `Footer`.

Ejemplo de estructura:

```tsx
function Login() {
  return (
    <main className="login-page">
      <section className="login-panel">
        <Link className="back-home" to="/">
          Volver al portfolio
        </Link>

        <div className="login-card">
          <h1>Sign in</h1>
          <form className="login-form">
            ...
          </form>
        </div>
      </section>
    </main>
  )
}
```

El link `Volver al portfolio` usa `Link` para navegar a `/` sin recargar la pagina.

## Paso 5: cambiar los links del header

Antes, `Sign in` y `Sign up` eran links normales con `href`.

Ahora usan `Link` de React Router:

```tsx
import { Link } from 'react-router-dom'
```

Y dentro del nav:

```tsx
<Link to="/login" onClick={closeMenu}>
  Sign in
</Link>

<Link className="signup-link" to="/login" onClick={closeMenu}>
  Sign up
</Link>
```

`to="/login"` indica a que ruta queremos navegar.

`onClick={closeMenu}` mantiene el comportamiento mobile: cuando se toca el link desde el menu hamburguesa, el menu se cierra automaticamente.

## Por que se veia en blanco

La pagina `Login.tsx` estaba vacia.

Cuando React intentaba mostrar esa pagina, no habia nada para renderizar. Por eso se veia todo blanco.

La solucion fue:

- Darle contenido a `Login.tsx`.
- Configurar rutas en `App.tsx`.
- Envolver la app con `BrowserRouter`.
- Cambiar los links del header para navegar a `/login`.

## Comandos utiles

Instalar dependencias:

```bash
npm install
```

Levantar el servidor de desarrollo:

```bash
npm run dev
```

Verificar TypeScript:

```bash
npx tsc -b
```

Build de produccion:

```bash
npm run build
```

# Variables de producción y SEO

El build de producción prerenderiza la home y cada proyecto público. Requiere estas variables:

```env
VITE_API_URL=https://api.ejemplo.com
SITE_URL=https://nicosdev.com.ar
```

`VITE_API_URL` debe ser accesible durante el build de Vercel. Si la API no responde, el build falla para evitar publicar páginas o un sitemap incompletos. Cada alta o edición de un proyecto requiere un nuevo deploy.

Comandos disponibles:

```bash
npm run build:client  # build SPA sin consultar la API
npm run build         # build de producción con prerender y sitemap
```
