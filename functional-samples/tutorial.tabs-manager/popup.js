// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const tabs = await chrome.tabs.query({});

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator
const collator = new Intl.Collator();
tabs.sort((a, b) => collator.compare(a.title, b.title));

const template = document.getElementById('li_template');
const elements = new Set();

document.querySelector('.tab-count').textContent = tabs.length;

for (const tab of tabs) {
  const element = template.content.firstElementChild.cloneNode(true);

  element.querySelector('.title').textContent = tab.title;
  element.querySelector('.icon').src = tab.favIconUrl;
  element.querySelector('button').addEventListener('click', async () => {
    await chrome.tabs.remove(tab.id);
    elements.delete(element);
    element.remove();
    document.querySelector('.tab-count').textContent -= 1;
  });

  elements.add(element);
}
document.querySelector('ul').append(...elements);

const button = document.querySelector('button');
button.addEventListener('click', async () => {
  const tabIds = tabs.map(({ id }) => id);
  if (tabIds.length) {
    const group = await chrome.tabs.group({ tabIds });
    await chrome.tabGroups.update(group, { title: 'DOCS' });
  }
});
