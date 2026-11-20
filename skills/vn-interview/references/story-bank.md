# The story bank

Stories are STAR+Reflection answers the user reuses across interviews. They live on techjobs.vn (signed in) so every agent and session sees the same ones.

## Fields

`save_story` takes a `title` (the key: the same title updates the story), `situation`, `task`, `action`, `result`, `reflection`, the `skills` it answers (up to 10), a `provenance` and a `source_note` saying where the facts came from ("CV, Grab 2023 project", "user, chat 2026-11-20"). `archived` hides a story without deleting it; saving an archived title again brings it back. `list_stories` filters by `skill` and can include archived ones.

## Provenance

- `cv`: every fact in it is in the user's CV;
- `user_stated`: the user told you;
- `unverified`: you drafted or inferred part of it;
- `user_cannot_confirm`: the user does not know whether a figure is right.

Editing a `cv` or `user_stated` story's facts without saying where the new facts come from makes it `unverified`, so always pass the provenance you know.

## Building a story with the user

Ask one question at a time: the situation and their role in it, what they had to achieve, what they did (their part, not the team's), the result (with a number only if they give one), and what they would do differently. Write it back in their words, ask them to confirm, then save with `user_stated`.

A story you drafted from the CV alone is `cv` only when every fact is in the CV; anything you filled in makes it `unverified`.

## Using figures

Before a figure from an `unverified` or `user_cannot_confirm` story goes into an answer, a CV or a letter, ask the user with four answers: it is right as written, here is the right figure, keep it as narrative only, or "I don't know". Save their answer: a corrected or confirmed figure as `user_stated`, "I don't know" as `user_cannot_confirm`. A `user_cannot_confirm` story stays narrative only however often it is reused.

## Limits

The server keeps up to 50 visible stories per user (200 in all, archived included). When a save is refused for the limit, offer to archive stories the user no longer uses.
