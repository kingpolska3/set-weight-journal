# Save-flow verification

Rule: an app page must open, a successful cloud save must really succeed, and refreshing must read the accepted data.

## Surfaces checked
- Diary `/` and old `/index`: ran both; fixed storage-dependent initial rendering; previous exercise/series reload test passed.
- Exercise cards and timers: read shared component used in diary and both coach pages; fixed storage-dependent initial states.
- History: read read-only history/filter flow and opened it signed in; no related write defect.
- Tools: read templates, received-plan activation, import and exports; opened signed in. Local-only actions are not cloud confirmations. Storage-quota and actual file exports were not exercised.
- Profile: read profile save, sharing consent, logout, theme and sync actions; opened signed in. Profile save checks returned errors; fixed logout error handling. Did not change account settings.
- Plans: read creation, autosave, flush-before-start, publication and shared reads; opened signed in. Fixed swallowed private-save errors, nonexistent private timestamp field, empty update results and navigation after failed saves. Publication now sends only the prescription.
- Both coach-workout URLs: read both implementations and opened both. Un-nested old coach URL so it renders its own page. Failed cloud saves retain the canonical local session and no longer claim cloud success. No existing closed session was changed.
- Bookings: read creation, approval, decline, cancellation, deletion, reminders, calendar export and sync; opened signed in. Restored UPDATE for existing rows, preserved owner, propagated failures, and deferred local status changes until cloud acceptance. Background sync skips unchanged and closed rows. Regression tests passed; no real booking was created or approved.
- Cloud sync: read initial/online/pagehide/visibility/periodic sync plus plan/settings writes. Removed nonexistent templates field and partial-success fallback; failed writes no longer advance the settings timestamp.
- Client-session history: read local/cloud save, merge and deletion; defer local deletion until cloud deletion succeeds.
- Received plans: read publication pull, activation and template copies; no cloud-success assertion in those local-only operations.
- Plan generator: read UI pre-save/review and owner-authorized server function; inherits checked plan-save errors. AI generation was not executed.
- Server bootstrap/offline support: read bearer attachment, error handling and preview worker exclusion. Published offline install was not exercised.
- Database: read live definitions of booking guard, intake extraction, plan update guard, share/claim/list, stats/search and delete-account functions. No schema, permission, setting or historical record was changed in this request.

## Latest build
Fixed the missing exercise-atlas item separator that caused the new compilation failure. Automatic builds report `build OK`.

## Verification boundaries
All ten entry URLs opened in a signed-in browser with no runtime errors. Seven save regression tests passed. Actual hosted publication, AI generation, account deletion, real booking approval and offline installation remain unverified.