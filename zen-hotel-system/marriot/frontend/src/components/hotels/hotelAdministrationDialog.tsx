import Image from "next/image";
import Link from "next/link";
// Components
import { Commentary } from "@/components/hotels/commentary";
import { CommentaryForm } from "@/components/hotels/commentaryForm";
// UI Components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
// Icons
import { ArrowRight, Star, MapPin, Check } from "lucide-react";

export function HotelAdministrationDialog(props: Hotel) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="w-fit p-0 mt-auto">
          View Hotel Details
          <ArrowRight className="ml-1 w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[75vh] overflow-y-auto custom-scrollbar">
        <div className="flex flex-col gap-y-1 ">
          <h1 className="text-xl font-bold">{props.name}</h1>
          <div className="flex gap-x-1 text-sm items-center text-muted-foreground">
            <div>{props.reviews.average}</div>
            <Star className="w-4 h-4 text-black fill-yellow-500" />
            <div>({props.reviews.count} reviews)</div>
            <div>|</div>
            <MapPin className="w-4 h-4 text-black fill-red-700" />
            <div>{props.location.address}</div>
          </div>
          <div className="flex flex-col gap-y-2 mt-5">
            <div className="font-medium text-lg">Overview</div>
            <p className="text-sm">{props.description}</p>
          </div>
          <div className="flex flex-col gap-y-2 mt-5">
            <div className="font-medium text-lg">Rooms</div>
            <div className="grid grid-cols-2 gap-y-5 gap-x-5">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="relative h-52">
                    <Image
                      src={
                        i === 0
                          ? props.rooms.juniorSuite.picture
                          : i === 1
                          ? props.rooms.standardSuite.picture
                          : i === 2
                          ? props.rooms.doubleSuite.picture
                          : props.rooms.bigSuite.picture
                      }
                      fill
                      alt="Room Image"
                      className="object-cover rounded-lg border"
                    />
                    <div className="text-xs border font-bold absolute top-0 right-0 bg-background p-1 rounded-bl-lg rounded-tr-lg">
                      {i === 0
                        ? "Junior"
                        : i === 1
                        ? "Standard"
                        : i === 2
                        ? "Double"
                        : "Big"}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-col gap-y-2 mt-5">
            <div className="font-medium text-lg">Amenities</div>
            <p className="text-sm grid grid-cols-3 gap-y-5">
              {props.amenities.length > 0
                ? props.amenities.map((amenity, index) => (
                    <Amenity
                      key={index}
                      title={amenity}
                      icon={<Check className="w-4 h-4 mr-3" />}
                    />
                  ))
                : "This hotel has no amenities."}
            </p>
          </div>
          <div className="flex flex-col gap-y-2 mt-5">
            <div className="font-medium text-lg">Commentaries</div>
            <CommentaryForm hotelId={props._id} />
            {/* Thread Container */}
            <div className="flex flex-col gap-y-8">
              {props.commentaries.length > 0
                ? props.commentaries.map((commentary, index) => (
                    <Commentary
                      key={index}
                      _id={commentary._id}
                      hotelId={props._id}
                      userName={commentary.userName}
                      date={commentary.date}
                      message={commentary.message}
                      Children={commentary.children}
                    />
                  ))
                : "No commentaries yet."}
            </div>
          </div>
        </div>
        {/* <DialogFooter>
          <Button>
            <Link href={`/search/${props._id}`}>View Rates</Link>
          </Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}

function Amenity({ title, icon }: { title: string; icon: React.ReactElement }) {
  return (
    <div className="flex items-center">
      {icon}
      <div>{title}</div>
    </div>
  );
}
