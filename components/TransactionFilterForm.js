import React from "react";
import { Formik, Form, Field } from "formik";
import { Form as BootstrapForm, Button, Alert } from "react-bootstrap";
import * as Yup from "yup";
import Select from "react-select";

const TransactionFilterForm = ({ filters, categories, onFilter }) => {
  const checkStartDateBeforeEndDate = (value, context) => {
    const { startDate, endDate } = context.parent;
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return false;
    }
    return true;
  };

  return (
    <Formik
      initialValues={{
        category: {
          label: filters.category,
          value: filters.category,
        },
        startDate: filters.startDate,
        endDate: filters.endDate,
      }}
      validationSchema={Yup.object().shape({
        category: Yup.object().shape({
          label: Yup.string(),
          value: Yup.string(),
        }),
        startDate: Yup.date().test(
          "start-date-before-end-date",
          "Start date must be before end date",
          checkStartDateBeforeEndDate
        ),
        endDate: Yup.date(),
      })}
      onSubmit={({ category, ...values }, { setSubmitting }) => {
        onFilter({
          category: category.value !== "" ? category.value : null,
          ...values,
        });
        setSubmitting(false);
      }}
    >
      {({ values, errors, touched, setFieldTouched, setFieldValue }) => (
        <Form className="d-flex flex-column mb-3">
          <Field name="category">
            {({ field }) => (
              <BootstrapForm.Group className="mb-3">
                <BootstrapForm.Label>Category</BootstrapForm.Label>
                <Select
                  {...field}
                  options={categories}
                  value={values.category}
                  isClearable={true}
                  isSearchable={true}
                  onChange={(value) =>
                    setFieldValue(
                      "category",
                      value
                        ? value
                        : {
                            label: "",
                            value: "",
                          }
                    )
                  }
                  onBlur={() => setFieldTouched("category", true)}
                />
              </BootstrapForm.Group>
            )}
          </Field>
          <Field name="startDate">
            {({ field }) => (
              <BootstrapForm.Group className="mb-3">
                <BootstrapForm.Label>Start Date</BootstrapForm.Label>
                <BootstrapForm.Control
                  type="date"
                  {...field}
                  value={values.startDate}
                />
              </BootstrapForm.Group>
            )}
          </Field>
          <Field name="endDate">
            {({ field }) => (
              <BootstrapForm.Group className="mb-3">
                <BootstrapForm.Label>End Date</BootstrapForm.Label>
                <BootstrapForm.Control
                  type="date"
                  {...field}
                  value={values.endDate}
                />
              </BootstrapForm.Group>
            )}
          </Field>
          <Button
            className="align-self-center"
            type="submit"
            variant="primary"
            active
          >
            Apply
          </Button>

          {errors.startDate && touched.startDate ? (
            <Alert variant="danger" className="mt-3">
              {errors.startDate}
            </Alert>
          ) : null}
        </Form>
      )}
    </Formik>
  );
};

export default TransactionFilterForm;
