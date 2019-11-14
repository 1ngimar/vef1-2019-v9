const API_URL = 'https://apis.is/company?name=';

/**
 * Leit að fyrirtækjum á Íslandi gegnum apis.is
 */
const program = (() => {
  let input;
  let results;

  function empty(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function el(name, ...children) {
    const element = document.createElement(name);

    for (let child of children) { /* eslint-disable-line */
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child) {
        element.appendChild(child);
      }
    }

    return element;
  }

  function showMessage(message) {
    empty(results);
    results.appendChild(el('p', message));
  }

  function showResults(item) {
    if (item.length === 0) {
      showMessage('Fyrirtæki er ekki skráð');
      return;
    }
    const [{
      name,
      sn,
      active,
      address,
    }] = item;

    const result = el(
      'dl', el('dt', 'Nafn'),
      el('dd', name),
      el('dt', 'Kennitala'),
      el('dd', sn),
      el('dt', 'active'),
      el('dd', active),
      address ? el('dt', 'Heimilisfang') : null,
      address ? el('dd', address) : null,
    );

    empty(results);
    results.appendChild(result);
  }

  function fetchResults(companies) {
    fetch(`${API_URL}${companies}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Non 200 status');
        }
        return res.json();
      })
      .then((data) => showResults(data.results))
      .catch((error) => {
        console.error('Villa við að sækja gögn', error); /* eslint-disable-line */
        showMessage('Villa við að sækja gögn');
      });
  }

  function formHandler(e) {
    e.preventDefault();

    const companies = input.value;

    if (typeof companies !== 'string' || companies === '') {
      showMessage('Fyrirtæki verður að vera strengur');
    } else {
      fetchResults(companies);
    }
  }

  function init(companies) {
    const form = companies.querySelector('form');
    input = form.querySelector('input');
    results = companies.querySelector('.results');

    companies.addEventListener('search', formHandler);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const companies = document.querySelector('.companies');

  program.init(companies);
});
