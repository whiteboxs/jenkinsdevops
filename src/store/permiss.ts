import { defineStore } from 'pinia';

interface ObjectList {
	[key: number]: string[];
}

export const usePermissStore = defineStore('permiss', {
	state: () => {
		const keys = localStorage.getItem('ms_keys');
		return {
			key: keys ? JSON.parse(keys) : <string[]>[],
			defaultList: <ObjectList>{
				//admin: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'],
				1: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14','15', '16','17','18','19','20','21','22','23'],
				2: ['1', '2', '3', '11', '13', '14','15','17','18','19']
			}
		};
	},
	actions: {
		setRolePermissions(roleId: number, permissions: string[]) {
			this.defaultList[roleId] = permissions;
		  },
		getRolePermissions(roleId: number): string[] {
			return this.defaultList[roleId] || [];
		  },
		handleSet(val: string[]) {
			this.key = val;
		}
	}
});
