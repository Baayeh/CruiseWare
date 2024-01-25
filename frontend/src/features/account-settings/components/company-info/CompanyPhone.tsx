import {
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import {
  CountryIso2,
  FlagEmoji,
  defaultCountries,
  parseCountry,
  usePhoneInput,
} from 'react-international-phone';
import { useAppDispatch, useUpdate } from '../../../../hooks';
import { updateCompanyInfo } from '../../../authentication';

const CompanyPhone = () => {
  const [showField, setShowField] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const dispatch = useAppDispatch();
  const business = JSON.parse(localStorage.getItem('company') || '{}');

  const { phone, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      value: business.businessPhone,
      countries: defaultCountries,
      onChange: (data) => {
        setNewPhone(data.phone);
      },
    });

  // update company phone
  const { data, loading, error, updateData, resetState } = useUpdate(
    '/business',
    'PATCH'
  );

  const _updateCompanyPhone = async () => {
    const body = {
      id: business?.businessID,
      phone: newPhone ? newPhone : '',
    };

    await updateData({ businessData: body });
    setRequestSent(true);
  };

  useEffect(() => {
    if (data && requestSent && newPhone) {
      toast.success('Phone updated successfully');
      resetState();
      setRequestSent(false);
      setShowField(false);
      const updatedInfo = {
        ...business,
        businessPhone: newPhone ? newPhone : '',
      };

      localStorage.setItem('company', JSON.stringify(updatedInfo));
      dispatch(updateCompanyInfo(updatedInfo));
    }
  }, [newPhone, data, requestSent]);

  useEffect(() => {
    if (error && !data) {
      toast.error(error);
      resetState();
    }
  }, [error, data, resetState]);

  return (
    <>
      {showField ? (
        <div className="form_wrapper mt-2 pr-6 py-4">
          <div className="flex items-center justify-between gap-x-10">
            <TextField
              variant="outlined"
              fullWidth
              label="Phone number"
              color="primary"
              placeholder="Phone number"
              value={phone}
              onChange={handlePhoneValueChange}
              type="tel"
              inputRef={inputRef}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    style={{ marginRight: '2px', marginLeft: '-8px' }}
                  >
                    <Select
                      MenuProps={{
                        style: {
                          height: '300px',
                          width: '360px',
                          top: '10px',
                          left: '-34px',
                        },
                        transformOrigin: {
                          vertical: 'top',
                          horizontal: 'left',
                        },
                      }}
                      sx={{
                        width: 'max-content',
                        // Remove default outline (display only on focus)
                        fieldset: {
                          display: 'none',
                        },
                        '&.Mui-focused:has(div[aria-expanded="false"])': {
                          fieldset: {
                            display: 'block',
                          },
                        },
                        // Update default spacing
                        '.MuiSelect-select': {
                          padding: '8px',
                          paddingRight: '24px !important',
                        },
                        svg: {
                          right: 0,
                        },
                      }}
                      value={country}
                      onChange={(e) =>
                        setCountry(e.target.value as CountryIso2)
                      }
                      renderValue={(value) => (
                        <FlagEmoji iso2={value} style={{ display: 'flex' }} />
                      )}
                    >
                      {defaultCountries.map((c) => {
                        const country = parseCountry(c);
                        return (
                          <MenuItem key={country.iso2} value={country.iso2}>
                            <FlagEmoji
                              iso2={country.iso2}
                              style={{ marginRight: '8px' }}
                            />
                            <Typography marginRight="8px">
                              {country.name}
                            </Typography>
                            <Typography color="gray">
                              +{country.dialCode}
                            </Typography>
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </InputAdornment>
                ),
              }}
            />
            <div className="w-[10rem]">
              <button
                type="submit"
                className="custom-btn loading-btn !w-[10rem]"
                disabled={loading}
                onClick={_updateCompanyPhone}
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    <span>Saving...</span>
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-t border-[color:var(--border-color)] flex w-full justify-between items-center pr-6 py-4">
          <p className="text-sm font-normal text-[color:var(--text-secondary)]">
            Phone
          </p>
          <p>{business?.businessPhone}</p>
          <button
            type="button"
            className="rounded-full hover:bg-[color:var(--border-color)] p-2"
            onClick={() => setShowField(true)}
          >
            <span>
              <MdOutlineModeEditOutline />
            </span>
          </button>
        </div>
      )}
    </>
  );
};

export default CompanyPhone;
