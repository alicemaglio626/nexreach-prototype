import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Group,
  Flex,
  Divider,
  ScrollArea,
  Table,
  Checkbox as MantineCheckbox,
} from '@mantine/core';
import {
  Tooltip,
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
  Alert,
} from '@datavant/dart';
import {
  IconSearch,
  IconRefresh,
  IconNotes,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconRotateClockwise,
  IconX,
  IconArrowBackUp,
  IconInfoCircle,
  IconSwitchHorizontal,
  IconCheck,
  IconAlertTriangle,
  IconArrowRight,
  IconUpload,
} from '@tabler/icons-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Note {
  id: number;
  initials: string;
  color: string;
  author: string;
  timestamp: string;
  text: string;
}

type ViewState = 'landing' | 'workspace';
type ContactResult = null | 'connected' | 'not-connected';
type ActionType = 'schedule' | 'research' | 'pend' | 'reroute' | 'release' | 'emrr-progress';

interface PaymentInfo {
  required: string;
  amount: string;
  feesNotPerChart: boolean;
  timeline: string;
  method: string;
  providerPackage: string;
  submissionMethod: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const INITIAL_NOTES: Note[] = [
  { id: 1, initials: 'JS', color: '#7c3aed', author: 'Jordan Schaefer', timestamp: 'Mar 16, 2026', text: 'Site is difficult to reach — receptionist screens all calls. Best to call after 2pm and ask for Carla in medical records.' },
  { id: 2, initials: 'MT', color: '#059669', author: 'Maria Torres', timestamp: 'Mar 13, 2026', text: 'They requested we send a fax cover sheet first before pulling charts. Fax to 718-555-5678, Attn: Records Dept.' },
  { id: 3, initials: 'AR', color: 'var(--text-data-blue)', author: 'Alex Rivera', timestamp: 'Mar 4, 2026', text: 'Confirmed they accept requests for 2024 and 2025 DOS. Flag duplicate name issues — they\'ve raised this before.' },
  { id: 4, initials: 'JS', color: '#7c3aed', author: 'Jordan Schaefer', timestamp: 'Feb 28, 2026', text: 'Office manager said they\'re switching EMR systems in April — may cause delays. Follow up after the 15th.' },
  { id: 5, initials: 'MT', color: '#059669', author: 'Maria Torres', timestamp: 'Feb 20, 2026', text: 'Spoke with Dr. Barnes\' admin directly. She handles all record requests personally and prefers email over fax.' },
  { id: 6, initials: 'AR', color: 'var(--text-data-blue)', author: 'Alex Rivera', timestamp: 'Feb 10, 2026', text: 'Site was closed the week of Feb 3–7 for staff training. Back to normal now.' },
];

const MEMBER_NAMES = [
  'HARPER, ALEXANDER', 'HASSAN, AMINA', 'FERNANDEZ, DIEGO', 'KAPOOR, PRIYA',
  'THOMPSON, ELIJAH', 'SCOTT, BENJAMIN', 'MORETTI, LUCA', 'JOHNSON, KEISH',
  'TANAKA, HIROSHI', 'BROOKS, OLIVIA', 'CHEN, MICHAEL', 'RODRIGUEZ, SOFIA',
  'PATEL, ANANYA', 'WILLIAMS, MARCUS', 'KIM, JIYEON', 'OKAFOR, CHIDI',
  'MARTINEZ, ELENA', 'NGUYEN, THANH', 'ANDERSON, CLAIRE', 'DUBOIS, MARC',
];
const PLANS = ['Aetna', 'Cigna', 'UnitedHealthcare', 'Humana'];
const ROW_METHODS = ['Onsite', 'Offsite', 'Offsite', 'Onsite', 'EMRR', 'Offsite', 'Onsite', 'Offsite', 'EMRR', 'Offsite', 'Onsite', 'Offsite', 'Offsite', 'Onsite', 'EMRR', 'Offsite', 'Onsite', 'Offsite', 'Onsite', 'Offsite'];
const SLOC_ADDRESSES = [
  '12847 Longsborough Avenue, Suite 3300, Fountainbleau Heights, NY 10970',
  '123 Main St, #330, New York, NY 10001',
  '9500 Euclid Avenue, Building JJ-30, Forest Hills, NY 11375',
  '789 Elm St, Unit B, Brooklyn, NY 11201',
  '3400 Civic Center Boulevard, Suite 4000, Flushing, NY 11354',
  '55 Water St, Fl 3, New York, NY 10041',
  '14 Wall St, Fl 10, New York, NY 10005',
  '2799 W Grand Boulevard, Suite K-150, Jamaica, NY 11432',
  '42 Liberty St, #2, New York, NY 10005',
  '8110 Meadowbrook Drive, Suite 210, Westchester County, NY 10601',
  '30 E 20th St, #5A, New York, NY 10003',
  '4800 Northern Boulevard, Suite 300, Great Neck, NY 11020',
  '9 W 57th St, Rm 3, New York, NY 10019',
  '6000 Sunrise Highway, Building C-400, Massapequa, NY 11758',
  '100 Park Ave, Rm 4, New York, NY 10017',
  '1001 Grand Concourse, Suite 1500, Bronx, NY 10452',
  '1 Penn Plaza, Fl 6, New York, NY 10119',
  '3200 Westchester Avenue, Suite 100, Purchase, NY 10577',
  '5 Main St, Ste 1B, Bronx, NY 10451',
  '950 Pennsylvania Avenue, Suite 700, Brooklyn, NY 11207',
];
const SITE_ADDRESSES = [
  '123 Main St, #330, New York, NY 10001',
  '12847 Longsborough Avenue, Suite 3300, Fountainbleau Heights, NY 10970',
  '789 Elm St, Unit B, Brooklyn, NY 11201',
  '3400 Civic Center Boulevard, Suite 4000, Flushing, NY 11354',
  '55 Water St, Fl 3, New York, NY 10041',
  '2799 W Grand Boulevard, Suite K-150, Jamaica, NY 11432',
  '9500 Euclid Avenue, Building JJ-30, Forest Hills, NY 11375',
  '14 Wall St, Fl 10, New York, NY 10005',
  '8110 Meadowbrook Drive, Suite 210, Westchester County, NY 10601',
  '42 Liberty St, #2, New York, NY 10005',
  '4800 Northern Boulevard, Suite 300, Great Neck, NY 11020',
  '30 E 20th St, #5A, New York, NY 10003',
  '1001 Grand Concourse, Suite 1500, Bronx, NY 10452',
  '9 W 57th St, Rm 3, New York, NY 10019',
  '6000 Sunrise Highway, Building C-400, Massapequa, NY 11758',
  '100 Park Ave, Rm 4, New York, NY 10017',
  '3200 Westchester Avenue, Suite 100, Purchase, NY 10577',
  '1 Penn Plaza, Fl 6, New York, NY 10119',
  '950 Pennsylvania Avenue, Suite 700, Brooklyn, NY 11207',
  '5 Main St, Ste 1B, Bronx, NY 10451',
];
const APPROVED_TIERS = [
  { count: 8, amount: 100 },
];
const UNBLOCKED_COUNT = APPROVED_TIERS.reduce((sum, t) => sum + t.count, 0);

const ACTIVE_PENDS = [
  { code: 'PNP24', label: 'Request Payment', count: 412, actionable: true },
  { code: 'PNP5', label: 'Provider Capacity Restrictions', count: 23, actionable: false },
  { code: 'PNP18', label: 'Post Commitment Refusal', count: 8, actionable: false },
  { code: 'PNP1', label: 'Provider Not Responding', count: 15, actionable: false },
  { code: 'PNP11', label: 'Member Record Not At Location', count: 6, actionable: false },
];

const PROVIDERS = [
  'BARNES, TAYLOR', 'CHEN, SARAH', 'PATEL, RAJ', 'WILLIAMS, JAMES', 'FOSTER, MARIA',
  'KIM, DAVID', 'NGUYEN, ANH', 'MORGAN, LISA', 'RIVERA, CARLOS', 'OKONKWO, ADAEZE',
  'GARCIA, MIGUEL', 'COHEN, RACHEL', 'MURPHY, SEAN', 'WEISS, JONATHAN', 'PARK, MIN',
  'SAITO, KENJI', 'ABEBE, FATIMA', 'IVANOV, NIKOLAI', 'AMARI, ZARA', 'GREENBERG, DAVID',
  'YANG, WEI', 'CASTILLO, ANA', 'JACKSON, MAYA', 'WONG, KEVIN', 'HENDERSON, GRACE',
  'OBI, CHIDIEBERE', 'PETROV, ALEXEI', 'LIN, MEI', 'DELACRUZ, JUAN', 'ROTHMAN, JESSICA',
];
// Total RRs per provider (narrative). The mock data carries 5 per provider; the rest are "loaded on demand".
const PROVIDER_TOTALS: Record<string, number> = Object.fromEntries(
  PROVIDERS.map((name, i) => [name, [80, 12, 5, 27, 6, 18, 45, 9, 33, 4, 15, 22, 8, 11, 38, 7, 26, 13, 50, 5, 19, 41, 6, 31, 8, 29, 14, 25, 7, 17][i]])
);
const TOTAL_PROVIDERS = 249; // narrative — actual mock data carries 30
const METHOD_RR_TOTALS: Record<string, number> = { Offsite: 500, Onsite: 350 };
const METHOD_ORDER = ['Offsite', 'Onsite'];

// Inbound-relevant PNP codes surfaced in the prototype (subset of full canonical list)
const SURFACED_PEND_CODES = ['PNP1', 'PNP5', 'PNP24'] as const;
type PendCode = typeof SURFACED_PEND_CODES[number] | null;

const REQUEST_ROWS = PROVIDERS.flatMap((practitioner, providerIdx) =>
  Array.from({ length: 5 }, (_, i) => {
    const flatIdx = providerIdx * 5 + i;
    // Seed some Pended rows with specific PNP codes (rotates through 10-slot pattern)
    const statusSlot = ['Past Due', 'Pended:PNP24', 'New', 'Past Due', 'In Progress-Unblocked', 'Pended:PNP1', 'Past Due', 'Pended:PNP5', 'Scheduled', 'Past Due'][flatIdx % 10];
    const isPended = statusSlot.startsWith('Pended:');
    const pendCode: PendCode = isPended ? (statusSlot.split(':')[1] as PendCode) : null;
    return {
      id: String(387216389 + flatIdx),
      plan: PLANS[flatIdx % PLANS.length],
      member: MEMBER_NAMES[flatIdx % MEMBER_NAMES.length],
      rowMethod: ROW_METHODS[flatIdx % ROW_METHODS.length],
      dob: `${String((flatIdx % 12) + 1).padStart(2, '0')}/${String((flatIdx % 28) + 1).padStart(2, '0')}/${1985 + (flatIdx % 15)}`,
      due: ['4/1/2026', '4/1/2026', '5/1/2026', '4/1/2026', '6/1/2026', '5/1/2026'][flatIdx % 6],
      commit: ['—', '—', '3/1/2026', '—', '4/1/2026', '5/1/2026', '—', '—', '3/1/2026', '—'][flatIdx % 10],
      status: isPended ? 'Pended' : statusSlot,
      pendCode,
      payment: '—',
      osRef: `87991820${9887 + flatIdx}`,
      practitioner,
      sdos: `0${(flatIdx % 9) + 1}/01/2026-0${(flatIdx % 9) + 1}/28/2026`,
      sloc: SLOC_ADDRESSES[flatIdx % SLOC_ADDRESSES.length],
      site: SITE_ADDRESSES[flatIdx % SITE_ADDRESSES.length],
    };
  })
);

const CALL_HISTORY_ROWS = [
  {
    outcome: 'Connected',
    agent: 'Rodriguez, Lorrie',
    requests: 50,
    actions: 'Scheduled: 30\nPended: 20 (PEND24 | PEND5)',
    siteDetails: 'Address',
    providerPkg: 'Fax Sent',
    ppt: '—',
    pkgGreen: true,
    timestamp: '10/1/2025, 8:30 AM EST',
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
    timestamp: '10/1/2025, 8:30 AM EST',
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function FilterPill({ label, options, selected, onToggle }: { label: string; options?: string[]; selected?: Set<string>; onToggle?: (opt: string) => void }) {
  const [open, setOpen] = useState(false);

  const hasSelection = selected ? selected.size > 0 : false;

  const toggle = (opt: string) => {
    if (onToggle) onToggle(opt);
  };

  return (
    <Box style={{ position: 'relative' }}>
      <Box
        onClick={() => setOpen(!open)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 2,
          padding: '8px 12px',
          border: hasSelection ? '1px solid var(--graphic-interactive-prominent-resting)' : '1px solid var(--graphic-contrast-medium)',
          borderRadius: 1000,
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 500,
          color: hasSelection ? 'var(--text-data-blue)' : 'var(--text-contrast-low)',
          backgroundColor: hasSelection ? 'var(--background-data-blue)' : 'transparent',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {label}{hasSelection ? ` (${selected.size})` : ''} <IconChevronDown size={16} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </Box>
      {open && options && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9990 }} />
          <Box style={{
            position: 'absolute', top: '100%', left: 0, marginTop: 4, zIndex: 9991,
            backgroundColor: 'var(--background-contrast-none)', border: '1px solid var(--graphic-contrast-low)', borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)', padding: '6px 0', minWidth: 180,
          }}>
            {options.map(opt => (
              <Box
                key={opt}
                onClick={() => toggle(opt)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px',
                  cursor: 'pointer', fontSize: 14, color: 'var(--text-contrast-high)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--background-contrast-medium)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <MantineCheckbox size="xs" checked={selected ? selected.has(opt) : false} onChange={() => {}} onClick={(e) => e.stopPropagation()} />
                {opt}
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}

// ─── Modals ──────────────────────────────────────────────────────────────────

function ModalOverlay({ title, submitLabel, onClose, onSubmit, children, size = 500 }: {
  title: string; submitLabel?: string; onClose: () => void; onSubmit?: () => void; children: React.ReactNode; size?: number;
}) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9998 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'var(--background-contrast-none)', borderRadius: 12, zIndex: 9999, width: size, maxWidth: 'calc(100vw - 40px)', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        <Box style={{ padding: '20px 24px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--background-contrast-none)', borderRadius: '12px 12px 0 0', zIndex: 1 }}>
          <Text fw={400} size="xl">{title}</Text>
          <Text style={{ cursor: 'pointer', color: 'var(--text-contrast-minimum)', fontSize: 20, lineHeight: 1 }} onClick={onClose}>×</Text>
        </Box>
        <Box style={{ padding: '16px 24px 24px' }}>
          <Stack gap="md">
            {children}
            {submitLabel && (
              <Group justify="flex-end" gap="sm" pt="sm">
                <Button intent="neutral" appearance="ghost" onClick={onClose}>Cancel</Button>
                <Button intent="prominent" appearance="solid" onClick={onSubmit || onClose}>{submitLabel}</Button>
              </Group>
            )}
          </Stack>
        </Box>
      </div>
    </>
  );
}

function ScheduleModal({ count, unblockedCount = 0, scheduledCount = 0, onClose, onSubmit, onSaveProgress }: { count: number; unblockedCount?: number; scheduledCount?: number; onClose: () => void; onSubmit?: (commitDate?: string, paymentRequired?: boolean, excludeScheduled?: boolean) => void; onSaveProgress?: () => void }) {
  const [activeTab, setActiveTab] = useState<'progress' | 'schedule'>('progress');
  const [showPendModal, setShowPendModal] = useState(false);

  // Progress Update fields
  const [paymentRequired, setPaymentRequired] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [feesNotPerChart, setFeesNotPerChart] = useState(false);
  const [paymentTimeline, setPaymentTimeline] = useState('pre-pay');
  const [paymentMethod, setPaymentMethod] = useState('check');
  const [includeProviderPkg, setIncludeProviderPkg] = useState('yes');
  const [splitPullList, setSplitPullList] = useState(false);
  const [includeScheduled, setIncludeScheduled] = useState('exclude');
  const [submissionMethod, setSubmissionMethod] = useState<string | null>('mail');
  const [contactEmail, setContactEmail] = useState('mason@manhattanim.com');
  const [notes, setNotes] = useState('This is some autogenerated note text.');

  const [pendAcknowledged, setPendAcknowledged] = useState(false);
  const needsEmail = paymentMethod === 'credit-card' || submissionMethod === 'email';

  // Schedule tab fields
  const [commitDate, setCommitDate] = useState('2026-04-01');

  // RU has 3 cap tiers — pre-approved (unblocked from PNP24), high-cap plan, low-cap plan
  const PRE_APPROVED_COUNT = unblockedCount;
  const HIGH_CAP = 60;            // e.g. Aetna
  const HIGH_CAP_COUNT = 7;
  const LOW_CAP = 30;             // e.g. Cigna
  const LOW_CAP_COUNT = count - PRE_APPROVED_COUNT - HIGH_CAP_COUNT; // remaining

  const parsedAmount = parseFloat(paymentAmount.replace(/[^0-9.]/g, '')) || 0;
  const hasAmount = paymentRequired === 'yes' && parsedAmount > 0 && !feesNotPerChart;

  const overHighCap = hasAmount && parsedAmount > HIGH_CAP;
  const overLowCap  = hasAmount && parsedAmount > LOW_CAP;
  const pendCount   = (overHighCap ? HIGH_CAP_COUNT : 0) + (overLowCap ? LOW_CAP_COUNT : 0);
  const belowCapCount = (count - PRE_APPROVED_COUNT) - pendCount;
  const hasOverCap  = pendCount > 0;
  const hasBelowCap = hasAmount && belowCapCount > 0;
  const isOverCap   = hasOverCap; // kept for Schedule tab gating

  const canProceedToSchedule = paymentRequired !== null && (paymentRequired === 'no' || parsedAmount > 0 || feesNotPerChart);

  if (showPendModal) {
    return (
      <ModalOverlay title={`Pending ${count} Record Request(s)`} onClose={onClose}>
        <Select comboboxProps={{ zIndex: 10001 }} label="Pend Reason" required value="PNP-24" data={[
          { value: 'PNP-24', label: 'PNP-24: Request Payment' },
        ]} disabled />
        <TextInput label="Payment Amount Per Chart" required value={`$${parsedAmount}`} readOnly styles={{ input: { backgroundColor: 'var(--background-contrast-medium)', color: 'var(--text-contrast-minimum)' } }} />
        <Flex gap="xl">
          <Box style={{ flex: 1 }}>
            <Text size="sm" fw={600} mb={6}>Payment Timeline *</Text>
            <Radio.Group value={paymentTimeline} onChange={setPaymentTimeline}>
              <Group gap="lg"><Radio value="pre-pay" label="Pre-pay" aria-label="Pre-pay" /><Radio value="post-pay" label="Post-pay" aria-label="Post-pay" /></Group>
            </Radio.Group>
          </Box>
          <Box style={{ flex: 1 }}>
            <Text size="sm" fw={600} mb={6}>Payment Method *</Text>
            <Radio.Group value={paymentMethod} onChange={setPaymentMethod}>
              <Group gap="lg"><Radio value="check" label="Check" aria-label="Check" /><Radio value="credit-card" label="Credit Card" aria-label="Credit Card" /></Group>
            </Radio.Group>
          </Box>
        </Flex>
        <Textarea label="Notes" required rows={4} value={`Pended inventory with code PNP 24 PAYMENT EXCEEDS LIMIT. Reason: 24 Payment Exceeds Limit. Efforts were made to negotiate the requested payment amount to a lower rate. Alternative retrieval methods were proposed to reduce costs and streamline the process.`} onChange={() => {}} />
        <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid var(--graphic-contrast-low)' }}>
          <Button intent="neutral" appearance="ghost" onClick={onClose}>Cancel</Button>
          <Button intent="prominent" appearance="solid" onClick={() => onSubmit ? onSubmit(commitDate, paymentRequired === 'yes') : onClose()}>Pend Record Request(s)</Button>
        </Group>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay title={`Scheduling ${count} Record Request(s)`} onClose={onClose} size={600}>
        {/* Tab switcher — matches Figma pill toggle */}
        <Flex gap={0} style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid var(--graphic-interactive-prominent-resting)' }}>
          <Box
            onClick={() => setActiveTab('progress')}
            style={{
              flex: 1, padding: '10px 0', textAlign: 'center', cursor: 'pointer', fontSize: 14, fontWeight: 600,
              backgroundColor: activeTab === 'progress' ? 'var(--graphic-interactive-prominent-resting)' : 'var(--text-contrast-inverse)',
              color: activeTab === 'progress' ? 'var(--text-contrast-inverse)' : 'var(--text-data-blue)',
            }}
          >Progress Update</Box>
          <Box
            onClick={() => canProceedToSchedule && !isOverCap ? setActiveTab('schedule') : undefined}
            style={{
              flex: 1, padding: '10px 0', textAlign: 'center', fontSize: 14, fontWeight: 600,
              backgroundColor: activeTab === 'schedule' ? 'var(--graphic-interactive-prominent-resting)' : 'var(--text-contrast-inverse)',
              color: activeTab === 'schedule' ? 'var(--text-contrast-inverse)' : 'var(--text-data-blue)',
              cursor: canProceedToSchedule && !isOverCap ? 'pointer' : 'default',
              opacity: canProceedToSchedule && !isOverCap ? 1 : 0.5,
              borderLeft: '1px solid var(--graphic-interactive-prominent-resting)',
            }}
          >Schedule</Box>
        </Flex>

        {activeTab === 'progress' ? (
          <>
            <Text size="sm" c="dimmed" style={{ lineHeight: 1.5 }}>
              Click "Save Progress" to log progress without scheduling record requests. If you are ready to schedule record requests, click "Proceed to Scheduling" to fill in the commitment date.
            </Text>

            {/* Already-scheduled inventory scope — only when the RU has previously-scheduled inventory */}
            {scheduledCount > 0 && (
              <Box>
                <Text size="sm" fw={600} mb={2}>Already-scheduled inventory *</Text>
                <Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }} mb={6}>Some RRs have been scheduled in a previous call. Choose whether to include them in this schedule action.</Text>
                <Radio.Group value={includeScheduled} onChange={setIncludeScheduled}>
                  <Group gap="lg"><Radio value="exclude" label="Exclude already-scheduled" aria-label="Exclude already-scheduled" /><Radio value="include" label="Include already-scheduled" aria-label="Include already-scheduled" /></Group>
                </Radio.Group>
              </Box>
            )}

            {/* Payment Required */}
            <Box>
              <Text size="sm" fw={600} mb={6}>Payment Required *</Text>
              <Radio.Group value={paymentRequired} onChange={setPaymentRequired}>
                <Group gap="lg"><Radio value="yes" label="Yes" aria-label="Yes" /><Radio value="no" label="No" aria-label="No" /></Group>
              </Radio.Group>
            </Box>

            {/* Payment fields — shown when Yes */}
            {paymentRequired === 'yes' && (
              <>
                {/* Two-row split: approved group (locked) + remaining group (editable) */}
                <Box>
                  <Text size="sm" fw={600} mb={8} style={{ color: 'var(--text-contrast-low)' }}>Payment Amount Per Chart <span style={{ color: 'var(--graphic-status-negative)' }}>*</span></Text>

                  {/* Row 1 — Approved RRs (locked, potentially multiple tiers) */}
                  {PRE_APPROVED_COUNT > 0 && (
                    <Box style={{ border: '1px solid var(--graphic-status-positive)', borderRadius: 6, padding: '12px 14px', marginBottom: 8, background: 'var(--background-status-positive)' }}>
                      <Text size="sm" fw={600} style={{ color: 'var(--text-data-seafoam)', marginBottom: 4 }}>
                        Approved RRs ({PRE_APPROVED_COUNT}/{count})
                      </Text>
                      <Text size="xs" style={{ color: 'var(--text-status-positive)', marginBottom: 10, lineHeight: 1.5 }}>
                        These record requests have been released from PNP24 and approved for the amounts below.
                      </Text>
                      <Stack gap={6}>
                        {APPROVED_TIERS.map((tier, i) => (
                          <Group key={i} gap={8} align="center">
                            <Box style={{ background: 'var(--background-status-positive)', borderRadius: 1000, padding: '3px 10px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                              <Text size="xs" style={{ color: 'var(--text-data-seafoam)' }}>✓ Approved Amount: <strong>${tier.amount}</strong></Text>
                            </Box>
                            <Text size="xs" style={{ color: 'var(--text-status-positive)' }}>{tier.count} RR{tier.count !== 1 ? 's' : ''}</Text>
                          </Group>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {/* Row 2 — Remaining RRs (editable) */}
                  <Box style={{ border: '1px solid var(--graphic-contrast-medium)', borderRadius: 6, padding: '10px 12px' }}>
                    <Text size="xs" fw={600} mb={6} style={{ color: 'var(--text-contrast-low)' }}>
                      {PRE_APPROVED_COUNT > 0 ? `Remaining RRs (${count - PRE_APPROVED_COUNT}/${count})` : `All RRs (${count})`}
                    </Text>
                    <Flex gap="md" align="flex-start">
                      <Box style={{ flex: 1 }}>
                        <TextInput
                          placeholder="$ Enter Amount"
                          value={paymentAmount}
                          onChange={(e) => { if (!feesNotPerChart) setPaymentAmount(e.currentTarget.value); }}
                          styles={feesNotPerChart ? { input: { backgroundColor: 'var(--background-contrast-medium)', color: 'var(--text-contrast-minimum)' } } : undefined}
                        />
                      </Box>
                      <Box style={{ flex: 1, paddingTop: 6 }}>
                        <Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }}>Payment Cap Per Chart</Text>
                        <Text size="sm" fw={600}>${LOW_CAP}–${HIGH_CAP}</Text>
                      </Box>
                    </Flex>

                    {hasBelowCap && (
                      <Flex gap={6} align="flex-start" mt={8}>
                        <Text style={{ fontSize: 13, color: 'var(--text-data-seafoam)', flexShrink: 0, lineHeight: '20px' }}>✓</Text>
                        <Box>
                          <Text size="sm" fw={600} style={{ color: 'var(--text-data-seafoam)' }}>Payment amount below cap: {belowCapCount}/{count - PRE_APPROVED_COUNT} Remaining RRs</Text>
                          <Text size="sm" style={{ color: 'var(--text-data-seafoam)' }}>These requests are below the payment cap and will proceed to scheduling.</Text>
                        </Box>
                      </Flex>
                    )}
                    {hasOverCap && (
                      <Flex gap={6} align="flex-start" mt={8}>
                        <Text style={{ fontSize: 13, color: 'var(--text-data-yellow)', flexShrink: 0, lineHeight: '20px' }}>⚠</Text>
                        <Box>
                          <Text size="sm" fw={600} style={{ color: 'var(--text-data-yellow)' }}>Payment Cap Exceeded</Text>
                          <Text size="sm" style={{ color: 'var(--text-data-yellow)' }}>Upon submitting this form, these record requests will proceed to the PEND24 (Request Payment) process.</Text>
                        </Box>
                      </Flex>
                    )}
                  </Box>
                </Box>

                <Group gap={8} align="center" style={{ cursor: 'pointer' }} onClick={() => setFeesNotPerChart(!feesNotPerChart)}>
                  <MantineCheckbox checked={feesNotPerChart} onChange={(e) => setFeesNotPerChart(e.currentTarget.checked)} size="sm" />
                  <Text size="sm">Fees not charged on per chart basis</Text>
                </Group>

                <Flex gap="xl">
                  <Box style={{ flex: 1 }}>
                    <Text size="sm" fw={600} mb={6}>Payment Timeline *</Text>
                    <Radio.Group value={paymentTimeline} onChange={setPaymentTimeline}>
                      <Group gap="lg"><Radio value="pre-pay" label="Pre-pay" aria-label="Pre-pay" /><Radio value="post-pay" label="Post-pay" aria-label="Post-pay" /></Group>
                    </Radio.Group>
                  </Box>
                  <Box style={{ flex: 1 }}>
                    <Text size="sm" fw={600} mb={6}>Payment Method *</Text>
                    <Radio.Group value={paymentMethod} onChange={setPaymentMethod}>
                      <Group gap="lg"><Radio value="check" label="Check" aria-label="Check" /><Radio value="credit-card" label="Credit Card" aria-label="Credit Card" /></Group>
                    </Radio.Group>
                  </Box>
                </Flex>
              </>
            )}

            {/* Include Provider Package */}
            <Box>
              <Text size="sm" fw={600} mb={2}>Include Provider Package *</Text>
              <Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }} mb={6}>(Provider Packages are always sent for new record requests using the submission method below)</Text>
              <Radio.Group value={includeProviderPkg} onChange={setIncludeProviderPkg}>
                <Group gap="lg"><Radio value="yes" label="Yes" aria-label="Yes" /><Radio value="no" label="No" aria-label="No" /></Group>
              </Radio.Group>
              {includeProviderPkg === 'yes' && (
                <Group gap={8} align="center" mt={10} style={{ cursor: 'pointer' }} onClick={() => setSplitPullList(!splitPullList)}>
                  <MantineCheckbox checked={splitPullList} onChange={(e) => setSplitPullList(e.currentTarget.checked)} size="sm" />
                  <Text size="sm">Split pull list by chart</Text>
                </Group>
              )}
            </Box>

            {/* Submission Method — only when a provider package is being sent */}
            {includeProviderPkg === 'yes' && (
              <Select comboboxProps={{ zIndex: 10001 }} label="Submission Method" required data={[
                { value: 'mail', label: 'Mail' },
                { value: 'fax', label: 'Fax' },
                { value: 'email', label: 'Email' },
              ]} value={submissionMethod} onChange={setSubmissionMethod} />
            )}

            {needsEmail && (
              <TextInput label="Primary Contact Email" required value={contactEmail} onChange={(e) => setContactEmail(e.currentTarget.value)} />
            )}

            <Textarea label="Notes" required rows={4} value={notes} onChange={(e) => setNotes(e.currentTarget.value)} />

            {hasOverCap && (
              <Group gap={8} align="flex-start" style={{ cursor: 'pointer' }} onClick={() => setPendAcknowledged(!pendAcknowledged)}>
                <MantineCheckbox checked={pendAcknowledged} onChange={(e) => setPendAcknowledged(e.currentTarget.checked)} size="sm" style={{ marginTop: 2 }} />
                <Text size="sm">I acknowledge that I am pending {pendCount} of the {count - PRE_APPROVED_COUNT} remaining RRs that exceed the payment cap.</Text>
              </Group>
            )}

            <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid var(--graphic-contrast-low)' }}>
              <Button intent="neutral" appearance="ghost" onClick={onClose}>Cancel</Button>
              <Button
                intent="neutral"
                appearance="outline"
                onClick={() => onSaveProgress ? onSaveProgress() : onClose()}
                disabled={paymentRequired === null}
              >Save Progress</Button>
              <Button
                intent="prominent"
                appearance="solid"
                disabled={!canProceedToSchedule || (hasOverCap && !pendAcknowledged)}
                onClick={() => setActiveTab('schedule')}
              >Proceed to Scheduling</Button>
            </Group>
          </>
        ) : (
          <>
            <Text size="sm" c="dimmed" style={{ lineHeight: 1.5 }}>
              Complete the scheduling action by filling in the Commitment Date and clicking "Schedule Record Request(s)." Ensure you have filled in all the required fields in the Progress Update section.
            </Text>

            <Box>
              <Text size="sm" fw={600} mb={6}>Commitment Date *</Text>
              <input
                type="date"
                value={commitDate}
                onChange={(e) => setCommitDate(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px', border: '1px solid var(--graphic-contrast-medium)',
                  borderRadius: 6, fontSize: 14, fontFamily: 'DM Sans, sans-serif',
                  color: 'var(--text-contrast-high)', outline: 'none',
                }}
              />
            </Box>

            <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid var(--graphic-contrast-low)' }}>
              <Button intent="neutral" appearance="ghost" onClick={onClose}>Cancel</Button>
              <Button intent="prominent" appearance="solid" onClick={() => onSubmit ? onSubmit(commitDate, paymentRequired === 'yes', includeScheduled === 'exclude') : onClose()}>Schedule Record Request(s)</Button>
            </Group>
          </>
        )}
    </ModalOverlay>
  );
}

// ─── Onsite Schedule Modal ───────────────────────────────────────────────────

// ─── Address standardization (inline suggestion affordance) ───────────────────
const ADDR_SUFFIX: Record<string, string> = {
  street: 'St', st: 'St', road: 'Rd', rd: 'Rd', avenue: 'Ave', ave: 'Ave',
  drive: 'Dr', dr: 'Dr', boulevard: 'Blvd', blvd: 'Blvd', lane: 'Ln', ln: 'Ln',
  court: 'Ct', ct: 'Ct', place: 'Pl', pl: 'Pl', parkway: 'Pkwy', highway: 'Hwy',
  suite: 'Ste', ste: 'Ste', apartment: 'Apt', apt: 'Apt',
};
function standardizeAddress(addr1: string, city: string, zip: string) {
  const stdAddr1 = addr1.trim().replace(/\s+/g, ' ').split(' ').map((w, i) => {
    const key = w.toLowerCase().replace(/[.,]/g, '');
    return i > 0 && ADDR_SUFFIX[key] ? ADDR_SUFFIX[key] : w;
  }).join(' ');
  return { addr1: stdAddr1, city: city.trim().replace(/\s+/g, ' '), zip: zip.trim().slice(0, 5) };
}

function OnsiteScheduleModal({ count, scheduledCount = 0, onClose, onSubmit, onSaveProgress }: { count: number; scheduledCount?: number; onClose: () => void; onSubmit?: (status?: string, paymentRequired?: boolean, excludeScheduled?: boolean) => void; onSaveProgress?: () => void }) {
  const [activeTab, setActiveTab] = useState<'progress' | 'schedule'>('progress');
  const [step, setStep] = useState<'form' | 'techScheduler' | 'notes' | 'noAvailability'>('form');
  const [schedulerOpened, setSchedulerOpened] = useState(false);

  // Progress Update fields (same as offsite)
  const [paymentRequired, setPaymentRequired] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [feesNotPerChart, setFeesNotPerChart] = useState(false);
  const [paymentTimeline, setPaymentTimeline] = useState('pre-pay');
  const [paymentMethod, setPaymentMethod] = useState('check');
  const [includeProviderPkg, setIncludeProviderPkg] = useState('yes');
  const [splitPullList, setSplitPullList] = useState(false);
  const [includeScheduled, setIncludeScheduled] = useState('exclude');
  const [submissionMethod, setSubmissionMethod] = useState<string | null>('mail');
  const [contactEmail, setContactEmail] = useState('mason@manhattanim.com');
  const [notes, setNotes] = useState('This is some autogenerated note text.');

  // Schedule tab fields (onsite-specific)
  const [onsiteMethod, setOnsiteMethod] = useState<string | null>('emr_flash');
  const [emrSystem, setEmrSystem] = useState<string | null>('other');
  const [addr1, setAddr1] = useState('123 Main Street');
  const [addr2, setAddr2] = useState('');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState<string | null>('CA');
  const [zip, setZip] = useState('12345');
  // Inline address standardization
  const [addrResolution, setAddrResolution] = useState<'pending' | 'standardized' | 'kept'>('pending');
  const [addrSnapshot, setAddrSnapshot] = useState<{ addr1: string; city: string; zip: string } | null>(null);
  const stdAddr = standardizeAddress(addr1, city, zip);
  const addrDiffers = stdAddr.addr1 !== addr1 || stdAddr.city !== city || stdAddr.zip !== zip;

  // No Availability fields
  const [naReason, setNaReason] = useState<string | null>('no_capacity');
  const [naContact, setNaContact] = useState('Mason Reed');
  const [preferredWindow, setPreferredWindow] = useState<string | null>(null);
  const [preferredDate, setPreferredDate] = useState('2026-03-30');
  const [naNotes, setNaNotes] = useState('This is some autogenerated note text.');

  const paymentCap = 50;
  const parsedAmount = parseFloat(paymentAmount.replace(/[^0-9.]/g, '')) || 0;
  const isOverCap = paymentRequired === 'yes' && parsedAmount > paymentCap && !feesNotPerChart;
  const isUnderCap = paymentRequired === 'yes' && parsedAmount > 0 && parsedAmount <= paymentCap && !feesNotPerChart;
  const canProceedToSchedule = paymentRequired !== null && (paymentRequired === 'no' || parsedAmount > 0 || feesNotPerChart);
  const needsEmail = paymentMethod === 'credit-card' || submissionMethod === 'email';

  // Notes modal after scheduling successful
  if (step === 'notes') {
    return (
      <ModalOverlay title="Appointment Scheduled – Add Notes" onClose={onClose} size={550}>
        <Textarea label="Notes to Tech" required rows={5}
          value={`Date: 3/1/2026. Time: 10AM-5PM. Address: ${addr1}, ${city}, ${state} ${zip}.\nType of Retrieval: EMR Flash Drive. EMR System: Other. # of Requests: ${count}. Contact: Mason Reed. Pull List Sent by: [ENTER NAME]`}
          onChange={() => {}}
        />
        <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid var(--graphic-contrast-low)' }}>
          <Button intent="neutral" appearance="ghost" onClick={onClose}>Cancel</Button>
          <Button intent="prominent" appearance="solid" onClick={() => onSubmit ? onSubmit('Scheduled', paymentRequired === 'yes', includeScheduled === 'exclude') : onClose()}>Confirm</Button>
        </Group>
      </ModalOverlay>
    );
  }

  // No Availability modal
  if (step === 'noAvailability') {
    return (
      <ModalOverlay title={`Marking No Availability for ${count} Record Request(s)`} onClose={onClose} size={550}>
        <Select comboboxProps={{ zIndex: 10001 }} label="Reason for No Availability" required data={[
          { value: 'no_capacity', label: 'No capacity in market' },
          { value: 'no_tech', label: 'No tech available' },
          { value: 'site_restrictions', label: 'Site restrictions' },
          { value: 'other', label: 'Other' },
        ]} value={naReason} onChange={setNaReason} />
        <TextInput label="Primary Contact" required value={naContact} onChange={(e) => setNaContact(e.currentTarget.value)} />
        <Box>
          <Text size="sm" fw={600} mb={6}>Preferred Appointment Window *</Text>
          <Radio.Group value={preferredWindow} onChange={setPreferredWindow}>
            <Group gap="lg"><Radio value="yes" label="Yes" aria-label="Yes" /><Radio value="no" label="No" aria-label="No" /></Group>
          </Radio.Group>
        </Box>
        {preferredWindow === 'yes' && (
          <>
            <Text size="xs" style={{ color: 'var(--text-data-blue)', lineHeight: 1.5 }}>
              If there are specific preferred date(s), utilize the "Preferred Date" field(s). Start and End Times are not required. Alternately, you may utilize the notes field to record preferred days of the week.
            </Text>
            <Flex gap="md" align="flex-end">
              <Box style={{ flex: 1 }}>
                <Text size="sm" fw={600} mb={6}>Preferred Date</Text>
                <input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--graphic-contrast-medium)', borderRadius: 6, fontSize: 14, fontFamily: 'DM Sans, sans-serif', color: 'var(--text-contrast-high)', outline: 'none' }}
                />
              </Box>
              <Box style={{ flex: 1 }}>
                <Select comboboxProps={{ zIndex: 10001 }} label="Start Time" placeholder="Select" data={['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']} />
              </Box>
              <Box style={{ flex: 1 }}>
                <Select comboboxProps={{ zIndex: 10001 }} label="End Time" placeholder="Select" data={['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']} />
              </Box>
            </Flex>
            <Text size="xs" fw={500} style={{ color: 'var(--text-data-blue)', cursor: 'pointer' }}>+ Add Another Date</Text>
          </>
        )}
        <Textarea label="Notes" rows={4} value={naNotes} onChange={(e) => setNaNotes(e.currentTarget.value)} />
        <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid var(--graphic-contrast-low)' }}>
          <Button intent="neutral" appearance="ghost" onClick={onClose}>Cancel</Button>
          <Button intent="prominent" appearance="solid" onClick={() => onSubmit ? onSubmit('No Availability', paymentRequired === 'yes', includeScheduled === 'exclude') : onClose()}>Update Record Request(s)</Button>
        </Group>
      </ModalOverlay>
    );
  }

  // Tech Scheduler step
  if (step === 'techScheduler') {
    return (
      <>
        {/* Modal overlays on top */}
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9998 }} />

        {/* Split layout: modal on top, scheduler iframe on bottom */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
          {/* Top: Modal */}
          <div style={{ flex: schedulerOpened ? '0 0 auto' : '1', display: 'flex', justifyContent: 'center', alignItems: schedulerOpened ? 'flex-start' : 'center', padding: schedulerOpened ? '16px' : '0' }}>
            <div style={{ background: 'var(--background-contrast-none)', borderRadius: 12, width: 600, maxWidth: 'calc(100vw - 40px)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', overflow: 'auto', maxHeight: schedulerOpened ? '45vh' : '90vh' }}>
              <Box style={{ padding: '20px 24px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--background-contrast-none)', borderRadius: '12px 12px 0 0', zIndex: 1 }}>
                <Text fw={400} size="xl">Scheduling {count} Record Request(s)</Text>
                <Text style={{ cursor: 'pointer', color: 'var(--text-contrast-minimum)', fontSize: 20, lineHeight: 1 }} onClick={onClose}>×</Text>
              </Box>
              <Box style={{ padding: '16px 24px 24px' }}>
                <Stack gap="md">
                  <Box>
                    <Text fw={600} size="md" mb={4}>1. Complete Scheduling in Onsite Scheduler</Text>
                    <Text size="sm" c="dimmed" mb={12}>Click the "Proceed to Onsite Scheduler" button to complete scheduling.</Text>
                    <Button intent="neutral" appearance="outline" size="sm" onClick={() => setSchedulerOpened(true)}>Proceed to Onsite Scheduler</Button>
                  </Box>
                  <Divider />
                  <Box>
                    <Text fw={600} size="md" mb={4}>2. Record Scheduling Outcome</Text>
                    <Text size="sm" c="dimmed" mb={12}>Indicate the outcome of your scheduling attempts in Onsite Scheduler by clicking the appropriate button below.</Text>
                    <Group gap="sm">
                      <Box
                        onClick={schedulerOpened ? () => setStep('notes') : undefined}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                          borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: schedulerOpened ? 'pointer' : 'default',
                          border: schedulerOpened ? '1px solid var(--text-status-positive)' : '1px solid var(--text-status-disabled)',
                          color: schedulerOpened ? 'var(--text-status-positive)' : 'var(--text-status-disabled)',
                          backgroundColor: schedulerOpened ? 'var(--background-status-positive)' : 'transparent',
                        }}
                      >&#10003; Scheduling Successful</Box>
                      <Box
                        onClick={schedulerOpened ? () => setStep('noAvailability') : undefined}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                          borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: schedulerOpened ? 'pointer' : 'default',
                          border: schedulerOpened ? '1px solid var(--text-status-negative)' : '1px solid var(--text-status-disabled)',
                          color: schedulerOpened ? 'var(--text-status-negative)' : 'var(--text-status-disabled)',
                          backgroundColor: schedulerOpened ? 'var(--background-status-negative)' : 'transparent',
                        }}
                      >&#10007; No Availability</Box>
                    </Group>
                  </Box>
                </Stack>
              </Box>
            </div>
          </div>

          {/* Bottom: Onsite Scheduler iframe (static mock) */}
          {schedulerOpened && (
            <div style={{ flex: 1, background: '#2d2d2d', borderTop: '3px solid #f97316', overflow: 'hidden' }}>
              {/* Scheduler header */}
              <div style={{ background: '#3d3d3d', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-contrast-inverse)', fontSize: 13 }}>OS-Ref ID: 98980199</span>
                  <span style={{ color: 'var(--text-contrast-minimum)', fontSize: 13 }}>To Go: 246</span>
                  <span style={{ color: 'var(--text-status-positive)', fontSize: 13 }}>Hours Needed: 26</span>
                  <span style={{ color: 'var(--text-data-blue)', fontSize: 13 }}>Hours Scheduled: 16</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ color: 'var(--text-contrast-minimum)', fontSize: 13, cursor: 'pointer' }}>Save</span>
                  <span style={{ color: 'var(--text-contrast-minimum)', fontSize: 13 }}>|</span>
                  <span style={{ color: 'var(--text-contrast-minimum)', fontSize: 13, cursor: 'pointer' }}>Cancel</span>
                </div>
              </div>
              {/* Scheduler grid */}
              <div style={{ overflow: 'auto', height: '100%' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#4a4a4a' }}>
                      <th style={{ color: 'var(--text-contrast-inverse)', padding: '6px 8px', textAlign: 'left', position: 'sticky', left: 0, background: '#4a4a4a', minWidth: 130 }}>Time</th>
                      {['Wed 11/5', 'Th 11/6', 'Fri 11/7', 'Mon 11/10', 'Tue 11/11', 'Wed 11/12', 'Th 11/13', 'Fri 11/14', 'Mon 11/17', 'Tue 11/18', 'Wed 11/19', 'Th 11/20', 'Fri 11/21'].map(d => (
                        <th key={d} style={{ color: 'var(--text-contrast-inverse)', padding: '6px 8px', textAlign: 'center', minWidth: 70 }}>{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {['08:00 AM - 09:00 AM', '09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '12:00 PM - 01:00 PM', '01:00 PM - 02:00 PM', '02:00 PM - 03:00 PM', '03:00 PM - 04:00 PM', '04:00 PM - 05:00 PM'].map((time, ti) => (
                      <tr key={time}>
                        <td style={{ color: 'var(--graphic-contrast-low)', padding: '4px 8px', background: '#3d3d3d', position: 'sticky', left: 0, borderBottom: '1px solid #555', fontSize: 11 }}>{time}</td>
                        {Array.from({ length: 13 }).map((_, di) => {
                          const isBlue = (di === 1 || di === 2) && ti < 5;
                          const isRed = (di === 1 || di === 2) && ti >= 5;
                          return (
                            <td key={di} style={{
                              padding: '4px 8px', textAlign: 'center', borderBottom: '1px solid #555', borderRight: '1px solid #444',
                              backgroundColor: isBlue ? '#93c5fd' : isRed ? '#fca5a5' : 'transparent',
                              color: (isBlue || isRed) ? '#1e293b' : 'transparent',
                            }}>{(isBlue || isRed) ? '1' : ''}</td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  // Main form (Progress Update / Schedule tabs)
  return (
    <ModalOverlay title={`Scheduling ${count} Record Request(s)`} onClose={onClose} size={600}>
      {/* Tab switcher */}
      <Flex gap={0} style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid var(--graphic-interactive-prominent-resting)' }}>
        <Box onClick={() => setActiveTab('progress')}
          style={{ flex: 1, padding: '10px 0', textAlign: 'center', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            backgroundColor: activeTab === 'progress' ? 'var(--graphic-interactive-prominent-resting)' : 'var(--text-contrast-inverse)', color: activeTab === 'progress' ? 'var(--text-contrast-inverse)' : 'var(--text-data-blue)', borderRadius: 6 }}
        >Progress Update</Box>
        <Box onClick={() => canProceedToSchedule && !isOverCap ? setActiveTab('schedule') : undefined}
          style={{ flex: 1, padding: '10px 0', textAlign: 'center', fontSize: 14, fontWeight: 600,
            backgroundColor: activeTab === 'schedule' ? 'var(--graphic-interactive-prominent-resting)' : 'var(--text-contrast-inverse)', color: activeTab === 'schedule' ? 'var(--text-contrast-inverse)' : 'var(--text-data-blue)',
            cursor: canProceedToSchedule && !isOverCap ? 'pointer' : 'default', opacity: canProceedToSchedule && !isOverCap ? 1 : 0.5, borderLeft: '1px solid var(--graphic-interactive-prominent-resting)', borderRadius: 6 }}
        >Schedule</Box>
      </Flex>

      {activeTab === 'progress' ? (
        <>
          <Text size="sm" c="dimmed" style={{ lineHeight: 1.5 }}>
            Click "Save Progress" to log progress without scheduling record requests. If you are ready to schedule record requests, click "Proceed to Scheduling."
          </Text>

          {/* Already-scheduled inventory scope — only when the RU has previously-scheduled inventory */}
          {scheduledCount > 0 && (
            <Box>
              <Text size="sm" fw={600} mb={2}>Already-scheduled inventory *</Text>
              <Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }} mb={6}>Some RRs have been scheduled in a previous call. Choose whether to include them in this schedule action.</Text>
              <Radio.Group value={includeScheduled} onChange={setIncludeScheduled}>
                <Group gap="lg"><Radio value="exclude" label="Exclude already-scheduled" aria-label="Exclude already-scheduled" /><Radio value="include" label="Include already-scheduled" aria-label="Include already-scheduled" /></Group>
              </Radio.Group>
            </Box>
          )}

          <Box>
            <Text size="sm" fw={600} mb={6}>Payment Required *</Text>
            <Radio.Group value={paymentRequired} onChange={setPaymentRequired}>
              <Group gap="lg"><Radio value="yes" label="Yes" aria-label="Yes" /><Radio value="no" label="No" aria-label="No" /></Group>
            </Radio.Group>
          </Box>

          {paymentRequired === 'yes' && (
            <>
              <Flex gap="xl" align="flex-start">
                <Box style={{ flex: 1 }}>
                  <TextInput label="Payment Amount Per Chart" required placeholder="$ Enter Amount" value={paymentAmount}
                    onChange={(e) => { if (!feesNotPerChart) setPaymentAmount(e.currentTarget.value); }}
                    styles={feesNotPerChart ? { input: { backgroundColor: 'var(--background-contrast-medium)', color: 'var(--text-contrast-minimum)' } } : undefined}
                  />
                </Box>
                <Box style={{ flex: 1, paddingTop: 24 }}>
                  <Text size="sm" c="dimmed">Payment Cap Per Chart</Text>
                  <Text size="sm" fw={600}>${paymentCap}</Text>
                </Box>
              </Flex>
              {isUnderCap && <Text size="sm" style={{ color: 'var(--text-status-positive)' }}>&#10003; Payment amount below cap</Text>}
              {isOverCap && (
                <Box style={{ display: 'flex', alignItems: 'flex-start', gap: 6, color: 'var(--graphic-status-caution)' }}>
                  <Text style={{ fontSize: 14 }}>&#9888;</Text>
                  <Box>
                    <Text size="sm" fw={600} style={{ color: 'var(--graphic-status-caution)' }}>Payment Cap Exceeded</Text>
                    <Text size="sm" style={{ color: 'var(--text-contrast-minimum)' }}>These record requests will proceed to the PEND24 (Request Payment) process.</Text>
                  </Box>
                </Box>
              )}
              <Group gap={8} align="center" style={{ cursor: 'pointer' }} onClick={() => setFeesNotPerChart(!feesNotPerChart)}>
                <MantineCheckbox checked={feesNotPerChart} onChange={(e) => setFeesNotPerChart(e.currentTarget.checked)} size="sm" />
                <Text size="sm">Fees not charged on per chart basis</Text>
              </Group>
              <Flex gap="xl">
                <Box style={{ flex: 1 }}>
                  <Text size="sm" fw={600} mb={6}>Payment Timeline *</Text>
                  <Radio.Group value={paymentTimeline} onChange={setPaymentTimeline}>
                    <Group gap="lg"><Radio value="pre-pay" label="Pre-pay" aria-label="Pre-pay" /><Radio value="post-pay" label="Post-pay" aria-label="Post-pay" /></Group>
                  </Radio.Group>
                </Box>
                <Box style={{ flex: 1 }}>
                  <Text size="sm" fw={600} mb={6}>Payment Method *</Text>
                  <Radio.Group value={paymentMethod} onChange={setPaymentMethod}>
                    <Group gap="lg"><Radio value="check" label="Check" aria-label="Check" /><Radio value="credit-card" label="Credit Card" aria-label="Credit Card" /></Group>
                  </Radio.Group>
                </Box>
              </Flex>
            </>
          )}

          <Box>
            <Text size="sm" fw={600} mb={2}>Include Provider Package *</Text>
            <Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }} mb={6}>(Provider Packages are always sent for new record requests using the submission method below)</Text>
            <Radio.Group value={includeProviderPkg} onChange={setIncludeProviderPkg}>
              <Group gap="lg"><Radio value="yes" label="Yes" aria-label="Yes" /><Radio value="no" label="No" aria-label="No" /></Group>
            </Radio.Group>
            {includeProviderPkg === 'yes' && (
              <Group gap={8} align="center" mt={10} style={{ cursor: 'pointer' }} onClick={() => setSplitPullList(!splitPullList)}>
                <MantineCheckbox checked={splitPullList} onChange={(e) => setSplitPullList(e.currentTarget.checked)} size="sm" />
                <Text size="sm">Split pull list by chart</Text>
              </Group>
            )}
          </Box>

          {includeProviderPkg === 'yes' && (
            <Select comboboxProps={{ zIndex: 10001 }} label="Submission Method" required data={[
              { value: 'mail', label: 'Mail' }, { value: 'fax', label: 'Fax' }, { value: 'email', label: 'Email' },
            ]} value={submissionMethod} onChange={setSubmissionMethod} />
          )}

          {needsEmail && <TextInput label="Primary Contact Email" required value={contactEmail} onChange={(e) => setContactEmail(e.currentTarget.value)} />}

          <Textarea label="Notes" required rows={4} value={notes} onChange={(e) => setNotes(e.currentTarget.value)} />

          <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid var(--graphic-contrast-low)' }}>
            <Button intent="neutral" appearance="ghost" onClick={onClose}>Cancel</Button>
            <Button intent="neutral" appearance="outline" disabled={paymentRequired === null} onClick={() => onSaveProgress ? onSaveProgress() : onClose()}>Save Progress</Button>
            {isOverCap ? (
              <Button intent="prominent" appearance="solid" onClick={onClose}>Proceed to Pend</Button>
            ) : (
              <Button intent="prominent" appearance="solid" disabled={!canProceedToSchedule} onClick={() => setActiveTab('schedule')}>Proceed to Scheduling</Button>
            )}
          </Group>
        </>
      ) : (
        <>
          <Text size="sm" c="dimmed" style={{ lineHeight: 1.5 }}>
            Select the Onsite Retrieval Method and EMR System then confirm the Scheduling Address details. After clicking "Schedule Record Request(s)," you will then be prompted to complete scheduling in Onsite Scheduler.
          </Text>

          <Select comboboxProps={{ zIndex: 10001 }} label="Onsite Retrieval Method" required data={[
            { value: 'emr_flash', label: 'EMR Flash Drive' },
            { value: 'emr_remote', label: 'EMR Remote Desktop' },
            { value: 'paper', label: 'Paper Charts' },
          ]} value={onsiteMethod} onChange={setOnsiteMethod} />

          <Select comboboxProps={{ zIndex: 10001 }} label="EMR System" required data={[
            { value: 'other', label: 'Other' },
            { value: 'epic', label: 'Epic' },
            { value: 'cerner', label: 'Cerner' },
            { value: 'meditech', label: 'Meditech' },
            { value: 'allscripts', label: 'Allscripts' },
          ]} value={emrSystem} onChange={setEmrSystem} />

          <Divider />

          <Text fw={600} size="md">Scheduling Address</Text>
          <TextInput label="Address 1" required value={addr1} onChange={(e) => { setAddr1(e.currentTarget.value); setAddrResolution('pending'); }} />
          <TextInput label="Address 2" value={addr2} onChange={(e) => setAddr2(e.currentTarget.value)} />
          <TextInput label="City" required value={city} onChange={(e) => { setCity(e.currentTarget.value); setAddrResolution('pending'); }} />
          <Group grow>
            <Select comboboxProps={{ zIndex: 10001 }} label="State" required data={['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']} value={state} onChange={setState} />
            <TextInput label="Postal Code" required value={zip} onChange={(e) => { setZip(e.currentTarget.value); setAddrResolution('pending'); }} />
          </Group>

          {/* Inline standardized-address suggestion (replaces modal-over-modal) */}
          {addrDiffers && addrResolution === 'pending' && (
            <Box style={{ border: '1px solid var(--graphic-status-info)', background: 'var(--background-status-info)', borderRadius: 8, padding: '12px 14px' }}>
              <Group gap={10} align="flex-start" wrap="nowrap">
                <IconInfoCircle size={17} color="var(--text-data-blue)" style={{ marginTop: 1, flexShrink: 0 }} />
                <Box style={{ flex: 1 }}>
                  <Text size="sm" fw={600} style={{ color: 'var(--text-contrast-high)' }}>We found a standardized version of this address</Text>
                  <Text size="sm" fw={400} mt={6} style={{ color: 'var(--text-contrast-high)' }}>
                    {stdAddr.addr1}, {city}, {state} {stdAddr.zip}
                  </Text>
                  <Group justify="flex-end" gap={10} mt={12}>
                    <Button size="xs" intent="neutral" appearance="outline" onClick={() => setAddrResolution('kept')}>Keep as Entered</Button>
                    <Button size="xs" intent="prominent" appearance="solid" onClick={() => {
                      setAddrSnapshot({ addr1, city, zip });
                      setAddr1(stdAddr.addr1); setCity(stdAddr.city); setZip(stdAddr.zip);
                      setAddrResolution('standardized');
                    }}>Use Standardized Address</Button>
                  </Group>
                </Box>
              </Group>
            </Box>
          )}
          {addrResolution === 'standardized' && (
            <Group gap={8} align="center">
              <IconCheck size={15} color="var(--text-data-seafoam)" style={{ flexShrink: 0 }} />
              <Text size="sm" style={{ color: 'var(--text-data-seafoam)' }}>Using standardized address</Text>
              {addrSnapshot && (
                <Text size="sm" style={{ color: 'var(--text-data-blue)', cursor: 'pointer' }} onClick={() => {
                  setAddr1(addrSnapshot.addr1); setCity(addrSnapshot.city); setZip(addrSnapshot.zip);
                  setAddrResolution('pending');
                }}>Revert</Text>
              )}
            </Group>
          )}
          {addrResolution === 'kept' && addrDiffers && (
            <Group gap={8} align="center">
              <Text size="sm" c="dimmed">Using address as entered.</Text>
              <Text size="sm" style={{ color: 'var(--text-data-blue)', cursor: 'pointer' }} onClick={() => setAddrResolution('pending')}>Review standardized</Text>
            </Group>
          )}

          <Box style={{ display: 'flex', alignItems: 'flex-start', gap: 6, color: '#7c3aed' }}>
            <Text style={{ fontSize: 14 }}>&#9432;</Text>
            <Box>
              <Text size="sm" fw={600} style={{ color: '#7c3aed' }}>Are you sure you're ready to schedule?</Text>
              <Text size="sm" style={{ color: 'var(--text-contrast-minimum)' }}>Once you hit "Schedule Record Requests," you may not undo this action in NexReach.</Text>
            </Box>
          </Box>

          <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid var(--graphic-contrast-low)' }}>
            <Button intent="neutral" appearance="ghost" onClick={onClose}>Cancel</Button>
            <Button intent="prominent" appearance="solid" onClick={() => setStep('techScheduler')}>Schedule Record Request(s)</Button>
          </Group>
        </>
      )}
    </ModalOverlay>
  );
}

function ResearchModal({ count, onClose, onSubmit, siteAccessType, onSiteAccessTypeChange, defaultReason }: { count: number; onClose: () => void; onSubmit?: () => void; siteAccessType?: string | null; onSiteAccessTypeChange?: (v: string) => void; defaultReason?: string }) {
  const [phone] = useState('718-555-1234');
  const [reason, setReason] = useState<string | null>(defaultReason ?? 'member_verify');
  const [suggestedPhone, setSuggestedPhone] = useState('');
  const [notes, setNotes] = useState('');
  const readOnlyInput = { backgroundColor: 'var(--background-contrast-medium)', color: 'var(--text-contrast-minimum)' };
  const reasonOptions = [
    { value: 'member_verify', label: 'Member verification not possible' },
    { value: 'not_on_file', label: 'Provider not on file' },
  ];
  return (
    <ModalOverlay title={`Sending ${count} Record Request(s) to Research`} submitLabel="Send Record Request(s)" onClose={onClose} onSubmit={onSubmit}>
      <TextInput label="Phone Number Attempted" value={phone} readOnly styles={{ input: readOnlyInput }} />
      {defaultReason ? (
        <TextInput label="Reason" value={reasonOptions.find(o => o.value === defaultReason)?.label ?? defaultReason} readOnly styles={{ input: readOnlyInput }} />
      ) : (
        <Select comboboxProps={{ zIndex: 10001 }} label="Reason" data={reasonOptions} value={reason} onChange={setReason} />
      )}
      <TextInput label="Suggested Phone Number" placeholder="Enter a suggested phone number" value={suggestedPhone} onChange={(e) => setSuggestedPhone(e.currentTarget.value)} />
      <Textarea label="Notes" placeholder="Add an optional note for the research team" rows={4} value={notes} onChange={(e) => setNotes(e.currentTarget.value)} />
    </ModalOverlay>
  );
}

function PendModal({ count, onClose, onSubmit, siteAccessType, onSiteAccessTypeChange }: { count: number; onClose: () => void; onSubmit?: () => void; siteAccessType?: string | null; onSiteAccessTypeChange?: (v: string) => void }) {
  const [reason, setReason] = useState<string | null>(null);
  const [notes, setNotes] = useState('This is an autogenerated note');
  return (
    <ModalOverlay title={`Pending ${count} Record Request(s)`} submitLabel="Pend Record Request(s)" onClose={onClose} onSubmit={onSubmit}>
      {/* SiteAccessTypePrompt hidden for now */}
      <Select comboboxProps={{ zIndex: 10001 }} label="Pend Reason" required placeholder="Select a Pend reason" data={[
        { value: 'PNP-1', label: 'PNP-1: Provider Not Responding' },
        { value: 'PNP-2', label: 'PNP-2: Provider Active Refusal' },
        { value: 'PNP-5', label: 'PNP-5: Provider Capacity Restrictions' },
        { value: 'PNP-6', label: 'PNP-6: Direct Access to EMR' },
        { value: 'PNP-7', label: 'PNP-7: DOS Requested Not Available' },
        { value: 'PNP-11', label: 'PNP-11: Member Record Not At Location' },
        { value: 'PNP-15', label: 'PNP-15: Requesting Member Consent' },
        { value: 'PNP-18', label: 'PNP-18: Post Commitment Refusal' },
        { value: 'PNP-24', label: 'PNP-24: Request Payment' },
        { value: 'PNP-27', label: 'PNP-27: Additional Data Required' },
        { value: 'PNP-42', label: 'PNP-42: Environmental Constraints' },
      ]} value={reason} onChange={setReason} />
      <Box style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '0 0 4px' }}>
        <Text size="xs" style={{ color: '#6b21a8', lineHeight: 1.5 }}>
          &#9432; PNP1 &amp; PNP18 will be auto-assigned based on call counts{'\n'}
          <span style={{ color: 'var(--text-contrast-minimum)' }}>These options are no longer available for manual selection.</span>
        </Text>
      </Box>
      <Textarea label="Notes" required rows={4} value={notes} onChange={(e) => setNotes(e.currentTarget.value)} />
    </ModalOverlay>
  );
}

function RerouteModal({ count, onClose, onSubmit, siteAccessType, onSiteAccessTypeChange, excludeMethod }: { count: number; onClose: () => void; onSubmit?: () => void; siteAccessType?: string | null; onSiteAccessTypeChange?: (v: string) => void; excludeMethod?: string }) {
  const allMethods = [
    { value: 'Embedded', label: 'Embedded' },
    { value: 'EMR Remote', label: 'EMR Remote' },
    { value: 'HIH-Major', label: 'HIH-Major' },
    { value: 'HIH-Other', label: 'HIH-Other' },
    { value: 'Onsite', label: 'Onsite' },
    { value: 'Offsite', label: 'Offsite' },
  ];
  const excludeLabel = excludeMethod === 'EMRR' ? 'EMR Remote' : excludeMethod;
  const methodOptions = excludeLabel ? allMethods.filter(m => m.label !== excludeLabel) : allMethods;
  const [method, setMethod] = useState<string | null>('HIH-Major');
  const [vendor, setVendor] = useState<string | null>('epic');
  const [notes, setNotes] = useState('This is some autogenerated note text.');
  const isHIH = method === 'HIH-Major' || method === 'HIH-Other';
  const title = excludeMethod ? `Rerouting ${count} ${excludeMethod} Record Request(s)` : `Rerouting ${count} Record Request(s)`;
  return (
    <ModalOverlay title={title} submitLabel="Reroute Record Request(s)" onClose={onClose} onSubmit={onSubmit}>
      <Select comboboxProps={{ zIndex: 10001 }} label="Preferred Retrieval Method" required data={methodOptions} value={method} onChange={setMethod} />
      {isHIH && (
        <Select comboboxProps={{ zIndex: 10001 }} label="Vendor" required data={[
          { value: 'epic', label: 'Epic' },
          { value: 'cerner', label: 'Cerner' },
          { value: 'meditech', label: 'Meditech' },
          { value: 'allscripts', label: 'Allscripts' },
        ]} value={vendor} onChange={setVendor} />
      )}
      <Textarea label="Notes" required rows={4} value={notes} onChange={(e) => setNotes(e.currentTarget.value)} />
    </ModalOverlay>
  );
}

function ActionModal({ action, count, onClose }: { action: ActionType; count: number; onClose: () => void }) {
  if (action === 'schedule') return <ScheduleModal count={count} onClose={onClose} />;
  if (action === 'research') return <ResearchModal count={count} onClose={onClose} />;
  if (action === 'pend') return <PendModal count={count} onClose={onClose} />;
  if (action === 'reroute') return <RerouteModal count={count} onClose={onClose} />;
  return null;
}

function EditSiteModal({ onClose, isEmrRemote, siteAccessType, onSiteAccessTypeChange }: { onClose: () => void; isEmrRemote?: boolean; siteAccessType?: string | null; onSiteAccessTypeChange?: (v: string) => void }) {
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
    <ModalOverlay title="Edit Site Details" onClose={onClose}>
      <TextInput label="Site Name" required value={siteName} onChange={(e) => setSiteName(e.currentTarget.value)} />
      <TextInput label="Address 1" required value={addr1} onChange={(e) => setAddr1(e.currentTarget.value)} />
      <TextInput label="Address 2" value={addr2} onChange={(e) => setAddr2(e.currentTarget.value)} />
      <TextInput label="City" value={city} onChange={(e) => setCity(e.currentTarget.value)} />
      <Group grow>
        <Select comboboxProps={{ zIndex: 10001 }} label="State" required data={['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']} value={state} onChange={setState} />
        <TextInput label="Zip" required value={zip} onChange={(e) => setZip(e.currentTarget.value)} />
      </Group>
      <TextInput label="Fax Number" value={fax} onChange={(e) => setFax(e.currentTarget.value)} />
      <TextInput label="Primary Contact" required value={contact} onChange={(e) => setContact(e.currentTarget.value)} />
      <TextInput label="Primary Contact Email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
      {/* Site Access Type hidden for now */}
      {false && isEmrRemote && onSiteAccessTypeChange && (
        <Select comboboxProps={{ zIndex: 10001 }} label="Site Access Type" data={[
          { value: 'open', label: 'Open Access' },
          { value: 'queued', label: 'Queued Access' },
        ]} value={siteAccessType || ''} onChange={(v) => { if (v) onSiteAccessTypeChange(v); }} />
      )}
      <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid var(--graphic-contrast-low)' }}>
        <Button intent="neutral" appearance="ghost" onClick={onClose}>Cancel</Button>
        <Button intent="prominent" appearance="solid" onClick={onClose}>Update Site Details</Button>
      </Group>
    </ModalOverlay>
  );
}

// ─── EMRR Site Access Type Prompt ──────────────────────────────────────────────

function SiteAccessTypePrompt({ value, onChange, alreadySaved }: { value: string | null; onChange: (v: string) => void; alreadySaved?: boolean }) {
  if (alreadySaved) return null;
  return (
    <Box style={{ border: '1px solid var(--graphic-contrast-low)', borderRadius: 6, padding: '10px 14px' }}>
      <Text size="sm" fw={600} mb={4} style={{ color: 'var(--text-contrast-high)' }}>Site Access Type *</Text>
      <Text size="xs" style={{ color: 'var(--text-contrast-minimum)', marginBottom: 8 }}>
        Applies to the entire site. Open access sites skip "Awaiting Queued."
      </Text>
      <Radio.Group value={value} onChange={onChange}>
        <Group gap="lg">
          <Radio value="open" label="Open Access" aria-label="Open Access" />
          <Radio value="queued" label="Queued Access" aria-label="Queued Access" />
        </Group>
      </Radio.Group>
    </Box>
  );
}

// ─── EMRR Save Progress Modal ─────────────────────────────────────────────────

function EmrrSaveProgressModal({ count, onClose, onSubmit, siteAccessType, onSiteAccessTypeChange, paymentInfo, onPaymentInfoChange }: {
  count: number; onClose: () => void; onSubmit?: (credentialStatus: string, commitDate?: string, paymentRequired?: boolean) => void;
  siteAccessType: string | null; onSiteAccessTypeChange: (v: string) => void;
  paymentInfo: PaymentInfo | null; onPaymentInfoChange: (info: PaymentInfo) => void;
}) {
  const [credentialStatus, setCredentialStatus] = useState<string | null>(null);
  const [localSiteType, setLocalSiteType] = useState<string | null>(siteAccessType);
  const [scheduleDate, setScheduleDate] = useState('');
  const [notes, setNotes] = useState('This is some autogenerated note text.');
  const [editingPayment, setEditingPayment] = useState(false);

  // Payment fields — initialize from saved info if available
  const [paymentRequired, setPaymentRequired] = useState<string | null>(paymentInfo?.required || null);
  const [paymentAmount, setPaymentAmount] = useState(paymentInfo?.amount || '');
  const [feesNotPerChart, setFeesNotPerChart] = useState(paymentInfo?.feesNotPerChart || false);
  const [paymentTimeline, setPaymentTimeline] = useState(paymentInfo?.timeline || 'pre-pay');
  const [paymentMethod, setPaymentMethod] = useState(paymentInfo?.method || 'check');
  const [includeProviderPkg, setIncludeProviderPkg] = useState(paymentInfo?.providerPackage || 'yes');
  const [splitPullList, setSplitPullList] = useState(false);
  const [submissionMethod, setSubmissionMethod] = useState<string | null>(paymentInfo?.submissionMethod || 'mail');
  const [contactEmail, setContactEmail] = useState('mason@manhattanim.com');

  const needsScheduleDate = credentialStatus === 'awaiting_assignment';
  const needsEmail = paymentMethod === 'credit-card' || submissionMethod === 'email';
  const isOpen = localSiteType === 'open';
  const paymentCap = 50;
  const parsedAmount = parseFloat(paymentAmount.replace(/[^0-9.]/g, '')) || 0;
  const isOverCap = paymentRequired === 'yes' && parsedAmount > paymentCap && !feesNotPerChart;
  const isUnderCap = paymentRequired === 'yes' && parsedAmount > 0 && parsedAmount <= paymentCap && !feesNotPerChart;
  const showPaymentForm = !paymentInfo || editingPayment;

  const statusOptions = [
    { value: 'outreach_in_progress', label: 'Outreach In Progress' },
    { value: 'credentialing_in_progress', label: 'Credentialing In Progress' },
    { value: 'awaiting_queued', label: 'Awaiting Queued' },
    { value: 'awaiting_assignment', label: 'Awaiting Assignment' },
  ];

  const handleSubmit = () => {
    if (localSiteType) onSiteAccessTypeChange(localSiteType);
    if (paymentRequired) {
      onPaymentInfoChange({
        required: paymentRequired,
        amount: paymentAmount,
        feesNotPerChart,
        timeline: paymentTimeline,
        method: paymentMethod,
        providerPackage: includeProviderPkg,
        submissionMethod: submissionMethod || 'mail',
      });
    }
    // Map dropdown value to display label for the table
    const statusLabels: Record<string, string> = {
      outreach_in_progress: 'Outreach In Progress',
      credentialing_in_progress: 'Credentialing In Progress',
      awaiting_queued: 'Awaiting Queued',
      awaiting_assignment: 'Awaiting Assignment',
    };
    if (onSubmit && credentialStatus) onSubmit(statusLabels[credentialStatus] || credentialStatus, scheduleDate || undefined, paymentRequired === 'yes');
  };

  return (
    <ModalOverlay title={`Updating ${count} Record Request(s)`} onClose={onClose} size={600}>

      {/* SiteAccessTypePrompt hidden for now */}

      {/* Payment, PP, Submission — only shown if not yet saved */}
      {!paymentInfo && (
        <>
          <Box>
            <Text size="sm" fw={600} mb={6}>Payment Required *</Text>
            <Radio.Group value={paymentRequired} onChange={setPaymentRequired}>
              <Group gap="lg"><Radio value="yes" label="Yes" aria-label="Yes" /><Radio value="no" label="No" aria-label="No" /></Group>
            </Radio.Group>
          </Box>

          {paymentRequired === 'yes' && (
            <>
              <Flex gap="xl" align="flex-start">
                <Box style={{ flex: 1 }}>
                  <TextInput label="Payment Amount Per Chart" required placeholder="$ Enter Amount" value={paymentAmount}
                    onChange={(e) => { if (!feesNotPerChart) setPaymentAmount(e.currentTarget.value); }}
                    styles={feesNotPerChart ? { input: { backgroundColor: 'var(--background-contrast-medium)', color: 'var(--text-contrast-minimum)' } } : undefined}
                  />
                </Box>
                <Box style={{ flex: 1, paddingTop: 24 }}>
                  <Text size="sm" c="dimmed">Payment Cap Per Chart</Text>
                  <Text size="sm" fw={600}>${paymentCap}</Text>
                </Box>
              </Flex>

              {isUnderCap && <Text size="sm" style={{ color: 'var(--text-status-positive)' }}>&#10003; Payment amount below cap</Text>}
              {isOverCap && (
                <Box style={{ display: 'flex', alignItems: 'flex-start', gap: 6, color: 'var(--graphic-status-caution)' }}>
                  <Text style={{ fontSize: 14 }}>&#9888;</Text>
                  <Box>
                    <Text size="sm" fw={600} style={{ color: 'var(--graphic-status-caution)' }}>Payment Cap Exceeded</Text>
                    <Text size="sm" style={{ color: 'var(--text-contrast-minimum)' }}>These record requests will proceed to the PEND24 (Request Payment) process.</Text>
                  </Box>
                </Box>
              )}

              <Group gap={8} align="center" style={{ cursor: 'pointer' }} onClick={() => setFeesNotPerChart(!feesNotPerChart)}>
                <MantineCheckbox checked={feesNotPerChart} onChange={(e) => setFeesNotPerChart(e.currentTarget.checked)} size="sm" />
                <Text size="sm">Fees not charged on per chart basis</Text>
              </Group>

              <Flex gap="xl">
                <Box style={{ flex: 1 }}>
                  <Text size="sm" fw={600} mb={6}>Payment Timeline *</Text>
                  <Radio.Group value={paymentTimeline} onChange={setPaymentTimeline}>
                    <Group gap="lg"><Radio value="pre-pay" label="Pre-pay" aria-label="Pre-pay" /><Radio value="post-pay" label="Post-pay" aria-label="Post-pay" /></Group>
                  </Radio.Group>
                </Box>
                <Box style={{ flex: 1 }}>
                  <Text size="sm" fw={600} mb={6}>Payment Method *</Text>
                  <Radio.Group value={paymentMethod} onChange={setPaymentMethod}>
                    <Group gap="lg"><Radio value="check" label="Check" aria-label="Check" /><Radio value="credit-card" label="Credit Card" aria-label="Credit Card" /></Group>
                  </Radio.Group>
                </Box>
              </Flex>
            </>
          )}

          <Box>
            <Text size="sm" fw={600} mb={2}>Include Provider Package *</Text>
            <Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }} mb={6}>(Provider Packages are always sent for new record requests using the submission method below)</Text>
            <Radio.Group value={includeProviderPkg} onChange={setIncludeProviderPkg}>
              <Group gap="lg"><Radio value="yes" label="Yes" aria-label="Yes" /><Radio value="no" label="No" aria-label="No" /></Group>
            </Radio.Group>
            {includeProviderPkg === 'yes' && (
              <Group gap={8} align="center" mt={10} style={{ cursor: 'pointer' }} onClick={() => setSplitPullList(!splitPullList)}>
                <MantineCheckbox checked={splitPullList} onChange={(e) => setSplitPullList(e.currentTarget.checked)} size="sm" />
                <Text size="sm">Split pull list by chart</Text>
              </Group>
            )}
          </Box>

          {includeProviderPkg === 'yes' && (
            <Select comboboxProps={{ zIndex: 10001 }} label="Submission Method" required data={[
              { value: 'mail', label: 'Mail' },
              { value: 'fax', label: 'Fax' },
              { value: 'email', label: 'Email' },
            ]} value={submissionMethod} onChange={setSubmissionMethod} />
          )}

          {needsEmail && (
            <TextInput label="Primary Contact Email" required value={contactEmail} onChange={(e) => setContactEmail(e.currentTarget.value)} />
          )}
        </>
      )}

      <Select comboboxProps={{ zIndex: 10001 }} label="Credential Progress Status" required placeholder="Select status"
        data={statusOptions}
        value={credentialStatus}
        onChange={setCredentialStatus}
      />

      {needsScheduleDate && (
        <Box>
          <Text size="sm" fw={600} mb={6}>Commitment Date *</Text>
          <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--graphic-contrast-medium)', borderRadius: 6, fontSize: 14, fontFamily: 'DM Sans, sans-serif', color: 'var(--text-contrast-high)', outline: 'none' }}
          />
        </Box>
      )}

      <Textarea label="Notes" required rows={4} value={notes} onChange={(e) => setNotes(e.currentTarget.value)} />

      <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid var(--graphic-contrast-low)' }}>
        <Button intent="neutral" appearance="ghost" onClick={onClose}>Cancel</Button>
        <Button intent="prominent" appearance="solid"
          disabled={!credentialStatus || (needsScheduleDate && !scheduleDate)}
          onClick={handleSubmit}
        >Save Progress</Button>
      </Group>
    </ModalOverlay>
  );
}

// ─── No Contact Modals ───────────────────────────────────────────────────────

function NoAnswerModal({ title, defaultReason, reasons, onClose, onSave }: {
  title: string; defaultReason: string; reasons: string[]; onClose: () => void; onSave: () => void;
}) {
  const [reason, setReason] = useState<string | null>(defaultReason);
  const [notes, setNotes] = useState('This is some autogenerated note text.');
  return (
    <ModalOverlay title={title} onClose={onClose}>
      <Select comboboxProps={{ zIndex: 10001 }} label="Reason" required
        data={reasons.map(r => ({ value: r, label: r }))}
        value={reason} onChange={setReason}
      />
      <Textarea label="Notes" required rows={4} value={notes} onChange={(e) => setNotes(e.currentTarget.value)} />
      <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid var(--graphic-contrast-low)' }}>
        <Button intent="neutral" appearance="ghost" onClick={onClose}>Cancel</Button>
        <Button intent="prominent" appearance="solid" onClick={onSave}>Save</Button>
      </Group>
    </ModalOverlay>
  );
}

function SiteClosedModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [phoneProvided, setPhoneProvided] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('718-555-1234');
  const [notes, setNotes] = useState('This is some autogenerated note text.');
  return (
    <ModalOverlay title="Add Note: Site Permanently Closed" onClose={onClose}>
      <Box>
        <Text size="sm" fw={600} mb={6}>Updated phone number provided? *</Text>
        <Radio.Group value={phoneProvided} onChange={setPhoneProvided}>
          <Group gap="lg"><Radio value="yes" label="Yes" aria-label="Yes" /><Radio value="no" label="No" aria-label="No" /></Group>
        </Radio.Group>
      </Box>
      {phoneProvided === 'yes' && (
        <TextInput label="Phone Number Provided" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.currentTarget.value)} />
      )}
      <Textarea label="Notes" required rows={4} value={notes} onChange={(e) => setNotes(e.currentTarget.value)}
        styles={phoneProvided === null ? { input: { backgroundColor: 'var(--background-contrast-medium)', color: 'var(--text-contrast-minimum)' } } : undefined}
        placeholder="This is some autogenerated note text."
      />
      <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid var(--graphic-contrast-low)' }}>
        <Button intent="neutral" appearance="ghost" onClick={onClose}>Cancel</Button>
        <Button intent="prominent" appearance="solid" onClick={onSave}>Save</Button>
      </Group>
    </ModalOverlay>
  );
}

// ─── Landing Screen ──────────────────────────────────────────────────────────

function LandingScreen({
  phoneValue, onPhoneChange, callType, onCallTypeChange,
  retrieval, onRetrievalChange, onSearch,
}: {
  phoneValue: string; onPhoneChange: (v: string) => void;
  callType: string; onCallTypeChange: (v: string) => void;
  retrieval: string; onRetrievalChange: (v: string) => void;
  onSearch: () => void;
}) {
  return (
    <Box style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Dark topbar */}
      <Box style={{ backgroundColor: 'var(--background-contrast-inverse)', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, width: '100%' }}>
        <Text style={{ color: 'var(--text-contrast-inverse)', fontWeight: 700, fontSize: 18, letterSpacing: -0.3 }}>datavant</Text>
        <Text size="xs" style={{ color: 'var(--text-contrast-inverse)', opacity: 0.8, textAlign: 'right', lineHeight: 1.4 }}>user@useremail.com<br />Tenant</Text>
      </Box>

      <Box style={{ flex: 1, backgroundColor: 'var(--background-contrast-none)', padding: '20px 20px', overflow: 'auto', width: '100%' }}>
        <Title order={2} fw={500} style={{ fontSize: 24, marginBottom: 32 }}>NexReach</Title>

        <Stack gap="lg" style={{ maxWidth: 480 }}>
          <Box>
            <Text size="sm" fw={600} mb="xs">Call Type</Text>
            <Radio.Group value={callType} onChange={onCallTypeChange}>
              <Group gap="lg">
                <Radio value="outbound" label="Outbound" aria-label="Outbound" />
                <Radio value="inbound" label="Inbound" aria-label="Inbound" />
              </Group>
            </Radio.Group>
          </Box>

          {callType === 'outbound' && (
            <Box>
              <Text size="sm" fw={600} mb="xs">Retrieval Method</Text>
              <Radio.Group value={retrieval} onChange={onRetrievalChange}>
                <Group gap="lg">
                  <Radio value="offsite" label="Offsite" aria-label="Offsite" />
                  <Radio value="onsite" label="Onsite" aria-label="Onsite" />
                  <Radio value="emr-remote" label="EMR Remote" aria-label="EMR Remote" />
                </Group>
              </Radio.Group>
            </Box>
          )}

          <Box>
            <TextInput
              placeholder="Search by phone number"
              value={phoneValue}
              onChange={(e) => onPhoneChange(e.currentTarget.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') onSearch(); }}
              rightSection={
                <IconSearch size={15} color="var(--text-contrast-minimum)" style={{ cursor: 'pointer' }} onClick={onSearch} />
              }
              style={{ width: '100%' }}
            />
          </Box>

          {callType === 'inbound' && (
            <>
              <Text size="sm" fw={700} style={{ color: 'var(--text-contrast-high)' }}>OR</Text>
              <Box>
                <TextInput
                  placeholder="Search by provider package ID"
                  onKeyDown={(e) => { if (e.key === 'Enter') onSearch(); }}
                  rightSection={
                    <IconSearch size={15} color="var(--text-contrast-minimum)" style={{ cursor: 'pointer' }} onClick={onSearch} />
                  }
                  style={{ width: '100%' }}
                />
              </Box>
            </>
          )}
        </Stack>
      </Box>
    </Box>
  );
}

// ─── Schedule Nudge Modal ────────────────────────────────────────────────────

function ScheduleNudgeModal({ rrCount, isInbound, isEmrr, verifiedUnit = 'members', onDismiss, onStartScheduling }: {
  rrCount: number; isInbound: boolean; isEmrr?: boolean; verifiedUnit?: 'members' | 'providers'; onDismiss: () => void; onStartScheduling: () => void;
}) {
  return (
    <ModalOverlay
      title={isEmrr ? 'Ready to Update Progress?' : 'Ready to Schedule?'}
      submitLabel={isEmrr ? 'Update Progress' : 'Start Scheduling'}
      onClose={onDismiss}
      onSubmit={onStartScheduling}
      size={480}
    >
      <Stack gap="md">
        <Alert status="positive" title={`2 ${verifiedUnit} verified — compliance threshold met`} withCloseButton={false} style={{ boxShadow: 'none' }} />
        <Text size="sm" style={{ color: 'var(--text-contrast-low)', lineHeight: 1.6 }}>
          {isEmrr ? (
            <>You're ready to update progress for all{' '}
            <Text component="span" fw={700} style={{ color: 'var(--text-contrast-high)' }}>{rrCount.toLocaleString()} record requests</Text>.</>
          ) : (
            <>You're ready to schedule all{' '}
            <Text component="span" fw={700} style={{ color: 'var(--text-contrast-high)' }}>{rrCount.toLocaleString()} record requests</Text>.
            {isInbound && ' The scheduling flow will walk you through each retrieval method in sequence.'}</>
          )}
        </Text>
      </Stack>
    </ModalOverlay>
  );
}

// ─── Schedule Stepper Modal (inbound only) ────────────────────────────────────

function ScheduleStepperModal({ methodSteps, onClose, onStepComplete, siteAccessType, onSiteAccessTypeChange, paymentInfo, onPaymentInfoChange, countPerMethod }: {
  methodSteps: string[];
  onClose: () => void;
  onStepComplete: (method: string, skipped: boolean) => void;
  siteAccessType: string | null;
  onSiteAccessTypeChange: (v: string) => void;
  paymentInfo: PaymentInfo;
  onPaymentInfoChange: (info: PaymentInfo) => void;
  countPerMethod?: Record<string, number>;
}) {
  const [step, setStep] = useState(0);
  const [stepModalOpen, setStepModalOpen] = useState(false);

  const currentMethod = methodSteps[step];
  const totalSteps = methodSteps.length;
  const isLast = step === totalSteps - 1;
  const count = countPerMethod?.[currentMethod] ?? METHOD_RR_TOTALS[currentMethod] ?? 0;

  const advanceStep = (skipped: boolean) => {
    onStepComplete(currentMethod, skipped);
    if (isLast) {
      onClose();
    } else {
      setStep(s => s + 1);
    }
  };

  const handleStepSubmit = () => {
    setStepModalOpen(false);
    advanceStep(false);
  };

  return (
    <>
      {/* Stepper backdrop — hidden when step modal is on top */}
      {!stepModalOpen && <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9990 }} />}

      {/* Stepper shell */}
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'var(--background-contrast-none)', borderRadius: 12, zIndex: 9991, width: 560, maxWidth: 'calc(100vw - 40px)', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px 16px' }}>
          <Group justify="space-between" align="flex-start" mb={14}>
            <Text fw={400} size="xl">Schedule Remaining Record Requests</Text>
            <Text style={{ cursor: 'pointer', color: 'var(--text-contrast-minimum)', fontSize: 20, lineHeight: 1 }} onClick={onClose}>×</Text>
          </Group>
          {/* Step progress */}
          <Group gap={0} align="center">
            {methodSteps.map((m, i) => (
              <React.Fragment key={m}>
                <Group gap={6} align="center">
                  <div style={{
                    width: 24, height: 24, borderRadius: 12, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700,
                    backgroundColor: i < step ? 'var(--background-status-positive)' : i === step ? 'var(--text-data-blue)' : 'var(--graphic-contrast-low)',
                    color: i < step ? 'var(--text-status-positive)' : i === step ? 'var(--text-contrast-inverse)' : 'var(--graphic-contrast-medium)',
                  }}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <Text size="xs" fw={i === step ? 600 : 400} style={{ color: i === step ? 'var(--text-contrast-high)' : 'var(--graphic-contrast-medium)', whiteSpace: 'nowrap' }}>{m}</Text>
                </Group>
                {i < methodSteps.length - 1 && <div style={{ flex: 1, height: 1, backgroundColor: 'var(--background-status-disabled)', margin: '0 8px', minWidth: 16 }} />}
              </React.Fragment>
            ))}
          </Group>
        </div>

        {/* Info banner */}
        <div style={{ backgroundColor: 'var(--background-status-info)', borderBottom: '1px solid var(--graphic-status-info)', padding: '10px 24px' }}>
          <Group gap={8} align="center">
            <IconInfoCircle size={15} color="var(--graphic-status-info)" />
            <Text size="sm" fw={600} style={{ color: 'var(--text-status-info)' }}>
              Step {step + 1} of {totalSteps} — {currentMethod} · {count.toLocaleString()} Record Requests
            </Text>
          </Group>
        </div>

        {/* Step summary */}
        <div style={{ padding: '20px 24px' }}>
          <Text size="sm" style={{ color: 'var(--text-contrast-low)', lineHeight: 1.6 }}>
            {currentMethod === 'Offsite' && `Schedule ${count.toLocaleString()} Offsite record requests. You'll confirm payment details and commitment date.`}
            {currentMethod === 'Onsite' && `Schedule ${count.toLocaleString()} Onsite record requests. The Onsite Scheduler will open to confirm appointment details.`}
          </Text>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--graphic-contrast-low)' }}>
          <Group justify="space-between" align="center">
            <Button intent="neutral" appearance="ghost" size="sm" onClick={() => advanceStep(true)}>
              Skip {currentMethod}
            </Button>
            <Group gap={8}>
              <Button intent="neutral" appearance="ghost" size="sm" onClick={onClose}>Cancel</Button>
              <Button intent="prominent" appearance="solid" size="sm" onClick={() => setStepModalOpen(true)}>
                Schedule {count.toLocaleString()} {currentMethod} RRs
              </Button>
            </Group>
          </Group>
        </div>
      </div>

      {/* Full scheduling modal for current step — floats on top of stepper */}
      {stepModalOpen && currentMethod === 'Offsite' && (
        <ScheduleModal
          count={count}
          unblockedCount={0}
          onClose={() => setStepModalOpen(false)}
          onSubmit={() => handleStepSubmit()}
        />
      )}
      {stepModalOpen && currentMethod === 'Onsite' && (
        <OnsiteScheduleModal
          count={count}
          onClose={() => setStepModalOpen(false)}
          onSubmit={() => handleStepSubmit()}
        />
      )}
    </>
  );
}

function RerouteStepperModal({ methodSteps, onClose, onStepComplete, countPerMethod }: {
  methodSteps: string[];
  onClose: () => void;
  onStepComplete: (method: string, skipped: boolean) => void;
  countPerMethod?: Record<string, number>;
}) {
  const [step, setStep] = useState(0);
  const [stepModalOpen, setStepModalOpen] = useState(false);

  const currentMethod = methodSteps[step];
  const totalSteps = methodSteps.length;
  const isLast = step === totalSteps - 1;
  const count = countPerMethod?.[currentMethod] ?? 0;

  const advanceStep = (skipped: boolean) => {
    onStepComplete(currentMethod, skipped);
    if (isLast) { onClose(); } else { setStep(s => s + 1); setStepModalOpen(false); }
  };

  return (
    <>
      {!stepModalOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9998 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'var(--background-contrast-none)', borderRadius: 12, zIndex: 9999, width: 560, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text fw={600} size="lg">Reroute Remaining Record Requests</Text>
              <Text style={{ cursor: 'pointer', color: 'var(--text-contrast-minimum)', fontSize: 20, lineHeight: 1 }} onClick={onClose}>×</Text>
            </div>
            {/* Step indicators */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--graphic-contrast-low)' }}>
              <Group gap={4} align="center" wrap="nowrap">
                {methodSteps.map((m, i) => (
                  <React.Fragment key={m}>
                    <Group gap={6} align="center" wrap="nowrap">
                      <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, backgroundColor: i < step ? 'var(--background-status-positive)' : i === step ? 'var(--text-data-blue)' : 'var(--graphic-contrast-low)', color: i < step ? 'var(--text-status-positive)' : i === step ? 'var(--text-contrast-inverse)' : 'var(--graphic-contrast-medium)' }}>
                        {i < step ? '✓' : i + 1}
                      </div>
                      <Text size="xs" fw={i === step ? 600 : 400} style={{ color: i === step ? 'var(--text-contrast-high)' : 'var(--graphic-contrast-medium)', whiteSpace: 'nowrap' }}>{m}</Text>
                    </Group>
                    {i < methodSteps.length - 1 && <div style={{ flex: 1, height: 1, backgroundColor: 'var(--background-status-disabled)', margin: '0 8px', minWidth: 16 }} />}
                  </React.Fragment>
                ))}
              </Group>
            </div>
            {/* Info banner */}
            <div style={{ backgroundColor: 'var(--background-status-info)', borderBottom: '1px solid var(--graphic-status-info)', padding: '10px 24px' }}>
              <Group gap={8} align="center">
                <IconInfoCircle size={15} color="var(--graphic-status-info)" />
                <Text size="sm" fw={600} style={{ color: 'var(--text-status-info)' }}>Step {step + 1} of {totalSteps} — {currentMethod} · {count.toLocaleString()} Record Requests</Text>
              </Group>
            </div>
            {/* Body */}
            <div style={{ padding: '20px 24px' }}>
              <Text size="sm" style={{ color: 'var(--text-contrast-low)', lineHeight: 1.6 }}>
                Reroute {count.toLocaleString()} {currentMethod} record requests. Select the new retrieval method for this group.
              </Text>
            </div>
            {/* Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--graphic-contrast-low)' }}>
              <Group justify="space-between" align="center">
                <Button intent="neutral" appearance="ghost" size="sm" onClick={() => advanceStep(true)}>Skip {currentMethod}</Button>
                <Group gap={8}>
                  <Button intent="neutral" appearance="ghost" size="sm" onClick={onClose}>Cancel</Button>
                  <Button intent="prominent" appearance="solid" size="sm" onClick={() => setStepModalOpen(true)}>
                    Reroute {count.toLocaleString()} {currentMethod} RRs
                  </Button>
                </Group>
              </Group>
            </div>
          </div>
        </>
      )}
      {stepModalOpen && (
        <RerouteModal count={count} excludeMethod={currentMethod} onClose={() => setStepModalOpen(false)} onSubmit={() => advanceStep(false)} />
      )}
    </>
  );
}

// ─── Workspace Screen ────────────────────────────────────────────────────────

function WorkspaceScreen({
  onBackToSearch,
  retrievalMethod,
  activeTab = 'provider',
  onTabChange,
}: {
  onBackToSearch: () => void;
  retrievalMethod: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}) {
  const [contactResult, setContactResult] = useState<ContactResult>(null);
  const [siteAccessType, setSiteAccessType] = useState<string | null>(null);
  const [researchReason, setResearchReason] = useState<string | undefined>(undefined);
  const [noContactReason, setNoContactReason] = useState<string | null>(null);
  const [noContactSubmitted, setNoContactSubmitted] = useState(false);
  const [noContactModalOpen, setNoContactModalOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);
  const [actionScope, setActionScope] = useState<'selected' | 'global'>('selected');
  const [editSiteOpen, setEditSiteOpen] = useState(false);
  const [notesDrawerOpen, setNotesDrawerOpen] = useState(false);
  const [notesDrawerSide, setNotesDrawerSide] = useState<'right' | 'left'>('right');
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [drawerDraft, setDrawerDraft] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [requestRows, setRequestRows] = useState(REQUEST_ROWS.map(r => ({
    ...r,
    status: r.status,
  })));
  const [toast, setToast] = useState<string | null>(null);
  const [tableAction, setTableAction] = useState<string | null>(null);
  const [mixedMethodError, setMixedMethodError] = useState(false);
  const [siteDetailsCollapsed, setSiteDetailsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [filters, setFilters] = useState<Record<string, Set<string>>>({});
  const [verifiedRows, setVerifiedRows] = useState<Set<string>>(new Set());
  // Verification nudge — two either/or paths: 2 individually-verified members OR 2 verified provider groups
  const [verifiedMembers, setVerifiedMembers] = useState<Set<string>>(new Set());
  const [verifiedProviders, setVerifiedProviders] = useState<Set<string>>(new Set());
  const [expandedProviders, setExpandedProviders] = useState<Set<string>>(new Set());
  const [providersShown, setProvidersShown] = useState(10);
  const [activePendsModalOpen, setActivePendsModalOpen] = useState(false);
  const [scheduleNudgeOpen, setScheduleNudgeOpen] = useState(false);
  const [nudgeReason, setNudgeReason] = useState<'members' | 'providers'>('members');
  const [scheduleStepperOpen, setScheduleStepperOpen] = useState(false);
  const nudgeTriggeredRef = useRef(false);
  type UndoEntry = {
    id: string;
    method?: string;
    count: number;
    label: string;
    rowsBefore: typeof REQUEST_ROWS;
    canUndo: boolean;
  };
  const [undoEntries, setUndoEntries] = useState<UndoEntry[]>([]);
  const pushUndoEntry = (entry: Omit<UndoEntry, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setUndoEntries(prev => [...prev, { ...entry, id }]);
  };
  const replaceUndoEntries = (entry: Omit<UndoEntry, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setUndoEntries([{ ...entry, id }]);
  };
  const applyUndoEntry = (entryId: string) => {
    const entry = undoEntries.find(e => e.id === entryId);
    if (!entry) return;
    const beforeMap = new Map(entry.rowsBefore.map(r => [r.id, r]));
    setRequestRows(prev => prev.map(r => beforeMap.get(r.id) || r));
    setUndoEntries(prev => prev.filter(e => e.id !== entryId));
  };
  const dismissUndoEntry = (entryId: string) => {
    setUndoEntries(prev => prev.filter(e => e.id !== entryId));
  };
  const clearUndoEntries = () => setUndoEntries([]);

  // Method-scoped stepper actions — push a per-method undo entry instead of a single global one
  const scheduleMethodStep = (method: string) => {
    const eligible = requestRows.filter(r =>
      ['New', 'Past Due', 'In Progress-Unblocked'].includes(r.status) && r.rowMethod === method
    );
    if (eligible.length === 0) return;
    const rowsBefore = eligible.map(r => ({ ...r }));
    const eligibleIds = new Set(eligible.map(r => r.id));
    setRequestRows(prev => prev.map(r =>
      eligibleIds.has(r.id) ? { ...r, status: 'Scheduled', commit: '3/1/2026' } : r
    ));
    const canUndo = method !== 'Onsite';
    // Skip the persistent banner when there's no undo affordance — toast alone is enough confirmation.
    if (canUndo) {
      pushUndoEntry({
        method,
        count: eligible.length,
        label: `${eligible.length.toLocaleString()} ${method} record request${eligible.length === 1 ? '' : 's'} scheduled`,
        rowsBefore,
        canUndo: true,
      });
    }
    showToast(`${eligible.length.toLocaleString()} ${method} Record Requests Scheduled`);
  };
  const rerouteMethodStep = (sourceMethod: string) => {
    const eligible = requestRows.filter(r =>
      ['New', 'Past Due', 'In Progress-Unblocked'].includes(r.status) && r.rowMethod === sourceMethod
    );
    if (eligible.length === 0) return;
    const rowsBefore = eligible.map(r => ({ ...r }));
    const eligibleIds = new Set(eligible.map(r => r.id));
    setRequestRows(prev => prev.map(r =>
      eligibleIds.has(r.id) ? { ...r, status: 'Rerouted' } : r
    ));
    pushUndoEntry({
      method: sourceMethod,
      count: eligible.length,
      label: `${eligible.length.toLocaleString()} ${sourceMethod} record request${eligible.length === 1 ? '' : 's'} rerouted`,
      rowsBefore,
      canUndo: true,
    });
    showToast(`${eligible.length.toLocaleString()} ${sourceMethod} Record Requests Rerouted`);
  };
  const [viewMode, setViewMode] = useState<'provider' | 'search'>('provider');
  const [searchViewQuery, setSearchViewQuery] = useState(''); // applied query (filters run on this)
  const [searchViewInput, setSearchViewInput] = useState(''); // text in the field, applied on Search/Enter
  const [searchViewFilters, setSearchViewFilters] = useState<Record<string, Set<string>>>({});
  const [queueMode, setQueueMode] = useState(false);
  // Cross-tab guardrail: warn before a Verification action discards a Search-tab queue
  const [queueClearWarn, setQueueClearWarn] = useState<null | { count: number; run: () => void }>(null);
  const [pasteInput, setPasteInput] = useState('');
  const [pastePage, setPastePage] = useState(0);
  const [pasteSource, setPasteSource] = useState<'paste' | 'csv'>('paste');
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const csvInputRef = useRef<HTMLInputElement | null>(null);
  const [unmatchedModalOpen, setUnmatchedModalOpen] = useState(false);
  const unmatchedIdsRef = useRef<string[]>([]);
  const PASTE_PAGE_SIZE = 20;
  const PASTE_MAX = 1000;

  const TOTAL_RR_COUNT = 1247;
  // Un-actioned narrative total (Past Due 38 + Unscheduled 781 + In Progress-Unblocked 15) — what a global bulk action acts on
  const UNACTIONED_RR_COUNT = 38 + 781 + 15;

  const resetWorkspace = () => {
    setRequestRows(REQUEST_ROWS.map(r => ({ ...r })));
    setSelectedRows(new Set());
    setVerifiedRows(new Set());
    setVerifiedMembers(new Set());
    setVerifiedProviders(new Set());
    setTableAction(null);
    setActiveAction(null);
    setSearchViewQuery('');
    setSearchViewFilters({});
    setQueueMode(false);
    clearUndoEntries();
    setFilters({});
    setSearchQuery('');
    setContactResult(null);
    setNoContactReason(null);
    setNoContactSubmitted(false);
    nudgeTriggeredRef.current = false;
    onBackToSearch();
  };

  const toggleVerified = (id: string) => {
    const isOn = verifiedRows.has(id);
    setVerifiedRows(prev => { const next = new Set(prev); if (isOn) next.delete(id); else next.add(id); return next; });
    // member-level verifies feed the "2 members" nudge path
    setVerifiedMembers(prev => { const next = new Set(prev); if (isOn) next.delete(id); else next.add(id); return next; });
  };

  // Verify Provider — marks all the provider's members verified + feeds the "2 provider groups" nudge path
  const verifyProvider = (provider: string, rrIds: string[]) => {
    setVerifiedRows(prev => { const next = new Set(prev); rrIds.forEach(id => next.add(id)); return next; });
    setVerifiedProviders(prev => { const next = new Set(prev); next.add(provider); return next; });
  };


  const toggleExpanded = (provider: string) => {
    setExpandedProviders(prev => {
      const next = new Set(prev);
      if (next.has(provider)) next.delete(provider); else next.add(provider);
      return next;
    });
  };

  const toggleVerifyProvider = (rrIds: string[]) => {
    setVerifiedRows(prev => {
      const next = new Set(prev);
      const allVerified = rrIds.every(id => next.has(id));
      if (allVerified) {
        rrIds.forEach(id => next.delete(id));
      } else {
        rrIds.forEach(id => next.add(id));
      }
      return next;
    });
  };

  const toggleFilter = (filterKey: string, value: string) => {
    setFilters(prev => {
      const current = prev[filterKey] || new Set<string>();
      const next = new Set(current);
      if (next.has(value)) next.delete(value); else next.add(value);
      return { ...prev, [filterKey]: next };
    });
  };

  const resetFilters = () => setFilters({});

  const toggleSearchViewFilter = (filterKey: string, value: string) => {
    setSearchViewFilters(prev => {
      const current = prev[filterKey] || new Set<string>();
      const next = new Set(current);
      if (next.has(value)) next.delete(value); else next.add(value);
      return { ...prev, [filterKey]: next };
    });
  };
  const resetSearchView = () => { setSearchViewQuery(''); setSearchViewInput(''); setSearchViewFilters({}); };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  const addNote = (text: string) => {
    setNotes((prev) => [
      { id: Date.now(), initials: 'JS', color: '#7c3aed', author: 'Jordan Schaefer', timestamp: 'just now', text },
      ...prev,
    ]);
  };

  const isConnected = contactResult === 'connected';
  const isInbound = retrievalMethod === 'inbound';
  const isEmrRemote = isInbound ? false : retrievalMethod === 'emr-remote';

  useEffect(() => {
    // Either/or: 2 individually-verified members OR 2 verified provider groups. One provider alone never nudges.
    if ((verifiedMembers.size >= 2 || verifiedProviders.size >= 2) && !nudgeTriggeredRef.current && isConnected) {
      nudgeTriggeredRef.current = true;
      setNudgeReason(verifiedProviders.size >= 2 ? 'providers' : 'members');
      setScheduleNudgeOpen(true);
    }
  }, [verifiedMembers.size, verifiedProviders.size, isConnected]);

  // For inbound: determine the active retrieval method from filter selection
  const methodFilter = filters['Retrieval Method'];
  const filteredToSingleMethod = methodFilter && methodFilter.size === 1;
  const activeMethod = filteredToSingleMethod ? Array.from(methodFilter)[0] : null;
  const effectiveMethod = isInbound ? (activeMethod === 'EMRR' ? 'emr-remote' : activeMethod?.toLowerCase() || null) : retrievalMethod;
  const canTakeGlobalAction = isConnected;
  const canTakeAction = isConnected;

  const toggleRow = (id: string) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const unactionedRows = requestRows.filter(r => (r.status === 'New' || r.status === 'Past Due' || r.status === 'In Progress-Unblocked') && !(isInbound && r.rowMethod === 'EMRR'));

  const toggleAll = () => {
    if (selectedRows.size === unactionedRows.length && unactionedRows.length > 0) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(unactionedRows.map(r => r.id)));
    }
  };

  const handleChangeAnswer = () => {
    setContactResult(null);
    setNoContactReason(null);
    setNoContactSubmitted(false);
    setNoContactModalOpen(false);
    setSelectedRows(new Set());
  };

  const isEmrrContext = isEmrRemote;
  const toastMessages: Record<ActionType, string> = isEmrrContext
    ? { schedule: 'Credential Progress Updated', research: 'Record Requests Sent to Research', pend: 'Record Requests Pended', reroute: 'Record Requests Rerouted', release: 'Pends Released', 'emrr-progress': 'Credential Progress Updated' }
    : { schedule: 'Record Requests Scheduled', research: 'Record Requests Sent to Research', pend: 'Record Requests Pended', reroute: 'Record Requests Rerouted', release: 'Pends Released', 'emrr-progress': 'Credential Progress Updated' };

  // Apply action to rows (update status + commitment date for schedule)
  const applyAction = (action: ActionType, global?: boolean, customStatus?: string, commitDate?: string, paymentRequired?: boolean, allowUndo = true, excludeScheduled = false) => {
    const statusMap: Record<ActionType, string> = isEmrrContext
      ? { schedule: 'Outreach In Progress', research: 'In Research', pend: 'Pended', reroute: 'Rerouted', release: 'Past Due', 'emrr-progress': 'Outreach In Progress' }
      : { schedule: 'Scheduled', research: 'In Research', pend: 'Pended', reroute: 'Rerouted', release: 'Past Due', 'emrr-progress': 'Outreach In Progress' };
    const finalStatus = customStatus || statusMap[action];
    // For release: only target rows that are actually pended.
    // For all other actions: skip pended rows (must be released first).
    const baseTargets = global ? new Set(requestRows.map(r => r.id)) : selectedRows;
    const targetIds = action === 'release'
      ? new Set(requestRows.filter(r => baseTargets.has(r.id) && r.status === 'Pended').map(r => r.id))
      : action === 'emrr-progress'
        ? new Set(requestRows.filter(r => baseTargets.has(r.id) && r.status !== 'Pended' && r.rowMethod === 'EMRR').map(r => r.id))
        // Bulk actions only touch RRs that aren't already actioned (New / Past Due / In Progress-Unblocked).
        // Exception: scheduling can opt back in to already-scheduled inventory via the include/exclude radio.
        : new Set(requestRows.filter(r => {
            if (!baseTargets.has(r.id)) return false;
            if (['New', 'Past Due', 'In Progress-Unblocked'].includes(r.status)) return true;
            return action === 'schedule' && !excludeScheduled && r.status === 'Scheduled';
          }).map(r => r.id));
    const pendedSkipped = action !== 'release'
      ? requestRows.filter(r => baseTargets.has(r.id) && r.status === 'Pended').length
      : 0;

    if (targetIds.size > 0) {
      const rowsBefore = requestRows.filter(r => targetIds.has(r.id)).map(r => ({ ...r }));
      if (allowUndo) {
        const count = action === 'release' ? targetIds.size : (global ? UNACTIONED_RR_COUNT : targetIds.size);
        const label = `${count.toLocaleString()} ${toastMessages[action].toLowerCase()}`;
        replaceUndoEntries({ count, label, rowsBefore, canUndo: true });
      } else {
        clearUndoEntries();
      }
      setRequestRows(prev => prev.map(r =>
        targetIds.has(r.id) ? {
          ...r,
          status: finalStatus,
          pendCode: action === 'release' ? null : r.pendCode,
          commit: (action === 'schedule' && finalStatus !== 'No Availability') ? (commitDate ? commitDate.replace(/^(\d{4})-(\d{2})-(\d{2})$/, (_, y, m, d) => `${parseInt(m)}/${parseInt(d)}/${y}`) : r.commit) : r.commit,
          payment: paymentRequired ? 'Payment Requested' : r.payment,
        } : r
      ));
      setSelectedRows(new Set());
      const baseMsg = toastMessages[action];
      // Only mention pend-skip in toast for inbound — outbound shouldn't see pend wording at all
      showToast(isInbound && pendedSkipped > 0 ? `${baseMsg} · ${pendedSkipped} pended skipped — release first` : baseMsg);
    } else if (isInbound && pendedSkipped > 0) {
      showToast(`Cannot apply to pended RRs — release pends first (${pendedSkipped} skipped)`);
    }
    setActiveAction(null);
    setActionScope('selected');
  };

  // If a Search-tab queue exists, confirm before a Verification action clears it; otherwise run immediately.
  const guardQueue = (run: () => void) => {
    if (selectedRows.size > 0) setQueueClearWarn({ count: selectedRows.size, run });
    else run();
  };

  // "Save Progress" from a schedule modal — log progress without scheduling (shows as "Progress Saved" in Actioned)
  const logProgress = (global?: boolean) => {
    const baseTargets = global ? new Set(requestRows.map(r => r.id)) : selectedRows;
    const targetIds = new Set(requestRows.filter(r => baseTargets.has(r.id) && ['New', 'Past Due', 'In Progress-Unblocked'].includes(r.status)).map(r => r.id));
    if (targetIds.size > 0) {
      clearUndoEntries();
      setRequestRows(prev => prev.map(r => targetIds.has(r.id) ? { ...r, status: 'Progress Logged' } : r));
      setSelectedRows(new Set());
      showToast('Progress Saved');
    }
    setActiveAction(null);
    setActionScope('selected');
  };

  // Apply global action to all rows
  const applyGlobalAction = (action: ActionType) => {
    if (action === 'release') {
      setActionScope('global');
      applyAction('release', true);
      return;
    }
    if (action === 'research') setResearchReason(undefined);
    setActionScope('global');
    setActiveAction(action);
  };

  // Count stats
  const statusCounts = requestRows.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const needsActionCount = (statusCounts['New'] || 0);
  const unblockedCount = (statusCounts['In Progress-Unblocked'] || 0);
  const pastDueCount = 0;

  // Filtered rows for display
  const filteredRows = requestRows.filter(row => {
    // Outbound (offsite, onsite, EMRR) shouldn't see pended state at all
    if (!isInbound && row.status === 'Pended') return false;
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = row.id.includes(q) || row.member.toLowerCase().includes(q) || row.plan.toLowerCase().includes(q) || row.practitioner.toLowerCase().includes(q);
      if (!match) return false;
    }
    // Filters
    const statusFilter = filters['Status'] || filters['Outcome'];
    if (statusFilter && statusFilter.size > 0) {
      const effectiveStatus = (isInbound && row.status === 'Pended' && row.pendCode) ? row.pendCode : row.status;
      if (!statusFilter.has(effectiveStatus)) return false;
    }
    const practFilter = filters['Practitioner'];
    if (practFilter && practFilter.size > 0 && !practFilter.has(row.practitioner)) return false;
    const osRefFilter = filters['OS-Ref'];
    if (osRefFilter && osRefFilter.size > 0 && !osRefFilter.has(row.osRef)) return false;
    const methodFilterSet = filters['Retrieval Method'];
    if (methodFilterSet && methodFilterSet.size > 0 && !methodFilterSet.has(row.rowMethod)) return false;
    return true;
  });

  return (
    <Box style={{ height: '100vh', width: '100vw', maxWidth: '100vw', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Dark topbar */}
      <Box style={{ backgroundColor: 'var(--background-contrast-inverse)', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <Text style={{ color: 'var(--text-contrast-inverse)', fontWeight: 700, fontSize: 18, letterSpacing: -0.3 }}>datavant</Text>
        <Text size="xs" style={{ color: 'var(--text-contrast-inverse)', opacity: 0.8, textAlign: 'right', lineHeight: 1.4 }}>user@useremail.com<br />Tenant</Text>
      </Box>

      {/* Page header — sticky */}
      <Box style={{ backgroundColor: 'var(--background-contrast-none)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <Title order={2} fw={500} style={{ fontSize: 24, flexShrink: 0 }}>NexReach</Title>
        <Group gap="sm" style={{ flexShrink: 0 }}>
          <Button intent="neutral" appearance="outline" size="sm" onClick={onBackToSearch}>Back to Search</Button>
          <Button
            intent="prominent"
            appearance="solid"
            size="sm"
            onClick={resetWorkspace}
          >
            Finish Outreach
          </Button>
        </Group>
      </Box>

      {/* Two-column body */}
      <Box style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

        {/* LEFT PANEL — Site Details with collapse toggle */}
        {siteDetailsCollapsed ? (
          /* Collapsed: narrow sliver with expand button + rotated label */
          <Box style={{ width: 36, flexShrink: 0, position: 'relative', backgroundColor: 'var(--background-contrast-medium)', borderRadius: '0 12px 12px 0', alignSelf: 'stretch' }}>
            <Box
              onClick={() => setSiteDetailsCollapsed(false)}
              style={{
                position: 'absolute', top: 64, right: -14,
                width: 28, height: 28, borderRadius: '50%',
                backgroundColor: 'var(--background-contrast-none)', border: '2px solid var(--graphic-interactive-prominent-resting)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', zIndex: 10,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--background-status-info)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--text-contrast-inverse)'; }}
            >
              <IconChevronRight size={14} color="var(--text-data-blue)" />
            </Box>
            <Text size="xs" style={{ color: 'var(--text-contrast-minimum)', position: 'absolute', top: 112, left: '50%', transform: 'translateX(-50%) rotate(180deg)', writingMode: 'vertical-rl', whiteSpace: 'nowrap', letterSpacing: 0.3 }}>Site Details</Text>
          </Box>
        ) : (
          /* Expanded: full panel with collapse button pinned to card edge */
          <Box style={{ width: 233, minWidth: 233, flexShrink: 0, position: 'relative' }}>
            <Box
              onClick={() => setSiteDetailsCollapsed(true)}
              style={{
                position: 'absolute', right: 6, top: 84,
                width: 28, height: 28, borderRadius: '50%',
                backgroundColor: 'var(--background-contrast-none)', border: '2px solid var(--graphic-interactive-prominent-resting)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.16)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', zIndex: 10,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--background-status-info)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--text-contrast-inverse)'; }}
            >
              <IconChevronLeft size={14} color="var(--text-data-blue)" />
            </Box>
            <Box style={{ overflowY: 'auto', height: '100%', padding: '20px' }}>
            <Box style={{ backgroundColor: 'var(--background-contrast-medium)', borderRadius: 12, padding: '20px 16px' }}>
              <Group justify="space-between" align="center" mb={16}>
                <Text size="md" fw={500}>Site Details</Text>
                <Text size="xs" fw={500} style={{ color: 'var(--text-data-blue)', cursor: 'pointer' }} onClick={() => setEditSiteOpen(true)}>Edit</Text>
              </Group>

              <Stack gap="md">
                {[
                  { label: 'Site Name', value: 'Manhattan Internal Medicine' },
                  { label: 'Primary Address', value: '123 Main St., #330,\nNew York, NY 12345' },
                  { label: 'Phone Number', value: '718-555-1234' },
                  { label: 'Fax Number', value: '718-555-5678' },
                  { label: 'Primary Contact', value: 'Mason Reed' },
                  { label: 'Primary Contact Email', value: 'mason@manhattanim.com' },
                  { label: 'Preferred Retrieval Method', value: isInbound ? 'Offsite, Onsite, EMRR' : retrievalMethod === 'onsite' ? 'Onsite' : retrievalMethod === 'emr-remote' ? 'EMRR' : 'Offsite' },
                ].map(({ label, value }) => (
                  <Box key={label}>
                    <Text size="sm" style={{ color: 'var(--text-contrast-low)' }}>{label}</Text>
                    <Text size="sm" style={{ whiteSpace: 'pre-line', lineHeight: 1.4, color: 'var(--text-contrast-high)' }}>{value}</Text>
                  </Box>
                ))}
              </Stack>

              {/* Agent Notes button */}
              <Box style={{ marginTop: 16 }}>
                <Box
                  onClick={() => setNotesDrawerOpen(true)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: 8, background: 'var(--background-contrast-none)',
                    border: '1px solid var(--graphic-contrast-low)', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--background-data-blue)'; e.currentTarget.style.borderColor = 'var(--text-data-blue)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--text-contrast-inverse)'; e.currentTarget.style.borderColor = 'var(--graphic-contrast-low)'; }}
                >
                  <Group gap={8}>
                    <IconNotes size={14} color="var(--text-data-blue)" />
                    <Text size="sm" fw={500} style={{ color: 'var(--text-contrast-high)' }}>Agent Notes</Text>
                  </Group>
                  <Badge status="prominent" type="number">{notes.length}</Badge>
                </Box>
              </Box>
            </Box>
            </Box>
          </Box>
        )}

        {/* RIGHT CONTENT AREA */}
        <Box style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
          <Box p="xl">

            {/* ── Call Actions ── */}
            <Box mb="lg">
              <Text fw={700} size="lg" mb={16} style={{ fontSize: 18 }}>Call Actions</Text>

              {/* Contact result row + reference ID */}
              <Flex align="flex-start" gap={24} wrap="wrap" justify="space-between">
                <Box>
                  <Text size="md" fw={600} mb={12} style={{ color: 'var(--text-contrast-high)' }}>Office Contact Result</Text>
                  {contactResult === null ? (
                    <Group gap={10}>
                      <Button intent="prominent" appearance="solid" size="xs" onClick={() => setContactResult('connected')}>
                        Connected
                      </Button>
                      <Button intent="neutral" appearance="outline" size="xs" onClick={() => { setContactResult('not-connected'); setSelectedRows(new Set()); }}>
                        Did Not Connect
                      </Button>
                    </Group>
                  ) : contactResult === 'connected' ? (
                    <Group gap={10}>
                      <Box style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 10px', backgroundColor: 'var(--background-status-positive)', color: 'var(--text-status-positive)', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                        Connected
                      </Box>
                      <Group gap={4} style={{ cursor: 'pointer' }} onClick={handleChangeAnswer}>
                        <IconRotateClockwise size={13} color="var(--text-status-info)" />
                        <Text size="sm" style={{ color: 'var(--text-data-blue)' }}>Change Answer</Text>
                      </Group>
                    </Group>
                  ) : (
                    <Group gap={10}>
                      <Box style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 10px', backgroundColor: 'var(--background-status-negative)', color: 'var(--text-status-negative)', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                        Not Connected
                      </Box>
                      <Group gap={4} style={{ cursor: 'pointer' }} onClick={handleChangeAnswer}>
                        <IconRotateClockwise size={13} color="var(--text-status-info)" />
                        <Text size="sm" style={{ color: 'var(--text-data-blue)' }}>Change Answer</Text>
                      </Group>
                    </Group>
                  )}
                </Box>

                {/* Reason for No Contact — shown when Not Connected */}
                {contactResult === 'not-connected' && (
                  <>
                  <Box style={{ width: 1, alignSelf: 'stretch', backgroundColor: 'var(--background-status-disabled)' }} />
                  <Box>
                    <Text size="md" fw={600} mb={12} style={{ color: 'var(--text-contrast-high)' }}>Reason for No Contact</Text>
                    <Group gap="sm" align="center">
                      <Select
                        comboboxProps={{ zIndex: 10001 }}
                        placeholder="Select"
                        data={[
                          { value: 'no_answer_no_vm', label: 'No Answer (No Voicemail)' },
                          { value: 'no_answer_left_vm', label: 'No Answer (Left Voicemail)' },
                          { value: 'not_practitioner', label: 'Not a Practitioner Office' },
                          { value: 'site_closed', label: 'Site Permanently Closed' },
                        ]}
                        value={noContactReason}
                        onChange={(v) => { setNoContactReason(v); setNoContactSubmitted(false); }}
                        style={{ width: 220 }}
                      />
                      <Button
                        intent="prominent"
                        appearance="solid"
                        size="xs"
                        disabled={!noContactReason}
                        onClick={() => setNoContactModalOpen(true)}
                      >
                        Submit
                      </Button>
                    </Group>
                  </Box>
                  </>
                )}

                {/* Reference ID card */}
                <Box style={{ border: '1px solid var(--graphic-contrast-low)', borderRadius: 4, padding: '8px 16px', textAlign: 'right', backgroundColor: 'var(--background-data-blue)', flexShrink: 0 }}>
                  <Text size="xs" c="dimmed" mb={2}>Reference ID</Text>
                  <Text fw={700} size="sm">NR-718-555-12345</Text>
                </Box>
              </Flex>
            </Box>

            <Divider mb="lg" />

            <Text fw={700} size="lg" mb="md" style={{ fontSize: 18 }}>Record Request Actions</Text>

            {/* Workspace / Site History tabs */}
            <Tabs variant="pill" value={activeTab} onChange={(v) => v && onTabChange?.(v)}>
              <Tabs.List mb="lg">
                <Tabs.Tab value="provider">Verification</Tabs.Tab>
                <Tabs.Tab value="search">Workbench</Tabs.Tab>
                <Tabs.Tab value="history">Call History</Tabs.Tab>
              </Tabs.List>

              {/* ── PROVIDER VIEW TAB ── */}
              <Tabs.Panel value="provider">
                <Stack gap="xl">

                  {/* Sample workspace */}
                  <Box>

                    {/* ── Inventory Overview ── */}
                    {(() => {
                      const uniquePlans = [...new Set(requestRows.map(r => r.plan))];
                      const lastCall = CALL_HISTORY_ROWS[0];
                      const showUnifiedCard = (retrievalMethod === 'offsite' || retrievalMethod === 'onsite' || retrievalMethod === 'emr-remote' || isInbound);
                      const showPends = false; // PENDS card cut from snapshot
                      const isOffsiteOrOnsite = retrievalMethod === 'offsite' || retrievalMethod === 'onsite';
                      const gridCols = showPends
                        ? '1fr 1px 1fr 1px 1fr'
                        : isOffsiteOrOnsite
                          ? '1fr 1px 1fr'
                          : '1fr 1px auto';
                      return showUnifiedCard ? (
                        <Box mb="lg" style={{ border: '1px solid var(--graphic-contrast-low)', borderRadius: 8, overflow: 'hidden' }}>

                          {/* Hero row — scope */}
                          <Box style={{ backgroundColor: 'var(--background-data-blue)', padding: '14px 20px', borderBottom: '1px solid #c3dcf5' }}>
                            <Group gap={0} align="baseline" wrap="nowrap">
                              <Text style={{ fontSize: 28, fontWeight: 700, color: '#0b4a82', lineHeight: 1, marginRight: 10 }}>
                                {TOTAL_RR_COUNT.toLocaleString()}
                              </Text>
                              <Text size="sm" fw={500} style={{ color: '#1f5f9c', marginRight: 16 }}>Record Requests</Text>
                              <Text size="sm" style={{ color: '#4d8ab8', marginRight: 6 }}>·</Text>
                              <Text size="sm" style={{ color: '#4d8ab8', marginRight: 16 }}>{TOTAL_PROVIDERS} providers</Text>
                              <Text size="sm" style={{ color: '#4d8ab8', marginRight: 6 }}>·</Text>
                              {uniquePlans.length === 1 ? (
                                <Text size="sm" style={{ color: '#4d8ab8' }}>{uniquePlans[0]}</Text>
                              ) : (
                                <Tooltip
                                  label={uniquePlans.join(', ')}
                                  withArrow
                                  position="bottom"
                                  multiline
                                  w={280}
                                >
                                  <Text size="sm" style={{ color: '#4d8ab8', textDecoration: 'underline dotted', textUnderlineOffset: 3, cursor: 'help' }}>
                                    Multiple health plans ({uniquePlans.length})
                                  </Text>
                                </Tooltip>
                              )}
                            </Group>
                          </Box>

                          {/* Column breakdown */}
                          <Box style={{ display: 'grid', gridTemplateColumns: gridCols, backgroundColor: 'var(--background-contrast-none)' }}>

                            {/* Needs Action */}
                            <Box style={{ padding: '12px 16px' }}>
                              <Group gap={4} mb={10} align="center">
                                <IconAlertTriangle size={13} color="var(--graphic-status-caution)" />
                                <Text size="xs" fw={600} style={{ color: 'var(--graphic-status-caution)', textTransform: 'uppercase', letterSpacing: 0.4 }}>Needs Action</Text>
                              </Group>
                              <Group gap={24}>
                                <Box>
                                  <Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }}>Past Due</Text>
                                  <Text size="md" fw={700} style={{ color: 'var(--text-contrast-high)' }}>38</Text>
                                </Box>
                                <Box>
                                  <Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }}>{isEmrRemote ? 'New' : 'Unscheduled'}</Text>
                                  <Text size="md" fw={700} style={{ color: 'var(--text-contrast-high)' }}>781</Text>
                                </Box>
                                <Box>
                                  <Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }}>In Progress-Unblocked</Text>
                                  <Text size="md" fw={700} style={{ color: 'var(--text-contrast-high)' }}>{unblockedCount}</Text>
                                </Box>
                              </Group>
                            </Box>

                            <Box style={{ backgroundColor: 'var(--background-status-disabled)' }} />

                            {/* Pends — inbound only (outbound agents don't need this) */}
                            {showPends && (
                              <>
                                <Box style={{ padding: '12px 16px' }}>
                                  {(() => {
                                    const actionable = ACTIVE_PENDS.filter(p => p.actionable);
                                    const blocked = ACTIVE_PENDS.filter(p => !p.actionable);
                                    const preview = [...actionable, ...blocked].slice(0, 3);
                                    const hasMore = ACTIVE_PENDS.length > 3;
                                    return (
                                      <>
                                        <Group justify="space-between" align="center" mb={10}>
                                          <Text size="xs" fw={600} style={{ color: 'var(--text-contrast-minimum)', textTransform: 'uppercase', letterSpacing: 0.4 }}>Pends</Text>
                                          {hasMore && (
                                            <Text size="xs" fw={500} style={{ color: 'var(--text-data-blue)', cursor: 'pointer' }} onClick={() => setActivePendsModalOpen(true)}>
                                              View All ({ACTIVE_PENDS.length})
                                            </Text>
                                          )}
                                        </Group>
                                        {ACTIVE_PENDS.length === 0 ? (
                                          <Text size="sm" style={{ color: 'var(--text-contrast-minimum)' }}>None</Text>
                                        ) : (
                                          <Group gap={20} align="flex-start">
                                            {preview.map(p => (
                                              <Box key={p.code}>
                                                <Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }}>{p.code}</Text>
                                                <Text size="md" fw={700} style={{ color: 'var(--text-contrast-high)' }}>{p.count}</Text>
                                              </Box>
                                            ))}
                                          </Group>
                                        )}
                                      </>
                                    );
                                  })()}
                                </Box>

                                <Box style={{ backgroundColor: 'var(--background-status-disabled)' }} />
                              </>
                            )}

                            {/* Credential Pipeline — inbound + EMRR, last column of top row */}
                            {(isInbound || isEmrRemote) && (
                              <Box style={{ padding: '12px 16px' }}>
                                <Text size="xs" fw={600} mb={10} style={{ color: 'var(--text-contrast-minimum)', textTransform: 'uppercase', letterSpacing: 0.4 }}>Credential Pipeline</Text>
                                <Group gap={20}>
                                  {[
                                    { label: 'Outreach In Prog', key: 'Outreach In Progress' },
                                    { label: 'Credentialing In Prog', key: 'Credentialing In Progress' },
                                    { label: 'Credentialing Invalid', key: 'Credentialing Invalid' },
                                    { label: 'Awaiting Queued', key: 'Awaiting Queued' },
                                    { label: 'Awaiting Assignment', key: 'Awaiting Assignment' },
                                  ].map(s => (
                                    <Box key={s.key}>
                                      <Text size="xs" style={{ color: 'var(--text-contrast-minimum)', whiteSpace: 'nowrap' }}>{s.label}</Text>
                                      <Text size="md" fw={700} style={{ color: 'var(--text-contrast-high)' }}>{statusCounts[s.key] || 0}</Text>
                                    </Box>
                                  ))}
                                </Group>
                              </Box>
                            )}

                            {/* Actioned — offsite/onsite only, in-grid last column */}
                            {!isInbound && !isEmrRemote && (
                              <Box style={{ padding: '12px 16px' }}>
                                <Text size="xs" fw={600} mb={10} style={{ color: 'var(--text-contrast-minimum)', textTransform: 'uppercase', letterSpacing: 0.4 }}>Actioned</Text>
                                <Group gap={20}>
                                  {[['Scheduled', statusCounts['Scheduled'] || 12], ['Progress Saved', statusCounts['Progress Logged'] || 0], ...(retrievalMethod === 'onsite' ? [['No Availability', statusCounts['No Availability'] || 0]] : []), ['Sent to Research', statusCounts['In Research'] || 4], ['Rerouted', statusCounts['Rerouted'] || 0], ['Pended', statusCounts['Pended'] || 0]].map(([s, n]) => (
                                    <Box key={s as string}>
                                      <Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }}>{s}</Text>
                                      <Text size="md" fw={700} style={{ color: 'var(--text-contrast-high)' }}>{n as number}</Text>
                                    </Box>
                                  ))}
                                </Group>
                              </Box>
                            )}
                          </Box>

