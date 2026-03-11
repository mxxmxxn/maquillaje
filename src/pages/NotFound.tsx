import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-secondary/40 px-6 text-center">
      <div>
        <h1 className="text-6xl font-semibold">404</h1>
        <p className="mt-2 text-muted-foreground">La pagina que buscas no existe.</p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-white">
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
