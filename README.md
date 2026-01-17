# Request Workflow System

A SharePoint Framework (SPFx) web part for managing internal requests with role-based access.

## Overview

This solution provides two interfaces:

- **Requester**: Submit and track requests
- **Handler**: Review and process requests

Built with React, TypeScript, and Fluent UI.

---

![Demo Preview](./assets/demo.gif)

**What’s shown in the video:**

- Role selection 🧑‍💻
- Requester creating a request 📝
- Handler viewing and processing requests ✅/❌
- SharePoint list updating in real-time 📊

### 3. Create SharePoint List

Create a list named **Requests** with these columns:

| Column      | Type                                | Required |
| ----------- | ----------------------------------- | -------- |
| Title       | Single line text                    | Yes      |
| Details     | Multiple lines text                 | Yes      |
| Status      | Choice (Pending/Rejected/Completed) | Yes      |
| CurrentStep | Number                              | Yes      |

### 4. Run locally

```bash
gulp serve --nobrowser
```

## Configuration

### Update SharePoint URL

Edit `config/serve.json` with your SharePoint site URL:

```json
{
  "initialPage": "https://yourtenant.sharepoint.com/sites/yoursite/_layouts/workbench.aspx"
}
```

### Web Part Properties

When you add the web part to the workbench, configure these properties:

- **List Name**: `RequestsList` (must match your SharePoint list name exactly)
- **Description**: Optional description for the web part

The web part connects to SharePoint's hosted workbench for development and testing.

---

## Project Structure

```
src/webparts/requestWorkflow/components/
├── RequestWorkflow.tsx      # Main component
├── RequesterView.tsx        # Requester interface
├── HandlerView.tsx          # Handler interface
└── RoleSelector.tsx         # Role selection screen
```

---

## System Architecture

**RequestWorkflow.tsx** - Main component that manages state, handles SharePoint communication, and controls which view displays based on user role.

**RoleSelector.tsx** - Simple landing screen with two buttons for role selection. Shows on first load.

**RequesterView.tsx** - Interface for submitting requests. Contains a form (Title + Details fields) and a table showing user's requests with status.

**HandlerView.tsx** - Interface for processing requests. Shows table of pending requests with Edit button. Opens dialog for approval/rejection.

**Data Flow:**
User action → Event handler → Parent component → SharePoint API → State update → UI refresh

## Troubleshooting

**Web part not showing?**

- Clear browser cache and rebuild: `gulp clean && gulp build`

**List not found error?**

- Check list name matches exactly "RequestsList"
- Verify list exists in the site

**Build errors?**

- Delete `node_modules` and run `npm install` again
