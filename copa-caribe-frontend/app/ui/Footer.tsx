export default function Footer() {
  return (
    <footer className="flex justify-center bg-blue-300 h-fit p-2">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Copa Caribe. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}