import { Formik, Form, Field } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import * as Yup from "yup";
import {
  Button,
  FormGroup,
  FormLabel,
  FormControl,
  FormText,
} from "react-bootstrap";

import GoogleAuthButton from "../components/GoogleAuthButton";
import OrDivider from "../components/OrDivider";

import {
  useUser,
  registerWithEmailAndPassword,
  EMAIL_ALREADY_TAKEN,
} from "../utils/auth/client";

const checkPasswordMatch = (value, context) => {
  const { password, confirmPassword } = context.parent;
  return password === confirmPassword;
};

export default function Register() {
  const router = useRouter();
  const { user } = useUser();
  if (!user) {
    return (
      <div className="h-100 d-flex flex-column justify-content-center align-items-center">
        <div className="border rounded p-4">
          <p
            tabIndex={0}
            aria-label="Login to your account"
            className="fs-5 fw-bold"
          >
            Register an account
          </p>
          <p className="text-muted">
            Already have account?{" "}
            <span tabIndex={0} role="link" aria-label="Register here">
              <Link className="text-dark" href="/login">
                Login here
              </Link>
            </span>
          </p>
          <GoogleAuthButton type="register" />
          <OrDivider />
          <div>
            <Formik
              initialValues={{ email: "", password: "", confirmPassword: "" }}
              validationSchema={Yup.object().shape({
                email: Yup.string().email("Invalid email").required("Required"),
                password: Yup.string()
                  .min(6, "Must be 6 characters or more")
                  .required("Required"),
                confirmPassword: Yup.string().test(
                  "password-match",
                  "Password does not match",
                  checkPasswordMatch
                ),
              })}
              onSubmit={async (values, { setSubmitting, setFieldError }) => {
                try {
                  await registerWithEmailAndPassword(
                    values.email,
                    values.password
                  );
                } catch (err) {
                  if (err === EMAIL_ALREADY_TAKEN) {
                    setFieldError(
                      "email",
                      "Email already taken (Try login instead)"
                    );
                  } else {
                    console.error(err);
                  }
                }
                setSubmitting(false);
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="d-flex flex-column">
                  <FormGroup className="mb-2">
                    <FormLabel htmlFor="email" className="fw-bold">
                      Email
                    </FormLabel>
                    <Field name="email">
                      {({ field }) => (
                        <FormControl {...field} type="email" id="email" />
                      )}
                    </Field>
                    {errors.email && touched.email ? (
                      <FormText className="text-danger">
                        {errors.email}
                      </FormText>
                    ) : null}
                  </FormGroup>
                  <FormGroup className="mb-2">
                    <FormLabel htmlFor="password" className="fw-bold">
                      Password
                    </FormLabel>
                    <Field name="password">
                      {({ field }) => (
                        <FormControl {...field} type="password" id="password" />
                      )}
                    </Field>
                    {errors.password && touched.password ? (
                      <FormText className="text-danger">
                        {errors.password}
                      </FormText>
                    ) : null}
                  </FormGroup>
                  <FormGroup className="mb-2">
                    <FormLabel htmlFor="confirmPassword" className="fw-bold">
                      Confirm Password
                    </FormLabel>
                    <Field name="confirmPassword">
                      {({ field }) => (
                        <FormControl
                          {...field}
                          type="password"
                          id="confirmPassword"
                        />
                      )}
                    </Field>
                    {errors.confirmPassword && touched.confirmPassword ? (
                      <FormText className="text-danger">
                        {errors.confirmPassword}
                      </FormText>
                    ) : null}
                  </FormGroup>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="align-self-center mt-2"
                    active
                  >
                    Register
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  } else {
    router.push("/");
  }
}
