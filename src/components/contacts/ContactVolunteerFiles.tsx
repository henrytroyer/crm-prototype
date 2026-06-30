import VolunteerFilesSection from '../applications/VolunteerFilesSection';
import type { VolunteerFile } from '../../types/volunteer';

interface ContactVolunteerFilesProps {
  volunteerName: string;
  profilePhotoUrl?: string;
  files?: VolunteerFile[];
}

export default function ContactVolunteerFiles({
  volunteerName,
  profilePhotoUrl,
  files = [],
}: ContactVolunteerFilesProps) {
  return (
    <div className="h-full">
      <VolunteerFilesSection
        volunteerName={volunteerName}
        profilePhotoUrl={profilePhotoUrl}
        files={files}
        variant="panel"
      />
    </div>
  );
}
