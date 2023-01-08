import { Formik, Form, Field } from "formik";
import { useState } from "react";
import {
  Form as BootstrapForm,
  Button,
  FormGroup,
  FormControl,
  FormLabel,
  FormText,
  Alert,
} from "react-bootstrap";
import Select from "react-select";
import * as Yup from "yup";

import Layout from "../../components/Layout";

import { postAsUser, useUserOptions } from "../../utils/data";

export default function TransactionForm() {
  const [submitResult, setSubmitResult] = useState({
    message: "",
    ok: true,
  });
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
          users: Yup.array().min(1, "At least one user is required"),
          category: Yup.string()
            .min(1)
            .max(100)
            .required("Category is required"),
          payer: Yup.object().required("Payer is required"),
          includePayerInSplit: Yup.boolean().required(),
        })}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const { users, payer, ...payload } = values;
            payload.users = users.map((user) => user.value);
            payload.payer = payer.value;
            const { message, ok } = await postAsUser(
              "/api/v1/transactions",
              payload
            );
            setSubmitResult({
              message,
              ok,
            });
            resetForm();
            setSubmitting(false);
          } catch (error) {
            setSubmitResult({
              message: "transaction creation failed",
              ok: false,
            });
            setSubmitting(false);
          }
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
                {({ field }) => (
                  <FormControl as="textarea" {...field} type="text" />
                )}
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
              <Field
                name="includePayerInSplit"
                type="checkbox"
                id={`check-api-checkbox`}
              >
                {({ field }) => (
                  <BootstrapForm.Check type="checkbox" {...field}>
                    <BootstrapForm.Check.Input
                      type="checkbox"
                      checked={values.includePayerInSplit}
                      onChange={(event) =>
                        setFieldValue(
                          "includePayerInSplit",
                          event.target.checked
                        )
                      }
                      onBlur={() =>
                        setFieldTouched("includePayerInSplit", true)
                      }
                    />
                    <BootstrapForm.Check.Label>
                      Include Payer in Split
                    </BootstrapForm.Check.Label>
                  </BootstrapForm.Check>
                )}
              </Field>
              {errors.includePayerInSplit && touched.includePayerInSplit ? (
                <FormText className="text-danger">
                  {errors.includePayerInSplit}
                </FormText>
              ) : null}
            </FormGroup>
            <Button
              className="align-self-center"
              type="submit"
              disabled={isSubmitting}
              active
            >
              Submit
            </Button>
            {submitResult.message === "" ? null : submitResult.ok ? (
              <Alert className="mt-2" variant="success">
                {submitResult.message}
              </Alert>
            ) : (
              <Alert className="mt-2" variant="danger">
                {submitResult.message}
              </Alert>
            )}
          </Form>
        )}
      </Formik>
    </Layout>
  );
}
