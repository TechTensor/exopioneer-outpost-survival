# ExoPioneer – Outpost Survival Simulator

**Challenge:** NASA Space Apps Challenge 2026 – *Build a Junior Astronaut Mission Trainer*  
**Project type:** Browser-based educational strategy simulation  
**Technology:** HTML5, CSS3, vanilla JavaScript

## Project overview
ExoPioneer is a small interactive learning game in which a player commands a four-person lunar or Martian outpost for a 30-day mission. The player balances oxygen, water, food, electrical power, radiation protection and habitat integrity while responding to changing mission events.

The project makes mission-planning trade-offs tangible: actions that improve one system consume resources from another, and neglecting maintenance or life support can end the mission.

## How to run
1. Extract the ZIP file.
2. Open `index.html` in a modern browser (Chrome, Edge or Firefox).
3. Select the Moon or Mars, enter a commander name and initialize the mission.
4. Choose one action per day and press **Execute Action & Advance Day**.
5. Survive 30 days to complete the simulation.

No installation, server, account or API key is required. An internet connection is only needed to load the optional Google Fonts; the app otherwise runs locally.

## Main features
- Two selectable scenarios: Lunar Outpost and Mars Habitat.
- Six monitored systems: oxygen, water, food, power, radiation safety and habitat integrity.
- Six mission operations: solar deployment, greenhouse expansion, radiation shelter upgrade, life-support recycling, maintenance and science experiment.
- Daily resource consumption and random operational events.
- Mission log, survival status and science score.
- Win/loss report and restart flow.
- Responsive interface for desktop and mobile.

## Simplified simulation model
The simulation uses illustrative percentage-based resource levels. Each turn represents one mission day. Daily crew consumption reduces oxygen, water, food and energy. Selected upgrades provide ongoing benefits. Random events represent examples of operational uncertainty, such as water leaks, power fluctuations, crop stress, lunar surface incidents and Martian dust storms.

**Important:** This is an educational game model, not a validated spacecraft life-support model. Values and event probabilities are simplified for playability and should not be interpreted as NASA engineering specifications.

## Learning outcomes
Players can explore:
- Why life-support systems need redundancy and maintenance.
- How power generation affects long-duration missions.
- Why food production and water recovery can improve sustainability.
- How radiation protection and environmental hazards influence habitat design.
- Why mission planning involves trade-offs rather than maximizing one resource.

## Project files
- `index.html` – page structure and interface.
- `style.css` – responsive visual design.
- `app.js` – game state, simulation rules, events and mission logic.

## Suggested future improvements
- Add source-linked NASA facts and real mission datasets.
- Add more detailed life-support loops and crew health indicators.
- Add accessibility options and localized content.
- Conduct playtesting with students and gather feedback.

## Acknowledgement
Created as an independent educational prototype inspired by the NASA Space Apps Challenge 2026 challenge brief. ExoPioneer is not an official NASA product and is not endorsed by NASA.
