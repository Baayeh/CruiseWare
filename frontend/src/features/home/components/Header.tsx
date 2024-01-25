import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header id="home" data-aos="fade-in" data-aos-duration="3000">
      <div className="overlay" />

      <section className="header-content">
        <div
          className="text-end w-[80%] mx-auto"
          data-aos="fade-left"
          data-aos-delay="1200"
          data-aos-duration="1000"
        >
          <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:tracking-wide">
            Elevate Your <br /> Business
          </h1>
          <p className="my-5 text-lg sm:text-xl lg:w-[40rem] lg:ml-auto">
            Stay ahead, stay organized. Discover the ultimate inventory
            management solution!
          </p>
          <div className="mt-10">
            <Link to="/login" className="btn">
              Get started
            </Link>
          </div>
        </div>
      </section>
    </header>
  );
};
export default Header;
