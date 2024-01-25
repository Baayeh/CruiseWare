import { useEffect, useRef, useState } from 'react';
import { CgMenuRight } from 'react-icons/cg';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [scroll, setScroll] = useState(false);
  const navList = useRef<HTMLUListElement>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const openMenuList = () => {
    if (navList.current) {
      navList.current.classList.toggle('active');
    }
  };

  const scrollToSection = () => {
    if (windowWidth < 640) {
      openMenuList();
    }
  };

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  const onPress = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const target = window.document.getElementById(
      e.currentTarget.href.split('#')[1]
    );
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }

    scrollToSection();
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className={`nav ${scroll ? 'nav-scrolled' : ''}`}>
      <div className="flex sm:w-full sm:justify-between lg:justify-start items-center gap-x-16">
        <a href="#home" className="logo">
          <span>Cruise</span>Ware
        </a>

        <ul className="nav-list" ref={navList}>
          <li className="nav-link">
            <a href="#home" onClick={(e) => onPress(e)}>
              <div data-to-scrollspy-id="home">Home</div>
            </a>
          </li>
          <li className="nav-link">
            <a href="#features" onClick={(e) => onPress(e)}>
              <div data-to-scrollspy-id="features">Features</div>
            </a>
          </li>
          <li className="nav-link">
            <a href="#benefits" onClick={(e) => onPress(e)}>
              <div data-to-scrollspy-id="benefits">Benefits</div>
            </a>
          </li>
          <li className="nav-link">
            <a href="#pricing" onClick={(e) => onPress(e)}>
              <div data-to-scrollspy-id="pricing">Pricing</div>
            </a>
          </li>
          <li className="nav-link">
            <a href="#contact" onClick={(e) => onPress(e)}>
              <div data-to-scrollspy-id="contact">Contact</div>
            </a>
          </li>
        </ul>
      </div>

      <div className="nav-btns">
        <Link to={'/login'} className="btn hidden lg:flex">
          Sign in
        </Link>
        <button
          className="sm:hidden flex items-center text-lg"
          onClick={() => openMenuList()}
        >
          <CgMenuRight className="text-[#ededed]" />
          <span className="text-[#ededed]">Menu</span>
        </button>
      </div>
    </nav>
  );
};
export default Navigation;
