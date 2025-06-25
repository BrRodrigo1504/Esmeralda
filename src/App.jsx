import { useEffect } from 'react';
import Header from './components/Header';
import PromoBars from './components/PromoBars';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import HowItWorks from './components/HowItWorks';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/ChatbotNew';
import Cart from './components/Cart';
import { CartProvider } from './contexts/CartContext';
import './App.css';

function App() {
  useEffect(() => {
    // Smooth scroll para links de navegação
    const handleSmoothScroll = (e) => {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const headerHeight = 80; // Altura do header fixo
          const targetPosition = targetElement.offsetTop - headerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    };

    // Adicionar event listeners para todos os links de navegação
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', handleSmoothScroll);
    });

    // Cleanup
    return () => {
      navLinks.forEach(link => {
        link.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

   return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <PromoBars />
        <Header />
        <Hero />
        <Catalog />
        <HowItWorks />
        <About />
        <Contact />
        <Footer />
        <Chatbot />
        <Cart />
      </div>
    </CartProvider>
  );
}

export default App;

