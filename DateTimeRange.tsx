import { Calendar } from "primereact/calendar";
import { Controller, useFormContext } from "react-hook-form";
import { inputValidator } from "../../../../library/utilities/helperFunction";
import { useEffect, useRef, useState } from "react";
import { IFormFieldType } from "../../../../library/utilities/constant";
import { IFormProps } from "../formInterface/forms.model";
import { FormFieldError } from "../formFieldError/FormFieldError";
import { useTranslation } from "react-i18next";

const DateTimeRange = (props: IFormProps) => {
  const { attribute, form, appendTo, fieldType } = props;
  const { label, minDate, maxDate, placeholder } = form[attribute];
  const { required, showTime = true, disabled } = form[attribute].rules;
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const selectedValues = getValues(attribute) || {};
  const initialValueRef = useRef(selectedValues);

  const [dates, setDates] = useState<Date[]>();
  const minDateValue = minDate ? new Date(Number(minDate)) : undefined;
  const maxDateValue = maxDate ? new Date(Number(maxDate)) : undefined;
  const { t } = useTranslation();
  const defaultPlaceHolder: string = t("components.dateTime.placeholder");
  useEffect(() => {
    if (
      initialValueRef.current &&
      initialValueRef.current.from_date_time &&
      initialValueRef.current.to_date_time
    ) {
      setDates([
        new Date(Number(initialValueRef.current.from_date_time)),
        new Date(Number(initialValueRef.current.to_date_time)),
      ]);
    }
  }, [initialValueRef]);

  const getClassNames = () => {
    let labelClassName = "";
    let fieldClassName = "";
    let divClassName = "";

    switch (fieldType) {
      case IFormFieldType.NO_LABEL:
        labelClassName = "";
        fieldClassName = "field p-fluid";
        divClassName = "";
        break;
      case IFormFieldType.TOP_LABEL:
        labelClassName = "";
        fieldClassName = "field p-fluid";
        divClassName = "";
        break;
      default:
        labelClassName = "col-12 mb-3 md:col-3 md:mb-0";
        fieldClassName = "field grid";
        divClassName = "col-12 md:col-9 relative";
        break;
    }

    return { labelClassName, fieldClassName, divClassName };
  };
  const { labelClassName, fieldClassName, divClassName } = getClassNames();

  const labelElement = (
    <label htmlFor={attribute} className={labelClassName}>
      {label} {required && "*"}
    </label>
  );

  return (
    <div className={fieldClassName}>
      {fieldType !== IFormFieldType.NO_LABEL && labelElement}
      <div className={divClassName}>
        <Controller
          name={attribute}
          control={control}
          rules={inputValidator(form[attribute].rules, label)}
          render={({ field }) => {
            return (
              <Calendar
                className={`w-full ${errors[attribute] ? "p-invalid" : ""}`}
                showTime={showTime}
                hourFormat="12"
                id={field.name}
                value={dates}
                onChange={(e: any) => {
                  if (e.value) {
                    const dates = e?.value?.map((date: Date) =>
                      new Date(date)?.getTime()?.toString()
                    );
                    if (dates.length > 0) {
                      setValue(attribute, {
                        from_date_time: dates[0],
                        to_date_time: dates[1],
                      });
                      setDates(e.value);
                    }
                  }
                }}
                dateFormat="yy-mm-dd"
                showIcon
                placeholder={placeholder || defaultPlaceHolder}
                minDate={minDateValue}
                maxDate={maxDateValue}
                appendTo={appendTo}
                disabled={disabled}
                selectionMode="range"
              />
            );
          }}
        />
        <FormFieldError data={{ errors: errors, name: attribute }} />
      </div>
    </div>
  );
};

export default DateTimeRange;
