import * as React from "react";
import {
  Stack,
  Text,
  TextField,
  PrimaryButton,
  DefaultButton,
  DetailsList,
  IColumn,
  SelectionMode,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
} from "@fluentui/react";
import styles from "./RequestWorkflow.module.scss";
import { IRequest } from './IRequest';

// interface IRequest {
//   Id: number;
//   Title: string;
//   Details: string;
//   Status: string;
//   CurrentStep: number;
// }

interface IRequesterViewProps {
  title: string;
  details: string;
  requests: IRequest[];
  loading: boolean;
  message: string;
  messageType: MessageBarType;
  onTitleChange: (value: string) => void;
  onDetailsChange: (value: string) => void;
  onSubmit: () => void;
  onRefresh: () => void;
  onLogout: () => void;
}

export const RequesterView: React.FC<IRequesterViewProps> = (props) => {
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
      minWidth: 120,
      maxWidth: 150,
      onRender: (item: IRequest) => {
        // Color coding for status visibility
        const isRejected = item.Status === "Rejected";
        return (
          <span
            style={{
              color: isRejected ? "#d13438" : "inherit",
              fontWeight: isRejected ? "600" : "normal",
            }}
          >
            {item.Status}
          </span>
        );
      },
    },
  ];

  return (
    <div className={styles.container}>
      <Stack
        horizontal
        horizontalAlign="space-between"
        className={styles.header}
      >
        <Text variant="xxLarge">Requester Dashboard</Text>
        <DefaultButton
          text="Logout"
          iconProps={{ iconName: "SignOut" }}
          onClick={props.onLogout}
        />
      </Stack>

      <div className={styles.card}>
        {/* <Text variant="xLarge" className={styles.title}>
          Create Request
        </Text> */}
        <Stack tokens={{ childrenGap: 15 }}>
          <TextField
            label="Title"
            value={props.title}
            onChange={(_, v) => props.onTitleChange(v || "")}
          />
          <TextField
            label="Details"
            value={props.details}
            multiline
            rows={5}
            onChange={(_, v) => props.onDetailsChange(v || "")}
          />
          <PrimaryButton
            text="Submit"
            iconProps={{ iconName: "Send" }}
            onClick={props.onSubmit}
            disabled={props.loading} //props.loading = true  --> disabled
          />

          {/* Success/Error Message directly under Submit */}
          {props.message && (
            <MessageBar
              messageBarType={props.messageType}
              style={{ marginTop: 10 }}
            >
              {props.message}
            </MessageBar>
          )}
        </Stack>
      </div>

      <div className={styles.card}>
        <Stack
          horizontal
          horizontalAlign="space-between"
          verticalAlign="center"
          style={{ marginBottom: 15 }}
        >
          <Text
            variant="xLarge"
            className={styles.title}
            style={{ marginBottom: 0, marginTop: 30 }}
          >
            My Requests
          </Text>
          <PrimaryButton
            text="Refresh"
            style={{ marginBottom: 0, marginTop: 30 }}
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
    </div>
  );
};
