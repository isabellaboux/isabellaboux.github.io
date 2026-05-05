---
layout: page
title: Projects
permalink: /projects/
description:
nav: true
nav_order: 2
display_categories: [work, fun]
horizontal: false
project_filters: true
---

<!-- pages/projects.md -->
{% assign all_tags = '' | split: '' %}
{% for project in site.projects %}
  {% if project.tags %}
    {% assign all_tags = all_tags | concat: project.tags %}
  {% endif %}
{% endfor %}
{% assign all_tags = all_tags | uniq | sort %}

<div class="projects">
  {% if all_tags.size > 0 %}
    <div class="project-filters" aria-label="Project tag filters">
      <button class="project-filter-chip is-active" type="button" data-project-filter="all" aria-pressed="true">
        All
      </button>
      {% for tag in all_tags %}
        <button
          class="project-filter-chip"
          type="button"
          data-project-filter="{{ tag | slugify }}"
          aria-pressed="false"
        >
          {{ tag }}
        </button>
      {% endfor %}
    </div>
  {% endif %}

{% if site.enable_project_categories and page.display_categories %}
  <!-- Display categorized projects -->
  {% for category in page.display_categories %}
    <section class="project-category-section" data-project-category-section="{{ category }}">
      <a id="{{ category }}" href=".#{{ category }}">
        <h2 class="category">{{ category }}</h2>
      </a>
      {% assign categorized_projects = site.projects | where: "category", category %}
      {% assign sorted_projects = categorized_projects | sort: "importance" %}
      <!-- Generate cards for each project -->
      {% if page.horizontal %}
        <div class="container">
          <div class="row row-cols-1 row-cols-md-2">
            {% for project in sorted_projects %}
              {% include projects_horizontal.liquid %}
            {% endfor %}
          </div>
        </div>
      {% else %}
        <div class="row row-cols-1 row-cols-md-3">
          {% for project in sorted_projects %}
            {% include projects.liquid %}
          {% endfor %}
        </div>
      {% endif %}
    </section>
  {% endfor %}

{% else %}

  <!-- Display projects without categories -->

  {% assign sorted_projects = site.projects | sort: "importance" %}

  <!-- Generate cards for each project -->

  {% if page.horizontal %}
    <div class="container">
      <div class="row row-cols-1 row-cols-md-2">
        {% for project in sorted_projects %}
          {% include projects_horizontal.liquid %}
        {% endfor %}
      </div>
    </div>
  {% else %}
    <div class="row row-cols-1 row-cols-md-3">
      {% for project in sorted_projects %}
        {% include projects.liquid %}
      {% endfor %}
    </div>
  {% endif %}
{% endif %}
</div>

{% if all_tags.size > 0 %}
  <script>
    (() => {
      const initProjectFilters = () => {
        const filterButtons = Array.from(document.querySelectorAll("[data-project-filter]"));
        const projectCards = Array.from(document.querySelectorAll(".project-card-column"));
        const categorySections = Array.from(document.querySelectorAll("[data-project-category-section]"));

        if (!filterButtons.length || !projectCards.length) {
          return;
        }

        const setActiveFilter = (selectedFilter) => {
          filterButtons.forEach((button) => {
            const isActive = button.dataset.projectFilter === selectedFilter;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", isActive ? "true" : "false");
          });
        };

        const updateCategoryVisibility = () => {
          categorySections.forEach((section) => {
            const visibleCards = section.querySelectorAll(".project-card-column:not(.is-hidden)");
            section.classList.toggle("is-empty", visibleCards.length === 0);
          });
        };

        const applyFilter = (selectedFilter) => {
          projectCards.forEach((card) => {
            const cardTags = (card.dataset.projectTags || "")
              .split("|")
              .map((tag) => tag.trim())
              .filter(Boolean);
            const matchesFilter = selectedFilter === "all" || cardTags.includes(selectedFilter);
            card.classList.toggle("is-hidden", !matchesFilter);
          });

          setActiveFilter(selectedFilter);
          updateCategoryVisibility();
        };

        filterButtons.forEach((button) => {
          button.addEventListener("click", () => {
            applyFilter(button.dataset.projectFilter || "all");
          });
        });

        applyFilter("all");
      };

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initProjectFilters, { once: true });
      } else {
        initProjectFilters();
      }
    })();
  </script>
{% endif %}
