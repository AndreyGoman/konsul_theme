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

/*
 * Copyright 2018 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as React from "../../../../common/keycloak/web_modules/react.js";
import {
  DataList,
  DataListItem,
  DataListItemRow,
  DataListCell,
  DataListToggle,
  DataListContent,
  DataListItemCells,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Grid,
  GridItem,
  Button,
  PageSection,
  PageSectionVariants,
  Stack,
} from "../../../../common/keycloak/web_modules/@patternfly/react-core.js";
import {
  InfoAltIcon,
  CheckIcon,
  ExternalLinkAltIcon,
} from "../../../../common/keycloak/web_modules/@patternfly/react-icons.js";
import { ContentPage } from "../ContentPage.js";
import { ContinueCancelModal } from "../../widgets/ContinueCancelModal.js";
import { AccountServiceContext } from "../../account-service/AccountServiceContext.js";
import { Msg } from "../../widgets/Msg.js";
export class ApplicationsPage extends React.Component {
  constructor(props, context) {
    super(props);

    _defineProperty(this, "context", void 0);

    _defineProperty(this, "removeConsent", (clientId) => {
      this.context
        .doDelete("/applications/" + clientId + "/consent")
        .then(() => {
          this.fetchApplications();
        });
    });

    _defineProperty(this, "onToggle", (row) => {
      const newIsRowOpen = this.state.isRowOpen;
      newIsRowOpen[row] = !newIsRowOpen[row];
      this.setState({
        isRowOpen: newIsRowOpen,
      });
    });

    this.context = context;
    this.state = {
      isRowOpen: [],
      applications: [],
    };
    this.fetchApplications();
  }

  fetchApplications() {
    this.context.doGet("/applications").then((response) => {
      const applications = response.data || [];
      this.setState({
        isRowOpen: new Array(applications.length).fill(false),
        applications: applications.filter(function(application) {
          const clientId = application.clientId;
          return clientId && clientId.startsWith("sp") && clientId.split('sp').length == 2;
        }).sort(function (a, b) {
          const keyA = a.clientId.split('sp');
          const keyB = b.clientId.split('sp');
          if (
            keyA.length == 2 &&
            keyB.length == 2 &&
            Number(keyA[1]) &&
            Number(keyB[1])
          ) {
            return Number(keyA[1]) - Number(keyB[1])
          } else if (keyA.length !== 2 || !Number(keyA[1])) {
            return 1
          } else if (keyB.length !== 2 || !Number(keyB[1])) {
            return -1;
          }
          return 0;
        }),
      });
    });
  }

  elementId(item, application) {
    return `application-${item}-${application.clientId}`;
  }

  getApplicationImgUrl(application) {
    let imageName = application.clientId;
    if (imageName && imageName.startsWith("sp") && imageName.split("sp").length == 2) {
      return window.resourceUrl + "/public/" + imageName + ".svg";
    }
    return window.resourceUrl + "/public/default-application-logo.svg";
  }

  render() {
    return /*#__PURE__*/ React.createElement(
      ContentPage,
      {
        title: Msg.localize("applicationsPageTitle"),
      },
      /*#__PURE__*/ React.createElement(
        PageSection,
        {
          isFilled: true,
          variant: PageSectionVariants.light,
        },
        React.createElement(
          "div",
          {
            className: "pf-l-gallery pf-m-gutter applications-page-gallery",
          },
          this.state.applications.map((application, appIndex) => {
            return React.createElement(
              "div",
              {
                className:
                  "pf-l-gallery__item" +
                  (application.description ? " with-description" : ""),
                key: "application" + appIndex,
                onClick: () =>
                  window.open(application.effectiveUrl || application.rootUrl),
              },
              React.createElement(
                "div",
                {
                  className: "pf-c-card pf-m-full-height",
                },
                React.createElement(
                  "div",
                  {},
                  React.createElement("img", {
                    src: this.getApplicationImgUrl(application),
                    className: "application-image",
                  }),
                  React.createElement(
                    "div",
                    {
                      className: "pf-c-card__title pf-c-content",
                    },
                    React.createElement(
                      "h2",
                      {
                        className:
                          "pf-u-display-flex pf-u-w-100 pf-u-flex-direction-column",
                      },
                      (application.clientName &&
                        Msg.localize(application.clientName)) ||
                        application.clientId
                    )
                  ),
                  React.createElement(
                    "div",
                    {
                      className: "pf-c-card__body",
                    },
                    React.createElement(
                      "div",
                      { className: "pf-u-mb-md application-description" },
                      application.description &&
                        Msg.localize(application.description)
                    )
                  )
                )
              )
            );
          })
        )
      )
    );
  }
}

_defineProperty(ApplicationsPage, "contextType", AccountServiceContext);
//# sourceMappingURL=ApplicationsPage.js.map
