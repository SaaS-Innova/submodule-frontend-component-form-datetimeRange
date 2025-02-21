import { Calendar } from "primereact/calendar";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { inputValidator } from "../../../../library/utilities/helperFunction";
import { useEffect, useState } from "react";
import { IFormFieldType } from "../../../../library/utilities/constant";
import { IFormProps } from "../formInterface/forms.model";
import { FormFieldError } from "../formFieldError/FormFieldError";
import { useTranslation } from "react-i18next";

const DateTimeRange = (props: IFormProps) => {
  const { attribute, form, appendTo, fieldType, isDefaultTime } = props;
  const { label, minDate, maxDate, placeholder } = form[attribute];
  const { required, showTime = true, disabled } = form[attribute].rules;
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [defaultTime, setDefaultTime] = useState(false);
  const defaultFromTime = isDefaultTime?.defaultFromTime;
  const defaultToTime = isDefaultTime?.defaultToTime;
  useEffect(() => {
    if (defaultFromTime && defaultToTime) {
      setDefaultTime(true);
    } else {
      setDefaultTime(false);
    }
  }, [defaultFromTime, defaultToTime]);

  const selectedValues = useWatch({ name: attribute }) || {};

  const [dates, setDates] = useState<Date[]>();
  const minDateValue = minDate ? new Date(Number(minDate)) : undefined;
  const maxDateValue = maxDate ? new Date(Number(maxDate)) : undefined;
  const { t } = useTranslation();
  const defaultPlaceHolder: string = t("components.dateTime.placeholder");
  useEffect(() => {
    if (
      selectedValues.from_date_time != null &&
      selectedValues.to_date_time != null &&
      !dates
    ) {
      setDates([
        new Date(Number(selectedValues.from_date_time)),
        new Date(Number(selectedValues.to_date_time)),
      ]);
    }
  }, [selectedValues]);

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
      <span className="capitalize-first">
        {label} {required && "*"}
      </span>
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

                    if (defaultTime && e.originalEvent.type === "click") {
                      const fromTimeParts = defaultFromTime
                        ? defaultFromTime.split(":").map(Number)
                        : "";
                      const toTimeParts = defaultToTime
                        ? defaultToTime.split(":").map(Number)
                        : "";

                      const fromTime = e.value[0].setHours(
                        fromTimeParts[0],
                        fromTimeParts[1],
                        0,
                        0
                      );
                      const toTime = e.value[1]
                        ? e.value[1].setHours(
                            toTimeParts[0],
                            toTimeParts[1],
                            0,
                            0
                          )
                        : null;

                      setValue(attribute, {
                        from_date_time: fromTime,
                        to_date_time: toTime,
                      });

                      setDates(e.value);
                    } else {
                      setDefaultTime(false);
                      setValue(attribute, {
                        from_date_time: dates[0],
                        to_date_time: dates[1],
                      });
                      setDates(e.value);
                    }
                  } else {
                    if (defaultFromTime && defaultToTime) setDefaultTime(true);

                    setValue(attribute, {
                      from_date_time: null,
                      to_date_time: null,
                    });
                    setDates([]);
                  }
                }}
                dateFormat="yy-mm-dd"
                showIcon
                numberOfMonths={2}
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
