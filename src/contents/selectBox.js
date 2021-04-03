// https://stackoverflow.com/q/11867545/9671542
const isDarkMode = () => {
  const body = document.getElementsByTagName('body')[0];
  const backgroundColor = window.getComputedStyle(body).backgroundColor;
  const [r, g, b] = backgroundColor.slice(4, -1).split(',').map(Number);
  const brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000);
  return brightness < 125;
};

// https://stackoverflow.com/a/27547021/9671542
const selectBox = (id, options, optionsChecked) => {
  let expanded = false;
  let checkedCount = 0;
  const totalCount = options.length;
  const selectHandlers = new Array();
  const handleSelect = () => {
    selectHandlers.forEach(handler => {
      handler();
    });
  };

  const optionsBox = document.createElement('div');
  const selectAllOpt = document.createElement('input');
  selectAllOpt.setAttribute('type', 'checkbox');
  const selectAllOptLabel = document.createElement('label');
  selectAllOptLabel.appendChild(selectAllOpt);
  selectAllOptLabel.appendChild(document.createTextNode('select/deselect all'));
  selectAllOpt.addEventListener('click', (ev) => {
    Array.from(optionsBox.children).slice(2).forEach(elem => {
      const opt = elem.children[0];
      opt.checked = selectAllOpt.checked;
    });
    checkedCount = selectAllOpt.checked ? totalCount : 0;
    handleSelect();
  });
  optionsBox.appendChild(selectAllOptLabel);
  optionsBox.appendChild(document.createElement('hr'));

  selectHandlers.push(() => {
    selectAllOpt.checked = checkedCount === totalCount;
  });

  for (let i = 0; i < options.length; i++) {
    const optName = options[i];
    const checked = optionsChecked[i];
    const opt = document.createElement('input');
    opt.setAttribute('type', 'checkbox');
    opt.setAttribute('value', optName);
    opt.checked = checked;
    if (checked) checkedCount++;
    opt.addEventListener('change', ev => {
      if (opt.checked)
        checkedCount++;
      else
        checkedCount--;
      handleSelect();
    });
    const label = document.createElement('label');
    label.appendChild(opt);
    label.appendChild(document.createTextNode(optName));
    optionsBox.appendChild(label);
  }
  optionsBox.classList.add('multiselect-checkboxes');

  const toggle = () => {
    if (!expanded) {
      optionsBox.style.display = 'block';
      expanded = true;
    } else {
      optionsBox.style.display = 'none';
      expanded = false;
    }
  };

  const multiSelectBox = document.createElement('div');
  const displayOption = document.createElement('option');
  const selectBox = document.createElement('select');
  const overselect = document.createElement('div');
  selectHandlers.push(() => {
    if (checkedCount === totalCount) {
      displayOption.innerText = 'all';
    } else if (checkedCount < 2) {
      displayOption.innerText = checkedCount + ' option chosen';
    } else {
      displayOption.innerText = checkedCount + ' options chosen';
    }
  });
  overselect.classList.add('multiselect-overselect');
  selectBox.appendChild(displayOption);
  multiSelectBox.classList.add('multiselect-box');
  multiSelectBox.appendChild(selectBox);
  multiSelectBox.appendChild(overselect);

  const multiSelectDiv = document.createElement('div');
  multiSelectDiv.setAttribute('id', id);
  multiSelectDiv.classList.add('multiselect');
  multiSelectDiv.appendChild(multiSelectBox);
  multiSelectDiv.appendChild(optionsBox);

  handleSelect();

  document.addEventListener('click', ev => {
    if (multiSelectBox.contains(ev.target) ||
        (expanded && !multiSelectDiv.contains(ev.target)))
      toggle();
  });

  multiSelectDiv.values = () => {
    const arr = new Array();
    Array.from(optionsBox.children).slice(2).forEach(elem => {
      const opt = elem.children[0];
      if (opt.checked) arr.push(opt.value);
    });
    return arr;
  };

  multiSelectDiv.setDarkMode = (darkModeOn) => {
    const divs = [multiSelectBox, selectBox, optionsBox];
    if (darkModeOn) {
      divs.map(elem => {
        elem.classList.add('multiselect-dark');
      });
    } else {
      divs.map(elem => {
        elem.classList.remove('multiselect-dark');
      });
    }
  };

  return multiSelectDiv;
}
