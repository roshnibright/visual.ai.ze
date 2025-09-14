# Easy Key-Z: Accessible Keyboard with AI Predictions

An intelligent, accessible keyboard interface designed for users with fine motor impairments and learning disabilities. Features dynamic key resizing based on AI predictions and customizable accessibility options.

## 🌟 Features

### 🎯 **Core Accessibility Features**

- **Dynamic Key Resizing**: Keys automatically resize based on AI predictions of next likely characters
- **Large Touch Targets**: Optimized for users with fine motor difficulties
- **High Contrast Modes**: Dark and light themes with excellent visibility
- **Smooth Animations**: Customizable animation speeds (200ms - 3000ms)
- **Keyboard Navigation**: Full keyboard accessibility support

### 🧠 **AI-Powered Predictions**

- **Real-time Predictions**: Keys resize based on likelihood of next character
- **External API Integration**: Connects to Cerebras API for intelligent predictions
- **Visual Feedback**: Larger keys for more likely next characters
- **Smooth Transitions**: Animated resizing with customizable easing

### 📚 **Subject-Specific Word Lists**

- **Mathematics**: 50+ math terms (algebra, calculus, geometry, etc.)
- **Chemistry**: 50+ chemistry terms (elements, compounds, reactions, etc.)
- **English**: 50+ literature terms (grammar, literary devices, etc.)
- **Collapsible Navigation**: Subject panel can be hidden/shown as needed
- **Quick Word Insertion**: Click words to add them to your text

### ⌨️ **Enhanced Keyboard Features**

- **QWERTY Layout**: Standard keyboard layout with accessibility enhancements
- **Smart Shift Toggle**: Visual feedback when shift is active (green highlight)
- **Redesigned Delete Key**: Red backspace key positioned next to space bar
- **Proportional Sizing**: Space bar (2/3 width) and backspace (1/3 width)
- **Multi-line Support**: Enter key creates proper line breaks

### 🎨 **Customization Options**

- **Animation Speed Slider**: Adjust key resizing speed (200ms - 3000ms)
- **Theme Toggle**: Switch between dark and light modes
- **Mode Toggle**: Switch between accessible and regular keyboard modes
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 8.19.3+

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd visual.ai.ze
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Production Deployment

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Deploy to Vercel** (recommended)
   - Connect your GitHub repository to Vercel
   - Vercel will automatically deploy on push to main branch

## 🏗️ Project Structure

```
visual.ai.ze/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── AccessibleKeyboard.jsx    # Main keyboard component
│   │   │   ├── AccessibleKeyboard.css    # Keyboard styles
│   │   │   ├── SubjectNavigation.jsx     # Subject panel component
│   │   │   └── SubjectNavigation.css     # Subject panel styles
│   │   ├── pages/
│   │   │   └── Skeleton.jsx              # Main page component
│   │   └── App.jsx                       # App router
│   ├── index.html                        # HTML template
│   └── favicon.png                       # App icon
├── server/                     # Backend server (optional)
│   ├── server.js              # Express server
│   ├── auth.js                # Authentication
│   └── models/                # Database models
├── main.py                     # Python FastAPI backend
├── requirements.txt            # Python dependencies
└── package.json               # Node.js dependencies
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Optional: MongoDB connection for user data
MONGO_SRV=your_mongodb_connection_string

# Optional: Google OAuth (if using authentication)
GOOGLE_CLIENT_ID=your_google_client_id
```

### API Configuration

The keyboard connects to a prediction API. Update the API URL in `AccessibleKeyboard.jsx`:

```javascript
const apiUrl = import.meta.env.DEV
  ? "http://localhost:8000/predict-char" // Development
  : "https://your-api-url.com/predict-char"; // Production
```

## 🎮 Usage

### Basic Typing

1. **Click keys** on the virtual keyboard to type
2. **Use space bar** for spaces
3. **Press backspace** (red key) to delete characters
4. **Press enter** to create new lines

### Accessible Mode

1. **Toggle "Go to Accessible Keyboard"** to enable AI predictions
2. **Keys will resize** based on predicted next characters
3. **Larger keys** indicate higher probability characters
4. **Smooth animations** show the resizing process

### Subject Word Lists

1. **Click the arrow (→)** to open the subject panel
2. **Select a subject** (Math, Chemistry, English)
3. **Click words** to add them to your text
4. **Use arrow buttons** to navigate through word lists

### Customization

1. **Animation Speed**: Use the slider to adjust key resizing speed
2. **Theme**: Toggle between dark and light modes
3. **Shift Key**: Click to activate (turns green), automatically deactivates after typing

## 🔌 API Integration

### Prediction API Format

The keyboard expects predictions in this format:

```json
[
  { "character": "e", "confidence": 0.3 },
  { "character": "a", "confidence": 0.2 },
  { "character": "i", "confidence": 0.15 }
]
```

### Backend Setup (Optional)

If you want to run your own prediction server:

1. **Python FastAPI** (recommended):

   ```bash
   pip install -r requirements.txt
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

2. **Node.js Express**:
   ```bash
   npm start
   ```

## 🎨 Customization

### Adding New Subjects

Edit the `subjectWords` object in `AccessibleKeyboard.jsx`:

```javascript
const subjectWords = {
  yourSubject: {
    name: "Your Subject",
    icon: "🔬",
    words: ["word1", "word2", "word3"],
  },
};
```

### Styling

- **Main styles**: `client/src/components/AccessibleKeyboard.css`
- **Subject panel**: `client/src/components/SubjectNavigation.css`
- **Color scheme**: Update CSS custom properties for theming

### Animation Settings

- **Speed range**: 200ms - 3000ms (adjustable via slider)
- **Easing function**: Cubic ease-out (smooth deceleration)
- **Key resizing**: Height and width animations

## 📱 Responsive Design

The keyboard is optimized for:

- **Desktop**: Full keyboard with all features
- **Tablet**: Touch-optimized with larger keys
- **Mobile**: Compact layout with essential features
- **iPad**: Special optimizations for tablet use

## ♿ Accessibility Features

- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Tab through all interactive elements
- **High Contrast**: Dark/light mode support
- **Large Touch Targets**: Minimum 60px touch areas
- **Focus Indicators**: Clear visual focus states
- **Reduced Motion**: Respects user's motion preferences

## 🚀 Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `client/dist`
4. Deploy automatically on push

### Other Platforms

- **Netlify**: Similar to Vercel setup
- **GitHub Pages**: Use `npm run build` and deploy `client/dist`
- **Render**: Full-stack deployment with both frontend and backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built for accessibility and inclusion
- Designed for users with fine motor impairments
- Inspired by the need for better typing assistance tools
- Special thanks to the accessibility community for feedback

## 📞 Support

For questions or issues:

- Open an issue on GitHub
- Check the documentation above
- Review the code comments for implementation details

---

**Easy Key-Z** - Making typing accessible for everyone! 🎯
