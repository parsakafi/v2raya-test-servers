// ==UserScript==
// @name          V2RayA Test Servers
// @description   Add test button for check V2RayA servers
// @namespace     https://openuserjs.org/users/parsa-kafi
// @author        parsa-kafi
// @copyright     2025, Parsa Kafi (https://parsa.ws)
// @updateURL     https://openuserjs.org/meta/parsa-kafi/v2raya-test-servers.meta.js
// @homepageURL   https://github.com/parsakafi/v2raya-test-servers
// @contributionURL https://github.com/parsakafi/v2raya-test-servers
// @supportURL    https://github.com/parsakafi/v2raya-test-servers/issues
// @match         *://192.168.[0-9]{1,3}.[0-9]{1,3}/*
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @version       1.0.1
// @grant         none
// @run-at        document-idle
// @icon          https://www.google.com/s2/favicons?domain=v2raya.org
// @license       GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// ==/UserScript==

const V2rayAPort = 2017; // Default port: 2017
window.addEventListener('load', function () {
  if (parseInt(window.location.port) === V2rayAPort) {
    setTimeout(function () {
      let serverProtocol, paceTimer, paceTime = 0, tabTable;

      console.info('Test button append');
      $('.field-body .right').append('<button class="button field mobile-small test-v2ray-server">Test</button>');

      $('.test-v2ray-server').on('click', function () {
        tabTable = $('.tab-content .tab-item[tabindex="0"] .table-wrapper table');
        tabTable.find('thead th:eq(1)').trigger('click');
        tabTable.find('tbody tr.is-checked').each(function () {
          $(this).find('label.b-checkbox').trigger('click');
        });

        console.info('Server count: ' + tabTable.find('tbody tr').length);
        tabTable.find('tbody tr').each(function () {
          serverProtocol = $(this).find('td[data-label="Protocol"]').text();
          if (!serverProtocol.includes('xhttp') && !serverProtocol.includes('httpupgrade') && !serverProtocol.includes('Telegram')) {
            $(this).find('label.b-checkbox').trigger('click');
          }
        });

        setTimeout(function () {
          window.scrollTo(0, 0);
          let httpTestButton = $('.field-body .field div:first button:eq(1)');
          if (!httpTestButton.hasClass('not-display')) {
            httpTestButton.trigger('click');

            paceTimer = setInterval(function () {
              console.info('Pace time: ' + paceTime++);

              if ($('body').hasClass('pace-done')) {
                tabTable.find('thead th:eq(5)').trigger('click');
                clearInterval(paceTimer);
                paceTime = 0;

                setTimeout(function () {
                  let serverRow = tabTable.find('tbody tr:eq(0)');

                  if (serverRow.find('td[data-label="Latency"] p').hasClass('latency-valid')) {
                    console.info('Best server: ' + serverRow.find('td[data-label="Server Name"]').text());

                    if (serverRow.hasClass('is-connected-not-running')) {
                      runV2ray();
                    } else {
                      serverRow.find('.operate-box button:eq(0)').trigger('click');

                      setTimeout(function () {
                        runV2ray();
                      }, 5000);
                    }
                  }
                }, 1000);
              }
            }, 1000);
          }
        }, 1000);
      });
    }, 1000);
  }
}, false);


function runV2ray() {
  let runButton = $('.navbar-brand div.navbar-item:eq(0) > span');
  if (runButton.text().trim() === 'Ready') {
    runButton.trigger('click');
  }
}