import { AuthenticationWebcomp } from './../src/authentication-webcomp';
import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
// import { AuthenticationWebcomp } from '../src/authentication-webcomp.js';
//import '../src/';

/**
 * Test :
 * initial state
 *  - authenticated
 *    jwt from location
 *    jwt from session storage.
 *  - unauthenticated 
 *    - no jwt
 *    - invalid jwt
 * change state
 *  - successfull authentication
 *  - failed authentication
 *  - logout
 *  
 * 
 */

describe('AuthenticationWebcomp', () => {


  it('passes the a11y audit', async () => {
    const el = await fixture<AuthenticationWebcomp>(html`<authentication-webcomp></authentication-webcomp>`);
    console.log('el', el);
    expect(el.title).to.equal('Hey there');
    await expect(el).shadowDom.to.be.accessible();
  });
});
