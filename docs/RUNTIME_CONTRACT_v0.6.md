# Runtime contract — v0.6

`src/question-provider.js` selects an eligible question from a lightweight
assignment descriptor. `src/math.js` and `src/math-v06.js` are the bundled
provider, not cartridge logic. Imported records retain source, subskill, course,
standards and DOK metadata. The supplied JSON package schema describes the
exchange shape; the runtime applies its own validation when a session is created.
The existing device ID is a room credential, not a persistent learner account.

`src/extraction.js` owns authoritative stage/results transitions. The final team
choice snapshots route, equipment, alerts and roster. `public/stealth-core.js`
is a pure deterministic simulation. `public/stealth.js` owns controls, drawing,
accessible scenes, recovery and the evidence queue. DOM polling updates the
existing runtime rather than replacing the canvas or held touch controls.

Commands use the existing flattened envelope:

```json
{
  "type": "extraction.checkpoint",
  "commandId": "unique-id-reused-for-a-retry",
  "deviceId": "the-joining-device-credential",
  "mapRevision": "vault7-stealth-1",
  "checkpoint": "B",
  "activeElapsedMs": 24000,
  "detections": 1,
  "integrityRemaining": 2,
  "fallbackUsed": false,
  "fallbackStep": 0,
  "resourcesUsed": ["scanner"]
}
```

Endpoint: POST `/api/sessions/{code}/command`. Existing states arrive through
GET `/api/sessions/{code}/state?deviceId=…`, or a teacherKey for teacher views.
Start requires the map revision. A switch to accessible extraction is permanent
for that run. Completed outcomes are extracted, captured, timeout,
fallback_extracted or teacher-authorized advanced. Checkpoints, detections,
elapsed time and accessible steps are monotonic. Bounds and equipment are
validated; the server does not reconstruct a full physics replay.

The client queues state events with stable command IDs. A recovery heartbeat is
sent no more than once every 15 seconds. Refresh restores at the highest known
checkpoint, with the largest valid elapsed time/detection count. Terminal server
state wins. After 30 seconds without contact, local play pauses. Reconnect requires
an explicit resume, so a returning player is not dropped into a moving beam.

The 180-second limit counts active platform play. Accessible reading has no
individual speed timer. The shared five-minute deadline remains in force for
backgrounded devices. Teacher pause adds its duration to the shared deadline.
Teacher end-extraction marks only unfinished players advanced. Deadline expiry
marks only unfinished players timeout. Either mechanism allows the team epilogue.

JSON includes attempts plus separate `engagement.gameplay` evidence. CSV has
academic-context, extraction and team-ending sections. Neither dexterity nor
accessible-route use changes mastery. The personnel epilogue combines the earlier
academic injury category with the observed extraction result.

Storage preserves legacy single-record rooms and splits larger snapshots into
bounded transactional parts. Public roster IDs mask other students' device
credentials; teacher exports preserve their actual room IDs.
