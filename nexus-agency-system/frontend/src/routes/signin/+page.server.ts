import { redirect } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";

export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();

    if (data.get("password") !== data.get("confirmedPassword")) {
      return fail(400, {
        error: "Passwords do not match",
      });
    }
    
    try {
      const response = await fetch("http://localhost:42069/nexus/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
          first_Name: data.get("firstName"),
          last_Name: data.get("lastName"),
          country: data.get("originCountry"),
          passport: data.get("passportNumber"),
          age: data.get("age"),
        }),
      });
      const result = await response.json();
      console.log(result.token)

      if (result.error) {
        throw new Error(result.error);
      }

      // const token = sign(result, JWT_SECRET);

      cookies.set("token", result.token, { path: "/" });
    } catch (error) {
      if (error instanceof Error) {
        return fail(500, {
          error: error.message,
        });
      }
    }
    redirect(303, "/");
  },
};
