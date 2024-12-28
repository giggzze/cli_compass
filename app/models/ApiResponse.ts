// interfaces for API responses
export interface IApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}
