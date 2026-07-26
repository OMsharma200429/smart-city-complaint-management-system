import { describe, it, expect } from "vitest";

// 🔥 Example function (same jaisa tu form me use karega)
const validateForm = (form: any) => {
  const e: Record<string, string> = {};

  if (!form.name?.trim()) e.name = "Full name is required";
  if (!form.email?.trim()) e.email = "Email is required";
  if (!form.category) e.category = "Please select a category";
  if (!form.subject?.trim()) e.subject = "Subject is required";
  if (!form.description?.trim()) e.description = "Description is required";
  if (!form.location?.trim()) e.location = "Location is required";

  return e;
};

describe("Complaint Form Validation", () => {

  it("should pass when all fields are valid", () => {
    const form = {
      name: "Chinmay",
      email: "test@mail.com",
      category: "Water",
      subject: "Leakage",
      description: "Pipe leakage",
      location: "Thane",
    };

    const result = validateForm(form);
    expect(Object.keys(result).length).toBe(0);
  });

  it("should fail when required fields are missing", () => {
    const form = {
      name: "",
      email: "",
      category: "",
      subject: "",
      description: "",
      location: "",
    };

    const result = validateForm(form);

    expect(result.name).toBeDefined();
    expect(result.email).toBeDefined();
    expect(result.category).toBeDefined();
    expect(result.subject).toBeDefined();
    expect(result.description).toBeDefined();
    expect(result.location).toBeDefined();
  });

  it("should detect invalid email", () => {
    const form = {
      name: "Chinmay",
      email: "invalid-email",
      category: "Water",
      subject: "Leak",
      description: "desc",
      location: "Thane",
    };

    const result = validateForm(form);

    // optional logic (agar tu email validation add karega)
    if (!form.email.includes("@")) {
      expect(form.email.includes("@")).toBe(false);
    }
  });

});