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
  USER_NOT_FOUND,
  WRONG_PASSWORD,
  loginWithEmailAndPassword,
  useUser,
} from "../utils/auth/client";

export default function Login() {
  const router = useRouter();
  const { user } = useUser();
  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-white border shadow-lg rounded px-8 pt-6 pb-8">
          <p
            tabIndex={0}
            aria-label="Login to your account"
            className="text-xl font-extrabold leading-6 text-gray-800"
          >
            Login to your account
          </p>
          <p className="text-sm mt-4 font-medium leading-none text-gray-500">
            Dont have account?{" "}
            <span
              tabIndex={0}
              role="link"
              aria-label="Register here"
              className="text-sm font-medium leading-none underline text-gray-800 cursor-pointer"
            >
              <Link href="/register">Register here</Link>
            </span>
          </p>
          <GoogleAuthButton />
          <OrDivider />
          <div>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={Yup.object().shape({
                email: Yup.string().email("Invalid email").required("Required"),
                password: Yup.string()
                  .min(6, "Must be 6 characters or more")
                  .required("Required"),
              })}
              onSubmit={async (values, { setSubmitting, setFieldError }) => {
                try {
                  await loginWithEmailAndPassword(
                    values.email,
                    values.password
                  );
                } catch (err) {
                  if (err === USER_NOT_FOUND) {
                    setFieldError("email", "Email not registered");
                  } else if (err === WRONG_PASSWORD) {
                    setFieldError("password", "Wrong password");
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
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="align-self-center mt-2"
                    active
                  >
                    Login
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
