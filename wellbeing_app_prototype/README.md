# Wellbeing Mentor Tracker - Prototype

A drag-and-drop interface for managing student wellbeing mentor assignments at The Island Private School of Limassol.

## Features

- **Drag & Drop Interface**: Easily reassign students between houses and mentor groups
- **Multi-Filter System**: Filter by programme (MYP, DP, Waldorf) and grade levels (6-12)
- **Pending Changes Tracking**: Review all changes before syncing
- **Visual Indicators**: Color-coded grades and programme badges
- **Sync Simulation**: Mock ManageBac integration workflow

## Demo Data

The prototype uses sample student data for demonstration purposes:
- 48 students across grades 6-12
- 3 houses: Stormrider, Seadragon, Wavecrest
- 6 mentor groups with assigned tutors
- Sample new students awaiting assignment

## Usage

### Local Testing
Simply open `index.html` in any modern web browser.

### GitHub Pages Deployment
Once committed and pushed to the repository, the prototype will be available at:
```
https://fisrafilov-isl.github.io/wellbeing_app_prototype/
```

### Sharing
Share the direct link with your team:
```
https://fisrafilov-isl.github.io/wellbeing_app_prototype/index.html
```

## How It Works

1. **Filtering**: Use the programme and grade filters to view specific student groups
2. **Reassigning**: Drag students from one mentor group cell to another
3. **Review**: Check the pending changes banner for all modifications
4. **Sync**: Click "Sync to ManageBac" to simulate saving changes

## Technical Details

- **React 18** - UI framework
- **Tailwind CSS** - Styling via CDN
- **Lucide Icons** - Icon library
- **Babel Standalone** - JSX transformation in browser
- **No Build Process** - Everything runs client-side

## File Structure

```
wellbeing_app_prototype/
├── index.html              # Standalone all-in-one demo
├── README.md              # This file
└── wellbeing-mentor-demo.tsx  # Original React component source
```

## Notes

- This is a prototype/demo with sample data only
- All "sync" operations are simulated (no actual backend integration)
- Changes are not persisted (refresh resets to initial state)
- Optimized for desktop browsers (drag & drop works best on desktop)
