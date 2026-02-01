# Operation Schedule Data Model

The operation schedule has been enhanced to include mandatory medical and logistical fields.

## Data Structure

Each document in the `schedules` collection follows this structure:

| Field | Type | Description |
|-------|------|-------------|
| `patientName` | string | Name of the patient (Required) |
| `operationType` | string | Type of surgery (Required) |
| `operationDate` | timestamp/string | Scheduled date and time (Required) |
| `doctorName` | string | Primary surgeon's name (Required) |
| `userId` | string | ID of the user who created/owns the schedule |
| `anesthesiaType` | string | Type of anesthesia to be used |
| `anesthesiologistName`| string | Name of the anesthesiologist |
| `assistantSurgeons` | array (string) | List of assistant surgeons |
| `otNurses` | array (string) | List of OT nurses |
| `requiredDrugs` | array (string) | Drugs needed for the operation |
| `requiredInstruments` | array (string) | Surgical instruments required |
| `specialMaterials` | array (string) | Any special materials needed |
| `preOperativeEvents` | array (object) | List of `{ timestamp, description }` for pre-op |
| `postOperativeEvents`| array (object) | List of `{ timestamp, description }` for post-op |
| `doctorRemarks` | string | Additional notes (editable post-creation) |
| `attachments` | array (object) | Surgical reports: `{ fileName, fileType, downloadURL, uploadedAt }` |
| `status` | string | Current status (scheduled, in_progress, postponed, cancelled, completed, emergency) |
| `statusHistory` | array (object) | List of `{ fromStatus, toStatus, changedBy, reason, timestamp }` |

## Example Firestore Document (After Transitions)

```json
{
  "patientName": "John Doe",
  "status": "in_progress",
  "statusHistory": [
    {
      "fromStatus": "scheduled",
      "toStatus": "emergency",
      "changedBy": "Admin_User",
      "reason": "Sudden complication, urgent surgery needed",
      "timestamp": "2026-02-01T10:15:00Z"
    },
    {
      "fromStatus": "emergency",
      "toStatus": "in_progress",
      "changedBy": "Dr. Smith",
      "reason": "Surgery commenced",
      "timestamp": "2026-02-01T10:30:00Z"
    }
  ]
}
```

```json
{
  "patientName": "John Doe",
  "operationType": "Appendectomy",
  "operationDate": "2026-02-01T10:00:00Z",
  "doctorName": "Dr. Smith",
  "userId": "user123",
  "anesthesiaType": "General",
  "anesthesiologistName": "Dr. Brown",
  "assistantSurgeons": ["Dr. Wilson"],
  "otNurses": ["Nurse Joy", "Nurse Kelly"],
  "requiredDrugs": ["Propofol", "Fentanyl"],
  "requiredInstruments": ["Scalpel", "Forceps"],
  "specialMaterials": ["Suture Kit"],
  "preOperativeEvents": [
    { "timestamp": "2026-02-01T09:00:00Z", "description": "Patient prepped" }
  ],
  "postOperativeEvents": [],
  "doctorRemarks": "No complications expected.",
  "attachments": [],
  "status": "scheduled",
  "createdAt": "[Firestore ServerTimestamp]"
}
```

## Backward Compatibility
Existing documents missing these fields will be handled safely by the service layer, applying empty strings or arrays as defaults during read/update operations.
