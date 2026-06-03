import '@datavant/dart/styles.css';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mantine/core';
import {
  DatavantProvider,
  SideNav,
  NavItem,
  SearchIcon,
  FolderIcon,
  FileCabinetIcon,
  LockIcon,
  HelpIcon,
  PlusIcon,
  PendingActionsIcon,
  PaperIcon,
} from '@datavant/dart';
import { ProjectDashboard } from './pages/ProjectDashboard';
import { NexReachNotes } from './pages/NexReachNotes';
import { NexReachGPBlocked } from './pages/NexReachGPBlocked';
import { NexReachPrototype } from './pages/NexReachPrototype';
import { NexReachV2 } from './pages/NexReachV2';
import { NexReachV25 } from './pages/NexReachV25';
import { CreateStudy } from './pages/CreateStudy';
import { HEORDataDiscovery } from './pages/HEORDataDiscovery';
import { HEORContracting } from './pages/HEORContracting';
import { HEORDataCombination } from './pages/HEORDataCombination';
import { HEORPrivacy } from './pages/HEORPrivacy';
import { HEORAutomaticInsights } from './pages/HEORAutomaticInsights';
import { HEOREvidenceGeneration } from './pages/HEOREvidenceGeneration';
import { OrganizationSettings } from './pages/OrganizationSettings';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleProjectClick = (projectId: string) => {
    if (projectId === 'heor') {
      navigate('/heor/discovery');
    } else if (projectId === 'gps') {
      // Will add GPS flow later
      console.log('GPS project clicked - not yet implemented');
    }
  };

  const isNexReachPage = location.pathname === '/nexreach-notes' || location.pathname === '/nexreach-gp-blocked' || location.pathname === '/nexreach-v2' || location.pathname.startsWith('/nexreach-v2-5') || location.pathname.startsWith('/nexreach-v3');

  return (
    <DatavantProvider environment="staging">
      {isNexReachPage ? (
        <Routes>
          <Route path="/nexreach-notes" element={<NexReachNotes />} />
          <Route path="/nexreach-gp-blocked" element={<NexReachGPBlocked />} />
          <Route path="/nexreach-v2" element={<NexReachV2 />} />
          <Route path="/nexreach-v2-5/*" element={<NexReachV25 />} />
          <Route path="/nexreach-v3/*" element={<NexReachPrototype />} />
        </Routes>
      ) : (
        <Box style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
          <SideNav
            topSections={[
              {
                children: (
                  <NavItem
                    label="Dashboard"
                    leftSection={<SearchIcon />}
                    active={location.pathname === '/'}
                    onClick={() => navigate('/')}
                  />
                ),
              },
              {
                label: 'PLATFORM',
                children: [
                  <NavItem
                    label="My Studies"
                    leftSection={<FolderIcon />}
                    key="studies"
                    active={location.pathname === '/my-studies'}
                    onClick={() => navigate('/my-studies')}
                  />,
                  <NavItem
                    label="Create New Study"
                    leftSection={<PlusIcon />}
                    key="create-study"
                    active={location.pathname === '/create-study'}
                    onClick={() => navigate('/create-study')}
                  />,
                  <NavItem
                    label="Data Sources"
                    leftSection={<FileCabinetIcon />}
                    key="data-sources"
                    active={location.pathname === '/data-sources'}
                    onClick={() => navigate('/data-sources')}
                  />,
                  <NavItem
                    label="Privacy & Compliance"
                    leftSection={<LockIcon />}
                    key="privacy"
                    active={location.pathname === '/privacy'}
                    onClick={() => navigate('/privacy')}
                  />,
                  <NavItem
                    label="NexReach Notes"
                    leftSection={<PaperIcon />}
                    key="nexreach-notes"
                    active={location.pathname === '/nexreach-notes'}
                    onClick={() => navigate('/nexreach-notes')}
                  />,
                  <NavItem
                    label="NexReach GP Blocked"
                    leftSection={<LockIcon />}
                    key="nexreach-gp-blocked"
                    active={location.pathname === '/nexreach-gp-blocked'}
                    onClick={() => navigate('/nexreach-gp-blocked')}
                  />,
                ],
              },
            ]}
            bottomSections={[
              {
                children: [
                  <NavItem
                    label="Settings"
                    leftSection={<PendingActionsIcon />}
                    key="settings"
                    active={location.pathname === '/settings'}
                    onClick={() => navigate('/settings')}
                  />,
                  <NavItem label="Help & Support" leftSection={<HelpIcon />} key="help" />,
                ],
              },
            ]}
            userNavItemProps={{
              isExpanded: true,
              username: 'Vinay Mehta',
              email: 'vinay.mehta@lilly.com',
              initials: 'VM',
              onClick: () => console.log('User menu clicked'),
            }}
          />

          <Box
            style={{
              flex: 1,
              height: '100vh',
              overflow: 'auto',
              backgroundColor: 'var(--mantine-color-gray-0)',
            }}
          >
            <Routes>
              <Route path="/" element={<ProjectDashboard onProjectClick={handleProjectClick} />} />
              <Route path="/create-study" element={<CreateStudy />} />
              <Route path="/heor/discovery" element={<HEORDataDiscovery onContinue={() => navigate('/heor/contracting')} />} />
              <Route path="/heor/contracting" element={<HEORContracting onContinue={() => navigate('/heor/data-combination')} />} />
              <Route path="/heor/data-combination" element={<HEORDataCombination onContinue={() => navigate('/heor/privacy')} />} />
              <Route path="/heor/privacy" element={<HEORPrivacy onContinue={() => navigate('/heor/insights')} />} />
              <Route path="/heor/insights" element={<HEORAutomaticInsights onContinue={() => navigate('/heor/evidence')} />} />
              <Route path="/heor/evidence" element={<HEOREvidenceGeneration onContinue={() => navigate('/')} />} />
              <Route path="/settings" element={<OrganizationSettings />} />
            </Routes>
          </Box>
        </Box>
      )}
    </DatavantProvider>
  );
}

export default App;
