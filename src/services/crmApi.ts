export interface SendApplicationEmailParams {
  itemId: string;
  to: string;
  recipientLabel: string;
  templateId: string;
  templateName: string;
  subject: string;
  body: string;
}

export async function sendApplicationEmail(
  _params: SendApplicationEmailParams,
): Promise<void> {
  throw new Error(
    'Direct send is not configured yet. Use "Open in email app" to send from your mail client, or connect Gmail in a future update.',
  );
}

/** Prototype: monday column update is a no-op */
export async function setQuickBooksInvoiceIdOnItem(
  _boardId: string,
  _itemId: string,
  _invoiceId: string,
): Promise<void> {
  return;
}
