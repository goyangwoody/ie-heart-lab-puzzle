# Card Flip Game

A tablet-friendly card matching game built with React, TypeScript, and Vite. Players must find the one card that has different text from the others, progressing through increasingly difficult levels.

## 🎮 Game Features

- **Progressive Difficulty**: Start with 3×3 grid, progress through 4×4, to 5×5
- **Time Challenge**: 10-second time limit per round
- **Round Timer**: Large, prominent countdown timer display
- **Tablet Optimized**: Touch-friendly interface designed for tablet screens
- **Card Flip Animation**: Cards start face-down and flip to reveal text after countdown
- **Customizable Word Pairs**: Easy-to-edit word pairs in `src/wordPairs.ts`
- **Countdown System**: 3-second countdown before each round
- **Responsive Design**: Works on various screen sizes

## 🚀 Game Flow

1. **Cover Page**: Start screen with "Start" button and best time display
2. **Countdown**: 3-2-1 countdown before each round (timer paused)
3. **Playing**: Grid appears with 10-second time limit, find the different card
4. **Round Win**: Brief success message, then countdown to next level
5. **Game Win**: Final screen showing total time (complete all 3 rounds)
6. **Time Up/Fail**: Time runs out or wrong card selection returns to cover page

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **CSS3** - Modern styling with grid and animations
- **Local Storage** - Best time persistence

## 📱 Future Capacitor Integration

This project is designed to be wrapped with Capacitor for native Android APK distribution:

```bash
# Future Capacitor setup (not included in this build)
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init cardflip-game com.example.cardflip
npx cap add android
npm run build
npx cap copy
npx cap open android
```

## 🎯 Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🎨 Design Features

- **Light Theme**: Clean, minimalist design with light background
- **Card Flip Animation**: 3D flip effect revealing text after countdown
- **Center Timer**: Prominent timer display in the center of the game area
- **Rounded Cards**: White cards with rounded corners and soft shadows
- **Customizable Text**: Easy-to-modify word pairs in separate config file
- **Touch Optimized**: 44px minimum touch targets
- **Smooth Animations**: Hover effects, countdown animations, and transitions

## 🏆 Game Mechanics

### Timer Logic
- **Round Timer**: 10-second countdown per round (large orange display)
- **Visual Feedback**: Timer changes color as time runs out
- **Time Failure**: Round fails if 10 seconds expire

### Round Progression
- Grid sizes: 3×3 → 4×4 → 5×5
- Random odd card placement each round
- 10-second time limit per round
- Correct selection advances to next level
- Wrong selection or timeout restarts from beginning

### Text Variants
- Normal cards: Display the 'normal' text from word pairs
- Different card: Display the 'target' text from word pairs
- **Easy Customization**: Edit `src/wordPairs.ts` to add your own word pairs

## 🛠️ Customizing Word Pairs

To add your own word pairs, edit the `src/wordPairs.ts` file:

```typescript
export const WORD_PAIRS = [
  { normal: "original word", target: "slightly different word" },
  { normal: "another word", target: "another variant" },
  // Add more pairs here...
]
```

## 📱 Tablet Optimization

- Minimum 44px touch targets
- Prevent text selection and callouts
- Optimized font sizes for readability
- Responsive grid layout
- Touch-friendly hover states

## 🔧 Configuration

Key game settings in `App.tsx`:
- `GRID_SIZES`: Array of grid dimensions [3, 4, 5]
- `WIN_ROUND_DELAY`: Delay after correct selection
- Countdown duration: 3 seconds (hardcoded)

## 🎮 Testing Checklist

- ✅ Refresh returns to cover page
- ✅ 3-second countdown before each round
- ✅ Timer excludes countdown time
- ✅ Wrong pick resets to cover
- ✅ Rounds progress through grid sizes
- ✅ Final round shows win screen
- ✅ Cards are tablet-friendly (≥44px)
- ✅ Best time persistence

## 📄 License

MIT License - see LICENSE file for details
