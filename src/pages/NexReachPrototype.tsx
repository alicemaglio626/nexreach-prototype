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
  Tooltip,
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
  IconChevronLeft,
  IconChevronRight,
  IconRotateClockwise,
  IconX,
  IconArrowBackUp,
  IconInfoCircle,
  IconSwitchHorizontal,
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
type ActionType = 'schedule' | 'research' | 'pend' | 'reroute';

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
  { id: 3, initials: 'AR', color: '#006ccf', author: 'Alex Rivera', timestamp: 'Mar 4, 2026', text: 'Confirmed they accept requests for 2024 and 2025 DOS. Flag duplicate name issues — they\'ve raised this before.' },
  { id: 4, initials: 'JS', color: '#7c3aed', author: 'Jordan Schaefer', timestamp: 'Feb 28, 2026', text: 'Office manager said they\'re switching EMR systems in April — may cause delays. Follow up after the 15th.' },
  { id: 5, initials: 'MT', color: '#059669', author: 'Maria Torres', timestamp: 'Feb 20, 2026', text: 'Spoke with Dr. Barnes\' admin directly. She handles all record requests personally and prefers email over fax.' },
  { id: 6, initials: 'AR', color: '#006ccf', author: 'Alex Rivera', timestamp: 'Feb 10, 2026', text: 'Site was closed the week of Feb 3–7 for staff training. Back to normal now.' },
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
const UNBLOCKED_APPROVED_AMOUNT = 100;
const UNBLOCKED_COUNT = 8; // first N rows are In Progress-Unblocked (PNP24 released, $100 approved)

