import * as React from "react";
import { IRequestWorkflowProps } from "./IRequestWorkflowProps";
import { spfi, SPFx, SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { MessageBarType } from "@fluentui/react";
import { RoleSelector } from "./RoleSelector";
import { RequesterView } from "./RequesterView";
import { HandlerView } from "./HandlerView";
import { IRequest } from "./IRequest";

//// These are the variables the component keeps internally and updates
//  when the user interacts with the UI

interface IState {
  role: string;
  title: string;
  details: string;
  requests: IRequest[];
  loading: boolean;
  message: string;
  messageType: MessageBarType;
  showDialog: boolean;
  editItem: IRequest | null;
  editTitle: string;
  editDetails: string;
  action: string;
}

export default class RequestWorkflow extends React.Component<
  IRequestWorkflowProps,
  IState
> {
  private sp: SPFI; //// SPFI object from PnPJS to talk to SharePoint
  //constructor sets up everything the component needs to work
  constructor(props: IRequestWorkflowProps) {
    super(props);
    this.sp = spfi().using(SPFx(this.props.context)); //to call SharePoint lists/items
    // initial state
    this.state = {
      role: "",
      title: "",
      details: "",
      requests: [],
      loading: false,
      message: "",
      messageType: MessageBarType.info,
      showDialog: false,
      editItem: null,
      editTitle: "",
      editDetails: "",
      action: "",
    };
  }

  //componentDidUpdate ==> Lifecycle Method in React (Class Component)
  //React calls this function automatically after state changes.
  public componentDidUpdate(
    _prevProps: IRequestWorkflowProps,
    prevState: IState,
  ): void {
    // Check if the role has changed AND the new role is not empty
    if (prevState.role !== this.state.role && this.state.role) {
      this.refreshData();
    }
  }

  // Reload requests based on the current user role
  // Handler sees only pending tasks -- Requester sees all their requests
  private refreshData = (keepMessage: boolean = false): void => {
    let filter = "";
    if (this.state.role === "Handler") {
      filter = "CurrentStep eq 2"; // pending
    } else {
      filter = "(CurrentStep eq 1) or (CurrentStep eq 2) or (CurrentStep eq 3)";
    }
    this.loadRequests(filter, keepMessage);
  };

  private loadRequests = async (
    filter: string,
    keepMessage: boolean = false,
  ): Promise<void> => {
    // Promise means: this function finishes later (async work like SharePoint calls)
    this.setState({
      loading: true,
      message: keepMessage ? this.state.message : "",
    });

    try {
      const items = await this.sp.web.lists
        .getByTitle(this.props.listName)
        .items.filter(filter)
        .select("Id", "Title", "Details", "Status", "CurrentStep")
        .orderBy("Created", false)(); //false  ==> recent first
      // The final () ⬆️ executes the query and actually fetches the data from SharePoint.
      // Without it, we are just building the query, not running it.

      this.setState({ requests: items, loading: false });
    } catch (error) {
      console.error(error);
      this.setState({
        loading: false,
        message: "Error loading requests. Please refresh.",
        messageType: MessageBarType.error,
      });
    }
  };

  private createRequest = async (): Promise<void> => {
    const { title, details } = this.state; // destructuring
    //title or details empty !!!
    if (!title.trim() || !details.trim()) {
      this.setState({
        message: "Please fill all fields",
        messageType: MessageBarType.warning,
      });
      return; // means stop the function, nothing to return;
    }
    //else
    this.setState({ loading: true, message: "" });
    try {
      //add new request
      await this.sp.web.lists.getByTitle(this.props.listName).items.add({
        Title: title,
        Details: details,
        Status: "Pending",
        CurrentStep: 2,
      });

      this.setState(
        {
          loading: false,
          title: "",
          details: "",
          message: "✅ Request created successfully! ✨",
          messageType: MessageBarType.success,
        },
        () => {
          this.refreshData(true);
        },
      );
    } catch (error) {
      this.setState({
        loading: false,
        message: "Save failed",
        messageType: MessageBarType.error,
      });
    }
  };

  private updateRequest = async (): Promise<void> => {
    const { editItem, editTitle, editDetails, action } = this.state;
    if (!editItem || !action) return;

    this.setState({ loading: true, message: "" });
    try {
      const isCompleted = action === "Completed";
      const finalStatus = isCompleted ? "Completed" : "Rejected";
      const finalStep = isCompleted ? 3 : 1;

      await this.sp.web.lists
        .getByTitle(this.props.listName)
        .items.getById(editItem.Id)
        .update({
          Title: editTitle,
          Details: editDetails,
          Status: finalStatus,
          CurrentStep: finalStep,
        });

      this.setState(
        {
          loading: false,
          showDialog: false,
          message: `✅ Request ${finalStatus} successfully!`,
          messageType: MessageBarType.success,
        },
        () => {
          this.refreshData(true);
        },
      );
    } catch (error) {
      this.setState({
        loading: false,
        message: "Update failed",
        messageType: MessageBarType.error,
      });
    }
  };
  //Logout
  private handleLogout = (): void => {
    this.setState({ role: "", requests: [], message: "" });
  };

  public render(): React.ReactElement<IRequestWorkflowProps> {
    const { role } = this.state;
    if (!role)
      return <RoleSelector onRoleSelect={(r) => this.setState({ role: r })} />;

    return (
      //React Fragment   <>  </>
      <>
        {/*ternary operator ==>   {role === "Requester" ? ( ... ) : ( ... ) } */}
        {role === "Requester" ? (
          <RequesterView
            {...this.state} // spread operator It means everything inside `state` gets passed as props to the Component.
            onTitleChange={(v) => this.setState({ title: v })}
            onDetailsChange={(v) => this.setState({ details: v })}
            onSubmit={this.createRequest}
            onRefresh={() => this.refreshData()}
            onLogout={this.handleLogout}
          />
        ) : (
          <HandlerView
            {...this.state}
            onRefresh={() => this.refreshData()}
            onLogout={this.handleLogout}
            onEdit={(item) =>
              this.setState({
                showDialog: true,
                editItem: item,
                editTitle: item.Title,
                editDetails: item.Details,
                action: "",
              })
            }
            onEditTitleChange={(v) => this.setState({ editTitle: v })}
            onEditDetailsChange={(v) => this.setState({ editDetails: v })}
            onActionChange={(v) => this.setState({ action: v })}
            onSave={this.updateRequest}
            onCancelEdit={() => this.setState({ showDialog: false })}
          />
        )}
      </>
    );
  }
}
