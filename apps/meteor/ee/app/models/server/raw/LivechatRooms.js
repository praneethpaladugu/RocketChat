import { registerModel } from '@rocket.chat/models';

import { LivechatRoomsRaw } from '../../../../../server/models/raw/LivechatRooms';
import { queriesLogger } from '../../../livechat-enterprise/server/lib/logger';
import { addQueryRestrictionsToRoomsModel } from '../../../livechat-enterprise/server/lib/query.helper';
import { overwriteClassOnLicense } from '../../../license/server';
import { db } from '../../../../../server/database/utils';
import { trashCollection } from '../../../../../server/database/trash';

const applyRestrictions = (method) =>
	function (originalFn, originalQuery, ...args) {
		const query = addQueryRestrictionsToRoomsModel(originalQuery);
		queriesLogger.debug({ msg: `LivechatRoomsRaw.${method}`, query });
		return originalFn.call(this, query, ...args);
	};

overwriteClassOnLicense('livechat-enterprise', LivechatRoomsRaw, {
	find: applyRestrictions('find'),
	update: applyRestrictions('update'),
	remove: applyRestrictions('remove'),
	updateDepartmentAncestorsById(originalFn, _id, departmentAncestors) {
		const query = {
			_id,
		};
		const update = departmentAncestors ? { $set: { departmentAncestors } } : { $unset: { departmentAncestors: 1 } };
		return this.update(query, update);
	},
});

registerModel('ILivechatRoomsModel', new LivechatRoomsRaw(db, trashCollection));
