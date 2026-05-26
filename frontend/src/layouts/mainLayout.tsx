import {
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Wallet,
  BarChart3,
  Receipt,
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

const MainLayout = () => {
  const [darkMode, setDarkMode] =
    useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(
  localStorage.getItem("user") || "{}"
);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme");

    const root =
      window.document.documentElement;

    if (savedTheme === "dark") {
      setDarkMode(true);
      root.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const root =
      window.document.documentElement;

    const newTheme = !darkMode;

    setDarkMode(newTheme);

    if (newTheme) {
      root.classList.add("dark");

      localStorage.setItem(
        "theme",
        "dark"
      );
    } else {
      root.classList.remove("dark");

      localStorage.setItem(
        "theme",
        "light"
      );
    }
  };

  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },

    {
      name: "Expenses",
      path: "/expenses",
      icon: <Receipt size={20} />,
    },

    {
      name: "Budget",
      path: "/budget",
      icon: <Wallet size={20} />,
    },

    {
      name: "Reports",
      path: "/reports",
      icon: <BarChart3 size={20} />,
    },
  ];

  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  navigate("/login");
};

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] dark:bg-gradient-to-br dark:from-[#020617] dark:to-[#111827] transition-all duration-300">
<button
  onClick={() =>
    setSidebarOpen(!sidebarOpen)
  }
  className="
    lg:hidden fixed top-5 left-5 z-[60]
    bg-blue-600 text-white
    p-3 rounded-xl shadow-lg
  "
>
  {sidebarOpen ? (
    <X size={22} />
  ) : (
    <Menu size={22} />
  )}
</button>

{/* MOBILE OVERLAY */}

{sidebarOpen && (
  <div
    onClick={() =>
      setSidebarOpen(false)
    }
    className="
      fixed inset-0 bg-black/50
      z-40 lg:hidden
      backdrop-blur-sm
    "
  />
)}
      {/* SIDEBAR */}

  <div
  className={`
    fixed lg:sticky top-0 left-0 z-50
    w-[270px] min-h-screen
    border-r border-slate-200 dark:border-slate-800
    bg-white/90 dark:bg-slate-900/80
    backdrop-blur-xl p-6
    transition-all duration-300

    ${
      sidebarOpen
        ? "translate-x-0"
        : "-translate-x-full lg:translate-x-0"
    }
  `}
>

        {/* LOGO */}

        <h1 className="text-4xl font-extrabold text-blue-600 mb-10 tracking-tight">
          ExpensePro
        </h1>

        <div className="mb-8">
  <p className="text-slate-500 text-sm">
    Welcome
  </p>

  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
    {user?.name || "User"}
  </h2>
</div>

        {/* THEME BUTTON */}

        <button
          onClick={toggleTheme}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold mb-8 transition-all duration-300 shadow-md

          ${
            darkMode
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:scale-[1.02]"
              : "bg-slate-900 text-white hover:bg-slate-800"
          }
          `}
        >
          {darkMode ? (
            <>
              <Sun size={18} />
              Light Mode
            </>
          ) : (
            <>
              <Moon size={18} />
              Dark Mode
            </>
          )}
        </button>

        {/* MENU */}

        <div className="space-y-3">

          {menu.map((item) => {
            const active =
              location.pathname ===
              item.path;

            return (
             <Link
  key={item.path}
  to={item.path}
  onClick={() =>
    setSidebarOpen(false)
  }
                className={`flex items-center gap-3 px-4 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]

                ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }
                `}
              >
                {item.icon}
               {active && (
  <div className="w-1 h-6 rounded-full bg-white" />
)}
                <span>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* LOGOUT */}

        <button
          onClick={logout}
          className="mt-10 flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* CONTENT */}
<div className="flex-1 p-5 lg:p-10 lg:ml-0 text-slate-900 dark:text-white transition-all duration-300 page-animation">

        <Outlet
          context={{
            darkMode,
          }}
        />
      </div>
    </div>
  );
};

export default MainLayout;