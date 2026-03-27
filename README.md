# Cocktail Sort Visualizer 🍹

**[👉 Click here to view the Live Demo!](https://pankajtiwari-art.github.io/cocktail-sort-visualizer/)**

A visually stunning and interactive web-based sorting algorithm visualizer. This project demonstrates how the **Cocktail Sort** (also known as Bidirectional Bubble Sort) algorithm works step-by-step using smooth animations and real-time sound effects.

## 📖 What is Cocktail Sort?
Cocktail Sort is a smarter version of the classic Bubble Sort. Instead of scanning the array in only one direction, it moves in **both directions** alternately:
1. **Forward Pass (Left to Right):** Finds the largest element and pushes it to the end.
2. **Backward Pass (Right to Left):** Finds the smallest element and pushes it to the beginning.

This back-and-forth movement makes it faster than a normal Bubble Sort and highly satisfying to watch!

## ✨ Features
* **Live Visualization:** Watch the bars physically swap places on the screen.
* **Sound Effects:** Hear the algorithm! The pitch of the sound changes based on the value of the bars being compared or swapped.
* **Full Control:**
  * Adjust the **Array Size** (from 10 to 100 bars).
  * Control the **Speed** (Fast, Medium, Slow).
  * **Pause and Resume** the sorting at any time.
  * Generate a completely new random array with one click.
* **Live Counters:** See the exact number of comparisons and swaps happening in real-time.
* **Direction Tracking:** Shows whether the current pass is moving Forward (→) or Backward (←).
* **Modern UI:** A clean, dark-themed, Apple-inspired interface with glowing effects.

## 🛠️ Tech Stack
This project is built from scratch without any external libraries or frameworks.
* **HTML5** (Structure)
* **CSS3** (Styling, Dark Mode, Animations)
* **Vanilla JavaScript** (Algorithm Logic, DOM Manipulation)
* **Web Audio API** (Generating real-time sound frequencies)

## 🚀 How to Run Locally
Since this is a pure frontend project, no special installation is required.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/pankajtiwari-art/cocktail-sort-visualizer.git](https://github.com/pankajtiwari-art/cocktail-sort-visualizer.git)
2. **Open the project folder.**
3. **Double-click on index.html to run it in any web browser (Chrome, Firefox, Safari, Edge).**

## 🎮 How to Use the App
1. Open the live link or run the app locally.
2. Ensure your device volume is turned up and the Sound Effects box is checked.
3. Adjust the Array Size and Speed sliders to your liking.
4. Click the Start Sorting button.
5. Watch, listen, and learn how Cocktail Sort works!

## 📂 Project Files

* index.html - The main layout and structure.
* style.css - All the beautiful dark theme styles and glowing animations.
* script.js - The brain of the app (sorting algorithm, audio generation, and UI updates).

Created by [Pankaj Tiwari](https://github.com/pankajtiwari-art). If you like this project, feel free to drop a ⭐ on the repository!
