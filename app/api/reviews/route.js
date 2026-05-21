import { z } from "zod";
import { NextResponse } from "next/server";
import { addReview, getAllReviews, getReviewsByHotelSlug } from "@/lib/reviewsServer";
import { getHotelBySlug } from "@/lib/hotels";

const namePattern = /^[A-Za-zÆØÅæøå\-\s']+$/;

const reviewSchema = z
  .object({
    hotelSlug: z.string().trim().min(1, "Vælg et hotel."),
    guestName: z
      .string()
      .trim()
      .min(2, "Navn skal have mindst 2 tegn.")
      .max(60, "Navn må højst være 60 tegn.")
      .regex(namePattern, "Navn må kun indeholde bogstaver, mellemrum, apostrof og bindestreg."),
    guestEmail: z.string().trim().min(1, "E-mail er påkrævet.").email("Indtast en gyldig e-mailadresse."),
    rating: z.coerce.number().int().min(1).max(5),
    comment: z
      .string()
      .trim()
      .min(10, "Kommentaren skal have mindst 10 tegn.")
      .max(220, "Kommentaren må højst være 220 tegn.")
      .refine((value) => !/(https?:\/\/|www\.)/i.test(value), "Kommentar må ikke indeholde links."),
  })
  .superRefine((data, ctx) => {
    if (data.rating <= 2 && data.comment.trim().length < 30) {
      ctx.addIssue({
        code: "custom",
        path: ["comment"],
        message: "Ved 1-2 stjerner skal kommentaren være mindst 30 tegn.",
      });
    }
  });

export const runtime = "nodejs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const hotelSlug = searchParams.get("hotelSlug");

  const reviews = hotelSlug ? await getReviewsByHotelSlug(hotelSlug) : await getAllReviews();

  return NextResponse.json({ reviews });
}

export async function POST(request) {
  const payload = await request.json();
  const result = reviewSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      {
        ok: false,
        errors: result.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const hotel = getHotelBySlug(result.data.hotelSlug);

  if (!hotel) {
    return NextResponse.json(
      {
        ok: false,
        errors: {
          hotelSlug: ["Ugyldig hotel-reference."],
        },
      },
      { status: 400 }
    );
  }

  const createdReview = {
    id: crypto.randomUUID(),
    hotelSlug: result.data.hotelSlug,
    author: result.data.guestName,
    email: result.data.guestEmail,
    rating: result.data.rating,
    text: result.data.comment,
    date: new Date().toISOString(),
  };

  await addReview(createdReview);

  return NextResponse.json({ ok: true, review: createdReview });
}
