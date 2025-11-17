import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";

// Debug helper
const debugLog = (label, data) => console.log(`[CommonForm] ${label}:`, data);

export const CommonForm = ({
  formControls = [],
  formData = {},
  setFormData,
  buttonText = "Submit",
  showButton = true,
  onSubmit,
}) => {
  // Detect Register page via field presence
  const isRegisterPage = !!formControls.find((c) => c.name === "userName");

  // -----------------------------
  // Password Strength Calculator
  // -----------------------------
  const getPasswordStrength = (password) => {
    let score = 0;

    if (!password) return { score: 0, label: "Enter password", color: "bg-neutral-700" };
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
      { label: "Very Weak", color: "bg-red-600" },
      { label: "Weak", color: "bg-orange-500" },
      { label: "Medium", color: "bg-yellow-500" },
      { label: "Strong", color: "bg-green-500" },
      { label: "Very Strong", color: "bg-emerald-600" },
    ];

    return {
      score,
      label: levels[score - 1]?.label || "Very Weak",
      color: levels[score - 1]?.color || "bg-red-600",
    };
  };

  // -----------------------------
  // Handles input & file changes
  // -----------------------------
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    const newValue = type === "file" ? files[0] : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    debugLog(`Field Changed: ${name}`, newValue);
  };

  // -----------------------------
  // Form submit
  // -----------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSubmit === "function") onSubmit(formData);
  };

  // -----------------------------
  // Render Input control
  // -----------------------------
  const renderInput = (control) => {
    const { componentType, name, label, placeholder, type, options } = control;
    const value = formData[name] ?? "";

    switch (componentType) {
      case "input": {
        const isPassword = type === "password";
        const isVisible = formData[`${name}Show`] || false;

        return (
          <div className="relative">
            <Input
              id={name}
              name={name}
              type={isPassword ? (isVisible ? "text" : "password") : type}
              placeholder={placeholder}
              value={value}
              onChange={handleChange}
              className="bg-neutral-800 text-white border border-neutral-700 rounded px-3 py-2 pr-10 focus:border-amber-400 focus:ring-amber-400"
            />

            {/* Password Visibility Toggle */}
            {isPassword && (
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    [`${name}Show`]: !prev[`${name}Show`],
                  }))
                }
                className="absolute right-3 top-2 text-gray-200 hover:text-gray-100 transition"
              >
                {isVisible ? (
                  <EyeOff size={19} className="text-black/60" />
                ) : (
                  <Eye size={19} className="text-black/60" />
                )}
              </button>
            )}

            {/* Password Strength Bar — REGISTER ONLY */}
            {isPassword && value && isRegisterPage && (
              <PasswordStrengthBar
                password={value}
                getPasswordStrength={getPasswordStrength}
              />
            )}
          </div>
        );
      }

      case "textarea":
        return (
          <Textarea
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            className="bg-neutral-800 text-white border border-neutral-700 rounded px-3 py-2"
          />
        );

      case "select":
        return (
          <Select
            value={value || ""}
            onValueChange={(val) =>
              setFormData((prev) => ({ ...prev, [name]: val }))
            }
          >
            <SelectTrigger className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 text-gray-200">
              {options?.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "file":
        return (
          <Input
            id={name}
            name={name}
            type="file"
            onChange={handleChange}
            className="bg-neutral-800 text-white border border-neutral-700 rounded px-3 py-2"
          />
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formControls.map((control) => (
        <div key={control.name} className="flex flex-col gap-1">
          <Label htmlFor={control.name} className="text-gray-300 font-medium">
            {control.label}
          </Label>
          {renderInput(control)}
        </div>
      ))}

      {showButton && (
        <Button
          type="submit"
          className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 rounded"
        >
          {buttonText}
        </Button>
      )}
    </form>
  );
};

// --------------------------------------------------
// PASSWORD STRENGTH BAR (Register Only)
// --------------------------------------------------
const PasswordStrengthBar = ({ password, getPasswordStrength }) => {
  const strength = getPasswordStrength(password);

  return (
    <div className="mt-2">
      <div className="w-full h-2 bg-neutral-700 rounded">
        <div
          className={`h-2 rounded transition-all duration-300 ${strength.color}`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        ></div>
      </div>

      <p className="text-sm mt-1 text-gray-300">{strength.label}</p>
    </div>
  );
};
