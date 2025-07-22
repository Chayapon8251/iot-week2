import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";

export const student = t.pgTable("student", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  fname: t
    .varchar({
      length: 255,
    })
    .notNull(),
  lname: t
    .varchar({
      length: 255,
    })
    .notNull(),
  studentid: t
    .varchar({
      length: 255,
    })
    .notNull().unique(),
  birthday: t
    .varchar({
      length: 255,
    })
    .notNull(),
  gender: t
    .varchar({
      length: 255,
    })
    .notNull()


});

