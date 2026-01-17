// It shows the user a welcome message and a dropdown menu to choose a role: "Requester" or "Handler"
// , and when they select a role, the program knows which role they picked.

import * as React from "react";
import { Stack, Text, Dropdown, IDropdownOption } from "@fluentui/react"; //ready-made UI elements from the Fluent UI library
import styles from "./RequestWorkflow.module.scss";

// props needed for this Component
interface IRoleSelectorProps {
  onRoleSelect: (role: string) => void;
}
//Options
const ROLE_OPTIONS: IDropdownOption[] = [
  { key: "Requester", text: "Requester" },
  { key: "Handler", text: "Handler" },
];
// destructuring   { onRoleSelect }   ,   ":" means Type
export const RoleSelector: React.FC<IRoleSelectorProps> = ({
  onRoleSelect,
}) => {
  return (
    <div className={styles.centerContainer}>
      {/* if horizontal <Stack horizontal tokens={{ childrenGap: 20 }}></Stack> */}
      <Stack tokens={{ childrenGap: 20 }} className={styles.card}>
        <Text variant="xxLarge">Welcome 👋</Text>
        <Text variant="large">Select Your Role:</Text>
        <Dropdown
          placeholder="Choose role"
          options={ROLE_OPTIONS}
          onChange={(_, opt) => opt && onRoleSelect(opt.key as string)}
        />
      </Stack>
    </div>
  );
};

//onChange?: (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => void;

// We created a "map" (interface) to tell the Component: you need a function called onRoleSelect.
// Then, when we wrote the Component (RoleSelector), we told the program:
// "I am a Functional Component and I will receive these props --> React.FC<IRoleSelectorProps>."
// Finally, we used { onRoleSelect } inside the code to extract the function and use it.
