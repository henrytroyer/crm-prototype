import {
  getMockContactDetail,
  MOCK_CONTACTS_LIST,
} from '../data/mockContacts';
import type { ContactDetail, ContactListItem, ContactTag } from '../types/contact';

export async function fetchContactsList(): Promise<ContactListItem[]> {
  return MOCK_CONTACTS_LIST;
}

export async function fetchContactDetail(
  contactId: string,
): Promise<ContactDetail> {
  return getMockContactDetail(contactId);
}

export async function updateContactTags(
  _contactId: string,
  _tags: ContactTag[],
): Promise<void> {
  return;
}
