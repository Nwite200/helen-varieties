import { describe, it, expect } from 'vitest';
import { matchRoutes, parsePath } from 'react-router-dom';
import { invoicePath } from './lib/invoice';

// Order numbers look like "#HV123456". An unencoded "#" starts a URL fragment, which
// used to make the "View & Print Receipt" link open /invoice/ (no order) = blank page.
const routes = [{ path: '/invoice/:orderNumber' }];

describe('receipt link', () => {
  it('encodes the # so the order number stays in the path', () => {
    expect(invoicePath('#HV123456')).toBe('/invoice/%23HV123456');
  });

  it('matches the invoice route and decodes back to the order number', () => {
    const { pathname } = parsePath(invoicePath('#HV123456'));
    const match = matchRoutes(routes, { pathname: pathname || '/' });
    expect(match).not.toBeNull();
    expect(match![0].params.orderNumber).toBe('#HV123456');
  });

  it('documents the old bug: an unencoded # loses the order number', () => {
    const { pathname, hash } = parsePath('/invoice/#HV123456');
    expect(hash).toBe('#HV123456');
    expect(matchRoutes(routes, { pathname: pathname || '/' })).toBeNull();
  });
});
