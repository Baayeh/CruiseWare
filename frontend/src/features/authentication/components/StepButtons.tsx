/**
 * Props for a step button component.
 *
 * @interface STEP_BTN_PROPS
 * @property {number} step - The current step number.
 * @property {boolean} isSubmitting - Indicates whether the form is currently submitting.
 * @property {boolean} isLastStep - Indicates whether the current step is the last step.
 * @property {() => void} goToPreviousStep - Function to navigate to the previous step.
 */
interface STEP_BTN_PROPS {
  step: number;
  isSubmitting: boolean;
  isLoading: boolean;
  isValid: boolean;
  isLastStep: boolean;
  goToPreviousStep: (value: any) => void;
}

/**
 * Renders the step buttons based on the current step.
 *
 * @param {STEP_BTN_PROPS} props - The properties for the step buttons component.
 * @param {number} props.step - The current step.
 * @param {boolean} props.isSubmitting - Indicates if the form is currently submitting.
 * @param {boolean} props.isLastStep - Indicates if the current step is the last step.
 * @param {Function} props.goToPreviousStep - The function to go to the previous step.
 * @return {ReactNode} The rendered step buttons.
 */
const StepButtons: React.FC<STEP_BTN_PROPS> = ({
  step,
  isSubmitting,
  isLoading,
  isValid,
  isLastStep,
  goToPreviousStep,
}) => {
  return (
    <>
      <div
        className={`${
          step === 2 ? 'lg:w-full' : ''
        } flex lg:w-[70%] lg:justify-between gap-x-5`}
      >
        {step !== 0 && (
          <button
            type="button"
            onClick={goToPreviousStep}
            className="w-full lg:w-[10rem] border border-[#ff5722] p-3 rounded hover:border-[#e8e8e8] transition-colors duration-300 ease-in-out"
          >
            Previous
          </button>
        )}
        <button
          type="submit"
          className={`w-full lg:min-w-[10rem] max-w-max ${
            !isValid
              ? 'bg-orange-950 p-3 rounded cursor-not-allowed'
              : 'register-btn'
          }`}
          disabled={isSubmitting || !isValid}
        >
          {step === 0 && "Let's Start"}
          {step !== 0 && !isLastStep && 'Next'}
          {isLastStep && !isLoading && 'Create Account'}
          {isLoading && isLastStep && 'Creating account...'}
        </button>
      </div>
    </>
  );
};
export default StepButtons;
