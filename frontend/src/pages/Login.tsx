import { useState } from "react";
import { loginUser } from "../services/auth.services";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import ButtonLoader from "../components/common/ButtonLoder";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
  email: "",
  password: "",
});

const [loading, setLoading] =
  useState(false);

const [errors, setErrors] =
  useState<any>({});

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const validate = () => {
  const newErrors: any = {};

  if (!form.email) {
    newErrors.email =
      "Email is required";
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
      form.email
    )
  ) {
    newErrors.email =
      "Invalid email address";
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

  setErrors(newErrors);

  return Object.keys(newErrors)
    .length === 0;
};

const handleSubmit = async (
  e: any
) => {
  e.preventDefault();

  if (!validate()) return;

  try {
    setLoading(true);

    const res = await loginUser(
      form
    );

    localStorage.setItem(
      "token",
      res.data.data.token
    );

    localStorage.setItem(
  "user",
  JSON.stringify(res.data.data.user)
);toast.success(
  "login successful"
)

    navigate("/dashboard");
  } catch (err: any) {
    toast.error(
      err.response?.data?.message ||
        "Login Failed"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-black px-4">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800"
      >
        <h1 className="text-3xl font-bold text-center mb-2 text-slate-900 dark:text-white">
          Welcome Back
        </h1>

        <p className="text-center text-slate-500 dark:text-slate-400 mb-8">
          Login to your account
        </p>

        {/* EMAIL */}

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent outline-none mb-4 text-slate-900 dark:text-white"
        />
        {errors.email && (
  <p className="text-red-500 text-sm mt-2">
    {errors.email}
  </p>
)}

        {/* PASSWORD */}

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent outline-none mb-6 text-slate-900 dark:text-white"
        />
        {errors.password && (
  <p className="text-red-500 text-sm mt-2">
    {errors.password}
  </p>
)}

        {/* BUTTON */}

       <button
  type="submit"
  disabled={loading}
  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white py-4 rounded-xl font-semibold"
>
  {loading ? (
  <ButtonLoader />
) : (
  "Login"
)}
</button>

        {/* REGISTER */}

        <p className="text-center text-slate-500 dark:text-slate-400 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;