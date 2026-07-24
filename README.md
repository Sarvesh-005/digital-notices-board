# Digital Notice Board

A modern, premium academic web application for managing and displaying college notices. Built with vanilla JavaScript, featuring a dual-role system (Admin/Student), real-time notifications, and a sophisticated UI with dark/light theme support.

## Features

### Core Functionality
- **Notice Management**: Create, read, update, and delete notices with rich content
- **Multiple Notice Types**: Circular, Event, and Urgent notices with distinct styling
- **Role-Based Access**: Admin (full access) and Student (view-only) modes
- **Search & Filter**: Search notices by title, description, and type
- **Sorting Options**: Sort by date, title, or type with pinned notices appearing first
- **Expiry Management**: Automatically track and hide expired notices

### Advanced Features
- **Live Ticker**: Scrolling banner displaying urgent notices
- **Notifications System**: Real-time notifications for new notices with badge counter
- **Bulk Operations**: Select multiple notices for batch delete or pin actions
- **Statistics Dashboard**: View comprehensive stats (total, urgent, events, circulars, pinned, expired)
- **Countdown Timers**: Live event countdowns showing time until notices expire
- **File Attachments**: Upload and download PDF/document files with notices
- **Image Support**: Attach poster images to notices
- **Import/Export**: JSON-based import/export for backup and data migration

### User Experience
- **Dual Theme**: Dark (default) and light theme support with smooth transitions
- **Responsive Design**: Fully responsive layout for desktop, tablet, and mobile devices
- **Smooth Animations**: Premium animations and transitions for UI interactions
- **Accessibility**: WCAG-compliant design with aria labels and keyboard navigation
- **Keyboard Shortcuts**: Quick access to common functions
  - `Ctrl + F` - Focus search
  - `Ctrl + N` - New notice
  - `Ctrl + B` - Toggle bulk select
  - `Ctrl + S` - Save notice
  - `Ctrl + 1-4` - Switch tabs
  - `Esc` - Close/Cancel
  - `?` - Show help

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage**: Browser LocalStorage for notices and settings
- **Design**: Premium dark/light theme with gold accents
- **Fonts**: 
  - Playfair Display (Display)
  - DM Sans (Body)
  - JetBrains Mono (Code)

## Project Structure

```
mini project/
├── index.html          # Main HTML file with login and app sections
├── js/
│   └── app.js          # Core application logic (1000+ lines)
├── css/
│   └── style.css       # Comprehensive styling with theme support
├── assets/
│   ├── bgslogo.jpg     # College logo (JPG)
│   └── bgslogo.svg     # College logo (SVG)
├── test.html           # Test/reference file
└── README.md           # This file
```

## Getting Started

### Installation

1. Clone or download the project files
2. Open `index.html` in a modern web browser
3. No build process or dependencies required - works out of the box

### Demo Credentials

**Administrator Mode:**
- Username: `admin`
- Password: `1234`

**Student Mode (View-Only):**
- Username: `student`
- Password: `1111`

## Usage Guide

### As an Administrator

1. **Login**: Select "Administrator" role and enter demo credentials
2. **Create Notice**: 
   - Fill in the form on the right panel
   - Select notice type (Circular, Event, Urgent)
   - Set event date and expiry date
   - Optionally upload image and file attachments
   - Click "Save Notice"
3. **Edit Notice**: Click the pencil icon (✏️) on any notice card
4. **Delete Notice**: Click the trash icon (🗑️) on any notice card
5. **Pin Notice**: Click the pin icon (📍/📌) to keep important notices at the top
6. **Bulk Operations**: 
   - Click "📋 Select" to enable bulk mode
   - Check notices to select
   - Use "Delete" or "Pin" buttons for batch actions
7. **Search & Filter**: 
   - Use the search box to find notices by keyword
   - Switch between tabs (All, Circulars, Events, Urgent)
   - Sort by date, title, or type
8. **View Statistics**: Click the "📊 Statistics" tab to see notice metrics
9. **Import/Export**: Use the manage section to backup or restore notice data
10. **Theme Toggle**: Use the light/dark theme toggle in the header

### As a Student

