function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Copyright 2017 Red Hat, Inc. and/or its affiliates
 * and other contributors as indicated by the @author tags.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export class KeycloakService {
  constructor(keycloak) {
    _defineProperty(this, "keycloakAuth", void 0);

    this.keycloakAuth = keycloak;
    this.userInfo = {};
    this.doGet("/").then((response) => {
      this.userInfo = response.data;
    });
  }

  authenticated() {
    return this.keycloakAuth.authenticated ? this.keycloakAuth.authenticated : false;
  }

  audiencePresent() {
    if (this.keycloakAuth.tokenParsed) {
      const audience = this.keycloakAuth.tokenParsed['aud'];
      return audience === 'account' || Array.isArray(audience) && audience.indexOf('account') >= 0;
    }

    return false;
  }

  login(options) {
    this.keycloakAuth.login(options);
  }

  logout(redirectUri = baseUrl) {
    this.keycloakAuth.logout({
      redirectUri: redirectUri
    });
  }

  account() {
    this.keycloakAuth.accountManagement();
  }

  authServerUrl() {
    const authServerUrl = this.keycloakAuth.authServerUrl;
    return authServerUrl.charAt(authServerUrl.length - 1) === '/' ? authServerUrl : authServerUrl + '/';
  }

  realm() {
    return this.keycloakAuth.realm;
  }

  async doGet(endpoint, config) {
    return this.doRequest(endpoint, { ...config,
      method: 'get'
    });
  }

  async doPost(endpoint, body, config) {
    return this.doRequest(endpoint, { ...config,
      body: JSON.stringify(body),
      method: 'post'
    });
  }

  async doRequest(endpoint, config) {
    const response = await fetch(this.makeUrl(endpoint, config).toString(), await this.makeConfig(config));

    try {
      response.data = await response.json();
    } catch (e) {} // ignore.  Might be empty


    if (!response.ok) {
      this.handleError(response);
      throw new AccountServiceError(response);
    }

    return response;
  }

  makeUrl(endpoint, config) {
    if (endpoint.startsWith('http')) return new URL(endpoint);
    const accountUrl = this.authServerUrl() + 'realms/' + this.realm() + '/account'
    const url = new URL(accountUrl + endpoint); // add request params

    if (config && config.hasOwnProperty('params')) {
      const params = config.params || {};
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }

    return url;
  }

  makeConfig(config = {}) {
    return new Promise(resolve => {
      this.getToken().then(token => {
        resolve({ ...config,
          headers: {
            'Content-Type': 'application/json',
            ...config.headers,
            Authorization: 'Bearer ' + token
          }
        });
      }).catch(() => {
        this.login();
      });
    });
  }

  getToken() {
    return new Promise((resolve, reject) => {
      if (this.keycloakAuth.token) {
        this.keycloakAuth.updateToken(5).success(() => {
          resolve(this.keycloakAuth.token);
        }).error(() => {
          reject('Failed to refresh token');
        });
      } else {
        reject('Not logged in');
      }
    });
  }

}
//# sourceMappingURL=keycloak.service.js.map
