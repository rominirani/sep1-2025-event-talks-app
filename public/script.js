document.addEventListener('DOMContentLoaded', () => {
  const scheduleContainer = document.getElementById('schedule-container');
  const searchBar = document.getElementById('search-bar');
  let talks = [];

  // Fetch talks data from backend
  fetch('/api/talks')
    .then(response => response.json())
    .then(data => {
      talks = data.talks;
      displayTalks(talks);
    });

  // Function to display talks
  function displayTalks(talksToDisplay) {
    scheduleContainer.innerHTML = '';
    let currentTime = new Date('2025-09-01T10:00:00');

    // ✅ If no talks, show friendly message
    if (talksToDisplay.length === 0) {
      const noResultsMessage = document.createElement('p');
      noResultsMessage.classList.add('no-results');
      noResultsMessage.textContent = "No talks found for your search.";
      scheduleContainer.appendChild(noResultsMessage);
      return;
    }

    talksToDisplay.forEach((talk, index) => {
      const startTime = new Date(currentTime);
      const endTime = new Date(startTime.getTime() + talk.duration * 60000);

      const talkElement = document.createElement('div');
      talkElement.classList.add('talk');

      talkElement.innerHTML = `
        <p><strong>${formatTime(startTime)} - ${formatTime(endTime)}</strong></p>
        <h2>${talk.title}</h2>
        <p class="speakers">${talk.speakers.join(', ')}</p>
        <p>${talk.description}</p>
        <div>${talk.category.map(c => `<span class="category">${c}</span>`).join('')}</div>
      `;
      scheduleContainer.appendChild(talkElement);

      currentTime = new Date(endTime.getTime() + 10 * 60000); // 10 minute break

      if (index === 2) { // Lunch break after the 3rd talk
        const lunchBreakElement = document.createElement('div');
        lunchBreakElement.classList.add('break');
        const lunchEndTime = new Date(currentTime.getTime() + 60 * 60000);
        lunchBreakElement.innerHTML = `
          <p><strong>${formatTime(currentTime)} - ${formatTime(lunchEndTime)}</strong></p>
          <h3>Lunch Break</h3>
        `;
        scheduleContainer.appendChild(lunchBreakElement);
        currentTime = lunchEndTime;
      }
    });
  }

  // Format time to hh:mm
  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Search filter
  searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredTalks = talks.filter(talk =>
      talk.title.toLowerCase().includes(searchTerm) ||
      talk.description.toLowerCase().includes(searchTerm) ||
      talk.category.some(c => c.toLowerCase().includes(searchTerm)) ||
      talk.speakers.some(s => s.toLowerCase().includes(searchTerm))
    );
    displayTalks(filteredTalks);
  });
});
