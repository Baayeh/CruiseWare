import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

/**
 * Represents the properties for an image component.
 *
 * @interface ImageProps
 * @property {string} alt - The alternative text for the image.
 * @property {string} [height] - The height of the image.
 * @property {string} [width] - The width of the image.
 * @property {string} src - The source URL of the image.
 * @property {string} [className] - The CSS class name for the image.
 * @property {boolean} [isImageLoaded] - Indicates whether the image is loaded.
 * @property {function} [setIsImageLoaded] - A callback function to update the isImageLoaded state.
 * @property {{ x: number; y: number }} [scrollPosition] - The scroll position of the image.
 */

export interface ImageProps {
  alt: string;
  height?: string;
  width?: string;
  src: string;
  className?: string;
  isImageLoaded?: boolean;
  setIsImageLoaded?: (isImageLoaded: boolean) => void;
  scrollPosition?: { x: number; y: number };
}

/**
 * Renders an image component that wraps a lazy-loaded image using the provided props.
 *
 * @param {object} ImageProps - An object containing the following:
 *  - {string} alt: Text to display when the image cannot be loaded
 *  - {number} height: The height of the image in pixels
 *  - {number} width: The width of the image in pixels
 *  - {string} src: The URL of the image
 *  - {string} className: CSS classes to apply to the image
 *  - {function} setIsImageLoaded: A callback function to execute when the image is loaded
 *  - {number} scrollPosition: The current scroll position of the page
 * @return {JSX.Element} Returns a React component that renders a lazy-loaded image
 */
const Image: React.FC<ImageProps> = ({
  alt,
  height,
  width,
  src,
  className,
  setIsImageLoaded,
  scrollPosition,
}) => {
  return (
    <LazyLoadImage
      alt={alt}
      height={height}
      src={src}
      width={width}
      className={className}
      effect="blur"
      onLoadCapture={() => setIsImageLoaded!(true)}
      scrollPosition={scrollPosition}
    />
  );
};
export default Image;
