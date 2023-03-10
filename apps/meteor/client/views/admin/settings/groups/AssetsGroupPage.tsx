import { ISetting } from '@rocket.chat/core-typings';
import React, { memo, ReactElement } from 'react';

import { useEditableSettingsGroupSections } from '../../EditableSettingsContext';
import GroupPage from '../GroupPage';
import Section from '../Section';

type AssetsGroupPageProps = ISetting;

function AssetsGroupPage({ _id, ...group }: AssetsGroupPageProps): ReactElement {
	const sections = useEditableSettingsGroupSections(_id);
	const solo = sections.length === 1;

	return (
		<GroupPage _id={_id} {...group}>
			{sections.map((sectionName) => (
				<Section key={sectionName} groupId={_id} hasReset={false} sectionName={sectionName} solo={solo} />
			))}
		</GroupPage>
	);
}

export default memo(AssetsGroupPage);
