import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { student } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import dayjs from "dayjs";

const studentRouter = new Hono();

studentRouter.get("/", async (c) => {
  const allstudent = await drizzle.select().from(student);
  return c.json(allstudent);
});

studentRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const result = await drizzle.query.student.findFirst({
    where: eq(student.id, id),
  });
  if (!result) {
    return c.json({ error: "student not found" }, 404);
  }
  return c.json(result);
});

studentRouter.post(
  "/",
  zValidator(
    "json",
    z.object({
      fname: z.string().min(1),
      lname: z.string().min(1),
      studentid: z.string().min(1),
      birthday: z.string().min(1),
      gender: z.string().min(1),
    })
  ),
  async (c) => {
    const { fname,lname,studentid,birthday,gender, } = c.req.valid("json");
    const result = await drizzle
      .insert(student)
      .values({
        fname,
        lname,
        studentid,
        birthday,
        gender,
      })
      .returning();
    return c.json({ success: true, book: result[0] }, 201);
  }
);

studentRouter.patch(
  "/:id",
  zValidator(
    "json",
    z.object({
      title: z.string().min(1).optional(),
      author: z.string().min(1).optional(),
      publishedAt: z.iso
        .datetime({
          offset: true,
        })
        .optional()
        .transform((data) => (data ? dayjs(data).toDate() : undefined)),
      genreId: z.number().int().optional().nullable().optional(),
    })
  ),
  async (c) => {
    const id = Number(c.req.param("id"));
    const data = c.req.valid("json");
    const updated = await drizzle.update(student).set(data).where(eq(student.id, id)).returning();
    if (updated.length === 0) {
      return c.json({ error: "student not found" }, 404);
    }
    return c.json({ success: true, book: updated[0] });
  }
);

studentRouter.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const deleted = await drizzle.delete(student).where(eq(student.id, id)).returning();
  if (deleted.length === 0) {
    return c.json({ error: "student not found" }, 404);
  }
  return c.json({ success: true, book: deleted[0] });
});

export default studentRouter;
