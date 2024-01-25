import { TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { Dialog } from 'primereact/dialog';
import * as Yup from 'yup';

interface AddOrderProductDialogProps extends MainDialogProps {
  item: ProductProps | null;
  productItems: NewOutboundProduct[];
  setProductItems: (prev: NewOutboundProduct[]) => void;
}

const initialValues = {
  quantity: 1,
};

const AddProductDialog: React.FC<AddOrderProductDialogProps> = ({
  visible,
  setVisible,
  item,
  productItems,
  setProductItems,
}) => {
  const validationSchema = Yup.object().shape({
    quantity: Yup.number()
      .max(
        item!.quantity,
        `Quantity must not be greater than available quantity: ${
          item!.quantity
        }`
      )
      .required('Quantity is required'),
  });

  const onSubmit = async (values: { quantity: number }) => {
    // console.log(values);
    if (item) {
      const outboundProduct: NewOutboundProduct = {
        product: item,
        quantity: values.quantity,
      };

      const updatedItems = [...productItems, outboundProduct];

      setProductItems(updatedItems);

      setVisible(false);
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={() => setVisible(false)}
      header="Add Product to Order"
      draggable={false}
      resizable={false}
      maskClassName="create-new-mask"
      id="new-supplier-dialog"
    >
      <div className="form-wrapper mt-4">
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {() => (
            <Form>
              <Field name="quantity">
                {({ field, meta }: FieldProps) => (
                  <div className="mb-5 w-full">
                    <TextField
                      type="number"
                      {...field}
                      variant="outlined"
                      fullWidth
                      label="Quantity"
                      error={meta.touched && meta.error ? true : false}
                      helperText={<ErrorMessage name="quantity" />}
                    />
                  </div>
                )}
              </Field>
              <button type="submit" className="custom-btn loading-btn">
                Add Product
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </Dialog>
  );
};

export default AddProductDialog;
