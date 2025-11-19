import React, { useState } from "react";
import { CommonForm } from "../../components/common/form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "@/store/auth-slice";
import { useToast } from "@/hooks/use-toast";

// ---------------------------------------
// Registration Form Controls (6 Fields)
// ---------------------------------------
const registerFormControls = [
  {
    name: "userName",
    label: "Username",
    placeholder: "Enter your username",
    componentType: "input",
    type: "text", // Explicitly set type
  },
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
    label: "Password (Min 8 characters)",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Re-enter your password",
    componentType: "input",
    type: "password",
  },
  {
    name: "role",
    label: "Role Selection",
    placeholder: "Select your role",
    componentType: "select",
    options: [
      { id: "user", label: "User (Default)" },
      { id: "seller", label: "Seller/Vendor" },
    ],
  },
  {
    name: "isNotRobot",
    label: "I am not a robot",
    placeholder: "Please confirm the checkbox",
    componentType: "input",
    type: "checkbox",
  },
];

// ---------------------------------------
// Initial State (matching 6 fields)
// ---------------------------------------
const initialState = {
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "user", // Default value
  isNotRobot: false,
};

// ---------------------------------------
const AuthRegister = () => {
  const [formData, setFormData] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // ---------------------------------------
  // Submit handler
  // ---------------------------------------
  const handleSubmit = async (data = formData) => {
    setSubmitting(true);
    console.log("[Debug] Submitting registration data:", data);

    // 1. Client-Side Validation: Password Match Check
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Password and Confirm Password must match.",
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }

    // 2. Client-Side Validation: Minimum Length Check (optional, but good practice)
    if (data.password.length < 8) {
        toast({
            title: "Password Too Short",
            description: "Password must be at least 8 characters long.",
            variant: "destructive",
        });
        setSubmitting(false);
        return;
    }

    // 3. Client-Side Validation: CAPTCHA Check
    if (!data.isNotRobot) {
        toast({
            title: "CAPTCHA Required",
            description: "Please confirm you are not a robot.",
            variant: "destructive",
        });
        setSubmitting(false);
        return;
    }


    try {
      // .unwrap() automatically handles rejected state and throws the payload/error
      const payload = await dispatch(registerUser(data)).unwrap();

      if (payload?.success) {
        toast({ title: payload.message || "Registration Successful" });
        // Successful registration ke baad Login page par redirect
        navigate("/auth/login");
      } else {
        // Fallback for non-error server responses that indicate failure
        toast({
          title: payload?.message || "Registration failed",
          variant: "destructive",
        });
      }
    } catch (err) {
      // This catches errors rejected by the thunk (e.g., network, 400/500 from server)
      const errorMsg = err.message || "Unexpected server error occurred.";
      toast({
        title: errorMsg,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-neutral-900/80 backdrop-blur-md border border-neutral-700 rounded-2xl p-8 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-amber-400">Create Account</h1>
        <p className="text-gray-400 mt-2 text-sm">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-amber-400 hover:text-amber-300 underline"
          >
            Login
          </Link>
        </p>
      </div>

      {/* Registration Form */}
      <CommonForm
        formControls={registerFormControls}
        formData={formData}
        setFormData={setFormData}
        buttonText={submitting ? "Signing Up..." : "Sign Up"}
        onSubmit={handleSubmit}
        showButton
        buttonDisabled={submitting}
      />
      {/* Note: Password Strength Bar logic is now in CommonForm.jsx */}
    </div>
  );
};

export default AuthRegister;