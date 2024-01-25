import { AiFillInstagram } from 'react-icons/ai';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from 'react-icons/fa';
import { GoArrowRight } from 'react-icons/go';
import { IoCall } from 'react-icons/io5';
import { MdEmail, MdLocationPin } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="contact">
      <div className="footer-container">
        <div className="footer-row">
          <div
            className="footer-col"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="300"
          >
            <h1 className="uppercase text-2xl">
              <span className="text-[#ff5722]">Cruise</span> Ware
            </h1>
            <p className="my-2 w-[90%]">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Provident maiores laborum doloribus ex modi.
            </p>
            <div className="contact">
              <ul>
                <li>
                  <MdLocationPin />
                  <span>123 Street, City</span>
                </li>
                <li>
                  <IoCall />
                  <span>+234 987 654 321</span>
                </li>
                <li>
                  <MdEmail />
                  <span>info@cruise.com</span>
                </li>
                <li>
                  <Link to="#">
                    <FaLinkedinIn />
                  </Link>
                  <Link to="#">
                    <FaTwitter />
                  </Link>
                  <Link to="#">
                    <FaFacebookF />
                  </Link>
                  <Link to="#">
                    <AiFillInstagram />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div
            className="footer-col"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="300"
          >
            <h1 className="text-[#ff5722]">Services</h1>
            <ul>
              <li>
                <span>
                  <GoArrowRight />
                </span>
                <p>Inventory Tracking</p>
              </li>
              <li>
                <span>
                  <GoArrowRight />
                </span>
                <p>Order Management</p>
              </li>
              <li>
                <span>
                  <GoArrowRight />
                </span>
                <p>Warehouse Management</p>
              </li>
              <li>
                <span>
                  <GoArrowRight />
                </span>
                <p>Stock Alerts</p>
              </li>
              <li>
                <span>
                  <GoArrowRight />
                </span>
                <p>Reports & Analytics</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-copyright">
        <p>© Cruise 2023, All Rights Reserved</p>
      </div>
    </footer>
  );
};
export default Footer;
