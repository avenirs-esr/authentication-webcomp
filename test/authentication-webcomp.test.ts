import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { AuthenticationWebcomp } from '../src/authentication-webcomp.js';
import '../src/authentication-webcomp_ts';

describe('AuthenticationWebcomp', () => {


  it('passes the a11y audit', async () => {
    const el = await fixture<AuthenticationWebcomp>(html`<authentication-webcomp></authentication-webcomp>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
