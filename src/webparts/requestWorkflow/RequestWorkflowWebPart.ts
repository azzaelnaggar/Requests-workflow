// src/webparts/requestWorkflow/RequestWorkflowWebPart.ts

import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import RequestWorkflow from "./components/RequestWorkflow";
import { IRequestWorkflowProps } from "./components/IRequestWorkflowProps";

export interface IRequestWorkflowWebPartProps {
  listName: string;
}

export default class RequestWorkflowWebPart extends BaseClientSideWebPart<IRequestWorkflowWebPartProps> {
  protected async onInit(): Promise<void> {
    await super.onInit();
    spfi().using(SPFx(this.context));
  }
  public render(): void {
    const element: React.ReactElement<IRequestWorkflowProps> =
      React.createElement(RequestWorkflow, {
        context: this.context,
        listName: this.properties.listName || "Requests",
      });
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: "Request Workflow Settings" },
          groups: [
            {
              groupName: "Configuration",
              groupFields: [
                PropertyPaneTextField("listName", {
                  label: "SharePoint List Name",
                  value: "Requests",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
