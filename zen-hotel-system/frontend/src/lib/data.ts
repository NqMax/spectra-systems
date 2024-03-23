import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

export async function getLocations() {
  try {
    const database = client.db(process.env.DB_NAME);
    const locationsCollection = database.collection<HotelLocation>("locations");

    const result = locationsCollection.find();

    const locations = [];
    for await (const location of result) {
      locations.push({ ...location, _id: location._id.toString() });
    }

    return locations;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to Retrieve Cities");
  }
}

export async function getHotels() {
  try {
    const database = client.db(process.env.DB_NAME);
    const hotelsCollection = database.collection<Hotel>("hotels");

    const result = hotelsCollection.find();

    const hotels = [];
    for await (const hotel of result) {
      const commentaries = generateCommentaryTree(hotel.commentaries);

      hotels.push({ ...hotel, _id: hotel._id.toString(), commentaries });
    }

    return hotels;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to Retrieve Hotels");
  }
}

export async function getHotelById(id: string) {
  try {
    const database = client.db(process.env.DB_NAME);
    const hotelsCollection = database.collection("hotels");

    const result = await hotelsCollection.findOne({ _id: new ObjectId(id) });

    if (!result) {
      throw new Error("Hotel not found");
    }

    const hotel = { ...result, _id: result._id.toString() };

    return hotel as Hotel;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to Retrieve Hotel");
  }
}

export async function getCities() {
  try {
    const database = client.db(process.env.DB_NAME);
    const citiesCollection = database.collection("locations");

    const cities = await citiesCollection.distinct("city");

    return cities;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to Retrieve Cities");
  }
}

export async function getFilteredHotels(searchParams: HotelSearchParams) {
  try {
    const database = client.db(process.env.DB_NAME);
    const hotelsCollection = database.collection<Hotel>("hotels");

    const result = hotelsCollection.find({
      "location.city": searchParams.location,
      // guests: { $gte: searchParams.guests },
    });

    const hotels = [];
    for await (const hotel of result) {
      const commentaries = generateCommentaryTree(hotel.commentaries);

      hotels.push({ ...hotel, _id: hotel._id.toString(), commentaries });
    }

    return hotels;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to Retrieve Hotels");
  }
}

export async function getUsers() {
  try {
    const database = client.db(process.env.DB_NAME);
    const usersCollection = database.collection<User>("users");

    const result = usersCollection.find();

    const users = [];
    for await (const user of result) {
      users.push({ ...user, _id: user._id.toString() });
    }

    return users;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to Retrieve Users");
  }
}

export async function getUserById(id: string) {
  try {
    const database = client.db(process.env.DB_NAME);
    const usersCollection = database.collection("users");

    const result = await usersCollection.findOne({ _id: new ObjectId(id) });

    if (!result) {
      throw new Error("User not found");
    }

    const user = { ...result, _id: result._id.toString() };

    return user as User;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to Retrieve User");
  }
}

export async function getReservations() {
  try {
    const database = client.db(process.env.DB_NAME);
    const reservationsCollection = database.collection("reservations");

    const result = reservationsCollection.aggregate([
      {
        $lookup: {
          from: "hotels",
          localField: "hotelId",
          foreignField: "_id",
          as: "hotel",
        },
      },
      {
        $unwind: "$hotel",
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $addFields: {
          _id: { $toString: "$_id" },
          userId: { $toString: "$userId" },
          hotelId: { $toString: "$hotelId" },
          "hotel._id": { $toString: "$hotel._id" },
          "user._id": { $toString: "$user._id" },
        },
      },
    ]);

    const reservations = [];
    for await (const reservation of result) {
      const commentaries = generateCommentaryTree(
        reservation.hotel.commentaries
      );

      reservations.push({
        ...reservation,
        hotel: { ...reservation.hotel, commentaries: commentaries },
      });
    }

    return reservations as Reservation[];
  } catch (e) {
    console.log(e);
    throw new Error("Failed to Retrieve Reservations");
  }
}

export async function getUserReservations(userId: string) {
  try {
    const database = client.db(process.env.DB_NAME);
    const reservationsCollection = database.collection("reservations");

    const result = reservationsCollection.aggregate([
      {
        $match: {
          userId: new ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "hotels",
          localField: "hotelId",
          foreignField: "_id",
          as: "hotel",
        },
      },
      {
        $unwind: "$hotel",
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $addFields: {
          _id: { $toString: "$_id" },
          userId: { $toString: "$userId" },
          hotelId: { $toString: "$hotelId" },
          "hotel._id": { $toString: "$hotel._id" },
          "user._id": { $toString: "$user._id" },
        },
      },
    ]);

    const reservations = [];
    for await (const reservation of result) {
      const commentaries = generateCommentaryTree(
        reservation.hotel.commentaries
      );

      reservations.push({
        ...reservation,
        hotel: { ...reservation.hotel, commentaries: commentaries },
      });
    }

    return reservations as Reservation[];
  } catch (e) {
    console.log(e);
    throw new Error("Failed to Retrieve Reservations");
  }
}

const generateCommentaryTree = function (
  commentaries: Commentary[],
  parentId: string | "" = ""
) {
  const result = [];

  for (const commentary of commentaries) {
    if (commentary.parentId === parentId) {
      const children = generateCommentaryTree(commentaries, commentary._id);
      if (children.length) {
        commentary.children = children;
      }
      result.push(commentary);
    }
  }

  return result;
};