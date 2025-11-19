import React, { useState } from "react";
import { CommonForm } from "../../components/common/form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/auth-slice";
import { useToast } from "@/hooks/use-toast";

// ---------------------------
// Login Form Controls
// ---------------------------
// Note: Autocomplete OFF is handled inside the CommonForm component now.
const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

const initialState = { email: "", password: "" };

const AuthLogin = () => {
  const [formData, setFormData] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast(); // Destructure toast hook

  // ---------------------------
  // Submit handler
  // ---------------------------
  const handleSubmit = async (data = formData) => {
    setSubmitting(true);
    console.log("[Debug] Submitting login data:", data);

    try {
      const resultAction = await dispatch(loginUser(data));
      console.log("[Debug] Login ResultAction:", resultAction);

      // Check if the action was fulfilled
      if (loginUser.fulfilled.match(resultAction)) {
        const payload = resultAction.payload;

        if (payload?.success) {
          // Success Toast
          toast({ title: payload.message || "Login Successful" });

          // Redirect based on user role
          if (payload.user?.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/shop/home");
          }
        } else {
          // Server-side reported failure (e.g., incorrect password but 200/400 response)
          toast({
            title: payload?.message || "Login failed (server error)",
            variant: "destructive",
          });
        }

      // Check if the action was rejected (Network error, 401/404/500 etc.)
      } else if (loginUser.rejected.match(resultAction)) {
        // Extract error message from payload (if provided by rejectWithValue) or error object
        const errorMsg =
          resultAction.payload || 
          resultAction.error?.message || 
          "Login failed due to a network or server issue.";

        toast({ title: errorMsg, variant: "destructive" });
      }

    } catch (err) {
      console.error("[Debug] Login Error:", err);
      // Catching unexpected synchronous errors
      toast({ title: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      // Submitting state ko hamesha reset karein
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-neutral-900/80 backdrop-blur-md border border-neutral-700 rounded-2xl p-8 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-amber-400">Welcome Back</h1>
        <p className="text-gray-400 mt-2 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/auth/register"
            className="text-amber-400 hover:text-amber-300 underline"
          >
            Register
          </Link>
        </p>
      </div>

      {/* Login Form */}
      <CommonForm
        formControls={loginFormControls}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit} 
        // Button disable karna zaroori hai submitting ke dauran
        buttonDisabled={submitting} 
        buttonText={submitting ? "Signing In..." : "Sign In"}
      />
    </div>
  );
};

export default AuthLogin;