const REQUEST_ROWS = MEMBER_NAMES.map((member, i) => ({
  id: String(387216389 + i),
  plan: PLANS[i % PLANS.length],
  member,
  rowMethod: ROW_METHODS[i],
  dob: `${String((i % 12) + 1).padStart(2, '0')}/${String((i % 28) + 1).padStart(2, '0')}/${1985 + (i % 15)}`,
  due: '4/1/2026',
  commit: '—',
  status: i < UNBLOCKED_COUNT ? 'In Progress-Unblocked' : 'New',
  payment: '—',
  osRef: `87991820${9887 + i}`,
  practitioner: 'BARNES, TAYLOR',
  sdos: `0${(i % 9) + 1}/01/2026-0${(i % 9) + 1}/28/2026`,
  sloc: SLOC_ADDRESSES[i % SLOC_ADDRESSES.length],
  site: SITE_ADDRESSES[i % SITE_ADDRESSES.length],
}));

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
          border: hasSelection ? '1px solid #006ccf' : '1px solid #8a8985',
          borderRadius: 1000,
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 500,
          color: hasSelection ? '#006ccf' : '#4f4e4c',
          backgroundColor: hasSelection ? '#eaf5ff' : 'transparent',
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
            backgroundColor: '#fff', border: '1px solid #e7e5df', borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)', padding: '6px 0', minWidth: 180,
          }}>
            {options.map(opt => (
              <Box
                key={opt}
                onClick={() => toggle(opt)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px',
                  cursor: 'pointer', fontSize: 14, color: '#242423',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f7f6f4'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <MantineCheckbox size="xs" checked={selected ? selected.has(opt) : false} onChange={() => toggle(opt)} />
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
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#fff', borderRadius: 12, zIndex: 9999, width: size, maxWidth: 'calc(100vw - 40px)', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        <Box style={{ padding: '20px 24px 12px', borderBottom: '1px solid #e7e5df', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', borderRadius: '12px 12px 0 0', zIndex: 1 }}>
          <Text fw={400} size="xl">{title}</Text>
          <Text style={{ cursor: 'pointer', color: '#6b7280', fontSize: 20, lineHeight: 1 }} onClick={onClose}>×</Text>
        </Box>
        <Box style={{ padding: '16px 24px 24px' }}>
          <Stack gap="md">
            {children}
            {submitLabel && (
              <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid #e7e5df' }}>
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

function ScheduleModal({ count, unblockedCount = 0, onClose, onSubmit }: { count: number; unblockedCount?: number; onClose: () => void; onSubmit?: (commitDate?: string, paymentRequired?: boolean) => void }) {
  const [activeTab, setActiveTab] = useState<'progress' | 'schedule'>('progress');
  const [showPendModal, setShowPendModal] = useState(false);

  // Progress Update fields
  const [paymentRequired, setPaymentRequired] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [feesNotPerChart, setFeesNotPerChart] = useState(false);
  const [paymentTimeline, setPaymentTimeline] = useState('pre-pay');
  const [paymentMethod, setPaymentMethod] = useState('check');
  const [includeProviderPkg, setIncludeProviderPkg] = useState('yes');
  const [submissionMethod, setSubmissionMethod] = useState<string | null>('mail');
  const [contactEmail, setContactEmail] = useState('mason@manhattanim.com');
  const [notes, setNotes] = useState('This is some autogenerated note text.');

  const [pendAcknowledged, setPendAcknowledged] = useState(false);
  const needsEmail = paymentMethod === 'credit-card' || submissionMethod === 'email';

  // Schedule tab fields
  const [commitDate, setCommitDate] = useState('2026-04-01');

  // RU has 3 cap tiers — pre-approved (unblocked from PNP24), high-cap plan, low-cap plan
  const PRE_APPROVED_COUNT = unblockedCount;
  const PRE_APPROVED_AMOUNT = UNBLOCKED_APPROVED_AMOUNT;
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
        <TextInput label="Payment Amount Per Chart" required value={`$${parsedAmount}`} readOnly styles={{ input: { backgroundColor: '#f7f6f4', color: '#6b7280' } }} />
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
        <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid #e7e5df' }}>
          <Button intent="neutral" appearance="ghost" onClick={onClose}>Cancel</Button>
          <Button intent="prominent" appearance="solid" onClick={() => onSubmit ? onSubmit(commitDate, paymentRequired === 'yes') : onClose()}>Pend Record Request(s)</Button>
        </Group>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay title={`Scheduling ${count} Record Request(s)`} onClose={onClose} size={600}>
        {/* Tab switcher — matches Figma pill toggle */}
        <Flex gap={0} style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid #006ccf' }}>
          <Box
            onClick={() => setActiveTab('progress')}
            style={{
              flex: 1, padding: '10px 0', textAlign: 'center', cursor: 'pointer', fontSize: 14, fontWeight: 600,
              backgroundColor: activeTab === 'progress' ? '#006ccf' : '#fff',
              color: activeTab === 'progress' ? '#fff' : '#006ccf',
            }}
          >Progress Update</Box>
          <Box
            onClick={() => canProceedToSchedule && !isOverCap ? setActiveTab('schedule') : undefined}
            style={{
              flex: 1, padding: '10px 0', textAlign: 'center', fontSize: 14, fontWeight: 600,
              backgroundColor: activeTab === 'schedule' ? '#006ccf' : '#fff',
              color: activeTab === 'schedule' ? '#fff' : '#006ccf',
              cursor: canProceedToSchedule && !isOverCap ? 'pointer' : 'default',
              opacity: canProceedToSchedule && !isOverCap ? 1 : 0.5,
              borderLeft: '1px solid #006ccf',
            }}
          >Schedule</Box>
        </Flex>

        {activeTab === 'progress' ? (
          <>
            <Text size="sm" c="dimmed" style={{ lineHeight: 1.5 }}>
              Click "Save Progress" to log progress without scheduling record requests. If you are ready to schedule record requests, click "Proceed to Scheduling" to fill in the commitment date.
            </Text>

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
                  <Text size="sm" fw={600} mb={8} style={{ color: '#4f4e4c' }}>Payment Amount Per Chart <span style={{ color: '#f2502b' }}>*</span></Text>

                  {/* Row 1 — Approved RRs (locked) */}
                  {PRE_APPROVED_COUNT > 0 && (
                    <Box style={{ border: '1px solid #a8dfc4', borderRadius: 6, padding: '10px 12px', marginBottom: 8, background: '#f0faf5' }}>
                      <Flex justify="space-between" align="center" mb={8}>
                        <Text size="xs" fw={600} style={{ color: '#1f7c53' }}>Approved RRs ({PRE_APPROVED_COUNT}/{count})</Text>
                        <Text size="xs" fw={600} style={{ color: '#1f7c53' }}>✓ Pre-approved — bypasses cap</Text>
                      </Flex>
                      <Box>
                        <Text size="xs" style={{ color: '#3d8f65' }}>Approved Amount</Text>
                        <Text size="sm" fw={700} style={{ color: '#1f7c53' }}>${PRE_APPROVED_AMOUNT}</Text>
                      </Box>
                    </Box>
                  )}

                  {/* Row 2 — Remaining RRs (editable) */}
                  <Box style={{ border: '1px solid #8a8985', borderRadius: 6, padding: '10px 12px' }}>
                    <Text size="xs" fw={600} mb={6} style={{ color: '#4f4e4c' }}>
                      {PRE_APPROVED_COUNT > 0 ? `Remaining RRs (${count - PRE_APPROVED_COUNT}/${count})` : `All RRs (${count})`}
                    </Text>
                    <Flex gap="md" align="flex-start">
                      <Box style={{ flex: 1 }}>
                        <TextInput
                          placeholder="$ Enter Amount"
                          value={paymentAmount}
                          onChange={(e) => { if (!feesNotPerChart) setPaymentAmount(e.currentTarget.value); }}
                          styles={feesNotPerChart ? { input: { backgroundColor: '#f7f6f4', color: '#9ca3af' } } : undefined}
                        />
                      </Box>
                      <Box style={{ flex: 1, paddingTop: 6 }}>
                        <Text size="xs" style={{ color: '#6e6d6a' }}>Payment Cap Per Chart</Text>
                        <Text size="sm" fw={600}>${LOW_CAP}–${HIGH_CAP}</Text>
                      </Box>
                    </Flex>

                    {hasBelowCap && (
                      <Flex gap={6} align="flex-start" mt={8}>
                        <Text style={{ fontSize: 13, color: '#1f7c53', flexShrink: 0, lineHeight: '20px' }}>✓</Text>
                        <Box>
                          <Text size="sm" fw={600} style={{ color: '#1f7c53' }}>Payment amount below cap: {belowCapCount}/{count - PRE_APPROVED_COUNT} Remaining RRs</Text>
                          <Text size="sm" style={{ color: '#1f7c53' }}>These requests are below the payment cap and will proceed to scheduling.</Text>
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
              <Text size="sm" fw={600} mb={6}>Include Provider Package *</Text>
              <Radio.Group value={includeProviderPkg} onChange={setIncludeProviderPkg}>
                <Group gap="lg"><Radio value="yes" label="Yes" aria-label="Yes" /><Radio value="no" label="No" aria-label="No" /></Group>
              </Radio.Group>
            </Box>

            {/* Submission Method */}
            <Select comboboxProps={{ zIndex: 10001 }} label="Submission Method" required data={[
              { value: 'mail', label: 'Mail' },
              { value: 'fax', label: 'Fax' },
              { value: 'email', label: 'Email' },
            ]} value={submissionMethod} onChange={setSubmissionMethod} />

            {needsEmail && (
              <TextInput label="Primary Contact Email" required value={contactEmail} onChange={(e) => setContactEmail(e.currentTarget.value)} />
            )}

            <Textarea label="Notes" required rows={4} value={notes} onChange={(e) => setNotes(e.currentTarget.value)} />

            {/* Over cap alert + ack — after Notes, before actions, matching Figma */}
            {hasOverCap && (
              <>
                <Divider />
                <Flex gap={8} align="flex-start">
                  <Text style={{ fontSize: 14, color: '#87690b', flexShrink: 0, lineHeight: '20px' }}>⚠</Text>
                  <Box>
                    <Text size="sm" fw={600} style={{ color: '#87690b' }}>Payment Cap Exceeded: {pendCount}/{count - PRE_APPROVED_COUNT} Remaining RRs</Text>
                    <Text size="sm" style={{ color: '#87690b' }}>These remaining requests exceed the payment cap. Upon submitting, they will proceed to the PNP24 (Request Payment) process.</Text>
                  </Box>
                </Flex>
                <Group gap={8} align="flex-start" style={{ cursor: 'pointer' }} onClick={() => setPendAcknowledged(!pendAcknowledged)}>
                  <MantineCheckbox checked={pendAcknowledged} onChange={(e) => setPendAcknowledged(e.currentTarget.checked)} size="sm" style={{ marginTop: 2 }} />
                  <Text size="sm">I acknowledge that I am pending {pendCount} of the {count - PRE_APPROVED_COUNT} remaining RRs that exceed the payment cap.</Text>
                </Group>
              </>
            )}

            <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid #e7e5df' }}>
              <Button intent="neutral" appearance="ghost" onClick={onClose}>Cancel</Button>
              <Button
                intent="neutral"
                appearance="outline"
                onClick={onClose}
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
                  width: '100%', padding: '8px 12px', border: '1px solid #8a8985',
                  borderRadius: 6, fontSize: 14, fontFamily: 'DM Sans, sans-serif',
                  color: '#242423', outline: 'none',
                }}
              />
            </Box>

            <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid #e7e5df' }}>
              <Button intent="neutral" appearance="ghost" onClick={onClose}>Cancel</Button>
              <Button intent="prominent" appearance="solid" onClick={() => onSubmit ? onSubmit(commitDate, paymentRequired === 'yes') : onClose()}>Schedule Record Request(s)</Button>
            </Group>
          </>
        )}
    </ModalOverlay>
  );
}

// ─── Onsite Schedule Modal ───────────────────────────────────────────────────

function OnsiteScheduleModal({ count, onClose, onSubmit }: { count: number; onClose: () => void; onSubmit?: (status?: string, paymentRequired?: boolean) => void }) {
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
        <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid #e7e5df' }}>
          <Button intent="neutral" appearance="ghost" onClick={onClose}>Cancel</Button>
          <Button intent="prominent" appearance="solid" onClick={() => onSubmit ? onSubmit('Scheduled', paymentRequired === 'yes') : onClose()}>Confirm</Button>
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
            <Text size="xs" style={{ color: '#006ccf', lineHeight: 1.5 }}>
              If there are specific preferred date(s), utilize the "Preferred Date" field(s). Start and End Times are not required. Alternately, you may utilize the notes field to record preferred days of the week.
            </Text>
            <Flex gap="md" align="flex-end">
              <Box style={{ flex: 1 }}>
                <Text size="sm" fw={600} mb={6}>Preferred Date</Text>
                <input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #8a8985', borderRadius: 6, fontSize: 14, fontFamily: 'DM Sans, sans-serif', color: '#242423', outline: 'none' }}
                />
              </Box>
              <Box style={{ flex: 1 }}>
                <Select comboboxProps={{ zIndex: 10001 }} label="Start Time" placeholder="Select" data={['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']} />
              </Box>
              <Box style={{ flex: 1 }}>
                <Select comboboxProps={{ zIndex: 10001 }} label="End Time" placeholder="Select" data={['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']} />
              </Box>
            </Flex>
            <Text size="xs" fw={500} style={{ color: '#006ccf', cursor: 'pointer' }}>+ Add Another Date</Text>
          </>
        )}
        <Textarea label="Notes" rows={4} value={naNotes} onChange={(e) => setNaNotes(e.currentTarget.value)} />
        <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid #e7e5df' }}>
          <Button intent="neutral" appearance="ghost" onClick={onClose}>Cancel</Button>
          <Button intent="prominent" appearance="solid" onClick={() => onSubmit ? onSubmit('No Availability', paymentRequired === 'yes') : onClose()}>Update Record Request(s)</Button>
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
            <div style={{ background: '#fff', borderRadius: 12, width: 600, maxWidth: 'calc(100vw - 40px)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', overflow: 'auto', maxHeight: schedulerOpened ? '45vh' : '90vh' }}>
              <Box style={{ padding: '20px 24px 12px', borderBottom: '1px solid #e7e5df', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', borderRadius: '12px 12px 0 0', zIndex: 1 }}>
                <Text fw={400} size="xl">Scheduling {count} Record Request(s)</Text>
                <Text style={{ cursor: 'pointer', color: '#6b7280', fontSize: 20, lineHeight: 1 }} onClick={onClose}>×</Text>
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
                          border: schedulerOpened ? '1px solid #059669' : '1px solid #c0beb9',
                          color: schedulerOpened ? '#059669' : '#c0beb9',
                          backgroundColor: schedulerOpened ? '#dcfce7' : 'transparent',
                        }}
                      >&#10003; Scheduling Successful</Box>
                      <Box
                        onClick={schedulerOpened ? () => setStep('noAvailability') : undefined}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                          borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: schedulerOpened ? 'pointer' : 'default',
                          border: schedulerOpened ? '1px solid #dc2626' : '1px solid #c0beb9',
                          color: schedulerOpened ? '#dc2626' : '#c0beb9',
                          backgroundColor: schedulerOpened ? '#fee2e2' : 'transparent',
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
                  <span style={{ color: '#fff', fontSize: 13 }}>OS-Ref ID: 98980199</span>
                  <span style={{ color: '#9ca3af', fontSize: 13 }}>To Go: 246</span>
                  <span style={{ color: '#059669', fontSize: 13 }}>Hours Needed: 26</span>
                  <span style={{ color: '#006ccf', fontSize: 13 }}>Hours Scheduled: 16</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ color: '#9ca3af', fontSize: 13, cursor: 'pointer' }}>Save</span>
                  <span style={{ color: '#9ca3af', fontSize: 13 }}>|</span>
                  <span style={{ color: '#9ca3af', fontSize: 13, cursor: 'pointer' }}>Cancel</span>
                </div>
              </div>
              {/* Scheduler grid */}
              <div style={{ overflow: 'auto', height: '100%' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#4a4a4a' }}>
                      <th style={{ color: '#fff', padding: '6px 8px', textAlign: 'left', position: 'sticky', left: 0, background: '#4a4a4a', minWidth: 130 }}>Time</th>
                      {['Wed 11/5', 'Th 11/6', 'Fri 11/7', 'Mon 11/10', 'Tue 11/11', 'Wed 11/12', 'Th 11/13', 'Fri 11/14', 'Mon 11/17', 'Tue 11/18', 'Wed 11/19', 'Th 11/20', 'Fri 11/21'].map(d => (
                        <th key={d} style={{ color: '#fff', padding: '6px 8px', textAlign: 'center', minWidth: 70 }}>{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {['08:00 AM - 09:00 AM', '09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '12:00 PM - 01:00 PM', '01:00 PM - 02:00 PM', '02:00 PM - 03:00 PM', '03:00 PM - 04:00 PM', '04:00 PM - 05:00 PM'].map((time, ti) => (
                      <tr key={time}>
                        <td style={{ color: '#e5e7eb', padding: '4px 8px', background: '#3d3d3d', position: 'sticky', left: 0, borderBottom: '1px solid #555', fontSize: 11 }}>{time}</td>
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
      <Flex gap={0} style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid #006ccf' }}>
        <Box onClick={() => setActiveTab('progress')}
          style={{ flex: 1, padding: '10px 0', textAlign: 'center', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            backgroundColor: activeTab === 'progress' ? '#006ccf' : '#fff', color: activeTab === 'progress' ? '#fff' : '#006ccf', borderRadius: 6 }}
        >Progress Update</Box>
        <Box onClick={() => canProceedToSchedule && !isOverCap ? setActiveTab('schedule') : undefined}
          style={{ flex: 1, padding: '10px 0', textAlign: 'center', fontSize: 14, fontWeight: 600,
            backgroundColor: activeTab === 'schedule' ? '#006ccf' : '#fff', color: activeTab === 'schedule' ? '#fff' : '#006ccf',
            cursor: canProceedToSchedule && !isOverCap ? 'pointer' : 'default', opacity: canProceedToSchedule && !isOverCap ? 1 : 0.5, borderLeft: '1px solid #006ccf', borderRadius: 6 }}
        >Schedule</Box>
      </Flex>

      {activeTab === 'progress' ? (
        <>
          <Text size="sm" c="dimmed" style={{ lineHeight: 1.5 }}>
            Click "Save Progress" to log progress without scheduling record requests. If you are ready to schedule record requests, click "Proceed to Scheduling."
          </Text>

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
                    styles={feesNotPerChart ? { input: { backgroundColor: '#f7f6f4', color: '#9ca3af' } } : undefined}
                  />
                </Box>
                <Box style={{ flex: 1, paddingTop: 24 }}>
                  <Text size="sm" c="dimmed">Payment Cap Per Chart</Text>
                  <Text size="sm" fw={600}>${paymentCap}</Text>
                </Box>
              </Flex>
              {isUnderCap && <Text size="sm" style={{ color: '#059669' }}>&#10003; Payment amount below cap</Text>}
              {isOverCap && (
                <Box style={{ display: 'flex', alignItems: 'flex-start', gap: 6, color: '#a7850d' }}>
                  <Text style={{ fontSize: 14 }}>&#9888;</Text>
                  <Box>
                    <Text size="sm" fw={600} style={{ color: '#a7850d' }}>Payment Cap Exceeded</Text>
                    <Text size="sm" style={{ color: '#6b7280' }}>These record requests will proceed to the PEND24 (Request Payment) process.</Text>
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
            <Text size="sm" fw={600} mb={6}>Include Provider Package *</Text>
            <Radio.Group value={includeProviderPkg} onChange={setIncludeProviderPkg}>
              <Group gap="lg"><Radio value="yes" label="Yes" aria-label="Yes" /><Radio value="no" label="No" aria-label="No" /></Group>
            </Radio.Group>
          </Box>

          <Select comboboxProps={{ zIndex: 10001 }} label="Submission Method" required data={[
            { value: 'mail', label: 'Mail' }, { value: 'fax', label: 'Fax' }, { value: 'email', label: 'Email' },
          ]} value={submissionMethod} onChange={setSubmissionMethod} />

          {needsEmail && <TextInput label="Primary Contact Email" required value={contactEmail} onChange={(e) => setContactEmail(e.currentTarget.value)} />}

          <Textarea label="Notes" required rows={4} value={notes} onChange={(e) => setNotes(e.currentTarget.value)} />

          <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid #e7e5df' }}>
            <Button intent="neutral" appearance="ghost" onClick={onClose}>Cancel</Button>
            <Button intent="neutral" appearance="outline" disabled={paymentRequired === null} onClick={onClose}>Save Progress</Button>
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
          <TextInput label="Address 1" required value={addr1} onChange={(e) => setAddr1(e.currentTarget.value)} />
          <TextInput label="Address 2" value={addr2} onChange={(e) => setAddr2(e.currentTarget.value)} />
          <TextInput label="City" required value={city} onChange={(e) => setCity(e.currentTarget.value)} />
          <Group grow>
            <Select comboboxProps={{ zIndex: 10001 }} label="State" required data={['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']} value={state} onChange={setState} />
            <TextInput label="Postal Code" required value={zip} onChange={(e) => setZip(e.currentTarget.value)} />
          </Group>

          <Box style={{ display: 'flex', alignItems: 'flex-start', gap: 6, color: '#7c3aed' }}>
            <Text style={{ fontSize: 14 }}>&#9432;</Text>
            <Box>
              <Text size="sm" fw={600} style={{ color: '#7c3aed' }}>Are you sure you're ready to schedule?</Text>
              <Text size="sm" style={{ color: '#6b7280' }}>Once you hit "Schedule Record Requests," you may not undo this action in NexReach.</Text>
            </Box>
          </Box>

          <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid #e7e5df' }}>
            <Button intent="neutral" appearance="ghost" onClick={onClose}>Cancel</Button>
            <Button intent="prominent" appearance="solid" onClick={() => setStep('techScheduler')}>Schedule Record Request(s)</Button>
          </Group>
        </>
      )}
    </ModalOverlay>
  );
}

function ResearchModal({ count, onClose, onSubmit, siteAccessType, onSiteAccessTypeChange }: { count: number; onClose: () => void; onSubmit?: () => void; siteAccessType?: string | null; onSiteAccessTypeChange?: (v: string) => void }) {
  const [phone] = useState('718-555-1234');
  const [reason, setReason] = useState<string | null>('member_verify');
  const [suggestedPhone, setSuggestedPhone] = useState('718-555-1236');
  const [notes, setNotes] = useState('Could not verify 2 [members or providers]. Sent to research.');
  return (
    <ModalOverlay title={`Sending ${count} Record Request(s) to Research`} submitLabel="Send Record Request(s)" onClose={onClose} onSubmit={onSubmit}>
      {/* SiteAccessTypePrompt hidden for now */}
      <TextInput label="Phone Number Attempted" required value={phone} readOnly styles={{ input: { backgroundColor: '#f7f6f4', color: '#6b7280' } }} />
      <Select comboboxProps={{ zIndex: 10001 }} label="Reason" required data={[
        { value: 'member_verify', label: 'Member verification not possible' },
        { value: 'not_on_file', label: 'Provider not on file' },
      ]} value={reason} onChange={setReason} />
      <TextInput label="Suggested Phone Number" value={suggestedPhone} onChange={(e) => setSuggestedPhone(e.currentTarget.value)} />
      <Textarea label="Notes" required rows={4} value={notes} onChange={(e) => setNotes(e.currentTarget.value)} />
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
          <span style={{ color: '#6b7280' }}>These options are no longer available for manual selection.</span>
        </Text>
      </Box>
      <Textarea label="Notes" required rows={4} value={notes} onChange={(e) => setNotes(e.currentTarget.value)} />
    </ModalOverlay>
  );
}

function RerouteModal({ count, onClose, onSubmit, siteAccessType, onSiteAccessTypeChange }: { count: number; onClose: () => void; onSubmit?: () => void; siteAccessType?: string | null; onSiteAccessTypeChange?: (v: string) => void }) {
  const [method, setMethod] = useState<string | null>('HIH-Major');
  const [vendor, setVendor] = useState<string | null>('epic');
  const [notes, setNotes] = useState('This is some autogenerated note text.');
  const isHIH = method === 'HIH-Major' || method === 'HIH-Other';
  return (
    <ModalOverlay title={`Rerouting ${count} Record Request(s)`} submitLabel="Reroute Record Request(s)" onClose={onClose} onSubmit={onSubmit}>
      {/* SiteAccessTypePrompt hidden for now */}
      <Select comboboxProps={{ zIndex: 10001 }} label="Preferred Retrieval Method" required data={[
        { value: 'Embedded', label: 'Embedded' },
        { value: 'EMR Remote', label: 'EMR Remote' },
        { value: 'HIH-Major', label: 'HIH-Major' },
        { value: 'HIH-Other', label: 'HIH-Other' },
        { value: 'Onsite', label: 'Onsite' },
        { value: 'Offsite', label: 'Offsite' },
      ]} value={method} onChange={setMethod} />
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
      <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid #e7e5df' }}>
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
    <Box style={{ border: '1px solid #e7e5df', borderRadius: 6, padding: '10px 14px' }}>
      <Text size="sm" fw={600} mb={4} style={{ color: '#242423' }}>Site Access Type *</Text>
      <Text size="xs" style={{ color: '#6e6d6a', marginBottom: 8 }}>
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
                    styles={feesNotPerChart ? { input: { backgroundColor: '#f7f6f4', color: '#9ca3af' } } : undefined}
                  />
                </Box>
                <Box style={{ flex: 1, paddingTop: 24 }}>
                  <Text size="sm" c="dimmed">Payment Cap Per Chart</Text>
                  <Text size="sm" fw={600}>${paymentCap}</Text>
                </Box>
              </Flex>

              {isUnderCap && <Text size="sm" style={{ color: '#059669' }}>&#10003; Payment amount below cap</Text>}
              {isOverCap && (
                <Box style={{ display: 'flex', alignItems: 'flex-start', gap: 6, color: '#a7850d' }}>
                  <Text style={{ fontSize: 14 }}>&#9888;</Text>
                  <Box>
                    <Text size="sm" fw={600} style={{ color: '#a7850d' }}>Payment Cap Exceeded</Text>
                    <Text size="sm" style={{ color: '#6b7280' }}>These record requests will proceed to the PEND24 (Request Payment) process.</Text>
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
            <Text size="sm" fw={600} mb={6}>Include Provider Package *</Text>
            <Radio.Group value={includeProviderPkg} onChange={setIncludeProviderPkg}>
              <Group gap="lg"><Radio value="yes" label="Yes" aria-label="Yes" /><Radio value="no" label="No" aria-label="No" /></Group>
            </Radio.Group>
          </Box>

          <Select comboboxProps={{ zIndex: 10001 }} label="Submission Method" required data={[
            { value: 'mail', label: 'Mail' },
            { value: 'fax', label: 'Fax' },
            { value: 'email', label: 'Email' },
          ]} value={submissionMethod} onChange={setSubmissionMethod} />

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
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #8a8985', borderRadius: 6, fontSize: 14, fontFamily: 'DM Sans, sans-serif', color: '#242423', outline: 'none' }}
          />
        </Box>
      )}

      <Textarea label="Notes" required rows={4} value={notes} onChange={(e) => setNotes(e.currentTarget.value)} />

      <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid #e7e5df' }}>
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
      <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid #e7e5df' }}>
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
        styles={phoneProvided === null ? { input: { backgroundColor: '#f7f6f4', color: '#9ca3af' } } : undefined}
        placeholder="This is some autogenerated note text."
      />
      <Group justify="flex-end" gap="sm" pt="sm" style={{ borderTop: '1px solid #e7e5df' }}>
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
      <Box style={{ backgroundColor: '#161515', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, width: '100%' }}>
        <Text style={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: -0.3 }}>datavant</Text>
        <Text size="xs" style={{ color: '#fff', opacity: 0.8, textAlign: 'right', lineHeight: 1.4 }}>user@useremail.com<br />Tenant</Text>
      </Box>

      <Box style={{ flex: 1, backgroundColor: '#fff', padding: '20px 20px', overflow: 'auto', width: '100%' }}>
        <Title order={2} fw={500} mb={32} style={{ fontSize: 24 }}>NexReach</Title>

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
                <IconSearch size={15} color="#9ca3af" style={{ cursor: 'pointer' }} onClick={onSearch} />
              }
              style={{ width: '100%' }}
            />
          </Box>

          {callType === 'inbound' && (
            <>
              <Text size="sm" fw={700} style={{ color: '#242423' }}>OR</Text>
              <Box>
                <TextInput
                  placeholder="Search by provider package ID"
                  onKeyDown={(e) => { if (e.key === 'Enter') onSearch(); }}
                  rightSection={
                    <IconSearch size={15} color="#9ca3af" style={{ cursor: 'pointer' }} onClick={onSearch} />
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

// ─── Workspace Screen ────────────────────────────────────────────────────────

function WorkspaceScreen({
  onBackToSearch,
  retrievalMethod,
}: {
  onBackToSearch: () => void;
  retrievalMethod: string;
}) {
  const [contactResult, setContactResult] = useState<ContactResult>(null);
  const [siteAccessType, setSiteAccessType] = useState<string | null>(null);
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

  const toggleFilter = (filterKey: string, value: string) => {
    setFilters(prev => {
      const current = prev[filterKey] || new Set<string>();
      const next = new Set(current);
      if (next.has(value)) next.delete(value); else next.add(value);
      return { ...prev, [filterKey]: next };
    });
  };

  const resetFilters = () => setFilters({});

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

  // For inbound: determine the active retrieval method from filter selection
  const methodFilter = filters['Retrieval Method'];
  const filteredToSingleMethod = methodFilter && methodFilter.size === 1;
  const activeMethod = filteredToSingleMethod ? Array.from(methodFilter)[0] : null;
  const effectiveMethod = isInbound ? (activeMethod === 'EMRR' ? 'emr-remote' : activeMethod?.toLowerCase() || null) : retrievalMethod;
  const canTakeGlobalAction = isInbound ? (isConnected && filteredToSingleMethod && activeMethod !== 'EMRR') : isConnected;
  const canTakeAction = isConnected;

  const toggleRow = (id: string) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const unactionedRows = requestRows.filter(r => (r.status === 'New' || r.status === 'In Progress-Unblocked') && !(isInbound && r.rowMethod === 'EMRR'));

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
    ? { schedule: 'Credential Progress Updated', research: 'Record Requests Sent to Research', pend: 'Record Requests Pended', reroute: 'Record Requests Rerouted' }
    : { schedule: 'Record Requests Scheduled', research: 'Record Requests Sent to Research', pend: 'Record Requests Pended', reroute: 'Record Requests Rerouted' };

  // Apply action to rows (update status + commitment date for schedule)
  const applyAction = (action: ActionType, global?: boolean, customStatus?: string, commitDate?: string, paymentRequired?: boolean) => {
    const statusMap: Record<ActionType, string> = isEmrrContext
      ? { schedule: 'Outreach In Progress', research: 'In Research', pend: 'Pended', reroute: 'Rerouted' }
      : { schedule: 'Scheduled', research: 'In Research', pend: 'Pended', reroute: 'Rerouted' };
    const finalStatus = customStatus || statusMap[action];
    const targetIds = global ? new Set(requestRows.map(r => r.id)) : selectedRows;

    if (targetIds.size > 0) {
      setRequestRows(prev => prev.map(r =>
        targetIds.has(r.id) ? {
          ...r,
          status: finalStatus,
          commit: (action === 'schedule' && finalStatus !== 'No Availability') ? (commitDate ? commitDate.replace(/^(\d{4})-(\d{2})-(\d{2})$/, (_, y, m, d) => `${parseInt(m)}/${parseInt(d)}/${y}`) : r.commit) : r.commit,
          payment: paymentRequired ? 'Payment Requested' : r.payment,
        } : r
      ));
      setSelectedRows(new Set());
      showToast(toastMessages[action]);
    }
    setActiveAction(null);
    setActionScope('selected');
  };

  // Apply global action to all rows
  const applyGlobalAction = (action: ActionType) => {
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
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = row.id.includes(q) || row.member.toLowerCase().includes(q) || row.plan.toLowerCase().includes(q) || row.practitioner.toLowerCase().includes(q);
      if (!match) return false;
    }
    // Filters
    const statusFilter = filters['Scheduling Status'] || filters['Outcome'];
    if (statusFilter && statusFilter.size > 0 && !statusFilter.has(row.status)) return false;
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
      <Box style={{ backgroundColor: '#161515', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <Text style={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: -0.3 }}>datavant</Text>
        <Text size="xs" style={{ color: '#fff', opacity: 0.8, textAlign: 'right', lineHeight: 1.4 }}>user@useremail.com<br />Tenant</Text>
      </Box>

      {/* Page header — sticky */}
      <Box style={{ backgroundColor: '#fff', borderBottom: '1px solid #e7e5df', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <Title order={2} fw={500} style={{ fontSize: 24, flexShrink: 0 }}>NexReach</Title>
        <Group gap="sm" style={{ flexShrink: 0 }}>
          <Button intent="neutral" appearance="outline" size="sm" onClick={onBackToSearch}>Back to Search</Button>
          <Button
            intent="prominent"
            appearance="solid"
            size="sm"
          >
            Finish Outreach
          </Button>
        </Group>
      </Box>

      {/* Two-column body */}
      <Box style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

        {/* LEFT PANEL — Site Details with collapse toggle */}
        {siteDetailsCollapsed ? (
          /* Collapsed: vertical tab affixed to the left edge */
          <Box
            onClick={() => setSiteDetailsCollapsed(false)}
            style={{
              flexShrink: 0, alignSelf: 'stretch',
              width: 28,
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
              paddingTop: 24,
              cursor: 'pointer',
            }}
          >
            <Box
              style={{
                background: '#f7f6f4',
                border: '1px solid #e7e5df',
                borderLeft: 'none',
                borderRadius: '0 8px 8px 0',
                padding: '14px 6px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                boxShadow: '2px 0 6px rgba(0,0,0,0.06)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#eaf5ff'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#f7f6f4'; }}
            >
              <IconChevronRight size={13} color="#4f4e4c" />
              <Text size="xs" fw={500} style={{ writingMode: 'vertical-rl', color: '#4f4e4c', letterSpacing: '0.3px', whiteSpace: 'nowrap', transform: 'rotate(180deg)' }}>Site Details</Text>
            </Box>
          </Box>
        ) : (
          /* Expanded: full panel with collapse button straddling right edge of card */
          <Box style={{ width: 233, minWidth: 233, flexShrink: 0, overflowY: 'auto', padding: '20px' }}>
            <Box style={{ backgroundColor: '#f7f6f4', borderRadius: 12, padding: '20px 16px', position: 'relative' }}>
              {/* Collapse button — straddles right edge of the card */}
              <Box
                onClick={() => setSiteDetailsCollapsed(true)}
                style={{
                  position: 'absolute', right: -14, top: 64,
                  width: 28, height: 28, borderRadius: '50%',
                  background: '#fff', border: '1px solid #e7e5df',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', zIndex: 10,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#006ccf'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e7e5df'; }}
              >
                <IconChevronLeft size={14} color="#4f4e4c" />
              </Box>
              <Group justify="space-between" align="center" mb={16}>
                <Text size="md" fw={500}>Site Details</Text>
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
                  { label: 'Preferred Retrieval Method', value: isInbound ? 'Offsite, Onsite, EMRR' : retrievalMethod === 'onsite' ? 'Onsite' : retrievalMethod === 'emr-remote' ? 'EMRR' : 'Offsite' },
                ].map(({ label, value }) => (
                  <Box key={label}>
                    <Text size="sm" style={{ color: '#4f4e4c' }}>{label}</Text>
                    <Text size="sm" style={{ whiteSpace: 'pre-line', lineHeight: 1.4, color: '#242423' }}>{value}</Text>
                  </Box>
                ))}
              </Stack>

              {/* Agent Notes button */}
              <Box style={{ borderTop: '1px solid #e7e5df', marginTop: 16, paddingTop: 16 }}>
                <Box
                  onClick={() => setNotesDrawerOpen(true)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: 8, background: '#fff',
                    border: '1px solid #e7e5df', cursor: 'pointer', transition: 'all 0.15s',
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
                  <Text size="md" fw={600} mb={12} style={{ color: '#242423' }}>Office Contact Result</Text>
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
                      <Box style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 10px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                        Connected
                      </Box>
                      <Group gap={4} style={{ cursor: 'pointer' }} onClick={handleChangeAnswer}>
                        <IconRotateClockwise size={13} color="#2563eb" />
                        <Text size="sm" style={{ color: '#006ccf' }}>Change Answer</Text>
                      </Group>
                    </Group>
                  ) : (
                    <Group gap={10}>
                      <Box style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 10px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                        Not Connected
                      </Box>
                      <Group gap={4} style={{ cursor: 'pointer' }} onClick={handleChangeAnswer}>
                        <IconRotateClockwise size={13} color="#2563eb" />
                        <Text size="sm" style={{ color: '#006ccf' }}>Change Answer</Text>
                      </Group>
                    </Group>
                  )}
                </Box>

                {/* Reason for No Contact — shown when Not Connected */}
                {contactResult === 'not-connected' && (
                  <>
                  <Box style={{ width: 1, alignSelf: 'stretch', backgroundColor: '#e7e5df' }} />
                  <Box>
                    <Text size="md" fw={600} mb={12} style={{ color: '#242423' }}>Reason for No Contact</Text>
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
                <Box style={{ border: '1px solid #e7e5df', borderRadius: 4, padding: '8px 16px', textAlign: 'right', backgroundColor: '#eaf5ff', flexShrink: 0 }}>
                  <Text size="xs" c="dimmed" mb={2}>Reference ID</Text>
                  <Text fw={700} size="sm">NR-718-555-12345</Text>
                </Box>
              </Flex>
            </Box>

            <Divider mb="lg" />

            <Text fw={700} size="lg" mb="md" style={{ fontSize: 18 }}>Record Request Actions</Text>

            {/* Workspace / Site History tabs */}
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
                    <Text fw={600} size="md" mb={4}>Bulk Actions</Text>
                    <Text size="sm" c="dimmed" mb={12}>
                      {isInbound
                        ? 'Use the below buttons to apply the same outcome to all record requests within the group. If more than one retrieval method is present in the group, you must filter to the same retrieval method in the table to enable the buttons.'
                        : 'Use the below buttons to apply the same outcome to all record requests within the group.'}
                    </Text>
                    <Group gap="sm" wrap="wrap">
                      {((!isInbound && isEmrRemote)
                        ? [['Update Progress', 'schedule'], ['Send All to Research', 'research'], ['Pend All', 'pend'], ['Reroute All', 'reroute']] as [string, ActionType][]
                        : [['Schedule All', 'schedule'], ['Send All to Research', 'research'], ['Pend All', 'pend'], ['Reroute All', 'reroute']] as [string, ActionType][]
                      ).map(([label, action]) => (
                        <Button
                          key={label}
                          intent={canTakeGlobalAction ? 'prominent' : 'neutral'}
                          appearance={canTakeGlobalAction ? 'outline' : 'outline'}
                          size="sm"
                          disabled={!canTakeGlobalAction}
                          onClick={() => applyGlobalAction(action)}
                        >
                          {label}
                        </Button>
                      ))}
                    </Group>
                  </Box>

                  <Divider />

                  {/* Individual Outcomes */}
                  <Box>
                    <Text fw={600} size="md" mb={4} style={{ color: '#242423' }}>Individual Outcomes</Text>
                    <Text size="sm" mb={16} style={{ color: '#333231' }}>
                      {isInbound
                        ? 'Select one to many record requests within the table to apply outcomes. You may only apply an outcome to record requests with the same retrieval method (either Onsite or Offsite). Once an outcome has been applied, you may click the undo icon button to remove the outcome, with the exception of Onsite scheduling.'
                        : isEmrRemote
                          ? 'Select one to many record requests within the table to apply outcomes. Once an outcome has been applied, you may click the undo icon button to remove the outcome.'
                          : 'Select one to many record requests within the table to apply outcomes. Once an outcome has been applied, you may click the undo icon button to remove the outcome, with the exception of scheduling.'}
                    </Text>

                    {/* Stat boxes */}
                    {(retrievalMethod === 'offsite' || retrievalMethod === 'onsite') && !isInbound ? (
                      /* Offsite/Onsite: simple two-card layout */
                      <Flex gap={12} mb="lg" wrap="wrap" align="stretch">
                        <Box style={{ border: '1px solid #a7850d', backgroundColor: '#fef7d6', borderRadius: 6, padding: '10px 14px' }}>
                          <Group gap={4} mb={6} align="center">
                            <Text style={{ fontSize: 13, color: '#a7850d' }}>&#9888;</Text>
                            <Text size="xs" fw={600} style={{ color: '#242423' }}>RRs Needing Action</Text>
                          </Group>
                          <Group gap={16}>
                            <Box>
                              <Text size="xs" style={{ color: '#6e6d6a' }}>Past Due</Text>
                              <Text size="sm" fw={700} style={{ color: '#242423' }}>{pastDueCount}</Text>
                            </Box>
                            <Box>
                              <Text size="xs" style={{ color: '#6e6d6a' }}>Unscheduled</Text>
                              <Text size="sm" fw={700} style={{ color: '#242423' }}>{needsActionCount}</Text>
                            </Box>
                            <Box>
                              <Text size="xs" style={{ color: '#6e6d6a' }}>Unblocked</Text>
                              <Text size="sm" fw={700} style={{ color: '#242423' }}>{unblockedCount}</Text>
                            </Box>
                          </Group>
                        </Box>
                        <Box style={{ border: '1px solid #e7e5df', borderRadius: 6, padding: '10px 14px' }}>
                          <Text size="xs" fw={600} mb={6} style={{ color: '#242423' }}>RRs Actioned</Text>
                          <Group gap={14}>
                            {[
                              'Scheduled', 'Progress Logged',
                              ...(retrievalMethod === 'onsite' ? ['No Availability'] : []),
                              'In Research', 'Rerouted', 'Pended',
                            ].map((s) => (
                              <Box key={s}>
                                <Text size="xs" style={{ color: '#6e6d6a' }}>{s}</Text>
                                <Text size="sm" fw={700} style={{ color: '#242423' }}>{statusCounts[s] || 0}</Text>
                              </Box>
                            ))}
                          </Group>
                        </Box>
                      </Flex>
                    ) : (
                      /* EMRR, Inbound: three-card layout */
                      <Flex gap={12} mb="lg" wrap="wrap" align="stretch">
                        {/* Needs Action */}
                        <Box style={{ border: '1px solid #a7850d', backgroundColor: '#fef7d6', borderRadius: 6, padding: '10px 14px' }}>
                          <Group gap={4} mb={6} align="center">
                            <Text style={{ fontSize: 13, color: '#a7850d' }}>&#9888;</Text>
                            <Text size="xs" fw={600} style={{ color: '#242423' }}>{isEmrRemote || isInbound ? 'RRs Needing Action' : 'Requests Needing Action'}</Text>
                          </Group>
                          <Group gap={16}>
                            <Box>
                              <Text size="xs" style={{ color: '#6e6d6a' }}>Past Due</Text>
                              <Text size="sm" fw={700} style={{ color: '#242423' }}>{pastDueCount}</Text>
                            </Box>
                            <Box>
                              <Text size="xs" style={{ color: '#6e6d6a' }}>New</Text>
                              <Text size="sm" fw={700} style={{ color: '#242423' }}>{needsActionCount}</Text>
                            </Box>
                          </Group>
                        </Box>

                        {/* Pipeline statuses */}
                        <Box style={{ border: '1px solid #e7e5df', borderRadius: 6, padding: '10px 14px' }}>
                          <Text size="xs" fw={600} mb={6} style={{ color: '#242423' }}>
                            {isEmrRemote || isInbound ? 'RRs in Credential Pipeline' : 'Scheduling Pipeline'}
                          </Text>
                          <Group gap={0} wrap="nowrap" style={{ overflowX: 'auto' }}>
                            {([
                                { label: 'Outreach In Prog', color: '#006ccf' },
                                { label: 'Credentialing In Prog', color: '#7c3aed' },
                                { label: 'Awaiting Queued', color: '#d97706' },
                                { label: 'Awaiting Assignment', color: '#059669' },
                            ]).map((s) => {
                              const fullName: Record<string, string> = {
                                'Outreach In Prog': 'Outreach In Progress',
                                'Credentialing In Prog': 'Credentialing In Progress',
                              };
                              const countKey = fullName[s.label] || s.label;
                              return (
                                <Box key={s.label} style={{ display: 'flex', alignItems: 'center' }}>
                                  <Box style={{ padding: '0 8px' }}>
                                    <Text size="xs" mb={2} style={{ color: '#6e6d6a', whiteSpace: 'nowrap' }}>{s.label}</Text>
                                    <Text size="sm" fw={700} style={{ color: '#242423' }}>{statusCounts[countKey] || 0}</Text>
                                  </Box>
                                </Box>
                              );
                            })}
                          </Group>
                        </Box>

                        {/* RRs Actioned */}
                        <Box style={{ border: '1px solid #e7e5df', borderRadius: 6, padding: '10px 14px' }}>
                          <Text size="xs" fw={600} mb={6} style={{ color: '#242423' }}>RRs Actioned</Text>
                          <Group gap={14}>
                            {[...(isInbound ? ['Scheduled', 'Progress Logged', 'No Availability'] : []), 'In Research', 'Rerouted', 'Pended'].map((s) => (
                              <Box key={s}>
                                <Text size="xs" style={{ color: '#6e6d6a' }}>{s}</Text>
                                <Text size="sm" fw={700} style={{ color: '#242423' }}>{statusCounts[s] || 0}</Text>
                              </Box>
                            ))}
                          </Group>
                        </Box>
                      </Flex>
                    )}

                    {/* Search + filters */}
                    <Box mb="md">
                      {/* Row 1: Search left, filters + reset right */}
                      <Flex justify="space-between" align="flex-start" gap={8} mb={(retrievalMethod === 'onsite' || isInbound) ? 8 : 0}>
                        <Box style={{ width: 300, flexShrink: 0 }}>
                          <Box style={{ display: 'flex', alignItems: 'center', gap: 4, border: '1px solid #8a8985', borderRadius: 6, padding: '6px 12px', paddingRight: 8, backgroundColor: '#fff' }}>
                            <input placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: 14, width: '100%', color: '#4f4e4c', background: 'transparent', fontFamily: 'DM Sans, sans-serif' }} />
                            <IconSearch size={16} color="#6e6d6a" style={{ flexShrink: 0 }} />
                          </Box>
                        </Box>
                        <Group gap={8} wrap="wrap" justify="flex-end" style={{ flex: 1 }}>
                          <FilterPill label="Project Due Date" options={['Before 4/1/2026', '4/1/2026', 'After 4/1/2026', 'Past Due']} selected={filters['Project Due Date']} onToggle={(v) => toggleFilter('Project Due Date', v)} />
                          <FilterPill label="Commitment Date" options={['Before 4/1/2026', '4/1/2026', 'After 4/1/2026', 'No Date Set']} selected={filters['Commitment Date']} onToggle={(v) => toggleFilter('Commitment Date', v)} />
                          {retrievalMethod === 'onsite' ? (
                            <FilterPill label="Outcome" options={['Scheduled', 'In Research', 'Rerouted', 'Pended', 'Progress Logged', 'No Availability']} selected={filters['Outcome']} onToggle={(v) => toggleFilter('Outcome', v)} />
                          ) : isEmrRemote ? (
                            <FilterPill label="Scheduling Status" options={['New', 'Outreach In Progress', 'Credentialing In Progress', 'Awaiting Queued', 'Awaiting Assignment', 'In Research', 'Rerouted', 'Pended']} selected={filters['Scheduling Status']} onToggle={(v) => toggleFilter('Scheduling Status', v)} />
                          ) : (
                            <FilterPill label="Scheduling Status" options={['New', 'In Progress-Unblocked', 'Scheduled', 'In Research', 'Rerouted', 'Pended', 'Progress Logged']} selected={filters['Scheduling Status']} onToggle={(v) => toggleFilter('Scheduling Status', v)} />
                          )}
                          <FilterPill label="Practitioner" options={['BARNES, TAYLOR', 'CHEN, SARAH', 'PATEL, RAJ', 'WILLIAMS, JAMES']} selected={filters['Practitioner']} onToggle={(v) => toggleFilter('Practitioner', v)} />
                          <Box onClick={resetFilters} style={{ border: '1px solid #8a8985', borderRadius: 1000, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                            <IconRefresh size={16} color="#4f4e4c" />
                          </Box>
                        </Group>
                      </Flex>
                      {/* Row 2: Additional filters, right-aligned */}
                      {(retrievalMethod === 'onsite' || isInbound) && (
                        <Group gap={8} justify="flex-end">
                          {isInbound && <FilterPill label="Retrieval Method" options={['Onsite', 'Offsite', 'EMRR']} selected={filters['Retrieval Method']} onToggle={(v) => toggleFilter('Retrieval Method', v)} />}
                          <FilterPill label="OS-Ref" options={['OS-12398-888', 'OS-12398-889', 'OS-12398-890']} selected={filters['OS-Ref']} onToggle={(v) => toggleFilter('OS-Ref', v)} />
                        </Group>
                      )}
                    </Box>

                    {/* Action bar for selected rows */}
                    {selectedRows.size > 0 && canTakeAction && (
                      <Box style={{ backgroundColor: '#f3f0ff', border: '1px solid #7c3aed', borderRadius: 6, padding: '8px 16px', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Group gap={8} align="center">
                          <IconInfoCircle size={16} color="#006ccf" />
                          <Text size="sm" fw={500} style={{ color: '#242423' }}>{selectedRows.size}/{requestRows.length} Requests Selected</Text>
                          <Text size="sm" fw={500} style={{ color: '#006ccf', cursor: 'pointer' }} onClick={() => { setSelectedRows(new Set()); setTableAction(null); }}>Cancel</Text>
                        </Group>
                        <Group gap={8} align="center">
                          <Text size="sm" fw={500} style={{ color: '#242423' }}>Action</Text>
                          <Select
                            comboboxProps={{ zIndex: 10001 }}
                            placeholder="Select"
                            data={(isEmrRemote || (isInbound && effectiveMethod === 'emr-remote')) ? [
                              { value: 'schedule', label: 'Update Progress' },
                              { value: 'research', label: 'Send to Research' },
                              { value: 'pend', label: 'Pend' },
                              { value: 'reroute', label: 'Reroute' },
                            ] : [
                              { value: 'schedule', label: 'Schedule' },
                              { value: 'research', label: 'Send to Research' },
                              { value: 'pend', label: 'Pend' },
                              { value: 'reroute', label: 'Reroute' },
                            ]}
                            value={tableAction}
                            onChange={setTableAction}
                            style={{ width: 160 }}
                            size="xs"
                          />
                          <Button
                            intent="prominent"
                            appearance="solid"
                            size="xs"
                            disabled={!tableAction}
                            onClick={() => {
                              if (!tableAction) return;
                              // Check if table has mixed retrieval methods without filter (inbound only)
                              if (isInbound && !filteredToSingleMethod) {
                                setMixedMethodError(true); return;
                              }
                              setActionScope('selected'); setActiveAction(tableAction as ActionType); setTableAction(null);
                            }}
                          >Apply</Button>
                        </Group>
                      </Box>
                    )}

                    {/* Request table */}
                    <Box style={{ overflowX: 'auto', border: '1px solid #e7e5df', borderRadius: 6 }}>
                        <Table highlightOnHover style={{ minWidth: 1500, borderCollapse: 'collapse' }}>
                          <Table.Thead>
                            <Table.Tr style={{ backgroundColor: '#f7f6f4', borderBottom: '1px solid #e7e5df' }}>
                              <Table.Th style={{ width: 40, padding: '8px' }}><MantineCheckbox size="xs" disabled={!canTakeAction} checked={selectedRows.size === unactionedRows.length && unactionedRows.length > 0} indeterminate={selectedRows.size > 0 && selectedRows.size < unactionedRows.length} onChange={toggleAll} /></Table.Th>
                              <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: '#4f4e4c' }}>Request ID</Text></Table.Th>
                              {isInbound && <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: '#4f4e4c' }}>Retrieval Method</Text></Table.Th>}
                              <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: '#4f4e4c' }}>Health Plan</Text></Table.Th>
                              <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: '#4f4e4c' }}>Member Name</Text></Table.Th>
                              <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: '#4f4e4c' }}>Member DOB</Text></Table.Th>
                              <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: '#4f4e4c' }}>SDOS</Text></Table.Th>
                              <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: '#4f4e4c' }}>Project Due Date</Text></Table.Th>
                              <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: '#4f4e4c' }}>Commitment Date</Text></Table.Th>
                              <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: '#4f4e4c' }}>Status</Text></Table.Th>
                              <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: '#4f4e4c' }}>Payment Status</Text></Table.Th>
                              {retrievalMethod === 'onsite' && <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: '#4f4e4c' }}>OS-Ref</Text></Table.Th>}
                              <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: '#4f4e4c' }}>Practitioner</Text></Table.Th>
                              <Table.Th style={{ padding: '8px', width: '160px', minWidth: '160px', maxWidth: '160px' }}><Text size="sm" fw={500} style={{ color: '#4f4e4c' }}>SLOC</Text></Table.Th>
                              <Table.Th style={{ padding: '8px', width: '160px', minWidth: '160px', maxWidth: '160px' }}><Text size="sm" fw={500} style={{ color: '#4f4e4c' }}>Site</Text></Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody style={{ opacity: canTakeAction ? 1 : 0.5, pointerEvents: canTakeAction ? 'auto' : 'none' }}>
                            {filteredRows.map((row) => {
                              const isActioned = row.status !== 'New' && row.status !== 'In Progress-Unblocked';
                              const isSelected = selectedRows.has(row.id);
                              return (
                                <Table.Tr key={row.id} style={{ borderBottom: '1px solid #e7e5df', backgroundColor: isSelected ? '#eaf5ff' : undefined }}>
                                  <Table.Td style={{ width: 40, padding: '8px' }}>
                                    {isActioned ? (
                                      <IconArrowBackUp
                                        size={16}
                                        color="#8a8985"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setRequestRows(prev => prev.map(r => r.id === row.id ? { ...r, status: 'New', commit: '—', payment: '—' } : r))}
                                      />
                                    ) : (
                                      <MantineCheckbox size="xs" disabled={!canTakeAction || (isInbound && row.rowMethod === 'EMRR')} checked={isSelected} onChange={() => toggleRow(row.id)} />
                                    )}
                                  </Table.Td>
                                  <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: '#333231' }}>{row.id}</Text></Table.Td>
                                  {isInbound && <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: '#333231' }}>{row.rowMethod}</Text></Table.Td>}
                                  <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: '#333231' }}>{row.plan}</Text></Table.Td>
                                  <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ whiteSpace: 'nowrap', color: '#333231' }}>{row.member}</Text></Table.Td>
                                  <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: '#333231' }}>{row.dob}</Text></Table.Td>
                                  <Table.Td style={{ padding: '8px' }}>
                                    <Text size="sm" style={{ color: '#333231', lineHeight: 1.4 }}>
                                      {row.sdos.split('-').map((date, i, arr) => (
                                        <span key={i} style={{ display: 'block', whiteSpace: 'nowrap' }}>
                                          {i === 0 ? `${date}–` : date}
                                        </span>
                                      ))}
                                    </Text>
                                  </Table.Td>
                                  <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: '#333231' }}>{row.due}</Text></Table.Td>
                                  <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: '#333231' }}>{row.commit}</Text></Table.Td>
                                  <Table.Td style={{ padding: '8px' }}>
                                    {row.status === 'In Progress-Unblocked' ? (
                                      <Group gap={4} align="center" wrap="nowrap">
                                        <Text size="sm" style={{ color: '#333231', whiteSpace: 'nowrap' }}>In Progress-Unblocked</Text>
                                        <Tooltip
                                          label={`Approved Amount: $${UNBLOCKED_APPROVED_AMOUNT}`}
                                          position="top"
                                          withArrow
                                          styles={{
                                            tooltip: {
                                              backgroundColor: '#242423',
                                              color: '#fff',
                                              fontSize: 13,
                                              fontWeight: 500,
                                              padding: '6px 12px',
                                              borderRadius: 1000,
                                            },
                                            arrow: { backgroundColor: '#242423' },
                                          }}
                                        >
                                          <IconInfoCircle size={15} color="#006ccf" style={{ cursor: 'default', flexShrink: 0, marginTop: 1 }} />
                                        </Tooltip>
                                      </Group>
                                    ) : (
                                      <Text size="sm" style={{ color: '#333231' }}>{row.status}</Text>
                                    )}
                                  </Table.Td>
                                  <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: '#333231' }}>{row.payment}</Text></Table.Td>
                                  {retrievalMethod === 'onsite' && <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: '#333231' }}>{row.osRef}</Text></Table.Td>}
                                  <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ whiteSpace: 'nowrap', color: '#333231' }}>{row.practitioner}</Text></Table.Td>
                                  {[row.sloc, row.site].map((addr, ci) => {
                                    const parts = addr.split(',').map(p => p.trim());
                                    let lines: string[];
                                    if (parts.length >= 4) {
                                      const stateZip = parts[3].trim().split(' ');
                                      lines = [
                                        `${parts[0]}, ${parts[1]}`,
                                        `${parts[2]}, ${stateZip[0]}`,
                                        stateZip.slice(1).join(' '),
                                      ];
                                    } else {
                                      lines = parts;
                                    }
                                    const needsTooltip = addr.length > 45;
                                    const fullAddress = lines.join('\n');
                                    const content = (
                                      <div style={{ fontSize: 14, color: '#333231', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', whiteSpace: 'pre-line' }}>
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

                    {/* Pagination */}
                    <Group justify="space-between" align="center" mt="md">
                      <Group gap="xs">
                        <Text size="xs" c="dimmed">Items per page:</Text>
                        <Box style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', border: '1px solid #e7e5df', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>
                          500 <IconChevronDown size={11} />
                        </Box>
                        <Text size="xs" c="dimmed">1–{filteredRows.length} of {filteredRows.length} items</Text>
                      </Group>
                      <Group gap="sm">
                        <Group gap={4}>
                          <Text size="xs" c="dimmed">Page</Text>
                          <Box style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', border: '1px solid #e7e5df', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>
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
                  </Box>
                </Stack>
              </Tabs.Panel>

              {/* ── SITE HISTORY TAB ── */}
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
                    <Box style={{ border: '1px solid #8a8985', borderRadius: 1000, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                      <IconRefresh size={16} color="#4f4e4c" />
                    </Box>
                  </Group>

                  <Box style={{ overflowX: 'auto' }}>
                    <Box style={{ overflow: 'hidden' }}>
                      <Table highlightOnHover style={{ minWidth: 1000, borderCollapse: 'collapse' }}>
                        <Table.Thead>
                          <Table.Tr style={{ backgroundColor: '#f7f6f4', borderBottom: '1px solid #e7e5df' }}>
                            <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: '#4f4e4c' }}>Call Outcome</Text></Table.Th>
                            <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: '#4f4e4c' }}>Agent</Text></Table.Th>
                            <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: '#4f4e4c' }}>Requests</Text></Table.Th>
                            <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: '#4f4e4c' }}>Agent Actions</Text></Table.Th>
                            <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: '#4f4e4c' }}>Site Details Updated</Text></Table.Th>
                            <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: '#4f4e4c' }}>Provider Package Status</Text></Table.Th>
                            <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: '#4f4e4c' }}>PPT</Text></Table.Th>
                            <Table.Th style={{ padding: '8px' }}><Text size="sm" fw={500} style={{ color: '#4f4e4c' }}>Time Stamp</Text></Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {CALL_HISTORY_ROWS.map((row, i) => (
                            <Table.Tr key={i} style={{ borderBottom: '1px solid #e7e5df' }}>
                              <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ whiteSpace: 'pre-line', color: '#333231' }}>{row.outcome}</Text></Table.Td>
                              <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: '#333231' }}>{row.agent}</Text></Table.Td>
                              <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: '#333231' }}>{row.requests}</Text></Table.Td>
                              <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ whiteSpace: 'pre-line', color: '#333231' }}>{row.actions}</Text></Table.Td>
                              <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: '#333231' }}>{row.siteDetails}</Text></Table.Td>
                              <Table.Td style={{ padding: '8px' }}>
                                {row.pkgGreen ? (
                                  <Text size="sm" style={{ color: '#166534', fontWeight: 500 }}>&#10003; {row.providerPkg}</Text>
                                ) : (
                                  <Text size="sm" style={{ color: '#333231' }}>{row.providerPkg}</Text>
                                )}
                              </Table.Td>
                              <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ color: '#333231' }}>{row.ppt}</Text></Table.Td>
                              <Table.Td style={{ padding: '8px' }}><Text size="sm" style={{ whiteSpace: 'nowrap', color: '#333231' }}>{row.timestamp}</Text></Table.Td>
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
                      <Box style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', border: '1px solid #e7e5df', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>
                        500 <IconChevronDown size={11} />
                      </Box>
                      <Text size="xs" c="dimmed">1–2 of 2 items</Text>
                    </Group>
                    <Group gap="sm">
                      <Group gap={4}>
                        <Text size="xs" c="dimmed">Page</Text>
                        <Box style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', border: '1px solid #e7e5df', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>
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
              background: '#fff', zIndex: 10, display: 'flex', flexDirection: 'column',
              boxShadow: notesDrawerSide === 'right' ? '-4px 0 20px rgba(0,0,0,0.12)' : '4px 0 20px rgba(0,0,0,0.12)',
              ...(notesDrawerSide === 'right' ? { borderLeft: '1px solid #e7e5df' } : { borderRight: '1px solid #e7e5df' }),
            }}
          >
            <Box style={{ padding: '16px 20px 12px', borderBottom: '1px solid #e7e5df', flexShrink: 0 }}>
              <Group justify="space-between" align="flex-start">
                <Text fw={700} size="md">Agent Notes</Text>
                <Group gap={4}>
                  <Box onClick={() => setNotesDrawerSide(s => s === 'right' ? 'left' : 'right')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 4 }}
                    title={notesDrawerSide === 'right' ? 'Move to left' : 'Move to right'}
                  >
                    <IconSwitchHorizontal size={16} color="#6b7280" />
                  </Box>
                  <Box onClick={() => setNotesDrawerOpen(false)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 4 }}>
                    <IconX size={16} color="#6b7280" />
                  </Box>
                </Group>
              </Group>
              <Text size="xs" c="dimmed" mt={8} style={{ lineHeight: 1.5 }}>
                Leave site-relevant details that are only visible internally.
              </Text>
            </Box>
            {/* Composer */}
            <Box style={{ padding: '12px 20px', borderBottom: '1px solid #e7e5df', flexShrink: 0 }}>
              <Textarea placeholder="Add a note for the next agent..." rows={2} value={drawerDraft} onChange={(e) => setDrawerDraft(e.currentTarget.value)} styles={{ input: { fontSize: 13 } }} />
              <Group justify="flex-end" gap="xs" mt="xs">
                <Button intent="prominent" appearance="solid" size="xs" onClick={() => { if (drawerDraft.trim()) { addNote(drawerDraft.trim()); setDrawerDraft(''); } }}>Save note</Button>
              </Group>
            </Box>
            {/* Notes list */}
            <ScrollArea style={{ flex: 1 }}>
              <Box style={{ padding: '0 20px' }}>
                {notes.map((note, i) => (
                  <Box key={note.id} style={{ padding: '16px 0', borderBottom: i < notes.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
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

      {/* ── Action Modals ── */}
      {activeAction === 'schedule' && (
        isEmrRemote || (isInbound && effectiveMethod === 'emr-remote')
          ? <EmrrSaveProgressModal count={actionScope === 'global' ? requestRows.length : selectedRows.size} onClose={() => { setActiveAction(null); setActionScope('selected'); }} onSubmit={(status, date, pmtReq) => applyAction('schedule', actionScope === 'global', status, date, pmtReq)} siteAccessType={siteAccessType} onSiteAccessTypeChange={setSiteAccessType} paymentInfo={paymentInfo} onPaymentInfoChange={setPaymentInfo} />
          : (retrievalMethod === 'onsite' || (isInbound && effectiveMethod === 'onsite'))
            ? <OnsiteScheduleModal count={actionScope === 'global' ? requestRows.length : selectedRows.size} onClose={() => { setActiveAction(null); setActionScope('selected'); }} onSubmit={(status, pmtReq) => applyAction('schedule', actionScope === 'global', status || 'Scheduled', '3/1/2026', pmtReq)} />
            : <ScheduleModal
                count={actionScope === 'global' ? requestRows.length : selectedRows.size}
                unblockedCount={actionScope === 'global' ? requestRows.filter(r => r.status === 'In Progress-Unblocked').length : [...selectedRows].filter(id => requestRows.find(r => r.id === id)?.status === 'In Progress-Unblocked').length}
                onClose={() => { setActiveAction(null); setActionScope('selected'); }}
                onSubmit={(date, pmtReq) => applyAction('schedule', actionScope === 'global', undefined, date, pmtReq)}
              />
      )}
      {activeAction === 'research' && (
        <ResearchModal count={actionScope === 'global' ? requestRows.length : selectedRows.size} onClose={() => { setActiveAction(null); setActionScope('selected'); }} onSubmit={() => applyAction('research', actionScope === 'global')} {...(isEmrRemote ? { siteAccessType, onSiteAccessTypeChange: setSiteAccessType } : {})} />
      )}
      {activeAction === 'pend' && (
        <PendModal count={actionScope === 'global' ? requestRows.length : selectedRows.size} onClose={() => { setActiveAction(null); setActionScope('selected'); }} onSubmit={() => applyAction('pend', actionScope === 'global')} {...(isEmrRemote ? { siteAccessType, onSiteAccessTypeChange: setSiteAccessType } : {})} />
      )}
      {activeAction === 'reroute' && (
        <RerouteModal count={actionScope === 'global' ? requestRows.length : selectedRows.size} onClose={() => { setActiveAction(null); setActionScope('selected'); }} onSubmit={() => applyAction('reroute', actionScope === 'global')} {...(isEmrRemote ? { siteAccessType, onSiteAccessTypeChange: setSiteAccessType } : {})} />
      )}
      {editSiteOpen && <EditSiteModal onClose={() => setEditSiteOpen(false)} isEmrRemote={isEmrRemote} siteAccessType={siteAccessType} onSiteAccessTypeChange={setSiteAccessType} />}

      {/* Mixed retrieval method error modal */}
      {mixedMethodError && (
        <>
          <div onClick={() => setMixedMethodError(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9998 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#fff', borderRadius: 12, zIndex: 9999, width: 460, padding: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <Group justify="space-between" align="flex-start" mb={12}>
              <Group gap={8} align="center">
                <Text style={{ fontSize: 18, color: '#a7850d' }}>&#9888;</Text>
                <Text fw={600} size="lg">Multiple Retrieval Methods Selected</Text>
              </Group>
              <Text style={{ cursor: 'pointer', color: '#6b7280', fontSize: 20, lineHeight: 1 }} onClick={() => setMixedMethodError(false)}>×</Text>
            </Group>
            <Text size="sm" style={{ color: '#6e6d6a', lineHeight: 1.6 }}>
              You may only apply an outcome to record requests with the same retrieval method. Utilize the "Retrieval Method" filter to display a single method.
            </Text>
          </div>
        </>
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
          background: '#fff', border: '1px solid #e7e5df', borderRadius: 8,
          padding: '10px 16px', zIndex: 10000,
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)', width: 420,
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="10" cy="10" r="10" fill="none" stroke="#059669" strokeWidth="1.5"/>
            <path d="M6 10.5l2.5 2.5L14 7.5" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <Text size="sm" style={{ flex: 1, color: '#059669', fontWeight: 500 }}>{toast}</Text>
          <Text style={{ cursor: 'pointer', color: '#9ca3af', fontSize: 18, lineHeight: 1 }} onClick={() => setToast(null)}>×</Text>
        </div>
      )}
    </Box>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function NexReachPrototype() {
  const [view, setView] = useState<ViewState>('landing');
  const [phoneValue, setPhoneValue] = useState('');
  const [callType, setCallType] = useState('outbound');
  const [retrieval, setRetrieval] = useState('offsite');

  const handleSearch = () => {
    if (phoneValue.trim()) setView('workspace');
  };

  if (view === 'workspace') {
    return (
      <WorkspaceScreen
        onBackToSearch={() => { setView('landing'); setPhoneValue(''); }}
        retrievalMethod={callType === 'inbound' ? 'inbound' : retrieval}
      />
    );
  }

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
