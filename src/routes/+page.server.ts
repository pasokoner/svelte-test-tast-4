import type { User } from "$lib/typings.js";

export const load = async ({ fetch }) => {
	const fetchUsers = async (limit: number): Promise<User[]> => {
		const response = await fetch(`https://randomuser.me/api/?results=${limit}`);
		const data: { results: User[] } = await response.json();
		return data.results;
	};

	return {
		users: fetchUsers(100)
	};
};
