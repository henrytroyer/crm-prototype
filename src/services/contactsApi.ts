import type { ContactDetail, ContactListItem, ContactTag } from '../types/contact';
import { buildMockContactEmailThread } from '../data/mockContactEmailThread';
import {
  getPendingIncomingDonations,
  markIncomingDonationIngested,
} from '../data/mockIncomingDonations';
import {
  getContactDetailBase,
  getAllContacts,
  updateContactCoreFields,
  type ContactCoreFields,
} from './contactStorage';
import { onContactCoreFieldsUpdated } from './contactRecruitmentSync';
import {
  getRecruitmentServiceRecords,
  isRecruitmentServiceTerm,
  upsertRecruitmentServiceRecord,
} from './contactServiceRecordStorage';
import { findProspectByContactId } from './recruitmentStorage';
import {
  syncContactFromDonation,
  type DonationSyncInput,
} from './contactDonationSync';

export async function fetchContactsList(): Promise<ContactListItem[]> {
  return getAllContacts();
}

export async function fetchContactDetail(
  contactId: string,
): Promise<ContactDetail> {
  const detail = getContactDetailBase(contactId);
  const prospect = findProspectByContactId(contactId);

  let recruitmentRecords = getRecruitmentServiceRecords(contactId);
  if (
    prospect &&
    !recruitmentRecords.some(
      (record) => record.recruitmentProspectId === prospect.id,
    )
  ) {
    recruitmentRecords = [
      upsertRecruitmentServiceRecord(contactId, prospect),
      ...recruitmentRecords,
    ];
  }

  const applicationTerms = detail.serviceTerms.filter(
    (term) => !isRecruitmentServiceTerm(term),
  );

  return {
    ...detail,
    emailCorrespondence:
      detail.emailCorrespondence ??
      buildMockContactEmailThread(contactId, {
        name: detail.name,
        email: detail.email,
      }),
    serviceTerms: [...recruitmentRecords, ...applicationTerms],
  };
}

export async function updateContactCoreFieldsApi(
  contactId: string,
  fields: ContactCoreFields,
): Promise<ContactDetail> {
  updateContactCoreFields(contactId, fields);
  onContactCoreFieldsUpdated(contactId, fields);
  return fetchContactDetail(contactId);
}

export async function updateContactTags(
  _contactId: string,
  _tags: ContactTag[],
): Promise<void> {
  return;
}

export async function ingestDonation(
  input: DonationSyncInput,
): Promise<ContactListItem> {
  return syncContactFromDonation(input);
}

export async function ingestPendingDonations(): Promise<ContactListItem[]> {
  const pending = getPendingIncomingDonations();
  const synced: ContactListItem[] = [];

  for (const donation of pending) {
    synced.push(
      syncContactFromDonation({
        donorName: donation.donorName,
        donorEmail: donation.donorEmail,
        quickbooksCustomerId: donation.quickbooksCustomerId,
        record: donation.record,
      }),
    );
    markIncomingDonationIngested(donation.id);
  }

  return synced;
}
