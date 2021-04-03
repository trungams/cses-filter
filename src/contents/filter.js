// import selectBox from './selectBox.js';
const content = document.querySelector('.content');
const topics = new Array();
const problemSet = new Map();
const problemSetURLs = ['/problemset', '/problemset/list'];
let currentTopic = null;
let currentProblems = null;

class Problem {
  constructor(name, solveCount, status, topic, htmlElement) {
    this.name = name;
    this.solveCount = solveCount;
    this.status = status;
    this.topic = topic;
    this.element = htmlElement;
  }
}

const getProblemStatus = (elem) => {
  if (elem.classList.contains('full')) {
    return 'solved';
  } else if (elem.classList.contains('zero')) {
    return 'in progress';
  } else {
    return 'unattempted';
  }
};

for (let i = 0; i < content.children.length; i++) {
  const node = content.children[i];
  if (node.nodeName === 'H2') {
    if (currentProblems !== null) problemSet.set(currentTopic, currentProblems);
    currentTopic = node.innerText;
    if (currentTopic != 'General') {
      topics.push(currentTopic);
      currentProblems = new Array();
    }
  } else if (node.classList.contains('task-list')) {
    if (currentTopic === 'General') continue;
    for (let j = 0; j < node.children.length; j++) {
      const li = node.children[j];
      const name = li.children[0].innerText;
      const solveCount = parseInt(li.children[1].innerText.split()[0]);
      const status = getProblemStatus(li.children[2]);
      const problem = new Problem(name, solveCount, status, currentTopic, li);
      currentProblems.push(problem);
    }
  }
  if (i === content.children.length - 1 && currentProblems !== null) {
    problemSet.set(currentTopic, currentProblems);
  }
}

const filter = (tags, status) => {
  while (content.children.length > 4) content.lastChild.remove();
  tags.forEach((tag) => {
    const taskList = document.createElement('ul');
    taskList.classList.add('task-list');
    const problems = problemSet.get(tag);
    problems.forEach((problem) => {
      if (status.includes(problem.status))
        taskList.appendChild(problem.element);
    });
    if (taskList.children.length > 0) {
      const heading = document.createElement('h2');
      heading.innerText = tag;
      content.appendChild(heading);
      content.appendChild(taskList);
    }
  });
};

const addFilterMenu = () => {
  const topicFilterLabel = document.createElement('label');
  const topicFilter =
      selectBox('topic-filter', topics, Array(topics.length).fill(true));
  topicFilterLabel.innerHTML = '<b>Topics:</b>';
  topicFilterLabel.htmlFor = topicFilter.id;
  topicFilterLabel.classList.add('inline-block');

  const statusFilterLabel = document.createElement('label');
  const options = ['solved', 'unattempted', 'in progress'];
  const statusFilter =
      selectBox('status-filter', options, Array(options.length).fill(true));
  statusFilterLabel.innerHTML = '<b>Status:</b>';
  statusFilterLabel.htmlFor = statusFilter.id;
  statusFilterLabel.classList.add('inline-block');

  const button = document.createElement('button');
  button.innerText = 'Filter';
  button.addEventListener('click', (ev) => {
    filter(topicFilter.values(), statusFilter.values());
  });

  const div = document.createElement('div');
  div.setAttribute('id', 'filter-menu');
  const elems =
      [topicFilterLabel, topicFilter, statusFilterLabel, statusFilter, button];
  for (let i = 0; i < elems.length; i++) {
    if (i > 0) div.appendChild(document.createTextNode(' '));
    div.appendChild(elems[i]);
  }
  content.prepend(div);

  const setDarkMode = () => {
    setTimeout(() => {
      const dark = isDarkMode();
      topicFilter.setDarkMode(dark);
      statusFilter.setDarkMode(dark);
    }, 100);
  };

  setDarkMode();

  const darkModeToggles = [...document.getElementsByTagName('a')].filter(
      elem => elem.pathname.replace(/\/+/g, '/').replace(/\/+$/, '') ===
          '/darkmode');
  darkModeToggles.map(
      elem => elem.addEventListener('click', () => setDarkMode()));
};

const displayStats = () => {
  console.log('to be implemented');
  // TODO
};

cleanURL = location.pathname.replace(/\/+/g, '/').replace(/\/+$/, '');
if (problemSetURLs.includes(cleanURL)) {
  addFilterMenu();
  // displayStats();
}
