export type User = {
	id: number;
	name: string;
	isAdmin?: boolean;
};

// prototype pages
export type Prototype = {
	id: number;
	name: string;
};

// products of prototype pages
export type Product = {
	id: number;
	name: string;
	price: number;
	prototypeId: number;
};
