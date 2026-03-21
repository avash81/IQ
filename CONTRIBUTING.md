# Contributing to IQTest Pro

## Code Style
- Use **TypeScript** for all files.
- Use **Tailwind CSS** for styling.
- Use **Lucide React** for icons.
- Use **Motion** for animations.

## Component Structure
- Reusable components go in `src/components/`.
- Page-level components go in `src/pages/`.
- Business logic goes in `src/lib/`.
- Data constants go in `src/data/`.

## Testing Policy
- All core logic in `src/lib/` MUST have unit tests.
- Run `npm run test` before committing.
- Run `npm run lint` to ensure type safety.

## Git Workflow
- Feature branches for new features.
- Pull requests for code review.
- Main branch is always deployable.
