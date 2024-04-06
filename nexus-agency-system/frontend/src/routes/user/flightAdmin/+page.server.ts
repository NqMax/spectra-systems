import { fail, redirect } from "@sveltejs/kit";
export function load({ locals, url }) {
  const userId = locals.user.userId;
  const user = locals.user;
  async function getUserFlights() {
    const response = await fetch(
      `http://localhost:42069/nexus/flights/user/${userId}`,
      {
        method: "GET"
      }
    );
    const result = await response.json();
    return result;
  }

  return {
    user: user,
    flights: getUserFlights(),
  };
}

export const actions = {
  cancelReservation: async ({ request, cookies, locals }) => {
    const data = await request.formData();
    const token = cookies.get('token');
    const id = data.get("id")
    try {
      const response = await fetch(`http://localhost:42069/nexus/flights/deactivateTicket/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`

        }
      });
      if (response.status === 403) {
        // Redirect user to login page
        console.log(response.status)
        return { status: 403, redirect: '/login' };
      }

      const result = await response.json();
      return { status: 200, redirect: '/user' };

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
  },
};