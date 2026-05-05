---
permalink: /assets/js/project-filters.js
---

document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = Array.from(document.querySelectorAll('[data-project-filter]'));
  const projectCards = Array.from(document.querySelectorAll('.project-card-column'));
  const categorySections = Array.from(document.querySelectorAll('[data-project-category-section]'));

  if (!filterButtons.length || !projectCards.length) {
    return;
  }

  const setActiveFilter = (selectedFilter) => {
    filterButtons.forEach((button) => {
      const isActive = button.dataset.projectFilter === selectedFilter;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  };

  const updateCategoryVisibility = () => {
    categorySections.forEach((section) => {
      const visibleCards = section.querySelectorAll('.project-card-column:not(.is-hidden)');
      section.classList.toggle('is-empty', visibleCards.length === 0);
    });
  };

  const applyFilter = (selectedFilter) => {
    projectCards.forEach((card) => {
      const cardTags = (card.dataset.projectTags || '').split('|').filter(Boolean);
      const matchesFilter = selectedFilter === 'all' || cardTags.includes(selectedFilter);
      card.classList.toggle('is-hidden', !matchesFilter);
    });

    setActiveFilter(selectedFilter);
    updateCategoryVisibility();
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      applyFilter(button.dataset.projectFilter || 'all');
    });
  });

  applyFilter('all');
});
