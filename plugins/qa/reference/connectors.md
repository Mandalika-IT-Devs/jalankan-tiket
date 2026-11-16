# Trello and Google Drive

The qa plugin reaches Trello and Google Drive through the claude.ai connectors that the QA engineer connects. Their tool names start with an account-specific prefix, so this file names each tool by its base name, such as `trelloWriteCard`. Find the full name among your tools.

When a connector is missing, do not look for another way in: no API tokens, no scripts, no browser login. Report it with the fix:
- The QA engineer connects it in the claude.ai Connectors settings, then starts a new session.
- claude.ai connectors reach Claude Code only when it is signed in with a claude.ai account. A session that runs on an API key has none of them. The QA engineer then signs in with `/login`, or runs the command in the Claude Desktop Code tab.

## Trello

- IDs are ARIs, such as `ari:cloud:trello::board/workspace/<id>/<id>`. Store ARIs, never short links.
- **Find the board.** `trelloSearch` with `search_boards`, or `trelloReadBoard` with `get` and the board URL the QA engineer gives you.
- **Lists.** `trelloReadList` lists a board's lists. `trelloWriteList` with `create` adds one.
- **Cards.** `trelloWriteCard`: `create` (list, name, description), `add_comment`, `attach_label`, `move`.
- **Labels.** `trelloReadBoard` with `list_labels`. The connector cannot create labels. Attach a label only when one already matches, and always put the severity in the card title.
- **Attachments.** The connector cannot attach files. Upload evidence to the product's Drive evidence folder and put its link in the card.
- **Before creating a card,** search the board for a card about the same problem (`trelloSearch` with `search_cards` and `boardIds`). When one exists, comment on it instead of creating a second card.

## Google Drive and Docs

- **Folders.** The Drive connector's `create_file` with `contentMimeType` `application/vnd.google-apps.folder` creates a folder. `parentId` puts it inside another folder.
- **A new Google Doc.** Write the content as simple HTML (headings, paragraphs, lists, tables), then call `create_file` with `contentMimeType` `text/html` and `textContent`. Drive converts it into a Google Doc. Keep the returned file ID.
- **Changing a Doc.** The Docs connector's `update_doc` appends with `insertText` at `endOfSegmentLocation`. Never delete or rewrite text in a Doc that people may have edited or commented on: add a new section, or create a new Doc.
- **Evidence.** Upload screenshots with `create_file`, `base64Content` and `contentMimeType` `image/png`, into `evidenceFolderId`. Name each file `<date>-<check id>-<n>.png`.
- **Sharing.** Never change sharing settings. The QA engineer shares the product folder with the team.
