// Фильтрация врачей
document.addEventListener('DOMContentLoaded', function() {
    const doctorCards = document.querySelectorAll('.doctor-card');
    const specialtyFilter = document.getElementById('specialtyFilter');
    const experienceFilter = document.getElementById('experienceFilter');
    const searchInput = document.getElementById('doctorSearch');
    const searchButton = document.getElementById('searchButton');
    
    function filterDoctors() {
        const selectedSpecialty = specialtyFilter.value;
        const selectedExperience = experienceFilter.value;
        const searchQuery = searchInput.value.toLowerCase().trim();
        
        doctorCards.forEach(card => {
            const specialty = card.dataset.specialty;
            const experience = parseInt(card.dataset.experience);
            const doctorName = card.querySelector('h3').textContent.toLowerCase();
            const doctorSpecialty = card.querySelector('.doctor-specialty').textContent.toLowerCase();
            
            let showCard = true;
            
            // Фильтр по специальности
            if (selectedSpecialty !== 'all' && specialty !== selectedSpecialty) {
                showCard = false;
            }
            
            // Фильтр по опыту
            if (selectedExperience !== 'all' && experience < parseInt(selectedExperience)) {
                showCard = false;
            }
            
            // Поиск по имени или специальности
            if (searchQuery && !doctorName.includes(searchQuery) && !doctorSpecialty.includes(searchQuery)) {
                showCard = false;
            }
            
            // Показ/скрытие карточки с анимацией
            if (showCard) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Показать сообщение, если ничего не найдено
        const visibleCards = Array.from(doctorCards).filter(card => card.style.display !== 'none');
        const noResults = document.getElementById('noResults');
        
        if (visibleCards.length === 0) {
            if (!noResults) {
                const noResultsElement = document.createElement('div');
                noResultsElement.id = 'noResults';
                noResultsElement.className = 'no-results';
                noResultsElement.innerHTML = `
                    <i class="fas fa-search"></i>
                    <h3>Врачи не найдены</h3>
                    <p>Попробуйте изменить параметры поиска или выбрать другую специальность</p>
                `;
                document.getElementById('doctorsContainer').appendChild(noResultsElement);
            }
        } else if (noResults) {
            noResults.remove();
        }
    }
    
    // Обработчики событий
    specialtyFilter.addEventListener('change', filterDoctors);
    experienceFilter.addEventListener('change', filterDoctors);
    
    searchButton.addEventListener('click', filterDoctors);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            filterDoctors();
        }
    });
    
    // Дебаунс для поиска
    let search
