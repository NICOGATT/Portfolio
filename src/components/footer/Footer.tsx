import nicoDevLogo from '../../assets/logo2.png';
import './footer.css';
import { FaWhatsapp, FaInstagram, FaTiktok, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="grid grid-cols-1 gap-10 px-6 py-10 text-center md:grid-cols-3 md:text-left">
      <div className="flex flex-col items-center justify-center text-center">
        <img src={nicoDevLogo} alt="Nico Dev Logo" className="w-40 sm:w-48" />
        <p className="mt-3 text-slate-100">Full Stack Developer</p>
        <p className="mt-2 max-w-56 text-sm text-slate-300">
          Building scalable web applications & mobile applications
        </p>
      </div>

      <div className="flex flex-col items-center md:items-start">
        <h3 className="titulo-footer">Links rápidos</h3>
        <ul className="grid gap-2">
          <li>
            <a href="#home" className="footer-link">Inicio</a>
          </li>
          <li>
            <a href="#about" className="footer-link">Sobre mi</a>
          </li>
          <li>
            <a href="#projects" className="footer-link">Proyectos</a>
          </li>
        </ul>
      </div>

      <div className="flex flex-col items-center md:items-start">
        <h3 className="titulo-footer">Contactos</h3>
        <ul className="grid gap-2">
          <li className="flex items-center">
            <FaWhatsapp 
              className="me-2 h-9 w-9 rounded-xl bg-green-500 p-1 text-2xl text-white"
            />
            <a href="http://wa.me/5491136392183" className="redes" target="_blank" rel="noreferrer">Whatsapp</a>
          </li>
          <li className="flex items-center">
            <FaInstagram
              className="instagram-icon me-2 h-9 w-9 rounded-xl p-1 text-2xl text-white"
            />
            <a 
              href="https://www.instagram.com/nico_sdevs/"
              className="redes"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </li>
          <li className="flex items-center">
            <FaTiktok
              className="tik-tok me-2 h-9 w-9 rounded-xl p-1 text-2xl text-white"
            />
            <a 
              href="https://www.tiktok.com/@nicodev31?_r=1&_t=ZS-96r4L058waY" 
              target="_blank"
              className="redes"
              rel="noreferrer"
            >
                Tiktok
            </a>
          </li>
          <li className="flex items-center">
            <FaLinkedin
              className="me-2 h-9 w-9 rounded-xl bg-blue-500 p-1 text-2xl text-white"
            />
            <a 
              href="https://www.linkedin.com/in/nicol%C3%A1s-mat%C3%ADas-andr%C3%A9-gatti-26aa79272/"
              className="redes"
              target="_blank"
              rel="noreferrer"
            >
              Linkedin
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer
