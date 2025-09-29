import ErrorMessages from '@/data/ErrorMessages';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';
import { navigateTo } from './testRenderUtils';

/**
 * Asserts that specific error messages for a given form type (SignUp or SignIn)
 * are rendered in the document.
 *
 * @template T - Either 'SignUp' or 'SignIn'
 * @param {T} formType - The form section to check error messages for (e.g., 'SignUp')
 * @param {Array<keyof typeof ErrorMessages[T]>} fields - The fields whose error messages should be present
 *
 * @example
 * expectErrorMessages('SignUp', ['email', 'password']);
 */
const expectErrorMessages = <T extends 'SignUp' | 'SignIn'>(
    formType: T,
    fields: (keyof (typeof ErrorMessages)[T])[],
) => {
    fields.forEach((field) => {
        expect(screen.getByText(ErrorMessages[formType][field] as string)).toBeInTheDocument();
    });
};

/**
 * Asserts that specific error messages for a given form type (SignUp or SignIn)
 * are **not** rendered in the document.
 *
 * @template T - Either 'SignUp' or 'SignIn'
 * @param {T} formType - The form section to check error messages for (e.g., 'SignUp')
 * @param {Array<keyof typeof ErrorMessages[T]>} fields - The fields whose error messages should not be present
 *
 * @example
 * expectNoErrorMessages('SignIn', ['email', 'password']);
 */
const expectNoErrorMessages = <T extends 'SignUp' | 'SignIn'>(
    formType: T,
    fields: (keyof (typeof ErrorMessages)[T])[],
) => {
    fields.forEach((field) => {
        expect(
            screen.queryByText(ErrorMessages[formType][field] as string),
        ).not.toBeInTheDocument();
    });
};

/**
 * renders a component for testing
 * the componont appears on click
 *
 * @urlToRender - render the url
 * @ctaHandler - link or button
 * @linkName - name of the link or button
 *
 * @example renders hp, gets 'registrieren' link and clicks registrieren link
 * await switchToComponentHelper({ urlToRender: '/', ctaHandler: 'link', linkName: /registrieren/i });
 */
const switchToComponentHelper = async ({
    urlToRender = '/',
    ctaHandler = 'link',
    linkName,
}: {
    ctaHandler?: 'link' | 'button';
    urlToRender?: string;
    linkName: string | RegExp;
}) => {
    navigateTo({ route: urlToRender, preloadedState: {} });
    const linkSwitchingComponent = screen.getByRole(ctaHandler, { name: linkName });
    const user = userEvent.setup();
    await user.click(linkSwitchingComponent);
};

export { expectErrorMessages, expectNoErrorMessages, switchToComponentHelper };
