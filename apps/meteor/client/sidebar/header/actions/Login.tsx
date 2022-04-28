import { Sidebar } from '@rocket.chat/fuselage';
import React, { ComponentProps } from 'react';

import { useSessionDispatch } from '../../../contexts/SessionContext';
import { useTranslation } from '../../../contexts/TranslationContext';

const Login = (props: ComponentProps<typeof Sidebar.TopBar.Action>) => {
	const setForceLogin = useSessionDispatch('forceLogin');
	const t = useTranslation();

	return (
		<Sidebar.TopBar.Action
			{...props}
			primary
			ghost={false}
			icon='login'
			title={t('Sign_in_to_start_talking')}
			onClick={() => setForceLogin(true)}
		/>
	);
};

export default Login;