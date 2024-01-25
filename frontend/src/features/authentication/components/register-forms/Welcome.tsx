import { ErrorMessage, Field, FieldProps } from 'formik';
import { Checkbox } from 'primereact/checkbox';
import { classNames } from 'primereact/utils';

/**
 * Render the Welcome component.
 *
 * @return {JSX.Element} The rendered component.
 */
const Welcome = () => {
  return (
    <div className="welcome" data-aos="fade-right">
      <div className="text-2xl sm:text-4xl font-semibold">
        <h1>Hey 👋🏾</h1>
        <h1>Welcome to Cruise Ware</h1>
        <p className="text-lg mt-4 text-gray-400 font-normal">
          Let's get to know you so you can start managing your inventories
        </p>
      </div>
      <div className="terms my-4">
        <Field name="terms_agreed">
          {({ field, meta }: FieldProps) => (
            <div className="my-10">
              <div>
                <Checkbox
                  id="terms_agreed"
                  {...field}
                  checked={meta.value}
                  className={classNames({
                    'p-invalid': meta.touched && meta.error,
                  })}
                />
                <label htmlFor="terms_agreed" className="ml-3 text-sm">
                  I agree to the Terms & Conditions and Privacy Policy
                </label>
              </div>
              <ErrorMessage
                name="terms_agreed"
                component="div"
                className="text-red-500 text-sm mt-2"
              />
            </div>
          )}
        </Field>
      </div>
    </div>
  );
};
export default Welcome;
