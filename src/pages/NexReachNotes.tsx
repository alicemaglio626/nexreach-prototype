import React, { useState } from 'react';
import {
  Box,
  Stack,
  Group,
  Flex,
  Divider,
  ScrollArea,
  Table,
  Checkbox as MantineCheckbox,
  Modal as MantineModal,
} from '@mantine/core';
import {
  Button,
  Badge,
  ActionIcon,
  Tabs,
  Textarea,
  Text,
  Title,
  TextInput,
  Select,
  Radio,
} from '@datavant/dart';
import {
  IconSearch,
  IconRefresh,
  IconNotes,
  IconChevronDown,
  IconThumbUp,
  IconThumbDown,
  IconRotateClockwise,
  IconChevronLeft,
  IconChevronRight,
  IconTrash,
  IconPlus,
} from '@tabler/icons-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Note {
  id: number;
  initials: string;
  color: string;
  author: string;
  timestamp: string;
  text: string;
  votes: number;
}

// ─── Sample Data ─────────────────────────────────────────────────────────────

const INITIAL_NOTES: Note[] = [
  {
    id: 1,
    initials: 'JS',
    color: '#7c3aed',
    author: 'Jordan Schaefer',
    timestamp: 'Mar 16, 2026',
    text: 'Site is difficult to reach — receptionist screens all calls. Best to call after 2pm and ask for Carla in medical records.',
    votes: 0,
  },
  {
    id: 2,
    initials: 'MT',
    color: '#059669',
    author: 'Maria Torres',
    timestamp: 'Mar 13, 2026',
    text: 'They requested we send a fax cover sheet first before pulling charts. Fax to 718-555-5678, Attn: Records Dept.',
    votes: 0,
  },
  {
    id: 3,
    initials: 'AR',
    color: '#006ccf',
    author: 'Alex Rivera',
    timestamp: 'Mar 4, 2026',
    text: 'Confirmed they accept requests for 2024 and 2025 DOS. Flag duplicate name issues — they\'ve raised this before.',
    votes: 0,
  },
  {
    id: 4,
    initials: 'JS',
    color: '#7c3aed',
    author: 'Jordan Schaefer',
    timestamp: 'Feb 28, 2026',
    text: 'Office manager said they\'re switching EMR systems in April — may cause delays. Follow up after the 15th.',
    votes: 0,
  },
  {
    id: 5,
    initials: 'MT',
    color: '#059669',
    author: 'Maria Torres',
    timestamp: 'Feb 20, 2026',
    text: 'Spoke with Dr. Barnes\' admin directly. She handles all record requests personally and prefers email over fax.',
    votes: 0,
  },
  {
    id: 6,
    initials: 'AR',
    color: '#006ccf',
    author: 'Alex Rivera',
    timestamp: 'Feb 10, 2026',
    text: 'Site was closed the week of Feb 3–7 for staff training. Back to normal now.',
    votes: 0,
  },
];

const CALL_HISTORY = [
  { date: 'Mar 15', outcome: 'Connected', color: '#059669', agent: 'Jordan Schaefer', detail: 'Left message for records dept', duration: '4m 32s' },
  { date: 'Mar 14', outcome: 'No Answer', color: '#dc2626', agent: 'Jordan Schaefer', detail: '', duration: '—' },
  { date: 'Mar 12', outcome: 'Connected', color: '#059669', agent: 'Maria Torres', detail: 'Spoke with Carla, fax request sent', duration: '7m 15s' },
  { date: 'Mar 10', outcome: 'Voicemail', color: '#d97706', agent: 'Maria Torres', detail: '', duration: '—' },
  { date: 'Mar 5', outcome: 'Connected', color: '#059669', agent: 'Alex Rivera', detail: 'Confirmed DOS range', duration: '3m 40s' },
];

const REQUEST_ROWS = [
  { id: '387216389', plan: 'Aetna', member: 'HARPER, ALEXANDER',  dob: '04/26/2000', due: '4/1/2026', commit: '—', status: 'Unscheduled', payment: 'Requested', osRef: '879918209887', practitioner: 'BARNES, TAYLOR', site: '123 Main St.' },
  { id: '387216390', plan: 'Aetna', member: 'HASSAN, AMINA',      dob: '04/26/2000', due: '4/1/2026', commit: '—', status: 'Unscheduled', payment: 'Requested', osRef: '879918209887', practitioner: 'BARNES, TAYLOR', site: '123 Main St.' },
  { id: '387216391', plan: 'Aetna', member: 'FERNANDEZ, DIEGO',   dob: '04/26/2000', due: '4/1/2026', commit: '—', status: 'Unscheduled', payment: 'Requested', osRef: '879918209887', practitioner: 'BARNES, TAYLOR', site: '123 Main St.' },
  { id: '387216392', plan: 'Aetna', member: 'KAPOOR, PRIYA',      dob: '04/26/2000', due: '4/1/2026', commit: '—', status: 'Unscheduled', payment: 'Requested', osRef: '879918209887', practitioner: 'BARNES, TAYLOR', site: '123 Main St.' },
  { id: '387216393', plan: 'Aetna', member: 'THOMPSON, ELIJAH',   dob: '04/26/2000', due: '4/1/2026', commit: '—', status: 'Unscheduled', payment: 'Requested', osRef: '879918209887', practitioner: 'BARNES, TAYLOR', site: '123 Main St.' },
  { id: '387216394', plan: 'Aetna', member: 'SCOTT, BENJAMIN',    dob: '04/26/2000', due: '4/1/2026', commit: '—', status: 'Unscheduled', payment: 'Requested', osRef: '879918209887', practitioner: 'BARNES, TAYLOR', site: '123 Main St.' },
  { id: '387216395', plan: 'Aetna', member: 'MORETTI, LUCA',      dob: '04/26/2000', due: '4/1/2026', commit: '—', status: 'Unscheduled', payment: 'Requested', osRef: '879918209887', practitioner: 'BARNES, TAYLOR', site: '123 Main St.' },
  { id: '387216396', plan: 'Aetna', member: 'JOHNSON, KEISH',     dob: '04/26/2000', due: '4/1/2026', commit: '—', status: 'Unscheduled', payment: 'Requested', osRef: '879918209887', practitioner: 'BARNES, TAYLOR', site: '123 Main St.' },
  { id: '387216397', plan: 'Aetna', member: 'TANAKA, HIROSHI',    dob: '04/26/2000', due: '4/1/2026', commit: '—', status: 'Unscheduled', payment: 'Requested', osRef: '879918209887', practitioner: 'BARNES, TAYLOR', site: '123 Main St.' },
  { id: '387216398', plan: 'Aetna', member: 'BROOKS, OLIVIA',     dob: '04/26/2000', due: '4/1/2026', commit: '—', status: 'Unscheduled', payment: 'Requested', osRef: '879918209887', practitioner: 'BARNES, TAYLOR', site: '123 Main St.' },
];

