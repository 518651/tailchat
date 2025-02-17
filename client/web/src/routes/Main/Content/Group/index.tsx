import { LoadingSpinner } from '@/components/LoadingSpinner';
import { SplitPanel } from '@/components/SplitPanel';
import { GroupIdContextProvider } from '@/context/GroupIdContext';
import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { isValidStr, useGroupInfo } from 'tailchat-shared';
import { PageContent } from '../PageContent';
import { GroupPanelRender, GroupPanelRoute } from './Panel';
import { GroupPanelRedirect } from './PanelRedirect';
import { Sidebar } from './Sidebar';

export const Group: React.FC = React.memo(() => {
  const { groupId = '' } = useParams<{
    groupId: string;
  }>();
  const groupInfo = useGroupInfo(groupId);

  if (!groupInfo) {
    return <LoadingSpinner />;
  }

  const pinnedPanelId = groupInfo.pinnedPanelId;

  const routeMatch = (
    <Routes>
      <Route path="/:panelId" element={<GroupPanelRoute />} />
      <Route path="/" element={<GroupPanelRedirect />} />
    </Routes>
  );

  return (
    <GroupIdContextProvider value={groupId}>
      <PageContent data-tc-role="content-group" sidebar={<Sidebar />}>
        {isValidStr(pinnedPanelId) ? (
          <SplitPanel className="flex-auto">
            <div>{routeMatch}</div>
            <div>
              <GroupPanelRender groupId={groupId} panelId={pinnedPanelId} />
            </div>
          </SplitPanel>
        ) : (
          routeMatch
        )}
      </PageContent>
    </GroupIdContextProvider>
  );
});
Group.displayName = 'Group';