1. **Login**: Select "Student" role and enter demo credentials
2. **View Notices**: Browse all non-expired notices organized by type
3. **Search**: Use the search functionality to find specific notices
4. **Filter**: Switch between tabs to view specific notice categories
5. **Read Status**: Notices show a yellow dot indicator when unread
6. **Notifications**: Click the bell icon to view recent notice notifications
7. **Statistics**: View the statistics dashboard for notice overview

## Features in Detail

### Notice Types

- **Circular**: Official announcements and policy updates
- **Event**: Upcoming college events, competitions, seminars
- **Urgent**: Time-sensitive announcements requiring immediate attention

### Notifications

- New notices automatically trigger notifications
- Unread notification count appears on the bell icon
- Click to mark individual notifications as read
- "Mark all read" button for bulk action
- Recent 50 notifications are stored

### Data Management

- All data stored locally in browser's localStorage
- Export notices as JSON for backup
- Import previously exported JSON files
- Clear all notices (with confirmation)
- No server/backend required

### Customization

Replace the college logo by updating the file path:
- `assets/bgslogo.jpg` - Used in banner
- Supports JPG, PNG, SVG formats

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Storage Limits

- Notice files (with embedded images): Up to browser storage limit (~5-10MB per domain)
- Each attached file limited to 10MB
- Maximum of ~50 notifications stored at once

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + F` | Focus search bar |
| `Ctrl + N` | Create new notice |
| `Ctrl + B` | Toggle bulk select mode |
| `Ctrl + S` | Save notice |
| `Ctrl + 1` | View all notices |
| `Ctrl + 2` | View circulars |
| `Ctrl + 3` | View events |
| `Ctrl + 4` | View urgent notices |
| `Esc` | Close modals / Cancel bulk mode |
| `?` | Show keyboard shortcuts help |

## Performance Notes

- Lightweight vanilla JavaScript - no frameworks
- Smooth 60fps animations and transitions
- Efficient DOM rendering and updates
- Local storage eliminates server latency
- Average page load time: <100ms after initial load

## Accessibility Features

- Semantic HTML5 structure
- ARIA labels for assistive technologies
- Keyboard navigation support
- Focus indicators for all interactive elements
- Color contrast compliant with WCAG AA standards
- Skip to main content link
- Reduced motion support for animations

## Responsive Breakpoints

- **Desktop**: 1024px+ (2-column layout)
- **Tablet**: 768px - 1023px (adaptive layout)
- **Mobile**: Below 768px (single column, stacked layout)

## Tips & Tricks

1. **Quick Add**: Click the floating "+" button (bottom-right) for quick notice creation
2. **Bulk Actions**: Use `Ctrl + B` keyboard shortcut to quickly toggle bulk select
3. **Search Efficiency**: Search works on title, description, and type simultaneously
4. **Event Countdown**: Events display countdown timers - set dates to see them in action
5. **Urgent Notice Display**: Urgent notices rotate in the ticker at the top of the page
6. **Data Backup**: Regularly export your notices as JSON for safe backup
7. **Theme Preference**: Your theme choice is remembered in browser storage
8. **Mobile Optimization**: Admin panel moves to mobile view for better accessibility

## Troubleshooting

### Notices Not Saving
- Check if localStorage is enabled in your browser
- Clear browser cache and try again
- Ensure you're using a modern browser

### Large File Upload Issues
- Ensure file size is under 10MB
- Try uploading a smaller file
- Clear browser storage to free up space

### Animations Not Smooth
- Enable hardware acceleration in browser settings
- Close other browser tabs
- Disable browser extensions that modify page styles

### Data Lost After Browser Close
- Notices are stored in localStorage and should persist
- Only cleared if you explicitly click "Clear All"
- Check if private/incognito mode is enabled (data won't persist)

## Notes

- This is a mini project demonstrating modern web development practices
- Perfect for college/university notice board systems
- Can be easily customized for other institutional use cases
- No external API or backend required

## License

Mini Project - For Educational Purpose

## Support

For issues or suggestions, please refer to the project files and code comments for more details on implementation.

---

**Version**: 2.0 Enhanced Edition  
**Last Updated**: 2026  
**Created for**: BGS College of Engineering and Technology
