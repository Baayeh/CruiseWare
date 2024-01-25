const Pricing = () => {
  return (
    <section id="pricing">
      <div>
        <h1>
          Cruise <span className="text-[#ff5722]">Pro</span>
        </h1>
        <p>
          Get <span className="font-bold">instant access</span> to the entire
          Cruise ecosystem with a <span className="font-bold">Cruise Pro</span>{' '}
          membership
        </p>
      </div>

      <section className="pricing-cards">
        <div
          className="pricing-card-wrapper"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          <div className="pricing-card free">
            <div className="pricing-card-header">
              <h3>Starter Plan</h3>
              <p>
                only <span>$0</span> /mo
              </p>
            </div>
            <div className="pricing-card-body">
              <ul>
                <li>
                  <i className="fa-solid fa-check"></i>
                  <span>10 Users</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i>
                  <span>10 Projects</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i>
                  <span>Unlimited Revisions</span>
                </li>
              </ul>
            </div>
            <div className="pricing-card-action">
              <button>Choose Starter</button>
            </div>
          </div>
        </div>

        <div
          className="pricing-card-wrapper"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          <div className="pricing-card popular-card">
            <div className="popular">
              <span>Most popular</span>
            </div>
            <div className="pricing-card-header">
              <h3>Basic Plan</h3>
              <p>
                only <span>$19</span> /mo
              </p>
            </div>
            <div className="pricing-card-body">
              <ul>
                <li>
                  <i className="fa-solid fa-check"></i>
                  <span>10 Users</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i>
                  <span>10 Projects</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i>
                  <span>Unlimited Revisions</span>
                </li>
              </ul>
            </div>
            <div className="pricing-card-action">
              <button>Choose Basic</button>
            </div>
          </div>
        </div>

        <div
          className="pricing-card-wrapper"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          <div className="pricing-card">
            <div className="pricing-card-header">
              <h3>Cruise Plan</h3>
              <p>
                only <span>$75</span> /mo
              </p>
            </div>
            <div className="pricing-card-body">
              <ul>
                <li>
                  <i className="fa-solid fa-check"></i>
                  <span>10 Users</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i>
                  <span>10 Projects</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i>
                  <span>Unlimited Revisions</span>
                </li>
              </ul>
            </div>
            <div className="pricing-card-action">
              <button>Choose Cruise</button>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};
export default Pricing;
