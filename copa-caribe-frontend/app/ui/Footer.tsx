export default function Footer() {
  return (
    <footer className="flex justify-center bg-blue-950 h-fit w-full p-2">
      <div className="container mx-auto text-center text-white">
        <p>&copy; {new Date().getFullYear()} Copa Caribe. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}