# Specification

## Summary
**Goal:** Add playable AI-generated games to the Games category that users can actually play in their browser.

**Planned changes:**
- Implement backend endpoint to generate playable game code (HTML/CSS/JavaScript) from game metadata
- Create library of 5+ game templates (Snake, Pong, Tic-Tac-Toe, Memory Match, Whack-a-Mole, Color Match)
- Update GamePlayer component to render generated games in sandboxed iframe
- Add "Play Now" buttons to game cards for AI-generated playable games
- Implement game state persistence to save scores, levels, and progress between sessions

**User-visible outcome:** Users can click "Play Now" on game cards to play AI-generated browser games like Snake, Pong, and puzzle games, with their scores and progress automatically saved.
