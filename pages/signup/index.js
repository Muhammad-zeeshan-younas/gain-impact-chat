import React, { useContext, useState, useEffect } from "react";
import TextField from "../../components/textfield";
import { PaperAirplaneIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import bcrypt from "bcryptjs";
import { db } from "../../firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { AuthContext } from "../../context/authContext";

function SignUp() {
  const auth = useContext(AuthContext);
  const [error, setError] = useState("");

  const router = useRouter();
  useEffect(() => {
    if (auth.user) {
      router.replace("/");
    }
  }, [auth.user]);
  const signUpHandler = async (values) => {
    values.username = values.username.trim().toLocaleLowerCase();
    const hashedPassword = await bcrypt.hash(values.password, 10);
    setError("");
    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", values.username)
      );
      const user = await getDocs(q);

      if (user.docs.length === 0) {
        const userCollectionRef = collection(db, "users");
        let createdUser = await addDoc(userCollectionRef, {
          name: values.name,
          password: hashedPassword,
          email: values.email,
          username: values.username,
        }).then();
        let getUsers = await getDocs(collection(db, "users"));
        getUsers.docs.map(async (user) => {
          if (user.data().username !== values.username) {
            await addDoc(collection(db, "channels"), {
              members: [user.data().username, values.username],
              recentActivity: serverTimestamp(),
              username: [user.data().name, values.name],
            });
          }
        });
        router.push({
          pathname: "/signin",
          query: {
            message: "Successful, You are now registered",
          },
        });
      } else {
        throw Error("Username already exists");
      }
    } catch (error) {
      setError(error.message);

      return;
    }
  };
  const validate = Yup.object({
    name: Yup.string()
      .max(25, "Must be 25 characters or less")
      .required("Required")
      .matches(/^\S+(?: \S+)*$/, "Can not start or end with space")
      .min(3, "Must be 3 characters or more"),
    email: Yup.string().email("Email is invalid").required("Required"),
    username: Yup.string()
      .max(25, "Must be 25 characters or less")
      .required("Required")
      .matches(
        /^[a-zA-Z0-9]+$/,
        "* This field cannot contain white space and special character"
      ),
    password: Yup.string()

      .min(6, "Must be atleast 6 characters or more")
      .required("Required")
      .matches(/^(?=.*[a-z])/, "Must contain at least one lowercase character")
      .matches(/^(?=.*[A-Z])/, "Must contain at least one uppercase character")
      .matches(/^(?=.*[0-9])/, "Must contain at least one number")
      .matches(/^(?=.*[!@#%&])/, "Must contain at least one special character")
      .matches(/^\S*$/, "Can not have spaces"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });
  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
        confirm_password: "",
        name: "",
      }}
      validationSchema={validate}
      onSubmit={signUpHandler}
    >
      {(formik) => (
        <div className="flex h-screen flex-col items-center bg-[#FDFDFE] font-poppins">
          <header className=" heading h-[168px]   bg-[#E3F6FC]  text-[50px]  text-[#52585D] ">
            Gain Impact Chat
          </header>

          <div className="tag w-1/2 max-w-[630px]  text-[36px] text-[#52595c]">
            <div>Sign Up</div>

            <div></div>
            <Form className="">
              <TextField
                required
                type="text"
                name="name"
                placeholder="Enter your name"
              />
              <TextField
                required
                type="text"
                name="username"
                placeholder="Enter your username"
              />
              <TextField
                type="email"
                name="email"
                placeholder="Enter your email"
              />

              <TextField
                required
                type="password"
                name="password"
                placeholder="Enter your password"
              />
              <TextField
                required
                type="password"
                name="confirm_password"
                placeholder="Confirm password"
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

export default SignUp;