                          {/* Actioned — inbound + EMRR, second row */}
                          {(isInbound || isEmrRemote) && (
                            <Box style={{ borderTop: '1px solid var(--graphic-contrast-low)', padding: '12px 16px', backgroundColor: 'var(--background-contrast-none)' }}>
                              <Text size="xs" fw={600} mb={10} style={{ color: 'var(--text-contrast-minimum)', textTransform: 'uppercase', letterSpacing: 0.4 }}>Actioned</Text>
                              <Group gap={20}>
                                {(isInbound
                                  ? [['Scheduled', statusCounts['Scheduled'] || 12], ['Progress Saved', statusCounts['Progress Logged'] || 0], ['No Availability', statusCounts['No Availability'] || 0], ['Sent to Research', statusCounts['In Research'] || 4], ['Rerouted', statusCounts['Rerouted'] || 0], ['Pended', statusCounts['Pended'] || 0]]
                                  : [['Sent to Research', statusCounts['In Research'] || 0], ['Rerouted', statusCounts['Rerouted'] || 0], ['Pended', statusCounts['Pended'] || 0]]
                                ).map(([s, n]) => (
                                  <Box key={s as string}>
                                    <Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }}>{s}</Text>
                                    <Text size="md" fw={700} style={{ color: 'var(--text-contrast-high)' }}>{n as number}</Text>
                                  </Box>
                                ))}
                              </Group>
                            </Box>
                          )}

                          {/* Footer — last outreach */}
                          <Box style={{ backgroundColor: 'var(--background-contrast-medium)', borderTop: '1px solid var(--graphic-contrast-low)', padding: '8px 20px' }}>
                            <Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }}>
                              Last outreach: {lastCall.timestamp.split(',')[0]} · {lastCall.outcome.split('\n')[0]} · {lastCall.agent}
                            </Text>
                          </Box>

                        </Box>
                      ) : (
                        /* EMRR / Inbound — existing layout unchanged */
                        <Flex gap={12} mb="lg" wrap="wrap" align="stretch">
                          <Box style={{ border: '1px solid var(--graphic-interactive-prominent-resting)', backgroundColor: 'var(--background-data-blue)', borderRadius: 8, padding: '12px 20px', minWidth: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Text size="xs" fw={600} style={{ color: 'var(--text-data-blue)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Record Requests</Text>
                            <Text style={{ fontSize: 30, fontWeight: 700, color: '#0b4a82', lineHeight: 1.1, marginTop: 2 }}>{TOTAL_RR_COUNT.toLocaleString()}</Text>
                            <Text size="xs" style={{ color: '#1f5f9c', marginTop: 4 }}>across {TOTAL_PROVIDERS} providers</Text>
                          </Box>
                          <Box style={{ border: '1px solid var(--graphic-status-caution)', backgroundColor: 'var(--background-status-caution)', borderRadius: 6, padding: '10px 14px' }}>
                            <Group gap={4} mb={6} align="center">
                              <Text style={{ fontSize: 13, color: 'var(--graphic-status-caution)' }}>&#9888;</Text>
                              <Text size="xs" fw={600} style={{ color: 'var(--text-contrast-high)' }}>RRs Needing Action</Text>
                            </Group>
                            <Group gap={16}>
                              <Box><Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }}>Past Due</Text><Text size="sm" fw={700} style={{ color: 'var(--text-contrast-high)' }}>{pastDueCount}</Text></Box>
                              <Box><Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }}>New</Text><Text size="sm" fw={700} style={{ color: 'var(--text-contrast-high)' }}>{needsActionCount}</Text></Box>
                            </Group>
                          </Box>
                          <Box style={{ border: '1px solid var(--graphic-contrast-low)', borderRadius: 6, padding: '10px 14px' }}>
                            <Text size="xs" fw={600} mb={6} style={{ color: 'var(--text-contrast-high)' }}>{isEmrRemote || isInbound ? 'RRs in Credential Pipeline' : 'Scheduling Pipeline'}</Text>
                            <Group gap={0} wrap="nowrap" style={{ overflowX: 'auto' }}>
                              {[{ label: 'Outreach In Prog', full: 'Outreach In Progress' }, { label: 'Credentialing In Prog', full: 'Credentialing In Progress' }, { label: 'Awaiting Queued', full: 'Awaiting Queued' }, { label: 'Awaiting Assignment', full: 'Awaiting Assignment' }].map(s => (
                                <Box key={s.label} style={{ padding: '0 8px' }}>
                                  <Text size="xs" mb={2} style={{ color: 'var(--text-contrast-minimum)', whiteSpace: 'nowrap' }}>{s.label}</Text>
                                  <Text size="sm" fw={700} style={{ color: 'var(--text-contrast-high)' }}>{statusCounts[s.full] || 0}</Text>
                                </Box>
                              ))}
                            </Group>
                          </Box>
                          <Box style={{ border: '1px solid var(--graphic-contrast-low)', borderRadius: 6, padding: '10px 14px' }}>
                            <Text size="xs" fw={600} mb={6} style={{ color: 'var(--text-contrast-high)' }}>RRs Actioned</Text>
                            <Group gap={14}>
                              {[...(isInbound ? ['Scheduled', 'Progress Logged', 'No Availability'] : []), 'In Research', 'Rerouted', 'Pended'].map(s => (
                                <Box key={s}><Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }}>{s === 'In Research' ? 'Sent to Research' : s}</Text><Text size="sm" fw={700} style={{ color: 'var(--text-contrast-high)' }}>{statusCounts[s] || 0}</Text></Box>
                              ))}
                            </Group>
                          </Box>
                        </Flex>
                      );
                    })()}

                    {/* Bulk actions now live on the Search tab — no action card needed on Verification */}

                    {/* Undo banners — one per action group (per method for stepper flows); all dismissable via X */}
                    {undoEntries.map(entry => (
                      <Box
                        key={entry.id}
                        mb="sm"
                        style={{
                          backgroundColor: 'var(--background-status-positive)',
                          border: '1px solid var(--graphic-status-positive)',
                          borderRadius: 8,
                          padding: '10px 14px',
                        }}
                      >
                        <Group justify="space-between" align="center" wrap="nowrap" gap={12}>
                          <Group gap={8} align="center" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
                            <IconCheck size={16} color="var(--text-status-positive)" style={{ flexShrink: 0 }} />
                            <Text size="sm" fw={600} style={{ color: 'var(--text-status-positive)' }}>
                              {entry.label}{!entry.canUndo && ' — cannot be undone'}
                            </Text>
                          </Group>
                          <Group gap={6} align="center" wrap="nowrap" style={{ flexShrink: 0 }}>
                            {entry.canUndo && (
                              <Button intent="neutral" appearance="ghost" size="xs" onClick={() => applyUndoEntry(entry.id)}>
                                Undo
                              </Button>
                            )}
                            <ActionIcon variant="subtle" size="sm" onClick={() => dismissUndoEntry(entry.id)} aria-label="Dismiss">
                              <IconX size={14} color="var(--text-status-positive)" />
                            </ActionIcon>
                          </Group>
                        </Group>
                      </Box>
                    ))}

                    {/* Request table */}
                    <Box style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: 'calc(100vh - 340px)', border: '1px solid var(--graphic-contrast-low)', borderRadius: 6 }}>
                        <Table highlightOnHover style={{ minWidth: 1800, borderCollapse: 'collapse' }}>
                          <Table.Thead style={{ position: 'sticky', top: 0, zIndex: 2, backgroundColor: 'var(--background-contrast-medium)' }}>
                            <Table.Tr style={{ backgroundColor: 'var(--background-contrast-medium)', borderBottom: '1px solid var(--graphic-contrast-low)' }}>
                              <Table.Th style={{ padding: '8px', width: 120, minWidth: 120 }}></Table.Th>
                              <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Request ID</Text></Table.Th>
                              {isInbound && <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Retrieval Method</Text></Table.Th>}
                              <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Health Plan</Text></Table.Th>
                              <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Member Name</Text></Table.Th>
                              <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Member DOB</Text></Table.Th>
                              <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>SDOS</Text></Table.Th>
                              <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Project Due Date</Text></Table.Th>
                              <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Commitment Date</Text></Table.Th>
                              <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Status</Text></Table.Th>
                              <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Payment Status</Text></Table.Th>
                              {retrievalMethod === 'onsite' && <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>OS-Ref</Text></Table.Th>}
                              <Table.Th style={{ padding: '8px', width: '160px', minWidth: '160px', maxWidth: '160px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>SLOC</Text></Table.Th>
                              <Table.Th style={{ padding: '8px', width: '160px', minWidth: '160px', maxWidth: '160px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Site</Text></Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody style={{ opacity: canTakeAction ? 1 : 0.5, pointerEvents: canTakeAction ? 'auto' : 'none' }}>
                            {(() => {
                              // Group filtered rows by provider; sort members by closest-to-due, then providers by their earliest due
                              const parseDue = (d: string) => {
                                const [m, day, y] = d.split('/').map(Number);
                                return new Date(y, m - 1, day).getTime();
                              };
                              const groups = new Map<string, typeof filteredRows>();
                              for (const row of filteredRows) {
                                if (!groups.has(row.practitioner)) groups.set(row.practitioner, []);
                                groups.get(row.practitioner)!.push(row);
                              }
                              for (const rrs of groups.values()) {
                                rrs.sort((a, b) => parseDue(a.due) - parseDue(b.due));
                              }
                              const sortedEntries = Array.from(groups.entries())
                                .sort(([, a], [, b]) => parseDue(a[0].due) - parseDue(b[0].due));
                              const groupedByProvider = sortedEntries.slice(0, providersShown);

                              return groupedByProvider.flatMap(([provider, rrs]) => {
                                const isExpanded = expandedProviders.has(provider);
                                const visibleRRs = isExpanded ? rrs : rrs.slice(0, 1);
                                const rrIds = rrs.map(r => r.id);
                                const allVerified = rrIds.every(id => verifiedRows.has(id));

                                const totalForProvider = PROVIDER_TOTALS[provider] ?? rrs.length;
                                const headerRow = (
                                  <Table.Tr key={`hdr-${provider}`} style={{ backgroundColor: 'var(--background-contrast-medium)', borderTop: '2px solid var(--graphic-contrast-low)', borderBottom: '1px solid var(--graphic-contrast-low)' }}>
                                    <Table.Td colSpan={20} style={{ padding: '5px 10px 5px 12px' }}>
                                      <Group gap={8} wrap="nowrap" align="center">
                                        <Group gap={8} align="center" style={{ cursor: 'pointer' }} onClick={() => toggleExpanded(provider)}>
                                          <IconChevronDown
                                            size={14}
                                            color="var(--text-contrast-minimum)"
                                            style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.15s', flexShrink: 0 }}
                                          />
                                          <Text size="sm" fw={600} style={{ color: 'var(--text-contrast-high)', whiteSpace: 'nowrap' }}>{provider}</Text>
                                          <Text size="xs" style={{ color: 'var(--text-contrast-minimum)', whiteSpace: 'nowrap' }}>{totalForProvider} RRs</Text>
                                        </Group>
                                        <Button
                                          intent="prominent"
                                          appearance="outline"
                                          size="xs"
                                          onClick={(e) => { e.stopPropagation(); guardQueue(() => verifyProvider(provider, rrIds)); }}
                                        >
                                          Verify Provider
                                        </Button>
                                        <Button
                                          intent="neutral"
                                          appearance="outline"
                                          size="xs"
                                          disabled={!canTakeAction}
                                          onClick={(e) => { e.stopPropagation(); guardQueue(() => { setSelectedRows(new Set(rrs.filter(r => ['New', 'Past Due', 'In Progress-Unblocked'].includes(r.status)).map(r => r.id))); setActionScope('selected'); setResearchReason('not_on_file'); setActiveAction('research'); }); }}
                                        >
                                          Send Provider to Research
                                        </Button>
                                      </Group>
                                    </Table.Td>
                                  </Table.Tr>
                                );

                                const detailRows = visibleRRs.map((row) => {
                                  const isVerified = verifiedRows.has(row.id);
                                  const isActioned = !['New', 'Past Due', 'In Progress-Unblocked'].includes(row.status);
                                  const canUndoRow = isActioned && row.rowMethod !== 'Onsite';
                                  return (
                                    <Table.Tr key={row.id} style={{ borderBottom: '1px solid var(--graphic-contrast-low)' }}>
                                      <Table.Td style={{ padding: '8px', width: 120, minWidth: 120 }}>
                                        {isActioned ? (
                                          isInbound && row.status === 'Pended' ? (
                                            <Button
                                              intent="prominent"
                                              appearance="ghost"
                                              size="xs"
                                              disabled={!canTakeAction}
                                              onClick={() => {
                                                const rowBefore = requestRows.find(r => r.id === row.id);
                                                if (rowBefore) {
                                                  replaceUndoEntries({ count: 1, label: '1 record request pends released', rowsBefore: [{ ...rowBefore }], canUndo: true });
                                                }
                                                setRequestRows(prev => prev.map(r => r.id === row.id ? { ...r, status: 'Past Due', pendCode: null } : r));
                                                showToast('Pends Released');
                                              }}
                                            >
                                              Release Pend
                                            </Button>
                                          ) : canUndoRow ? (
                                            <IconArrowBackUp
                                              size={16}
                                              color="var(--graphic-contrast-medium)"
                                              style={{ cursor: 'pointer' }}
                                              onClick={() => setRequestRows(prev => prev.map(r => r.id === row.id ? { ...r, status: 'Past Due', commit: '—', payment: '—' } : r))}
                                            />
                                          ) : null
                                        ) : (
                                          <Stack gap={2} align="flex-start">
                                            {isVerified ? (
                                              <Group gap={4} align="center" wrap="nowrap">
                                                <Box style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => toggleVerified(row.id)} title="Undo verification">
                                                  <IconArrowBackUp size={14} color="var(--text-contrast-minimum)" />
                                                </Box>
                                                <IconCheck size={14} color="var(--text-status-positive)" />
                                                <Text size="sm" fw={500} style={{ color: 'var(--text-status-positive)', whiteSpace: 'nowrap' }}>Verified</Text>
                                              </Group>
                                            ) : (
                                              <Button intent="prominent" appearance="ghost" size="xs" onClick={() => guardQueue(() => toggleVerified(row.id))}>
                                                <IconCheck size={12} style={{ marginRight: 4 }} />
                                                Verify
                                              </Button>
                                            )}
                                            <Button
                                              intent="neutral"
                                              appearance="ghost"
                                              size="xs"
                                              disabled={!canTakeAction}
                                              leftSection={<IconArrowRight size={12} />}
                                              onClick={() => guardQueue(() => {
                                                setSelectedRows(new Set([row.id]));
                                                setActionScope('selected');
                                                setResearchReason('member_verify');
                                                setActiveAction('research');
                                              })}
                                            >
                                              Research
                                            </Button>
                                          </Stack>
                                        )}
                                      </Table.Td>
                                      <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: 'var(--text-contrast-medium)' }}>{row.id}</Text></Table.Td>
                                      {isInbound && <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: 'var(--text-contrast-medium)' }}>{row.rowMethod}</Text></Table.Td>}
                                      <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: 'var(--text-contrast-medium)' }}>{row.plan}</Text></Table.Td>
                                      <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ whiteSpace: 'nowrap', color: 'var(--text-contrast-medium)' }}>{row.member}</Text></Table.Td>
                                      <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: 'var(--text-contrast-medium)' }}>{row.dob}</Text></Table.Td>
                                      <Table.Td style={{ padding: '8px' }}>
                                        <Text size="sm" style={{ color: 'var(--text-contrast-medium)', lineHeight: 1.4 }}>
                                          {row.sdos.split('-').map((date, i) => (
                                            <span key={i} style={{ display: 'block', whiteSpace: 'nowrap' }}>
                                              {i === 0 ? `${date}–` : date}
                                            </span>
                                          ))}
                                        </Text>
                                      </Table.Td>
                                      <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: 'var(--text-contrast-medium)' }}>{row.due}</Text></Table.Td>
                                      <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: 'var(--text-contrast-medium)' }}>{row.commit}</Text></Table.Td>
                                      <Table.Td style={{ padding: '8px' }}>
                                        {row.status === 'In Progress-Unblocked' ? (
                                          <Group gap={4} align="center" wrap="nowrap">
                                            <Text size="sm" style={{ color: 'var(--text-contrast-medium)', whiteSpace: 'nowrap' }}>In Progress-Unblocked</Text>
                                            <Tooltip
                                              label={APPROVED_TIERS.length === 1 ? `Approved Amount: $${APPROVED_TIERS[0].amount}` : APPROVED_TIERS.map(t => `$${t.amount} (${t.count} RRs)`).join(' · ')}
                                              position="top"
                                              withArrow
                                              styles={{
                                                tooltip: { backgroundColor: 'var(--graphic-contrast-high)', color: 'var(--text-contrast-inverse)', fontSize: 13, fontWeight: 500, padding: '6px 12px', borderRadius: 1000 },
                                                arrow: { backgroundColor: 'var(--graphic-contrast-high)' },
                                              }}
                                            >
                                              <IconInfoCircle size={15} color="var(--text-data-blue)" style={{ cursor: 'default', flexShrink: 0, marginTop: 1 }} />
                                            </Tooltip>
                                          </Group>
                                        ) : isInbound && row.status === 'Pended' && row.pendCode ? (
                                          <Text size="sm" fw={500} style={{ color: 'var(--text-status-caution)', whiteSpace: 'nowrap' }}>{row.pendCode}</Text>
                                        ) : (
                                          <Text size="sm" style={{ color: 'var(--text-contrast-medium)' }}>{row.status}</Text>
                                        )}
                                      </Table.Td>
                                      <Table.Td style={{ padding: '8px' }}>
                                        {row.payment !== '—' ? (
                                          <Tooltip label={`Check #CHK-${row.id.slice(-5)}`} position="top" withArrow styles={{ tooltip: { backgroundColor: 'var(--graphic-contrast-high)', color: 'var(--text-contrast-inverse)', fontSize: 13, fontWeight: 500, padding: '6px 12px', borderRadius: 1000 }, arrow: { backgroundColor: 'var(--graphic-contrast-high)' } }}>
                                            <Text size="sm" style={{ color: 'var(--text-contrast-medium)', textDecoration: 'underline dotted', textUnderlineOffset: 3, cursor: 'help', display: 'inline' }}>{row.payment}</Text>
                                          </Tooltip>
                                        ) : (
                                          <Text size="sm" style={{ color: 'var(--text-contrast-medium)' }}>{row.payment}</Text>
                                        )}
                                      </Table.Td>
                                      {retrievalMethod === 'onsite' && <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: 'var(--text-contrast-medium)' }}>{row.osRef}</Text></Table.Td>}
                                      {[row.sloc, row.site].map((addr, ci) => {
                                        const parts = addr.split(',').map(p => p.trim());
                                        let lines: string[];
                                        if (parts.length >= 4) {
                                          const stateZip = parts[3].trim().split(' ');
                                          lines = [`${parts[0]}, ${parts[1]}`, `${parts[2]}, ${stateZip[0]}`, stateZip.slice(1).join(' ')];
                                        } else {
                                          lines = parts;
                                        }
                                        const needsTooltip = addr.length > 45;
                                        const fullAddress = lines.join('\n');
                                        const content = (
                                          <div style={{ fontSize: 14, color: 'var(--text-contrast-medium)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', whiteSpace: 'pre-line' }}>
                                            {fullAddress}
                                          </div>
                                        );
                                        return (
                                          <Table.Td key={ci} style={{ padding: '8px', width: '160px', minWidth: '160px', maxWidth: '160px' }}>
                                            {needsTooltip ? (
                                              <Tooltip label={<span style={{ whiteSpace: 'pre-line' }}>{fullAddress}</span>} position="bottom" withArrow>
                                                <div style={{ cursor: 'default' }}>{content}</div>
                                              </Tooltip>
                                            ) : content}
                                          </Table.Td>
                                        );
                                      })}
                                    </Table.Tr>
                                  );
                                });

                                return [headerRow, ...detailRows];
                              });
                            })()}
                          </Table.Tbody>
                        </Table>
                    </Box>

                    {/* Load More providers */}
                    <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 6, padding: '16px 0' }}>
                      <Button
                        intent="neutral"
                        appearance="outline"
                        size="sm"
                        onClick={() => setProvidersShown(s => s + 10)}
                      >
                        Load 10 More Providers
                      </Button>
                      <Text size="xs" c="dimmed">
                        Showing {Math.min(providersShown, PROVIDERS.length)} of {TOTAL_PROVIDERS} providers
                      </Text>
                    </Box>


                  </Box>

                </Stack>
              </Tabs.Panel>


              {/* ── SEARCH & FILTER TAB ── */}
              <Tabs.Panel value="search">
                <Box style={{ paddingBottom: selectedRows.size > 0 ? 72 : 0 }}>

                  {/* ── Inventory Overview ── */}
                  {(() => {
                    const uniquePlans = [...new Set(requestRows.map(r => r.plan))];
                    const lastCall = CALL_HISTORY_ROWS[0];
                    const showUnifiedCard = (retrievalMethod === 'offsite' || retrievalMethod === 'onsite' || retrievalMethod === 'emr-remote' || isInbound);
                    const showPends = false; // PENDS card cut from snapshot
                    const isOffsiteOrOnsite = retrievalMethod === 'offsite' || retrievalMethod === 'onsite';
                    const gridCols = showPends
                      ? '1fr 1px 1fr 1px 1fr'
                      : isOffsiteOrOnsite
                        ? '1fr 1px 1fr'
                        : '1fr 1px auto';
                    return showUnifiedCard ? (
                      <Box mb="lg" style={{ border: '1px solid var(--graphic-contrast-low)', borderRadius: 8, overflow: 'hidden' }}>

                        {/* Hero row — scope */}
                        <Box style={{ backgroundColor: 'var(--background-data-blue)', padding: '14px 20px', borderBottom: '1px solid #c3dcf5' }}>
                          <Group gap={0} align="baseline" wrap="nowrap">
                            <Text style={{ fontSize: 28, fontWeight: 700, color: '#0b4a82', lineHeight: 1, marginRight: 10 }}>
                              {TOTAL_RR_COUNT.toLocaleString()}
                            </Text>
                            <Text size="sm" fw={500} style={{ color: '#1f5f9c', marginRight: 16 }}>Record Requests</Text>
                            <Text size="sm" style={{ color: '#4d8ab8', marginRight: 6 }}>·</Text>
                            <Text size="sm" style={{ color: '#4d8ab8', marginRight: 16 }}>{TOTAL_PROVIDERS} providers</Text>
                            <Text size="sm" style={{ color: '#4d8ab8', marginRight: 6 }}>·</Text>
                            {uniquePlans.length === 1 ? (
                              <Text size="sm" style={{ color: '#4d8ab8' }}>{uniquePlans[0]}</Text>
                            ) : (
                              <Tooltip
                                label={uniquePlans.join(', ')}
                                withArrow
                                position="bottom"
                                multiline
                                w={280}
                              >
                                <Text size="sm" style={{ color: '#4d8ab8', textDecoration: 'underline dotted', textUnderlineOffset: 3, cursor: 'help' }}>
                                  Multiple health plans ({uniquePlans.length})
                                </Text>
                              </Tooltip>
                            )}
                          </Group>
                        </Box>

                        {/* Column breakdown */}
                        <Box style={{ display: 'grid', gridTemplateColumns: gridCols, backgroundColor: 'var(--background-contrast-none)' }}>

                          {/* Needs Action */}
                          <Box style={{ padding: '12px 16px' }}>
                            <Group gap={4} mb={10} align="center">
                              <IconAlertTriangle size={13} color="var(--graphic-status-caution)" />
                              <Text size="xs" fw={600} style={{ color: 'var(--graphic-status-caution)', textTransform: 'uppercase', letterSpacing: 0.4 }}>Needs Action</Text>
                            </Group>
                            <Group gap={24}>
                              <Box>
                                <Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }}>Past Due</Text>
                                <Text size="md" fw={700} style={{ color: 'var(--text-contrast-high)' }}>38</Text>
                              </Box>
                              <Box>
                                <Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }}>{isEmrRemote ? 'New' : 'Unscheduled'}</Text>
                                <Text size="md" fw={700} style={{ color: 'var(--text-contrast-high)' }}>781</Text>
                              </Box>
                              <Box>
                                <Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }}>In Progress-Unblocked</Text>
                                <Text size="md" fw={700} style={{ color: 'var(--text-contrast-high)' }}>{unblockedCount}</Text>
                              </Box>
                            </Group>
                          </Box>

                          <Box style={{ backgroundColor: 'var(--background-status-disabled)' }} />

                          {/* Pends — inbound only */}
                          {showPends && (
                            <>
                              <Box style={{ padding: '12px 16px' }}>
                                {(() => {
                                  const actionable = ACTIVE_PENDS.filter(p => p.actionable);
                                  const blocked = ACTIVE_PENDS.filter(p => !p.actionable);
                                  const preview = [...actionable, ...blocked].slice(0, 3);
                                  const hasMore = ACTIVE_PENDS.length > 3;
                                  return (
                                    <>
                                      <Group justify="space-between" align="center" mb={10}>
                                        <Text size="xs" fw={600} style={{ color: 'var(--text-contrast-minimum)', textTransform: 'uppercase', letterSpacing: 0.4 }}>Pends</Text>
                                        {hasMore && (
                                          <Text size="xs" fw={500} style={{ color: 'var(--text-data-blue)', cursor: 'pointer' }} onClick={() => setActivePendsModalOpen(true)}>
                                            View All ({ACTIVE_PENDS.length})
                                          </Text>
                                        )}
                                      </Group>
                                      {ACTIVE_PENDS.length === 0 ? (
                                        <Text size="sm" style={{ color: 'var(--text-contrast-minimum)' }}>None</Text>
                                      ) : (
                                        <Group gap={20} align="flex-start">
                                          {preview.map(p => (
                                            <Box key={p.code}>
                                              <Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }}>{p.code}</Text>
                                              <Text size="md" fw={700} style={{ color: 'var(--text-contrast-high)' }}>{p.count}</Text>
                                            </Box>
                                          ))}
                                        </Group>
                                      )}
                                    </>
                                  );
                                })()}
                              </Box>

                              <Box style={{ backgroundColor: 'var(--background-status-disabled)' }} />
                            </>
                          )}

                          {/* Credential Pipeline — inbound + EMRR, last column of top row */}
                          {(isInbound || isEmrRemote) && (
                            <Box style={{ padding: '12px 16px' }}>
                              <Text size="xs" fw={600} mb={10} style={{ color: 'var(--text-contrast-minimum)', textTransform: 'uppercase', letterSpacing: 0.4 }}>Credential Pipeline</Text>
                              <Group gap={20}>
                                {[
                                  { label: 'Outreach In Prog', key: 'Outreach In Progress' },
                                  { label: 'Credentialing In Prog', key: 'Credentialing In Progress' },
                                  { label: 'Credentialing Invalid', key: 'Credentialing Invalid' },
                                  { label: 'Awaiting Queued', key: 'Awaiting Queued' },
                                  { label: 'Awaiting Assignment', key: 'Awaiting Assignment' },
                                ].map(s => (
                                  <Box key={s.key}>
                                    <Text size="xs" style={{ color: 'var(--text-contrast-minimum)', whiteSpace: 'nowrap' }}>{s.label}</Text>
                                    <Text size="md" fw={700} style={{ color: 'var(--text-contrast-high)' }}>{statusCounts[s.key] || 0}</Text>
                                  </Box>
                                ))}
                              </Group>
                            </Box>
                          )}

                          {/* Actioned — offsite/onsite only, in-grid last column */}
                          {!isInbound && !isEmrRemote && (
                            <Box style={{ padding: '12px 16px' }}>
                              <Text size="xs" fw={600} mb={10} style={{ color: 'var(--text-contrast-minimum)', textTransform: 'uppercase', letterSpacing: 0.4 }}>Actioned</Text>
                              <Group gap={20}>
                                {[['Scheduled', statusCounts['Scheduled'] || 12], ['Progress Saved', statusCounts['Progress Logged'] || 0], ...(retrievalMethod === 'onsite' ? [['No Availability', statusCounts['No Availability'] || 0]] : []), ['Sent to Research', statusCounts['In Research'] || 4], ['Rerouted', statusCounts['Rerouted'] || 0], ['Pended', statusCounts['Pended'] || 0]].map(([s, n]) => (
                                  <Box key={s as string}>
                                    <Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }}>{s}</Text>
                                    <Text size="md" fw={700} style={{ color: 'var(--text-contrast-high)' }}>{n as number}</Text>
                                  </Box>
                                ))}
                              </Group>
                            </Box>
                          )}
                        </Box>

                        {/* Actioned — inbound + EMRR, second row */}
                        {(isInbound || isEmrRemote) && (
                          <Box style={{ borderTop: '1px solid var(--graphic-contrast-low)', padding: '12px 16px', backgroundColor: 'var(--background-contrast-none)' }}>
                            <Text size="xs" fw={600} mb={10} style={{ color: 'var(--text-contrast-minimum)', textTransform: 'uppercase', letterSpacing: 0.4 }}>Actioned</Text>
                            <Group gap={20}>
                              {(isInbound
                                ? [['Scheduled', statusCounts['Scheduled'] || 12], ['Progress Saved', statusCounts['Progress Logged'] || 0], ['No Availability', statusCounts['No Availability'] || 0], ['Sent to Research', statusCounts['In Research'] || 4], ['Rerouted', statusCounts['Rerouted'] || 0], ['Pended', statusCounts['Pended'] || 0]]
                                : [['Sent to Research', statusCounts['In Research'] || 0], ['Rerouted', statusCounts['Rerouted'] || 0], ['Pended', statusCounts['Pended'] || 0]]
                              ).map(([s, n]) => (
                                <Box key={s as string}>
                                  <Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }}>{s}</Text>
                                  <Text size="md" fw={700} style={{ color: 'var(--text-contrast-high)' }}>{n as number}</Text>
                                </Box>
                              ))}
                            </Group>
                          </Box>
                        )}

                        {/* Footer — last outreach */}
                        <Box style={{ backgroundColor: 'var(--background-contrast-medium)', borderTop: '1px solid var(--graphic-contrast-low)', padding: '8px 20px' }}>
                          <Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }}>
                            Last outreach: {lastCall.timestamp.split(',')[0]} · {lastCall.outcome.split('\n')[0]} · {lastCall.agent}
                          </Text>
                        </Box>

                      </Box>
                    ) : (
                      /* EMRR / Inbound — existing layout unchanged */
                      <Flex gap={12} mb="lg" wrap="wrap" align="stretch">
                        <Box style={{ border: '1px solid var(--graphic-interactive-prominent-resting)', backgroundColor: 'var(--background-data-blue)', borderRadius: 8, padding: '12px 20px', minWidth: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <Text size="xs" fw={600} style={{ color: 'var(--text-data-blue)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Record Requests</Text>
                          <Text style={{ fontSize: 30, fontWeight: 700, color: '#0b4a82', lineHeight: 1.1, marginTop: 2 }}>{TOTAL_RR_COUNT.toLocaleString()}</Text>
                          <Text size="xs" style={{ color: '#1f5f9c', marginTop: 4 }}>across {TOTAL_PROVIDERS} providers</Text>
                        </Box>
                        <Box style={{ border: '1px solid var(--graphic-status-caution)', backgroundColor: 'var(--background-status-caution)', borderRadius: 6, padding: '10px 14px' }}>
                          <Group gap={4} mb={6} align="center">
                            <Text style={{ fontSize: 13, color: 'var(--graphic-status-caution)' }}>&#9888;</Text>
                            <Text size="xs" fw={600} style={{ color: 'var(--text-contrast-high)' }}>RRs Needing Action</Text>
                          </Group>
                          <Group gap={16}>
                            <Box><Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }}>Past Due</Text><Text size="sm" fw={700} style={{ color: 'var(--text-contrast-high)' }}>{pastDueCount}</Text></Box>
                            <Box><Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }}>New</Text><Text size="sm" fw={700} style={{ color: 'var(--text-contrast-high)' }}>{needsActionCount}</Text></Box>
                          </Group>
                        </Box>
                        <Box style={{ border: '1px solid var(--graphic-contrast-low)', borderRadius: 6, padding: '10px 14px' }}>
                          <Text size="xs" fw={600} mb={6} style={{ color: 'var(--text-contrast-high)' }}>{isEmrRemote || isInbound ? 'RRs in Credential Pipeline' : 'Scheduling Pipeline'}</Text>
                          <Group gap={0} wrap="nowrap" style={{ overflowX: 'auto' }}>
                            {[{ label: 'Outreach In Prog', full: 'Outreach In Progress' }, { label: 'Credentialing In Prog', full: 'Credentialing In Progress' }, { label: 'Awaiting Queued', full: 'Awaiting Queued' }, { label: 'Awaiting Assignment', full: 'Awaiting Assignment' }].map(s => (
                              <Box key={s.label} style={{ padding: '0 8px' }}>
                                <Text size="xs" mb={2} style={{ color: 'var(--text-contrast-minimum)', whiteSpace: 'nowrap' }}>{s.label}</Text>
                                <Text size="sm" fw={700} style={{ color: 'var(--text-contrast-high)' }}>{statusCounts[s.full] || 0}</Text>
                              </Box>
                            ))}
                          </Group>
                        </Box>
                        <Box style={{ border: '1px solid var(--graphic-contrast-low)', borderRadius: 6, padding: '10px 14px' }}>
                          <Text size="xs" fw={600} mb={6} style={{ color: 'var(--text-contrast-high)' }}>RRs Actioned</Text>
                          <Group gap={14}>
                            {[...(isInbound ? ['Scheduled', 'Progress Logged', 'No Availability'] : []), 'In Research', 'Rerouted', 'Pended'].map(s => (
                              <Box key={s}><Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }}>{s}</Text><Text size="sm" fw={700} style={{ color: 'var(--text-contrast-high)' }}>{statusCounts[s] || 0}</Text></Box>
                            ))}
                          </Group>
                        </Box>
                      </Flex>
                    );
                  })()}

                  {/* Bulk Actions — apply to all RRs in this retrieval unit (moved here from Verification) */}
                  <Box mb="md" style={{ border: '1px solid var(--graphic-contrast-low)', borderRadius: 8, padding: '14px 20px' }}>
                    <Group justify="space-between" align="center" mb={10} wrap="wrap" gap={8}>
                      <Group gap={8} align="baseline">
                        <Text fw={700} style={{ fontSize: 15, color: 'var(--text-contrast-high)' }}>Bulk Actions</Text>
                        <Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }}>
                          Applies to all <Text component="span" fw={600} style={{ color: 'var(--text-contrast-high)' }}>{TOTAL_RR_COUNT.toLocaleString()} RRs</Text> in this retrieval unit
                        </Text>
                      </Group>
                    </Group>
                    <Group gap={6} wrap="wrap">
                      {((!isInbound && isEmrRemote)
                        ? [['Update Progress', 'schedule'], ['Send Remaining to Research', 'research'], ['Reroute Remaining', 'reroute'], ['Pend Remaining', 'pend']] as [string, ActionType][]
                        : [['Schedule Remaining', 'schedule'], ['Send Remaining to Research', 'research'], ['Reroute Remaining', 'reroute'], ['Pend Remaining', 'pend']] as [string, ActionType][]
                      ).map(([label, action]) => (
                        <Button
                          key={label}
                          intent="neutral"
                          appearance="outline"
                          size="sm"
                          disabled={!canTakeGlobalAction}
                          onClick={() => {
                            if (action === 'schedule' && isInbound) {
                              setActionScope('global');
                              clearUndoEntries(); setScheduleStepperOpen(true);
                            } else if (action === 'emrr-progress') {
                              setActionScope('global');
                              setActiveAction('emrr-progress');
                            } else {
                              applyGlobalAction(action);
                            }
                          }}
                        >
                          {label}
                        </Button>
                      ))}
                    </Group>
                  </Box>

                  {/* Search bar + filter pills. Multi-line paste auto-switches to bulk-match mode. */}
                  {(() => {
                    const isPasteMode = pasteInput.trim() !== '';
                    const detectAndIngestPaste = (text: string) => {
                      const tokens = text.split(/[\s,;]+/).map(t => t.trim()).filter(Boolean);
                      const looksLikeList = /[\n\r]/.test(text) || (tokens.length > 1 && /[,;]/.test(text));
                      if (looksLikeList && tokens.length > 1) {
                        setPasteInput(text);
                        setPastePage(0);
                        setSearchViewQuery('');
                        setSearchViewInput('');
                        setPasteSource('paste');
                        setCsvFileName(null);
                        return true;
                      }
                      return false;
                    };
                    // Paste stages the IDs in the field; matching only runs on Search/Enter.
                    const runSearch = () => {
                      if (!detectAndIngestPaste(searchViewInput)) setSearchViewQuery(searchViewInput.trim());
                    };
                    const handleCsvFile = (file: File) => {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const text = String(ev.target?.result ?? '');
                        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
                        // Skip header row if first cell isn't numeric/ID-like
                        const firstCell = (lines[0] || '').split(',')[0].trim();
                        const startIdx = /^[0-9A-Z-]+$/i.test(firstCell) && firstCell.length >= 6 ? 0 : 1;
                        const ids = lines.slice(startIdx).map(l => l.split(',')[0].trim()).filter(Boolean);
                        if (ids.length === 0) return;
                        setPasteInput(ids.join('\n'));
                        setPasteSource('csv');
                        setCsvFileName(file.name);
                        setPastePage(0);
                        setSearchViewQuery('');
                        setSearchViewInput('');
                      };
                      reader.readAsText(file);
                    };
                    return (
                      <Box mb="md">
                        <input
                          ref={csvInputRef}
                          type="file"
                          accept=".csv,text/csv"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleCsvFile(f);
                            e.target.value = '';
                          }}
                        />
                        <Group justify="space-between" align="flex-start" wrap="nowrap">
                          <Group gap={8} align="center" wrap="nowrap" style={{ flexShrink: 0 }}>
                            <Box style={{ display: 'flex', alignItems: 'center', gap: 4, border: '1px solid var(--graphic-contrast-medium)', borderRadius: 6, padding: '6px 12px', paddingRight: 8, backgroundColor: 'var(--background-contrast-none)', width: 440 }}>
                              <input
                                placeholder="Search or paste a list of RR IDs"
                                value={searchViewInput}
                                onChange={(e) => setSearchViewInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
                                onPaste={(e) => {
                                  // Stage a pasted list in the field (normalized) — don't match until Search/Enter
                                  const text = e.clipboardData.getData('text');
                                  const tokens = text.split(/[\s,;]+/).map(t => t.trim()).filter(Boolean);
                                  const isList = (/[\n\r]/.test(text) || /[,;]/.test(text)) && tokens.length > 1;
                                  if (isList) { e.preventDefault(); setSearchViewInput(tokens.join(', ')); }
                                }}
                                style={{ border: 'none', outline: 'none', fontSize: 14, width: '100%', color: 'var(--text-contrast-low)', background: 'transparent', fontFamily: 'DM Sans, sans-serif' }}
                              />
                              <IconSearch size={16} color="var(--text-contrast-minimum)" style={{ flexShrink: 0, cursor: 'pointer' }} onClick={runSearch} />
                            </Box>
                            <Button
                              intent="prominent"
                              appearance="solid"
                              size="sm"
                              onClick={runSearch}
                            >
                              Search
                            </Button>
                            <Button
                              intent="prominent"
                              appearance="outline"
                              size="sm"
                              leftSection={<IconUpload size={14} />}
                              onClick={() => csvInputRef.current?.click()}
                            >
                              Upload CSV
                            </Button>
                          </Group>
                          <Group gap={8} align="center" wrap="wrap" justify="flex-end">
                            <FilterPill label="Project Due Date" options={['4/1/2026', '5/1/2026', '6/1/2026']} selected={searchViewFilters['Project Due Date']} onToggle={(opt) => toggleSearchViewFilter('Project Due Date', opt)} />
                            <FilterPill label="Commitment Date" options={['No Date', '3/1/2026', '4/1/2026', '5/1/2026']} selected={searchViewFilters['Commitment Date']} onToggle={(opt) => toggleSearchViewFilter('Commitment Date', opt)} />
                            <FilterPill label="Status" options={isInbound
                              ? ['Past Due', 'New', 'In Progress-Unblocked', 'Scheduled', 'In Research', 'PNP1', 'PNP5', 'PNP24', 'Rerouted']
                              : ['Past Due', 'New', 'In Progress-Unblocked', 'Scheduled', 'In Research', 'Rerouted']
                            } selected={searchViewFilters['Status']} onToggle={(opt) => toggleSearchViewFilter('Status', opt)} />
                            <FilterPill label="Provider" options={PROVIDERS} selected={searchViewFilters['Provider']} onToggle={(opt) => toggleSearchViewFilter('Provider', opt)} />
                            {isInbound && <FilterPill label="Retrieval Method" options={['Offsite', 'Onsite', 'EMRR']} selected={searchViewFilters['Retrieval Method']} onToggle={(opt) => toggleSearchViewFilter('Retrieval Method', opt)} />}
                            <Box onClick={resetSearchView} style={{ border: '1px solid var(--graphic-contrast-medium)', borderRadius: 1000, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                              <IconRefresh size={16} color="var(--text-contrast-low)" />
                            </Box>
                          </Group>
                        </Group>
                      </Box>
                    );
                  })()}

                  {/* Undo banners — green confirmation + bulk undo after a queue action (mirrors verification tab) */}
                  {undoEntries.map(entry => (
                    <Box
                      key={entry.id}
                      mb="sm"
                      style={{
                        backgroundColor: 'var(--background-status-positive)',
                        border: '1px solid var(--graphic-status-positive)',
                        borderRadius: 8,
                        padding: '10px 14px',
                      }}
                    >
                      <Group justify="space-between" align="center" wrap="nowrap" gap={12}>
                        <Group gap={8} align="center" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
                          <IconCheck size={16} color="var(--text-status-positive)" style={{ flexShrink: 0 }} />
                          <Text size="sm" fw={600} style={{ color: 'var(--text-status-positive)' }}>
                            {entry.label}{!entry.canUndo && ' — cannot be undone'}
                          </Text>
                        </Group>
                        <Group gap={6} align="center" wrap="nowrap" style={{ flexShrink: 0 }}>
                          {entry.canUndo && (
                            <Button intent="neutral" appearance="ghost" size="xs" onClick={() => applyUndoEntry(entry.id)}>
                              Undo
                            </Button>
                          )}
                          <ActionIcon variant="subtle" size="sm" onClick={() => dismissUndoEntry(entry.id)} aria-label="Dismiss">
                            <IconX size={14} color="var(--text-status-positive)" />
                          </ActionIcon>
                        </Group>
                      </Group>
                    </Box>
                  ))}

                  {(() => {
                    const isPasteMode = pasteInput.trim() !== '';
                    // Queue lives in the persistent bottom tray, so it no longer keeps the
                    // results table "active" — clearing the search/IDs empties the table
                    // while the queue stays intact in the tray.
                    const isActive = isPasteMode
                      || searchViewQuery.trim() !== ''
                      || Object.values(searchViewFilters).some(s => s.size > 0);
                    // Default landing view (nothing searched/filtered/queued): show Past Due first.
                    const isDefaultView = !isActive && !queueMode;

                    // Paste-mode matching
                    const pastedIds = isPasteMode
                      ? Array.from(new Set(pasteInput.split(/[\s,;]+/).map(t => t.trim()).filter(Boolean)))
                      : [];
                    const inventoryIdSet = new Set(requestRows.map(r => r.id));
                    const matchedIds = isPasteMode ? pastedIds.filter(id => inventoryIdSet.has(id)) : [];
                    const unmatchedIds = isPasteMode ? pastedIds.filter(id => !inventoryIdSet.has(id)) : [];
                    unmatchedIdsRef.current = unmatchedIds;

                    const applySearchAndFilters = (rows: typeof requestRows) => rows.filter(row => {
                      // Outbound shouldn't see pended in browse; paste-match shows ALL matched IDs (incl. pended) so the table count reconciles with "N matched"
                      if (!isInbound && !isPasteMode && row.status === 'Pended') return false;
                      if (searchViewQuery.trim()) {
                        const q = searchViewQuery.toLowerCase();
                        if (!(row.id.includes(q) || row.member.toLowerCase().includes(q) || row.plan.toLowerCase().includes(q) || row.practitioner.toLowerCase().includes(q) || row.dob.includes(q))) return false;
                      }
                      const pddf = searchViewFilters['Project Due Date'];
                      if (pddf && pddf.size > 0 && !pddf.has(row.due)) return false;
                      const stf = searchViewFilters['Status'];
                      if (stf && stf.size > 0) {
                        const effectiveStatus = (isInbound && row.status === 'Pended' && row.pendCode) ? row.pendCode : row.status;
                        if (!stf.has(effectiveStatus)) return false;
                      }
                      const rmf = searchViewFilters['Retrieval Method'];
                      if (rmf && rmf.size > 0 && !rmf.has(row.rowMethod)) return false;
                      const pvf = searchViewFilters['Provider'];
                      if (pvf && pvf.size > 0 && !pvf.has(row.practitioner)) return false;
                      const cdf = searchViewFilters['Commitment Date'];
                      if (cdf && cdf.size > 0) {
                        const cd = row.commit === '\u2014' ? 'No Date' : row.commit;
                        if (!cdf.has(cd)) return false;
                      }
                      return true;
                    });

                    const pasteMatchedRows = isPasteMode ? requestRows.filter(row => matchedIds.includes(row.id)) : requestRows;
                    // Default view: Past Due first; if none, Scheduled; else whatever's open.
                    const defaultView = (() => {
                      const base = applySearchAndFilters(requestRows);
                      const pastDue = base.filter(r => r.status === 'Past Due');
                      if (pastDue.length) return { rows: pastDue, label: 'Past Due' };
                      const scheduled = base.filter(r => r.status === 'Scheduled');
                      if (scheduled.length) return { rows: scheduled, label: 'Scheduled' };
                      return { rows: base, label: 'open RRs' };
                    })();
                    const svRowsAll = queueMode
                      ? requestRows.filter(row => selectedRows.has(row.id))
                      : isDefaultView
                        ? defaultView.rows
                        : applySearchAndFilters(pasteMatchedRows);

                    // Sort: Past Due first, then by closest project due date (Noel's requirement)
                    const parseDue = (d?: string) => { if (!d) return Infinity; const p = d.split('/').map(Number); return p.length === 3 ? new Date(p[2], p[0] - 1, p[1]).getTime() : Infinity; };
                    svRowsAll.sort((a, b) => {
                      const ap = a.status === 'Past Due' ? 0 : 1, bp = b.status === 'Past Due' ? 0 : 1;
                      return ap !== bp ? ap - bp : parseDue(a.due) - parseDue(b.due);
                    });

                    const totalMatched = svRowsAll.length;
                    // Paginate (~20/page, up to ~500 loaded); pager sits at the bottom of the table.
                    const totalPages = Math.max(1, Math.ceil(totalMatched / PASTE_PAGE_SIZE));
                    const safePage = Math.min(pastePage, totalPages - 1);
                    const svRows = svRowsAll.slice(safePage * PASTE_PAGE_SIZE, (safePage + 1) * PASTE_PAGE_SIZE);
                    const pageStart = totalMatched === 0 ? 0 : safePage * PASTE_PAGE_SIZE + 1;
                    const pageEnd = Math.min((safePage + 1) * PASTE_PAGE_SIZE, totalMatched);

                    const svUnactioned = svRows.filter(r => ['New', 'Past Due', 'In Progress-Unblocked'].includes(r.status));
                    const unactionedAll = svRowsAll.filter(r => ['New', 'Past Due', 'In Progress-Unblocked'].includes(r.status));
                    const svAllSelected = svUnactioned.length > 0 && svUnactioned.every(r => selectedRows.has(r.id));
                    const allMatchedSelected = unactionedAll.length > 0 && unactionedAll.every(r => selectedRows.has(r.id));
                    const hasMoreMatchedToSelect = unactionedAll.length > svUnactioned.length && !allMatchedSelected;
                    const alreadyActionedCount = isPasteMode ? Math.max(0, matchedIds.length - unactionedAll.length) : 0;
                    const svToggleAll = () => {
                      if (svAllSelected) {
                        setSelectedRows(prev => { const next = new Set(prev); svUnactioned.forEach(r => next.delete(r.id)); return next; });
                      } else {
                        setSelectedRows(prev => { const next = new Set(prev); svUnactioned.forEach(r => next.add(r.id)); return next; });
                      }
                    };
                    const selectAllMatched = () => {
                      setSelectedRows(prev => { const next = new Set(prev); unactionedAll.forEach(r => next.add(r.id)); return next; });
                    };

                    return (
                      <>
                        {/* Paste-mode summary — single compact banner */}
                        {isPasteMode && (
                          <Box mb={12} style={{ backgroundColor: 'var(--background-contrast-medium)', border: '1px solid var(--graphic-contrast-low)', borderRadius: 6, padding: '12px 16px' }}>
                            <Group justify="space-between" align="center" wrap="nowrap" gap={12}>
                              <Group gap={14} align="center" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
                                <Box>
                                  <Group gap={6} align="center" wrap="nowrap">
                                    <IconCheck size={15} color="#0b4a82" />
                                    <Text size="sm" fw={600} style={{ color: 'var(--text-contrast-high)', whiteSpace: 'nowrap' }}>
                                      {matchedIds.length.toLocaleString()} of {pastedIds.length.toLocaleString()} RR IDs matched
                                    </Text>
                                    {pasteSource === 'csv' && csvFileName && (
                                      <Text size="xs" style={{ color: 'var(--text-contrast-minimum)', whiteSpace: 'nowrap' }}>
                                        from {csvFileName}
                                      </Text>
                                    )}
                                  </Group>
                                  {(unactionedAll.length > 0 || alreadyActionedCount > 0) && (
                                    <Group gap={16} mt={3} wrap="wrap" style={{ paddingLeft: 21 }}>
                                      {unactionedAll.length > 0 && (
                                        <Text size="xs" style={{ color: 'var(--text-data-seafoam)' }}>
                                          <Text component="span" fw={700}>{unactionedAll.length.toLocaleString()}</Text> can be added
                                        </Text>
                                      )}
                                      {alreadyActionedCount > 0 && (
                                        <Text size="xs" style={{ color: 'var(--text-contrast-minimum)' }}>
                                          <Text component="span" fw={700}>{alreadyActionedCount.toLocaleString()}</Text> already actioned
                                        </Text>
                                      )}
                                    </Group>
                                  )}
                                </Box>
                                {unmatchedIds.length > 0 && (
                                  <>
                                    <Box style={{ width: 1, height: 34, backgroundColor: 'var(--graphic-contrast-low)', alignSelf: 'center' }} />
                                    <Group gap={6} align="center" wrap="nowrap" style={{ minWidth: 0 }}>
                                      <IconAlertTriangle size={15} color="var(--graphic-status-caution)" />
                                      <Text size="sm" fw={600} style={{ color: 'var(--text-status-caution)', whiteSpace: 'nowrap' }}>
                                        {unmatchedIds.length.toLocaleString()} not found
                                      </Text>
                                      <Text size="sm" fw={500} style={{ color: 'var(--text-data-blue)', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                        onClick={() => setUnmatchedModalOpen(true)}>
                                        View
                                      </Text>
                                    </Group>
                                  </>
                                )}
                              </Group>
                              <Group gap={12} align="center" wrap="nowrap">
                                <Text size="sm" fw={500} style={{ color: 'var(--text-data-blue)', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                  onClick={() => { setPasteInput(''); setPastePage(0); setCsvFileName(null); setPasteSource('paste'); }}>
                                  Clear All IDs
                                </Text>
                              </Group>
                            </Group>
                          </Box>
                        )}

                        {/* Results summary row — count indicator (20-row sample, no pager) + add-to-queue */}
                        <Group justify="space-between" align="center" mb={8}>
                          <Text size="sm" style={{ color: 'var(--text-contrast-minimum)' }}>
                            Showing {pageStart.toLocaleString()}–{pageEnd.toLocaleString()} of {totalMatched.toLocaleString()} RR{totalMatched !== 1 ? 's' : ''}
                          </Text>
                          {!queueMode && canTakeAction && unactionedAll.length > 0 && !allMatchedSelected && (
                            <Button intent="prominent" appearance="outline" size="xs" onClick={selectAllMatched}>
                              Add {unactionedAll.length.toLocaleString()} RR{unactionedAll.length !== 1 ? 's' : ''} to queue
                            </Button>
                          )}
                        </Group>

                        <Box style={{ overflowX: 'auto', overflowY: 'clip', border: '1px solid var(--graphic-contrast-low)', borderRadius: 6 }}>
                          <Table highlightOnHover style={{ minWidth: 1800, borderCollapse: 'collapse' }}>
                            <Table.Thead style={{ position: 'sticky', top: 0, zIndex: 2, backgroundColor: 'var(--background-contrast-medium)' }}>
                              <Table.Tr style={{ backgroundColor: 'var(--background-contrast-medium)', borderBottom: '1px solid var(--graphic-contrast-low)' }}>
                                <Table.Th style={{ width: 40, padding: '8px' }}>
                                  <MantineCheckbox size="xs" checked={svAllSelected} indeterminate={selectedRows.size > 0 && !svAllSelected} onChange={svToggleAll} />
                                </Table.Th>
                                <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Request ID</Text></Table.Th>
                                {isInbound && <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Retrieval Method</Text></Table.Th>}
                                <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Health Plan</Text></Table.Th>
                                <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Member Name</Text></Table.Th>
                                <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Member DOB</Text></Table.Th>
                                <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>SDOS</Text></Table.Th>
                                <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Project Due Date</Text></Table.Th>
                                <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Commitment Date</Text></Table.Th>
                                <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Status</Text></Table.Th>
                                <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Payment Status</Text></Table.Th>
                                <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Provider</Text></Table.Th>
                                <Table.Th style={{ padding: '8px', width: '160px', minWidth: '160px', maxWidth: '160px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>SLOC</Text></Table.Th>
                                <Table.Th style={{ padding: '8px', width: '160px', minWidth: '160px', maxWidth: '160px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Site</Text></Table.Th>
                              </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody style={{ opacity: canTakeAction ? 1 : 0.5, pointerEvents: canTakeAction ? 'auto' : 'none' }}>
                              {svRows.map(row => {
                                const isActioned = !['New', 'Past Due', 'In Progress-Unblocked'].includes(row.status);
                                const canUndoRow = isActioned && row.rowMethod !== 'Onsite';
                                const isSelected = selectedRows.has(row.id);
                                return (
                                  <Table.Tr key={row.id} style={{ borderBottom: '1px solid var(--graphic-contrast-low)', backgroundColor: isSelected ? 'var(--background-status-info)' : undefined }}>
                                    <Table.Td style={{ padding: '8px', width: 40 }}>
                                      {isActioned && !(isInbound && row.status === 'Pended') ? (
                                        canUndoRow ? (
                                          <IconArrowBackUp size={16} color="var(--graphic-contrast-medium)" style={{ cursor: 'pointer' }}
                                            onClick={() => setRequestRows(prev => prev.map(r => r.id === row.id ? { ...r, status: 'Past Due', commit: '\u2014', payment: '\u2014' } : r))}
                                          />
                                        ) : null
                                      ) : (
                                        <MantineCheckbox size="xs" checked={isSelected} onChange={() => toggleRow(row.id)} />
                                      )}
                                    </Table.Td>
                                    <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: 'var(--text-contrast-medium)' }}>{row.id}</Text></Table.Td>
                                    {isInbound && <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: 'var(--text-contrast-medium)' }}>{row.rowMethod}</Text></Table.Td>}
                                    <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: 'var(--text-contrast-medium)' }}>{row.plan}</Text></Table.Td>
                                    <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ whiteSpace: 'nowrap', color: 'var(--text-contrast-medium)' }}>{row.member}</Text></Table.Td>
                                    <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: 'var(--text-contrast-medium)' }}>{row.dob}</Text></Table.Td>
                                    <Table.Td style={{ padding: '8px' }}>
                                      <Text size="sm" style={{ color: 'var(--text-contrast-medium)', lineHeight: 1.4 }}>
                                        {row.sdos.split('-').map((date, i) => (
                                          <span key={i} style={{ display: 'block', whiteSpace: 'nowrap' }}>{i === 0 ? `${date}\u2013` : date}</span>
                                        ))}
                                      </Text>
                                    </Table.Td>
                                    <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: 'var(--text-contrast-medium)' }}>{row.due}</Text></Table.Td>
                                    <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: 'var(--text-contrast-medium)' }}>{row.commit}</Text></Table.Td>
                                    <Table.Td style={{ padding: '8px' }}>
                                      {row.status === 'In Progress-Unblocked' ? (
                                        <Group gap={4} align="center" wrap="nowrap">
                                          <Text size="sm" style={{ color: 'var(--text-contrast-medium)', whiteSpace: 'nowrap' }}>In Progress-Unblocked</Text>
                                          <Tooltip label={APPROVED_TIERS.length === 1 ? `Approved Amount: $${APPROVED_TIERS[0].amount}` : APPROVED_TIERS.map(t => `$${t.amount} (${t.count} RRs)`).join(' · ')} position="top" withArrow styles={{ tooltip: { backgroundColor: 'var(--graphic-contrast-high)', color: 'var(--text-contrast-inverse)', fontSize: 13, fontWeight: 500, padding: '6px 12px', borderRadius: 1000 }, arrow: { backgroundColor: 'var(--graphic-contrast-high)' } }}>
                                            <IconInfoCircle size={15} color="var(--text-data-blue)" style={{ cursor: 'default', flexShrink: 0, marginTop: 1 }} />
                                          </Tooltip>
                                        </Group>
                                      ) : isInbound && row.status === 'Pended' && row.pendCode ? (
                                        <Text size="sm" fw={500} style={{ color: 'var(--text-status-caution)', whiteSpace: 'nowrap' }}>{row.pendCode}</Text>
                                      ) : (
                                        <Text size="sm" style={{ color: 'var(--text-contrast-medium)' }}>{row.status}</Text>
                                      )}
                                    </Table.Td>
                                    <Table.Td style={{ padding: '8px' }}>
                                      {row.payment !== '—' ? (
                                        <Tooltip label={`Check #CHK-${row.id.slice(-5)}`} position="top" withArrow styles={{ tooltip: { backgroundColor: 'var(--graphic-contrast-high)', color: 'var(--text-contrast-inverse)', fontSize: 13, fontWeight: 500, padding: '6px 12px', borderRadius: 1000 }, arrow: { backgroundColor: 'var(--graphic-contrast-high)' } }}>
                                          <Text size="sm" style={{ color: 'var(--text-contrast-medium)', textDecoration: 'underline dotted', textUnderlineOffset: 3, cursor: 'help', display: 'inline' }}>{row.payment}</Text>
                                        </Tooltip>
                                      ) : (
                                        <Text size="sm" style={{ color: 'var(--text-contrast-medium)' }}>{row.payment}</Text>
                                      )}
                                    </Table.Td>
                                    <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: 'var(--text-contrast-medium)', whiteSpace: 'nowrap' }}>{row.practitioner}</Text></Table.Td>
                                    {[row.sloc, row.site].map((addr, ci) => {
                                      const parts = addr.split(',').map(p => p.trim());
                                      let lines: string[];
                                      if (parts.length >= 4) {
                                        const stateZip = parts[3].trim().split(' ');
                                        lines = [`${parts[0]}, ${parts[1]}`, `${parts[2]}, ${stateZip[0]}`, stateZip.slice(1).join(' ')];
                                      } else { lines = parts; }
                                      const needsTooltip = addr.length > 45;
                                      const fullAddress = lines.join('\n');
                                      const content = (
                                        <div style={{ fontSize: 14, color: 'var(--text-contrast-medium)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', whiteSpace: 'pre-line' }}>
                                          {fullAddress}
                                        </div>
                                      );
                                      return (
                                        <Table.Td key={ci} style={{ padding: '8px', width: '160px', minWidth: '160px', maxWidth: '160px' }}>
                                          {needsTooltip ? (
                                            <Tooltip label={<span style={{ whiteSpace: 'pre-line' }}>{fullAddress}</span>} position="bottom" withArrow>
                                              <div style={{ cursor: 'default' }}>{content}</div>
                                            </Tooltip>
                                          ) : content}
                                        </Table.Td>
                                      );
                                    })}
                                  </Table.Tr>
                                );
                              })}
                            </Table.Tbody>
                          </Table>
                        </Box>

                        {/* Pagination — DART-style footer */}
                        {totalMatched > PASTE_PAGE_SIZE && (
                          <Group justify="space-between" align="center" mt={12}>
                            <Group gap="xs" align="center">
                              <Text size="xs" c="dimmed">Items per page:</Text>
                              <Box style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', border: '1px solid var(--graphic-contrast-low)', borderRadius: 4, fontSize: 12 }}>
                                {PASTE_PAGE_SIZE} <IconChevronDown size={11} />
                              </Box>
                              <Text size="xs" c="dimmed">{pageStart.toLocaleString()}–{pageEnd.toLocaleString()} of {totalMatched.toLocaleString()} items</Text>
                            </Group>
                            <Group gap="sm" align="center">
                              <Group gap={4} align="center">
                                <Text size="xs" c="dimmed">Page</Text>
                                <Box style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', border: '1px solid var(--graphic-contrast-low)', borderRadius: 4, fontSize: 12 }}>
                                  {safePage + 1} <IconChevronDown size={11} />
                                </Box>
                                <Text size="xs" c="dimmed">of {totalPages}</Text>
                              </Group>
                              <Group gap={2} align="center">
                                <ActionIcon intent="neutral" appearance="ghost" size="sm" disabled={safePage === 0} onClick={() => setPastePage(0)} aria-label="First page"><IconChevronsLeft size={14} /></ActionIcon>
                                <ActionIcon intent="neutral" appearance="ghost" size="sm" disabled={safePage === 0} onClick={() => setPastePage(p => Math.max(0, p - 1))} aria-label="Previous page"><IconChevronLeft size={14} /></ActionIcon>
                                <ActionIcon intent="neutral" appearance="ghost" size="sm" disabled={safePage >= totalPages - 1} onClick={() => setPastePage(p => Math.min(totalPages - 1, p + 1))} aria-label="Next page"><IconChevronRight size={14} /></ActionIcon>
                                <ActionIcon intent="neutral" appearance="ghost" size="sm" disabled={safePage >= totalPages - 1} onClick={() => setPastePage(totalPages - 1)} aria-label="Last page"><IconChevronsRight size={14} /></ActionIcon>
                              </Group>
                            </Group>
                          </Group>
                        )}

                      </>
                    );
                  })()}
                </Box>
              </Tabs.Panel>

              {/* ── CALL HISTORY TAB ── */}
              <Tabs.Panel value="history">
                <Stack gap="md">
                  <Box>
                    <Text fw={600} size="md" mb={4}>Call History</Text>
                    <Text size="sm" c="dimmed">
                      The below data represents all retrieval activity for this phone number.
                    </Text>
                  </Box>

                  <Group justify="flex-end" gap={8}>
                    <FilterPill label="Call Outcome" options={['Connected', 'Not Connected', 'No Answer', 'Voicemail']} />
                    <Box style={{ border: '1px solid var(--graphic-contrast-medium)', borderRadius: 1000, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                      <IconRefresh size={16} color="var(--text-contrast-low)" />
                    </Box>
                  </Group>

                  <Box style={{ overflowX: 'auto' }}>
                    <Box style={{ overflow: 'hidden' }}>
                      <Table highlightOnHover style={{ minWidth: 1000, borderCollapse: 'collapse' }}>
                        <Table.Thead>
                          <Table.Tr style={{ backgroundColor: 'var(--background-contrast-medium)', borderBottom: '1px solid var(--graphic-contrast-low)' }}>
                            <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Call Outcome</Text></Table.Th>
                            <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Agent</Text></Table.Th>
                            <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Requests</Text></Table.Th>
                            <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Agent Actions</Text></Table.Th>
                            <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Site Details Updated</Text></Table.Th>
                            <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Provider Package Status</Text></Table.Th>
                            <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>PPT</Text></Table.Th>
                            <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: 'var(--text-contrast-low)', whiteSpace: 'nowrap' }}>Time Stamp</Text></Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {CALL_HISTORY_ROWS.map((row, i) => (
                            <Table.Tr key={i} style={{ borderBottom: '1px solid var(--graphic-contrast-low)' }}>
                              <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ whiteSpace: 'pre-line', color: 'var(--text-contrast-medium)' }}>{row.outcome}</Text></Table.Td>
                              <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: 'var(--text-contrast-medium)' }}>{row.agent}</Text></Table.Td>
                              <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: 'var(--text-contrast-medium)' }}>{row.requests}</Text></Table.Td>
                              <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ whiteSpace: 'pre-line', color: 'var(--text-contrast-medium)' }}>{row.actions}</Text></Table.Td>
                              <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: 'var(--text-contrast-medium)' }}>{row.siteDetails}</Text></Table.Td>
                              <Table.Td style={{ padding: '8px' }}>
                                {row.pkgGreen ? (
                                  <Text size="sm" style={{ color: 'var(--text-status-positive)', fontWeight: 500 }}>&#10003; {row.providerPkg}</Text>
                                ) : (
                                  <Text size="sm" style={{ color: 'var(--text-contrast-medium)' }}>{row.providerPkg}</Text>
                                )}
                              </Table.Td>
                              <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: 'var(--text-contrast-medium)' }}>{row.ppt}</Text></Table.Td>
                              <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ whiteSpace: 'nowrap', color: 'var(--text-contrast-medium)' }}>{row.timestamp}</Text></Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                      </Table>
                    </Box>
                  </Box>

                  {/* Pagination */}
                  <Group justify="space-between" align="center">
                    <Group gap="xs">
                      <Text size="xs" c="dimmed">Items per page:</Text>
                      <Box style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', border: '1px solid var(--graphic-contrast-low)', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>
                        500 <IconChevronDown size={11} />
                      </Box>
                      <Text size="xs" c="dimmed">1–2 of 2 items</Text>
                    </Group>
                    <Group gap="sm">
                      <Group gap={4}>
                        <Text size="xs" c="dimmed">Page</Text>
                        <Box style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', border: '1px solid var(--graphic-contrast-low)', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>
                          1 <IconChevronDown size={11} />
                        </Box>
                        <Text size="xs" c="dimmed">of 1</Text>
                      </Group>
                      <Group gap={2}>
                        <ActionIcon intent="neutral" appearance="ghost" size="sm" aria-label="Previous page"><IconChevronLeft size={13} /></ActionIcon>
                        <ActionIcon intent="neutral" appearance="ghost" size="sm" aria-label="Next page"><IconChevronRight size={13} /></ActionIcon>
                      </Group>
                    </Group>
                  </Group>
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </Box>
        </Box>

        {/* ── Notes Side Drawer ── */}
        {notesDrawerOpen && (
          <Box
            style={{
              position: 'absolute', top: 0, bottom: 0, width: 360,
              ...(notesDrawerSide === 'right' ? { right: 0 } : { left: 0 }),
              background: 'var(--background-contrast-none)', zIndex: 10, display: 'flex', flexDirection: 'column',
              boxShadow: notesDrawerSide === 'right' ? '-4px 0 20px rgba(0,0,0,0.12)' : '4px 0 20px rgba(0,0,0,0.12)',
              ...(notesDrawerSide === 'right' ? { borderLeft: '1px solid var(--graphic-contrast-low)' } : { borderRight: '1px solid var(--graphic-contrast-low)' }),
            }}
          >
            <Box style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--graphic-contrast-low)', flexShrink: 0 }}>
              <Group justify="space-between" align="flex-start">
                <Text fw={700} size="md">Agent Notes</Text>
                <Group gap={4}>
                  <Box onClick={() => setNotesDrawerSide(s => s === 'right' ? 'left' : 'right')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 4 }}
                    title={notesDrawerSide === 'right' ? 'Move to left' : 'Move to right'}
                  >
                    <IconSwitchHorizontal size={16} color="var(--text-contrast-minimum)" />
                  </Box>
                  <Box onClick={() => setNotesDrawerOpen(false)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 4 }}>
                    <IconX size={16} color="var(--text-contrast-minimum)" />
                  </Box>
                </Group>
              </Group>
              <Text size="xs" c="dimmed" mt={8} style={{ lineHeight: 1.5 }}>
                Leave site-relevant details that are only visible internally.
              </Text>
            </Box>
            {/* Composer */}
            <Box style={{ padding: '12px 20px', borderBottom: '1px solid var(--graphic-contrast-low)', flexShrink: 0 }}>
              <Textarea placeholder="Add a note for the next agent..." rows={2} value={drawerDraft} onChange={(e) => setDrawerDraft(e.currentTarget.value)} styles={{ input: { fontSize: 13 } }} />
              <Group justify="flex-end" gap="xs" mt="xs">
                <Button intent="prominent" appearance="solid" size="xs" onClick={() => { if (drawerDraft.trim()) { addNote(drawerDraft.trim()); setDrawerDraft(''); } }}>Save Note</Button>
              </Group>
            </Box>
            {/* Notes list */}
            <ScrollArea style={{ flex: 1 }}>
              <Box style={{ padding: '0 20px' }}>
                {notes.map((note, i) => (
                  <Box key={note.id} style={{ padding: '16px 0', borderBottom: i < notes.length - 1 ? '1px solid var(--graphic-contrast-low)' : 'none' }}>
                    <Group gap={6} mb={4} align="center">
                      <Text fw={600} size="sm">{note.author}</Text>
                      <Text size="sm" c="dimmed">|</Text>
                      <Text size="sm" c="dimmed">{note.timestamp}</Text>
                    </Group>
                    <Text size="sm" style={{ color: 'var(--text-contrast-medium)', lineHeight: 1.6 }}>{note.text}</Text>
                  </Box>
                ))}
              </Box>
            </ScrollArea>
          </Box>
        )}
      </Box>

      {/* ── Fixed Queue Tray (Search tab only) ── */}
      {selectedRows.size > 0 && activeTab === 'search' && canTakeAction && (
        <Box style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 500, backgroundColor: 'var(--background-contrast-none)', padding: '12px 32px', boxShadow: '0px -8px 24px 0px #11152329' }}>
          <Group justify="space-between" align="center" wrap="nowrap">
            <Group gap={12} align="center" wrap="nowrap">
              <Group gap={6} align="center" wrap="nowrap">
                <Text fw={700} style={{ color: 'var(--text-contrast-high)', whiteSpace: 'nowrap', fontSize: 15 }}>
                  {selectedRows.size.toLocaleString()} RR{selectedRows.size !== 1 ? 's' : ''} in queue
                </Text>
              </Group>
              <Box style={{ width: 1, height: 18, backgroundColor: 'var(--graphic-contrast-low)', flexShrink: 0 }} />
              <Group gap={8} align="center" wrap="nowrap">
                <Button intent="prominent" appearance="solid" size="sm"
                  onClick={() => {
                    setActionScope('selected');
                    if (isInbound && !filteredToSingleMethod) {
                      clearUndoEntries(); setScheduleStepperOpen(true);
                    } else {
                      setActiveAction('schedule');
                    }
                  }}
                >{isEmrRemote ? 'Update Progress' : 'Schedule'}</Button>
                <Button intent="neutral" appearance="outline" size="sm"
                  onClick={() => { setActionScope('selected'); setActiveAction('research'); }}
                >Send to Research</Button>
                <Button intent="neutral" appearance="outline" size="sm"
                  onClick={() => { setActionScope('selected'); setActiveAction('reroute'); }}
                >Reroute</Button>
                <Button intent="neutral" appearance="outline" size="sm"
                  onClick={() => { setActionScope('selected'); setActiveAction('pend'); }}
                >Pend</Button>
              </Group>
            </Group>
            <Text size="sm" fw={500} style={{ color: 'var(--text-status-negative)', cursor: 'pointer', whiteSpace: 'nowrap' }}
              onClick={() => { setSelectedRows(new Set()); setQueueMode(false); }}>
              Clear Queue
            </Text>
          </Group>
        </Box>
      )}

      {/* ── Unmatched IDs Modal ── */}
      {unmatchedModalOpen && (
        <ModalOverlay title={`${unmatchedIdsRef.current.length} IDs Not Found`} onClose={() => setUnmatchedModalOpen(false)} size={480}>
          <Stack gap="md">
            <Text size="sm" style={{ color: 'var(--text-contrast-medium)' }}>These IDs could not be matched to any record request in this retrieval unit.</Text>
            <Box style={{ maxHeight: 320, overflowY: 'auto' }}>
              {unmatchedIdsRef.current.map((id, i) => (
                <Box key={id} style={{ padding: '10px 0', borderBottom: i < unmatchedIdsRef.current.length - 1 ? '1px solid var(--graphic-contrast-low)' : 'none' }}>
                  <Text size="sm" style={{ color: 'var(--text-contrast-medium)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{id}</Text>
                </Box>
              ))}
            </Box>
            <Group justify="flex-end">
              <Text size="sm" fw={500} style={{ color: 'var(--text-data-blue)', cursor: 'pointer' }}
                onClick={() => navigator.clipboard?.writeText(unmatchedIdsRef.current.join('\n'))}>
                Copy all
              </Text>
            </Group>
          </Stack>
        </ModalOverlay>
      )}

      {/* ── Queue-clear guardrail (Verification action vs. Search-tab queue) ── */}
      {queueClearWarn && (
        <ModalOverlay
          title="Clear queued work?"
          submitLabel="Clear Queue & Continue"
          size={460}
          onClose={() => setQueueClearWarn(null)}
          onSubmit={() => { const { run } = queueClearWarn; setSelectedRows(new Set()); setQueueClearWarn(null); run(); }}
        >
          <Stack gap="sm">
            <Text size="sm" style={{ color: 'var(--text-contrast-low)' }}>
              You have <Text component="span" fw={700} style={{ color: 'var(--text-contrast-high)' }}>{queueClearWarn.count.toLocaleString()} RR{queueClearWarn.count !== 1 ? 's' : ''}</Text> queued on the Workbench. Taking this action will clear that queue so you don't double-action the same inventory.
            </Text>
          </Stack>
        </ModalOverlay>
      )}

      {/* ── Schedule Nudge Modal ── */}
      {scheduleNudgeOpen && (
        <ScheduleNudgeModal
          rrCount={UNACTIONED_RR_COUNT}
          isInbound={isInbound}
          isEmrr={isEmrrContext}
          verifiedUnit={nudgeReason}
          onDismiss={() => setScheduleNudgeOpen(false)}
          onStartScheduling={() => {
            setScheduleNudgeOpen(false);
            guardQueue(() => {
              if (isInbound) {
                setActionScope('global');
                clearUndoEntries(); setScheduleStepperOpen(true);
              } else {
                applyGlobalAction('schedule');
              }
            });
          }}
        />
      )}

      {/* ── Schedule Stepper (inbound only) ── */}
      {scheduleStepperOpen && (() => {
        const source = actionScope === 'global' ? requestRows : requestRows.filter(r => selectedRows.has(r.id));
        const cpm = source.reduce((acc, r) => { acc[r.rowMethod] = (acc[r.rowMethod] || 0) + 1; return acc; }, {} as Record<string, number>);
        return (
          <ScheduleStepperModal
            methodSteps={METHOD_ORDER}
            onClose={() => setScheduleStepperOpen(false)}
            onStepComplete={(method, skipped) => {
              if (!skipped) scheduleMethodStep(method);
            }}
            siteAccessType={siteAccessType}
            onSiteAccessTypeChange={setSiteAccessType}
            paymentInfo={paymentInfo}
            onPaymentInfoChange={setPaymentInfo}
            countPerMethod={cpm}
          />
        );
      })()}

      {(() => { /* counts surfaced in modal headers reflect the full RU, not the loaded sample */ return null; })()}
      {/* ── Action Modals ── */}
      {activeAction === 'emrr-progress' && (() => {
        const emrrSampleCount = requestRows.filter(r => r.rowMethod === 'EMRR').length;
        const emrrFullRuCount = requestRows.length > 0 ? Math.round(TOTAL_RR_COUNT * (emrrSampleCount / requestRows.length)) : 0;
        const emrrSelectedCount = [...selectedRows].filter(id => requestRows.find(r => r.id === id)?.rowMethod === 'EMRR').length;
        return (
          <EmrrSaveProgressModal
            count={actionScope === 'global' ? emrrFullRuCount : emrrSelectedCount}
            onClose={() => { setActiveAction(null); setActionScope('selected'); }}
            onSubmit={(status, date, pmtReq) => applyAction('emrr-progress', actionScope === 'global', status, date, pmtReq)}
            siteAccessType={siteAccessType}
            onSiteAccessTypeChange={setSiteAccessType}
            paymentInfo={paymentInfo}
            onPaymentInfoChange={setPaymentInfo}
          />
        );
      })()}
      {activeAction === 'schedule' && (
        isEmrRemote || (isInbound && effectiveMethod === 'emr-remote')
          ? <EmrrSaveProgressModal count={actionScope === 'global' ? UNACTIONED_RR_COUNT : selectedRows.size} onClose={() => { setActiveAction(null); setActionScope('selected'); }} onSubmit={(status, date, pmtReq) => applyAction('schedule', actionScope === 'global', status, date, pmtReq)} siteAccessType={siteAccessType} onSiteAccessTypeChange={setSiteAccessType} paymentInfo={paymentInfo} onPaymentInfoChange={setPaymentInfo} />
          : (retrievalMethod === 'onsite' || (isInbound && effectiveMethod === 'onsite'))
            ? <OnsiteScheduleModal count={actionScope === 'global' ? UNACTIONED_RR_COUNT : selectedRows.size} scheduledCount={requestRows.filter(r => r.status === 'Scheduled').length} onClose={() => { setActiveAction(null); setActionScope('selected'); }} onSaveProgress={() => logProgress(actionScope === 'global')} onSubmit={(status, pmtReq, excludeScheduled) => applyAction('schedule', actionScope === 'global', status || 'Scheduled', '3/1/2026', pmtReq, false, excludeScheduled)} />
            : <ScheduleModal
                count={actionScope === 'global' ? UNACTIONED_RR_COUNT : selectedRows.size}
                unblockedCount={actionScope === 'global' ? requestRows.filter(r => r.status === 'In Progress-Unblocked').length : [...selectedRows].filter(id => requestRows.find(r => r.id === id)?.status === 'In Progress-Unblocked').length}
                scheduledCount={requestRows.filter(r => r.status === 'Scheduled').length}
                onClose={() => { setActiveAction(null); setActionScope('selected'); }}
                onSaveProgress={() => logProgress(actionScope === 'global')}
                onSubmit={(date, pmtReq, excludeScheduled) => applyAction('schedule', actionScope === 'global', undefined, date, pmtReq, true, excludeScheduled)}
              />
      )}
      {activeAction === 'research' && (
        <ResearchModal count={actionScope === 'global' ? UNACTIONED_RR_COUNT : selectedRows.size} onClose={() => { setActiveAction(null); setActionScope('selected'); setResearchReason(undefined); }} onSubmit={() => applyAction('research', actionScope === 'global')} defaultReason={researchReason} {...(isEmrRemote ? { siteAccessType, onSiteAccessTypeChange: setSiteAccessType } : {})} />
      )}
      {activeAction === 'pend' && (
        <PendModal count={actionScope === 'global' ? UNACTIONED_RR_COUNT : selectedRows.size} onClose={() => { setActiveAction(null); setActionScope('selected'); }} onSubmit={() => applyAction('pend', actionScope === 'global')} {...(isEmrRemote ? { siteAccessType, onSiteAccessTypeChange: setSiteAccessType } : {})} />
      )}
      {activeAction === 'reroute' && (
        <RerouteModal count={actionScope === 'global' ? UNACTIONED_RR_COUNT : selectedRows.size} onClose={() => { setActiveAction(null); setActionScope('selected'); }} onSubmit={() => applyAction('reroute', actionScope === 'global')} excludeMethod={isEmrRemote ? 'EMRR' : retrievalMethod === 'onsite' ? 'Onsite' : retrievalMethod === 'offsite' ? 'Offsite' : undefined} {...(isEmrRemote ? { siteAccessType, onSiteAccessTypeChange: setSiteAccessType } : {})} />
      )}
      {editSiteOpen && <EditSiteModal onClose={() => setEditSiteOpen(false)} isEmrRemote={isEmrRemote} siteAccessType={siteAccessType} onSiteAccessTypeChange={setSiteAccessType} />}

      {/* Pends modal — uniform listing of all PNP codes; actionable/blocked distinction lives in Needs Action card */}
      {activePendsModalOpen && (
        <ModalOverlay title="Pends" onClose={() => setActivePendsModalOpen(false)} size={480}>
          <Stack gap={0}>
            {ACTIVE_PENDS.map(p => (
              <Box key={p.code} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--graphic-contrast-low)' }}>
                <Text size="md" fw={700} style={{ color: 'var(--text-contrast-high)', minWidth: 36 }}>{p.count}</Text>
                <Text size="sm" fw={600} style={{ color: 'var(--text-contrast-high)' }}>{p.code}</Text>
                <Text size="sm" style={{ color: 'var(--text-contrast-minimum)' }}>{p.label}</Text>
              </Box>
            ))}
          </Stack>
        </ModalOverlay>
      )}


      {/* ── No Contact Modals ── */}
      {noContactModalOpen && noContactReason && (() => {
        const handleSave = () => {
          setNoContactModalOpen(false);
          setNoContactSubmitted(true);
          showToast('No Contact reason saved');
        };
        const handleCancel = () => setNoContactModalOpen(false);

        if (noContactReason === 'no_answer_no_vm') {
          return (
            <NoAnswerModal
              title="Add Note: No Answer (No Voicemail)"
              defaultReason="No voicemail available"
              reasons={['No voicemail available', 'Phone disconnected', 'Line busy']}
              onClose={handleCancel}
              onSave={handleSave}
            />
          );
        }
        if (noContactReason === 'no_answer_left_vm') {
          return (
            <NoAnswerModal
              title="Add Note: No Answer (Left Voicemail)"
              defaultReason="Left VM with Human"
              reasons={['Left VM with Human', 'Left VM on machine', 'Left VM with answering service']}
              onClose={handleCancel}
              onSave={handleSave}
            />
          );
        }
        if (noContactReason === 'not_practitioner') {
          return (
            <NoAnswerModal
              title="Add Note: Not a Practitioner Office"
              defaultReason="VM Stated Location Other than Medical Facility"
              reasons={['VM Stated Location Other than Medical Facility', 'Person confirmed not a medical facility', 'Fax line only']}
              onClose={handleCancel}
              onSave={handleSave}
            />
          );
        }
        if (noContactReason === 'site_closed') {
          return (
            <SiteClosedModal onClose={handleCancel} onSave={handleSave} />
          );
        }
        return null;
      })()}

      {/* ── Toast notification ── */}
      {toast && (
        <div style={{
          position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--background-contrast-none)', border: '1px solid var(--graphic-contrast-low)', borderRadius: 8,
          padding: '10px 16px', zIndex: 10000,
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)', width: 420,
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="10" cy="10" r="10" fill="none" stroke="var(--graphic-status-positive)" strokeWidth="1.5"/>
            <path d="M6 10.5l2.5 2.5L14 7.5" stroke="var(--graphic-status-positive)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <Text size="sm" style={{ flex: 1, color: 'var(--text-status-positive)', fontWeight: 500 }}>{toast}</Text>
          <Text style={{ cursor: 'pointer', color: 'var(--text-contrast-minimum)', fontSize: 18, lineHeight: 1 }} onClick={() => setToast(null)}>×</Text>
        </div>
      )}
    </Box>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

// URL slug ↔ internal state mappings
const METHOD_SLUGS: Record<string, { method: string; callType: string }> = {
  offsite: { method: 'offsite', callType: 'outbound' },
  onsite: { method: 'onsite', callType: 'outbound' },
  emrr: { method: 'emr-remote', callType: 'outbound' },
  inbound: { method: 'inbound', callType: 'inbound' },
};
const SLUG_TO_TAB: Record<string, string> = {
  verification: 'provider',
  search: 'search',
  history: 'history',
};
const TAB_TO_SLUG: Record<string, string> = {
  provider: 'verification',
  search: 'search',
  history: 'history',
};

export function NexReachPrototype() {
  const location = useLocation();
  const navigate = useNavigate();
  const [phoneValue, setPhoneValue] = useState('');
  const [callType, setCallType] = useState('outbound');
  const [retrieval, setRetrieval] = useState('offsite');

  // Parse path: /nexreach-v3/[methodSlug]/[tabSlug]?
  const pathParts = location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  // pathParts[0] === 'nexreach-v3'
  const methodSlug = pathParts[1];
  const tabSlug = pathParts[2];
  const isValidMethod = methodSlug && methodSlug in METHOD_SLUGS;

  if (isValidMethod) {
    const { method, callType: ct } = METHOD_SLUGS[methodSlug];
    const activeTab = (tabSlug && SLUG_TO_TAB[tabSlug]) || 'provider';
    return (
      <WorkspaceScreen
        onBackToSearch={() => navigate('/nexreach-v3')}
        retrievalMethod={ct === 'inbound' ? 'inbound' : method}
        activeTab={activeTab}
        onTabChange={(tabValue) => {
          const slug = TAB_TO_SLUG[tabValue] || 'verification';
          navigate(`/nexreach-v3/${methodSlug}/${slug}`);
        }}
      />
    );
  }

  const handleSearch = () => {
    if (!phoneValue.trim()) return;
    const slug = callType === 'inbound' ? 'inbound' : retrieval === 'emr-remote' ? 'emrr' : retrieval;
    navigate(`/nexreach-v3/${slug}`);
  };

  return (
    <LandingScreen
      phoneValue={phoneValue}
      onPhoneChange={setPhoneValue}
      callType={callType}
      onCallTypeChange={setCallType}
      retrieval={retrieval}
      onRetrievalChange={setRetrieval}
      onSearch={handleSearch}
    />
  );
}
