import { buildMockVolunteerDemographics } from "./mockVolunteerContactProfile";
import {
  MOCK_APPLICATION_FORM_FIELDS,
  MOCK_APPLICATION_FORM_FIELDS_RACHEL,
  MOCK_PASTOR_REFERENCE_FORM_FIELDS,
  MOCK_PASTOR_REFERENCE_FORM_FIELDS_RACHEL,
} from "./mockApplicationForm";
import { mockItineraryForTimeline } from "./mockItinerary";
import type { Volunteer, VolunteerDetail, VolunteerFile } from "../types/volunteer";
import { buildApplicationEmails } from "../utils/applicationEmails";
import { mockProfilePhotoUrl } from "../utils/mockProfilePhoto";

function mockEmail(name: string): string {
  const slug = name.toLowerCase().replace(/\s+/g, ".");
  return `${slug}@example.com`;
}

const MOCK_PDF_URL =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

export function mockFiles(seed: string): VolunteerFile[] {
  return [
    {
      id: `${seed}-itinerary`,
      name: "Itinerary.pdf",
      isImage: false,
      url: MOCK_PDF_URL,
    },
    {
      id: `${seed}-passport`,
      name: "Passport.pdf",
      isImage: false,
      url: MOCK_PDF_URL,
    },
    {
      id: `${seed}-background`,
      name: "Background-check.pdf",
      isImage: false,
      url: MOCK_PDF_URL,
    },
    {
      id: `${seed}-safeguarding`,
      name: "Child-safeguarding-certificate.pdf",
      isImage: false,
      url: MOCK_PDF_URL,
    },
    {
      id: `${seed}-reference`,
      name: "Pastor-reference.pdf",
      isImage: false,
      url: MOCK_PDF_URL,
    },
    {
      id: `${seed}-application`,
      name: "Application-form.pdf",
      isImage: false,
      url: MOCK_PDF_URL,
    },
  ];
}

export function buildMockVolunteerDetail(volunteer: Volunteer): VolunteerDetail {
  const seed = volunteer.id.replace(/\W/g, "") || "volunteer";
  const photoSeed = volunteer.name.split(/\s+/)[0]?.toLowerCase() || seed;
  return {
    ...volunteer,
    profilePhotoUrl:
      volunteer.profilePhotoUrl ?? mockProfilePhotoUrl(photoSeed),
    email: mockEmail(volunteer.name),
    emails: buildApplicationEmails({
      volunteerEmail: mockEmail(volunteer.name),
      parentEmail: `parent.${seed}@example.com`,
      pastorEmail: `pastor.${seed}@example.com`,
      otherReferenceEmails:
        volunteer.id === "mock-1"
          ? "ref1@example.com, ref2@example.com"
          : undefined,
    }),
    phone: "+1 (555) 201-4401",
    demographics: buildMockVolunteerDemographics(volunteer.id),
    files: mockFiles(seed),
    housing: "Pending",
    itinerary: mockItineraryForTimeline(volunteer.timelineId),
    coordinator: "Sarah",
    onboardingSteps: [
      { title: "Application Submitted", status: "Complete" },
      {
        title: "Invoice Paid",
        status: volunteer.id === "mock-1" ? "Complete" : "Pending",
        quickbooksInvoiceId:
          volunteer.id === "mock-1"
            ? "mock-invoice-1042-paid"
            : "mock-invoice-2088",
      },
      { title: "Pastor Reference", status: "Pending" },
      { title: "Added To Chat Group", status: "Pending" },
      { title: "Sent To Field", status: "Pending" },
    ],
    applicationFormFields:
      volunteer.id === "mock-2"
        ? MOCK_APPLICATION_FORM_FIELDS_RACHEL
        : MOCK_APPLICATION_FORM_FIELDS,
    pastorReferenceFormFields:
      volunteer.id === "mock-2"
        ? MOCK_PASTOR_REFERENCE_FORM_FIELDS_RACHEL
        : MOCK_PASTOR_REFERENCE_FORM_FIELDS,
  };
}
