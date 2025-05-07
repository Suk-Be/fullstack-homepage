import { db } from './db';

export const handlers = [
    // rest Generates REST API request handlers (get, post, delete).
    /* e.g. 
  http.get('/products', () => {
		return HttpResponse.json(productsData);
	}),
	http.get('/products/:id', ({ params }) => {
		const id = params.id as string;
		const product = productsData.find((product) => product.id === parseInt(id));

		if (!product) return new HttpResponse(null, { status: 404 });

		return HttpResponse.json(product);
	})
  */
    ...db.product.toHandlers('rest'),
    ...db.category.toHandlers('rest'),
];
