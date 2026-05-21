"use client";

import { useState } from "react";
import { z } from "zod";

const namePattern = /^[A-Za-zÆØÅæøå\-\s']+$/;

const baseSchema = z.object({
    guestName: z
      .string()
      .trim()
      .min(2, "Navn skal have mindst 2 tegn.")
      .max(60, "Navn må højst være 60 tegn.")
      .regex(namePattern, "Navn må kun indeholde bogstaver, mellemrum, apostrof og bindestreg."),
    guestEmail: z
      .string()
      .trim()
      .min(1, "E-mail er påkrævet.")
      .email("Indtast en gyldig e-mailadresse."),
    rating: z
      .coerce.number({ invalid_type_error: "Bedømmelse er påkrævet." })
      .int("Bedømmelsen skal være et helt tal.")
      .min(1, "Bedømmelsen skal være mindst 1.")
      .max(5, "Bedømmelsen kan ikke være over 5."),
    comment: z
      .string()
      .trim()
      .min(10, "Kommentaren skal have mindst 10 tegn.")
      .max(220, "Kommentaren må højst være 220 tegn.")
      .refine(
        (value) => !/(https?:\/\/|www\.)/i.test(value),
        "Kommentar må ikke indeholde links."
      ),
  });

const ratingSchema = baseSchema.superRefine((data, ctx) => {
    if (data.rating <= 2 && data.comment.trim().length < 30) {
      ctx.addIssue({
        code: "custom",
        path: ["comment"],
        message: "Ved 1-2 stjerner skal kommentaren være mindst 30 tegn.",
      });
    }
  });

const fieldSchemas = {
  guestName: baseSchema.pick({ guestName: true }),
  guestEmail: baseSchema.pick({ guestEmail: true }),
  rating: baseSchema.pick({ rating: true }),
  comment: baseSchema.pick({ comment: true }),
};

const initialValues = {
  guestName: "",
  guestEmail: "",
  rating: "5",
  comment: "",
};

export default function RatingForm({ hotelName }) {
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("");

  const getFieldError = (name, value) => {
    const parsed = fieldSchemas[name].safeParse({ [name]: value });

    if (parsed.success) {
      return "";
    }

    return parsed.error.flatten().fieldErrors[name]?.[0] || "Ugyldig værdi.";
  };

  const validateAll = (values) => {
    const parsed = ratingSchema.safeParse(values);

    if (parsed.success) {
      return { ok: true, data: parsed.data, fieldErrors: {} };
    }

    return {
      ok: false,
      data: null,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  };

  const setFieldError = (name, message) => {
    setErrors((prev) => {
      if (!message && !prev[name]) {
        return prev;
      }

      return {
        ...prev,
        [name]: message ? [message] : [],
      };
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      const fieldError = getFieldError(name, value);
      setFieldError(name, fieldError);
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const fieldError = getFieldError(name, value);
    setFieldError(name, fieldError);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setStatus("");

    const payload = {
      guestName: formValues.guestName,
      guestEmail: formValues.guestEmail,
      rating: formValues.rating,
      comment: formValues.comment,
    };

    const result = validateAll(payload);

    setTouched({
      guestName: true,
      guestEmail: true,
      rating: true,
      comment: true,
    });

    if (!result.ok) {
      setErrors(result.fieldErrors);
      setStatus("Ret venligst de markerede felter.");
      return;
    }

    setStatus(
      `Tak ${result.data.guestName}. Din bedømmelse på ${result.data.rating} stjerner for ${hotelName} er klar til at blive sendt.`
    );

    setFormValues(initialValues);
    setErrors({});
    setTouched({});
  };

  const fieldError = (name) => (errors[name] ? errors[name][0] : "");

  const inputClass = (name) =>
    `rounded-xl border bg-text-light px-3 py-2.5 text-sm text-foreground outline-none ring-0 transition ${
      fieldError(name) ? "border-rose-500 focus:border-rose-500" : "border-border-soft focus:border-accent"
    }`;

  return (
    <section className="section-card soft-shadow rounded-2xl p-6 sm:p-8">
      <h2 className="font-display text-3xl sm:text-4xl leading-tight text-primary">Bedøm dit seneste ophold</h2>
      <p className="mt-2 text-xs sm:text-sm text-ink-muted">
        Du bedømmer {hotelName}. Denne skabelon validerer på klienten med Zod, før data
        sendes til et API.
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-5 grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2">
        <label className="grid gap-1.5 text-xs sm:text-sm font-semibold tracking-[0.01em] text-foreground sm:col-span-1">
          Gæstens navn
          <input
            name="guestName"
            type="text"
            placeholder="Anna Jensen"
            value={formValues.guestName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass("guestName")}
            aria-invalid={Boolean(fieldError("guestName"))}
          />
          {fieldError("guestName") ? (
            <span className="text-xs text-rose-700">{fieldError("guestName")}</span>
          ) : null}
        </label>

        <label className="grid gap-1.5 text-xs sm:text-sm font-semibold tracking-[0.01em] text-foreground sm:col-span-1">
          E-mail
          <input
            name="guestEmail"
            type="email"
            placeholder="anna@eksempel.dk"
            value={formValues.guestEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass("guestEmail")}
            aria-invalid={Boolean(fieldError("guestEmail"))}
          />
          {fieldError("guestEmail") ? (
            <span className="text-xs text-rose-700">{fieldError("guestEmail")}</span>
          ) : null}
        </label>

        <label className="grid gap-1.5 text-xs sm:text-sm font-semibold tracking-[0.01em] text-foreground sm:col-span-1">
          Bedømmelse (1-5)
          <input
            name="rating"
            type="number"
            min="1"
            max="5"
            step="1"
            value={formValues.rating}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass("rating")}
            aria-invalid={Boolean(fieldError("rating"))}
          />
          {fieldError("rating") ? (
            <span className="text-xs text-rose-700">{fieldError("rating")}</span>
          ) : null}
        </label>

        <label className="grid gap-1.5 text-xs sm:text-sm font-semibold tracking-[0.01em] text-foreground sm:col-span-2">
          Kommentar
          <textarea
            name="comment"
            rows="4"
            placeholder="Fortæl om værelset, servicen og beliggenheden..."
            value={formValues.comment}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${inputClass("comment")} resize-none`}
            aria-invalid={Boolean(fieldError("comment"))}
          />
          {fieldError("comment") ? (
            <span className="text-xs text-rose-700">{fieldError("comment")}</span>
          ) : null}
        </label>

        <button
          type="submit"
          className="btn-secondary mt-2 inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition"
        >
          Valider og send
        </button>
      </form>

      {status ? (
        <p className="mt-4 rounded-lg border border-border-soft bg-text-light px-3 py-2 text-sm text-foreground">
          {status}
        </p>
      ) : null}
    </section>
  );
}
