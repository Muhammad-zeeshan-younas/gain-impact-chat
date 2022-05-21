import React, { useContext, useEffect, useState } from "react";
import TextField from "../../components/textfield";
import { PaperAirplaneIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import bcrypt from "bcryptjs";
import { db } from "../../firebase";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { AuthContext } from "../../context/authContext";
function SignIn() {
  const [error, setError] = useState("");
  const auth = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (auth.user) {
      router.replace("/");
    }
  }, [auth.user]);

  const signInHandler = async (values) => {
    values.username = values.username.trim().toLocaleLowerCase();

    setError("");
    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", values.username),
        limit(1)
      );
      const user = await getDocs(q);
      if (user.docs.length === 0) {
        throw Error("Invalid credentials! ");
      } else {
        const validPassword = await bcrypt.compare(
          values.password,
          user.docs[0].data().password
        );
        if (validPassword) {
          auth.login({
            name: user.docs[0].data().name,
            email: user.docs[0].data().email,
            username: values.username,
          });
          router.push("/");
        } else {
          throw Error("Invalid credentials!");
        }
      }
    } catch (error) {
      setError(error.message);

      return;
    }
  };
  const validate = Yup.object({
    username: Yup.string().required("Required"),

    password: Yup.string().required("Required"),
  });
  return (
    <Formik
      initialValues={{
        username: "",

        password: "",
      }}
      validationSchema={validate}
      onSubmit={signInHandler}
    >
      {(formik) => (
        <div className="flex h-screen flex-col items-center bg-[#FDFDFE] font-poppins">
          <header className=" heading h-[168px]   bg-[#E3F6FC]  text-[50px]  text-[#52585D] ">
            Gain Impact Chat
          </header>

          <div className="tag w-1/2 max-w-[630px]  text-[36px] text-[#52595c]">
            <div>Sign In</div>

            {router.query.message && (
              <div className=" text-[14px] font-semibold  text-green-500">
                {router.query.message}
              </div>
            )}
            <Form className="">
              <TextField
                required
                type="text"
                name="username"
                placeholder="Enter your username"
              />

              <TextField
                required
                type="password"
                name="password"
                placeholder="Enter your password"
              />

              <button
                disabled={!formik.isValid}
                type="submit"
                className="mt-3 flex w-full items-center justify-center rounded-2xl bg-[#6489de] px-4 py-2 text-[12px] font-semibold text-white disabled:bg-slate-400 "
              >
                Submit
                <span className="pl-2">
                  <PaperAirplaneIcon className="h-4 rotate-90 text-base" />
                </span>
              </button>
              {error && (
                <div className="pt-3 text-[14px] font-semibold text-red-500">
                  {error}
                </div>
              )}
            </Form>
          </div>
        </div>
      )}
    </Formik>
  );
}

export default SignIn;
