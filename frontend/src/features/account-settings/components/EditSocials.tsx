import { TextField } from '@mui/material';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { setBusiness } from '..';
import { useFetch, useUpdate } from '../../../hooks';

interface EditSocialsProps extends MainDialogProps {
  businessID: number | null;
  socials: BusinessSocials;
}

type Errors = {
  Twitter: boolean;
  Facebook: boolean;
  LinkedIn: boolean;
  Instagram: boolean;
  Tiktok: boolean;
};

const EditSocials: React.FC<EditSocialsProps> = ({
  visible,
  setVisible,
  businessID,
  socials,
}) => {
  const initialValues = {
    Twitter: socials.Twitter ? socials.Twitter : '',
    Facebook: socials.Facebook ? socials.Facebook : '',
    LinkedIn: socials.LinkedIn ? socials.LinkedIn : '',
    Instagram: socials.Instagram ? socials.Instagram : '',
    Tiktok: socials.Tiktok ? socials.Tiktok : '',
  };

  const initialErrors = {
    Twitter: false,
    Facebook: false,
    LinkedIn: false,
    Instagram: false,
    Tiktok: false,
  };

  const [requestSent, setRequestSent] = useState(false);
  const { fetchData: fetchBusinessData } = useFetch('/business', setBusiness);

  const { data, loading, error, updateData, resetState } = useUpdate(
    '/business',
    'PATCH'
  );

  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const runValidation = () => {
    const newErrors = { ...initialErrors };

    const keys: Array<keyof typeof formData> = Object.keys(formData) as Array<
      keyof typeof formData
    >;

    keys.forEach((key) => {
      if (initialValues[key] !== '' && formData[key] === '') {
        newErrors[key] = true;
      } else {
        newErrors[key] = false;
      }
    });

    setErrors(newErrors);
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    if (
      !errors.Twitter &&
      !errors.Facebook &&
      !errors.LinkedIn &&
      !errors.Instagram &&
      !errors.Tiktok
    ) {
      const body = Object.entries(formData)
        .filter((entry) => {
          // Check if the property value is not empty
          const [_key, value] = entry;
          return value !== '' && value !== null;
        })
        .reduce((obj: { [key: string]: any }, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});

      const updatedData = {
        businessSocials: {
          id: socials.id,
          businessID,
          ...body,
        },
      };

      await updateData(updatedData);
      setRequestSent(true);
    }
    setIsSubmitting(false);
  };

  const hasErrors = (errorObj: Errors) => {
    return Object.values(errorObj).some((error) => error);
  };

  useEffect(() => {
    if (data && requestSent) {
      toast.success(data);
      setVisible(false);
      resetState();
      setRequestSent(false);
      fetchBusinessData();
    }
  }, [data, requestSent, resetState]);

  useEffect(() => {
    if (error && !data) {
      toast.error(error);
      resetState();
    }
  }, [error, data, resetState]);

  return (
    <Dialog
      header="Update Social Accounts"
      visible={visible}
      onHide={() => setVisible(false)}
      draggable={false}
      resizable={false}
      maskClassName="create-new-mask"
      id="new-supplier-dialog"
    >
      <div className="mt-4">
        <div className="mb-5 w-full">
          <TextField
            variant="outlined"
            fullWidth
            label="Twitter"
            value={formData.Twitter}
            onChange={(e) =>
              setFormData({ ...formData, Twitter: e.target.value })
            }
            onBlur={() => runValidation()}
            error={errors.Twitter}
            helperText={
              errors.Twitter &&
              'Cannot leave this field empty when it has an existing value.'
            }
          />
        </div>
        <div className="mb-5 w-full">
          <TextField
            variant="outlined"
            fullWidth
            label="Facebook"
            value={formData.Facebook}
            onChange={(e) =>
              setFormData({ ...formData, Facebook: e.target.value })
            }
            onBlur={() => runValidation()}
            error={errors.Facebook}
            helperText={
              errors.Facebook &&
              'Cannot leave this field empty when it has an existing value.'
            }
          />
        </div>
        <div className="mb-5 w-full">
          <TextField
            variant="outlined"
            fullWidth
            label="LinkedIn"
            value={formData.LinkedIn}
            onChange={(e) =>
              setFormData({ ...formData, LinkedIn: e.target.value })
            }
            onBlur={() => runValidation()}
            error={errors.LinkedIn}
            helperText={
              errors.LinkedIn &&
              'Cannot leave this field empty when it has an existing value.'
            }
          />
        </div>
        <div className="mb-5 w-full">
          <TextField
            variant="outlined"
            fullWidth
            label="Instagram"
            value={formData.Instagram}
            onChange={(e) =>
              setFormData({ ...formData, Instagram: e.target.value })
            }
            onBlur={() => runValidation()}
            error={errors.Instagram}
            helperText={
              errors.Instagram &&
              'Cannot leave this field empty when it has an existing value.'
            }
          />
        </div>
        <div className="mb-5 w-full">
          <TextField
            variant="outlined"
            fullWidth
            label="Tiktok"
            value={formData.Tiktok}
            onChange={(e) =>
              setFormData({ ...formData, Tiktok: e.target.value })
            }
            onBlur={() => runValidation()}
            error={errors.Tiktok}
            helperText={
              errors.Tiktok &&
              'Cannot leave this field empty when it has an existing value.'
            }
          />
        </div>
        <button
          type="submit"
          className="custom-btn loading-btn"
          disabled={loading || isSubmitting || hasErrors(errors)}
          onClick={onSubmit}
        >
          {loading ? (
            <>
              <div className="spinner" />
              <span>Updating accounts...</span>
            </>
          ) : (
            'Update Accounts'
          )}
        </button>
      </div>
    </Dialog>
  );
};

export default EditSocials;