const SITE_HISTORY_ROWS = [
  {
    outcome: 'Connected',
    agent: 'Rodriguez, Lorrie',
    requests: 50,
    actions: 'Scheduled: 30\nPended: 20 (PEND24 | PEND5)',
    siteDetails: 'Address',
    providerPkg: '✓ Fax Sent',
    ppt: '—',
    pkgGreen: true,
  },
  {
    outcome: 'Not Connected\nNot a Practitioner Office',
    agent: 'May, Shelby',
    requests: 30,
    actions: 'Sent to Research: 30',
    siteDetails: '—',
    providerPkg: '—',
    ppt: '—',
    pkgGreen: false,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function AvatarCircle({ initials, color, size = 32 }: { initials: string; color: string; size?: number }) {
  return (
    <Box
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Text size="xs" fw={700} c="white">{initials}</Text>
    </Box>
  );
}

function NoteCard({ note }: { note: Note }) {
  return (
    <Box
      style={{
        backgroundColor: '#fff',
        borderRadius: 8,
        border: '1px solid #f0f0f0',
        borderLeft: `3px solid ${note.color}`,
        padding: '10px 14px',
      }}
    >
      <Group justify="space-between" align="center" mb={6}>
        <Group gap={8}>
          <AvatarCircle initials={note.initials} color={note.color} size={22} />
          <Text size="xs" fw={600} c="dimmed">{note.author}</Text>
        </Group>
        <Text size="xs" c="dimmed">{note.timestamp}</Text>
      </Group>
      <Text size="sm" style={{ lineHeight: 1.6, color: '#1f2937' }}>{note.text}</Text>
    </Box>
  );
}

function NotesPane({ notes, onSave }: { notes: Note[]; onSave: (text: string) => void }) {
  const [draft, setDraft] = useState('');

  const handleSave = () => {
    if (!draft.trim()) return;
    onSave(draft.trim());
    setDraft('');
  };

  return (
    <Stack gap={0}>
      {/* Composer */}
      <Box style={{ paddingBottom: 16, borderBottom: '1px solid #e7e5df', marginBottom: 0 }}>
        <Textarea
          placeholder="Add a note for the next agent…"
          rows={2}
          value={draft}
          onChange={(e) => setDraft(e.currentTarget.value)}
          styles={{ input: { fontSize: 13 } }}
        />
        <Group justify="flex-end" gap="xs" mt="xs">
          <Button intent="neutral" appearance="ghost" size="xs" onClick={() => setDraft('')}>Cancel</Button>
          <Button intent="prominent" appearance="solid" size="xs" onClick={handleSave}>Save note</Button>
        </Group>
      </Box>

      {/* Past notes */}
      {notes.map((note, i) => (
        <Box
          key={note.id}
          style={{ padding: '16px 0', borderBottom: i < notes.length - 1 ? '1px solid #e5e7eb' : 'none' }}
        >
          <Group gap={6} mb={4} align="center">
            <Text fw={600} size="sm">{note.author}</Text>
            <Text size="sm" c="dimmed">|</Text>
            <Text size="sm" c="dimmed">{note.timestamp}</Text>
          </Group>
          <Text size="sm" style={{ color: '#374151', lineHeight: 1.6 }}>{note.text}</Text>
        </Box>
      ))}
    </Stack>
  );
}

const OUTCOME_STATUS: Record<string, 'prominent' | 'negative' | 'caution' | 'neutral'> = {
  Connected:   'prominent',
  'No Answer': 'negative',
  Voicemail:   'caution',
};

function CallHistoryPane() {
  return (
    <Stack gap={0}>
      {CALL_HISTORY.map((call, i) => {
        const status = OUTCOME_STATUS[call.outcome] ?? 'neutral';
        return (
          <Box
            key={i}
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              padding: '12px 0',
              borderBottom: i < CALL_HISTORY.length - 1 ? '1px solid #f3f4f6' : 'none',
            }}
          >
            <Box style={{ flexShrink: 0, marginTop: 2 }}>
              <Badge status={status} type="number">{call.outcome}</Badge>
            </Box>
            <Box style={{ flex: 1, minWidth: 0 }}>
              <Group justify="space-between" align="flex-start">
                <Box>
                  <Text size="xs" fw={600}>{call.date}</Text>
                  <Text size="xs" c="dimmed">{call.agent}</Text>
                  {call.detail && <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>{call.detail}</Text>}
                </Box>
                {call.duration !== '—' && (
                  <Text size="xs" c="dimmed" style={{ flexShrink: 0 }}>{call.duration}</Text>
                )}
              </Group>
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}

// ─── Filter pill helper ────────────────────────────────────────────────────────

function FilterPill({ label }: { label: string }) {
  return (
    <Box
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 10px',
        border: '1px solid #e7e5df',
        borderRadius: 4,
        cursor: 'pointer',
        fontSize: 14,
        color: '#374151',
        backgroundColor: '#fff',
        userSelect: 'none',
      }}
    >
      {label} <IconChevronDown size={12} />
    </Box>
  );
}

// ─── Modals ───────────────────────────────────────────────────────────────────

type ActionType = 'schedule' | 'research' | 'pend' | 'reroute';

function ModalShell({ title, submitLabel, onClose, children }: {
  title: string; submitLabel: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <MantineModal opened onClose={onClose} title={<Text fw={400} size="xl">{title}</Text>}
      size="md" centered
      styles={{ header: { paddingBottom: 12 }, body: { paddingTop: 16 } }}
    >
      <Stack gap="md">
        {children}
        <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid #e7e5df' }}>
          <Button intent="neutral" appearance="ghost" onClick={onClose}>Cancel</Button>
          <Button intent="prominent" appearance="solid" onClick={onClose}>{submitLabel}</Button>
        </Group>
      </Stack>
    </MantineModal>
  );
}

function ScheduleModal({ count, onClose }: { count: number; onClose: () => void }) {
  const [commitDate, setCommitDate] = useState('');
  const [notes, setNotes] = useState('This is some autogenerated note text.');
  return (
    <ModalShell title={`Scheduling ${count} Record Request(s)`} submitLabel="Schedule Record Request(s)" onClose={onClose}>
      <TextInput label="Commitment Date" required placeholder="MM/DD/YYYY" value={commitDate} onChange={(e) => setCommitDate(e.currentTarget.value)} />
      <Textarea label="Notes" required rows={4} value={notes} onChange={(e) => setNotes(e.currentTarget.value)} />
    </ModalShell>
  );
}

function ResearchModal({ count, onClose }: { count: number; onClose: () => void }) {
  const [phone] = useState('718-555-1234');
  const [reason, setReason] = useState<string | null>('member_verify');
  const [suggestedPhone, setSuggestedPhone] = useState('718-555-1236');
  const [notes, setNotes] = useState('Could not verify 2 [members or providers]. Sent to research.');
  return (
    <ModalShell title={`Sending ${count} Record Request(s) to Research`} submitLabel="Send Record Request(s)" onClose={onClose}>
      <TextInput
        label="Phone Number Attempted"
        required
        value={phone}
        readOnly
        styles={{ input: { backgroundColor: '#f7f6f4', color: '#6b7280' } }}
      />
      <Select
        label="Reason"
        required
        data={[
          { value: 'not_on_file', label: 'Provider not on file' },
          { value: 'member_verify', label: 'Member verification not possible' },
          { value: 'wrong_office', label: 'Wrong provider office' },
          { value: 'no_response', label: 'No response after multiple attempts' },
        ]}
        value={reason}
        onChange={setReason}
      />
      <TextInput label="Suggested Phone Number" value={suggestedPhone} onChange={(e) => setSuggestedPhone(e.currentTarget.value)} />
      <Textarea label="Notes" required rows={4} value={notes} onChange={(e) => setNotes(e.currentTarget.value)} />
    </ModalShell>
  );
}

function PendModal({ count, onClose }: { count: number; onClose: () => void }) {
  const [reason, setReason] = useState<string | null>('fax');
  const [notes, setNotes] = useState('This is some autogenerated note text.');
  return (
    <ModalShell title={`Pending ${count} Record Request(s)`} submitLabel="Pend Record Request(s)" onClose={onClose}>
      <Select
        label="Reason for Pending"
        required
        data={[
          { value: 'callback', label: 'Waiting for callback' },
          { value: 'fax', label: 'Fax sent, awaiting confirmation' },
          { value: 'portal', label: 'Portal request submitted' },
          { value: 'other', label: 'Other' },
        ]}
        value={reason}
        onChange={setReason}
      />
      <Textarea label="Notes" required rows={4} value={notes} onChange={(e) => setNotes(e.currentTarget.value)} />
    </ModalShell>
  );
}

function RerouteModal({ count, onClose }: { count: number; onClose: () => void }) {
  const [method, setMethod] = useState<string | null>('HIH');
  const [vendor, setVendor] = useState<string | null>('epic');
  const [suggestedPhone, setSuggestedPhone] = useState('718-555-1236');
  const [roiSiteId, setRoiSiteId] = useState('12345');
  const [notes, setNotes] = useState('This is some autogenerated note text.');
  return (
    <ModalShell title={`Rerouting ${count} Record Request(s)`} submitLabel="Reroute Record Request(s)" onClose={onClose}>
      <Select
        label="Preferred Retrieval Method"
        required
        data={[
          { value: 'HIH', label: 'HIH' },
          { value: 'Offsite', label: 'Offsite' },
          { value: 'Embedded', label: 'Embedded' },
        ]}
        value={method}
        onChange={setMethod}
      />
      {method === 'HIH' && (
        <Select
          label="Vendor"
          required
          data={[
            { value: 'epic', label: 'Epic' },
            { value: 'cerner', label: 'Cerner' },
            { value: 'meditech', label: 'Meditech' },
            { value: 'allscripts', label: 'Allscripts' },
          ]}
          value={vendor}
          onChange={setVendor}
        />
      )}
      {method === 'Offsite' && (
        <TextInput label="Suggested Phone Number" required value={suggestedPhone} onChange={(e) => setSuggestedPhone(e.currentTarget.value)} />
      )}
      {method === 'Embedded' && (
        <TextInput label="Suggested ROI Site ID" value={roiSiteId} onChange={(e) => setRoiSiteId(e.currentTarget.value)} />
      )}
      <Textarea label="Notes" required rows={4} value={notes} onChange={(e) => setNotes(e.currentTarget.value)} />
    </ModalShell>
  );
}

function EditSiteModal({ onClose }: { onClose: () => void }) {
  const [siteName, setSiteName] = useState('Manhattan Internal Medicine');
  const [addr1, setAddr1] = useState('123 Main Street');
  const [addr2, setAddr2] = useState('Suite 330');
  const [city, setCity] = useState('Brooklyn');
  const [state, setState] = useState<string | null>('NY');
  const [zip, setZip] = useState('12345');
  const [fax, setFax] = useState('718-888-2345');
  const [contact, setContact] = useState('Mason Reed');
  const [email, setEmail] = useState('mason@manhattanim.com');
  return (
    <MantineModal opened onClose={onClose} title={<Text fw={400} size="xl">Edit Call Details</Text>}
      size="md" centered styles={{ header: { paddingBottom: 12 }, body: { paddingTop: 16 } }}
    >
      <Stack gap="md">
        <TextInput label="Site Name" required value={siteName} onChange={(e) => setSiteName(e.currentTarget.value)} />
        <TextInput label="Address 1" required value={addr1} onChange={(e) => setAddr1(e.currentTarget.value)} />
        <TextInput label="Address 2" value={addr2} onChange={(e) => setAddr2(e.currentTarget.value)} />
        <TextInput label="City" value={city} onChange={(e) => setCity(e.currentTarget.value)} />
        <Group grow>
          <Select label="State" required data={['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']} value={state} onChange={setState} />
          <TextInput label="Zip" required value={zip} onChange={(e) => setZip(e.currentTarget.value)} />
        </Group>
        <TextInput label="Fax Number" value={fax} onChange={(e) => setFax(e.currentTarget.value)} />
        <TextInput label="Primary Contact" required value={contact} onChange={(e) => setContact(e.currentTarget.value)} />
        <TextInput label="Primary Contact Email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
        <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid #e7e5df' }}>
          <Button intent="neutral" appearance="ghost" onClick={onClose}>Cancel</Button>
          <Button intent="prominent" appearance="solid" onClick={onClose}>Update Call Details</Button>
        </Group>
      </Stack>
    </MantineModal>
  );
}

function ActionModal({ action, count, onClose }: { action: ActionType; count: number; onClose: () => void }) {
  if (action === 'schedule') return <ScheduleModal count={count} onClose={onClose} />;
  if (action === 'research') return <ResearchModal count={count} onClose={onClose} />;
  if (action === 'pend')     return <PendModal     count={count} onClose={onClose} />;
  if (action === 'reroute')  return <RerouteModal  count={count} onClose={onClose} />;
  return null;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function NexReachNotes() {
  const [option, setOption] = useState<'A' | 'B' | 'C' | 'D'>('A');

  // Shared notes state
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);

  const addNote = (text: string) => {
    setNotes((prev) => [
      {
        id: Date.now(),
        initials: 'JS',
        color: '#7c3aed',
        author: 'Jordan Schaefer',
        timestamp: 'just now',
        text,
        votes: 0,
      },
      ...prev,
    ]);
  };

  const voteNote = (id: number, delta: 1 | -1) => {
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, votes: n.votes + delta } : n));
  };

  // Action modal state
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);
  const [editSiteOpen, setEditSiteOpen] = useState(false);

  // Option A state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerDraft, setDrawerDraft] = useState('');

  // Option C (modal, formerly B) state
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [modalDraft, setModalDraft] = useState('');

  // Option C (voting modal) state
  const [notesVoteModalOpen, setNotesVoteModalOpen] = useState(false);
  const [modalVoteDraft, setModalVoteDraft] = useState('');

  // Option B state
  const [bannerDrawerOpen, setBannerDrawerOpen] = useState(false);
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [bannerDraft, setBannerDraft] = useState('');

  const handleBannerSave = () => {
    if (!bannerDraft.trim()) return;
    addNote(bannerDraft.trim());
    setBannerDraft('');
    setAddNoteOpen(false);
  };

  const latestNote = notes[0];

  return (
    <Box style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* ── Option Switcher ── */}
      <Box
        style={{
          backgroundColor: '#f7f6f4',
          borderBottom: '1px solid #e7e5df',
          padding: '6px 16px',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <Text size="xs" c="dimmed" fw={500} style={{ marginRight: 4 }}>Prototype variant:</Text>
        <Button
          intent={option === 'A' ? 'prominent' : 'neutral'}
          appearance={option === 'A' ? 'solid' : 'outline'}
          size="xs"
          onClick={() => setOption('A')}
        >
          Option A — Side Drawer
        </Button>
        <Button
          intent={option === 'C' ? 'prominent' : 'neutral'}
          appearance={option === 'C' ? 'solid' : 'outline'}
          size="xs"
          onClick={() => setOption('C')}
        >
          Option B — Modal
        </Button>
        <Button
          intent={option === 'D' ? 'prominent' : 'neutral'}
          appearance={option === 'D' ? 'solid' : 'outline'}
          size="xs"
          onClick={() => setOption('D')}
        >
          Option C — Modal + Voting
        </Button>
        {/* Option (Sticky Banner) hidden for demo — code preserved */}
      </Box>

      {/* ── Dark Topbar ── */}
      <Box
        style={{
          backgroundColor: '#161515',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: -0.3 }}>
          datavant
        </Text>
        <Text size="xs" style={{ color: '#fff', opacity: 0.8, textAlign: 'right', lineHeight: 1.4 }}>
          user@useremail.com<br />Tenant
        </Text>
      </Box>

      {/* ── Page Header Bar ── */}
      <Box
        style={{
          backgroundColor: '#fff',
          borderBottom: '1px solid #e7e5df',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <Title order={2} fw={500} style={{ fontSize: 24 }}>NexReach</Title>
        <Group gap="sm">
          <Button intent="neutral" appearance="outline" size="sm">Back to Search</Button>
          <Button intent="prominent" appearance="solid" size="sm">Finish Outreach</Button>
        </Group>
      </Box>

      {/* ── Option B: Sticky Banner ── */}
      {option === 'B' && (
        <Box style={{ flexShrink: 0 }}>
          <Box
            style={{
              background: '#fff',
              borderBottom: '1px solid #e7e5df',
              borderLeft: '3px solid #7c3aed',
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <IconNotes size={15} color="#2563eb" style={{ flexShrink: 0 }} />
            <Box style={{ flex: 1, minWidth: 0 }}>
              <Text size="sm" style={{ color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {latestNote.text}
              </Text>
              <Text size="xs" c="dimmed" mt={1}>{latestNote.author} · {latestNote.timestamp}</Text>
            </Box>
            <Group gap={16} style={{ flexShrink: 0 }}>
              <Text
                size="xs" fw={500}
                style={{ color: '#7c3aed', cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => setBannerDrawerOpen(true)}
              >
                {notes.length} notes
              </Text>
              <Text
                size="xs" fw={500}
                style={{ color: '#6b7280', cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => setAddNoteOpen((v) => !v)}
              >
                + Add note
              </Text>
            </Group>
          </Box>

          {/* Inline add note form */}
          {addNoteOpen && (
            <Box style={{ background: '#fafafa', borderBottom: '1px solid #e7e5df', padding: '10px 20px' }}>
              <Group align="flex-start" gap={10}>
                <AvatarCircle initials="JS" color="#2563eb" size={28} />
                <Box style={{ flex: 1, border: '1px solid #e7e5df', borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
                  <Textarea
                    placeholder="Add a note for the next agent…"
                    rows={2}
                    value={bannerDraft}
                    onChange={(e) => setBannerDraft(e.currentTarget.value)}
                    styles={{ input: { border: 'none', boxShadow: 'none', padding: '8px 12px', fontSize: 13 } }}
                  />
                  <Group justify="flex-end" gap="xs" style={{ padding: '6px 10px', borderTop: '1px solid #e7e5df', background: '#fafafa' }}>
                    <Button intent="neutral" appearance="ghost" size="xs" onClick={() => { setAddNoteOpen(false); setBannerDraft(''); }}>Cancel</Button>
                    <Button intent="prominent" appearance="solid" size="xs" onClick={handleBannerSave}>Save</Button>
                  </Group>
                </Box>
              </Group>
            </Box>
          )}
        </Box>
      )}

      {/* ── Two-column body ── */}
      <Box style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

        {/* LEFT PANEL */}
        <Box
          style={{
            width: 233,
            minWidth: 233,
            flexShrink: 0,
            overflowY: 'auto',
            padding: '20px',
          }}
        >
          <Box style={{ backgroundColor: '#f7f6f4', borderRadius: 12, padding: '20px 16px' }}>
          <Group justify="space-between" align="center" mb={16}>
            <Text size="md" fw={500}>Call Details</Text>
            <Text size="xs" fw={500} style={{ color: '#006ccf', cursor: 'pointer' }} onClick={() => setEditSiteOpen(true)}>Edit</Text>
          </Group>

          <Stack gap="md">
            {[
              { label: 'Site Name', value: 'Manhattan Internal Medicine' },
              { label: 'Primary Address', value: '123 Main St., #330,\nNew York, NY 12345' },
              { label: 'Phone Number', value: '718-555-1234' },
              { label: 'Fax Number', value: '718-555-5678' },
              { label: 'Primary Contact', value: 'Mason Reed' },
              { label: 'Primary Contact Email', value: 'mason@manhattanim.com' },
              { label: 'Preferred Retrieval Method', value: 'Offsite' },
            ].map(({ label, value }) => (
              <Box key={label}>
                <Text size="sm" style={{ color: '#4f4e4c' }}>{label}</Text>
                <Text size="sm" style={{ whiteSpace: 'pre-line', lineHeight: 1.4, color: '#242423' }}>{value}</Text>
              </Box>
            ))}
          </Stack>

          {/* Notes button — inside panel, visually separated */}
          <Box style={{ borderTop: '1px solid #e7e5df', marginTop: 16, paddingTop: 16 }}>
            {option === 'C' && (
              <Box
                onClick={() => setNotesModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: '#fff',
                  border: '1px solid #e7e5df',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#eaf5ff'; e.currentTarget.style.borderColor = '#006ccf'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e7e5df'; }}
              >
                <Group gap={8}>
                  <IconNotes size={14} color="#006ccf" />
                  <Text size="sm" fw={500} style={{ color: '#242423' }}>Agent Notes</Text>
                </Group>
                <Badge status="prominent" type="number">{notes.length}</Badge>
              </Box>
            )}
            {option === 'D' && (
              <Box
                onClick={() => setNotesVoteModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: '#fff',
                  border: '1px solid #e7e5df',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#eaf5ff'; e.currentTarget.style.borderColor = '#006ccf'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e7e5df'; }}
              >
                <Group gap={8}>
                  <IconNotes size={14} color="#006ccf" />
                  <Text size="sm" fw={500} style={{ color: '#242423' }}>Agent Notes</Text>
                </Group>
                <Badge status="prominent" type="number">{notes.length}</Badge>
              </Box>
            )}
            {option === 'A' && (
              <Box
                onClick={() => setDrawerOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: '#fff',
                  border: '1px solid #e7e5df',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#eaf5ff'; e.currentTarget.style.borderColor = '#006ccf'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e7e5df'; }}
              >
                <Group gap={8}>
                  <IconNotes size={14} color="#006ccf" />
                  <Text size="sm" fw={500} style={{ color: '#242423' }}>Agent Notes</Text>
                </Group>
                <Badge status="prominent" type="number">{notes.length}</Badge>
              </Box>
            )}
          </Box>
          </Box>
        </Box>

        {/* RIGHT CONTENT AREA */}
        <ScrollArea style={{ flex: 1, minWidth: 0 }} p={0}>
          <Box p="xl">
            {/* Call Actions heading row */}
            <Flex justify="space-between" align="flex-start" mb="lg">
              <Box>
                <Text fw={700} size="lg" mb={16} style={{ fontSize: 18 }}>Call Actions</Text>
                <Text size="md" fw={500} mb={12} style={{ color: '#242423' }}>Office Contact Result</Text>
                <Group gap={10}>
                  {/* Custom green pill — DART Badge doesn't support green */}
                  <Box
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '2px 10px',
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    Connected
                  </Box>
                  <Group gap={4} style={{ cursor: 'pointer' }}>
                    <IconRotateClockwise size={13} color="#2563eb" />
                    <Text size="sm" style={{ color: '#006ccf' }}>Change Answer</Text>
                  </Group>
                </Group>
              </Box>

              {/* Reference ID card */}
              <Box
                style={{
                  border: '1px solid #e7e5df',
                  borderRadius: 4,
                  padding: '8px 16px',
                  textAlign: 'right',
                  backgroundColor: '#eaf5ff',
                }}
              >
                <Text size="xs" c="dimmed" mb={2}>Reference ID</Text>
                <Text fw={700} size="sm">NR-718-555-12345</Text>
              </Box>
            </Flex>

            <Divider mb="lg" />

            <Text fw={700} size="lg" mb="md" style={{ fontSize: 18 }}>Record Request Actions</Text>

            {/* Page tabs */}
            <Tabs variant="pill" defaultValue="workspace">
              <Tabs.List mb="lg">
                <Tabs.Tab value="workspace">Workspace</Tabs.Tab>
                <Tabs.Tab value="history">Call History</Tabs.Tab>
              </Tabs.List>

              {/* ── WORKSPACE TAB ── */}
              <Tabs.Panel value="workspace">
                <Stack gap="xl">

                  {/* Bulk Actions */}
                  <Box>
                    <Text fw={600} mb={4}>Bulk Actions</Text>
                    <Text size="sm" c="dimmed" mb={12}>
                      Apply an outcome to all requests at this site in bulk.
                    </Text>
                    <Group gap="sm" wrap="wrap">
                      {([ ['Schedule All', 'schedule'], ['Send All to Research', 'research'], ['Pend All', 'pend'], ['Reroute All', 'reroute'] ] as [string, ActionType][]).map(([label, action]) => (
                        <Button key={label} intent="neutral" appearance="outline" size="sm" onClick={() => setActiveAction(action)}>
                          {label}
                        </Button>
                      ))}
                    </Group>
                  </Box>

                  {/* Individual Outcomes */}
                  <Box>
                    <Text fw={500} size="md" mb={4} style={{ color: '#242423' }}>Individual Outcomes</Text>
                    <Text size="sm" mb={16} style={{ color: '#333231' }}>
                      Select one to many record requests within the table to apply outcomes. Once an outcome has been applied, you may click the undo icon button to remove the outcome, with the exception of scheduling.
                    </Text>

                    {/* Stat boxes */}
                    <Flex gap={24} mb="lg" wrap="nowrap" align="stretch">
                      {/* Needs Action */}
                      <Box
                        style={{
                          flexShrink: 0,
                          border: '1px solid #a7850d',
                          backgroundColor: '#fef7d6',
                          borderRadius: 4,
                          padding: '8px 16px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <Group gap={4} mb={8} align="center">
                          <Text style={{ fontSize: 14, lineHeight: '20px', color: '#a7850d' }}>⚠</Text>
                          <Text size="sm" fw={700} style={{ color: '#242423' }}>Requests Needing Action</Text>
                        </Group>
                        <Group gap={24} wrap="nowrap">
                          <Box>
                            <Text size="sm" fw={500} style={{ color: '#333231' }}>Past Due</Text>
                            <Text size="sm" fw={700} style={{ color: '#242423' }}>0</Text>
                          </Box>
                          <Box>
                            <Text size="sm" fw={500} style={{ color: '#333231' }}>Unscheduled</Text>
                            <Text size="sm" fw={700} style={{ color: '#242423' }}>10</Text>
                          </Box>
                        </Group>
                      </Box>

                      {/* Actioned */}
                      <Box
                        style={{
                          flexShrink: 0,
                          border: '1px solid #8a8985',
                          backgroundColor: 'transparent',
                          borderRadius: 4,
                          padding: '8px 16px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <Text size="sm" fw={700} mb={8} style={{ color: '#242423' }}>Requests Actioned</Text>
                        <Flex gap={24} wrap="nowrap">
                          {['Scheduled', 'In Research', 'Rerouted', 'Pended', 'Progress Logged', 'Unassigned', 'Assigned', 'No Availability'].map((s) => (
                            <Box key={s}>
                              <Text size="sm" fw={500} style={{ color: '#333231' }}>{s}</Text>
                              <Text size="sm" fw={700} style={{ color: '#242423' }}>0</Text>
                            </Box>
                          ))}
                        </Flex>
                      </Box>
                    </Flex>

                    {/* Search + filters */}
                    <Group gap="sm" wrap="nowrap" mb="md" align="center">
                        <Box
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            border: '1px solid #e7e5df',
                            borderRadius: 4,
                            padding: '6px 10px',
                            backgroundColor: '#fff',
                            width: 260,
                            flexShrink: 0,
                          }}
                        >
                          <IconSearch size={14} color="#9ca3af" />
                          <input
                            placeholder="Search requests…"
                            style={{ border: 'none', outline: 'none', fontSize: 13, width: '100%', color: '#374151' }}
                          />
                        </Box>
                        <Box style={{ flex: 1 }} />
                        <FilterPill label="Project Due Date" />
                        <FilterPill label="Commitment Date" />
                        <FilterPill label="Scheduling Status" />
                        <FilterPill label="Practitioner" />
                        <ActionIcon intent="neutral" appearance="ghost" aria-label="Reset filters">
                          <IconRefresh size={14} />
                        </ActionIcon>
                    </Group>

                    {/* Table */}
                    <Box style={{ overflowX: 'auto' }}>
                    <Box style={{ border: '1px solid #e7e5df', borderRadius: 0, overflow: 'hidden', minWidth: 640 }}>
                      <Table striped highlightOnHover>
                        <Table.Thead style={{ backgroundColor: '#f7f6f4' }}>
                          <Table.Tr>
                            <Table.Th style={{ width: 36 }}><MantineCheckbox size="xs" /></Table.Th>
                            <Table.Th><Text size="xs" fw={600}>Request ID</Text></Table.Th>
                            <Table.Th><Text size="xs" fw={600}>Health Plan</Text></Table.Th>
                            <Table.Th><Text size="xs" fw={600}>Member Name</Text></Table.Th>
                            <Table.Th><Text size="xs" fw={600}>Member DOB</Text></Table.Th>
                            <Table.Th><Text size="xs" fw={600}>Project Due Date</Text></Table.Th>
                            <Table.Th><Text size="xs" fw={600}>Commitment Date</Text></Table.Th>
                            <Table.Th><Text size="xs" fw={600}>Status</Text></Table.Th>
                            <Table.Th><Text size="xs" fw={600}>Payment Status</Text></Table.Th>
                            <Table.Th><Text size="xs" fw={600}>OS-Ref</Text></Table.Th>
                            <Table.Th><Text size="xs" fw={600}>Practitioner</Text></Table.Th>
                            <Table.Th><Text size="xs" fw={600}>Site</Text></Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {REQUEST_ROWS.map((row) => (
                            <Table.Tr key={row.id}>
                              <Table.Td><MantineCheckbox size="xs" /></Table.Td>
                              <Table.Td><Text size="xs">{row.id}</Text></Table.Td>
                              <Table.Td><Text size="xs">{row.plan}</Text></Table.Td>
                              <Table.Td><Text size="xs" style={{ whiteSpace: 'nowrap' }}>{row.member}</Text></Table.Td>
                              <Table.Td><Text size="xs">{row.dob}</Text></Table.Td>
                              <Table.Td><Text size="xs">{row.due}</Text></Table.Td>
                              <Table.Td><Text size="xs">{row.commit}</Text></Table.Td>
                              <Table.Td><Text size="sm" style={{ color: '#333231' }}>{row.status}</Text></Table.Td>
                              <Table.Td><Text size="xs">{row.payment}</Text></Table.Td>
                              <Table.Td><Text size="xs">{row.osRef}</Text></Table.Td>
                              <Table.Td><Text size="xs" style={{ whiteSpace: 'nowrap' }}>{row.practitioner}</Text></Table.Td>
                              <Table.Td><Text size="xs">{row.site}</Text></Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                      </Table>
                    </Box>
                    </Box>
                  </Box>
                </Stack>
              </Tabs.Panel>

              {/* ── SITE HISTORY TAB ── */}
              <Tabs.Panel value="history">
                <Stack gap="md">
                  <Box>
                    <Text fw={700} size="md" mb={4}>Call History</Text>
                    <Text size="sm" c="dimmed">
                      The below data represents all retrieval activity for this phone number.
                    </Text>
                  </Box>

                  <Group justify="flex-end">
                    <FilterPill label="Call Outcome" />
                    <ActionIcon intent="neutral" appearance="ghost" aria-label="Reset filters">
                      <IconRefresh size={14} />
                    </ActionIcon>
                  </Group>

                  <Box style={{ overflowX: 'auto' }}>
                  <Box style={{ border: '1px solid #e7e5df', borderRadius: 0, overflow: 'hidden', minWidth: 560 }}>
                    <Table striped highlightOnHover>
                      <Table.Thead style={{ backgroundColor: '#f7f6f4' }}>
                        <Table.Tr>
                          <Table.Th><Text size="xs" fw={600}>Call Outcome</Text></Table.Th>
                          <Table.Th><Text size="xs" fw={600}>Agent</Text></Table.Th>
                          <Table.Th><Text size="xs" fw={600}>Requests</Text></Table.Th>
                          <Table.Th><Text size="xs" fw={600}>Agent Actions</Text></Table.Th>
                          <Table.Th><Text size="xs" fw={600}>Call Details Updated</Text></Table.Th>
                          <Table.Th><Text size="xs" fw={600}>Provider Package Status</Text></Table.Th>
                          <Table.Th><Text size="xs" fw={600}>PPT</Text></Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {SITE_HISTORY_ROWS.map((row, i) => (
                          <Table.Tr key={i}>
                            <Table.Td><Text size="xs" style={{ whiteSpace: 'pre-line' }}>{row.outcome}</Text></Table.Td>
                            <Table.Td><Text size="xs">{row.agent}</Text></Table.Td>
                            <Table.Td><Text size="xs">{row.requests}</Text></Table.Td>
                            <Table.Td><Text size="xs" style={{ whiteSpace: 'pre-line' }}>{row.actions}</Text></Table.Td>
                            <Table.Td><Text size="xs">{row.siteDetails}</Text></Table.Td>
                            <Table.Td>
                              {row.pkgGreen ? (
                                <Text size="xs" style={{ color: '#166534', fontWeight: 500 }}>{row.providerPkg}</Text>
                              ) : (
                                <Text size="xs">{row.providerPkg}</Text>
                              )}
                            </Table.Td>
                            <Table.Td><Text size="xs">{row.ppt}</Text></Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Box>
                  </Box>

                  {/* Pagination */}
                  <Group justify="space-between" align="center">
                    <Group gap="xs">
                      <Text size="xs" c="dimmed">Items per page</Text>
                      <Box
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '3px 8px',
                          border: '1px solid #e7e5df',
                          borderRadius: 4,
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        500 <IconChevronDown size={11} />
                      </Box>
                    </Group>
                    <Group gap="sm">
                      <Text size="xs" c="dimmed">1–10 of 10 items</Text>
                      <Group gap={4}>
                        <Text size="xs" c="dimmed">Page</Text>
                        <Box
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '3px 8px',
                            border: '1px solid #e7e5df',
                            borderRadius: 4,
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          1 <IconChevronDown size={11} />
                        </Box>
                        <Text size="xs" c="dimmed">of 1</Text>
                      </Group>
                      <Group gap={2}>
                        <ActionIcon intent="neutral" appearance="ghost" size="sm" aria-label="Previous page">
                          <IconChevronLeft size={13} />
                        </ActionIcon>
                        <ActionIcon intent="neutral" appearance="ghost" size="sm" aria-label="Next page">
                          <IconChevronRight size={13} />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Group>
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </Box>
        </ScrollArea>

        {/* ── Option A: Notes Side Panel ── */}
        {drawerOpen && (
          <Box
            style={{
              position: 'absolute', top: 0, right: 0, bottom: 0,
              width: 360,
              background: '#fff',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 20px rgba(0,0,0,0.12)',
              borderLeft: '1px solid #e7e5df',
            }}
          >
            <Box style={{ padding: '16px 20px 12px', borderBottom: '1px solid #e7e5df', flexShrink: 0 }}>
              <Group justify="space-between" align="flex-start">
                <Box>
                  <Text fw={700} size="md">Agent Notes</Text>
                </Box>
                <ActionIcon intent="neutral" appearance="ghost" aria-label="Close" onClick={() => setDrawerOpen(false)}>
                  <IconChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
                </ActionIcon>
              </Group>
              <Text size="xs" c="dimmed" mt={8} style={{ lineHeight: 1.5 }}>
                Leave site-relevant details that are only visible internally.
              </Text>
            </Box>
            {/* Sticky composer */}
            <Box style={{ padding: '12px 20px', borderBottom: '1px solid #e7e5df', flexShrink: 0 }}>
              <Textarea
                placeholder="Add a note for the next agent…"
                rows={2}
                value={drawerDraft}
                onChange={(e) => setDrawerDraft(e.currentTarget.value)}
                styles={{ input: { fontSize: 13 } }}
              />
              <Group justify="flex-end" gap="xs" mt="xs">
                <Button intent="neutral" appearance="ghost" size="xs" onClick={() => setDrawerDraft('')}>Cancel</Button>
                <Button intent="prominent" appearance="solid" size="xs" onClick={() => { if (drawerDraft.trim()) { addNote(drawerDraft.trim()); setDrawerDraft(''); } }}>Save note</Button>
              </Group>
            </Box>

            {/* Scrollable notes list */}
            <ScrollArea style={{ flex: 1 }}>
              <Box style={{ padding: '0 20px' }}>
                {notes.map((note, i) => (
                  <Box
                    key={note.id}
                    style={{ padding: '16px 0', borderBottom: i < notes.length - 1 ? '1px solid #e5e7eb' : 'none' }}
                  >
                    <Group gap={6} mb={4} align="center">
                      <Text fw={600} size="sm">{note.author}</Text>
                      <Text size="sm" c="dimmed">|</Text>
                      <Text size="sm" c="dimmed">{note.timestamp}</Text>
                    </Group>
                    <Text size="sm" style={{ color: '#374151', lineHeight: 1.6 }}>{note.text}</Text>
                  </Box>
                ))}
              </Box>
            </ScrollArea>
          </Box>
        )}
      </Box>

      {/* ── Option C: Notes Modal ── */}
      {notesModalOpen && (
        <>
          <Box
            onClick={() => setNotesModalOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }}
          />
          <Box
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 580,
              maxWidth: 'calc(100vw - 40px)',
              height: '80vh',
              background: '#fff',
              borderRadius: 12,
              zIndex: 201,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
            }}
          >
            {/* Header */}
            <Box style={{ padding: '20px 24px', borderBottom: '1px solid #e7e5df', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text fw={600} size="lg">Agent Notes</Text>
              <Text
                style={{ cursor: 'pointer', color: '#6b7280', fontSize: 20, lineHeight: 1 }}
                onClick={() => setNotesModalOpen(false)}
              >×</Text>
            </Box>

            {/* Add note form */}
            <Box style={{ padding: '16px 24px', borderBottom: '1px solid #e7e5df', flexShrink: 0 }}>
              <Textarea
                placeholder="Add a note for the next agent…"
                rows={2}
                value={modalDraft}
                onChange={(e) => setModalDraft(e.currentTarget.value)}
                styles={{ input: { fontSize: 13 } }}
              />
              <Group justify="flex-end" gap="xs" mt="xs">
                <Button intent="neutral" appearance="ghost" size="xs" onClick={() => setModalDraft('')}>Cancel</Button>
                <Button intent="prominent" appearance="solid" size="xs" onClick={() => { if (modalDraft.trim()) { addNote(modalDraft.trim()); setModalDraft(''); } }}>Save note</Button>
              </Group>
            </Box>

            {/* Notes list */}
            <ScrollArea style={{ flex: 1 }}>
              <Box style={{ padding: '0 24px' }}>
                {notes.map((note, i) => (
                  <Box
                    key={note.id}
                    style={{ padding: '16px 0', borderBottom: i < notes.length - 1 ? '1px solid #e5e7eb' : 'none' }}
                  >
                    <Group gap={6} mb={4} align="center">
                      <Text fw={600} size="sm">{note.author}</Text>
                      <Text size="sm" c="dimmed">|</Text>
                      <Text size="sm" c="dimmed">{note.timestamp}</Text>
                    </Group>
                    <Text size="sm" style={{ color: '#374151', lineHeight: 1.6 }}>{note.text}</Text>
                  </Box>
                ))}
              </Box>
            </ScrollArea>
          </Box>
        </>
      )}

      {/* ── Option D: Voting Notes Modal ── */}
      {notesVoteModalOpen && (
        <>
          <Box
            onClick={() => setNotesVoteModalOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }}
          />
          <Box
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 580,
              maxWidth: 'calc(100vw - 40px)',
              height: '80vh',
              background: '#fff',
              borderRadius: 12,
              zIndex: 201,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
            }}
          >
            {/* Header */}
            <Box style={{ padding: '20px 24px', borderBottom: '1px solid #e7e5df', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text fw={600} size="lg">Agent Notes</Text>
              <Text
                style={{ cursor: 'pointer', color: '#6b7280', fontSize: 20, lineHeight: 1 }}
                onClick={() => setNotesVoteModalOpen(false)}
              >×</Text>
            </Box>

            {/* Add note form */}
            <Box style={{ padding: '16px 24px', borderBottom: '1px solid #e7e5df', flexShrink: 0 }}>
              <Textarea
                placeholder="Add a note for the next agent…"
                rows={2}
                value={modalVoteDraft}
                onChange={(e) => setModalVoteDraft(e.currentTarget.value)}
                styles={{ input: { fontSize: 13 } }}
              />
              <Group justify="flex-end" gap="xs" mt="xs">
                <Button intent="neutral" appearance="ghost" size="xs" onClick={() => setModalVoteDraft('')}>Cancel</Button>
                <Button intent="prominent" appearance="solid" size="xs" onClick={() => { if (modalVoteDraft.trim()) { addNote(modalVoteDraft.trim()); setModalVoteDraft(''); } }}>Save note</Button>
              </Group>
            </Box>

            {/* Notes list sorted by votes desc */}
            <ScrollArea style={{ flex: 1 }}>
              <Box style={{ padding: '0 24px' }}>
                {[...notes].sort((a, b) => b.votes - a.votes).map((note, i, arr) => (
                  <Box
                    key={note.id}
                    style={{ padding: '16px 0', borderBottom: i < arr.length - 1 ? '1px solid #e5e7eb' : 'none' }}
                  >
                    <Group gap={6} mb={4} align="center">
                      <Text fw={600} size="sm">{note.author}</Text>
                      <Text size="sm" c="dimmed">|</Text>
                      <Text size="sm" c="dimmed">{note.timestamp}</Text>
                    </Group>
                    <Text size="sm" style={{ color: '#374151', lineHeight: 1.6, marginBottom: 10 }}>{note.text}</Text>
                    <Group gap={6} align="center">
                      <ActionIcon
                        intent="neutral"
                        appearance="ghost"
                        size="sm"
                        aria-label="Upvote"
                        onClick={() => voteNote(note.id, 1)}
                        style={{ color: note.votes > 0 ? '#2563eb' : '#9ca3af' }}
                      >
                        <IconThumbUp size={13} />
                      </ActionIcon>
                      <Text size="xs" c="dimmed" style={{ minWidth: 12, textAlign: 'center' }}>{note.votes}</Text>
                      <ActionIcon
                        intent="neutral"
                        appearance="ghost"
                        size="sm"
                        aria-label="Downvote"
                        onClick={() => voteNote(note.id, -1)}
                        style={{ color: note.votes < 0 ? '#dc2626' : '#9ca3af' }}
                      >
                        <IconThumbDown size={13} />
                      </ActionIcon>
                    </Group>
                  </Box>
                ))}
              </Box>
            </ScrollArea>
          </Box>
        </>
      )}

      {/* ── Action Modals ── */}
      {activeAction && (
        <ActionModal action={activeAction} count={REQUEST_ROWS.length} onClose={() => setActiveAction(null)} />
      )}
      {editSiteOpen && <EditSiteModal onClose={() => setEditSiteOpen(false)} />}

      {/* ── Option B: "See all notes" Panel ── */}
      {bannerDrawerOpen && (
        <>
          <Box
            onClick={() => setBannerDrawerOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 200 }}
          />
          <Box
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: 400,
              background: '#fff', zIndex: 201, display: 'flex', flexDirection: 'column',
              boxShadow: '-4px 0 20px rgba(0,0,0,0.12)',
            }}
          >
            <Box style={{ padding: '16px 20px 12px', borderBottom: '1px solid #e7e5df', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
              <Box>
                <Text fw={700} size="md">Agent Notes</Text>
              </Box>
              <ActionIcon intent="neutral" appearance="ghost" aria-label="Close" onClick={() => setBannerDrawerOpen(false)}>
                <IconChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
              </ActionIcon>
            </Box>
            <ScrollArea style={{ flex: 1 }} p="md">
              <NotesPane notes={notes} onSave={addNote} />
            </ScrollArea>
          </Box>
        </>
      )}
    </Box>
  );
}
