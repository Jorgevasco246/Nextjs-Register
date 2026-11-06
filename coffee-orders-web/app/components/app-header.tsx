import Link from "next/link";

export const AppHeader = () => {
  return (
    <header className="site-header">
      <p className="brand">Coffee Orders</p>
      <nav aria-label="Navegación principal">
        <Link href="/orders">Inicio</Link>
        <Link href="/">Pedidos</Link>
      </nav>
    </header>
  );
}