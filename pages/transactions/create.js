import { Formik, Form, Field } from "formik";
import {
  Form as BootstrapForm,
  Button,
  FormGroup,
  FormControl,
  FormLabel,
  FormText,
} from "react-bootstrap";
import Select from "react-select";
import * as Yup from "yup";

import Layout from "../../components/Layout";

import { useUserOptions } from "../../utils/data";

export default function TransactionForm() {
  const { userOptions } = useUserOptions();

  return (
    <Layout>
      <Formik
        initialValues={{
          title: "",
          description: "",
          date: "",
          price: 0,
          users: [],
          category: "",
          payer: "",
          includePayerInSplit: true,
        }}
        validationSchema={Yup.object().shape({
          title: Yup.string().min(1).max(100).required("Title is required"),
          description: Yup.string(),
          date: Yup.date().required("Date is required"),
          price: Yup.number().min(0).required("Price is required"),
          users: Yup.array()
            .of(
              Yup.object().shape({
                value: Yup.string(),
                label: Yup.string(),
              })
            )
            .required("At least one user is required"),
          category: Yup.string()
            .min(1)
            .max(100)
            .required("Category is required"),
          payer: Yup.object()
            .shape({
              value: Yup.string(),
              label: Yup.string(),
            })
            .required("Payer is required"),
          includePayerInSplit: Yup.boolean().required(),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        {({
          values,
          isSubmitting,
          errors,
          touched,
          setFieldTouched,
          setFieldValue,
        }) => (
          <Form className="d-flex flex-column">
            <FormGroup>
              <FormLabel>Title</FormLabel>
              <Field name="title">
                {({ field }) => <FormControl {...field} type="text" />}
              </Field>
              {errors.title && touched.title ? (
                <FormText className="text-danger">{errors.title}</FormText>
              ) : null}
            </FormGroup>
            <FormGroup>
              <FormLabel>Description</FormLabel>
              <Field name="description">
                {({ field }) => <FormControl {...field} type="text" />}
              </Field>
              {errors.description && touched.description ? (
                <FormText className="text-danger">
                  {errors.description}
                </FormText>
              ) : null}
            </FormGroup>
            <FormGroup>
              <FormLabel>Date</FormLabel>
              <Field name="date">
                {({ field }) => <FormControl {...field} type="date" />}
              </Field>
              {errors.date && touched.date ? (
                <FormText className="text-danger">{errors.date}</FormText>
              ) : null}
            </FormGroup>
            <FormGroup>
              <FormLabel>Price</FormLabel>
              <Field name="price">
                {({ field }) => <FormControl {...field} type="number" />}
              </Field>
              {errors.price && touched.price ? (
                <FormText className="text-danger">{errors.price}</FormText>
              ) : null}
            </FormGroup>
            <FormGroup>
              <FormLabel>Users</FormLabel>
              <Field name="users">
                {({ field }) => (
                  <Select
                    {...field}
                    value={values.users}
                    isMulti
                    options={userOptions}
                    onChange={(value) => setFieldValue("users", value)}
                    onBlur={() => setFieldTouched("users", true)}
                  />
                )}
              </Field>
              {errors.users && touched.users ? (
                <FormText className="text-danger">{errors.users}</FormText>
              ) : null}
            </FormGroup>

            <FormGroup>
              <FormLabel>Category</FormLabel>
              <Field name="category">
                {({ field }) => <FormControl {...field} type="text" />}
              </Field>
              {errors.category && touched.category ? (
                <FormText className="text-danger">{errors.category}</FormText>
              ) : null}
            </FormGroup>
            <FormGroup>
              <FormLabel>Payer</FormLabel>
              <Field name="payer">
                {({ field }) => (
                  <Select
                    {...field}
                    value={values.payer}
                    options={userOptions}
                    onChange={(value) => setFieldValue("payer", value)}
                    onBlur={() => setFieldTouched("payer", true)}
                  />
                )}
              </Field>
              {errors.payer && touched.payer ? (
                <FormText className="text-danger">{errors.payer}</FormText>
              ) : null}
            </FormGroup>
            <FormGroup className="my-2">
              <BootstrapForm.Check type="checkbox" id={`check-api-checkbox`}>
                <BootstrapForm.Check.Input type="checkbox" />
                <BootstrapForm.Check.Label>
                  Include Payer in Split
                </BootstrapForm.Check.Label>
                <BootstrapForm.Control.Feedback>
                  {errors.includePayerInSplit && touched.includePayerInSplit ? (
                    <FormText className="text-danger">
                      {errors.includePayerInSplit}
                    </FormText>
                  ) : null}
                </BootstrapForm.Control.Feedback>
              </BootstrapForm.Check>
            </FormGroup>
            <Button
              className="align-self-center"
              type="submit"
              disabled={isSubmitting}
              active
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}
