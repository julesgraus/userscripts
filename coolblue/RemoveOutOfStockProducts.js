// ==UserScript==
// @name         Remove out of stock products from coolblue
// @namespace    jules
// @version      0.1
// @description  Injects a link at the top of the page, where the result count resides, that you can click to delete all out of stock products
// @author       Jules
// @match        https://www.coolblue.nl/*
// @grant        GM_log
// ==/UserScript==

(function() {
    'use strict';
    let toolName = 'Coolblue out of stock remover: '

    let buttonContainer = '.filtered-search__result-count';

    if(!createToggle(buttonContainer)) return;



    function createToggle(parentSelector) {
        let parentElement = document.querySelector(parentSelector)
        if(!parentSelector) {
            GM_log(toolName + 'Could not find the place in which to inject the toggle button to filter out double products');
            return
        }

        let toggle = document.createElement('a')
        toggle.innerText = 'Remove out of stock products'
        toggle.setAttribute('href', '#')
        parentElement.append(toggle);

        toggle.addEventListener('click', clickedToggle)
    }

    function fetchOutOfStockProducts() {
        return Array.from(document.querySelectorAll('.product-card')).filter((productElement) => {
            let unavailableElement = productElement.querySelector('.text-color--unavailable');
            return !!(unavailableElement && unavailableElement.innerText.trim() !== '')
        })
    }

    function removeElements(elements) {
        elements.forEach((elementToRemove) => {
            if(!elementToRemove.parentElement) return;
            elementToRemove.parentElement.removeChild(elementToRemove);
        })
    }

    function clickedToggle(event) {
        event.preventDefault()
        let elementsToRemove = fetchOutOfStockProducts()
        GM_log(toolName + 'About to remove ' + elementsToRemove.length + ' products from the page because they are out of stock');
        removeElements(elementsToRemove);
        let removedElementsCount = elementsToRemove.length - fetchOutOfStockProducts().length
        GM_log(toolName + 'Removed ' + removedElementsCount + ' from the page');
        alert(''+ removedElementsCount + ' product(s) where removed from the page because they where out of stock')
    }
})();
