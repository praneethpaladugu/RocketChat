import { TAPi18n, TAPi18next } from 'meteor/rocketchat:tap-i18n';
import React, { FC, useMemo } from 'react';

import { TranslationContext } from '../contexts/TranslationContext';
import { useReactiveValue } from '../hooks/useReactiveValue';

const createTranslateFunction = (language: any) => {
	const translate = (key: string, ...replaces: unknown[]) => {
		if (typeof replaces[0] === 'object') {
			const [options, lng = language] = replaces;
			return TAPi18next.t(key, {
				ns: 'project',
				lng,
				...options,
			});
		}

		if (replaces.length === 0) {
			return TAPi18next.t(key, { ns: 'project', lng: language });
		}

		return TAPi18next.t(key, {
			postProcess: 'sprintf',
			sprintf: replaces,
			ns: 'project',
			lng: language,
		});
	};

	translate.has = (key: string, { lng = language, ...options } = {}) => !!key && TAPi18next.exists(key, { ns: 'project', lng, ...options });

	return translate;
};

const getLanguages = () => {
	const result = (Object.entries(TAPi18n.getLanguages()) as [string, { name: string; en: string }][])
		.map(([key, language]) => ({ ...language, key: key.toLowerCase() }))
		.sort((a, b) => a.key.localeCompare(b.key));

	result.unshift({
		name: 'Default',
		en: 'Default',
		key: '',
	});

	return result;
};

const getLanguage = () => TAPi18n.getLanguage();

const loadLanguage = (language: string) => TAPi18n._loadLanguage(language);

const TranslationProvider: FC = function TranslationProvider({ children }) {
	const languages = useReactiveValue(getLanguages);
	const language = useReactiveValue(getLanguage);

	const translate = useMemo(() => createTranslateFunction(language), [language]);

	const value = useMemo(
		() => ({
			languages,
			language,
			loadLanguage,
			translate,
		}),
		[languages, language, translate],
	);

	return <TranslationContext.Provider children={children} value={value} />;
};

export default TranslationProvider;