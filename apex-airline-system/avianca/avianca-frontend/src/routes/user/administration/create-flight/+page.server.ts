import { redirect } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import {
  toCalendarDateTime,
  parseTime,
  parseDate,
} from "@internationalized/date";

export function load({ locals }) {
  return {
    user: locals.user,
  };
}

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    for (const [key, value] of data) {
      if (value === "" || value === "undefined") {
        return fail(400, {
          error: "Please fill in all the fields",
        });
      }
      console.log(key, value);
    }

    try {
      const departureDate = toCalendarDateTime(
        parseDate(data.get("departureDay")),
        parseTime(data.get("departureTime"))
      );

      const arrivalDate = toCalendarDateTime(
        parseDate(data.get("arrivalDay")),
        parseTime(data.get("arrivalTime"))
      );

      if (departureDate.compare(arrivalDate) > 0) {
        return fail(400, {
          error: "Arrival date must be after departure date",
        });
      }

      const response = await fetch("http://localhost:8080/create-flight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originCity: data.get("originCity"),
          destinationCity: data.get("destinationCity"),
          type: data.get("type"),
          departureDate: departureDate.toString(),
          arrivalDate: arrivalDate.toString(),
        }),
      });
      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }
    } catch (error) {
      if (error instanceof Error) {
        return fail(500, {
          error: error.message,
        });
      }
    }
    redirect(303, "/user/administration");
  },
};