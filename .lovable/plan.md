# HomeHero skyline as absolute background

## Goal
Ensure the Malgrat skyline reads as a full, absolute background behind the town crest / name / KM0 LAB logo in the HomeHero, while keeping the hero tall enough to show the complete skyline image without making it small.

## Current state
- `HomeHero` is rendered in `inline` mode on Home (`showGreeting={false}`).
- In vertical-tablet the hero is already set to `h-[220px]`.
- The skyline image (`skylineMalgrat.png`) is already `absolute inset-0 z-0` and the header row is `relative z-10`.
- The skyline uses `object-contain object-bottom` so the full image is visible.

## Planned changes
1. Keep the `vertical-tablet:h-[220px]` height on the inline hero so the skyline is large enough to be fully visible.
2. Confirm the skyline stays as an absolute background layer: `absolute inset-0 z-0`.
3. Confirm the header row stays above it: `relative z-10`.
4. Scope the change only to `vertical-tablet`; do not touch mobile portrait or landscape heights.
5. Verify the skyline sits behind the logo/city name rather than appearing as a separate block below it.

## No-go
- Do not reduce the hero height (user wants the skyline complete).
- Do not change other breakpoints without explicit instruction.
- Do not move the skyline in front of the header text.