import React, { useState } from "react";
import { CommonForm } from "../../components/common/form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "@/store/auth-slice";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

// ---------------------------------------
// Registration Form Controls
// ---------------------------------------
const registerFormControls = [
  {
    name: "userName",
    label: "Username",
    placeholder: "Enter your username",
    componentType: "input",
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
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

// ---------------------------------------
const initialState = {
  userName: "",
  email: "",
  password: "",
  passwordShow: false, // For eye toggle
};

// ---------------------------------------
const AuthRegister = () => {
  const [formData, setFormData] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // ---------------------------------------
  // Password Strength Logic
  // ---------------------------------------
  const getStrengthScore = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const getStrengthLabel = (score) => {
    if (score <= 2) return "Weak";
    if (score === 3) return "Medium";
    return "Strong";
  };

  const getStrengthColor = (score) => {
    if (score <= 2) return "bg-red-500";
    if (score === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const score = getStrengthScore(formData.password);
  const strengthLabel = getStrengthLabel(score);
  const strengthColor = getStrengthColor(score);

  // ---------------------------------------
  // Submit handler
  // ---------------------------------------
  const handleSubmit = async (data = formData) => {
    setSubmitting(true);

    if (score < 3) {
      toast({
        title: "Weak Password",
        description: "Use at least 8 characters with upper, lower, numbers, symbols.",
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }

    try {
      const payload = await dispatch(registerUser(data)).unwrap();

      if (payload?.success) {
        toast({ title: payload.message });
        navigate("/auth/login");
      } else {
        toast({
          title: payload?.message || "Registration failed",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: err?.message || "Unexpected error occurred",
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

      {/* Password Strength Bar */}
      {formData.password && (
        <div className="mt-4">
          <div className="h-2 w-full bg-neutral-700 rounded">
            <div
              className={`h-2 rounded ${strengthColor}`}
              style={{ width: `${(score / 5) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1 text-gray-300">
            Password Strength: <span className="font-bold">{strengthLabel}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthRegister;
