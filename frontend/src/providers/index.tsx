import { PropsWithChildren } from 'react';
import GlobalStylesProvider from './GlobalStylesProvider';
import ReactQueryProvider from './ReactQueryProvider';

const Providers = ({ children }: PropsWithChildren) => {
	return (
		<>
			<ReactQueryProvider>
				<GlobalStylesProvider />
				{children}
			</ReactQueryProvider>
		</>
	);
};

export default Providers;
