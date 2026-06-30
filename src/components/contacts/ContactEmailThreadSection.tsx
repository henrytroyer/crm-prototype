import type { ContactEmailMessage } from '../../types/contact';
import {
  emailBodySnippet,
  formatEmailListDate,
} from '../../utils/formatEmailThread';
import EmailDirectionIndicator from './EmailDirectionIndicator';

interface ContactEmailThreadSectionProps {
  messages: ContactEmailMessage[];
  onSelect: (message: ContactEmailMessage) => void;
}

export default function ContactEmailThreadSection({
  messages,
  onSelect,
}: ContactEmailThreadSectionProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-crm-taupe/20 bg-crm-white p-5">
      <h3 className="text-lg font-semibold text-crm-heading">
        Email correspondence
      </h3>

      <div className="mt-4 min-h-0 flex-1 overflow-hidden rounded-2xl border border-crm-taupe/20 bg-crm-surface md:max-h-72">
        {messages.length === 0 ? (
          <p className="py-6 text-center text-sm text-crm-slate">
            No email correspondence yet.
          </p>
        ) : (
          <ul className="divide-y divide-crm-taupe/20">
            {messages.map((message) => (
              <li key={message.id}>
                <button
                  type="button"
                  onClick={() => onSelect(message)}
                  className="flex w-full items-start gap-3 px-3 py-3 text-left transition hover:bg-crm-taupe-50"
                >
                  <EmailDirectionIndicator direction={message.direction} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-crm-heading">
                      {message.subject}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-crm-slate">
                      {emailBodySnippet(message.body)}
                    </p>
                  </div>
                  <time
                    dateTime={message.sentAt}
                    className="shrink-0 pt-0.5 text-xs text-crm-slate"
                  >
                    {formatEmailListDate(message.sentAt)}
                  </time>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
