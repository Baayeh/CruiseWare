import { useEffect, useState } from 'react';
import { BsCaretUpFill } from 'react-icons/bs';
import ScrollSpy from 'react-ui-scrollspy';
import '../assets/css/Homepage.scss';
import {
  Benefits,
  Features,
  Footer,
  Header,
  Loader,
  Navigation,
  Pricing,
} from '../features/home';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  window.addEventListener('scroll', toggleVisibility);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section id="homepage">
      <Navigation />
      <main>
        <ScrollSpy scrollThrottle={100} useBoxMethod={false}>
          <Header />
          <Features />
          <Benefits />
          <section id="call-to-action">
            <div data-aos="fade-up" data-aos-delay="200">
              <h1>Revolutionize Your Inventory Game</h1>
              <p>Seize command, watch your stock soar, right on your phone!</p>
              <button>Request a demo</button>
            </div>
          </section>
          <Pricing />
          <Footer />
        </ScrollSpy>
      </main>

      {isVisible && (
        <div className="scroll-top-btn">
          <button type="button" title="Scroll to top" onClick={scrollToTop}>
            <span>
              <BsCaretUpFill />
            </span>
          </button>
        </div>
      )}
    </section>
  );
};

export default Home;
