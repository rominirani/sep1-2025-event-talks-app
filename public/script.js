
document.addEventListener('DOMContentLoaded', () => {
  const scheduleContainer = document.getElementById('schedule-container');
  const searchBar = document.getElementById('search-bar');
  let talks = [];

  fetch('/api/talks')
    .then(response => response.json())
    .then(data => {
      talks = data.talks;
      displayTalks(talks);
    });

  function displayTalks(talksToDisplay) {
    scheduleContainer.innerHTML = '';
    let currentTime = new Date('2025-09-01T10:00:00');

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
        lunchBreakElement.innerHTML = `<p><strong>${formatTime(currentTime)} - ${formatTime(lunchEndTime)}</strong></p><h3>Lunch Break</h3>`;
        scheduleContainer.appendChild(lunchBreakElement);
        currentTime = lunchEndTime;
      }
    });
  }

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredTalks = talks.filter(talk => 
      talk.category.some(c => c.toLowerCase().includes(searchTerm)) ||
      talk.speakers.some(s => s.toLowerCase().includes(searchTerm))
    );
    displayTalks(filteredTalks);
  });
});
