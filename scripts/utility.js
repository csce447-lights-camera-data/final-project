const addCollapseFunctionality = () => {
  const expandBtn = document.querySelector('.expand-btn');

  expandBtn.addEventListener('click', (e) => {
    const clicked = e.target.closest('.expand-btn');
  
    if(!clicked) { return; }
  
    const collapsible = document.querySelector('.collapsible');
    const searchForm = document.querySelector('.search-form');

    // if not expanded, add 'expanded' and remove 'collapsed'
    if(!collapsible.classList.contains('expanded')) {
      collapsible.classList.add('expanded');
      collapsible.classList.remove('collapsed');
    }
    // otherwise, do the reverse
    else {
      collapsible.classList.add('collapsed');
      collapsible.classList.remove('expanded');
    }
    // toggle button class state
    expandBtn.classList.toggle('expand');

    // This just ensures that there aren't any weird spacing issues during/after a transition
    setTimeout(() => {
      collapsible.classList.toggle('hidden');
    }, 100);
  });
};

export { addCollapseFunctionality };
