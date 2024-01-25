import { AiOutlineControl } from 'react-icons/ai';
import { DiRaphael } from 'react-icons/di';
import { MdJoinInner } from 'react-icons/md';
import { SiSpringsecurity } from 'react-icons/si';

const Benefits = () => {
  return (
    <section id="benefits">
      <div
        className="benefits-content"
        data-aos="fade-zoom-in"
        data-aos-easing="ease-in-back"
        data-aos-delay="400"
        data-aos-offset="0"
      >
        <h1>Why choose Cruise Ware?</h1>
        <p className="desc">
          Lorem ipsum dolor sit amet, consec tetur adipisicing elit, sed do
          eiusmod tempor incididuntut consec tetur adipisicing elit,Lorem ipsum
          dolor sit amet.
        </p>
        <hr />
        <ul className="benefits-list">
          <li className="mb-4">
            <span>
              <SiSpringsecurity size={40} />
            </span>
            <div>
              <h3 className="uppercase text-xl">Security</h3>
              <p className="text-sm">Lorem ipsum dolor sit amet consectetur.</p>
            </div>
          </li>
          <li className="mb-4">
            <span>
              <DiRaphael size={40} />
            </span>
            <div>
              <h3 className="uppercase text-xl">Clean Design</h3>
              <p className="text-sm">Lorem ipsum dolor sit amet consectetur.</p>
            </div>
          </li>
          <li className="mb-4">
            <span>
              <MdJoinInner size={40} />
            </span>
            <div>
              <h3 className="uppercase text-xl">Cruise Ecosystem</h3>
              <p className="text-sm">Lorem ipsum dolor sit amet consectetur.</p>
            </div>
          </li>
          <li className="mb-4">
            <span>
              <AiOutlineControl size={40} />
            </span>
            <div>
              <h3 className="uppercase text-xl">Full Control</h3>
              <p className="text-sm">Lorem ipsum dolor sit amet consectetur.</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
};
export default Benefits;
