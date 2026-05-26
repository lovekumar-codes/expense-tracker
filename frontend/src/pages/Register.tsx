
import { useState } from "react";
import {
  registerUser,
} from "../services/auth.services";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import toast from "react-hot-toast";

import ButtonLoader from "../components/common/ButtonLoder";

import {
  User,
  Mail,
  Lock,
  ShieldCheck,
} from "lucide-react";

const Register = () => {

  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
    useState<any>({});

  const handleChange = (
    e: any
  ) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const validate = () => {

    const newErrors: any = {};

    if (!form.name) {
      newErrors.name =
        "Name is required";
    } else if (
      form.name.length < 3
    ) {
      newErrors.name =
        "Name must be at least 3 characters";
    }

    if (!form.email) {
      newErrors.email =
        "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        form.email
      )
    ) {
      newErrors.email =
        "Invalid email";
    }

    if (!form.password) {
      newErrors.password =
        "Password is required";
    } else if (
      form.password.length < 6
    ) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (
      form.confirmPassword !==
      form.password
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  const handleSubmit =
    async (e: any) => {

      e.preventDefault();

      if (!validate())
        return;

      try {

        setLoading(true);

        await registerUser({
          name: form.name,
          email: form.email,
          password:
            form.password,
        });

        toast.success(
          "Account created successfully"
        );

        navigate("/login");

      } catch (err: any) {

        toast.error(
          err.response?.data
            ?.message ||
            "Registration failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-black px-4 relative overflow-hidden">

      {/* BACKGROUND BLUR */}

      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-3xl" />

      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-3xl" />

      {/* CARD */}

      <div className="w-full max-w-md relative z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-8">

        {/* HEADER */}

        <div className="text-center mb-8">

          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-xl mb-5">

            <ShieldCheck
              size={36}
              className="text-white"
            />

          </div>

          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">

            Create Account

          </h1>

          <p className="text-slate-500 dark:text-slate-400">

            Start managing your expenses professionally

          </p>
        </div>

        {/* FORM */}

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-5"
        >

          {/* NAME */}

          <div>

            <div className="relative">

              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={
                  form.name
                }
                onChange={
                  handleChange
                }
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {errors.name && (
              <p className="text-red-500 text-sm mt-2">
                {errors.name}
              </p>
            )}
          </div>

          {/* EMAIL */}

          <div>

            <div className="relative">

              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={
                  form.email
                }
                onChange={
                  handleChange
                }
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {errors.email && (
              <p className="text-red-500 text-sm mt-2">
                {errors.email}
              </p>
            )}
          </div>

          {/* PASSWORD */}

          <div>

            <div className="relative">

              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={
                  form.password
                }
                onChange={
                  handleChange
                }
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-2">
                {
                  errors.password
                }
              </p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}

          <div>

            <div className="relative">

              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={
                  form.confirmPassword
                }
                onChange={
                  handleChange
                }
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-2">
                {
                  errors.confirmPassword
                }
              </p>
            )}
          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={
              loading
            }
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-semibold shadow-lg"
          >

            {loading ? (
              <ButtonLoader />
            ) : (
              "Create Account"
            )}

          </button>

          {/* LOGIN */}

          <p className="text-center text-slate-500 dark:text-slate-400 mt-5">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
