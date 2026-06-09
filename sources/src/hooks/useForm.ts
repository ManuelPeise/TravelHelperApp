import React, { useState, useCallback, useMemo } from 'react';

type UseFormReturn<TModel> = {
  values: TModel;
  handleChange: (field: keyof TModel, value: any) => void;
  resetForm: () => void;
  isModified: boolean;
};

export const useForm = <TModel extends object>(
  initialValues: TModel,
  callback?: (values: TModel) => void,
): UseFormReturn<TModel> => {
  const callBackRef = React.useRef(callback);
  const [values, setValues] = useState<TModel>(initialValues);

  const handleChange = useCallback(
    (field: keyof TModel, value: any) => {
      setValues(prevValues => ({
        ...prevValues,
        [field]: value,
      }));
      if (callBackRef.current) {
        callBackRef.current({ ...values, [field]: value });
      }
    },
    [values],
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  const isModified = useMemo(() => {
    return Object.keys(initialValues).some(
      key => values[key as keyof TModel] !== initialValues[key as keyof TModel],
    );
  }, [values, initialValues]);

  return { values, handleChange, resetForm, isModified };
};
