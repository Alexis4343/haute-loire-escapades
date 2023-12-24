// Fonction pour fetch la data des balades pour en ajouter facilement
function fetchRides() {
    return Promise.resolve([
      {
        name: "Au départ de Monistrol",
        description: "Arpentez les alentours de monistrol",
        type: "Balade rapide",
        difficulty: "Facile",
        length: 60, // en kilomètre
        start_latitude: 45.283364,
        start_longitude: 4.179279,
        duration: 1,
        image: "images/ride1.jpg"
      },
    ]);
  }

  // Fonction pour afficher les infos des balades
function populateRideDetails(rides) {
    const rideDetailsContainer = document.getElementById("ride-details");
    rideDetailsContainer.innerHTML = ""; // Clear existing content
  
    rides.forEach(ride => {
      const rideCard = document.createElement("div");
      rideCard.classList.add("ride-card");
  
      const imageContainer = document.createElement("div");
      const image = document.createElement("img");
      image.src = ride.image;
      image.alt = ride.name;
      imageContainer.appendChild(image);
  
      const infoContainer = document.createElement("div");
      const nameHeading = document.createElement("h3");
      nameHeading.textContent = ride.name;
  
      const description = document.createElement("p");
      description.textContent = ride.description;
  
      const details = document.createElement("ul");
      const typeItem = document.createElement("li");
      typeItem.textContent = `Type: ${ride.type}`;
      const difficultyItem = document.createElement("li");
      difficultyItem.textContent = `Difficulté: ${ride.difficulty}`;
      const lengthItem = document.createElement("li");
      lengthItem.textContent = `Distance: ${ride.length} km`;
      details.appendChild(typeItem);
      details.appendChild(difficultyItem);
      details.appendChild(lengthItem);
  
      infoContainer.appendChild(nameHeading);
      infoContainer.appendChild(description);
      infoContainer.appendChild(details);
  
      rideCard.appendChild(imageContainer);
      rideCard.appendChild(infoContainer);
  
      rideDetailsContainer.appendChild(rideCard);
    });
  }

  // Fonction pour les point sur la carte
function addMapMarkers(rides) {
    const map = L.map('map').setView([45.05, 3.88], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    rides.forEach(ride => {
      const marker = L.marker([ride.start_latitude, ride.start_longitude]).addTo(map);
      marker.bindPopup(`<h4>${ride.name}</h4><p>${ride.type} - ${ride.difficulty} - ${ride.length} km</p>`);
    });
  }


  // Fonction pour créer le graphique
function createStatisticsChart(rides) {
    const chartContainer = document.getElementById("myChart");
    const ctx = chartContainer.getContext("2d");
  
    const rideCountByDuration = {};
    rides.forEach(ride => {
      const durationRange = ride.duration >= 4 ? "4+" : `${ride.duration}-${ride.duration + 1}`;
      rideCountByDuration[durationRange] = (rideCountByDuration[durationRange] || 0) + 1;
    });
  
    const chartData = {
      labels: Object.keys(rideCountByDuration),
      datasets: [{
        label: "Trajet par durée",
        data: Object.values(rideCountByDuration),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1
      }]
    };
  
    const chart = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

//fonction filtre
  const durationFilter = document.getElementById("duration-filter");

durationFilter.addEventListener("change", function () {
  const selectedDuration = this.value;
  fetchRides().then(rides => {
    populateRideDetails(rides.filter(ride => {
      if (!selectedDuration) return true;
      const durationRange = ride.duration >= 4 ? "4+" : `${ride.duration}-${ride.duration + 1}`;
      return durationRange === selectedDuration;
    }));
    createStatisticsChart(rides.filter(ride => {
      if (!selectedDuration) return true;
      const durationRange = ride.duration >= 4 ? "4+" : `${ride.duration}-${ride.duration + 1}`;
      return durationRange === selectedDuration;
    }));
  });
});

  // execution au chargement de la page
window.addEventListener('load', () => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js';
    script.onload = () => {
      const L = window.L;
  
      fetchRides().then(rides => {
        addMapMarkers(rides);
      });
    };
    document.head.appendChild(script);

    const chartScript = document.createElement('script');
  chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
  chartScript.onload = () => {
    fetchRides().then(rides => createStatisticsChart(rides));
  };
  document.head.appendChild(chartScript);
  
    fetchRides().then(rides => populateRideDetails(rides));
  });
  