import type { VolunteerItinerary } from "../types/itinerary";

export function mockItineraryForTimeline(
  timelineId: string,
): VolunteerItinerary {
  switch (timelineId) {
    case "summer-2026-a":
      return {
        arrival: {
          date: "June 8, 2026",
          time: "2:30 PM",
          airport: "Athens (ATH)",
        },
        departure: {
          date: "July 19, 2026",
          time: "10:15 AM",
          airport: "Athens (ATH)",
        },
      };
    case "summer-2026-b":
      return {
        arrival: {
          date: "July 20, 2026",
          time: "3:00 PM",
          airport: "Athens (ATH)",
        },
        departure: {
          date: "August 30, 2026",
          time: "9:45 AM",
          airport: "Athens (ATH)",
        },
      };
    case "fall-2026":
      return {
        arrival: {
          date: "September 15, 2026",
          time: "4:00 PM",
          airport: "Frankfurt (FRA)",
        },
        departure: {
          date: "November 1, 2026",
          time: "11:30 AM",
          airport: "Frankfurt (FRA)",
        },
      };
    case "spring-2027":
      return {
        arrival: {
          date: "March 1, 2027",
          time: "1:15 PM",
          airport: "Athens (ATH)",
        },
        departure: {
          date: "April 15, 2027",
          time: "8:30 AM",
          airport: "Athens (ATH)",
        },
      };
    default:
      return {
        arrival: { date: "", time: "", airport: "" },
        departure: { date: "", time: "", airport: "" },
      };
  }
}
