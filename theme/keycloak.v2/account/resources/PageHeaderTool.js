function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

import * as React from "../../common/keycloak/web_modules/react.js";
import { PageHeaderTools } from "../../common/keycloak/web_modules/@patternfly/react-core.js";
import { ReferrerLink } from "./widgets/ReferrerLink.js";
import { LogoutButton } from "./widgets/Logout.js";
export class PageHeaderTool extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "hasReferrer", typeof referrerName !== "undefined");
  }

  updateLocale(newLocale) {
    if (this.props.context) {
      this.props.context.doPost("/", {
        attributes: {
          locale: [newLocale]
        }
      }).then(() => {
          window.location.reload();
      });
    }
  }

  componentDidMount() {
    // trigger for update
    this.interval = setInterval(() => {this.setState({});}, 1000);
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  renderUserMenu() {
    const that = this;
    const locales = window.availableLocales || [];
    const props = this.props || {};
    const context = this.props.context || {};
    const userInfo = context.userInfo || {};

    if (userInfo.username) clearInterval(this.interval);

    return React.createElement(
      "div",
      {
        className: 'react-list-root'
      },
      React.createElement(
        "div",
        {
          className: "pf-c-button pf-m-primary react-list-user-info"
        },
        React.createElement("img", {
          src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktcGVyc29uIiB2aWV3Qm94PSIwIDAgMTYgMTYiPgogIDxwYXRoIGQ9Ik04IDhhMyAzIDAgMSAwIDAtNiAzIDMgMCAwIDAgMCA2em0yLTNhMiAyIDAgMSAxLTQgMCAyIDIgMCAwIDEgNCAwem00IDhjMCAxLTEgMS0xIDFIM3MtMSAwLTEtMSAxLTQgNi00IDYgMyA2IDR6bS0xLS4wMDRjLS4wMDEtLjI0Ni0uMTU0LS45ODYtLjgzMi0xLjY2NEMxMS41MTYgMTAuNjggMTAuMjg5IDEwIDggMTBjLTIuMjkgMC0zLjUxNi42OC00LjE2OCAxLjMzMi0uNjc4LjY3OC0uODMgMS40MTgtLjgzMiAxLjY2NGgxMHoiLz4KPC9zdmc+",
          className: "",
        }),
        userInfo.username || ""
      ),
      React.createElement(
        "div",
        { className: "react-list" },
        window.features.isInternationalizationEnabled
          ? React.createElement(
              "div",
              {
                className: 'react-list-locales'
              },
              locales.map((item) => {
                return React.createElement(
                  "span",
                  {
                    className: "pf-c-button pf-m-primary",
                    onClick() {
                      that.updateLocale(item.locale);
                    },
                  },
                  item.label
                );
              })
            )
          : null,
        React.createElement(LogoutButton, null)
      )
    );
  }

  render() {
    return /*#__PURE__*/ React.createElement(
      PageHeaderTools,
      null,
      this.hasReferrer &&
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "pf-c-page__header-tools-group",
          },
          /*#__PURE__*/ React.createElement(ReferrerLink, null)
        ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "pf-c-page__header-tools-group",
        },
        this.renderUserMenu()
      )
    );
  }
}
//# sourceMappingURL=PageHeaderTool.js.map
