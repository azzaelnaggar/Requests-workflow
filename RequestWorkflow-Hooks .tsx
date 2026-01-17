// uncomment to use Hooks Version instead of Class Component in Component folder

/* 
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

const RequestWorkflow: React.FC<IRequestWorkflowProps> = (props) => {
  // SharePoint instance (PnPJS)
  const sp: SPFI = React.useMemo(
    () => spfi().using(SPFx(props.context)),
    [props.context]
  );

  // State (Hooks)
  const [role, setRole] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [details, setDetails] = React.useState("");
  const [requests, setRequests] = React.useState<IRequest[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [messageType, setMessageType] = React.useState<MessageBarType>(
    MessageBarType.info
  );

  const [showDialog, setShowDialog] = React.useState(false);
  const [editItem, setEditItem] = React.useState<IRequest | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [editDetails, setEditDetails] = React.useState("");
  const [action, setAction] = React.useState("");

  // Effect: reload data when role changes
  React.useEffect(() => {
    if (role) {
      refreshData();
    }
  }, [role]);

  // Load data based on role
  const refreshData = (keepMessage: boolean = false): void => {
    let filter = "";
    if (role === "Handler") {
      filter = "CurrentStep eq 2"; // pending for handler
    } else {
      filter = "(CurrentStep eq 1) or (CurrentStep eq 2) or (CurrentStep eq 3)";
    }
    loadRequests(filter, keepMessage);
  };

  const loadRequests = async (
    filter: string,
    keepMessage: boolean = false
  ): Promise<void> => {
    setLoading(true);
    setMessage(keepMessage ? message : "");

    try {
      const items = await sp.web.lists
        .getByTitle(props.listName)
        .items.filter(filter)
        .select("Id", "Title", "Details", "Status", "CurrentStep")
        .orderBy("Created", false)();

      setRequests(items);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setMessage("Error loading requests. Please refresh.");
      setMessageType(MessageBarType.error);
    }
  };

  // Create new request (Requester)
  const createRequest = async (): Promise<void> => {
    if (!title.trim() || !details.trim()) {
      setMessage("Please fill all fields");
      setMessageType(MessageBarType.warning);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await sp.web.lists.getByTitle(props.listName).items.add({
        Title: title,
        Details: details,
        Status: "Pending",
        CurrentStep: 2,
      });

      setLoading(false);
      setTitle("");
      setDetails("");
      setMessage("✅ Request created successfully! ✨");
      setMessageType(MessageBarType.success);

      refreshData(true);
    } catch {
      setLoading(false);
      setMessage("Save failed");
      setMessageType(MessageBarType.error);
    }
  };

  // Update request (Handler)
  const updateRequest = async (): Promise<void> => {
    if (!editItem || !action) return;

    setLoading(true);
    setMessage("");

    try {
      const isCompleted = action === "Completed";
      const finalStatus = isCompleted ? "Completed" : "Rejected";
      const finalStep = isCompleted ? 3 : 1;

      await sp.web.lists
        .getByTitle(props.listName)
        .items.getById(editItem.Id)
        .update({
          Title: editTitle,
          Details: editDetails,
          Status: finalStatus,
          CurrentStep: finalStep,
        });

      setLoading(false);
      setShowDialog(false);
      setMessage(`✅ Request ${finalStatus} successfully!`);
      setMessageType(MessageBarType.success);

      refreshData(true);
    } catch {
      setLoading(false);
      setMessage("Update failed");
      setMessageType(MessageBarType.error);
    }
  };

  // Logout
  const handleLogout = (): void => {
    setRole("");
    setRequests([]);
    setMessage("");
  };

  // Render
  if (!role) {
    return <RoleSelector onRoleSelect={(r) => setRole(r)} />;
  }

  return (
    <>
      {role === "Requester" ? (
        <RequesterView
          role={role}
          title={title}
          details={details}
          requests={requests}
          loading={loading}
          message={message}
          messageType={messageType}
          onTitleChange={setTitle}
          onDetailsChange={setDetails}
          onSubmit={createRequest}
          onRefresh={refreshData}
          onLogout={handleLogout}
        />
      ) : (
        <HandlerView
          role={role}
          requests={requests}
          loading={loading}
          message={message}
          messageType={messageType}
          showDialog={showDialog}
          editTitle={editTitle}
          editDetails={editDetails}
          action={action}
          onRefresh={refreshData}
          onLogout={handleLogout}
          onEdit={(item) => {
            setShowDialog(true);
            setEditItem(item);
            setEditTitle(item.Title);
            setEditDetails(item.Details);
            setAction("");
          }}
          onEditTitleChange={setEditTitle}
          onEditDetailsChange={setEditDetails}
          onActionChange={setAction}
          onSave={updateRequest}
          onCancelEdit={() => setShowDialog(false)}
        />
      )}
    </>
  );
};

export default RequestWorkflow; 

*/
