import * as React from "react";
import {
  Stack,
  Text,
  TextField,
  PrimaryButton,
  DefaultButton,
  Dropdown,
  IDropdownOption,
  DetailsList,
  IColumn,
  SelectionMode,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  Dialog,
  DialogType,
  DialogFooter,
} from "@fluentui/react";
import styles from "./RequestWorkflow.module.scss";
import { IRequest } from './IRequest';

interface IHandlerViewProps {
  requests: IRequest[];
  loading: boolean;
  message: string;
  messageType: MessageBarType;
  showDialog: boolean;
  editTitle: string;
  editDetails: string;
  action: string;
  onRefresh: () => void;
  onLogout: () => void;
  onEdit: (item: IRequest) => void;
  onEditTitleChange: (value: string) => void;
  onEditDetailsChange: (value: string) => void;
  onActionChange: (value: string) => void;
  onSave: () => void;
  onCancelEdit: () => void;
}

//Options
const ACTION_OPTIONS: IDropdownOption[] = [
  { key: "Completed", text: "Completed" },
  { key: "Rejected", text: "Back to Requester" },
];

export const HandlerView: React.FC<IHandlerViewProps> = (props) => {
  const columns: IColumn[] = [
    {
      key: "title",
      name: "Title",
      fieldName: "Title",
      minWidth: 120,
      maxWidth: 200,
    },
    {
      key: "details",
      name: "Details",
      fieldName: "Details",
      minWidth: 200,
      maxWidth: 350,
    },
    {
      key: "status",
      name: "Status",
      fieldName: "Status",
      minWidth: 100,
      maxWidth: 120,
    },
    {
      key: "actions",
      name: "Actions",
      minWidth: 100,
      onRender: (item: IRequest) => (
        <PrimaryButton
          text="Process"
          iconProps={{ iconName: "Edit" }}
          onClick={() => props.onEdit(item)}
        />
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Stack
        horizontal
        horizontalAlign="space-between"
        className={styles.header}
      >
        <Text variant="xxLarge">Handler Dashboard</Text>
        <DefaultButton
          text="Logout"
          iconProps={{ iconName: "SignOut" }}
          onClick={props.onLogout}
        />
      </Stack>

      {props.message && (
        <MessageBar
          messageBarType={props.messageType}
          style={{ marginBottom: 20 }}
        >
          {props.message}
        </MessageBar>
      )}

      <div className={styles.card}>
        <Stack
          horizontal
          horizontalAlign="space-between"
          verticalAlign="center"
          style={{ marginBottom: 15, marginTop: 20 }}
        >
          <Text
            variant="xLarge"
            className={styles.title}
            style={{ marginBottom: 0 }}
          >
            Pending Tasks 📋
          </Text>
          <PrimaryButton
            text="Refresh"
            iconProps={{ iconName: "Refresh" }}
            onClick={props.onRefresh}
            disabled={props.loading}
          />
        </Stack>
        {props.loading ? (
          <Spinner size={SpinnerSize.large} />
        ) : (
          <DetailsList
            items={props.requests}
            columns={columns}
            selectionMode={SelectionMode.none}
          />
        )}
      </div>

      <Dialog
        hidden={!props.showDialog} //Dialog مخفي لو showDialog=false
        onDismiss={props.onCancelEdit} //When the user clicks outside the Dialog or closes it, the `onCancelEdit` function is executed.
        dialogContentProps={{
          type: DialogType.largeHeader,
          title: "Action Request",
        }}
        minWidth={550}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <TextField label="Request Title" value={props.editTitle} readOnly />
          <TextField
            label="Handler Comments/Modifications"
            value={props.editDetails}
            multiline
            rows={4}
            onChange={(_, v) => props.onEditDetailsChange(v || "")}
          />
          <Dropdown
            label="Decision"
            placeholder="Select status"
            selectedKey={props.action}
            options={ACTION_OPTIONS}
            onChange={(_, opt) =>
              opt && props.onActionChange(opt.key as string)
            }
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton
            text="Apply Changes"
            onClick={props.onSave}
            //It will be disabled if loading is in progress or a decision has not been selected
            disabled={props.loading || !props.action}
          />
          <DefaultButton text="Cancel" onClick={props.onCancelEdit} />
        </DialogFooter>
      </Dialog>
    </div>
  );
};
